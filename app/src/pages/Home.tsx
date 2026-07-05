import { Link, useNavigate } from 'react-router-dom';
import { scores, genres } from '../data/scores';
import { getHistory } from '../lib/store';
import ScoreCard from '../components/ScoreCard';

export default function Home() {
  const nav = useNavigate();
  const featured = scores.filter((s) => s.hasFollow);
  const recommend = scores.slice(0, 5);
  const recent = getHistory().slice(0, 3);

  return (
    <div className="page">
      <div className="app-header" style={{ padding: '4px 0 8px' }}>
        <h1>🎹 自由钢琴<span className="brand-dot">.</span></h1>
      </div>

      <div className="search-box" onClick={() => nav('/library')}>
        <span>🔍</span>
        <input placeholder="搜索曲名、作曲家…" readOnly />
      </div>

      <div className="section-title">热门分类</div>
      <div className="chips">
        {genres.map((g) => (
          <Link key={g} to={`/library?genre=${encodeURIComponent(g)}`} className="chip" style={{ textDecoration: 'none' }}>{g}</Link>
        ))}
      </div>

      <div className="section-title">今日推荐 · 可跟弹 <span className="more">全部试试 →</span></div>
      <div className="h-scroll">
        {featured.map((s) => (
          <Link key={s.id} to={`/score/${s.id}`} className="feature-card" style={{ background: `linear-gradient(135deg, ${s.color}, #00000055)` }}>
            <div className="fc-sub">⭐ 跟弹高亮</div>
            <div>
              <div className="fc-title">{s.title}</div>
              <div className="fc-sub">{s.composer}</div>
            </div>
          </Link>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <div className="section-title">最近练习</div>
          {recent.map((r, i) => (
            <Link key={i} to={`/score/${r.scoreId}`} className="score-card">
              <div className="score-cover" style={{ background: 'var(--surface-2)' }}>⏱️</div>
              <div className="score-meta">
                <div className="score-title">{r.title}</div>
                <div className="score-sub"><span>{r.date}</span><span>练习 {Math.round(r.seconds / 60) || 1} 分钟</span></div>
              </div>
            </Link>
          ))}
        </>
      )}

      <div className="section-title">为你推荐</div>
      {recommend.map((s) => <ScoreCard key={s.id} score={s} />)}
    </div>
  );
}
