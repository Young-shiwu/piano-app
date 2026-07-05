# 钢琴软件项目交接说明

## 当前状态

用户想做一个对标虫虫钢琴的免费钢琴 App，先通过免费体验吸引用户，后续再考虑广告或会员盈利。

已经完成第一版产品规划：

- `docs/piano_app_product_plan.md`

目前还没有开始写代码，也没有初始化前端/后端项目。

## 规划结论

不要一开始完整复刻虫虫钢琴。建议先做一个 MVP：

- 免费曲谱库
- 曲谱搜索/分类/收藏
- PDF 或图片曲谱阅读器
- MIDI 播放
- 变速练习
- A-B 片段循环
- 左右手分轨练习
- 底部虚拟钢琴键盘高亮
- 练习记录

第一版不要做：

- 实时 AI 纠错
- 自动五线谱转简谱
- AI 指法生成
- 重社区
- 复杂课程体系
- 搬运或破解竞品曲谱

原因：版权、内容、音频识别和移动端低延迟都不是第一版应该承担的复杂度。

## 建议技术路线

建议先做 Web/PWA，再封装移动端：

- Frontend: React + Vite
- Mobile wrapper later: Capacitor
- Score rendering: PDF.js
- MIDI / audio playback: Tone.js or similar browser MIDI/audio library
- Backend MVP: Supabase or Node.js/NestJS + PostgreSQL
- Storage: S3-compatible object storage

第一阶段可以只做前端可点击原型，用 mock data，不接真实后端。

## 最重要风险

### 1. 版权

不能直接搬运虫虫钢琴或其他平台的付费/未授权曲谱。

建议内容来源：

- 公版古典曲谱
- 用户个人上传，仅个人使用
- 原创曲谱
- 后续与编配者合作分成

### 2. 技术范围失控

实时纠错和 AI 陪练很容易把项目拖进音频识别、降噪、延迟、评分模型等复杂问题。

建议先用 MIDI 跟练验证留存，再决定是否投入 AI 陪练。

### 3. 内容不足

早期建议先准备 100-300 首入门、公版、经典曲目，每首尽量有 PDF + MIDI。

## 建议下一步

请先 review `docs/piano_app_product_plan.md`，重点判断：

1. MVP 范围是否还可以再砍。
2. React + Vite + PWA + Capacitor 是否适合作为第一阶段路线。
3. PDF.js + Tone.js 是否能覆盖第一版核心体验。
4. 是否需要先做产品原型，还是直接初始化技术项目。
5. 内容和版权策略是否有遗漏。

在用户确认之前，不建议直接初始化项目或开始写正式 App。

## 如果要开始执行

推荐顺序：

1. 做手机端可点击原型。
2. 用户确认页面和流程。
3. 初始化 React/Vite 项目。
4. 实现 mock 曲谱库。
5. 实现曲谱阅读器。
6. 实现 MIDI 播放和虚拟键盘高亮。
7. 再考虑后端、登录、上传和收藏。

