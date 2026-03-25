# AI Judgment Follow-up Lean-30 — Networked Version / AI 判读引导实验 Lean-30 — 网络版

## Overview / 概览
This is the networked Lean-30 follow-up runner for the AI Judgment Micro-Intervention study. It preserves the AI-free pre/post skeleton while compressing the session to `4 pretest items + 2 targeted scenes + 4 posttest items + short interview`.
这是 AI 判读微干预研究的 Lean-30 follow-up 网络运行器。它保留 AI-free 前后测骨架，同时把总 session 压缩为 `前测 4 题 + 定向场景 2 个 + 后测 4 题 + 短访谈`。

## What This Runner Is For / 适用范围
- Follow-up study runtime only / 仅用于 follow-up 实验运行。
- Keeps the original v1 `networked/` runtime untouched / 不改动原始 v1 `networked/` 运行器。
- Recommended when you want the shorter revise-focused design rather than the original full-length pilot / 当你需要短时、突出 `Reject vs Revise vs Accept with boundary` 的 follow-up 设计时，优先使用本运行器。

## Canonical Documents / 对应规范文档
- Protocol / 实验协议: `../experiment_protocol_v2_followup_30mins.md`
- Item matrix / 题目矩阵: `../item_matrix_v2_followup.md`
- Materials contract / 题库材料: `../materials_v2_followup.json`
- System PRD / 系统 PRD: `../system_design_prd_v2_followup.md`

## Requirements / 环境要求
- **Node.js**: 18.x or higher / 18.x 或更高版本
- **Browser**: Modern web browser (Chrome, Edge, Firefox, Safari) / 现代浏览器
- **Dependencies**: None (pure Node.js implementation) / 无第三方依赖（纯 Node.js 实现）

## Quick Start / 快速启动
1. Navigate to the `networked_v2_followup` folder / 进入 `networked_v2_followup` 文件夹:
   ```bash
   cd networked_v2_followup
   ```
2. Start the server / 启动服务器:
   ```bash
   npm start
   # or / 或
   node server.js
   ```
3. Custom Port (optional) / 自定义端口（可选）:
   ```bash
   PORT=3000 node server.js
   ```

## Access URLs / 访问地址
By default on port 3000 / 默认端口 3000:
- **Participant Client / 参与者端**: `http://[IP_ADDRESS]/participant/`
- **Operator Dashboard / 主试控制台**: `http://[IP_ADDRESS]/dashboard/`
- **Language Switch / 语言切换**: Append `?lang=en` for English. / 在 URL 后添加 `?lang=en` 以切换为英文环境。
  - *Example / 示例*: `http://[IP_ADDRESS]/participant/?lang=en`

## Key Features / 主要功能
- **Lean-30 session flow / 30 分钟内流程**: Uses `4 pre + 2 scenes + 4 post + 3 fixed interview prompts`. / 使用 `前测 4 题 + 场景 2 个 + 后测 4 题 + 3 个固定访谈问题` 的紧凑流程。
- **Real-time Monitoring / 实时监控**: Operator sees participant progress and responses instantly via WebSockets. / 主试可通过 WebSocket 实时查看参与者的进度和回答。
- **Operator Approval / 主试审批**: Participants wait for operator approval after pretest profiling before entering targeted scenes. / 参与者在前测诊断后需等待主试确认干预方向，再进入定向场景。
- **Zero-Dependency / 零依赖**: Pure Node.js implementation of HTTP and WebSocket (RFC 6455) servers. / 使用纯 Node.js 实现的 HTTP 和 WebSocket 服务，无外部库依赖。

## Data Management / 数据管理
- Lean-30 runtime writes session data to `networked_v2_followup/data_lean30/`. / Lean-30 运行时会把会话数据写入 `networked_v2_followup/data_lean30/`。
- `*_session.json`: Automatic real-time persistence / 实时自动持久化数据。
- `*_final.json`: Exported finalized study records / 导出的最终实验记录。
- `exportedAt`: Persisted to both `*_session.json` and `*_final.json` after operator export. / 主试导出后，`exportedAt` 会同时写入 `*_session.json` 与 `*_final.json`。

## Materials Binding / 素材绑定
- This runner loads [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json) as its canonical zh materials.
- 该运行器以 [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json) 作为 canonical 中文材料。

---

## Technical Notes / 技术说明
- **Transport**: Native WebSocket handshake and framing. / 使用原生 WebSocket 握手和分帧协议。
- **Persistence**: Synchronous file writes to the local `data/` folder for high reliability during local pilots. / 本地试点期间，通过同步文件写入确保数据可靠性。
- **I18n**: Client-side translation strings managed in `i18n.js` and server-side material routing. / 客户端翻译字符串由 `i18n.js` 管理，服务端根据请求参数路由素材。

## Operator Checklist / 主试快速清单
1. Start the server in `networked_v2_followup/`. / 在 `networked_v2_followup/` 中启动服务。
2. Open the dashboard and keep it visible during the session. / 打开 dashboard 并全程保持可见。
3. Let the participant finish the `4` AI-free pretest items. / 让参与者完成 `4` 道 AI-free 前测。
4. Confirm the profiling recommendation on the dashboard. / 在 dashboard 上确认 profiling recommendation。
5. Observe two targeted scenes and the `4` AI-free posttest items. / 观察两个定向场景以及 `4` 道 AI-free 后测。
6. Record the three fixed interview prompts on the dashboard. / 在 dashboard 上记录 `3` 个固定访谈问题。
7. Export the participant once the dashboard shows `已完成`. / dashboard 显示 `已完成` 后导出该参与者。

## Verified Runtime Status / 已验证运行状态
- Real participant/dashboard walkthrough completed on the Lean-30 flow. / 已完成 Lean-30 双端真实 walkthrough。
- Verified sequence: `consent -> warmup -> pretest x4 -> profile approval -> scenes x2 -> posttest x4 -> interview -> debrief -> export`. / 已验证链路：`同意 -> 热身 -> 前测 4 题 -> 干预方向确认 -> 场景 2 个 -> 后测 4 题 -> 访谈 -> 总结页 -> 导出`。
- Known console noise: missing `favicon.ico` only. / 当前已知浏览器控制台噪声仅为 `favicon.ico` 缺失。
