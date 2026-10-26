import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Radio, Music2, Gauge, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import { transposeChord } from '../utils/chordUtils';
import { updateSongStatus, deleteSong } from '../services/songService';

export default function StageView({ song, onBack, onDeleteSuccess }) {
  const [transposeKeyShift, setTransposeKeyShift] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const lyricsContainerRef = useRef(null);

  // Auto Scroll Effect Kompatibel iPhone / iOS & Mobile Browser
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const scrollStep = (now) => {
      if (!isScrolling || !lyricsContainerRef.current) return;

      const elapsed = now - lastTime;
      const interval = 50 / scrollSpeed;

      if (elapsed > interval) {
        const container = lyricsContainerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
          setIsScrolling(false);
        } else {
          container.scrollTop += 1;
        }
        lastTime = now;
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    if (isScrolling) {
      animationFrameId = requestAnimationFrame(scrollStep);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isScrolling, scrollSpeed]);

  const handleMarkAsCompleted = async () => {
    setIsUpdating(true);
    try {
      await updateSongStatus(song.id, 'completed');
      alert(`Lagu "${song.title}" berhasil dipindahkan ke "Sudah Dicover"!`);
      onBack();
    } catch (err) {
      alert("Gagal memperbarui status lagu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSong = async () => {
    setIsDeleting(true);
    try {
      await deleteSong(song.id);
      alert(`Lagu "${song.title}" berhasil dihapus.`);
      if (onDeleteSuccess) onDeleteSuccess(song.id);
      onBack();
    } catch (err) {
      alert("Gagal menghapus lagu.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const parseBracketLyrics = (text, shift = 0) => {
    if (!text) return null;

    const rawLines = text.replace(/\u00a0/g, ' ').split('\n');

    return rawLines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={lineIdx} className="h-5" />;

      const sectionMatch = trimmed.match(/^\[\s*(intro|verse\s*\d*|chorus\s*\d*|reff|bridge|solo|interlude|instrument|outro|[\*]+)\s*\]$/i);
      if (sectionMatch) {
        return (
          <div key={lineIdx} className="font-extrabold text-amber-300 mt-8 mb-4 text-sm tracking-widest uppercase border-b border-amber-500/30 pb-1 flex items-center gap-2 select-none">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{trimmed.slice(1, -1)}</span>
          </div>
        );
      }

      const regex = /\[(.*?)\]/g;
      const chords = [];
      let cleanLine = '';
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        cleanLine += line.substring(lastIndex, match.index);
        const charPos = cleanLine.length;
        const transposed = transposeChord(match[1], shift);

        let offset = 0;
        if (chords.length > 0) {
          const prev = chords[chords.length - 1];
          const diff = charPos - prev.pos;
          const minSpace = prev.chord.length + 2;
          if (diff < minSpace) {
            offset = prev.offset + (minSpace - diff);
          }
        }

        chords.push({ chord: transposed, pos: charPos, offset });
        lastIndex = regex.lastIndex;
      }
      cleanLine += line.substring(lastIndex);

      if (!cleanLine.trim() && chords.length > 0) {
        return (
          <div key={lineIdx} className="flex flex-wrap items-center gap-3 my-3">
            {chords.map((c, idx) => (
              <span
                key={idx}
                className="text-amber-300 font-black text-xs font-mono tracking-wider px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.5)] select-none"
              >
                {c.chord}
              </span>
            ))}
          </div>
        );
      }

      return (
        <div key={lineIdx} className="relative pt-7 pb-1 my-1 text-left font-mono">
          {chords.map((c, cIdx) => (
            <span
              key={cIdx}
              className="absolute top-0 text-amber-300 font-black text-xs font-mono tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.5)] select-none whitespace-nowrap z-10"
              style={{ left: `calc(${c.pos + c.offset}ch)` }}
            >
              {c.chord}
            </span>
          ))}

          <div className="text-slate-100 font-semibold text-base font-mono whitespace-pre-wrap leading-normal">
            {cleanLine}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 z-20">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/90 p-4 space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-xs text-amber-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all active:scale-95"
            >
              ← Kembali
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase font-bold mr-1">Transpose:</span>
            <button
              onClick={() => setTransposeKeyShift(prev => prev - 1)}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold"
            >
              -
            </button>
            <span className="text-xs font-black text-amber-300 w-7 text-center font-mono">
              {transposeKeyShift > 0 ? `+${transposeKeyShift}` : transposeKeyShift}
            </span>
            <button
              onClick={() => setTransposeKeyShift(prev => prev + 1)}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Music2 className="w-5 h-5 text-amber-400" />
              {song.title}
            </h2>
            <p className="text-xs text-slate-400 font-medium pl-7">{song.artist}</p>
          </div>

          {song.status === 'wishlist' && (
            <button
              onClick={handleMarkAsCompleted}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] active:scale-95 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUpdating ? 'Proses...' : 'Tandai Selesai'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between bg-slate-950 border border-amber-500/20 rounded-2xl p-2.5 shadow-inner">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScrolling(!isScrolling)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 ${
                isScrolling
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950'
              }`}
            >
              {isScrolling ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isScrolling ? 'PAUSE SCROLL' : 'START AUTO-SCROLL'}</span>
            </button>

            <button
              onClick={() => {
                if (lyricsContainerRef.current) lyricsContainerRef.current.scrollTop = 0;
              }}
              className="p-2 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <Gauge className="w-4 h-4 text-slate-500" />
            <input
              type="range"
              min="1"
              max="5"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
              className="w-16 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div
        ref={lyricsContainerRef}
        className="flex-1 px-6 pt-6 pb-24 overflow-y-auto space-y-2 select-text bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950"
        style={{ 
          maxHeight: 'calc(100vh - 200px)',
          WebkitOverflowScrolling: 'touch',
          transform: 'translateZ(0)'
        }}
      >
        {parseBracketLyrics(song.lyrics, transposeKeyShift)}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Hapus Lagu?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah kamu yakin ingin menghapus lagu <span className="font-bold text-amber-400">"{song.title}"</span>?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSong}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}