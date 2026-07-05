import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getScore, type Copyright } from '../data/scores';
import { isFavorite, toggleFavorite } from '../lib/store';

const copyrightLabel: Record<Copyright, string> = {
  'public-domain': '公版曲目 · 可自由使用',
  'user-upload': '用户上传 · 仅供个人练习',
  'licensed': '已授权内容',
};
const dots = (n: number) => '●'.repeat(n) + '○'.repeat(5 - n);

export default function Detail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const score = getScore(id);
  const [fav, setFav] = useState(isFavorite(id));

  if (!score) return <div className="page"><div className="empty">曲谱不存在</div></div>;

  return (
    <div>
      <div className="back-bar">
        <button className="back-btn" onClick={() => nav(-1)}>‹</button>
        <span>曲谱详情</span>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="score-cover" style={{ background: score.color, width: 84, height: 84, flex: '0 0 84px', fontSize: 36, borderRadius: 16 }}>🎹</div>
          <div>
            <h2 style={{ fontSize: 20 }}>{score.title}</h2>
            <div className="score-sub" style={{ marginTop: 6 }}>
              <span>{score.composer}</span>
            </div>
            <div className="score-sub" style={{ marginTop: 6 }}>
              <span>难度 <span className="diff-dots">{dots(score.difficulty)}</span></span>
            </div>
          </div>
        </div>

        <div className="score-sub" style={{ marginTop: 14 }}>
          {score.hasFollow && <span className="badge follow">跟弹高亮</span>}
          {score.hasMidi && <span className="badge">MIDI 试听</span>}
          <span className="badge">{score.genre}</span>
        </div>

        <div className="btn-row" style={{ marginTop: 20 }}>
          {score.hasFollow ? (
            <button className="btn btn-primary" onClick={() => nav(`/score/${id}/practice`)}>▶ 开始跟弹练习</button>
          ) : (
            <button className="btn" style={{ opacity: 0.6 }} onClick={() => nav(`/score/${id}/reader`)}>▶ 试听 / 看谱</button>
          )}
        </div>
        <div className="btn-row" style={{ marginTop: 10 }}>
          <Link to={`/score/${id}/reader`} className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>📄 看谱</Link>
          <button className="btn" onClick={() => setFav(toggleFavorite(id))}>{fav ? '★ 已收藏' : '☆ 收藏'}</button>
        </div>

        <div className="note-tip">
          来源：{copyrightLabel[score.copyright]}。<br />
          {score.hasFollow
            ? '本曲为公版曲目，支持跟弹高亮：谱面光标会跟随播放移动，底部键盘同步点亮。'
            : '⚠️ 该曲为原型占位数据，跟弹功能未开放。正式版会补充结构化乐谱（MusicXML）后开启跟弹。'}
        </div>
      </div>
    </div>
  );
}
