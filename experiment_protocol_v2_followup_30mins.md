# Experiment Protocol v2 Follow-up Lean-30

## 1. Positioning

这是一版 **Lean-30 follow-up protocol**。它保留第一轮最关键的实验骨架，但把 session 压缩到学生更能稳定完成的 `24-30 分钟`。

本版不追求“大而全”的 instrument coverage，而追求：

1. 保留 `AI-free pretest -> profiling -> targeted micro-intervention -> AI-free posttest -> interview` 的核心链条。
2. 继续检验 `decision` 与 `action` 的不同响应模式。
3. 继续保留 `Reject / Revise / Accept with boundary` 的 proportional-response triage。
4. 在时间上适配真实课堂或 lab slot。

这不是原 v2 的简化副本，而是一个 **time-constrained, theory-preserving redesign**。

---

## 2. Non-Negotiable Skeleton

Lean-30 版必须保留以下骨架，不允许删除其中任何一段：

1. consent + instructions
2. `AI-free pretest`
3. profiling
4. `targeted micro-intervention`
5. transition reminder
6. `AI-free posttest`
7. short interview
8. export / debrief

原因：

- pretest 仍然负责建立 baseline。
- profiling 仍然负责个性化。
- intervention 仍然必须是 targeted，而不是统一讲解。
- posttest 仍然必须 AI-free，保证 skill-formation boundary。
- interview 仍然负责机制证据和 wording feedback。

---

## 3. Lean-30 Timing Budget

| Stage | Target Time | Design Rule |
|------|-------------|-------------|
| Consent + instructions | 2-3 min | 不做长 warm-up，只讲 response triage 与 AI-free 规则 |
| Pretest | 6-8 min | `4 items`，每类 `1` 题 |
| Profiling + transition | <1 min | system auto-score + operator quick approval |
| Targeted micro-intervention | 5-6 min | `2 scenes total`，每个 targeted category `1` scene |
| Posttest | 7-9 min | `4 items`，每类 `1` 题 |
| Interview | 3-4 min | 只问 3 个机制问题 |
| Total | 24-30 min | 超过 30 分钟视为 protocol drift |

Stop rule：

- 如果连续 3 名参与者的 median session duration 超过 `30 min`，必须再次压缩 scene 文本或题目说明。

---

## 4. Minimal Measurement Structure

### 4.1 Item Counts

Lean-30 固定为：

- Pretest: `4 items`
- Posttest: `4 items`
- Total scored items: `8`

每个 phase 覆盖四个 category 各一题：

- A: hallucinated citation
- B: source verification
- C: comparative trust calibration
- D: scope generalization

### 4.2 Why 4+4 Is the Floor

`4 pre + 4 post` 已接近这套设计的最小可行规模。

如果继续压到 `3+3`：

- 无法同时覆盖四个 category
- 无法稳定完成 profiling
- 无法干净地计算 targeted vs untargeted posttest differential

因此 Lean-30 不再继续减到 `3+3`。

---

## 5. Selected Item Families

为在最小题量下保住 triage spectrum，Lean-30 只保留四种 archetype 各一条主线：

1. Category A = `clear-reject`
2. Category B = `calibrated-accept`
3. Category C = `comparative-trust`
4. Category D = `revise-boundary`

对应 item pair：

- `V2_PRE_A1 <-> V2_POST_A1`
- `V2_PRE_B1 <-> V2_POST_B1`
- `V2_PRE_C2 <-> V2_POST_C2`
- `V2_PRE_D2 <-> V2_POST_D2`

这样做的理由是：

- A 负责保留 `Reject` anchor
- B 负责保留 `Accept with boundary` anchor
- C 负责保留 evidence-aligned trust calibration
- D 负责保留 `Revise vs Reject` 核心 bottleneck

---

## 6. Response Form

每道题仍保留四个 response fields，但写作负担必须压到最短：

1. judgment
2. one-sentence explanation
3. next action
4. confidence rating

执行要求：

- explanation 限制为 `一句话`，聚焦最关键 evidence gap 或 boundary。
- 不允许写成长段落。
- operator 不在现场给任何 correctness feedback。

这样既保留 `explanation` 的 formal analyzability，又不把时长拖长。

---

## 7. Profiling Rule in Lean-30

### 7.1 Online Scoring

profiling 仍然只依赖：

- `decision accuracy`
- `action quality`

不把 explanation 引入在线打分。

### 7.2 Weakest-Two Selection

系统仍然为四个 categories 分别计算：

- decisionScore
- actionScore
- combinedScore

取 weakest two categories 作为 targeted categories。

### 7.3 Tie-Break Rule

因为 Lean-30 的 pretest 每类只有 `1` 题，必须显式写入 tie-break：

1. 先比较 `combinedScore`
2. 如并列，优先级为 `D > B > C > A`
3. 如仍并列，优先选择 confidence 更低的 category
4. 如仍无法区分，由 operator 按 dashboard note 选择并记录

这样做的理由是：

- D 承载第一轮最强的 `revise-vs-reject` bottleneck
- B 承载 `calibrated acceptance` 与 anti-blanket-distrust
- C 承载 comparative trust calibration
- A 在 Lean-30 中更多承担 reject anchor 功能

---

## 8. Targeted Micro-Intervention

### 8.1 Scene Count

Lean-30 不再使用每个 targeted profile `2 scenes` 的结构。

改为：

- 每个 targeted profile `1 high-density scene`
- 因为 targeted categories 有 `2` 个，所以每位参与者总共只看 `2 scenes`

### 8.2 Scene Function

每个 scene 必须同时完成三件事：

1. 提醒该类题目中什么情况下该 `Reject`
2. 说明什么情况下该 `Revise`
3. 指出什么情况下可 `Accept with boundary`

也就是说，Lean-30 的每个 scene 必须把原本的 `triage tutor + contrastive reflection` 合并成一个高密度 scene。

### 8.3 Scene Authoring Rule

每个 scene 必须包含：

- failed-item callback
- 3-way contrast cards
- forced choice prompt
- one reusable rule template

每个 scene 不得超过：

- `4` 行 script lines
- `3` 张 contrast cards
- `1` 个 forced choice question

否则会破坏 30 分钟上限。

---

## 9. Posttest and Interview

### 9.1 Posttest

posttest 继续 AI-free。

每类仍只出 `1` 题，总计 `4` 题。posttest 的核心任务不是“覆盖尽可能多的 surface topics”，而是让每类 category 都至少保留一个 clean measure。

### 9.2 Interview

interview 固定压缩为 `3` 个问题：

1. 什么时候你会选 `Reject`？
2. 什么时候你会选 `Revise` 而不是 `Reject`？
3. 哪个 scene 最帮助你理解边界？为什么？

如果参与者回答过短，operator 可做一次追问，但总 interview 不应超过 `4 min`。

---

## 10. Outcomes

### 10.1 Co-Primary Outcomes

Lean-30 继续保留双 outcome：

1. targeted-vs-untargeted `decision differential`
2. targeted-vs-untargeted `action differential`

### 10.2 Mechanism Outcomes

- one-sentence explanation quality
- decision-action decoupling
- revise-reject confusion

### 10.3 Secondary Outcomes

- response time
- confidence
- interview acceptability

---

## 11. Runtime and Analysis Implications

### 11.1 Runtime

networked v2 需要支持：

- `4 pre + 4 post`
- weakest-two profiling
- `2 scenes total`
- one-sentence reason input

### 11.2 Analysis Boundary

Lean-30 的单个 participant 信息量低于 full v2，因此：

- 每位参与者的 differential 更粗
- item-level descriptive analysis 仍然重要
- 如果要做 inferential claim，建议 sample 略高于第一轮最低基线

但这不是缺点，而是用更真实的 session length 换取更稳定执行。

---

## 12. Success Criteria

Lean-30 版被视为可执行，需同时满足：

1. session median duration 不超过 `30 min`
2. 每位参与者都经历完整 skeleton
3. 每类 category 在 pre/post 各保留一个 clean item
4. 每位参与者只进入 `2` 个 targeted scenes
5. explanation 仍可进入 formal dual rating
6. 不因压缩而破坏 AI-free 边界

如果这些条件同时满足，则 Lean-30 可以作为第二轮 follow-up 的正式执行版本。
