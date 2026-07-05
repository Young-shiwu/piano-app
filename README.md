# 自由钢琴 🎹（对标虫虫钢琴的免费钢琴练习 App）

> 免费的钢琴曲谱与跟弹练习 App。核心差异化：**跟弹高亮**（谱面光标跟随 + 键盘同步点亮）。
> 当前阶段：**V0.1 可点击原型**（React + Vite + PWA，手机浏览器可用，未接后端）。

## 两个 AI 怎么配合看这里

- `AGENTS.md` —— Claude 和 Codex 的**协作约定 + 分工 + 已锁定的技术决策**。开工前先读。
- `docs/piano_app_product_plan.md` —— 产品规划主文档（Codex 主责）。
- `docs/decisions.md` —— 技术决策记录（ADR）。

## 目录

```
钢琴软件/
├── AGENTS.md            # 双 AI 协作约定
├── docs/                # 产品规划 + 技术决策
└── app/                 # 前端工程（本原型）
    ├── src/pages/       # 6 个页面：首页/曲谱库/详情/看谱/练习/我的
    ├── src/components/  # 钢琴键盘、曲谱卡、底部导航
    ├── src/lib/         # 跟弹引擎(followPlayer)、音频(audio)、音符工具(music)、本地存储
    ├── src/data/        # songNotes.js(音符数据源) + scores.ts(曲谱库元数据)
    ├── src/assets/scores/  # 生成的 MusicXML 曲谱
    └── scripts/gen-scores.mjs  # 曲谱生成器（音符数组 → MusicXML）
```

## 本地运行

```bash
cd app
npm install          # 首次；国内建议 npm config set registry https://registry.npmmirror.com
npm run dev -- --host
```

- 电脑访问：http://localhost:5173/
- **手机访问**（需与电脑同一 WiFi）：终端里 `Network:` 那行的地址，例如 http://192.168.31.62:5173/

## 已实现（V0.1）

- ✅ 6 个页面完整可点击流转
- ✅ 曲谱库搜索 / 分类筛选
- ✅ **跟弹核心**：OSMD 渲染五线谱 + 播放光标高亮 + 键盘同步高亮 + 变速播放（3 首公版曲：小星星 / 欢乐颂 / 玛丽有只小羊羔）
- ✅ 收藏 + 练习记录（本地存储）+ 练习统计
- ✅ 曲谱来源/版权标注

## 技术栈

React 19 + TypeScript + Vite · 乐谱渲染 OpenSheetMusicDisplay · 音频 Tone.js · 路由 react-router

## 下一步（V0.2 起）

见 `docs/piano_app_product_plan.md` 版本路线：接后端(Supabase)、账号、真实曲谱上传、更多公版曲、Capacitor 封装 App。
