import React from 'react';
import type { Song } from '../types';
import { deleteSong } from '../utils/storage';
import { Edit, Trash2, FileText, Calendar } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onNewSong: () => void;
  selectedSongId?: string;
}

export function SongList({ songs, onSelectSong, onNewSong, selectedSongId }: SongListProps) {
  const handleDeleteSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this song?')) {
      deleteSong(songId);
      window.location.reload(); // Simple refresh to update the list
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getSectionCount = (song: Song) => {
    return song.sections.length;
  };

  const getWordCount = (song: Song) => {
    return song.sections.reduce((total, section) => {
      return total + section.lyrics.trim().split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
  };

  return (
    <div className="song-list">
      <div className="song-list-header">
        <h2>Your Songs</h2>
        <button onClick={onNewSong} className="btn-primary">
          <FileText size={16} />
          New Song
        </button>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No songs yet</h3>
          <p>Start by creating your first song!</p>
          <button onClick={onNewSong} className="btn-primary">
            Create Your First Song
          </button>
        </div>
      ) : (
        <div className="songs-grid">
          {songs
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map(song => (
              <div
                key={song.id}
                className={`song-card ${selectedSongId === song.id ? 'selected' : ''}`}
                onClick={() => onSelectSong(song)}
              >
                <div className="song-card-header">
                  <h3 className="song-title">{song.title || 'Untitled'}</h3>
                  <div className="song-actions">
                    <button
                      onClick={(e) => handleDeleteSong(song.id, e)}
                      className="btn-icon btn-danger"
                      title="Delete song"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="song-meta">
                  {song.artist && <span className="song-artist">by {song.artist}</span>}
                  {song.genre && <span className="song-genre">{song.genre}</span>}
                </div>

                <div className="song-stats">
                  <span className="stat">
                    <FileText size={14} />
                    {getSectionCount(song)} sections
                  </span>
                  <span className="stat">
                    <Edit size={14} />
                    {getWordCount(song)} words
                  </span>
                  <span className="stat">
                    <Calendar size={14} />
                    {formatDate(song.updatedAt)}
                  </span>
                </div>

                <div className="song-preview">
                  {song.sections.length > 0 && (
                    <div className="section-preview">
                      <strong>{song.sections[0].type.toUpperCase()}:</strong>
                      <p>{song.sections[0].lyrics.slice(0, 100)}{song.sections[0].lyrics.length > 100 ? '...' : ''}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

