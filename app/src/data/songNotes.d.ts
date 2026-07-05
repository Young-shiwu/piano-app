// songNotes.js 的类型声明（该文件是 Node 脚本与前端共享的数据源，故用 .js）
export interface SongData {
  title: string;
  notes: [string, number, number][];
}
export const songs: Record<string, SongData>;
