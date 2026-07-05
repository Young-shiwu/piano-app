// 曲谱库元数据（V0.1 mock 数据，不接后端）
// 内容侧以 songNotes.js 为单一来源：音符数组生成 MusicXML，元数据生成曲库列表。
import { songs } from './songNotes.js';

export type Copyright = 'public-domain' | 'user-upload' | 'licensed';
export type Genre = '入门' | '古典' | '流行' | '儿童' | '动漫' | '考级';

export interface CopyrightInfo {
  sourceType: Copyright;
  source: string;
  reviewStatus: 'prototype-simplified' | 'verified' | 'needs-review';
  usage: string;
}

export interface Score {
  id: string;
  title: string;
  composer: string;       // 作曲 / 编配者
  difficulty: 1 | 2 | 3 | 4 | 5;
  genre: Genre;
  copyright: Copyright;
  copyrightInfo?: CopyrightInfo;
  hasFollow: boolean;     // 是否支持跟弹高亮（有结构化乐谱）
  hasMidi: boolean;
  color: string;          // 封面主题色（原型用纯色块代替封面图）
  noteCount?: number;
}

type SongData = {
  title: string;
  composer?: string;
  difficulty?: Score['difficulty'];
  genre?: Genre;
  copyright?: Copyright;
  copyrightInfo?: CopyrightInfo;
  hasFollow?: boolean;
  hasMidi?: boolean;
  color?: string;
  notes: [string, number, number][];
};

const songMap = songs as Record<string, SongData>;

export const scores: Score[] = Object.entries(songMap).map(([id, song], index) => ({
  id,
  title: song.title,
  composer: song.composer ?? '公版曲目',
  difficulty: song.difficulty ?? 1,
  genre: song.genre ?? '入门',
  copyright: song.copyright ?? 'public-domain',
  copyrightInfo: song.copyrightInfo,
  hasFollow: song.hasFollow ?? true,
  hasMidi: song.hasMidi ?? true,
  color: song.color ?? ['#7C6BF5', '#F5A623', '#41C7A8', '#E85D9E'][index % 4],
  noteCount: song.notes.length,
}));

export const genres: Genre[] = ['入门', '古典', '流行', '儿童', '动漫', '考级'];

export const getScore = (id: string) => scores.find((s) => s.id === id);
export const getNotes = (id: string) => songMap[id]?.notes;
