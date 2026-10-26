import React from 'react';
import { Search, Plus, ListMusic, CheckCircle2, Music } from 'lucide-react';
import SongCard from './SongCard'; // <-- Import komponen SongCard

export default function SongList({
  songs,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onSelectSong,
  onOpenAddModal
}) {
  const filteredSongs = songs.filter(song =>
    song.status === activeTab &&
    (song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="flex-1 p-4 pb-24 space-y-4">
      {/* Search & Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lagu atau artis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-slate-200"
          />
        </div>
        <button
          onClick={onOpenAddModal}
          className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'wishlist'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Wishlist Cover</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Sudah Dicover</span>
        </button>
      </div>

      {/* Song List menggunakan SongCard */}
      <div className="space-y-2.5">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6">
            <Music className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">Tidak ada lagu ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Tambahkan lagu baru dengan tombol + di atas</p>
          </div>
        ) : (
          filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onSelect={onSelectSong}
            />
          ))
        )}
      </div>
    </main>
  );
}