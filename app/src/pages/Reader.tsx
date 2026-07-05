import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { getScore } from '../data/scores';

const xmlFiles = import.meta.glob('../assets/scores/*.musicxml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const xmlById = (id: string) => Object.entries(xmlFiles).find(([p]) => p.includes(`/${id}.musicxml`))?.[1];

export default function Reader() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const score = getScore(id);
  const ref = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [zoom, setZoom] = useState(1);
  const xml = xmlById(id);

  useEffect(() => {
    if (!ref.current || !xml) return;
    let disposed = false;
    const osmd = new OpenSheetMusicDisplay(ref.current, { autoResize: true, drawTitle: false, drawPartNames: false, backend: 'svg' });
    osmdRef.current = osmd;
    osmd.load(xml).then(() => { if (!disposed) osmd.render(); });
    return () => { disposed = true; };
  }, [xml]);

  useEffect(() => {
    const osmd = osmdRef.current;
    if (osmd && xml) { osmd.zoom = zoom; osmd.render(); }
  }, [zoom, xml]);

  if (!score) return <div className="page"><div className="empty">曲谱不存在</div></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="back-bar">
        <button className="back-btn" onClick={() => nav(-1)}>‹</button>
        <span>{score.title} · 看谱</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="chip" onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}>A-</button>
          <button className="chip" onClick={() => setZoom((z) => Math.min(2, z + 0.15))}>A+</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {xml ? (
          <div ref={ref} style={{ background: '#fff', borderRadius: 12, padding: 10 }} />
        ) : (
          <div className="note-tip">
            ⚠️ 该曲为原型占位数据，暂无谱面。<br />
            正式版接入 MusicXML / PDF 曲谱后，这里会显示可缩放的乐谱，并支持自动滚动与横屏。
          </div>
        )}
      </div>

      {score.hasFollow && (
        <div style={{ padding: 12 }}>
          <button className="btn btn-primary" onClick={() => nav(`/score/${id}/practice`)}>▶ 进入跟弹练习</button>
        </div>
      )}
    </div>
  );
}
