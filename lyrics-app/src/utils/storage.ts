import type { Song } from '../types';

const STORAGE_KEY = 'lyrics-app-songs';

export function saveSong(song: Song): void {
  try {
    const songs = getAllSongs();
    const existingIndex = songs.findIndex(s => s.id === song.id);

    if (existingIndex >= 0) {
      songs[existingIndex] = { ...song, updatedAt: new Date() };
    } else {
      songs.push(song);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (error) {
    console.error('Error saving song:', error);
  }
}

export function getAllSongs(): Song[] {
  try {
    const songsJson = localStorage.getItem(STORAGE_KEY);
    if (!songsJson) return [];

    const songs = JSON.parse(songsJson);
    return songs.map((song: any) => ({
      ...song,
      createdAt: new Date(song.createdAt),
      updatedAt: new Date(song.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading songs:', error);
    return [];
  }
}

export function getSongById(id: string): Song | null {
  const songs = getAllSongs();
  return songs.find(song => song.id === id) || null;
}

export function deleteSong(id: string): void {
  try {
    const songs = getAllSongs().filter(song => song.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (error) {
    console.error('Error deleting song:', error);
  }
}

export function exportSong(song: Song): string {
  const sections = song.sections
    .sort((a, b) => a.order - b.order)
    .map(section => `[${section.type.toUpperCase()}${section.title ? ` - ${section.title}` : ''}]\n${section.lyrics}`)
    .join('\n\n');

  return `${song.title}${song.artist ? ` by ${song.artist}` : ''}\n${song.genre ? `Genre: ${song.genre}` : ''}\n\n${sections}`;
}

