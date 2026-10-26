// Transpose chord
export const transposeChord = (chord, shift) => {
  if (!shift) return chord;
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return chord.replace(/([A-G][#b]?)/g, (match) => {
    let isFlat = match.endsWith('b');
    let note = match;
    if (isFlat) {
      const flatMap = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
      note = flatMap[match] || match;
    }
    const idx = notes.indexOf(note);
    if (idx === -1) return match;
    let newIdx = (idx + shift) % 12;
    if (newIdx < 0) newIdx += 12;
    return notes[newIdx];
  });
};

/**
 * Converter Presisi dengan Auto-Expand "Back to" Section
 */
export const convertToBracketLyrics = (rawText) => {
  if (!rawText) return '';

  const lines = rawText.split('\n');
  const sections = {}; 
  let currentSectionKey = null;

  // Pass 1: Petakan teks asli ke dalam memori berdasarkan section header
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const trimmed = currentLine.trim();

    const sectionMatch = trimmed.match(/^\[\s*(intro|verse\s*\d*|chorus\s*\d*|reff|bridge|solo|interlude|instrument|outro|[\*]+)\s*\]$/i);
    
    if (sectionMatch) {
      currentSectionKey = trimmed.toLowerCase();
      if (!sections[currentSectionKey]) {
        sections[currentSectionKey] = [];
      }
    } else if (currentSectionKey) {
      sections[currentSectionKey].push(currentLine);
    }
  }

  // Pass 2: Proses konversi & Expand "Back to"
  const finalParsedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const trimmed = currentLine.trim();

    // Deteksi perintah pengulangan seperti "Back to [*]" atau "Back to reff"
    const backToMatch = trimmed.match(/back\s+to\s+(.+)/i);
    if (backToMatch) {
      let targetKey = backToMatch[1].trim().toLowerCase();
      if (!targetKey.startsWith('[')) targetKey = `[${targetKey}]`;

      if (sections[targetKey]) {
        finalParsedLines.push(`\n${trimmed}`);
        finalParsedLines.push(targetKey);
        for (const secLine of sections[targetKey]) {
          finalParsedLines.push(secLine);
        }
        continue;
      }
    }

    const nextLine = lines[i + 1];
    const isChordLine = /^\s*([A-G][b#]?(m|maj|min|dim|aug|sus|[0-9])*\s*)+$/i.test(currentLine);
    const isNextLineLyric = nextLine && !/^\s*([A-G][b#]?(m|maj|min|dim|aug|sus|[0-9])*\s*)+$/i.test(nextLine) && nextLine.trim() !== '';

    if (isChordLine && isNextLineLyric) {
      const chordMatches = [];
      const regex = /([A-G][b#]?(m|maj|min|dim|aug|sus|[0-9])*)/gi;
      let match;

      while ((match = regex.exec(currentLine)) !== null) {
        chordMatches.push({ chord: match[0], index: match.index });
      }

      const lyricText = nextLine.replace(/\u00a0/g, ' ');
      const words = [];
      const wordRegex = /\S+/g;
      let wordMatch;

      while ((wordMatch = wordRegex.exec(lyricText)) !== null) {
        words.push({
          word: wordMatch[0],
          start: wordMatch.index,
          end: wordMatch.index + wordMatch[0].length,
          chords: []
        });
      }

      for (const c of chordMatches) {
        let assigned = false;
        for (let wIdx = 0; wIdx < words.length; wIdx++) {
          const w = words[wIdx];
          const nextW = words[wIdx + 1];
          if (c.index < w.end || (!nextW && c.index >= w.end)) {
            w.chords.push(c.chord);
            assigned = true;
            break;
          }
        }
        if (!assigned && words.length > 0) {
          words[words.length - 1].chords.push(c.chord);
        }
      }

      const mergedLine = words
        .map(w => `${w.chords.map(ch => `[${ch}]`).join('')}${w.word}`)
        .join(' ');

      finalParsedLines.push(mergedLine);
      i++; 
    } else {
      const cleanedLine = currentLine.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
      if (cleanedLine) {
        finalParsedLines.push(cleanedLine);
      }
    }
  }

  return finalParsedLines.join('\n');
};

export const convertStandardToBracket = convertToBracketLyrics;
export const cleanBracketLyrics = convertToBracketLyrics;