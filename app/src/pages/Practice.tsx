import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { getScore, getNotes } from '../data/scores';
import { FollowPlayer } from '../lib/followPlayer';
import { playMidi, ensureAudio } from '../lib/audio';
import { addPractice } from '../lib/store';
import type { RawNote } from '../lib/music';
import PianoKeyboard from '../components/PianoKeyboard';
import './Practice.css';

// 把 assets 里的 MusicXML 以字符串方式打包进来
const xmlFiles = import.meta.glob('../assets/scores/*.musicxml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const xmlById = (id: string) => Object.entries(xmlFiles).find(([p]) => p.includes(`/${id}.musicxml`))?.[1];

const SPEEDS = [0.5, 0.75, 1, 1.25];

export default function Practice() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const score = getScore(id);

  const sheetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<FollowPlayer | null>(null);
  const playedMsRef = useRef(0);
  const lastPlayAtRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [active, setActive] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);

  // 初始化 OSMD + 跟弹引擎
  useEffect(() => {
    const xml = xmlById(id);
    const notes = getNotes(id) as RawNote[] | undefined;
    if (!sheetRef.current || !xml || !notes) return;

    let disposed = false;
    const osmd = new OpenSheetMusicDisplay(sheetRef.current, {
      autoResize: true,
      drawTitle: false,
      drawPartNames: false,
      backend: 'svg',
    });

    osmd.load(xml).then(() => {
      if (disposed) return;
      osmd.render();
      osmd.cursor.show();
      playerRef.current = new FollowPlayer(osmd, notes, {
        bpm: 96,
        onNote: (midi) => setActive(midi == null ? new Set() : new Set([midi])),
        onIndex: (i, total) => setProgress(Math.round(((i + 1) / total) * 100)),
        onEnd: () => { setPlaying(false); setProgress(0); pauseClock(); },
      });
      setReady(true);
    }).catch((e) => console.error('OSMD load 失败', e));

    return () => {
      disposed = true;
      playerRef.current?.stop();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 练习计时
  const pauseClock = () => {
    if (lastPlayAtRef.current != null) {
      playedMsRef.current += Date.now() - lastPlayAtRef.current;
      lastPlayAtRef.current = null;
    }
  };
  useEffect(() => () => {
    pauseClock();
    if (score) addPractice(score.id, score.title, playedMsRef.current / 1000);
  }, [score]);

  const toggle = async () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.playing) {
      p.pause(); setPlaying(false); pauseClock();
    } else {
      p.speed = speed;
      await p.play(); setPlaying(true);
      lastPlayAtRef.current = Date.now();
    }
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (playerRef.current) playerRef.current.speed = s;
  };

  if (!score) return <div className="page"><div className="empty">曲谱不存在</div></div>;

  return (
    <div className="practice">
      <div className="back-bar">
        <button className="back-btn" onClick={() => nav(-1)}>‹</button>
        <span>{score.title} · 跟弹练习</span>
      </div>

      <div className="practice-progress"><div className="bar" style={{ width: `${progress}%` }} /></div>

      <div className="sheet-wrap">
        <div ref={sheetRef} className="sheet" />
        {!ready && <div className="empty" style={{ position: 'absolute', inset: 0 }}>加载谱面中…</div>}
      </div>

      <div className="practice-controls">
        <div className="speed-row">
          {SPEEDS.map((s) => (
            <button key={s} className={`chip${speed === s ? ' on' : ''}`} onClick={() => changeSpeed(s)}>{s}x</button>
          ))}
        </div>
        <button className="play-btn btn-primary" onClick={toggle} disabled={!ready}>
          {playing ? '⏸ 暂停' : '▶ 播放跟弹'}
        </button>
      </div>

      <div className="kbd-wrap">
        <PianoKeyboard active={active} onPress={async (m) => { await ensureAudio(); playMidi(m); setActive(new Set([m])); setTimeout(() => setActive(new Set()), 200); }} />
      </div>
    </div>
  );
}
