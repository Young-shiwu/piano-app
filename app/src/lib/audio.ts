// 音频引擎：基于 Tone.js 的钢琴音色单例。
// V0.1 用合成音色（PolySynth）即可跑通跟弹；后续可换真实钢琴采样音源。
import * as Tone from 'tone';
import { midiToName } from './music';

let synth: Tone.PolySynth | null = null;
let started = false;

function getSynth() {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.8 },
      volume: -8,
    }).toDestination();
  }
  return synth;
}

// 浏览器要求用户手势后才能出声，首次点击时调用
export async function ensureAudio() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

export function playMidi(midi: number, durationSec = 0.4) {
  getSynth().triggerAttackRelease(midiToName(midi), Math.max(0.15, durationSec));
}
