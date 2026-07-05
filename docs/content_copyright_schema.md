# 曲谱内容与版权字段规范

## 1. 内容主格式

跟弹内容主格式锁定为：

- `MusicXML`：给 OSMD 渲染谱面和光标高亮
- `notes` 音符数组：给 Tone.js 发声、键盘高亮、练习进度使用

PDF/图片只作为：

- 看原谱
- 下载
- 打印
- 版权证明或原始附件

PDF/图片不能作为跟弹高亮的主数据源。

## 2. 最小版权字段

每首曲谱必须有：

```ts
copyright: 'public-domain' | 'user-upload' | 'licensed'
```

含义：

- `public-domain`：公版曲、传统民歌、公版练习材料，平台可优先公开展示。
- `user-upload`：用户上传内容，默认只允许个人空间使用，公开前必须审核。
- `licensed`：平台自有、合作编配者授权、购买授权或明确许可内容。

## 3. 建议扩展字段

V0.1 已在 `app/src/data/songNotes.js` 使用：

```ts
copyrightInfo: {
  sourceType: 'public-domain' | 'user-upload' | 'licensed',
  source: string,
  reviewStatus: 'prototype-simplified' | 'verified' | 'needs-review',
  usage: string
}
```

字段说明：

- `sourceType`：和 `copyright` 保持一致，方便后端审核和筛选。
- `source`：来源说明，例如作曲年份、传统民歌、公版练习来源、授权方。
- `reviewStatus`：
  - `prototype-simplified`：原型用简化谱，能验证跟弹，但正式上线前要人工复核。
  - `verified`：已完成版权和乐谱准确性复核。
  - `needs-review`：来源、版权或乐谱准确性还未确认。
- `usage`：当前可用范围，例如“仅原型演示”“可公开展示”“仅个人上传空间可见”。

## 4. 上线审核规则

正式上线前，`public-domain` 曲目至少要检查：

- 作曲者死亡年份是否满足目标地区公版要求。
- 如果是传统民歌，确认没有直接采用现代受版权保护的编配版本。
- 如果是简化改编，确认改编由平台自制或已授权。
- MusicXML、MIDI、标题、作曲者、来源说明一致。

`user-upload` 曲目默认策略：

- 用户可上传给自己练习。
- 未审核前不进入公共搜索、推荐、榜单。
- 公开分享前必须补齐来源、授权声明和审核状态。

`licensed` 曲目默认策略：

- 记录授权方、授权范围、期限、地域、分成方式。
- 授权过期后自动下架或转为仅个人不可公开状态。

## 5. 当前 V0.1 内容状态

当前已生成 102 首 `public-domain` / 公版练习类 MusicXML。

它们适合：

- V0.1 跟弹体验验证
- 曲库浏览和搜索演示
- OSMD 光标高亮压力测试

它们不等于最终可商业上线曲库。正式上线前仍需做一次人工音乐复核和地区版权复核。

