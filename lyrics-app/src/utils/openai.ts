// API base URL - will be set to Railway backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface LyricGenerationOptions {
  theme?: string;
  style?: string;
  mood?: string;
  sectionType?: string;
  existingLyrics?: string;
  length?: 'short' | 'medium' | 'long';
}

export async function generateLyrics(options: LyricGenerationOptions): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-lyrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.lyrics || 'Unable to generate lyrics at this time.';
  } catch (error) {
    console.error('Error generating lyrics:', error);
    return 'Sorry, I couldn\'t generate lyrics right now. Please try again.';
  }
}

export async function getLyricSuggestions(existingLyrics: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ existingLyrics }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.suggestions || ['Unable to generate suggestions at this time.'];
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return ['Unable to generate suggestions at this time.'];
  }
}

