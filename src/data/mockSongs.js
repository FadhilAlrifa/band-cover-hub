import { Guitar, Radio, Mic2, Sliders, Drum } from 'lucide-react';

export const INSTRUMENTS = [
  { id: 'gitar_utama', label: 'Gitar Utama', icon: Guitar },
  { id: 'gitar_ritme', label: 'Gitar Ritme', icon: Guitar },
  { id: 'bass', label: 'Bass', icon: Radio },
  { id: 'vokal', label: 'Vokal', icon: Mic2 },
  { id: 'keyboard', label: 'Keyboard / Synth', icon: Sliders },
  { id: 'drum', label: 'Drum', icon: Drum },
];

export const INITIAL_SONGS = [
  {
    id: '1',
    title: 'Akad',
    artist: 'Payung Teduh',
    key: 'C',
    status: 'wishlist',
    bpm: 92,
    lyrics: `[Intro]\n[C]  [F]  [C]  [F]\n\n[Verse 1]\n[C]Bila waktunya [Em]tiba\nKita 'kan mengi[F]kat janji bersama[G]\n[C]Betapa bahagia[Em]nya\nMenghabiskan [F]sisa umur deng[G]anmu\n\n[Reff]\nSudi[F]kah kau menjadi [G]rumahku\nTempatku [Em]pulang dari se[Am]gala letih\nSudikah [Dm]kau menjadi [G]alasan\nSetiap [C]senyum di pagi hari[C7]`
  }
];