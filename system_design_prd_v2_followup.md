# System Design PRD v2 Follow-up Lean-30

## 1. Product Summary

### 1.1 Product Name

`AI Judgment Micro-Intervention Runner v2 Follow-up Lean-30`

### 1.2 Product Goal

在不破坏 v1 独立版本的前提下，提供一套 **30 分钟内可执行** 的 follow-up runner，用于执行第二轮 AI judgment micro-intervention study。

系统目标不是做通用教学平台，而是支撑一轮：

- `AI-free pretest`
- `weakest-two profiling`
- `2 targeted scenes`
- `AI-free posttest`
- `3-question interview`

的可控、可导出、可分析实验。

### 1.3 Product Boundary

本 PRD 的基线已经不是 full-v2，而是 Lean-30：

- `4 pretest items`
- `4 posttest items`
- `1 retained scene per profile`
- `2 scenes total per participant`
- `24-30 min session`

---

## 2. Versioning and Isolation

### 2.1 Version Rule

v2 follow-up 必须运行在独立目录：

- [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup)

现有 v1 版本：

- [networked](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked)

必须保持独立不变。

### 2.2 Materials Rule

v2 follow-up runner 只加载：

- [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json)

不再兼容 v1 materials，也不在运行时做 v1/v2 热切换。

### 2.3 Data Isolation Rule

v2 follow-up runtime 只写入：

- [data_lean30](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/data_lean30)

不得写入 v1 的 `networked/data/`。

---

## 3. User Roles

### 3.1 Participant

职责：

- 完成 consent、warm-up、pretest、scenes、posttest
- 每题提交 `judgment + one-sentence explanation + next action + confidence`
- 在 interview 阶段口头回答 3 个固定问题

关键需求：

- 界面负担低
- 题目与 scene 清晰
- 整体时长不超过耐心上限

### 3.2 Operator

职责：

- 查看实时进度
- 审核 weakest-two profile
- 记录 observation note
- 记录 3 个访谈问题
- 导出单人/批量结果

关键需求：

- 看得见 `decision / action / confidence`
- 看得见系统推荐与 override note
- 清楚当前运行的是 Lean-30 而不是 v1

### 3.3 Rater

职责：

- 对 item-level explanation 做离线双评分

关键需求：

- `participant_id + item_id` 可稳定回连
- export 中保留 item metadata 与原始文本

### 3.4 Analyst

职责：

- 做 targeted-vs-untargeted differential
- 做 decision-action decoupling
- 做 revise-reject confusion 分析

关键需求：

- 导出字段完整
- v1/v2 数据不混
- item archetype 与 pair 信息保留

---

## 4. Product Principles

1. **Shorter session, same causal chain.**
   - 缩短的是题量和 scene 数量，不是实验逻辑。

2. **Isolation over accidental compatibility.**
   - v2 follow-up 独立运行、独立写数、独立绑定 materials。

3. **Measure what the paper needs.**
   - 运行层必须稳定支持 `decision`、`action`、`explanation`、`confidence`、scene response 和 interview。

4. **Operator support without operator overload.**
   - 只在 profiling approval、scene observation、interview 时介入。

5. **Lean-30 is the canonical v2 runtime.**
   - 不再以 full-v2 作为默认执行版本。

---

## 5. Problem Statement

full-v2 的设计虽然更完整，但对真实学生 session 来说过长。按当前题目估时，单看 scored items 就已超过 40 分钟，叠加 scene、切换和 interview 后，容易失去执行稳定性。

Lean-30 的问题定义是：

- 如何在 `30 分钟内` 保留完整研究主链条？
- 如何在最小题量下仍完成四类 profiling？
- 如何让 targeted intervention 保持可识别？
- 如何不因缩短时长而破坏 AI-free posttest 的 skill-formation 边界？

---

## 6. Scope

### 6.1 In Scope

- 独立的 Lean-30 networked runner
- `4 pre + 4 post + 2 scenes` 运行逻辑
- `materials_v2_followup.json` 绑定
- weakest-two profiling with Lean-30 tie-break
- 3-question interview UI
- isolated export and persistence

### 6.2 Out of Scope

- 不改现有 v1 `networked/`
- 不恢复 full-v2 题量
- 不新增数据库
- 不接入外部 LLM
- 不做在线 explanation 评分

---

## 7. Functional Requirements

### FR-1 Independent Runner

系统必须存在独立目录：

- [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup)

并可单独启动。

### FR-2 Canonical Materials Binding

[server.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/server.js) 只加载：

- [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json)

### FR-3 Lean-30 Session Flow

participant 端必须完整保留以下 flow：

1. consent
2. warm-up
3. pretest
4. profile waiting / approval
5. scenes
6. transition
7. posttest
8. interview waiting
9. debrief

### FR-4 Item Count Contract

系统必须接受并正确运行：

- `4 pretest items`
- `4 posttest items`

不依赖旧版 `8+8` 假设。

### FR-5 Scene Count Contract

系统必须接受并正确运行：

- `1 scene per profile`
- `2 scenes total per participant`

### FR-6 Profiling Contract

profiling 逻辑必须基于：

- decision correctness
- next action correctness

并使用 Lean-30 tie-break：

1. combined score
2. category priority `D > B > C > A`
3. lower confidence
4. operator override

### FR-7 Explanation Collection

每题 explanation 必须保留为原始文本字段，但 UI 文案明确要求：

- `one-sentence explanation`

### FR-8 Dashboard Approval Visibility

dashboard 的 profile 面板必须可见：

- combined score
- decision subscore
- action subscore
- average confidence
- selected profiles
- override note

### FR-9 Interview Contract

participant 与 operator 端都必须使用固定的 3 个访谈问题：

1. 什么时候该 Reject？
2. 什么时候该 Revise 而不是 Reject？
3. 哪个 scene 最帮助理解边界？为什么？

### FR-10 Export Integrity

export 必须至少包含：

- study_id
- version
- participant_id
- selected_profiles
- profile_recommendation
- pretest_responses
- scene_responses
- posttest_responses
- posttest_item_order
- interview_responses

### FR-11 Data Isolation

follow-up session persistence 必须写入：

- [data_lean30](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/data_lean30)

不与 v1 数据目录混写。

---

## 8. Runtime Components

### 8.1 Server

文件：

- [server.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/server.js)

职责：

- 提供 `/api/materials`
- 提供 `/api/sessions`
- 管理 WebSocket join / response / stage / export
- 持久化 session 到 `data_lean30/`

### 8.2 Participant Client

文件：

- [participant/app.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/participant/app.js)
- [participant/i18n.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/participant/i18n.js)

职责：

- 渲染 Lean-30 item flow
- 渲染 scene recap + high-density scene
- 生成 profile recommendation
- 输出 buildExport contract

### 8.3 Dashboard

文件：

- [dashboard/dashboard.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/dashboard/dashboard.js)
- [dashboard/i18n.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/dashboard/i18n.js)

职责：

- 展示 participant state
- 审批 profile
- 记录 observation
- 记录 interview
- 导出单人/批量结果

---

## 9. Data Contract

### 9.1 Pre/Post Response Fields

每条 item response 至少包含：

- participant_id
- item_id
- phase
- category
- response_mode
- targeted_flag
- judgment
- reason
- next_action
- confidence
- response_time_sec

### 9.2 Scene Response Fields

每条 scene response 至少包含：

- participant_id
- scene_id
- targeted_profile
- source_failed_item
- learner_response_text
- response_time_sec
- completion_flag

### 9.3 Export-Level Fields

每个 session export 至少包含：

- study_id
- version
- session_started_at
- selected_profiles
- profile_override
- profile_recommendation
- pretest_responses
- scene_responses
- posttest_responses
- posttest_item_order
- interview_responses
- exported_at

---

## 10. UX Requirements

### 10.1 Participant UX

- consent 文案必须显示 `4 pre + 2 scenes + 4 post`
- 总时长必须显示 `24-30 min`
- reason placeholder 必须写成一句话
- interview title 必须写成 `3-4 min`

### 10.2 Dashboard UX

- 必须显示 Lean-30 follow-up 标识
- 必须使用 3 个固定 interview prompts
- profile 面板不能再只显示旧式 `score / maxScore / errors`

---

## 11. Failure Handling

### 11.1 Connection Failure

participant 断线后：

- 不允许 silently offline continue
- 必须等待 websocket 恢复

### 11.2 Data Failure

如果 `materials_v2_followup.json` 加载失败：

- server 启动失败
- 不允许 fallback 到 v1 materials

### 11.3 Version Failure

如果发现 v2 runner 写入了 v1 data 目录：

- 视为严重版本隔离失败
- 不可用于正式实验

---

## 12. Acceptance Criteria

Lean-30 PRD 被视为落地，需要同时满足：

1. [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup) 可独立启动。
2. `/api/materials` 返回 [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json)。
3. runtime item counts 为 `4 pre + 4 post`。
4. scene counts 为 `1 per profile`，participant 实际进入 `2 scenes total`。
5. participant / dashboard 文案都已切到 Lean-30。
6. 数据写入 [data_lean30](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/data_lean30)。
7. JS 语法检查通过。
8. v1 的 [networked](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked) 未被用于承载 v2 改动。

只要以上条件同时满足，系统即可被视为 Lean-30 follow-up 的正式执行基线。
