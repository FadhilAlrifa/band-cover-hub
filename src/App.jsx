import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SongList from './components/SongList';
import StageView from './components/StageView';
import ConverterModal from './components/ConverterModal';

// Import fungsi helper langsung dari songService
import { getSongs, addSong } from './services/songService';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const data = await getSongs();
      setSongs(data || []);
    } catch (err) {
      console.error('Gagal mengambil data lagu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSong = async (newSongData) => {
    try {
      const createdSong = await addSong(newSongData);
      if (createdSong) {
        setSongs((prev) => [createdSong, ...prev]);
      }
    } catch (err) {
      alert('Gagal menambah lagu ke database.');
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    setSongs((prev) => prev.filter((s) => s.id !== deletedId));
    if (selectedSong && selectedSong.id === deletedId) {
      setSelectedSong(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Header onOpenConverter={() => setIsConverterOpen(true)} />

      <main className="flex-1 overflow-hidden relative flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Memuat daftar lagu...
          </div>
        ) : selectedSong ? (
          <StageView
            song={selectedSong}
            onBack={() => {
              setSelectedSong(null);
              fetchSongs();
            }}
          />
        ) : (
          <SongList
            songs={songs}
            onSelectSong={(song) => setSelectedSong(song)}
            onDeleteSuccess={handleDeleteSuccess}
            onAddSong={handleAddSong}
            onOpenConverter={() => setIsConverterOpen(true)}
          />
        )}
      </main>

      <ConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </div>
  );
}