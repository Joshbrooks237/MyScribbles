const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate lyrics endpoint
app.post('/api/generate-lyrics', async (req, res) => {
  try {
    const {
      theme = '',
      style = '',
      mood = '',
      sectionType = 'verse',
      existingLyrics = '',
      length = 'medium'
    } = req.body;

    let lengthInstruction = '';
    switch (length) {
      case 'short':
        lengthInstruction = 'Write 2-4 lines of lyrics.';
        break;
      case 'medium':
        lengthInstruction = 'Write 4-8 lines of lyrics.';
        break;
      case 'long':
        lengthInstruction = 'Write 8-12 lines of lyrics.';
        break;
    }

    const systemPrompt = `You are a creative songwriter assistant. Generate original, engaging lyrics that fit the requested parameters. Make the lyrics poetic, rhythmic, and emotionally resonant. Focus on storytelling and vivid imagery.`;

    const userPrompt = `Generate ${sectionType} lyrics${theme ? ` with theme: ${theme}` : ''}${style ? ` in style: ${style}` : ''}${mood ? ` with mood: ${mood}` : ''}.

${lengthInstruction}

${existingLyrics ? `Reference existing lyrics for consistency: "${existingLyrics}"` : ''}

Make it original and creative. Focus on rhythm and flow.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const generatedLyrics = completion.choices[0]?.message?.content?.trim() || 'Unable to generate lyrics at this time.';

    res.json({ lyrics: generatedLyrics });
  } catch (error) {
    console.error('Error generating lyrics:', error);
    res.status(500).json({
      error: 'Failed to generate lyrics',
      message: error.message
    });
  }
});

// Get lyric suggestions endpoint
app.post('/api/get-suggestions', async (req, res) => {
  try {
    const { existingLyrics } = req.body;

    if (!existingLyrics || !existingLyrics.trim()) {
      return res.status(400).json({ error: 'Existing lyrics are required' });
    }

    const prompt = `Based on these lyrics: "${existingLyrics}"

Suggest 3 alternative wordings or lines that could fit in the same context. Each suggestion should be 1-2 lines long and maintain the same tone and rhythm.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a lyric writing assistant. Provide creative, rhythmic alternatives.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0]?.message?.content?.split('\n').filter(line => line.trim()) || [];
    const filteredSuggestions = suggestions.slice(0, 3);

    res.json({ suggestions: filteredSuggestions });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`MyScribbles API server running on port ${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
});
