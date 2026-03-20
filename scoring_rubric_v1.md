# Scoring Rubric v1: AI Judgment Micro-Intervention

## Purpose
这份 rubric 只服务于当前 pilot：
- 保证 pre/post 评分一致
- 让小样本结果有可审计性
- 避免写结果时变成主观印象

## Scoring Units
每道题按四个维度评分：
1. decision accuracy
2. action quality
3. explanation quality
4. confidence

其中前 3 个维度进入 performance score，confidence 单独用于 calibration analysis。

## 1. Decision Accuracy

### Score = 1
- 参与者对该 AI answer 的总体处置是正确的
- 例如：
  - 应该 `Reject` 时选择了 `Reject`
  - 应该 `Revise` 时选择了 `Revise`
  - 在 calibrated-acceptance item 中正确选择了 `Accept`
  - 在比较题中正确选择了更可信的 `A` 或 `B`

### Score = 0
- 总体处置错误
- 例如：
  - 明显 hallucinated citation 仍选择 `Accept`
  - 明显 overstated claim 仍直接采纳
  - 在比较题中选择了更流畅但证据更弱的答案

## 2. Action Quality

### Score = 1
- 参与者选择的下一步动作与问题类型匹配

例子：
- citation 可疑 -> `verify or inspect the source` 或 `flag and do not use this output`
- source-support 不足 -> `verify or inspect the source` 或 `weaken the claim wording`
- scope overgeneralized -> `weaken the claim wording`
- answer 过度自信 -> `ask AI to regenerate with supporting evidence`
- 句子已基本 evidence-aligned -> `accept with minor edits`

### Score = 0
- 下一步动作没有对准实际问题

例子：
- citation fabricated 却只选择”accept with minor edits”
- evidence mismatch 却直接继续使用

## 3. Explanation Quality

### Score = 2
- 明确指出问题位于哪里
- 使用了事实情况中的具体信息
- 给出的判断逻辑和处置方式一致

典型特征：
- 指出作者-年份-主题不匹配
- 指出 source 只支持相关性，不支持因果表述
- 指出更可信答案之所以更可信，是因为有 evidence boundary 或更准确的 epistemic wording
- 指出原研究的样本/范围限制，以及 AI 如何超出了该范围

### Score = 1
- 能感觉到有问题，但解释比较模糊
- 没有准确抓到证据断裂点

典型特征：
- “感觉不太对”
- “这个说法太绝对了” 但没有说明为什么
- “B 更谨慎” 但没有连接到 source alignment
- “这个说法太广了” 但没有说明具体哪里超范围

### Score = 0
- 基本没有可用解释
- 或解释明显错误

典型特征：
- 重复 AI 原句
- 用个人偏好代替判断依据
- 完全没引用事实情况

## 4. Confidence

### Collection
- 每题记录 `1-5`

### Use
- 不并入 performance 总分
- 单独分析：
  - 正确题平均 confidence
  - 错误题平均 confidence
  - participant-level miscalibration

## Total Item Score
- decision accuracy: `0/1`
- action quality: `0/1`
- explanation quality: `0/2`

每题 performance score 为 `0-4`。

## Category Score
每类两题，总分 `0-8`。

Category 列表：
1. hallucinated-citation
2. source-verification
3. trust-calibration
4. scope-generalization

## Profile Assignment Rule
- 取 category score 最低的两类作为 targeted profiles
- 如果两个 category 得分相同且差距 ≤1 分，由 operator 结合 explanation 文本做快速人工确认
- 如果 category score 相同，则按：
  1. decision errors 更多者优先
  2. 若仍相同，优先 `verification-weak`
- 新增 profile: `scope-generalization-weak`
- 记录 `operator_profile_override` 标记

## Rater Instructions

### Rule 1
先看题目的 gold label，再评分，不要凭直觉打分。

### Rule 2
解释分只看参与者写出的理由，不要脑补其真实想法。

### Rule 3
如果 explanation 和 action 冲突：
- 分开计分
- 不要因为 explanation 好就自动给 action 分

### Rule 4
如果参与者的 decision 不是标准答案，但理由体现出对问题边界的清楚把握，可在备注中记录，但 decision 仍按标准规则给分。

### Rule 5
不要把“默认不信 AI”当成高分表现。
- 如果某题本来属于 calibrated-acceptance item，参与者仍一律选 `Revise` 或 `Reject`，decision 仍应按错误计。
- 本 rubric 同时测 overtrust 与 blanket distrust。

## Calibration Pass
正式评分前，建议先随机抽 `4-6` 份回答做试评分。

流程：
1. 两位评分者独立打分
2. 对分歧最大的项讨论
3. 固化边界例子
4. 再进入正式评分

## Output Columns
建议最终数据表至少包含：
- participant_id
- item_id
- category
- targeted_flag
- judgment
- decision_score
- action_score
- explanation_score
- confidence
- response_time_sec
- operator_profile_override
- posttest_item_order
- notes

## Safe Reporting Language
- “students improved in targeted categories”
- “participants showed better calibration after intervention”
- “participants articulated more evidence-grounded explanations”
- “participants demonstrated improved scope awareness after targeted intervention”
- “participants became more selective about when to reject, revise, or cautiously retain AI outputs”

## Unsafe Reporting Language
- “the system reliably improves AI literacy in general”
- “the intervention significantly outperforms alternatives”
- “the method proves causal effectiveness”
