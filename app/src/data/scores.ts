// 曲谱库元数据（V0.1 mock 数据，不接后端）
// hasFollow=true 的曲目才有真实 MusicXML + 跟弹能力；其余为占位，展示列表体验用。
import { songs } from './songNotes.js';

export type Copyright = 'public-domain' | 'user-upload' | 'licensed';
export type Genre = '入门' | '古典' | '流行' | '儿童' | '动漫' | '考级';

export interface Score {
  id: string;
  title: string;
  composer: string;       // 作曲 / 编配者
  difficulty: 1 | 2 | 3 | 4 | 5;
  genre: Genre;
  copyright: Copyright;
  hasFollow: boolean;     // 是否支持跟弹高亮（有结构化乐谱）
  hasMidi: boolean;
  color: string;          // 封面主题色（原型用纯色块代替封面图）
  noteCount?: number;
}

const noteCount = (id: keyof typeof songs) => songs[id]?.notes.length;

// 有真实跟弹能力的公版曲（来自 songNotes 数据源）
const realScores: Score[] = [
  { id: 'twinkle', title: '小星星', composer: '莫扎特 改编', difficulty: 1, genre: '入门', copyright: 'public-domain', hasFollow: true, hasMidi: true, color: '#7C6BF5', noteCount: noteCount('twinkle') },
  { id: 'ode-to-joy', title: '欢乐颂', composer: '贝多芬', difficulty: 2, genre: '古典', copyright: 'public-domain', hasFollow: true, hasMidi: true, color: '#F5A623', noteCount: noteCount('ode-to-joy') },
  { id: 'mary', title: '玛丽有只小羊羔', composer: '传统童谣', difficulty: 1, genre: '儿童', copyright: 'public-domain', hasFollow: true, hasMidi: true, color: '#41C7A8', noteCount: noteCount('mary') },
];

// 占位曲目（原型让库看起来更真实；点进去会提示「示例数据」）
const placeholderScores: Score[] = [
  { id: 'canon', title: '卡农（片段）', composer: '帕赫贝尔', difficulty: 3, genre: '古典', copyright: 'public-domain', hasFollow: false, hasMidi: true, color: '#E85D9E' },
  { id: 'turkish', title: '土耳其进行曲', composer: '莫扎特', difficulty: 4, genre: '古典', copyright: 'public-domain', hasFollow: false, hasMidi: true, color: '#5B8DEF' },
  { id: 'fur-elise', title: '致爱丽丝', composer: '贝多芬', difficulty: 3, genre: '古典', copyright: 'public-domain', hasFollow: false, hasMidi: true, color: '#9B72F2' },
  { id: 'castle', title: '天空之城', composer: '久石让（示例）', difficulty: 3, genre: '动漫', copyright: 'user-upload', hasFollow: false, hasMidi: true, color: '#4EC0E4' },
  { id: 'river', title: '菊次郎的夏天（示例）', composer: '久石让（示例）', difficulty: 3, genre: '动漫', copyright: 'user-upload', hasFollow: false, hasMidi: false, color: '#57C289' },
  { id: 'happy-bday', title: '生日快乐歌', composer: '传统', difficulty: 1, genre: '入门', copyright: 'public-domain', hasFollow: false, hasMidi: true, color: '#F58A5B' },
  { id: 'jingle', title: '铃儿响叮当', composer: '传统', difficulty: 1, genre: '儿童', copyright: 'public-domain', hasFollow: false, hasMidi: true, color: '#E8B84B' },
  { id: 'moonlight', title: '月光奏鸣曲（片段）', composer: '贝多芬', difficulty: 5, genre: '考级', copyright: 'public-domain', hasFollow: false, hasMidi: true, color: '#6C7BF5' },
  { id: 'butterfly', title: '梁祝（片段）', composer: '何占豪 陈钢', difficulty: 4, genre: '流行', copyright: 'licensed', hasFollow: false, hasMidi: true, color: '#EF6B7B' },
  { id: 'city-of-stars', title: '爱乐之城（示例）', composer: '示例编配', difficulty: 3, genre: '流行', copyright: 'user-upload', hasFollow: false, hasMidi: false, color: '#5AC8C8' },
];

export const scores: Score[] = [...realScores, ...placeholderScores];
export const genres: Genre[] = ['入门', '古典', '流行', '儿童', '动漫', '考级'];

export const getScore = (id: string) => scores.find((s) => s.id === id);
export const getNotes = (id: string) => (songs as Record<string, { notes: [string, number, number][] }>)[id]?.notes;
