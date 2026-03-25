# Experiment Protocol v2 Follow-up: Revise-Focused AI Judgment Study

## 1. Why This Follow-up Exists

第一轮 pilot 已经说明两件事：

1. `decision accuracy` 的 targeted signal 方向为正，但不够稳定。
2. `action quality` 的 targeted signal 更清楚，且在 boundary cases 上暴露出明显的 `Revise vs Reject` 瓶颈。

因此，第二次实验不应被设计成“多收一点样本再看一次显著性”的机械复刻，而应被设计成一个 **theory-informed follow-up**：

- 保留原有最干净的 session skeleton
- 保留 AI-free pre/post 的 skill-formation 边界
- 把 intervention 从 “error detection” 升级为 “proportional response triage”
- 把 `decision` 与 `action` 作为正式双 outcome
- 把 explanation 纳入正式可分析维度

本 protocol 的目标是支持一轮 **small-N but paper-meaningful follow-up**，而不是做大样本因果证明。

---

## 2. Study Positioning

### 2.1 Study Type

本研究定位为：

- `follow-up pilot`
- `mechanism-and-design study`
- `within-participant targeted-vs-untargeted comparison`

不是：

- between-subject RCT
- broad effectiveness proof
- open-ended AI tutoring experiment

### 2.2 Core Claim Boundary

这轮 follow-up 想回答的，不是“系统是不是显著提升了 AI literacy in general”，而是：

1. 第一轮观察到的 `decision-action decoupling` 是否可复现？
2. 显式教授 `Reject / Revise / Accept with boundary` 之后，`decision` 层是否能更接近 `action` 层？
3. `revise-boundary` items 是否仍然诱发系统性的 `Reject` 过度选择？

---

## 3. Session Skeleton

### 3.1 Non-Negotiable Flow

v2 必须完整保留以下主骨架：

1. consent
2. warm-up
3. `AI-free pretest`
4. profiling
5. `targeted micro-intervention`
6. transition prompt
7. `AI-free posttest`
8. interview
9. export / debrief

### 3.2 Why This Skeleton Must Stay

- `AI-free pretest` 用于建立真实 baseline，而不是测学生会不会继续依赖外部支架。
- `profiling` 是个性化干预的核心。
- `AI-free posttest` 用于测 skill formation，而不是即时 assisted performance。
- interview 继续承担 mechanism evidence 和 redesign feedback 的作用。

任何削弱这条骨架的改动，都将直接削弱 follow-up 与第一轮之间的可比性。

---

## 4. Recommended Sample and Use Boundary

### 4.1 Sample Guidance

建议招募 **独立新样本**，不与第一轮参与者重复。

推荐分层：

- `minimum viable follow-up`: `n = 8-10`
- `paper-facing follow-up`: `n = 12-16`
- `stronger follow-up`: `n = 16+`

### 4.2 Interpretation Boundary

- 如果最终 `n < 8`，本轮更适合作为 `instrument debugging + mechanism probing`
- 如果 `n >= 8` 且 protocol 执行稳定，可作为 `Study 2`
- 即使做 follow-up，也不应写成大样本 causal effectiveness paper

---

## 5. Task Structure

### 5.1 Task Scenario

所有题目继续锚定在 `bounded knowledge tasks`：

- research report
- financial analysis
- data processing
- history / humanities

每道题继续包含：

1. writing / task goal
2. AI output
3. bounded evidence / facts package
4. response form

### 5.2 Response Form

每道题要求参与者完成四步：

1. judgment
2. written explanation
3. next action
4. confidence rating

judgment 形式：

- A/B/D 单答案题：`Accept / Revise / Reject`
- C 比较题：`Prefer A / Prefer B`

next action 继续使用五个固定选项：

- `核查或检视原始来源`
- `要求 AI 重新生成并附上证据`
- `弱化论述措辞`
- `标记为不可用`
- `接受并做小幅修改`

### 5.3 Warm-up Change

warm-up 必须显式加入三分法说明：

- 有些输出应 `Reject`
- 有些输出应 `Revise`
- 有些输出在当前证据下可以 `Accept with boundary`

禁止把 warm-up 讲成“所有 AI 输出都值得怀疑”的单向 caution primer。

---

## 6. Judgment Dimensions and Archetypes

### 6.1 Category Layer

v2 继续沿用四个 judgment categories：

- Category A: hallucinated citation detection
- Category B: source verification
- Category C: comparative trust calibration
- Category D: scope generalization detection

### 6.2 Archetype Layer

v2 必须在 item bank 中显式标记并平衡以下 archetypes：

- `clear-reject`
- `calibrated-accept`
- `revise-boundary`
- `comparative-trust`（仅用于 C 类比较题的专属标记）

### 6.3 Design Principle

第一轮中最有信息量的，不是“总正确率”，而是 boundary cases 的错误方向。因此 v2 的题库不能只按 category 平铺，而要按 `category × archetype` 双层设计。

特别要求：

- `revise-boundary` 必须成为主检验对象
- `calibrated-accept` 必须继续保留，用于防止 blanket distrust
- clear reject items 必须存在，但不能占满 instrument

---

## 7. Profiling Rule

### 7.1 Online Profiling Logic

为了保持实验节奏，在线 profiling 仍然只依赖：

- `decision accuracy`
- `action quality`

不把 explanation 拉进实时打分。

### 7.2 Category Summary

对每个 category，系统实时计算：

- `decisionScore`
- `actionScore`
- `combinedScore`
- `decisionErrors`
- `actionErrors`

最终仍取 weakest two categories 作为 targeted profiles。

### 7.3 Operator Approval

networked v2 继续保留 operator approval：

- 系统自动推荐 weakest two
- operator 在 dashboard 查看 `decision/action` 子分数
- 如有必要可 override，并记录 override note

### 7.4 Explanation Boundary

explanation 不进入实时 profile selection，但必须完整保留原文，以供实验后双评分。

---

## 8. Intervention Redesign

### 8.1 Overall Principle

v1 的 scene 更偏向“识别哪里错了”；v2 必须升级成“识别之后怎么分流”。

### 8.2 Scene Structure

每个 targeted profile 仍只给 `2 scenes`：

- `Scene 1: Triage Tutor`
- `Scene 2: Contrastive Skeptic + Reflector`

不增加 scene 数量，避免拖长 session。

### 8.3 Scene 1: Triage Tutor

功能：

- 用三个并列 exemplar 教会参与者区分：
  - `Reject`
  - `Revise`
  - `Accept with boundary`
- 明确告诉参与者：
  - 什么时候是 completely unusable
  - 什么时候是 repairable
  - 什么时候是 usable but bounded

每个 triage tutor scene 都必须回答一个问题：

**为什么这里是这个 label，而不是另外两个？**

### 8.4 Scene 2: Contrastive Skeptic + Reflector

功能：

- 强迫参与者比较三个输出状态
- 强调 “what remains usable” 与 “what exceeds evidence”
- 让参与者用一句规则完成反思

每个 contrastive scene 至少要引导出：

- 该保留的是什么
- 该修的是什么
- 为什么不能直接 Reject / Accept

### 8.5 Scene Content Constraint

scene 必须继续基于失败的 pretest item 回扣：

- 显示原题 task goal
- 显示原题 AI output
- 显示原题 facts package
- 显示关键证据断裂点

不允许 scene 退化为抽象说理。

---

## 9. Posttest Design

### 9.1 Composition

posttest 继续保持：

- targeted categories: `4 items`
- untargeted categories: `4 items`

### 9.2 Ordering

posttest 必须随机排序，不得让 targeted items 连续出现。

### 9.3 Parallelism Rules

每个 pre/post pair 必须满足：

- same category
- same response mode
- same archetype family
- similar difficulty band
- different topic surface
- different facts package wording

### 9.4 Boundary Stress Test

v2 posttest 中必须保证：

- 至少有足够的 `revise-boundary` items
- 至少有一组 `calibrated-accept` items
- clear reject items 只作为 anchor，不作为主角

---

## 10. Interview Protocol

### 10.1 Duration

建议保持 `8-10 min`。

### 10.2 Core Questions

保留第一轮问题，但对 follow-up 增加两个聚焦：

1. 哪个 triage scene 最有帮助？为什么？
2. 你现在最常用的判断规则是什么？
3. 哪种错误你仍然最容易犯？
4. 哪种情况最难区分 `Revise` 和 `Reject`？
5. 有没有哪类输出你现在更敢 `保留但加边界`？
6. 如果把这个系统嵌入课程，你会在哪一步使用它？

### 10.3 Interview Purpose

访谈的作用不是做大型 qualitative study，而是：

- 给 decoupling pattern 提供机制解释
- 检查 triage redesign 是否真的被内化
- 收集对 system wording / scene design 的反馈

---

## 11. Measures

### 11.1 Co-primary Outcomes

- `targeted_vs_untargeted_decision_differential`
- `targeted_vs_untargeted_action_differential`

### 11.2 Mechanism Outcomes

- `dual-rated explanation quality`
- `decision-action decoupling rate`
- `revise-vs-reject confusion rate`
- `rule uptake in scene / interview responses`

### 11.3 Secondary Outcomes

- response time
- confidence
- acceptability
- interaction pattern code

---

## 12. Explanation Scoring

### 12.1 Status

这次 follow-up 不再把 explanation 放在“以后再说”的位置，而是正式纳入分析。

### 12.2 Rating Method

- 两位评分者独立打分
- 使用 `gold_explanation_points`
- 评分范围仍为 `0-2`
- 记录 disagreement cases 和 calibration examples

### 12.3 Rater Calibration

正式评分前先抽 `4-6` 份 explanation 做试评分：

1. independent scoring
2. compare disagreements
3. fix boundary examples
4. then rate full set

---

## 13. Analysis Plan

### 13.1 Main Quantitative Analysis

participant-level 为主，不把 item responses 当独立样本。

报告：

- targeted-vs-untargeted `decision differential`
- targeted-vs-untargeted `action differential`
- exact nonparametric test results
- descriptive effect direction and distribution

### 13.2 Mechanism Analysis

重点看：

- `decision correct / action wrong`
- `decision wrong / action correct`
- `decision wrong due to over-Reject`
- `explanation correct but disposition too harsh`

### 13.3 Item Archetype Analysis

至少分开报告：

- `clear-reject`
- `calibrated-accept`
- `revise-boundary`

### 13.4 Safe Reporting Language

推荐：

- “follow-up tests whether revise-focused redesign reduces the revise-versus-reject bottleneck”
- “decision and action are treated as separate but related layers”
- “explanation quality is analyzed as a mechanism outcome”

避免：

- “the system proves strong causal effectiveness”
- “AI judgment improved in general”

---

## 14. Threats and Mitigations

### Threat 1: Blanket Distrust Persists

Mitigation:

- keep calibrated-accept items
- rewrite warm-up
- add explicit triage exemplars

### Threat 2: Revise Boundary Still Too Ambiguous

Mitigation:

- purify item wording
- avoid mixing multiple evidence problems in one item
- add notes_for_raters and explicit boundary focus

### Threat 3: Online Profiling Becomes Too Slow

Mitigation:

- do not include explanation in online scoring
- keep operator approval lightweight

### Threat 4: v1 / v2 System Drift

Mitigation:

- keep v1 `networked/` unchanged
- run v2 only in isolated `networked_v2_followup/`
- separate export directories

---

## 15. Stop Rules

1. 如果 v2 scenes 把总时长推到 `95 min+`，优先压缩 scene 文本，不改 skeleton。
2. 如果 dry run 后 calibrated-accept 题依然几乎全部被 `Reject / Revise` 覆盖，则先改 item 与 warm-up，不跑正式实验。
3. 如果 explanation 试评分无法稳定收敛，则 explanation 只能降级为 exploratory，不可写成主机制证据。
4. 如果 `networked_v2_followup/` 不能稳定运行，则不能用 v1 `networked/` 临时热修顶替正式 follow-up。

---

## 16. Dry Run Success Criteria

只有同时满足下面条件，才建议启动正式 follow-up：

1. 参与者能理解三分法，不再把任务看成纯 error detection。
2. triage scenes 能清楚传达 `Reject / Revise / Accept with boundary`。
3. operator 能从 dashboard 看到 decision/action split。
4. export JSON 包含 item archetype、gold action、targeted flag、explanation text。
5. explanation dual rating 可以顺利回连到 item-level exports。
6. v1 和 v2 networked 运行彼此独立，不混数据。
