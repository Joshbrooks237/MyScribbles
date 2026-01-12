import { useState, useEffect } from 'react';
import type { Song, SongSection, SectionType } from '../types';
import { SONG_TEMPLATES } from '../types';
import { generateLyrics, getLyricSuggestions } from '../utils/openai';
import type { LyricGenerationOptions } from '../utils/openai';
import { saveSong } from '../utils/storage';
import { HandwritingCanvas } from './HandwritingCanvas';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Wand2, Lightbulb, Save, Download, Trash2, Pen, Type } from 'lucide-react';

interface SongEditorProps {
  song: Song | null;
  onSave: (song: Song) => void;
  onNewSong: () => void;
}

export function SongEditor({ song, onSave, onNewSong }: SongEditorProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(song);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState<string[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [handwritingMode, setHandwritingMode] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    setCurrentSong(song);
  }, [song]);

  const createNewSong = (templateId?: string) => {
    const template = templateId ? SONG_TEMPLATES.find(t => t.id === templateId) : SONG_TEMPLATES.find(t => t.id === 'blank');

    const newSong: Song = {
      id: uuidv4(),
      title: 'Untitled Song',
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: template?.structure.map((type, index) => ({
        id: uuidv4(),
        type,
        lyrics: '',
        order: index
      })) || []
    };

    setCurrentSong(newSong);
    onNewSong();
  };

  const updateSong = (updates: Partial<Song>) => {
    if (!currentSong) return;

    const updatedSong = { ...currentSong, ...updates, updatedAt: new Date() };
    setCurrentSong(updatedSong);
  };

  const updateSection = (sectionId: string, updates: Partial<SongSection>) => {
    if (!currentSong) return;

    const updatedSections = currentSong.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    updateSong({ sections: updatedSections });
  };

  const addSection = (type: SectionType) => {
    if (!currentSong) return;

    const newSection: SongSection = {
      id: uuidv4(),
      type,
      lyrics: '',
      order: currentSong.sections.length
    };

    updateSong({ sections: [...currentSong.sections, newSection] });
  };

  const removeSection = (sectionId: string) => {
    if (!currentSong) return;

    const updatedSections = currentSong.sections
      .filter(section => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));

    updateSong({ sections: updatedSections });
  };

  const generateLyricsForSection = async (sectionId: string) => {
    if (!currentSong) return;

    const section = currentSong.sections.find(s => s.id === sectionId);
    if (!section) return;

    setIsGenerating(true);
    try {
      const options: LyricGenerationOptions = {
        sectionType: section.type,
        theme: currentSong.genre,
        existingLyrics: currentSong.sections
          .filter(s => s.id !== sectionId && s.lyrics.trim())
          .map(s => s.lyrics)
          .join(' ')
          .slice(0, 200)
      };

      const generatedLyrics = await generateLyrics(options);
      updateSection(sectionId, { lyrics: generatedLyrics });
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSuggestionsForSection = async (sectionId: string) => {
    if (!currentSong) return;

    const section = currentSong.sections.find(s => s.id === sectionId);
    if (!section || !section.lyrics.trim()) return;

    try {
      const suggestions = await getLyricSuggestions(section.lyrics);
      setShowSuggestions(suggestions);
      setSelectedSectionId(sectionId);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (!selectedSectionId) return;

    updateSection(selectedSectionId, { lyrics: suggestion });
    setShowSuggestions([]);
    setSelectedSectionId(null);
  };

  const handleSave = () => {
    if (currentSong) {
      saveSong(currentSong);
      onSave(currentSong);
    }
  };

  const convertHandwritingToText = (sectionId: string, text: string) => {
    updateSection(sectionId, { lyrics: text });
    // Switch back to text mode after conversion
    setHandwritingMode(prev => ({ ...prev, [sectionId]: false }));
  };

  const exportToText = () => {
    if (!currentSong) return;

    const sections = currentSong.sections
      .sort((a, b) => a.order - b.order)
      .map(section => `[${section.type.toUpperCase()}]\n${section.lyrics}`)
      .join('\n\n');

    const content = `${currentSong.title}\n${currentSong.artist ? `by ${currentSong.artist}\n` : ''}\n${sections}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSong.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentSong) {
    return (
      <div className="welcome-screen">
        <h1>🎵 MyScribbles</h1>
        <p>Start creating your next hit song!</p>

        <div className="templates">
          <h2>Choose a template:</h2>
          <div className="template-grid">
            {SONG_TEMPLATES.map(template => (
              <button
                key={template.id}
                className="template-card"
                onClick={() => createNewSong(template.id)}
              >
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="song-editor">
      <div className="song-header">
        <div className="song-info">
          <input
            type="text"
            value={currentSong.title}
            onChange={(e) => updateSong({ title: e.target.value })}
            placeholder="Song Title"
            className="song-title-input"
          />
          <input
            type="text"
            value={currentSong.artist || ''}
            onChange={(e) => updateSong({ artist: e.target.value })}
            placeholder="Artist Name"
            className="song-artist-input"
          />
          <input
            type="text"
            value={currentSong.genre || ''}
            onChange={(e) => updateSong({ genre: e.target.value })}
            placeholder="Genre"
            className="song-genre-input"
          />
        </div>

        <div className="song-actions">
          <button onClick={handleSave} className="btn-primary">
            <Save size={16} />
            Save
          </button>
          <button onClick={exportToText} className="btn-secondary">
            <Download size={16} />
            Export
          </button>
          <button onClick={() => setCurrentSong(null)} className="btn-secondary">
            New Song
          </button>
        </div>
      </div>

      <div className="sections-container">
        {currentSong.sections
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <div key={section.id} className="section-card">
              <div className="section-header">
                <h3 className="section-type">{section.type.toUpperCase()}</h3>
                <div className="section-actions">
                  <div className="mode-tabs">
                    <button
                      className={`mode-tab ${!handwritingMode[section.id] ? 'active' : ''}`}
                      onClick={() => setHandwritingMode(prev => ({ ...prev, [section.id]: false }))}
                      title="Text mode"
                    >
                      <Type size={14} />
                    </button>
                    <button
                      className={`mode-tab ${handwritingMode[section.id] ? 'active' : ''}`}
                      onClick={() => setHandwritingMode(prev => ({ ...prev, [section.id]: true }))}
                      title="Handwriting mode"
                    >
                      <Pen size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => generateLyricsForSection(section.id)}
                    disabled={isGenerating}
                    className="btn-icon"
                    title="Generate lyrics with AI"
                  >
                    <Wand2 size={16} />
                  </button>
                  <button
                    onClick={() => getSuggestionsForSection(section.id)}
                    className="btn-icon"
                    title="Get suggestions"
                  >
                    <Lightbulb size={16} />
                  </button>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="btn-icon btn-danger"
                    title="Remove section"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {handwritingMode[section.id] ? (
                <div className="handwriting-section">
                  <HandwritingCanvas
                    width={600}
                    height={300}
                    onSave={(imageData) => {
                      // Could save the image data to the section if needed
                      console.log('Handwritten lyrics saved:', imageData);
                    }}
                    onConvertToText={(text) => convertHandwritingToText(section.id, text)}
                  />
                  <div className="handwriting-note">
                    💡 Tip: Use your mouse or stylus to write naturally. Click "To Text" to convert your handwriting to typed lyrics!
                  </div>
                </div>
              ) : (
                <textarea
                  value={section.lyrics}
                  onChange={(e) => updateSection(section.id, { lyrics: e.target.value })}
                  placeholder={`Write your ${section.type} lyrics here...`}
                  className="lyrics-textarea"
                  rows={6}
                />
              )}
            </div>
          ))}
      </div>

      <div className="add-section">
        <h3>Add Section:</h3>
        <div className="section-buttons">
          {(['verse', 'chorus', 'bridge', 'intro', 'outro', 'pre-chorus', 'hook'] as SectionType[]).map(type => (
            <button
              key={type}
              onClick={() => addSection(type)}
              className="btn-secondary"
            >
              <Plus size={16} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {showSuggestions.length > 0 && (
        <div className="suggestions-modal">
          <div className="suggestions-content">
            <h3>Suggestions:</h3>
            {showSuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <p>{suggestion}</p>
                <button onClick={() => applySuggestion(suggestion)} className="btn-primary">
                  Use This
                </button>
              </div>
            ))}
            <button onClick={() => setShowSuggestions([])} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
