# Task Plan: ICAIE AI Judgment Micro-Intervention

## Goal
在 `2026-03-30` ICAIE Full Paper 截稿前，收敛并执行一篇面向大学生的 `Personalized AI Judgment Micro-Intervention` pilot paper 计划，完成题目冻结、原型边界、实验设计、写作节奏与风险控制。

## Phases
- [x] Phase 1: 明确会议约束、样本约束与最小可投稿范围
- [x] Phase 2: 建立最小 literature anchor，并确定推荐 framing
- [ ] Phase 3: 冻结任务场景、题目名称与 assessment rubric
- [ ] Phase 4: 搭建最小原型与日志采集
- [ ] Phase 5: 运行 4-5 人 pilot、整理数据与访谈
- [ ] Phase 6: 完成结果分析、论文撰写与投稿包装

## Key Questions
1. 这篇稿子最终锚定在哪个任务场景：`bounded knowledge tasks/source verification`、`general study tasks`，还是 `programming assistance judgment`？
2. intervention 的“个性化”做到哪一层才够：rule-based profile，还是 LLM-driven adaptive scenes？
3. 评估重点放在什么：判断准确率、confidence calibration、解释质量，还是接受度？
4. 是否需要引入多 agent 角色，还是只保留单 agent + skeptic scaffold 就足够？
5. pilot paper 的 claim 如何控制在“小样本可支撑”的范围内？

## Decisions Made
- 目标 venue 固定为 `ICAIE 2026`，采用 `pilot / feasibility study` 定位，而不是大样本效果证明。
- 推荐主线为 `AI literacy -> AI judgment -> personalized micro-intervention`，避免落回泛态度调查。
- 推荐优先场景为 `bounded knowledge tasks + source verification + hallucination detection`。
- 推荐实验形式为 `single-session pretest -> personalized intervention -> posttest`，必要时加短访谈。
- 推荐系统形态为轻量 web prototype，不依赖大型平台，不把 `readitdeep` 作为前置条件。
- 推荐具体 protocol 为：`parallel pre/post item sets + weakest-two-profile targeting + targeted vs untargeted within-participant contrast`。
- 推荐 evidence 形式为内置 `facts packages`，不依赖开放式联网搜索，以控制实验变量。
- 新增第四个 judgment category：`Scope Generalization Detection`（D 类），将诊断题目从 6+6 扩展为 8+8。
- 引入 semi-automated profiling with operator verification，提升诊断的人工核对环节。
- Posttest 实行随机排序以防 demand characteristics。
- 新增 intervention → posttest 过渡提示，明确信息隔断。
- 更新 next_action 选项为 5 个新选项：verify, inspect, flag, accept, skip（合并原有 verify/inspect，新增 flag）。
- C 类题 gold label 实现平衡分布（不再全选 B）。
- A 类事实情况包迷惑性提升，增加判断难度。
- `2026-03-20` 完成题目矩阵审计：当前 `16` 题已足够支撑一次 pilot，但仍偏向 `error-detection-heavy instrument`，下一步应优先补 `calibrated acceptance`、纯化 `B/D` 边界，并让 `C` 类从“选更谨慎答案”升级为“选更 evidence-aligned 答案”。
- `2026-03-20` 已完成第一轮全局重构：A 类 `A2` 改为 boundary citation case，B 类新增 `2` 道 calibrated-acceptance item，C 类 `PRE_C2` 改成 evidence-alignment comparison，D 类 `PRE_D2` / `POST_D1` 纯化为 scope-only case；并已同步到 `item_bank`、`materials`、`participant packet`、`protocol`、`rubric`、`runbook` 与 prototype/networked participant 文案。
- `2026-03-20` 已将题目矩阵从单一教育写作语境重构为 `4 categories × 4 domains` 的跨域版本，覆盖 `调研报告 / 金融分析 / 数据处理 / 历史人文`，以降低 topic-specific cue learning，并更接近 cross-domain judgment calibration。
- `2026-03-20` 已修正 intervention scene 语境缺口：当学习任务要求参与者改写“原句”或指出“这句话/这个声明”的问题时，界面必须显式展示对应失败 pretest item 的题干、AI 输出、事实情况与关键问题说明，不能让参与者仅凭记忆完成任务。
- `16` 道完整题目（8+8 扩展）、gold labels、scene scripts、scoring rubric 已完成 v2，待 dry run 验证。
- 已补齐 `materials_v2.json`、participant packet、pilot runbook、CSV templates 与最小 prototype，可直接服务内部 dry run。
- 已引入 `interaction pattern` codebook，并将 `AI-free posttest` 与过程编码 hooks 写入 protocol / materials / prototype。
- `2026-03-20` 已接入全局 `stitch` MCP，提取 `WarmUp Intro` screen 的 layout/theme/code 作为视觉参考，并将 `prototype` 与 `networked participant/dashboard` 的排布、字体与色彩统一切换为更接近该参考页的 `editorial blue-gray` 体系。
- `How AI Impacts Skill Formation` 已下载到本地 `references/` 并完成 PDF 验真。
- Prototype 源码已托管至 GitHub：https://github.com/alonegg/ai-Judgment （2026-03-19），可用于论文中引用实验工具的开源地址。

## Errors Encountered
- 暂无。

## Risks
- 样本量仅 `4-5` 人，无法支撑强因果或泛化 claim。
- 如果任务设计过宽，干预效果会被题目难度与个体差异淹没。
- 如果 prototype 追求多 agent 炫技，会挤压题目设计和数据分析时间。
- 如果只做 attitude survey，论文会弱化为”描述性结果”。
- 新增 Category D 后实验时长增加到 `75-90` 分钟，存在受试者疲劳风险，需密切监控。
- 若继续沿用“几乎全是 reject / revise”的题目结构，pilot 更可能测到 `overtrust reduction`，而不是完整的 `trust calibration`。
- 若 `POST_D1` 等题继续混合 `scope expansion + construct mismatch`，则 `scope-generalization-weak` profile 的可解释性会下降。
- 若参与者仍在 dry run 中呈现明显的 blanket distrust（对 calibrated-acceptance item 也系统性选 `Revise / Reject`），则需进一步调整 briefing 与 warm-up，而不只是继续改题。

## Stop Rule
- 若在 `2026-03-21` dry run 发现超过 3 道题需要大幅重写，则退到每类 pre 2 + post 仅 targeted 2 的 8 题方案，缩小实验范围。
- 若在 `2026-03-24` 仍未完成任何一次正式 pilot session，则改为 Wizard-of-Oz + 仅收集 pretest 数据，论文定位从”intervention feasibility”降级为”diagnostic instrument pilot”。
- 若在 `2026-03-27` 论文初稿无法完成 Method + Results 部分，则只投 short paper / poster。
- 若 pilot 结果不显著，也要保留 feasibility、behavior trace 与 qualitative findings，不硬写”有效提升”。

## Status
**Currently in Phase 3 → 4** - 已完成第一轮全局矩阵重构，并进一步将题库切换为跨域内容版本；prototype 与 networked 界面也已同步当前实验语境。当前版本的主要验证目标已从“是否需要改题”切换为“dry run 中是否真的出现更稳定的 profile 分配、accept/revise/reject 分化，以及参与者是否在跨域题面上仍能保持一致 judgment rule”。
