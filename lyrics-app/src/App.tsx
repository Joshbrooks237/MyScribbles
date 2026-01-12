import { useState, useEffect } from 'react';
import type { Song } from './types';
import { getAllSongs } from './utils/storage';
import { SongEditor } from './components/SongEditor';
import { SongList } from './components/SongList';
import { TipJar } from './components/TipJar';
import { Music, List, Heart, Coffee } from 'lucide-react';
import './App.css';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [view, setView] = useState<'editor' | 'list'>('list');
  const [showTipJar, setShowTipJar] = useState(false);

  useEffect(() => {
    const loadedSongs = getAllSongs();
    setSongs(loadedSongs);
  }, []);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setView('editor');
  };

  const handleNewSong = () => {
    setSelectedSong(null);
    setView('editor');
  };

  const handleSaveSong = (song: Song) => {
    const updatedSongs = songs.filter(s => s.id !== song.id);
    setSongs([...updatedSongs, song]);
  };


  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Music size={24} />
            <h1>MyScribbles</h1>
          </div>

          <nav className="nav-tabs">
            <button
              className={`nav-tab ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={16} />
              My Songs
            </button>
            <button
              className={`nav-tab ${view === 'editor' ? 'active' : ''}`}
              onClick={handleNewSong}
            >
              <Music size={16} />
              Write Lyrics
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {view === 'list' ? (
          <SongList
            songs={songs}
            onSelectSong={handleSelectSong}
            onNewSong={handleNewSong}
            selectedSongId={selectedSong?.id}
          />
        ) : (
          <SongEditor
            song={selectedSong}
            onSave={handleSaveSong}
            onNewSong={handleNewSong}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>🎵 Share your songs with the world, just like whales sharing songs across the ocean! 🌊</p>
        <button 
          className="tip-button"
          onClick={() => setShowTipJar(true)}
        >
          <Coffee size={18} />
          <span>Support MyScribbles</span>
          <Heart size={14} className="heart-icon" />
        </button>
      </footer>

      <TipJar isOpen={showTipJar} onClose={() => setShowTipJar(false)} />
    </div>
  );
}

export default App;
