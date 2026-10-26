import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { INSTRUMENTS } from '../data/mockSongs';

export default function LoginModal({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('gitar_utama');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    onLogin({ name: userName, instrument: selectedInstrument });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Music className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Band Cover Hub</h1>
          <p className="text-sm text-slate-400">Atur jadwal latihan & interactive chord player</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Kamu</label>
            <input
              type="text"
              required
              placeholder="Masukkan nama..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peran di Dalam Band</label>
            <div className="grid grid-cols-2 gap-2.5">
              {INSTRUMENTS.map((inst) => {
                const Icon = inst.icon;
                const isSelected = selectedInstrument === inst.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstrument(inst.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-medium truncate">{inst.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            Masuk ke Workspace
          </button>
        </form>
      </div>
    </div>
  );
}