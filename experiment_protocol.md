# Experiment Protocol v1: AI Judgment Micro-Intervention

## Why This Protocol
用户当前最主要的约束不是“缺想法”，而是：
- 样本只有 `4-5` 人
- 时间窗口极短
- 如果实验设计太复杂，最后只会得到很弱的结论

因此本 protocol 的目标不是做强因果实验，而是做一个 **small-N but defensible pilot**：
- 有清楚的任务边界
- 有可重复的前后测
- 有个性化干预逻辑
- 有足够清楚的证据链支撑 feasibility 和初步 improvement

## Recommended Design

### Final Recommendation
采用 **single-session within-subject pilot**，但不要只做“裸 pre/post”。

推荐加入一个更强的内部对照：
- pretest 先测三个 judgment categories
- 系统识别每个学生最弱的两个 categories
- intervention 只针对这两个 weakest categories
- posttest 同时包含：
  - `targeted items`：对应被干预的类别
  - `untargeted items`：未被重点干预的类别

同时明确：
- `pretest` 是 **AI-free baseline**
- `intervention` 是 **bounded scaffolded AI-like support**
- `posttest` 是 **AI-free judgment assessment**

这样就算样本很小，也可以做一个较可信的内部比较：
- targeted categories 是否改善更明显
- untargeted categories 是否只出现有限 transfer

### Why Not Use a Separate Control Group
- `n=4-5` 做 between-subject control 几乎没有解释力
- 不同学生基础差异太大，反而会淹没干预信号
- 这轮更适合做 within-subject feasibility

### Why the Posttest Must Be AI-Free
- 本研究要测的是 judgment formation，而不是即时 AI-assisted performance
- 如果 posttest 允许继续向 AI 求助，就无法区分“学会了判断”与“临场继续依赖外部支架”
- 这点与 `How AI Impacts Skill Formation` 的核心逻辑一致：skill formation 需要单独测，而不能只看任务完成

## Study Structure

### Total Duration
建议控制在 `75-90` 分钟（因为 pretest 和 posttest 各增加约 5 分钟）。

### Session Flow
1. Consent + brief background survey: `5` 分钟
2. Warm-up with one non-study example: `3` 分钟
3. Pretest (`AI-free`): `20-24` 分钟（原 15-18，增加 2 题）
4. Auto-profile + scene generation: `1-2` 分钟
5. Personalized intervention (`bounded scaffolded support`): `12-15` 分钟
6. Transition Prompt: `0.5` 分钟（新增！简短提醒受试者接下来独立判断）
7. Posttest (`AI-free`): `20-24` 分钟（原 15-18，增加 2 题）
8. Short retrospective interview: `8-10` 分钟
9. Debrief: `2` 分钟

## Task Format

### Core Task Scenario
全部任务都锚定在 `AI-assisted bounded knowledge tasks`，而不是单一 academic writing 语境。当前版本覆盖四类内容领域：
- research report
- financial analysis
- data processing
- history / humanities

但每道题不是让学生自由上网搜索，而是给出一个 **bounded facts package**：
- prompt-like task goal
- AI answer
- claimed source(s)
- facts package

### Why Use Facts Packages
- 控制实验变量，避免浏览器搜索能力差异
- 保证题目可平行化
- 让“判断能力”而不是“检索熟练度”或“领域背景知识”成为主要测量对象

### Participant Response Format
每道题都要求学生完成四步：
1. 做出 judgment
2. 写一句理由：哪里有问题或为什么可信
3. 选下一步动作：从以下 5 个固定选项中选择：
   - verify or inspect the source
   - ask AI to regenerate with supporting evidence
   - weaken the claim wording
   - flag and do not use this output
   - accept with minor edits
4. 打一个 confidence 分数：`1-5`

judgment 形式按题型区分：
- A/B 类单答案题：`Accept / Revise / Reject`
- C 类比较题：`Prefer A / Prefer B`

补充约束：
- 并非每道单答案题都应该被判断为 `Revise / Reject`
- 题目矩阵中应保留少量 calibrated-acceptance items，用来测量参与者是否会对 evidence-aligned AI output 作出恰当保留，而不是一律不信

## Categories to Measure

### Category A: Hallucinated Citation Detection
学生判断 AI 给出的引用是否可疑、虚构或不匹配。

### Category B: Source Verification
学生判断来源是否真正支持 AI 的 claim，而不是只看标题像不像。

### Category C: Comparative Trust Calibration
学生比较两个 AI answers，判断哪一个更可信，并说明依据。

### Category D: Scope Generalization Detection
学生识别 AI 将特定语境下的有限发现不当泛化到更广范围的情况（如：单一城市访谈 → "all investors"，或两个县的档案研究 → "late-Qing China as a whole"）。

## Item Counts

### Recommended Item Count
- Pretest: `8` items
  - A 类 `2`
  - B 类 `2`
  - C 类 `2`
  - D 类 `2`
- Posttest: `8` parallel items
  - targeted 类 `4`（因为现在有 4 个 category，选 weakest 2 做 targeted）
  - untargeted 类 `4`

### Design Rationale
- 新增第四个 category（Scope Generalization Detection）后，pretest 和 posttest 各增加 2 题
- Posttest 中：取 pretest 得分最低的两个 categories 作为 targeted（各 2 题），其余两个 categories 作为 untargeted（各 2 题）
- 虽然题数增加，但在小样本 pilot 中仍可接受，因为内容专注且层次清晰
- 题面应在 `调研报告 / 金融分析 / 数据处理 / 历史人文` 四个领域之间轮换，以降低单一语境 cue learning 的风险
- 每个 category 内部应尽量包含：
  - `1` 道 clear-error anchor item
  - `1` 道 calibration / boundary item
- 这样可以避免整个 instrument 退化为纯 error-detection task，并提升 weakest-two profile 的解释力

## Pretest to Profile Mapping

### Scoring Per Item
- Judgment decision accuracy: `0/1`
- Action selection quality: `0/1`
- Explanation quality: `0/2`

每题总分 `0-4`。

### Category Score
每个 category 两题，总分 `0-8`。

### Profile Assignment Rule
系统取分数最低的两个 categories 作为该学生的 targeted profiles：
- `hallucination-weak`
- `verification-weak`
- `trust-calibration-weak`
- `scope-generalization-weak`

如果两个 category 得分相同且差距 ≤1 分，由 operator 结合 explanation 文本做一次快速人工确认（30 秒），而不是纯靠数字规则。这种做法可在论文中描述为 "semi-automated profiling with operator verification"。

如果 dry run 发现 profile 频繁需要人工修正，建议退到只取 weakest-one profile。

### Cross-Cutting Weakness
如果 explanation quality 在所有类别都低，则不给单独 profile，而是在 intervention 中给更强的 `Reflector` scaffold。

## Intervention Design

### Intervention Length
总时长 `12-15` 分钟，不要更长。

### Structure
每个 targeted category 分配 `2` 个 micro-scenes：
- Scene 1: `Tutor`
- Scene 2: `Skeptic + Reflector`

两类 profile 共 `4` 个 scenes。

### Scene Functions

#### Tutor
- 用一个非常短的规则解释该类错误
- 给一个 worked example
- 强调可执行判断标准
- 如果学习任务要求参与者“改写原句”“指出这句话的问题”或“标出夸大短语”，界面必须同时显示对应失败 pretest item 的题干、AI 输出和事实情况回顾，不能只给抽象任务指令

对于 D 类（Scope Generalization Detection）：
- D1_TUTOR: 教会学生检查”这个研究的样本、语境和结论范围是否被 AI 放大了”

#### Skeptic
- 专门挑战看似合理但证据不足的回答
- 强迫学生指出”哪一句不能直接信”
- 不直接给答案，而是问：`What is missing?`

对于 D 类（Scope Generalization Detection）：
- D2_SKEPTIC_REFLECT: 挑战学生找出 AI 泛化的具体词汇（如 “all”, “universally”, “across”），并提炼规则

#### Reflector
- 让学生总结一个可迁移的判断 rule
- 例如：
  - “看到 citation 先核对作者-年份-主题是否一致”
  - “看到强 claim 先找 source 是否真的支持因果”
  - “看到广泛性 claim 先核对样本范围和语境限制”

### Bounded Interaction
不建议做开放式多轮聊天。推荐：
- 每个 scene 只有 `1-2` 次短回应
- 大部分内容预先模板化
- 这样更稳、更容易比较不同参与者

## Posttest Design

### Parallelism Rule
Posttest 不得复用 pretest 原题。

必须满足：
- 相同 category
- 相似结构
- 不同文本内容
- 不同 source card

### Targeted vs Untargeted Composition
- 对两类 targeted categories，各出 `2` 道平行题（共 4 题）
- 对未 targeted 的两个 categories，各出 `2` 道平行题（共 4 题）

### Item Order Randomization
**Posttest 题目必须打乱顺序，不得将 targeted 题连续出现。** 这有助于减少 demand characteristics 的影响。

### Neutral Instruction Language
Participant packet 中不提及"我们会重点测你刚练过的类型"，只说"下面是另一组判断任务"。

### Why This Matters
这能帮助你区分：
- intervention 是否真的作用在被瞄准的弱点上
- 还是只是因为参与者做完前测后自然更熟悉题型
- 以及受试者猜测实验意图带来的 demand characteristics

## Transition Prompt

### Purpose
在 intervention 结束和 posttest 开始之间，向受试者展示过渡提示，帮助其从 scaffolded 模式清楚切换到 independent judgment 模式。

### Text
"接下来的题目需要你独立判断，不会有任何 AI 辅助。请像自己审稿一样作答。"

### Timing
- 时长：约 30 秒
- 位置：intervention 完成后、posttest 首题前
- 形式：屏幕显示 + operator 口头重复（可选）

## Interview Protocol

### Duration
`8-10` 分钟

### Core Questions
1. 哪个 scene 最有帮助？为什么？
2. 你现在最常用的判断规则是什么？
3. 哪种错误你仍然最容易犯？
4. 如果把这个系统嵌入真实课程，你会在哪一步使用它？

### Purpose
- 不是做很长的 qualitative study
- 而是为 pilot paper 提供机制解释和改进方向

## Measures

### Primary Measures
- item-level judgment accuracy
- explanation quality
- confidence calibration

### Secondary Measures
- response time
- action selection quality
- perceived usefulness
- perceived cognitive load
- interaction pattern codes

### Confidence Calibration
建议使用简单指标：
- 正确题的平均 confidence
- 错误题的平均 confidence
- 二者差值

如果时间允许，再计算 participant-level miscalibration：
- `mean(confidence_normalized - correctness)^2`

## Scoring and Analysis

### Quantitative
- 以 participant-level descriptive tables 为主
- 汇报 pre/post 总分变化
- 汇报 targeted vs untargeted category 变化
- 不强行做显著性检验

### Qualitative
- explanation text 用 rubric 双人打分
- interview 只提炼 `2-4` 个机制性主题
- 对 session 过程再补一层 interaction pattern coding，用来区分更偏 `cognitive engagement` 的使用方式和更偏 `authority-following` 的使用方式

### Recommended Table Layout
1. Participant profile table
2. Category-level pre/post score table
3. Targeted vs untargeted change table
4. Quote table for representative reflections
5. Interaction pattern summary table

## Threats and Mitigations

### Threat 1: Practice Effect
风险：
- 参与者只是因为熟悉题型而变好

缓解：
- 使用平行题
- 使用 targeted vs untargeted 内部比较

### Threat 2: Small Sample
风险：
- 结果不稳定

缓解：
- 明确定位为 feasibility pilot
- 用 participant-level evidence 而不是夸大 generalization

### Threat 3: Prototype Instability
风险：
- 系统没做完，实验无法跑

缓解：
- 保留 Wizard-of-Oz 备选
- 优先保证题目与日志，而不是 agent 炫技

### Threat 4: Explanation Scoring Subjectivity
风险：
- 文本打分容易飘

缓解：
- 先写 rubric
- 两位评分者独立打分
- 先用两份样本校准标准

### Threat 5: Interaction Coding Drift
风险：
- operator 对 interaction pattern 的编码不稳定

缓解：
- 使用固定 codebook
- 每个 pattern 附 1-2 个行为例子
- 先在 dry run 上做一次试编码

### Threat 6: Demand Characteristics
风险：
- 受试者猜到实验意图，在 targeted 题上投入更多注意力，导致高估干预效果

缓解：
- 打乱 posttest 顺序（不连续出现 targeted 题）
- 使用中性指导语（不明确说明哪些题目是"重点测"的）
- 在论文中显式讨论该风险及缓解方法

## Minimal Interface Requirements

### Screen 1
Consent + background

### Screen 2
Pretest item interface

### Screen 3
Intervention scene interface

### Screen 4
在每个 intervention scene 中，参与者在输入回答前必须能看到：
- 对应失败 pretest item 的题干
- 对应失败 pretest item 的 AI 输出
- 对应失败 pretest item 的事实情况或关键证据边界
- 一条明确说明：如果学习任务提到“原句”“这句话”“这个声明”，均指上方回顾中的 AI 输出

Posttest + interview

### Required Logging
- participant id
- item id
- category
- targeted or untargeted
- decision
- explanation
- action
- confidence
- response time
- scene sequence
- interaction pattern observations
- posttest_item_order（记录实际呈现顺序）
- operator_profile_override（记录 operator 是否手工调整了 profile）

## Decision
如果当前只能保一件事，那就保住下面这条：

**不要把实验做成开放式 AI 聊天体验，而要做成可平行、可评分、可解释的 task-based intervention study。**

本协议在原有三个 judgment categories 的基础上新增第四个（Scope Generalization Detection），并相应扩展了 pretest 和 posttest 的题量（各增加 2 题），总实验时长调整为 75-90 分钟。同时引入了 semi-automated profiling with operator verification、posttest 随机化、transition prompt、以及 demand characteristics 讨论，以进一步提升 pilot 的可信度和严谨性。
