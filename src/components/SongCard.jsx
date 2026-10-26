import React, { useState } from 'react';
import { ChevronRight, Trash2, AlertTriangle, Music, Activity } from 'lucide-react';
import { deleteSong } from '../services/songService';

export default function SongCard({ song, onSelectSong, onDeleteSuccess }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (onSelectSong) {
      onSelectSong(song);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);

    try {
      await deleteSong(song.id);
      setShowDeleteConfirm(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(song.id);
      }
    } catch (err) {
      alert("Gagal menghapus lagu.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/30 rounded-2xl p-4 transition-all duration-200 shadow-lg hover:shadow-amber-500/5 flex items-center justify-between gap-3 cursor-pointer select-none active:scale-[0.99]"
      >
        <div className="flex-1 min-w-0 space-y-2 pointer-events-none">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white tracking-tight truncate group-hover:text-amber-300 transition-colors">
              {song.title}
            </h3>
            {song.is_hot && <span className="text-amber-400 text-xs">🔥</span>}
          </div>

          <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{song.artist || 'Unknown Artist'}</span>
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold">
              Key: {song.key || 'C'}
            </span>
            {song.bpm && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 font-mono text-[11px] font-medium flex items-center gap-1">
                <Activity className="w-3 h-3 text-slate-400" />
                <span>{song.bpm} BPM</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/40 transition-all active:scale-90 cursor-pointer"
            title="Hapus lagu"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="p-2.5 rounded-xl bg-slate-800/80 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 border border-slate-700/60 transition-all pointer-events-none">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Hapus Lagu?</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Lagu <span className="font-bold text-amber-400">"{song.title}"</span> akan dihapus dari daftar.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}