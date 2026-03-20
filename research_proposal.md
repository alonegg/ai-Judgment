# Research Proposal: Personalized AI Judgment Micro-Intervention

## Working Title
Personalized Micro-Interventions for Improving University Students' Judgment of Generative AI Outputs in Bounded Knowledge Tasks

## One-Sentence Pitch
本文拟设计一个轻量、个性化的 AI judgment 干预系统，在大学生使用生成式 AI 完成有边界的知识任务时，帮助他们识别幻觉、核验来源、校准信心，并以小样本 pilot 方式验证其可行性与初步效果。任务覆盖调研报告、金融分析、数据处理和历史人文四类语境。

## Recommendation
推荐将论文锚定在 `bounded knowledge tasks + source verification + confidence calibration`，而不是单一 academic writing 题型或泛化的 AI literacy / multi-agent classroom。

原因：
- 教育场景清楚，容易对接 ICAIE。
- 跨域题项更容易检验参与者学到的是 `judgment rule`，而不是某一类题面的表面 cue。
- 题项仍然容易平行化，适合 `pre/post`。
- 小样本也能讲清“能力变化”和“干预可接受性”。
- 可以借 OpenMAIC 的 scene orchestration 思路，但无需复制其工程体量。

## 5W1H Framing

### What
研究一种 `personalized micro-intervention`，帮助学生在使用生成式 AI 处理 bounded knowledge tasks 时作出更好的 judgment，而不是盲信 AI。

### Why
- 许多学生已经在使用生成式 AI，但是否会判断其可靠性、是否会核验来源、是否会识别 hallucination，仍缺少 task-based 教育干预。
- 现有研究过多集中在 attitude survey，而不是“可操作能力”的变化。

### Who
- 目标受试者：`4-5` 名大学生或研究生。
- 目标受益者：学生、课程教师、研究任务设计者。

### When
- `2026-03-19` 到 `2026-03-30` 为本轮最小可投稿窗口。
- 研究定位为 `pilot / feasibility study`。

### Where
- 场景限定在实验室 controlled session，避免把变量扩展到整门课。
- 任务限定在 bounded knowledge tasks / source use / claim verification。
- 题面覆盖 `调研报告`、`金融分析`、`数据处理`、`历史人文` 四类内容领域，但答题仍完全依赖屏幕内提供的事实情况。

### How
- 先做 pretest 诊断。
- 根据错误类型分配 profile。
- 按 profile 推送对应 micro-scenes。
- 做 posttest 和短访谈。
- 分析判断准确率、解释质量与 confidence calibration 的变化。

## Research Questions
1. 大学生在 AI-assisted bounded knowledge tasks 中，最常见的 judgment failure 是哪些？
2. 个性化 micro-intervention 能否在短时实验中改善学生对 AI 输出的判断准确率与解释质量？
3. 个性化 micro-intervention 能否改善学生的 confidence calibration，并被学生认为是可接受、可迁移的？

## Expected Contributions

### Contribution 1: 理论/框架
区别于已有的 AI literacy 框架（如 A-Factor），本文将 AI judgment 窄化为四个可诊断的 task-level 能力（hallucination detection、source verification、trust calibration、scope generalization detection），并提出配套的诊断-干预-评估闭环。这四个维度更加细颗度且易于操作化，相比泛化的"AI 理解能力"能更精准地定位学生的薄弱点。

### Contribution 2: 方法/设计
提出 personalized micro-intervention 的 profile-to-scene 映射机制，包含 within-subject targeted vs untargeted 对照，适用于小样本教育场景。这种设计避免了传统大样本实验的高成本，同时通过精准的个性化干预和内部对照增强了小样本的说服力。

### Contribution 3: 证据
通过 n=4-5 的 pilot 提供初步 feasibility 和 improvement evidence，包括 task performance、confidence calibration、interaction patterns 和 qualitative feedback。这些证据支撑论文在现实教学场景中的可操作性评估，同时为后续更大规模的实验奠定基础。

## Recommended Framing Against Nearby Topics

### Not this
- “Students' attitudes toward ChatGPT”
- “General AI literacy survey”
- “A new chatbot for learning”

### This
- “A bounded, scaffolded, personalized intervention for AI judgment in a concrete educational task”

## Minimal System Design

### Module 1: Diagnostic Layer
输入 8 个短任务，识别学生在哪类 judgment 上薄弱：
- hallucinated citation detection
- unsupported claim detection
- source verification
- trust calibration / overconfident AI answer comparison
- scope generalization detection（新增）
- prompt revision for evidence request

补充设计原则：
- 诊断题不应全部是“找错题”
- 至少应包含少量 calibrated-acceptance / boundary items，用来区分：
  - overtrust
  - blanket distrust
  - genuinely calibrated judgment

### Module 2: Profile Layer
将学生映射到内容导向的 weakest profiles：
- `hallucination-weak`
- `verification-weak`
- `trust-calibration-weak`
- `scope-generalization-weak`（新增）

其中 explanation weakness 作为跨类别维度处理，不单独设成主 profile。

### Module 3: Intervention Layer
每个 profile 推送 3-4 个 micro-scenes：
- Scene A: 概念解释
- Scene B: 正反例比较
- Scene C: skeptic challenge
- Scene D: reflection and takeaway

### Module 4: Assessment Layer
- posttest parallel items
- confidence rating
- brief reflection
- usability / usefulness interview

说明：
- `posttest` 明确为 `AI-free judgment assessment`
- 重点测 formed judgment，而不是继续借助 AI 的即时表现

## Prototype Scope

### Recommended MVP
一个轻量 web prototype 即可，页面不超过 4 个：
1. consent + instructions
2. pretest
3. intervention scenes
4. posttest + interview form

### Logging
必须记录：
- item response
- selected option
- explanation text
- confidence score
- response time
- profile assigned
- intervention scenes shown

### Optional
- simple agent roles: `Tutor`, `Skeptic`, `Reflector`
- 若时间不够，可把 agent role 实现成固定 prompt 模板，而不是真正多 agent orchestration

## Experimental Design

### Participants
- `4-5` 名大学生/研究生

### Study Format
- 单次 `75-90` 分钟实验
- 结构：
  1. pretest
  2. auto-profile
  3. personalized intervention
  4. posttest（随机排序，防 demand characteristics）
  5. 5-10 分钟访谈
- posttest 采用 `targeted vs untargeted` 组合，用于在同一参与者内部形成较强对照。

### Measures
- Primary（分别在四个 categories 上计算）：
  - judgment accuracy
  - explanation quality
  - confidence calibration
- Secondary:
  - response time
  - perceived cognitive load
  - perceived usefulness

### Analysis
- 以 descriptive statistics + within-subject change 为主
- 按四个 categories（hallucination detection、source verification、trust calibration、scope generalization detection）分别计算准确率变化
- explanation quality 可用双人 rubric 打分
- confidence calibration 可看正确率与自信度偏差
- 对 single-answer items，要特别区分参与者是更会“发现问题”，还是更会“恰当地区分 reject / revise / retain”
- qualitative 部分提炼”哪些支架最有帮助，哪些仍导致误判”
- interaction process 可额外编码为 patterns，例如 `rule-seeking`、`evidence-checking`、`authority-following`

## Claim Boundary

### Safe claims
- the intervention is feasible
- students showed improved performance on parallel posttest items
- students reported better awareness of verification and overtrust issues
- personalized scenes were perceived as useful and acceptable

### Unsafe claims
- the intervention generalizes broadly
- the intervention causes long-term learning gains
- the method outperforms all existing AI literacy instruction

## Implementation Options

### Option A: Rule-based personalized scenes (Recommended)
- profile 由错误类型直接决定
- intervention 内容由模板 + LLM 填充
- 优点：稳、快、可解释

### Option B: Full LLM adaptive orchestration
- 动态决定 profile 和 scene sequence
- 优点：更像系统论文
- 缺点：风险高，时间不够

### Option C: Wizard-of-Oz
- 系统只负责展示和记录
- profile 和 intervention 由研究者半手工生成
- 优点：最保守
- 缺点：系统贡献会变弱

## Recommendation on Options
本轮优先走 `Option A`。如果到 `2026-03-21` 还没有冻结 item bank，就立即退到 `Option C`。

## Ten-Day Timeline

### 2026-03-19
- 已完成题目扩展（8+8 四分类）、C 类平衡、A 类迷惑性提升、next_action 5 分类合并
- 项目更新与 v2 定版

### 2026-03-20 to 2026-03-21
- Dry run 验证题目时长与诊断准确性
- 若发现超过 3 道题需重写，退到 8 题缩小方案
- 最终冻结 item bank 与 profile rules

### 2026-03-22
- 完成最小 prototype 与 intervention templates

### 2026-03-23 to 2026-03-24
- 跑 4-5 人 pilot

### 2026-03-25
- 清洗数据
- 做初步图表和 rubric 打分

### 2026-03-26 to 2026-03-28
- 写论文初稿
- 若无法完成 Method + Results，只投 short paper / poster

### 2026-03-29
- 修改英文、补图、补 related work

### 2026-03-30
- 最终投稿

## Immediate Next Decisions
进入 dry run 前，确保：
- `16` 道题（8+8）v2 已完成，待 dry run 验证
- Semi-automated profiling with operator verification 逻辑已写入 prototype
- `Tutor / Skeptic / Reflector` 四个 micro-scenes 与新增 scope generalization 维度的 intervention 已固化
