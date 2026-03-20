# Interaction Pattern Codebook v1

## Purpose
这份 codebook 用于把 `How AI Impacts Skill Formation` 的启发转译到当前研究中。

目标不是复刻那篇 paper 的 coding task，而是复刻它的一个关键方法：
- 不只看 pre/post 分数
- 还分析 AI interaction 的过程模式

## Coding Unit
建议以 **participant-level primary pattern** 为主，必要时记录一个 **secondary pattern**。

证据来源可以包括：
- pretest / posttest 中的 reason 文本
- intervention scene 中的 learner response
- interview 回答
- operator observation notes

## Real-Time Observation Protocol
为了减少事后编码的信息损失，operator 需要在 session 中做即时观察记录。

### 观察时机
- Intervention 阶段的每个 scene 结束时

### 记录格式
每个 scene 一行即时 note（纸笔或简单表格）：
- scene_id
- 30 秒观察描述（如："主动提问为什么 metadata 不匹配" 或 "只看了一眼就写了很短的回答"）
- 初步 pattern 印象（如：evidence-checking / authority-following）

### 事后编码三角验证
正式 pattern 编码应结合三个来源：
1. Real-time observation notes
2. Response text（pretest/intervention/posttest 的文字回答）
3. Interview 回答

## High-Engagement Patterns

### 1. rule-seeking
- 定义：
  - 参与者主动提炼可迁移规则，而不是只解决当前题
- 典型信号：
  - “下次我会先检查 DOI / metadata”
  - “如果 source 只支持相关性，我就不能写成因果”
- 对应判断：
  - 更接近 preserved judgment formation

### 2. evidence-checking
- 定义：
  - 参与者显式把判断建立在事实情况的具体信息上
- 典型信号：
  - 指出 abstract 与 claim 不匹配
  - 明确说出哪一句超出了 source
- 对应判断：
  - 更接近 preserved judgment formation

### 3. answer-comparing
- 定义：
  - 参与者通过比较边界语言、证据锚点与不确定性来判断哪个答案更可信
- 典型信号：
  - “B 更可信，因为它保留了 evidence limit”
  - “A 虽然流畅，但 claim 太满”
- 对应判断：
  - 更接近 preserved judgment formation

### 4. uncertainty-monitoring
- 定义：
  - 参与者能识别”现在还不能信”，并主动保留验证步骤
- 典型信号：
  - 选择 verify / inspect before use
  - 明确表达暂不接受结论
- 对应判断：
  - 更接近 preserved judgment formation

### 5. scope-checking（新增）
- 定义：
  - 参与者注意到 AI 的 claim 超出了原始研究的适用范围
- 典型信号：
  - “这个研究只在一个大学做的，不能说 all students”
  - “原文只测了 recall，不能说 critical thinking”
- 对应判断：
  - 更接近 preserved judgment formation

## Low-Engagement Patterns

### 5. authority-following
- 定义：
  - 参与者因为 AI 说得像样，就直接跟随其结论
- 典型信号：
  - “这看起来像正式引用，所以应该可以”
  - 明显 mismatch 仍倾向接受
- 风险：
  - 更接近 judgment offloading

### 6. surface-editing
- 定义：
  - 参与者把问题当作文风问题，而不是证据问题
- 典型信号：
  - 只改措辞，不改 evidence problem
  - fabricated citation 被当成 wording issue
- 风险：
  - 更接近 judgment offloading

## Coding Rules

### Rule 1
优先看参与者的解释和反思，而不是只看最终 judgment 对不对。

### Rule 2
如果一个参与者同时表现出多种模式：
- 记录一个 primary pattern
- 可选记录一个 secondary pattern

### Rule 3
不要把“答对题”直接等同于 high-engagement。
- 有可能答对只是保守猜测
- 也有可能答错但反思非常有质量

### Rule 4
pattern coding 不是独立取代分数，而是补充机制解释。

## Suggested Output Fields
- participant_id
- primary_interaction_pattern
- secondary_interaction_pattern
- evidence_note

## Safe Use in Paper
- “We observed more evidence-checking and rule-seeking responses after intervention.”
- “Some participants still displayed authority-following tendencies despite improved item accuracy.”

## Unsafe Use in Paper
- “These patterns are universal categories of AI learning behavior.”
- “The codebook is validated as a stable theory.”
