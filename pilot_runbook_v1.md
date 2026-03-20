# Pilot Runbook v1

## Goal
这份 runbook 用于帮助你在没有完整前端前，也能以 Wizard-of-Oz 或轻量表单方式跑通一次 pilot。

## Recommended Operating Modes

### Mode A: Lightweight Web Prototype
- 最优
- 使用 `materials_v1.json` 驱动页面
- 自动记录 response time、scene sequence、profile assignment

### Mode B: Wizard-of-Oz
- 当前可立即执行
- 研究者按预设规则手工分配 profile 和展示 scenes
- 参与者仍在统一界面或表单中作答

## Files to Prepare Before Dry Run
- [materials_v1.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v1.json)
- [participant_packet_v1.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/participant_packet_v1.md)
- [scoring_rubric_v1.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/scoring_rubric_v1.md)

## Session Timing
- Consent + briefing: `5` min
- Warm-up: `3` min
- Pretest: `20-24` min
- Profiling and scene setup: `2` min
- Intervention scenes: `12-15` min
- Transition prompt: `0.5` min
- Posttest: `20-24` min
- Interview: `8-10` min
- Debrief: `2` min

## Before Participant Arrives
1. Assign a participant ID such as `P01`.
2. Prepare a response recording sheet or form.
3. Decide whether the session uses Mode A or Mode B.
4. Open the participant packet and warm-up example.
5. Prepare a timer visible only to the operator.

## Next-Action Response Options
Participants can select from the following 5 next-action options:
- `verify or inspect the source`: Check the original source material directly
- `ask AI to regenerate with supporting evidence`: Request AI to provide the answer again with explicit evidence
- `weaken the claim wording`: Edit the output to use more cautious language
- `flag and do not use this output`: Mark as unusable without further revision
- `accept with minor edits`: Accept the output with minimal text modifications

## Pretest Administration
1. Present the participant packet and explain the response format.
2. Show the warm-up example.
3. Explicitly remind participants that **not every AI output is wrong**; some items are intended to test whether they can appropriately retain a usable answer.
4. Run `PRE_A1` to `PRE_D2` (includes 2 D-category items for scope-generalization assessment).
5. Do not explain whether answers are correct during pretest.
6. Do not allow any external AI or web search during pretest.
7. Record:
   - judgment
   - reason
   - next_action
   - confidence
   - response_time_sec

## Profile Assignment
1. Score each pretest item using the rubric.
2. Compute category scores:
   - hallucinated-citation
   - source-verification
   - trust-calibration
   - scope-generalization
3. Select the weakest two categories as targeted profiles.
4. Available profiles:
   - hallucination-weak
   - verification-weak
   - trust-calibration-weak
   - scope-generalization-weak
5. If tied:
   - prefer `verification-weak`
   - choose the other by more decision errors
6. Tie-breaking operator review: When two category scores are equal and differ by ≤1 point, the operator should review the explanation text and confirmation rule to ensure correct profile assignment. Manual adjustment may be needed and must be documented.

## Intervention Delivery

在每个 scene 开始前，先确认参与者屏幕上已经显示：
- 对应失败 pretest item 的题干
- 对应失败 pretest item 的 AI 输出
- 对应失败 pretest item 的事实情况或关键问题提示
- 一条明确说明：如果任务提到“原句”“这句话”“这个声明”，均指上方回顾中的 AI 输出

如果这些回顾信息没有显示，不要让参与者开始作答。

### If targeted profiles are `hallucination-weak + verification-weak`
- show `H1_TUTOR`
- show `H2_SKEPTIC_REFLECT`
- show `V1_TUTOR`
- show `V2_SKEPTIC_REFLECT`

### If targeted profiles are `verification-weak + trust-calibration-weak`
- show `V1_TUTOR`
- show `V2_SKEPTIC_REFLECT`
- show `T1_TUTOR`
- show `T2_SKEPTIC_REFLECT`

### If targeted profiles are `hallucination-weak + trust-calibration-weak`
- show `H1_TUTOR`
- show `H2_SKEPTIC_REFLECT`
- show `T1_TUTOR`
- show `T2_SKEPTIC_REFLECT`

### If targeted profiles are `hallucination-weak + scope-generalization-weak`
- show `H1_TUTOR`
- show `H2_SKEPTIC_REFLECT`
- show `D1_TUTOR`
- show `D2_SKEPTIC_REFLECT`

### If targeted profiles are `verification-weak + scope-generalization-weak`
- show `V1_TUTOR`
- show `V2_SKEPTIC_REFLECT`
- show `D1_TUTOR`
- show `D2_SKEPTIC_REFLECT`

### If targeted profiles are `trust-calibration-weak + scope-generalization-weak`
- show `T1_TUTOR`
- show `T2_SKEPTIC_REFLECT`
- show `D1_TUTOR`
- show `D2_SKEPTIC_REFLECT`

Note: `D1_TUTOR` and `D2_SKEPTIC_REFLECT` are the intervention scenes for scope-generalization-weak.

## Posttest Administration
1. Before presenting posttest items, show the transition prompt: "接下来的题目需要你独立判断，不会有任何 AI 辅助。请像自己审稿一样作答。"（Next, you will judge independently. There will be no AI assistance. Please answer as if you were reviewing your own work.）
2. Present posttest items after the transition prompt.
3. Use the targeted profiles to determine the targeted posttest categories.
4. Ensure posttest contains:
   - `4` targeted items
   - `4` untargeted items
5. Randomize the order of all posttest items before presentation.
6. Do not give correctness feedback before posttest completes.
7. Do not allow any AI support during posttest. Posttest is the `AI-free judgment assessment`.

## Interview Administration
Ask the four fixed questions from the participant packet.

Record:
- short verbatim answer
- notable hesitation or confusion
- which scene the participant referenced

## Interaction Pattern Coding
在 session 结束后，operator 按 `interaction_pattern_codebook_v1.md` 做一轮轻量编码。

至少记录：
- primary pattern
- optional secondary pattern
- brief evidence note

## Dry Run Success Criteria
本轮 dry run 不要求”显著效果”，只要求检查下面几点：
- 参与者是否理解题目
- 单题是否能在 `2-3` 分钟内完成
- 事实情况是否太长
- targeted profiles 是否能稳定分配
- scenes 是否真的回扣 pretest 错误
- 整场实验是否能控制在 `75-90` 分钟内
- pre/post 两套题难度是否接近（让 1-2 名非参与者同时做两套题对比）
- C 类题受试者是否出现'总选 B'的模式
- 参与者是否出现“几乎所有单题都默认选 Revise / Reject”的 blanket distrust 模式
- 新增的 calibrated-acceptance item 是否真的能区分“校准式接受”与“默认不信”

## Common Failure Modes

### Failure 1
题目读起来像”英语阅读测试”

Fix:
- 缩短事实情况
- 保持单一判断点

### Failure 2
参与者把重点放在改写句子，而不是判断证据

Fix:
- 在 briefing 里反复强调这是 judgment task，不是 polishing task

### Failure 3
scene 变成开放聊天，时间失控

Fix:
- 每个 scene 最多允许 `1-2` 次回应
- 以模板化 prompt 为主

### Failure 4
profile 分配不稳定

Fix:
- 用 rubric 先快速双人试评分 `1` 次
- 必要时先只保留最弱 `1` 类做 intervention

### Failure 5
参与者默认认为所有 AI 输出都有问题

Fix:
- 在 briefing 中明确说“有些题是可保留的，不要预设所有题都必须改”
- dry run 后检查 calibrated-acceptance item 的误判率是否异常偏高

## Operator Decision Table

| 异常情况 | 处理方式 |
|----------|---------|
| 受试者单题超过 4 分钟 | 温和提醒：”可以基于现有信息做出判断” |
| 受试者 pretest 提前完成（<12分钟） | 让受试者检查一遍但不修改答案 |
| Reflector response 为空或只写”不知道” | 追问一次：”你能试着写一句简短的规则吗？哪怕只是你的直觉。” |
| 受试者在 intervention 中想用外部搜索 | 提醒：”这个环节请只用屏幕上的材料。” |
| 受试者情绪疲劳或走神 | 允许短暂休息(1-2 min)，但不重启计时 |
| Profile 分配结果与 operator 直觉不符 | 结合 explanation 文本确认，必要时手工调整并记录 override |

## Immediate Next Build Tasks
1. 将 `materials_v1.json` 转成可渲染页面或表单结构
2. 准备 response logging schema
3. 跑 `1-2` 次内部 dry run
4. 根据 dry run 修订题目与 scene 长度
