# Scene Scripts v1: Tutor / Skeptic / Reflector

## Design Goal
scene 不是开放式聊天，而是 **短、定向、可比较** 的支架。

约束：
- 每个 scene 控制在 `2-3` 分钟
- 每个 scene 最多 `1-2` 次参与者输入
- 主要内容模板化，变量只来自 participant profile 和 pretest 错误点

## Global Scene Sequence

### Recommended Sequence
对每个 targeted profile 使用两个 scene：
1. `Tutor scene`
2. `Skeptic + Reflector scene`

如果一个参与者命中两个 weakest profiles，则总共 `4` 个 scenes。

## Shared Prompt Slots

每个 scene 可以从 pretest 中读取以下变量：
- `{failed_item_id}`
- `{student_goal}`
- `{ai_problematic_text}`
- `{evidence_gap}`
- `{better_rule}`

界面要求：
- 如果 learner task 提到“原句”“这句话”“这个声明”，或要求参与者改写 earlier answer，必须同时显示对应 failed item 的题干、AI 输出和事实情况。
- 不允许只给抽象任务指令，让参与者凭记忆完成 scene。

## 1. hallucination-weak

### H1 Tutor Scene
- Scene ID: `H1_TUTOR`
- Learning objective:
  - 学会在使用 AI citation 时优先检查“是否存在、是否匹配、是否相关”
- Tutor script:
  - "A citation can look academic and still be unusable."
  - "Before trusting it, check three things: existence, metadata match, and topical fit."
  - "If the source cannot be verified, do not soften it. Reject it."
  - "In your earlier response to `{failed_item_id}`, the key problem was: `{evidence_gap}`."
  - "A safer rule is: if the citation itself cannot be validated, rewrite instead of patching."
- Learner task:
  - "Write one short rule you would use next time before accepting an AI-generated citation."
- Expected good response:
  - mentions existence or metadata match before use

### H2 Skeptic + Reflector Scene
- Scene ID: `H2_SKEPTIC_REFLECT`
- Skeptic script:
  - "This citation looks polished, but what exactly makes it unreliable?"
  - "Point to one field or one mismatch that makes you stop trusting it."
- Learner task:
  - 用一句话指出最可疑的字段或 mismatch
- Reflector script:
  - "Good. Now convert that observation into a reusable rule."
  - "Complete this sentence: If a citation cannot be verified by metadata, I should ______."
- Expected good response:
  - reject or rewrite rather than continue using the citation

## 2. verification-weak

### V1 Tutor Scene
- Scene ID: `V1_TUTOR`
- Learning objective:
  - 学会区分“source 存在”与“source 真正支持该 claim”
- Tutor script:
  - "A real source can still be used incorrectly."
  - "Your job is not only to check whether a paper exists, but whether it supports this exact wording."
  - "When the evidence is weaker than the claim, revise the claim."
  - "In `{failed_item_id}`, the mismatch was: `{evidence_gap}`."
  - "A safer rule is: align claim strength with source strength."
- Learner task:
  - "Rewrite the original sentence in a weaker but evidence-aligned way."
- Expected good response:
  - shifts from strong causal wording to limited or suggestive wording

### V2 Skeptic + Reflector Scene
- Scene ID: `V2_SKEPTIC_REFLECT`
- Skeptic script:
  - "Which exact phrase in the AI answer goes beyond the source?"
  - "Is the problem causality, certainty, or outcome inflation?"
- Learner task:
  - 标出一个 overstated phrase，并给出原因
- Reflector script:
  - "Now write one rule for future reading: when should you weaken a claim instead of accepting it?"
- Expected good response:
  - points to unsupported causal or outcome language

## 3. trust-calibration-weak

### T1 Tutor Scene
- Scene ID: `T1_TUTOR`
- Learning objective:
  - 学会在两个 AI answers 之间比较“谁更可信”，而不是比较“谁更流畅”
- Tutor script:
  - "The more fluent answer is not always the more trustworthy one."
  - "A more trustworthy answer usually shows evidence boundaries."
  - "Look for cautious wording, explicit limits, and alignment with the source."
  - "In `{failed_item_id}`, the stronger answer was less trustworthy because `{evidence_gap}`."
  - "A safer rule is: trust the answer that stays closer to what the evidence can support."
- Learner task:
  - "Name one signal that makes an AI answer sound confident but under-supported."
- Expected good response:
  - mentions overconfident wording, missing evidence, universal claims, or causal inflation

### T2 Skeptic + Reflector Scene
- Scene ID: `T2_SKEPTIC_REFLECT`
- Skeptic script:
  - "If you had to defend your choice in front of a reviewer, what evidence-based reason would you give?"
  - "Do not say 'it sounds better'. Say what makes it more trustworthy."
- Learner task:
  - 用一句 evidence-based 理由为自己的选择辩护
- Reflector script:
  - "Complete this rule: When two AI answers disagree, I should prefer the one that ______."
- Expected good response:
  - refers to evidence anchoring, boundary language, or explicit uncertainty

## 4. scope-generalization-weak

### D1 Tutor Scene
- Scene ID: `D1_TUTOR`
- Learning objective:
  - 学会检查 AI 是否将原始研究的有限结论泛化到了更广的范围
- Tutor script:
  - "An AI answer can make a finding sound universal when the study was actually quite limited."
  - "Before accepting a broad claim, check: What was the sample? What was the context? What were the authors' own stated limitations?"
  - "If the original study was small, narrow, or discipline-specific, the claim should reflect that scope."
  - "In your earlier response to `{failed_item_id}`, the key problem was: `{evidence_gap}`."
  - "A safer rule is: match the scope of the claim to the scope of the evidence."
- Learner task:
  - "Write one short rule for checking whether an AI claim overgeneralizes a research finding."
- Expected good response:
  - mentions checking sample size, study context, or author-stated limitations before accepting broad claims

### D2 Skeptic + Reflector Scene
- Scene ID: `D2_SKEPTIC_REFLECT`
- Skeptic script:
  - "This claim sounds broad. Can you find the specific words that go beyond the original study?"
  - "Point to one word or phrase that makes the claim wider than what the evidence supports."
- Learner task:
  - 用一句话标出泛化最严重的词（如 "all", "universally", "across"），并说明为什么这超出了证据
- Reflector script:
  - "Good. Now convert that into a reusable rule."
  - "Complete this sentence: When an AI claim uses words like 'all' or 'universally', I should first check ______."
- Expected good response:
  - mentions checking whether the source's sample, context, or conclusions actually support that level of generalization

## Cross-Cutting Reflector Boost

### When to Use
如果参与者 explanation quality 普遍偏低，在所有 scene 后附加一个简短 reflector prompt。

### Reflector Boost Script
- "Do not only decide what to do. State why."
- "Use this format: The problem is ___, the evidence shows ___, so I should ___."

## Minimal Personalization Logic

### Inputs
- weakest profiles
- failed items in those profiles
- one short extracted evidence gap per failed item

### Logic
- If weakest profiles are `hallucination-weak + verification-weak`
  - show `H1 -> H2 -> V1 -> V2`
- If weakest profiles are `verification-weak + trust-calibration-weak`
  - show `V1 -> V2 -> T1 -> T2`
- If weakest profiles are `hallucination-weak + trust-calibration-weak`
  - show `H1 -> H2 -> T1 -> T2`
- If weakest profiles are `hallucination-weak + scope-generalization-weak`
  - show `H1 -> H2 -> D1 -> D2`
- If weakest profiles are `verification-weak + scope-generalization-weak`
  - show `V1 -> V2 -> D1 -> D2`
- If weakest profiles are `trust-calibration-weak + scope-generalization-weak`
  - show `T1 -> T2 -> D1 -> D2`

## Authoring Guidance
- 避免长篇教学说明
- 每个 scene 只教一个 rule
- 每个 scene 都要从参与者刚犯过的错误切入
- Reflector 输出最好保存到日志，用于 qualitative analysis

## Logging Fields
- scene_id
- participant_id
- targeted_profile
- source_failed_item
- learner_response_text
- response_time_sec
- completion_flag
