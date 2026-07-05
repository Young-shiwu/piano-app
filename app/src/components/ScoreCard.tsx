import { Link } from 'react-router-dom';
import type { Score } from '../data/scores';

const dots = (n: number) => '●'.repeat(n) + '○'.repeat(5 - n);

export default function ScoreCard({ score }: { score: Score }) {
  return (
    <Link to={`/score/${score.id}`} className="score-card">
      <div className="score-cover" style={{ background: score.color }}>🎹</div>
      <div className="score-meta">
        <div className="score-title">{score.title}</div>
        <div className="score-sub">
          <span>{score.composer}</span>
          <span className="diff-dots">{dots(score.difficulty)}</span>
        </div>
      </div>
      {score.hasFollow && <span className="badge follow">跟弹</span>}
      <span className="badge">{score.genre}</span>
    </Link>
  );
}
