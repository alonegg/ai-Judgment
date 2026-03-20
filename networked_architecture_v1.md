# Networked Architecture Design v1

## 1 Design Goal

将现有单机原型升级为联网系统，支持 4-5 名参与者同时在各自设备上作答，操作员通过一个 Dashboard 实时监控所有参与者进度并集中处理需要人工介入的环节。

核心原则：**参与者能自主完成的阶段全部自主完成，操作员只在必要时介入**。

---

## 2 Operator Dependency Analysis

在设计联网架构前，先明确实验 9 个阶段各自对操作员的依赖程度：

| Stage | 参与者可自主？ | 操作员必须介入？ | 说明 |
|-------|--------------|----------------|------|
| Consent | ✅ 完全自主 | ❌ | 阅读知情同意书、输入 ID |
| Warmup | ✅ 完全自主 | ❌ | 看示例、熟悉格式 |
| Pretest ×8 | ✅ 完全自主 | ❌（仅监控） | 独立答题，操作员只需看进度和时间 |
| Profile | ⚠️ 部分自主 | ✅ 可能需要 | 系统自动推荐，但 tie-breaking 需操作员确认 |
| Scenes ×4 | ⚠️ 取决于设计 | ✅ 可能需要 | Script 是结构化的，但操作员需观察和记录 |
| Transition | ✅ 完全自主 | ❌ | 只读提示语 |
| Posttest ×8 | ✅ 完全自主 | ❌（仅监控） | 独立答题 |
| Interview | ❌ 需操作员 | ✅ 必须 | 口头问答，操作员记录 |
| Debrief/Export | ⚠️ | ✅ | 操作员做 pattern coding + 导出 |

**关键发现**：9 个阶段中，只有 3 个真正需要操作员实时介入（Profile 确认、Scene 观察、Interview）。前测和后测合计约 40-48 分钟，参与者完全可以自主完成。

---

## 3 Overall Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Local Network (WiFi)                     │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐       ┌─────────────┐   │
│  │ Participant  │  │ Participant  │  ...  │ Participant  │  │
│  │  Browser P01 │  │  Browser P02 │       │  Browser P05 │  │
│  │  (phone/     │  │  (phone/     │       │  (phone/     │  │
│  │   laptop)    │  │   laptop)    │       │   laptop)    │  │
│  └──────┬───────┘  └──────┬───────┘       └──────┬───────┘  │
│         │                 │                       │         │
│         └────────┬────────┴──────────┬────────────┘         │
│                  │    WebSocket      │                      │
│                  ▼                   ▼                      │
│         ┌────────────────────────────────┐                  │
│         │     Node.js Server             │                  │
│         │  ┌──────────┐ ┌─────────────┐  │                  │
│         │  │ WS Hub   │ │ Session DB  │  │                  │
│         │  │ (real-   │ │ (in-memory  │  │                  │
│         │  │  time)   │ │  + JSON     │  │                  │
│         │  │          │ │  file save) │  │                  │
│         │  └──────────┘ └─────────────┘  │                  │
│         │  ┌──────────────────────────┐  │                  │
│         │  │ Static File Server      │  │                  │
│         │  │ (participant + operator  │  │                  │
│         │  │  HTML/JS/CSS)           │  │                  │
│         │  └──────────────────────────┘  │                  │
│         └────────────────┬───────────────┘                  │
│                          │                                  │
│                          ▼                                  │
│         ┌────────────────────────────────┐                  │
│         │     Operator Dashboard         │                  │
│         │     (Browser on operator's     │                  │
│         │      laptop)                   │                  │
│         └────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| Server | Node.js (vanilla, no framework) | 零依赖安装快，单文件即可运行 |
| Real-time | ws (WebSocket library) | 双向实时，比 polling 延迟低 |
| Static Serving | Node built-in http module | 同一进程服务静态文件和 WS |
| Data Persistence | In-memory Map + JSON file dump | pilot 无需数据库，JSON 文件即可 |
| Participant UI | 改造现有 app.js | 复用现有 90% 代码，加 WS 上报层 |
| Operator UI | 新建 dashboard.html + dashboard.js | 独立页面，不与参与者端混合 |

### 启动方式

```bash
# 安装唯一依赖
npm install ws

# 启动服务器（默认端口 3000）
node server.js

# 参与者访问：http://<operator-ip>:3000/participant/
# 操作员访问：http://localhost:3000/dashboard/
```

---

## 4 Communication Protocol

### 4.1 Connection Handshake

参与者端连接时发送 `join` 消息，服务器分配 session slot：

```
Participant → Server:
{
  "type": "join",
  "role": "participant",
  "participantId": "P01"
}

Server → Participant:
{
  "type": "joined",
  "sessionId": "sess_20260319_P01",
  "materials": { ... }              // 完整 materials_v1.json
}

Operator → Server:
{
  "type": "join",
  "role": "operator"
}

Server → Operator:
{
  "type": "joined",
  "activeSessions": [ ... ]         // 所有已连接的参与者状态
}
```

### 4.2 Stage Progression Events

参与者每切换阶段或每提交一个 response 时上报：

```
Participant → Server:
{
  "type": "stage_change",
  "participantId": "P01",
  "stage": "pretest",
  "stageIndex": 3,               // 当前阶段中的第几题
  "stageTotal": 8
}

Participant → Server:
{
  "type": "response",
  "participantId": "P01",
  "phase": "pretest",
  "response": {
    "item_id": "PRE_A1",
    "category": "hallucinated-citation",
    "judgment": "Reject",
    "reason": "...",
    "next_action": "flag and do not use this output",
    "confidence": 4,
    "response_time_sec": 135
  }
}
```

Server 将这些事件转发给 operator 端，并存入 session store。

### 4.3 Operator Interventions

操作员可以向特定参与者发送控制指令：

```
Operator → Server:
{
  "type": "operator_action",
  "targetParticipant": "P01",
  "action": "approve_profile",
  "payload": {
    "selectedProfiles": ["hallucination-weak", "scope-generalization-weak"],
    "overrideNote": ""
  }
}

Operator → Server:
{
  "type": "operator_action",
  "targetParticipant": "P01",
  "action": "add_observation",
  "payload": {
    "sceneId": "H1_TUTOR",
    "note": "主动提问为什么 metadata 不匹配"
  }
}

Operator → Server:
{
  "type": "operator_action",
  "targetParticipant": "P01",
  "action": "send_nudge",
  "payload": {
    "message": "可以基于现有信息做出判断"
  }
}
```

Server 转发给对应参与者，参与者端显示通知或执行状态更新。

### 4.4 Heartbeat & Reconnection

```
双向 ping/pong 每 15 秒一次
参与者断线重连时，服务器从 session store 恢复完整状态
操作员端断线重连时，服务器推送所有 active sessions 的最新快照
```

---

## 5 Participant Client Redesign

### 5.1 Changes from Current Prototype

现有 `app.js` 的改造分为三层：

**Transport Layer（新增）**
- 新增 `ws-client.js`，封装 WebSocket 连接、重连、心跳
- 所有状态变更（stage change, response submit）通过此层上报
- 接收操作员指令（approve profile, nudge, pause）

**State Layer（改造）**
- `S` 对象增加 `sessionId`, `wsConnected`, `operatorApproval` 字段
- Profile 阶段改为**等待操作员确认模式**：系统自动推荐后，显示"等待实验员确认..."，操作员在 Dashboard 批准后才继续

**UI Layer（微调）**
- 新增 Toast 通知组件：显示操作员发来的提醒
- Profile 页面新增"等待确认"状态
- Scene 页面移除 operator observation textarea（改到 Dashboard 端）

### 5.2 Stage-specific Changes

| Stage | 现有行为 | 联网后行为 |
|-------|---------|----------|
| Consent | 本地填 PID | **从服务器获取已分配的 PID**，或扫码自动关联 |
| Pretest | 本地保存 responses | 每提交一题实时上报，本地也留一份备份 |
| Profile | 本地计算+本地确认 | **本地计算→上报推荐→等待操作员批准→收到批准后继续** |
| Scenes | 本地答题+本地记 obs | **参与者端只答题，观察笔记移到 Dashboard** |
| Posttest | 本地保存 | 每提交一题实时上报 |
| Interview | 本地记录 | **操作员在 Dashboard 端记录，参与者端显示"请与实验员对话"** |
| Debrief | 本地导出 | **服务器端统一导出，操作员在 Dashboard 操作** |

### 5.3 Offline Fallback

WiFi 不稳定时，参与者端自动切换到**离线模式**：
- 所有 responses 存入 `localStorage`
- 重连后批量上报
- 前测和后测阶段不依赖服务器即可完成
- 只有 Profile 确认阶段必须在线等待操作员

---

## 6 Operator Dashboard Design

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│  AI Judgment Pilot — Operator Dashboard     [Session#3] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─── Participant Cards (横向排列) ─────────────────┐  │
│  │                                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │   P01    │  │   P02    │  │   P03    │  ...  │  │
│  │  │ ●pretest │  │ ○profile │  │ ●scenes  │       │  │
│  │  │  5/8     │  │ WAITING  │  │  2/4     │       │  │
│  │  │  02:13   │  │  ──:──   │  │  03:45   │       │  │
│  │  │  [正常]  │  │ [需介入] │  │  [正常]  │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─── Action Panel (选中参与者的详细操作区) ──────────┐  │
│  │                                                   │  │
│  │  P02 — Profile Approval                           │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Category Scores:                          │  │  │
│  │  │  hallucinated-citation:  1/4  ██░░         │  │  │
│  │  │  source-verification:    3/4  ██████░      │  │  │
│  │  │  trust-calibration:      1/4  ██░░         │  │  │
│  │  │  scope-generalization:   2/4  ████░░       │  │  │
│  │  │                                            │  │  │
│  │  │  Recommended: hallucination-weak +         │  │  │
│  │  │               trust-calibration-weak       │  │  │
│  │  │                                            │  │  │
│  │  │  [ ] hallucination-weak                    │  │  │
│  │  │  [ ] verification-weak                     │  │  │
│  │  │  [ ] trust-calibration-weak                │  │  │
│  │  │  [ ] scope-generalization-weak             │  │  │
│  │  │                                            │  │  │
│  │  │  Override note: [________________]         │  │  │
│  │  │  [✓ Approve]  [← Use Recommendation]      │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  Quick Actions:                                   │  │
│  │  [⏱ 提醒加快] [📝 添加观察笔记] [⏸ 暂停该学生]  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─── Event Log (实时事件流) ────────────────────────┐  │
│  │  14:32:15  P01  submitted PRE_A2 (135s, conf=4)   │  │
│  │  14:32:08  P03  entered scene H2_SKEPTIC_REFLECT  │  │
│  │  14:31:55  P02  pretest complete → profile ready   │  │
│  │  14:31:22  P01  submitted PRE_A1 (98s, conf=3)    │  │
│  │  ...                                              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─── Session Export ────────────────────────────────┐  │
│  │  [📦 Export All Sessions]  [📋 Export P01 Only]   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Participant Card States

每张卡片用颜色编码反映需要操作员关注的程度：

| 状态 | 颜色 | 含义 |
|------|------|------|
| 🟢 Running | 绿色 | 参与者正在自主作答，无需介入 |
| 🟡 Needs Attention | 黄色 | 操作员应留意（如单题>3min） |
| 🔴 Waiting for Operator | 红色闪烁 | 参与者被阻塞，等待操作员操作 |
| ⚪ Completed | 灰色 | 该参与者已完成全部流程 |
| 🔵 Interview | 蓝色 | 正在进行口头访谈 |

### 6.3 Operator Action Types

| Action | 触发条件 | Dashboard 操作 |
|--------|---------|---------------|
| Approve Profile | 参与者完成前测 | 查看分数→勾选/修改 profiles→点击 Approve |
| Add Observation Note | Scene 阶段 | 选中参与者→输入观察→绑定 scene_id |
| Send Nudge | 任何阶段 | 预设消息或自定义文本，参与者端显示 toast |
| Pause/Resume | 任何阶段 | 暂停参与者端 UI（如需要 1v1 说明） |
| Record Interview | Interview 阶段 | 6 个问题的输入框，直接在 Dashboard 填写 |
| Annotate Pattern | Debrief 阶段 | 选择 primary/secondary pattern + evidence note |
| Export Session | Debrief 阶段 | 下载单人或全部 JSON |

### 6.4 Alert Rules (自动报警)

Dashboard 内置以下自动检测规则，触发时卡片变黄/红：

| Rule | 阈值 | 动作 |
|------|------|------|
| 单题超时 | > 4 min | 卡片变黄，提示操作员可发 nudge |
| 前测飞速完成 | < 12 min 完成 8 题 | 卡片变黄，提示可能敷衍 |
| Profile 等待 | 参与者进入 profile 阶段 | 卡片变红，等待操作员 approve |
| Scene 进入 | 参与者进入 scene 阶段 | 卡片标注当前 scene，方便操作员观察 |
| 断线 | 心跳超时 > 30s | 卡片显示 ⚠ 断线标志 |
| 全部完成 | 最后一个参与者到达 debrief | 弹出 "All sessions complete" 提示 |

---

## 7 Data Flow & Persistence

### 7.1 Server-side Session Store

```javascript
// In-memory store structure
sessions = Map<participantId, {
  participantId: "P01",
  sessionId: "sess_20260319_P01",
  connectedAt: ISO_timestamp,
  wsConnection: WebSocket_ref,
  currentStage: "pretest",
  stageIndex: 3,
  stageTotal: 8,

  // Accumulated data (mirrors client-side S object)
  pretestResponses: [...],
  posttestResponses: [...],
  sceneResponses: [...],
  profileRecommendation: {...},
  selectedProfiles: [...],
  profileOverride: "...",
  operatorNotes: [...],
  interviewResponses: {...},
  interactionPattern: {...},
  posttestItemOrder: [...],

  // Metadata
  lastHeartbeat: timestamp,
  exportedAt: null
}>
```

### 7.2 Persistence Strategy

```
实时：所有数据保存在内存 Map 中
每次 response 提交：写入 data/{participantId}_session.json（增量追加）
Session 结束：写入 data/{participantId}_final.json（完整快照）
全部结束：写入 data/batch_export_{timestamp}.json（合并所有参与者）
```

### 7.3 Data Integrity

- 参与者端 localStorage 留一份完整备份
- 服务器端每次 response 都写磁盘（防进程崩溃丢数据）
- 导出时对比 client 和 server 数据，不一致则标记

---

## 8 File Structure

```
ai-judgment-pilot/
├── server.js                      # Node.js 入口，HTTP + WebSocket
├── package.json                   # 只有一个依赖：ws
├── materials_v1.json              # 实验材料（从现有文件复制）
│
├── participant/                   # 参与者端静态文件
│   ├── index.html                 # 改造自现有 prototype/index.html
│   ├── styles.css                 # 改造自现有 prototype/styles.css
│   ├── app.js                     # 改造自现有 prototype/app.js
│   └── ws-client.js               # 新增：WebSocket 通信层
│
├── dashboard/                     # 操作员端静态文件
│   ├── index.html
│   ├── dashboard.css
│   └── dashboard.js
│
└── data/                          # 运行时自动创建
    ├── P01_session.json
    ├── P02_session.json
    └── batch_export_20260319.json
```

---

## 9 Detailed Stage Flow (Networked)

### Stage 1-3: Consent → Warmup → Pretest（参与者自主）

```
参与者                       Server                      Dashboard
  │                            │                            │
  │── join(P01) ──────────────>│── new_participant ────────>│
  │<── joined(materials) ──────│                            │
  │                            │                            │
  │  [consent screen]          │                            │
  │── stage_change(consent) ──>│── status_update(P01) ────>│  卡片: P01 🟢 Consent
  │                            │                            │
  │  [warmup screen]           │                            │
  │── stage_change(warmup) ───>│── status_update ─────────>│  卡片: P01 🟢 Warmup
  │                            │                            │
  │  [pretest item 1]          │                            │
  │── response(PRE_A1) ──────>│── response_received ─────>│  卡片: P01 🟢 Pretest 1/8
  │── response(PRE_A2) ──────>│── response_received ─────>│  卡片: P01 🟢 Pretest 2/8
  │  ...                       │                            │
  │── response(PRE_D2) ──────>│── response_received ─────>│  卡片: P01 🟢 Pretest 8/8
```

### Stage 4: Profile（需操作员确认）

```
参与者                       Server                      Dashboard
  │                            │                            │
  │── profile_ready ─────────>│── ALERT: needs_approval ─>│  卡片: P01 🔴 Profile WAITING
  │   {recommendation: ...}    │   {P01, scores, profiles}  │
  │                            │                            │  操作员查看分数
  │  [显示"等待实验员确认..."] │                            │  勾选 profiles
  │                            │                            │  点击 Approve
  │                            │<── approve_profile ────────│
  │<── profile_approved ───────│                            │
  │   {selectedProfiles: [...]}│                            │
  │                            │                            │
  │  [自动进入 scenes]         │── status_update ─────────>│  卡片: P01 🟢 Scenes 1/4
```

**关键设计**：Profile 阶段是唯一的**阻塞点**。如果操作员暂时忙于其他参与者，P01 会在"等待确认"界面上停住，但不会丢失数据。操作员可以按任意顺序逐个批准。

### Stage 5: Scenes（参与者答题 + 操作员观察）

```
参与者                       Server                      Dashboard
  │                            │                            │
  │  [scene H1_TUTOR]          │                            │  操作员可巡视或远程观察
  │── scene_response ────────>│── scene_update ──────────>│  卡片: P01 🟢 Scene 1/4
  │                            │                            │  操作员可添加 observation
  │                            │<── add_observation ────────│
  │                            │   {scene_id, note}         │  note 存入 P01 session
  │  [scene H2_SKEPTIC]        │                            │
  │── scene_response ────────>│── scene_update ──────────>│  卡片: P01 🟢 Scene 2/4
  │  ...                       │                            │
```

**关键设计**：Scene 阶段参与者不被阻塞。操作员的观察笔记是**异步附加**的，不影响参与者答题节奏。操作员可以先批准一个人的 profile，然后在该参与者做 scenes 时去批准下一个人的 profile。

### Stage 6-7: Transition → Posttest（参与者自主）

与 Pretest 相同的模式，操作员只看进度。

### Stage 8: Interview（操作员必须在场）

```
参与者                       Server                      Dashboard
  │                            │                            │
  │── stage_change(interview) >│── ALERT: interview ─────>│  卡片: P01 🔵 Interview
  │                            │                            │
  │  [显示"请与实验员对话，   │                            │  操作员走到 P01 旁边
  │   回答以下问题"]           │                            │  在 Dashboard 记录回答
  │                            │                            │
  │                            │<── interview_response ─────│  {q0: "...", q1: "..."}
  │                            │   存入 P01 session         │
  │                            │                            │  点击 "Interview Complete"
  │<── interview_complete ─────│                            │
  │  [自动进入 debrief]        │                            │
```

**关键设计**：Interview 是面对面环节，参与者端只显示问题列表供参考，实际记录由操作员在 Dashboard 完成。

### Stage 9: Debrief/Export（操作员完成）

操作员在 Dashboard 为该参与者做 interaction pattern coding，然后导出。

---

## 10 Concurrent Scenario: 5 Participants

以下是 5 个参与者同时施测的典型时间线：

```
Time    P01          P02          P03          P04          P05       Operator Action
0:00    consent      consent      consent      consent      consent   —
0:05    warmup       warmup       warmup       warmup       warmup    —
0:08    pretest      pretest      pretest      pretest      pretest   监控 Dashboard
 ...     ...          ...          ...          ...          ...      —
0:28    ★profile     pretest      pretest      pretest      pretest   → 审批 P01 profile
0:29    scenes       pretest      pretest      ★profile     pretest   → 审批 P04 profile
0:30    scenes       ★profile     pretest      scenes       pretest   → 审批 P02 profile
0:32    scenes       scenes       ★profile     scenes       pretest   → 审批 P03 profile
0:33    scenes       scenes       scenes       scenes       ★profile  → 审批 P05 profile
 ...     ...          ...          ...          ...          ...      观察 scenes（巡视）
0:45    transition   scenes       scenes       transition   scenes    —
0:46    posttest     transition   scenes       posttest     scenes    —
 ...     ...          ...          ...          ...          ...      监控 Dashboard
1:06    ★interview   posttest     posttest     posttest     posttest  → 面对面 P01 (8min)
1:14    debrief      ★interview   posttest     posttest     posttest  → 面对面 P02 (8min)
1:22    ✅done       debrief      ★interview   ★interview   posttest  → 面对面 P03+P04
1:30                 ✅done       debrief      debrief      ★interview → 面对面 P05
1:38                              ✅done       ✅done       debrief   pattern coding
1:40                                                        ✅done    全部导出
```

**核心优势**：
- Profile 审批每人只需 30 秒左右，5 人总共约 2-3 分钟
- Scene 观察可以远程通过 Dashboard 看 response，不必每人都坐旁边
- Interview 是唯一的串行瓶颈，但可以利用其他人做后测的时间窗
- 总时长从单人 75-90min × 5 = 6-7.5h 压缩到约 **100 分钟**

---

## 11 Error Handling & Edge Cases

| Scenario | 处理方式 |
|----------|---------|
| 参与者断网 | 参与者端自动缓存到 localStorage，重连后批量上报 |
| 服务器崩溃 | 每个 response 实时写 JSON 文件，重启后从文件恢复 |
| 操作员断网 | 重连后推送所有 session 最新快照 |
| Profile 审批延迟>2min | 参与者端显示"实验员正在处理其他同学，请稍候" |
| 参与者进度差异大 | Dashboard Alert 提示最快和最慢的参与者 |
| 两个参与者同时需要 interview | 先到先服务，后者在等待界面 |

---

## 12 Migration from Current Prototype

从现有单机原型迁移到联网版本的工作量估算：

| Task | 估计时间 | 说明 |
|------|---------|------|
| server.js | 2-3h | HTTP static serving + WebSocket hub + session store |
| ws-client.js | 1h | 连接、重连、心跳、消息分发 |
| app.js 改造 | 2-3h | 注入 WS 层、Profile 等待模式、Toast 通知 |
| dashboard.html/css/js | 3-4h | 操作员界面、卡片、操作面板、事件流 |
| 测试联调 | 2h | 模拟 3-5 个并发 session |
| **总计** | **10-13h** | 约 1.5-2 个工作日 |

### 可复用的现有代码

| 现有文件 | 复用比例 | 改动点 |
|----------|---------|--------|
| app.js (34KB) | ~85% | 加 WS 上报层、Profile 等待模式、移除 operator 输入框 |
| styles.css (8KB) | ~95% | 加 toast、waiting 动画 |
| index.html (1.2KB) | ~90% | 加 toast 容器 |
| materials_v1.json (32KB) | 100% | 不改动 |

---

## 13 Security & Access Control

Pilot 在本地局域网运行，安全要求不高，但做基本隔离：

- 操作员 Dashboard 仅通过 URL path 区分（`/dashboard/`），可加一个简单 PIN 码验证
- 参与者端无法看到其他参与者的数据
- 参与者端无法触发 operator-only 的 actions
- WebSocket 消息中的 `role` 字段由服务器在 handshake 时验证

---

## 14 Future Extensions (Out of Scope for Pilot)

以下功能在 pilot 阶段不实现，但架构预留接口：

- **Screen recording**: 通过 Dashboard 触发参与者端的 MediaRecorder API
- **Live screen sharing**: 让操作员在 Dashboard 看到参与者的实时屏幕
- **Auto-scoring overlay**: Dashboard 实时显示每题的 gold-label 对比
- **Multi-operator**: 支持多个操作员同时在线分工
- **Cloud deployment**: 替换 `ws` 为 Socket.io，加 HTTPS，部署到 VPS
