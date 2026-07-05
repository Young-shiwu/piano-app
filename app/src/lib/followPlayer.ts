// 跟弹引擎：同一份音符序列驱动「发声 + 谱面光标高亮 + 键盘高亮」三者同步。
// 依赖 OSMD 的 cursor 做谱面高亮；用 setTimeout 链按音符时值推进（含变速）。
import type { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { playMidi, ensureAudio } from './audio';
import { toMidi, type RawNote } from './music';

interface Opts {
  bpm?: number;
  onNote?: (midi: number | null) => void; // 当前发声音符（高亮键盘）；null=停
  onIndex?: (i: number, total: number) => void;
  onEnd?: () => void;
}

export class FollowPlayer {
  private osmd: OpenSheetMusicDisplay;
  private notes: RawNote[];
  private bpm: number;
  private opts: Opts;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private index = 0;
  private _playing = false;
  speed = 1;

  constructor(osmd: OpenSheetMusicDisplay, notes: RawNote[], opts: Opts = {}) {
    this.osmd = osmd;
    this.notes = notes;
    this.bpm = opts.bpm ?? 96;
    this.opts = opts;
  }

  get playing() { return this._playing; }

  async play() {
    await ensureAudio();
    if (this._playing) return;
    this._playing = true;
    // 从头播：复位光标
    if (this.index === 0) {
      this.osmd.cursor.reset();
      this.osmd.cursor.show();
    }
    this.step();
  }

  private step = () => {
    if (!this._playing) return;
    if (this.index >= this.notes.length) {
      this.finish();
      return;
    }
    const [step, octave, dur] = this.notes[this.index];
    const midi = toMidi(step, octave);
    // 时值（秒）：一个四分音符 = 60/bpm 秒，再除以倍速
    const durSec = dur * (60 / this.bpm) / this.speed;

    playMidi(midi, durSec * 0.9);
    this.opts.onNote?.(midi);
    this.opts.onIndex?.(this.index, this.notes.length);

    // 谱面光标：第 0 个音符光标已在起点，之后每步 next()
    if (this.index > 0) this.osmd.cursor.next();

    this.index++;
    this.timer = setTimeout(this.step, durSec * 1000);
  };

  pause() {
    this._playing = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.opts.onNote?.(null);
  }

  stop() {
    this.pause();
    this.index = 0;
    try {
      this.osmd.cursor.reset();
    } catch { /* 谱面可能未就绪 */ }
  }

  private finish() {
    this._playing = false;
    this.index = 0;
    this.opts.onNote?.(null);
    this.opts.onEnd?.();
    try { this.osmd.cursor.reset(); } catch { /* noop */ }
  }
}
