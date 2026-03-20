# Item Bank v1: AI Judgment in Academic Writing

## Design Principles
- 所有题目都必须围绕 `academic writing`
- 所有题目都必须配 `evidence card`
- pre/post 采用平行题，不得重复原文
- 每题控制在 `2-3` 分钟可完成
- 每个 category 至少包含 `1` 道 clear-error anchor item 与 `1` 道 calibration / boundary item
- 全部矩阵中应包含少量可接受题，避免把 instrument 退化为纯 `error detection`

## Response Schema
每题统一收集：
- `judgment`:
  - A/B 类：Accept / Revise / Reject
  - C 类：Prefer A / Prefer B
- `reason`: free-text
- `next_action`: fixed options
- `confidence`: 1-5

## Categories

### A. Hallucinated Citation Detection
目标：识别“看起来像学术引用，但实际上不可靠或不匹配”的输出。

#### Pre A1
- User task: 为一段关于 online peer feedback 的论文引言补一条 supporting citation
- AI answer: 给出一条格式完整但可疑的文献
- Evidence card: 作者、年份、期刊信息与一个不匹配摘要
- Correct direction: `Reject`

#### Pre A2
- User task: 为一条关于 student engagement with AI writing support 的句子补 citation
- AI answer: 给出一条主题基本相关、但 venue metadata 写错的引用
- Evidence card: 能检索到同作者同年份真实来源，但发表信息与 AI 给出的 citation 不一致
- Correct direction: `Revise`

#### Post A1
- 与 Pre A1 同构，但换成 writing feedback 场景

#### Post A2
- 与 Pre A2 同构，但换成 drafting planning / monitoring 场景

### B. Source Verification
目标：判断 source 是否真的支持 AI claim。

#### Pre B1
- User task: 总结“AI writing tools reduce revision time without harming quality”
- AI answer: 输出强因果论断
- Evidence card: source 只报告学生 perceived efficiency
- Correct direction: `Revise`

#### Pre B2
- User task: 写 related work 中关于 AI literacy framework 的一句总结
- AI answer: 用概念性、未过度声称的 wording 准确概括 framework paper
- Evidence card: 原文是 framework paper，支持课程设计含 verification / critical evaluation
- Correct direction: `Accept`

#### Post B1
- 与 source corroboration in argument writing 场景同构，但改成 evidence-aligned acceptable case

#### Post B2
- 与 Pre B2 同构，但换成 citation-use policy / classroom design 场景

### C. Comparative Trust Calibration
目标：比较两个 AI answers 哪个更可信，并解释为什么。

#### Pre C1
- User task: 生成一段关于 ethical AI use in writing courses 的 related work
- AI answer A: 文风流畅但没有明确证据锚点
- AI answer B: 语气更谨慎，明确标注 evidence boundary
- Correct direction: 选 B 更可信

#### Pre C2
- User task: 为 AI-assisted source use 写一句 related work
- AI answer A: 更具体，准确抓住 “更快找到候选来源 + 仍需核查支持关系”
- AI answer B: 语气更保守，但过于空泛，遗漏关键 verification issue
- Correct direction: 选 A 更可信

#### Post C1
- 与 Pre C1 同构，但换成 source evaluation in synthesis writing

#### Post C2
- 与 Pre C2 同构，但换成 evidence-based claim revision 场景

### D. Scope Generalization Detection
目标：识别 AI 不当将特定语境的发现泛化到更广泛适用范围的情况。与 B 类不同的是，D 类的 source 确实支持一个更窄版本的 claim，但 AI 不当扩大了适用范围。

#### Pre D1
- User task: 写关于 AI writing tools 对学生写作能力影响的 literature review
- AI answer: 声称 AI tools "improve essay quality across all student populations"
- Evidence card: 一项涉及 30 名某大学 STEM 学生的研究，只在该特定背景下发现改进
- Correct direction: `Revise`，缩小声明范围

#### Pre D2
- User task: 总结 AI feedback 在教育中的效果
- AI answer: 保留了 surface-level editing 这一 outcome，但把单一 MBA 项目泛化到更广范围
- Evidence card: 原研究只覆盖单个 MBA 项目，作者明确提醒不可推广到其他项目或写作类型
- Correct direction: `Revise`，限定到具体项目和任务范围

#### Post D1
- 与 Pre D1 同构，但换成 AI tutoring systems 和 critical reasoning 场景
- Evidence card: 同一 outcome 存在，但研究仅覆盖单一课程与单一学科，不能外推到所有本科专业

#### Post D2
- 与 Pre D2 同构，但换成 AI-mediated peer review 场景
- Evidence card: 单课程试点研究，结果不应泛化

## Fixed Options for `next_action`
- verify or inspect the source
- ask AI to regenerate with supporting evidence
- weaken the claim wording
- flag and do not use this output
- accept with minor edits

## Profile Mapping
- A 类低分 -> `hallucination-weak`
- B 类低分 -> `verification-weak`
- C 类低分 -> `trust-calibration-weak`
- D 类低分 -> `scope-generalization-weak`

## Intervention Hook Mapping

### hallucination-weak
- Tutor: citation hallucination checklist
- Skeptic: “Which field in this citation or abstract is suspicious?”
- Reflector: write one rule for spotting fabricated or mismatched citations

### verification-weak
- Tutor: claim-source alignment rule
- Skeptic: “Does the source support this exact wording, or only a weaker statement?”
- Reflector: rewrite the claim with correct epistemic strength

### trust-calibration-weak
- Tutor: compare answers using evidence anchoring and boundary language
- Skeptic: “Which answer sounds confident without showing support?”
- Reflector: write one trust rule for future AI use

### scope-generalization-weak
- Tutor: scope limitation awareness rule
- Skeptic: “What is the actual scope of this study? Does the claim go beyond it?”
- Reflector: rewrite the claim with appropriate scope markers (e.g., “in STEM disciplines”, “for graduate students”)

## Rubric Skeleton

### Decision Accuracy
- `1`: correct
- `0`: incorrect

### Action Quality
- `1`: next action is aligned with the actual issue
- `0`: next action misses the issue

### Explanation Quality
- `2`: identifies the exact evidence problem and proposes appropriate handling
- `1`: notices something is wrong but explanation is vague
- `0`: no meaningful reasoning

## Open Work
- 把每道题的完整文本写出来
- 为每题生成 evidence card
- 构造 A/B 两套 counterbalanced forms
- 写评分者说明
