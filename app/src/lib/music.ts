// 音符工具：step/octave ↔ MIDI ↔ 频率 / 音名。跟弹引擎和键盘共用。
const STEP_SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export type RawNote = [string, number, number]; // [step, octave, dur(四分音符为单位)]

export const toMidi = (step: string, octave: number) => (octave + 1) * 12 + (STEP_SEMITONE[step] ?? 0);
export const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const midiToName = (midi: number) => `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
export const isBlackKey = (midi: number) => [1, 3, 6, 8, 10].includes(midi % 12);
