import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Undo, Trash2, Pen, Palette, Type } from 'lucide-react';
import { createWorker } from 'tesseract.js';

interface HandwritingCanvasProps {
  onSave?: (imageData: string) => void;
  onConvertToText?: (text: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function HandwritingCanvas({
  onSave,
  onConvertToText,
  width = 800,
  height = 600,
  className = ''
}: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2c2c2c');
  const [penSize, setPenSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);

  // Store drawing history for undo functionality (limited to prevent memory issues)
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const MAX_HISTORY = 10; // Limit history to prevent memory issues

  // OCR processing state
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const colors = [
    '#2c2c2c', // Black
    '#4a5568', // Dark Gray
    '#718096', // Medium Gray
    '#e53e3e', // Red
    '#3182ce', // Blue
    '#38a169', // Green
    '#d69e2e', // Yellow
    '#805ad5', // Purple
    '#dd6b20', // Orange
    '#319795', // Teal
  ];

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      setDrawingHistory(prev => {
        const newHistory = prev.slice(0, historyStep + 1);

        // Limit history size to prevent memory issues
        if (newHistory.length >= MAX_HISTORY) {
          newHistory.shift(); // Remove oldest entry
        }

        newHistory.push(imageData);
        return newHistory;
      });

      setHistoryStep(prev => {
        const newStep = prev + 1;
        return Math.min(newStep, MAX_HISTORY - 1);
      });
    } catch (error) {
      console.error('Failed to save drawing history:', error);
      // Reset history on error
      setDrawingHistory([]);
      setHistoryStep(-1);
    }
  }, [historyStep, MAX_HISTORY]);

  const undo = () => {
    setHistoryStep(prev => {
      if (prev > 0) {
        const canvas = canvasRef.current;
        if (!canvas) return prev;

        const ctx = canvas.getContext('2d');
        if (!ctx) return prev;

        const newStep = prev - 1;
        ctx.putImageData(drawingHistory[newStep], 0, 0);
        return newStep;
      }
      return prev;
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'handwritten-lyrics.png';
    link.href = canvas.toDataURL();
    link.click();

    if (onSave) {
      onSave(canvas.toDataURL());
    }
  };

  const convertToText = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !onConvertToText) return;

    setIsProcessingOCR(true);

    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(canvas);
      await worker.terminate();

      // Clean up the text (remove extra whitespace, fix common OCR errors)
      const cleanedText = text
        .trim()
        .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
        .replace(/\s+/g, ' ') // Normalize spaces
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      onConvertToText(cleanedText);
    } catch (error) {
      console.error('OCR Error:', error);
      onConvertToText('Sorry, couldn\'t convert handwriting to text. Please try writing more clearly.');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('🎨 Start drawing called');
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas not found');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('❌ Canvas context not available');
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log('📍 Mouse coords:', e.clientX, e.clientY, 'Canvas rect:', rect, 'Calculated:', x, y);

      // Validate coordinates
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        console.log('❌ Coordinates out of bounds:', x, y, 'Canvas size:', canvas.width, canvas.height);
        return;
      }

      // Set up drawing context
      ctx.strokeStyle = isEraser ? 'white' : penColor;
      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      console.log('🎨 Starting path at:', x, y, 'Color:', penColor, 'Size:', penSize);

      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      console.log('✅ Drawing started');
    } catch (error) {
      console.error('❌ Error starting drawing:', error);
      setIsDrawing(false);
    }
  }, [isEraser, penColor, penSize]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log('❌ Canvas not found in draw');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('❌ Canvas context not available in draw');
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log('✏️ Drawing to:', x, y);

      // Validate coordinates are within canvas bounds
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        console.log('❌ Draw coordinates out of bounds');
        return;
      }

      // Update stroke style in case it changed
      ctx.strokeStyle = isEraser ? 'white' : penColor;
      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.lineTo(x, y);
      ctx.stroke();
      console.log('✅ Stroke applied');
    } catch (error) {
      console.error('❌ Drawing error:', error);
      setIsDrawing(false);
    }
  }, [isDrawing, isEraser, penColor, penSize]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      // Only save to history if there was actual drawing (prevent excessive saves)
      setTimeout(() => saveToHistory(), 50); // Small delay to prevent rapid saves
    }
    setIsDrawing(false);
  }, [isDrawing, saveToHistory]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas 2D context not available');
      return;
    }

    // Set canvas size (simple approach for now)
    canvas.width = width;
    canvas.height = height;

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Set initial drawing properties
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Initial history save
    saveToHistory();

    // Cleanup function to prevent memory leaks
    return () => {
      // Don't set state in cleanup to prevent re-renders
    };
  }, [width, height]);

  // No need for additional DOM event listeners - React handlers are sufficient

  // Periodic cleanup to prevent memory buildup
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setDrawingHistory(prev => {
        if (prev.length > MAX_HISTORY) {
          return prev.slice(-MAX_HISTORY);
        }
        return prev;
      });
    }, 30000); // Clean up every 30 seconds

    return () => clearInterval(cleanupInterval);
  }, [MAX_HISTORY]);

  return (
    <div className={`handwriting-canvas ${className}`}>
      {/* Debug Info */}
      <div style={{
        padding: '8px',
        background: '#f0f0f0',
        marginBottom: '10px',
        fontSize: '12px',
        border: '1px solid #ccc'
      }}>
        Debug: Drawing={isDrawing ? 'TRUE' : 'FALSE'} |
        Canvas Size: {width}x{height} |
        Pen: {penColor} ({penSize}px) |
        Eraser: {isEraser ? 'ON' : 'OFF'}
      </div>

      {/* Toolbar */}
      <div className="canvas-toolbar">
        <div className="pen-controls">
          <div className="tool-group">
            <button
              className={`tool-btn ${!isEraser ? 'active' : ''}`}
              onClick={() => setIsEraser(false)}
              title="Pen"
            >
              <Pen size={16} />
            </button>
            <button
              className={`tool-btn ${isEraser ? 'active' : ''}`}
              onClick={() => setIsEraser(true)}
              title="Eraser"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="tool-group">
            <label className="size-control">
              <span>Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={penSize}
                onChange={(e) => setPenSize(Number(e.target.value))}
              />
              <span>{penSize}px</span>
            </label>
          </div>

          <div className="tool-group">
            <div className="color-palette">
              <Palette size={16} />
              <div className="colors">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${penColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setPenColor(color)}
                    title={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="action-controls">
          <button className="btn-secondary" onClick={undo} disabled={historyStep <= 0}>
            <Undo size={16} />
            Undo
          </button>
          <button className="btn-secondary" onClick={clearCanvas}>
            <Trash2 size={16} />
            Clear
          </button>
          {onConvertToText && (
            <button
              className="btn-secondary"
              onClick={convertToText}
              disabled={isProcessingOCR}
            >
              <Type size={16} />
              {isProcessingOCR ? 'Converting...' : 'To Text'}
            </button>
          )}
          <button className="btn-primary" onClick={exportAsImage}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={(e) => console.log('🖱️ Canvas clicked at:', e.clientX, e.clientY)}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
            } as React.MouseEvent<HTMLCanvasElement>;
            startDrawing(mouseEvent);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
            } as React.MouseEvent<HTMLCanvasElement>;
            draw(mouseEvent);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDrawing();
          }}
          style={{
            cursor: isEraser ? 'crosshair' : 'crosshair',
            backgroundColor: 'white',
            border: '1px solid #ccc'
          }}
        />
        <div className="canvas-overlay">
          <div className="canvas-guide">
            Write your lyrics here with your mouse, stylus, or finger...
          </div>
        </div>
      </div>
    </div>
  );
}
