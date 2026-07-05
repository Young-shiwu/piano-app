// 曲谱生成器：把紧凑的音符数组转成合法 MusicXML（OSMD 可渲染）
// 用途：早期公版入门曲的内容流水线。dur 单位=四分音符（1=四分,2=二分,0.5=八分）
// 运行：node scripts/gen-scores.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { songs } from '../src/data/songNotes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../src/assets/scores');
mkdirSync(outDir, { recursive: true });

const DIVISIONS = 4; // 每四分音符 4 个 division，支持到十六分
const typeOf = (dur) => ({ 4: 'whole', 3: 'half', 2: 'half', 1: 'quarter', 0.5: 'eighth' }[dur] || 'quarter');
const dotted = (dur) => dur === 3; // 附点二分

// 把 [step, octave, dur] 的扁平音符流按 4/4 拆小节
function toMeasures(notes, beatsPerMeasure = 4) {
  const measures = [];
  let cur = [];
  let acc = 0;
  for (const n of notes) {
    cur.push(n);
    acc += n[2];
    if (acc >= beatsPerMeasure - 1e-9) {
      measures.push(cur);
      cur = [];
      acc = 0;
    }
  }
  if (cur.length) measures.push(cur);
  return measures;
}

function noteXml([step, octave, dur]) {
  const dur4 = Math.round(dur * DIVISIONS);
  const dot = dotted(dur) ? '<dot/>' : '';
  return `      <note>
        <pitch><step>${step}</step><octave>${octave}</octave></pitch>
        <duration>${dur4}</duration>
        <type>${typeOf(dur)}</type>${dot ? '\n        ' + dot : ''}
      </note>`;
}

function buildMusicXml(title, notes) {
  const measures = toMeasures(notes);
  const measuresXml = measures.map((m, i) => {
    const attrs = i === 0
      ? `      <attributes>
        <divisions>${DIVISIONS}</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>\n`
      : '';
    return `    <measure number="${i + 1}">\n${attrs}${m.map(noteXml).join('\n')}\n    </measure>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>${title}</work-title></work>
  <part-list>
    <score-part id="P1"><part-name>Piano</part-name></score-part>
  </part-list>
  <part id="P1">
${measuresXml}
  </part>
</score-partwise>
`;
}

// ── 曲目来自共享数据源 src/data/songNotes.js ─────────────
for (const [id, { title, notes }] of Object.entries(songs)) {
  const xml = buildMusicXml(title, notes);
  writeFileSync(join(outDir, `${id}.musicxml`), xml, 'utf8');
  console.log(`✓ 生成 ${id}.musicxml (${title})`);
}
console.log('全部完成 →', outDir);
