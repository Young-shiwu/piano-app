// 轻量本地存储：收藏 + 练习记录（V0.1 用 localStorage，V0.2 迁云端）
const FAV_KEY = 'piano.favorites';
const HIST_KEY = 'piano.history';

export interface PracticeRecord {
  scoreId: string;
  title: string;
  date: string;       // YYYY-MM-DD
  seconds: number;
}

const read = <T>(k: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || '') as T; } catch { return fallback; }
};
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

export const getFavorites = (): string[] => read<string[]>(FAV_KEY, []);
export const isFavorite = (id: string) => getFavorites().includes(id);
export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1); else favs.push(id);
  write(FAV_KEY, favs);
  return i < 0; // true=现在已收藏
}

export const getHistory = (): PracticeRecord[] => read<PracticeRecord[]>(HIST_KEY, []);
export function addPractice(scoreId: string, title: string, seconds: number) {
  if (seconds < 2) return;
  const hist = getHistory();
  hist.unshift({ scoreId, title, date: new Date().toISOString().slice(0, 10), seconds: Math.round(seconds) });
  write(HIST_KEY, hist.slice(0, 100));
}

// 统计：累计练习时长、连续天数、练过的曲目数
export function stats() {
  const hist = getHistory();
  const totalSec = hist.reduce((s, r) => s + r.seconds, 0);
  const days = new Set(hist.map((r) => r.date));
  const songs = new Set(hist.map((r) => r.scoreId));
  // 连续天数
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  return { totalMin: Math.round(totalSec / 60), streak, songCount: songs.size, sessions: hist.length };
}
