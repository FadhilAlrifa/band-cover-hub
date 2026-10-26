import React, { useState } from 'react';
import { Search, Plus, Music, CheckCircle2, Bookmark, Sparkles } from 'lucide-react';
import SongCard from './SongCard';

export default function SongList({
  songs,
  onSelectSong,
  onDeleteSuccess,
  onAddSong,
  onOpenConverter
}) {
  const [activeTab, setActiveTab] = useState('wishlist'); // 'wishlist' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State Form Tambah Lagu
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newKey, setNewKey] = useState('C');
  const [newBpm, setNewBpm] = useState('');
  const [newLyrics, setNewLyrics] = useState('');

  // Filter Lagu Berdasarkan Tab & Pencarian
  const filteredSongs = songs.filter((song) => {
    const matchesTab = song.status === activeTab;
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newLyrics) {
      alert('Judul dan Lirik wajib diisi!');
      return;
    }

    const songData = {
      title: newTitle,
      artist: newArtist || 'Unknown Artist',
      key: newKey,
      bpm: newBpm ? parseInt(newBpm) : null,
      lyrics: newLyrics,
      status: 'wishlist'
    };

    if (onAddSong) {
      onAddSong(songData);
    }

    // Reset Form
    setNewTitle('');
    setNewArtist('');
    setNewKey('C');
    setNewBpm('');
    setNewLyrics('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 md:p-6 overflow-y-auto space-y-5">
      
      {/* Top Console: Search & Add Button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lagu atau artis..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 rounded-2xl font-black shadow-neon-amber hover:brightness-110 active:scale-95 transition-all shrink-0"
          title="Tambah Lagu"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center p-1 bg-slate-900 border border-slate-800/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'wishlist'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Wishlist Cover</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'completed'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Sudah Dicover</span>
        </button>
      </div>

      {/* List Song Cards */}
      <div className="space-y-3 flex-1 pb-10">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onSelectSong={onSelectSong}
              onDeleteSuccess={onDeleteSuccess}
            />
          ))
        ) : (
          <div className="text-center py-16 text-slate-600 space-y-2">
            <Music className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-medium">Tidak ada lagu ditemukan.</p>
          </div>
        )}
      </div>

      {/* Modal Tambah Lagu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Tambah Lagu Baru</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Judul Lagu *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Munajat Cinta"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Nama Artis / Band</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Contoh: Dewa 19"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Nada Dasar (Key)</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Contoh: C"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">BPM (Opsional)</label>
                  <input
                    type="number"
                    value={newBpm}
                    onChange={(e) => setNewBpm(e.target.value)}
                    placeholder="Contoh: 120"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-400">Lirik Format [Chord] *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      if (onOpenConverter) onOpenConverter();
                    }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Buka Converter</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={6}
                  value={newLyrics}
                  onChange={(e) => setNewLyrics(e.target.value)}
                  placeholder="[G]Malam ini ku [D]sendiri..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-neon-amber"
                >
                  Simpan Lagu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}