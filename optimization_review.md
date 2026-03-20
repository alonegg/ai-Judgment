# AI Judgment Micro-Intervention 优化建议

> 基于对 plan 文件夹下全部文档的通读，从研究设计、题目质量、实验流程、时间线、论文写作五个维度给出诊断与建议。
> 审阅日期：2026-03-19

---

## 一、总体评价

这套计划的整体成熟度很高。研究定位（pilot feasibility study）、场景选择（academic writing + source verification）、内部对照策略（targeted vs untargeted within-subject）以及 claim 边界控制都是合理的。materials_v1.json、12 道完整题目、scene scripts、scoring rubric、interaction pattern codebook 的配套也已经相当完备。

以下建议聚焦在"从 v1 到可跑 pilot"之间仍需关注的缝隙，按优先级从高到低排列。

---

## 二、研究设计层面

### 2.1 Profile 分配的稳定性风险（优先级：高）

当前方案用 pretest 6 道题（每类 2 道）的得分来划分 weakest-two profiles。每类只有 2 题、满分 8 分，一道题的偶然失误就可能翻转 profile 归属。

建议：

- 在 dry run 阶段重点观察 profile 分配结果是否符合直觉。如果出现"受试者明显在 B 类更弱，但因为 A 类某题措辞模糊导致 A 类被错误判为最弱"的情况，说明诊断粒度不足。
- 考虑增加一条 tie-breaking 补充规则：当两个 category 得分相同且差距 ≤1 分时，由 operator 结合 explanation 文本做一次快速人工确认（30 秒级别），而不是纯靠数字规则。这在 n=4-5 的小样本 pilot 中完全可行，也能在论文中写为"semi-automated profiling with operator verification"。
- 如果 dry run 发现 profile 频繁需要人工修正，则建议退到只取 weakest-one profile，把 4 个 scenes 全部集中在这一个弱点上，强化干预剂量，也简化分析。

### 2.2 Posttest 的 targeted/untargeted 题目分配可能泄露实验意图（优先级：中）

当前设计中，posttest 的 6 题按 targeted 4 + untargeted 2 分配。如果受试者能感知到"有些题和刚才练习的很像"，就可能产生 demand characteristics——他们可能在 targeted 题上投入更多注意力，不是因为真的学会了，而是因为猜到了实验意图。

建议：

- 在 posttest 中打乱题目顺序，不要把 targeted 题连续出现。
- 考虑在 participant packet 中不提及"我们会重点测你刚练过的类型"，只笼统说"下面是另一组判断任务"。
- 在论文的 Threats 部分需要显式讨论这一点，说明已通过打乱顺序和中性指导语来缓解。

### 2.3 缺少 pretest-posttest 题目难度匹配的验证手段（优先级：中）

平行题设计的核心假设是 pre 和 post 难度相当。但当前所有题目只经过了研究者自身的判断，没有任何独立数据支撑难度一致性。

建议：

- 在 dry run 中让 1-2 名非参与者（如同事）同时做 pre 和 post 两套题，观察两套总分是否接近。如果 post 明显更容易或更难，需要在正式 pilot 前调整。
- 在论文中也应简要提及这一步，例如"Parallel items were reviewed by two independent raters and adjusted for comparable difficulty prior to the pilot."

### 2.4 AI-free posttest 与 intervention 之间缺少缓冲（优先级：低）

从 intervention scenes（有 AI scaffolding 支持）直接进入 AI-free posttest，认知模式切换很突然。受试者可能在前 1-2 题仍处于"找系统帮我"的心态。

建议：

- 在 intervention 结束和 posttest 开始之间加一条简短过渡提示，例如："接下来的题目需要你独立判断，不会有 AI 辅助。请像自己审稿一样作答。"这不会增加实验时间，但能帮助受试者清楚切换心态。
- 在 pilot runbook 中增加这一步。

---

## 三、题目与材料层面

### 3.1 Evidence card 信息密度不均（优先级：高）

通读 12 道题后，发现 A 类题（hallucinated citation）的 evidence card 线索非常明显（"No DOI found""No record"），熟悉学术写作的受试者几乎不可能答错。而 B 类题（source verification）的 evidence card 需要受试者理解"perceived efficiency ≠ quality improvement"这类语义区分，难度显著更高。

建议：

- 适度增加 A 类题的迷惑性。例如在 evidence card 中加入一条看起来相关的真实 source snippet，让受试者需要判断"这条邻近 source 能不能替代 AI 给的 citation"，而不是直接看到"not found"就选 reject。当前 PRE_A2 已经有这个设计意识，但 PRE_A1 和 POST_A1 的线索过于直白。
- 或者在分析时明确把 A 类定位为"容易题"，在论文中讨论时注意区分——如果 A 类天花板效应严重，targeted intervention 在 A 类上的改善空间会很小。

### 3.2 C 类题（比较题）的正确答案过于一致（优先级：中）

四道 C 类题（PRE_C1、PRE_C2、POST_C1、POST_C2）的 gold label 全部是"选 B 更可信"。如果受试者在做完前两题后发现"永远选 B 就对了"，后面的 C 类题就失去了判断价值。

建议：

- 至少把其中一道 C 类题的 gold label 改为"选 A"，即让 A 答案在某道题上是更可信、更有边界意识的那个。这需要重写一对 AI answer，但工作量不大。
- 如果时间紧，也可以在 posttest 中调换 A/B 的呈现顺序（把原来的 B 内容放到 A 的位置），物理上打断"总是选右边"的策略。

### 3.3 Next_action 选项的区分度问题（优先级：低）

五个 fixed next_action 选项中，"verify source metadata"和"inspect abstract or excerpt"对受试者来说区别比较模糊（都是"去查一下来源"）。gold label 中这两个选项也经常互为可接受答案。

建议：

- 考虑合并为"verify or inspect the source"一个选项，把节省出的选项空间给一个更有区分度的动作，例如"flag this output and do not use"——这在 A 类 reject 场景下比"discard and rewrite"更精确。
- 或者在评分时明确说明：对 A 类题，metadata 和 abstract 类检查都算对；评分粒度只做"对准问题 vs 没对准问题"的二分。

---

## 四、实验流程层面

### 4.1 Pilot runbook 缺少应急预案细节（优先级：高）

当前 runbook 列出了 common failure modes，但没有覆盖几种高概率发生的现场状况：

- 受试者在 pretest 中提前完成所有题目（例如只用了 8 分钟），剩余时间怎么处理？
- 受试者在某道题上纠结超过 5 分钟怎么办？是提醒还是跳过？
- intervention scene 中受试者完全不写 reflector response 怎么办（比如只写"不知道"）？

建议：

- 增加一个"operator decision table"附录，列出 3-5 种常见异常及处理方式。例如：单题超过 4 分钟则温和提醒；reflector response 为空则追问一次"你能试着写一句简短的规则吗？"；pretest 提前完成则让受试者检查一遍但不修改。
- 这些决策在论文中不需要展开，但在实际执行中能避免 operator 现场犹豫。

### 4.2 Interview 缺少对 negative experience 的探测（优先级：中）

当前四个 interview 问题全部倾向正面（"最有帮助""最常用的规则"），没有直接问"哪里让你困惑或不舒服"。小样本 pilot 的核心价值之一是收集改进信号，纯正面问题会遗漏关键反馈。

建议：

- 增加一到两个面向问题的追问：
  - "在刚才的过程中，有没有哪个环节让你感到困惑或不确定？"
  - "如果让你删掉一个环节，你会删哪个？为什么？"
- 这些不需要单独计时，可以作为现有问题的自然追问。

### 4.3 Interaction pattern coding 的时机需要明确（优先级：中）

Codebook 说"session 结束后做编码"，但没有说明 operator 在 session 中需要做哪些即时观察记录。如果全凭事后回忆+文本回看来编码，信息损失会比较大。

建议：

- 在 runbook 中增加一条：operator 在 intervention 阶段为每个 scene 做一句实时 observation note（纸笔或简单表格），记录受试者是主动提问型还是被动接受型。
- 事后编码时结合 observation note + response text + interview 回答三个来源来判定 pattern。

---

## 五、时间线与执行风险

### 5.1 3月19日到3月30日的节奏过紧（优先级：高）

当前时间线假设一切顺利，但以下环节容易超时：

- dry run 发现题目问题后需要修改 → 可能占用 3/22-3/23
- pilot 招募不顺利（4-5 人集中在 3/23-3/24 完成）→ 可能延到 3/25
- 数据清洗 + rubric 打分需要双人协调 → 如果第二评分者不及时响应，分析会延误

建议：

- 把论文写作提前启动。3/20 起就可以开始写 Introduction、Related Work 和 Method，这些部分不依赖 pilot 数据。到 3/25 只需要填 Results 和 Discussion。
- 为 pilot 招募设一个 plan B：如果 3/23 只招到 3 人，也足够作为 pilot。不要等凑齐 5 人而错过写作窗口。n=3 的 feasibility study 仍然可投。
- 双人评分可以用异步方式：第一评分者先做完全部打分，第二评分者只做 30% 的校验抽查，report inter-rater agreement on a subset。

### 5.2 Stop rule 需要更具体的触发条件（优先级：中）

当前 stop rule 写的是"3/21 前未冻结 item bank 就砍掉复杂 agent"，但 item bank 已经冻结了（v1 已有 12 道完整题）。这条 stop rule 已经过时。

建议更新为：

- 如果 3/21 dry run 发现超过 3 道题需要大幅重写 → 退到 8 题（每类 pre 2 + post 仅 targeted 2），缩小实验范围。
- 如果 3/24 仍未完成任何一次正式 pilot session → 改为 Wizard-of-Oz + 仅收集 pretest 数据，论文定位从"intervention feasibility"降级为"diagnostic instrument pilot"。
- 如果 3/27 论文初稿无法完成 Method + Results → 只投 short paper / poster（如果 ICAIE 接受的话）。

---

## 六、论文写作策略

### 6.1 Contribution 陈述需要更锐利（优先级：高）

当前 expected contributions 列了三条，但第一条（"提出 AI judgment operationalization"）和第三条（"提供 pilot 证据链"）的边界不够清晰。审稿人可能会问："这个 operationalization 和已有的 AI literacy 框架有什么不同？"

建议重新组织为：

- **Contribution 1**（理论/框架）：区别于已有的 AI literacy 框架（如 A-Factor），本文将 AI judgment 窄化为三个可诊断的 task-level 能力（hallucination detection, source verification, trust calibration），并提出配套的诊断-干预-评估闭环。
- **Contribution 2**（方法/设计）：提出 personalized micro-intervention 的 profile-to-scene 映射机制，包含 within-subject targeted vs untargeted 对照，适用于小样本教育场景。
- **Contribution 3**（证据）：通过 n=4-5 的 pilot 提供初步 feasibility 和 improvement evidence，包括 task performance, confidence calibration, interaction patterns 和 qualitative feedback。

### 6.2 Related work 需要提前布局对比点（优先级：高）

论文最终需要和两类工作做明确对比：

- **态度/自报告类研究**（如 ChatGPT attitude surveys）：本文的区别是 task-based assessment，而不是 Likert 量表。
- **大系统/平台类研究**（如 OpenMAIC）：本文的区别是 lightweight, bounded, minimal viable intervention，而不是大型 multi-agent 系统。

建议在写 related work 时，不要泛泛罗列文献，而是围绕这两个对比轴组织段落，最后用一段话明确说明本文的定位缝隙。

### 6.3 Results 呈现的建议模板（优先级：中）

小样本最忌讳的是试图跑统计检验然后报告"p 值不显著"。建议采用以下呈现策略：

- 用 participant-level 的表格逐人展示 pre/post 变化，不做汇总均值检验。
- 用一张 targeted vs untargeted 的对比图（例如 slope chart 或 paired dot plot），视觉化呈现差异方向。
- confidence calibration 用一张 2×2 的散点或条形图（正确/错误 × pre/post）。
- interaction pattern 用一张简单的频次表 + 1-2 个 illustrative quotes。
- 论文用"observed"而不是"demonstrated"，用"suggest"而不是"prove"。

### 6.4 Discussion 中需要写的两个"诚实段落"（优先级：中）

- **Practice effect 段**：承认 pretest-posttest 本身可能带来练习效应，但 targeted vs untargeted 对比提供了初步的内部证据来区分练习效应和干预效应。
- **Scalability 段**：承认当前干预是 rule-based + 模板化的，讨论如果要扩展到更大样本或更多场景，哪些模块需要 LLM-driven adaptation，以及这会引入什么新挑战。

---

## 七、Prototype 与技术实现

### 7.1 日志完整性是唯一不可妥协的技术底线（优先级：高）

当前 prototype 的 README 和 app.js 已存在，但需要确认以下日志字段在每个环节都有实际写入：

- response_time_sec（需要从页面加载到提交的精确计时）
- scene_sequence（intervention 的实际展示顺序）
- profile_assigned（自动计算的 profile 结果）

建议在 dry run 后导出一次完整日志，逐字段核对是否有空值。如果有字段缺失，优先修复日志，再修复 UI 美观度。

### 7.2 Wizard-of-Oz 的备选方案需要一份精简 SOP（优先级：中）

如果 prototype 在 dry run 中出现严重 bug，需要立刻切换到 Wizard-of-Oz。建议提前准备：

- 一份 Google Form 或 Qualtrics 问卷作为数据收集后端。
- Operator 在旁边用 spreadsheet 实时算 profile 并手动决定展示哪些 scenes。
- Scenes 可以打印成纸质卡片或用 slides 展示。

这份 SOP 不需要很长，半页纸即可，但需要在 3/21 前准备好。

---

## 八、优化建议汇总表

| 编号 | 维度 | 建议 | 优先级 | 预估工时 |
|------|------|------|--------|----------|
| 2.1 | 研究设计 | Profile 分配加入 operator 确认环节 | 高 | 0.5h |
| 2.2 | 研究设计 | Posttest 打乱题目顺序 + 中性指导语 | 中 | 0.5h |
| 2.3 | 研究设计 | Dry run 时做 pre/post 难度匹配检查 | 中 | 1h |
| 2.4 | 研究设计 | Intervention→posttest 之间加过渡提示 | 低 | 0.1h |
| 3.1 | 题目材料 | 提高 A 类 evidence card 迷惑性 | 高 | 1-2h |
| 3.2 | 题目材料 | C 类题至少一道 gold label 改为选 A | 中 | 1h |
| 3.3 | 题目材料 | 合并或澄清 next_action 选项 | 低 | 0.5h |
| 4.1 | 实验流程 | Runbook 补充 operator decision table | 高 | 0.5h |
| 4.2 | 实验流程 | Interview 增加 negative experience 问题 | 中 | 0.1h |
| 4.3 | 实验流程 | 明确 interaction pattern 的即时记录方式 | 中 | 0.3h |
| 5.1 | 时间线 | 论文写作提前启动 + 招募 plan B | 高 | — |
| 5.2 | 时间线 | 更新过时的 stop rules | 中 | 0.3h |
| 6.1 | 论文写作 | 重新组织三条 contribution | 高 | 0.5h |
| 6.2 | 论文写作 | Related work 围绕两个对比轴布局 | 高 | 写作时 |
| 6.3 | 论文写作 | Results 采用 participant-level 呈现 | 中 | 写作时 |
| 6.4 | 论文写作 | Discussion 写好 practice effect 和 scalability 段 | 中 | 写作时 |
| 7.1 | 技术实现 | Dry run 后逐字段核对日志完整性 | 高 | 0.5h |
| 7.2 | 技术实现 | 提前准备 Wizard-of-Oz SOP | 中 | 1h |

---

## 九、建议的下一步行动（按时间排序）

**今天（3/19）**：

1. 更新 stop rules（5.2）
2. 开始写论文 Introduction 和 Related Work 框架（6.2）
3. 检查 C 类题 gold label 一致性问题，考虑是否调整（3.2）

**明天（3/20）**：

4. 在 dry run 前修改 A 类 evidence card 迷惑性（3.1）
5. Runbook 补充 operator decision table（4.1）
6. 准备 Wizard-of-Oz SOP 作为 plan B（7.2）

**3/21-3/22（dry run）**：

7. 执行 dry run 时重点观察 profile 分配稳定性（2.1）
8. 检查 pre/post 难度匹配（2.3）
9. 导出日志逐字段验证（7.1）

**3/23-3/24（pilot）**：

10. 执行 pilot，即使只有 3 人也推进
11. Interview 中加入 negative experience 追问（4.2）

**3/25 起（分析+写作）**：

12. 按 participant-level 呈现策略整理 results（6.3）
13. 完成论文初稿

---

*本文档为项目优化建议，不替代原有计划文件。建议逐条评估后决定采纳与否。*
