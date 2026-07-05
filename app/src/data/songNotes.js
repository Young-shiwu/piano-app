// 音符序列 —— 单一数据源（Single Source of Truth）
// 同时被两处使用：
//   1) scripts/gen-scores.mjs 生成 MusicXML（给 OSMD 渲染谱面）
//   2) 运行时跟弹引擎按此序列发声 + 高亮键盘
//
// dur 单位 = 四分音符（1=四分, 2=二分, 3=附点二分, 4=全音符, 0.5=八分）
// 每个音符 = [step, octave, dur]。当前 V0.1 内容流水线仅使用 C 大调自然音单声部旋律。
//
// copyright 字段只能是：
// - public-domain: 公版旋律 / 公版练习材料，优先用于可公开曲库
// - user-upload: 用户上传，默认仅个人使用，公开前必须审核
// - licensed: 平台已获得授权或自有授权内容

const C = 4;
const LOW = 3;
const HIGH = 5;

const palette = ['#7C6BF5', '#F5A623', '#41C7A8', '#E85D9E', '#5B8DEF', '#9B72F2', '#4EC0E4', '#57C289'];
const pd = (source, review = 'prototype-simplified') => ({
  copyright: 'public-domain',
  copyrightInfo: {
    sourceType: 'public-domain',
    source,
    reviewStatus: review,
    usage: '可用于 V0.1 原型跟弹；正式上线前仍需人工复核乐谱准确性和地区版权状态。',
  },
});
const n = (step, dur = 1, octave = C) => [step, octave, dur];
const notes = (steps, dur = 1, octave = C) => steps.map((step) => n(step, dur, octave));
const repeat = (arr, times) => Array.from({ length: times }, () => arr).flat();

function song(id, title, composer, difficulty, genre, source, noteList, colorIndex = 0) {
  return [id, {
    title,
    composer,
    difficulty,
    genre,
    hasMidi: true,
    hasFollow: true,
    color: palette[colorIndex % palette.length],
    ...pd(source),
    notes: noteList,
  }];
}

function exercise(id, title, difficulty, genre, source, noteList, colorIndex = 0) {
  return song(id, title, '公版基础练习', difficulty, genre, source, noteList, colorIndex);
}

const baseMelodies = [
  song('twinkle', '小星星 Twinkle Twinkle', '传统童谣 / 莫扎特主题', 1, '入门', '18 世纪法国童谣 Ah! vous dirai-je, maman 旋律', [
    ...notes(['C','C','G','G','A','A']), n('G',2), ...notes(['F','F','E','E','D','D']), n('C',2),
    ...notes(['G','G','F','F','E','E']), n('D',2), ...notes(['G','G','F','F','E','E']), n('D',2),
    ...notes(['C','C','G','G','A','A']), n('G',2), ...notes(['F','F','E','E','D','D']), n('C',2),
  ], 0),
  song('ode-to-joy', '欢乐颂 Ode to Joy', '贝多芬', 2, '古典', 'Beethoven Symphony No. 9 theme, 1824', [
    ...notes(['E','E','F','G','G','F','E','D','C','C','D','E']), n('E',3), n('D'),
    ...notes(['E','E','F','G','G','F','E','D','C','C','D','E']), n('D',3), n('C'),
  ], 1),
  song('mary', '玛丽有只小羊羔 Mary Had a Little Lamb', '传统童谣', 1, '儿童', '19 世纪美国童谣', [
    ...notes(['E','D','C','D','E','E']), n('E',2), ...notes(['D','D']), n('D',2), ...notes(['E','G']), n('G',2),
    ...notes(['E','D','C','D','E','E','E','E','D','D','E','D']), n('C',4),
  ], 2),
  song('happy-birthday', '生日快乐歌 Happy Birthday', '传统', 1, '入门', 'Good Morning to All / Happy Birthday melody, public-domain status widely recognized after 2016 US settlement', [
    n('C',0.5), n('C',0.5), n('D'), n('C'), n('F'), n('E',2),
    n('C',0.5), n('C',0.5), n('D'), n('C'), n('G'), n('F',2),
    n('C',0.5), n('C',0.5), n('C',1,HIGH), n('A'), n('F'), n('E'), n('D',2),
    n('B',0.5), n('B',0.5), n('A'), n('F'), n('G'), n('F',2),
  ], 3),
  song('jingle-bells', '铃儿响叮当 Jingle Bells', 'James Lord Pierpont', 1, '儿童', 'Jingle Bells, 1857', [
    ...notes(['E','E','E']), n('E',2), ...notes(['E','E','E']), n('E',2),
    ...notes(['E','G','C','D']), n('E',4),
    ...notes(['F','F','F','F','F','E','E','E','E','D','D','E']), n('D',2), n('G',2),
  ], 4),
  song('london-bridge', '伦敦桥 London Bridge', '传统童谣', 1, '儿童', 'English nursery rhyme, traditional', [
    ...notes(['G','A','G','F','E','F','G']), n('D',2), n('E'), n('F',2), n('E'), n('F',2),
    ...notes(['G','A','G','F','E','F','G']), n('D',2), n('G'), n('E',2), n('C',3),
  ], 5),
  song('row-row-row', '划船歌 Row Row Row Your Boat', '传统轮唱', 1, '儿童', 'English nursery round, first printed in 1852', [
    n('C',2), n('C'), n('C'), n('D',0.5), n('E',0.5), n('E',1), n('D',0.5), n('E',0.5), n('F',0.5), n('G',0.5),
    n('C',1,HIGH), n('C',0.5,HIGH), n('C',0.5,HIGH), n('G',0.5), n('G',0.5), n('E',0.5), n('E',0.5),
    n('C',0.5), n('C',0.5), n('G',0.5), n('F',0.5), n('E',0.5), n('D',0.5), n('C',2),
  ], 6),
  song('hot-cross-buns', '热十字面包 Hot Cross Buns', '传统童谣', 1, '入门', 'English street cry / nursery tune, traditional', [
    n('E'), n('D'), n('C',2), n('E'), n('D'), n('C',2),
    ...notes(['C','C','C','C','D','D','D','D']), n('E'), n('D'), n('C',2),
  ], 7),
  song('old-macdonald', '老麦克唐纳 Old MacDonald', '传统童谣', 1, '儿童', 'Traditional children song, early 20th century public-domain variants', [
    ...notes(['G','G','G','D','E','E','D']), n('B',1,LOW), n('B',1,LOW), n('A',1,LOW), n('A',1,LOW), n('G',2,LOW),
    ...notes(['D','D','G','G','G','D','E','E','D']), n('B',1,LOW), n('B',1,LOW), n('A',1,LOW), n('A',1,LOW), n('G',2,LOW),
  ], 0),
  song('yankee-doodle', '扬基歌 Yankee Doodle', '传统', 2, '入门', '18 世纪传统旋律', [
    ...notes(['C','C','D','E','C','E','D','G','C','C','D','E','C']), n('B',2,LOW),
    ...notes(['C','C','D','E','F','E','D','C','B','G','A','B']), n('C',2),
  ], 1),
  song('frere-jacques', '两只老虎 / Frere Jacques', '法国传统', 1, '儿童', 'French folk round, traditional', [
    ...notes(['C','D','E','C','C','D','E','C','E','F']), n('G',2), ...notes(['E','F']), n('G',2),
    ...notes(['G','A','G','F','E','C','G','A','G','F','E','C','C','G',]), n('C',2), ...notes(['C','G']), n('C',2),
  ], 2),
  song('au-clair', '月光下 Au Clair de la Lune', '法国民歌', 1, '入门', 'French folk song, 18 世纪', [
    ...notes(['C','C','C','D','E']), n('D',2), ...notes(['C','E','D','D','C']), n('G',2,LOW),
    ...notes(['C','C','C','D','E']), n('D',2), ...notes(['C','E','D','D','C']), n('C',2),
  ], 3),
  song('lightly-row', '轻轻划 Lightly Row', '德国民歌', 1, '儿童', 'Hanschen klein / Lightly Row, traditional', [
    ...notes(['G','E','E','F','D','D','C','D','E','F']), n('G',2), n('G',2),
    ...notes(['G','E','E','F','D','D','C','E','G','G']), n('C',4),
  ], 4),
  song('aunt-rhody', '告诉罗迪阿姨 Go Tell Aunt Rhody', '传统民歌', 1, '入门', 'Traditional folk melody', [
    ...notes(['G','F','E','D','C','D','E','F','G','G','G']), n('G',1), n('F'), n('E'), n('D'), n('E',4),
    ...notes(['F','E','D','C','D','E','F','G','F','E','D']), n('C',4),
  ], 5),
  song('aura-lee', '奥拉莉 Aura Lee', 'George R. Poulton', 2, '古典', 'Aura Lee, 1861', [
    ...notes(['C','D','E','F','G','G']), n('E',2), ...notes(['F','E','D','E']), n('C',4),
    ...notes(['G','A','G','F','E','F','G','E','C','D','E','F']), n('D',4),
  ], 6),
  song('amazing-grace', '奇异恩典 Amazing Grace', '传统赞美诗', 2, '古典', 'New Britain tune, 1835 hymnal tradition', [
    n('G',2,LOW), n('C',3), n('E'), n('C',2), n('E',2), n('D',3), n('C'), n('A',2,LOW), n('G',2,LOW),
    n('G',2,LOW), n('C',3), n('E'), n('C',2), n('E',2), n('D',4),
  ], 7),
  song('when-saints', '圣者的行进 When the Saints Go Marching In', '传统灵歌', 2, '入门', 'Traditional spiritual, public-domain variants', [
    ...notes(['C','E','F','G']), n('C',2,HIGH), ...notes(['E','F','G']), n('C',2,HIGH),
    ...notes(['E','F','G','E','C','E','D']), n('D',4),
    ...notes(['E','E','D','C','C','E','G','G','F']), n('E',4),
  ], 0),
  song('scarborough-fair', '斯卡布罗集市 Scarborough Fair', '英国民歌', 2, '古典', 'Traditional English ballad, public-domain melody', [
    ...notes(['D','D','A','A','E','E','D','C','D','E','D']), n('C',2), n('A',2,LOW),
    ...notes(['D','E','F','E','D','C','D','E','D','C']), n('A',4,LOW),
  ], 1),
  song('greensleeves', '绿袖子 Greensleeves', '英国民歌', 3, '古典', 'Traditional English melody, 16 世纪', [
    n('E'), n('G'), n('A',2), n('B'), n('C',1,HIGH), n('B'), n('A'), n('G'), n('E'), n('F'), n('D',2),
    n('E'), n('F'), n('G',2), n('E'), n('E'), n('D'), n('E'), n('F'), n('D'), n('B',2,LOW),
  ], 2),
  song('auld-lang-syne', '友谊地久天长 Auld Lang Syne', '苏格兰民歌', 2, '古典', 'Scottish traditional melody', [
    n('C'), n('F'), n('E'), n('F'), n('A'), n('G'), n('F'), n('G'), n('A'), n('F'), n('F'), n('A'), n('C',1,HIGH), n('D',1,HIGH),
    n('C',2,HIGH), n('A'), n('A'), n('F'), n('G'), n('F'), n('G'), n('A'), n('F'), n('D'), n('D'), n('C',4),
  ], 3),
  song('canon-theme', '卡农主题 Canon in D（C 大调入门片段）', '帕赫贝尔', 3, '古典', 'Pachelbel Canon, 1680s', [
    ...notes(['C','G','A','E','F','C','F','G']), ...notes(['E','C','D','B','C','G','C','D'], 1, C),
    ...notes(['C','D','E','G','A','G','E','C','F','E','D','C','D','E','F','G']),
  ], 4),
  song('fur-elise-theme', '致爱丽丝主题 Fur Elise（入门片段）', '贝多芬', 3, '古典', 'Beethoven Bagatelle No. 25, 1810', [
    ...notes(['E','D','E','D','E','B','D','C']), n('A',2,LOW),
    ...notes(['C','E','A']), n('B',2), ...notes(['E','G','B']), n('C',2,HIGH),
    ...notes(['E','D','E','D','E','B','D','C']), n('A',4,LOW),
  ], 5),
  song('turkish-march-theme', '土耳其进行曲 Turkish March（入门片段）', '莫扎特', 4, '古典', 'Mozart Piano Sonata K.331 III, 1783', [
    ...notes(['B','A','G','A','C','D','E','D','C','B','C','E','A','G','F','E'], 0.5),
    ...notes(['D','E','F','E','D','C','B','C','D','C','B','A','G','A','B','C'], 0.5),
    ...notes(['C','E','G','C','G','E','C','E','G','C','G','E','C','D','E','C'], 0.5),
  ], 6),
  song('minuet-g', 'G 大调小步舞曲（C 大调入门片段）', 'Christian Petzold / 巴赫作品集', 3, '古典', 'Notebook for Anna Magdalena Bach, 1725', [
    ...notes(['G','C','D','E','F','G','C','C','A','F','G','A','B','C','C','C'], 0.5),
    ...notes(['G','E','F','G','A','B','C','D','E','F','G','E','C','D','E','C'], 0.5),
  ], 7),
  song('brahms-lullaby', '勃拉姆斯摇篮曲 Brahms Lullaby', '勃拉姆斯', 2, '古典', 'Wiegenlied Op. 49 No. 4, 1868', [
    n('G'), n('G'), n('B',2), n('G'), n('G'), n('B',2), n('G'), n('B'), n('E',1,HIGH), n('D',2,HIGH), n('C',2,HIGH),
    n('A'), n('A'), n('C',2,HIGH), n('A'), n('A'), n('C',2,HIGH), n('A'), n('C',1,HIGH), n('G'), n('B',2), n('C',2,HIGH),
  ], 0),
  song('home-sweet-home', '甜蜜的家 Home Sweet Home', 'Henry Bishop', 2, '古典', 'Home! Sweet Home!, 1823', [
    ...notes(['C','E','G','E','C','D','E','F','G','E','C','D','E','F','G','A']), n('G',4),
    ...notes(['A','G','F','E','D','E','F','G','E','C','D','E','F','D']), n('C',4),
  ], 1),
  song('oh-susanna', '哦！苏珊娜 Oh! Susanna', 'Stephen Foster', 2, '入门', 'Oh! Susanna, 1848', [
    ...notes(['C','D','E','G','G','A','G','E','C','D','E','E','D','C','D','E']),
    ...notes(['C','D','E','G','G','A','G','E','C','D','E','D']), n('C',4),
  ], 2),
  song('camptown-races', '康城赛马 Camptown Races', 'Stephen Foster', 2, '入门', 'Camptown Races, 1850', [
    ...notes(['G','E','G','E','G','A','G','E','D','E','G','E','D','C','D','E']),
    ...notes(['G','E','G','E','G','A','G','E','D','E','G','E','D']), n('C',3), n('C'),
  ], 3),
  song('blue-bells', '苏格兰蓝铃花 Blue Bells of Scotland', '苏格兰民歌', 2, '古典', 'Traditional Scottish folk melody', [
    ...notes(['C','E','G','A','G','E','C','D','E','F','E','D','C','E','G','A']),
    ...notes(['C','B','A','G','E','G','F','E','D','E','F','G']), n('C',4),
  ], 4),
  song('long-long-ago', '很久以前 Long Long Ago', 'Thomas Haynes Bayly', 2, '入门', 'Long Long Ago, 1833', [
    ...notes(['G','E','E','F','D','D','C','D','E','F']), n('G',2), n('G',2),
    ...notes(['A','G','F','E','D','E','F','G','E','C','D','E']), n('C',4),
  ], 5),
];

const scalePatterns = [
  ['C','D','E','F','G','A','B','C'],
  ['C','E','G','C','B','G','E','C'],
  ['C','D','E','G','E','D','C','G'],
  ['C','D','E','F','G','F','E','D'],
  ['C','E','D','F','E','G','F','A'],
  ['C','D','C','E','D','F','E','G'],
  ['C','G','E','G','C','G','E','G'],
  ['C','D','E','F','E','D','C','G'],
  ['C','E','G','A','G','E','D','C'],
  ['C','D','E','D','E','F','G','F'],
  ['C','B','A','G','F','E','D','C'],
  ['C','E','F','G','A','G','F','E'],
];

const fiveFingerPatterns = [
  ['C','D','E','F','G','F','E','D'],
  ['C','E','D','F','E','G','F','D'],
  ['C','D','C','E','C','F','C','G'],
  ['C','E','G','E','C','D','F','D'],
  ['C','D','E','D','C','E','F','E'],
  ['G','F','E','D','C','D','E','F'],
  ['C','C','D','D','E','E','F','F'],
  ['C','G','F','E','D','C','D','E'],
  ['C','E','C','F','C','G','F','E'],
  ['C','D','E','F','G','G','F','E'],
];

const hanonPatterns = [
  ['C','E','F','G','A','G','F','E'],
  ['C','D','E','F','G','F','E','D'],
  ['C','E','D','F','E','G','F','A'],
  ['C','D','F','E','G','F','A','G'],
  ['C','E','G','E','D','F','A','F'],
  ['C','D','E','G','F','E','D','C'],
  ['C','F','E','D','C','G','F','E'],
  ['C','E','F','D','E','G','A','F'],
  ['C','D','E','F','D','E','F','G'],
  ['G','A','G','F','E','F','E','D'],
];

const arpeggioPatterns = [
  ['C','E','G','C','G','E','C','E'],
  ['C','F','A','C','A','F','C','F'],
  ['G','B','D','G','D','B','G','D'],
  ['C','E','G','E','C','G','E','C'],
  ['A','C','E','A','E','C','A','E'],
];

const sightPatterns = [
  ['C','D','E','F','G','A','G','F','E','D','C','D','E','F','G','C'],
  ['C','E','D','F','E','G','F','A','G','B','A','G','F','E','D','C'],
  ['G','E','F','D','E','C','D','B','C','D','E','F','G','A','G','C'],
  ['C','C','D','E','F','F','E','D','C','D','E','G','F','E','D','C'],
  ['C','G','A','G','F','E','D','C','E','F','G','A','G','E','D','C'],
];

function cyclePattern(pattern, repeats = 2, dur = 0.5, octave = C) {
  return repeat(notes(pattern, dur, octave), repeats);
}

const scaleExercises = Array.from({ length: 12 }, (_, i) => {
  const pattern = scalePatterns[i % scalePatterns.length];
  const dur = i < 6 ? 0.5 : 1;
  return exercise(
    `c-major-scale-${String(i + 1).padStart(2, '0')}`,
    `C 大调音阶跟弹 ${String(i + 1).padStart(2, '0')}`,
    i < 6 ? 1 : 2,
    '入门',
    'C major scale and public-domain elementary scale material',
    cyclePattern(pattern, dur === 0.5 ? 4 : 2, dur),
    i,
  );
});

const fiveFingerExercises = Array.from({ length: 20 }, (_, i) => {
  const pattern = fiveFingerPatterns[i % fiveFingerPatterns.length];
  const dur = i < 10 ? 0.5 : 1;
  return exercise(
    `five-finger-${String(i + 1).padStart(2, '0')}`,
    `五指固定位置练习 ${String(i + 1).padStart(2, '0')}`,
    i < 12 ? 1 : 2,
    '入门',
    'Public-domain five-finger elementary piano exercise pattern',
    cyclePattern(pattern, dur === 0.5 ? 4 : 2, dur),
    i + 2,
  );
});

const hanonExercises = Array.from({ length: 20 }, (_, i) => {
  const pattern = hanonPatterns[i % hanonPatterns.length];
  return exercise(
    `hanon-basic-${String(i + 1).padStart(2, '0')}`,
    `哈农风格基础练习 ${String(i + 1).padStart(2, '0')}`,
    i < 10 ? 2 : 3,
    '考级',
    'Hanon-style public-domain technical exercise pattern',
    cyclePattern(pattern, 4, 0.5),
    i + 4,
  );
});

const arpeggioExercises = Array.from({ length: 10 }, (_, i) => {
  const pattern = arpeggioPatterns[i % arpeggioPatterns.length];
  return exercise(
    `arpeggio-basic-${String(i + 1).padStart(2, '0')}`,
    `分解和弦入门 ${String(i + 1).padStart(2, '0')}`,
    i < 5 ? 2 : 3,
    '古典',
    'Public-domain triad arpeggio study pattern',
    cyclePattern(pattern, 4, 0.5),
    i + 6,
  );
});

const sightReadingExercises = Array.from({ length: 10 }, (_, i) => {
  const pattern = sightPatterns[i % sightPatterns.length];
  return exercise(
    `sight-reading-${String(i + 1).padStart(2, '0')}`,
    `视奏小练习 ${String(i + 1).padStart(2, '0')}`,
    i < 5 ? 1 : 2,
    '入门',
    'Public-domain elementary sight-reading pattern',
    cyclePattern(pattern, 2, 0.5),
    i + 1,
  );
});

export const songs = Object.fromEntries([
  ...baseMelodies,
  ...scaleExercises,
  ...fiveFingerExercises,
  ...hanonExercises,
  ...arpeggioExercises,
  ...sightReadingExercises,
]);
