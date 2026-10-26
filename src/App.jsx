import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import SongList from './components/SongList';
import StageView from './components/StageView';
import ConverterModal from './components/ConverterModal';
import AddSongModal from './components/AddSongModal';
import { fetchSongs, addSongToDatabase, subscribeToSongs } from './services/songService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);

  // Mengambil data awal dan mengaktifkan real-time listener apabila pengguna log masuk
  useEffect(() => {
    if (currentUser) {
      // Fetch lagu kali pertama
      fetchSongs().then((data) => {
        setSongs(data);
        setLoading(false);
      });

      // Aktifkan langganan real-time
      const unsubscribe = subscribeToSongs((updatedSongs) => {
        setSongs(updatedSongs);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  // Pengendali untuk menambah lagu baru
  const handleAddSong = async (newSong) => {
    try {
      await addSongToDatabase(newSong, currentUser.name);
      setShowAddModal(false);
    } catch (err) {
      alert("Gagal menyimpan lagu ke dalam pangkalan data.");
    }
  };

  // Paparan modal log masuk jika pengguna belum log masuk
  if (!currentUser) {
    return <LoginModal onLogin={setCurrentUser} />;
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