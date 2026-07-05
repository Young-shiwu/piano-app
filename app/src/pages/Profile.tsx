import { Link } from 'react-router-dom';
import { getFavorites, getHistory, stats } from '../lib/store';
import { getScore } from '../data/scores';
import ScoreCard from '../components/ScoreCard';

export default function Profile() {
  const s = stats();
  const favs = getFavorites().map(getScore).filter(Boolean);
  const hist = getHistory().slice(0, 5);

  return (
    <div className="page">
      <div className="app-header" style={{ padding: '4px 0 12px' }}><h1>我的</h1></div>

      <div className="stat-grid">
        <div className="stat"><b>{s.streak}</b><span>连续天数</span></div>
        <div className="stat"><b>{s.totalMin}</b><span>累计分钟</span></div>
        <div className="stat"><b>{s.songCount}</b><span>练过曲目</span></div>
        <div className="stat"><b>{s.sessions}</b><span>练习次数</span></div>
      </div>

      <div className="section-title">我的收藏</div>
      {favs.length === 0
        ? <div className="empty">还没有收藏，去<Link to="/library" style={{ color: 'var(--accent)' }}>曲谱库</Link>逛逛～</div>
        : favs.map((sc) => sc && <ScoreCard key={sc.id} score={sc} />)}

      <div className="section-title">练习历史</div>
      {hist.length === 0
        ? <div className="empty">练一首曲子后，这里会记录你的进步 🎵</div>
        : hist.map((r, i) => (
          <Link key={i} to={`/score/${r.scoreId}`} className="score-card">
            <div className="score-cover" style={{ background: 'var(--surface-2)' }}>⏱️</div>
            <div className="score-meta">
              <div className="score-title">{r.title}</div>
              <div className="score-sub"><span>{r.date}</span><span>{Math.round(r.seconds / 60) || 1} 分钟</span></div>
            </div>
          </Link>
        ))}

      <div className="note-tip" style={{ marginTop: 24 }}>
        这是 V0.1 原型：数据存在本机浏览器，未接后端和账号。<br />
        正式版会有云端同步、无广告会员、更多曲谱包。
      </div>
    </div>
  );
}
