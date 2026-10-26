import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddSongModal({ onClose, onAddSong }) {
  const [formData, setFormData] = useState({
    title: '', artist: '', key: 'C', status: 'wishlist', bpm: '', lyrics: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSong({
      ...formData,
      id: Date.now().toString(),
      bpm: parseInt(formData.bpm) || 120
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100">Tambah Lagu Cover Baru</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-400">Judul Lagu</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Artis / Penyanyi</label>
            <input
              type="text"
              required
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-400">Kunci Dasar</label>
              <input
                type="text"
                required
                placeholder="Contoh: C / Am"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Tempo (BPM)</label>
              <input
                type="number"
                placeholder="120"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 mt-1 text-slate-300"
            >
              <option value="wishlist">Wishlist Cover</option>
              <option value="completed">Sudah Dicover</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Lirik & Chord (Gunakan kurung siku `[C]`)</label>
            <textarea
              rows={6}
              required
              placeholder="[C]Buka hari [G]dengan senyuman..."
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-400 mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all mt-2"
          >
            Simpan Lagu
          </button>
        </form>
      </div>
    </div>
  );
}