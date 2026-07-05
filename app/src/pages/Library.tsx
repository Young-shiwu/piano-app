import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scores, genres, type Genre } from '../data/scores';
import ScoreCard from '../components/ScoreCard';

export default function Library() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState<Genre | '全部'>((params.get('genre') as Genre) || '全部');

  const list = useMemo(() => {
    return scores.filter((s) => {
      const okG = genre === '全部' || s.genre === genre;
      const okQ = !q || s.title.includes(q) || s.composer.includes(q);
      return okG && okQ;
    });
  }, [q, genre]);

  return (
    <div className="page">
      <div className="app-header" style={{ padding: '4px 0 12px' }}><h1>曲谱库</h1></div>

      <div className="search-box">
        <span>🔍</span>
        <input autoFocus placeholder="搜索曲名、作曲家…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="chips" style={{ marginTop: 12 }}>
        {(['全部', ...genres] as const).map((g) => (
          <button key={g} className={`chip${genre === g ? ' on' : ''}`} onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {list.length === 0
          ? <div className="empty">没找到「{q}」相关曲谱<br />换个关键词试试～</div>
          : list.map((s) => <ScoreCard key={s.id} score={s} />)}
      </div>
    </div>
  );
}
