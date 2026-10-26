import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import SongList from './components/SongList';
import StageView from './components/StageView';
import ConverterModal from './components/ConverterModal';
import AddSongModal from './components/AddSongModal';
import { fetchSongs, addSongToDatabase, subscribeToSongs } from './services/songService';

export default function App() {
  // Ambil user dari localStorage agar tidak minta login terus saat refresh
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('band_hub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);

  // Simpan data login ke localStorage
  const handleLogin = (userData) => {
    localStorage.setItem('band_hub_user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  useEffect(() => {
    if (currentUser) {
      fetchSongs().then((data) => {
        setSongs(data);
        setLoading(false);
      });

      const unsubscribe = subscribeToSongs((updatedSongs) => {
        setSongs(updatedSongs);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleAddSong = async (newSong) => {
    try {
      await addSongToDatabase(newSong, currentUser.name);
      setShowAddModal(false);
    } catch (err) {
      alert("Gagal menyimpan lagu ke pangkalan data.");
    }
  };

  if (!currentUser) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-md mx-auto relative shadow-2xl border-x border-slate-800/50">
      <Header
        currentUser={currentUser}
        onOpenConverter={() => setShowConverterModal(true)}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-8 text-amber-400 font-semibold text-sm animate-pulse">
          Memuatkan lagu dari Supabase...
        </div>
      ) : !selectedSong ? (
        <SongList
          songs={songs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectSong={setSelectedSong}
          onOpenAddModal={() => setShowAddModal(true)}
        />
      ) : (
        <StageView
          song={selectedSong}
          onBack={() => setSelectedSong(null)}
        />
      )}

      {showConverterModal && (
        <ConverterModal onClose={() => setShowConverterModal(false)} />
      )}

      {showAddModal && (
        <AddSongModal
          onClose={() => setShowAddModal(false)}
          onAddSong={handleAddSong}
        />
      )}
    </div>
  );
}