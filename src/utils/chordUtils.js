export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const transposeChord = (chord, semitones) => {
  return chord.replace(/([A-G][#b]?)/g, (match) => {
    let index = NOTES.indexOf(match);
    if (index === -1) return match;
    let newIndex = (index + semitones) % 12;
    if (newIndex < 0) newIndex += 12;
    return NOTES[newIndex];
  });
};

export const convertStandardToBracket = (rawText) => {
  const lines = rawText.replace(/\u00a0/g, ' ').split('\n');
  let result = [];

  const isChordWord = (word) => {
    const clean = word.trim();
    if (!clean) return false;
    return /^[A-G][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]*(\/[A-G][#b]?)?$/i.test(clean);
  };

  const isChordLine = (line) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return false;
    const chordCount = words.filter(isChordWord).length;
    return chordCount / words.length >= 0.6;
  };

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];

    if (isChordLine(currentLine)) {
      const nextLine = lines[i + 1];

      if (nextLine && !isChordLine(nextLine) && nextLine.trim().length > 0) {
        let merged = '';
        let lastPos = 0;

        const chordMatches = [];
        const regex = /([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-G][#b]?)?)/gi;
        let match;
        while ((match = regex.exec(currentLine)) !== null) {
          chordMatches.push({ chord: match[0], index: match.index });
        }

        chordMatches.forEach((m) => {
          const pos = Math.min(m.index, nextLine.length);
          merged += nextLine.substring(lastPos, pos) + `[${m.chord}]`;
          lastPos = pos;
        });

        merged += nextLine.substring(lastPos);
        result.push(merged);
        i++;
      } else {
        const convertedAlone = currentLine.replace(/([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-G][#b]?)?)/gi, '[$1]');
        result.push(convertedAlone);
      }
    } else {
      result.push(currentLine);
    }
  }

  return result.join('\n');
};