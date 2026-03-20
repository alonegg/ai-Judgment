# Item Matrix Audit and Redesign Notes

审阅日期：`2026-03-20`

## Goal
深度核对当前 `16` 道题（`8 pre + 8 post`）是否真正支撑本项目的研究需求、profile 分配逻辑、intervention 触发逻辑与 pilot paper claim boundary，并提出一套 **最小但高收益** 的 redesign 方向。

---

## 1. 先把项目真正需要的 instrument requirement 说清楚

当前项目不是在做一般意义上的“题库”，而是在做一个 **diagnostic instrument + intervention trigger + pilot evaluation bundle**。这意味着题目矩阵至少要同时满足下面五个要求：

### 1.1 能诊断，而不只是能出分
- 每个 category 需要能区分不同类型的 judgment weakness，而不是只让参与者不断识别“明显错误”。
- weakest-two profile 只有在题目能真实区分弱点时才有意义。

### 1.2 能驱动 intervention，而不只是和 category 名字对上
- 题目暴露出来的问题，必须能自然回扣到 scene scripts 中的 rule。
- 如果 item 暴露的是混合性错误，而 scene 只教单一 rule，就会出现“profile 命中了，但 intervention 没打中真正错误”的情况。

### 1.3 能支持 trust calibration，而不只是测 distrust
- 如果所有题都要求参与者识别问题、拒绝或修改 AI 输出，那么“过度怀疑 AI”的参与者也会得高分。
- 真正的 calibration 需要同时测：
  - 何时应该怀疑
  - 何时应该保留
  - 何时应该有限接受

### 1.4 能做 targeted vs untargeted internal contrast
- posttest item 不能只是“同类再来一题”。
- targeted item 应该更直接对应 scene 教过的判断 rule，untargeted item 则保留相邻但未直接训练的能力。

### 1.5 能在 `n=4-5` 和 `75-90` 分钟内稳定运行
- 每题必须是 `2-3` 分钟内可做完的 bounded task。
- 题目不能依赖太复杂的文本理解，否则 pilot 结果会被阅读负担和 English processing 速度淹没。

---

## 2. 当前矩阵已经做对了什么

### 2.1 category coverage 是完整的
- 四个 category（A/B/C/D）都有 `pre 2 + post 2` 的平衡覆盖。
- 这使得 weakest-two profile 和 targeted vs untargeted posttest 在结构上可运行。

### 2.2 场景锚定是对的
- 所有题都稳定锚定在 `academic writing` / `source use` / `claim writing`。
- 这让 task realism 和 parallelism 都比“泛 AI literacy”更强。

### 2.3 scene 映射关系基本清楚
- A 对应 citation validity
- B 对应 claim-source alignment
- C 对应 trust calibration
- D 对应 scope awareness

这意味着你们不是缺“整体框架”，而是缺 **更精细的测量结构**。

---

## 3. 当前矩阵和研究需求之间的关键失配

## 3.1 当前矩阵几乎只测“发现问题”，没有系统测“校准式接受”

这是当前题目设计里最大的结构性问题。

### 证据
- A 类 4 题的 gold judgment 全是 `Reject`
- B 类 4 题的 gold judgment 全是 `Revise`
- D 类 4 题的 gold judgment 全是 `Revise`
- 只有 C 类比较题出现 `Choose A / Choose B`
- 单答案题中，没有任何一道 gold judgment 是 `Accept`

### 风险
- 一个“默认不信 AI”的参与者，可能在大多数题上得分不错。
- 这样测到的更像 **error detection**，不是 **trust calibration**。
- 论文如果写“improve students' judgment of AI outputs”，审稿人可能会反问：你测的是“更会挑错”，还是“更会校准地信与不信”？

### 结论
- 在当前版本里，项目更像在测 `overtrust reduction`，还没有完整测到 `calibrated trust`。

---

## 3.2 Category B 和 Category D 的边界还不够纯

理论上：
- B = source exists, but does not support the wording
- D = source supports a narrower claim, but AI illegitimately broadens the scope

但当前若干 D 题混入了“construct mismatch / outcome inflation”，导致它们不只是 scope 问题。

### 典型例子
- `PRE_D2`：
  - 原研究只测 MBA 项目中的 surface-level errors
  - AI 却写成 “improving writing across educational levels”
  - 这里同时混入了：
    - 范围扩大（MBA → educational levels）
    - 结果外推（surface-level errors → writing improvement）
- `POST_D1`：
  - 原研究测的是 recall questions
  - AI 写成 “universally enhance critical thinking skills”
  - 这里已经不只是 scope，而是把 outcome 本身换掉了，更像 B 类的 claim-source mismatch

### 风险
- 参与者在 D 类失分，未必是因为不会 scope-checking，可能只是因为看出了“原研究根本没测这个 outcome”。
- 这会污染 `scope-generalization-weak` profile 的解释力。

### 结论
- D 类应尽量纯化成“同一 outcome / 同一 phenomenon，但被不当扩大适用范围”。
- 不要同时改变样本、场景、教育层次、能力构念这四个维度中的多个维度。

---

## 3.3 C 类题目前仍然偏向“选更谨慎的那句”，而不是“选更 evidence-aligned 的那句”

你们已经做了一个重要修正：`POST_C1` 的正确答案改成了 `A`。这是对的。

但当前 C 类整体仍有两个问题：

### 问题 1：Pretest 中两题都选 B
- `PRE_C1` gold = `B`
- `PRE_C2` gold = `B`

这会给参与者形成一个很快的局部启发式：**后面的句子更可信 / 更保守的句子更可信**。

### 问题 2：题目主要奖励“epistemic hedging detection”
- 目前多数 C 类题的正确策略是：找更保守、更有边界语言的答案。
- 但真正的 trust calibration 不应等同于 “pick the more cautious sentence”。

### 更好的 C 类应该测什么
- 不是“谁更保守”
- 而是“谁更贴近 evidence”

这意味着至少要有一道题满足：
- 更可信的答案并不只是更 cautious
- 而是更 **specific and evidence-aligned**
- 另一个答案虽然语气保守，但其实过于空泛、没有正确抓住证据重点，甚至把真正 relevant 的 evidence 稀释掉了

### 结论
- C 类下一步应该从 “caution preference” 升级为 “evidence alignment comparison”。

---

## 3.4 A 类现在主要测“明显虚构 citation”，还没有形成有层次的 citation judgment

当前 A 类四题的基本结构都很接近：
- citation 无法核验
- nearby real-looking source 不可替代
- 正确策略是 `Reject`

这对 pilot 是稳的，但存在两个问题。

### 问题 1：A 类太像单一 difficulty band
- 都属于“citation itself is invalid”。
- 还没有区分：
  - 完全 fabricated citation
  - real author / fake venue 拼接
  - real source nearby but wrong substitution
  - citation exists but metadata has minor repairable issue

### 问题 2：A 类容易出现 ceiling effect
- 对熟悉学术写作的参与者来说，`No DOI found`、`No journal indexed` 之类线索过于直接。
- 结果会是 A 类在 pretest 就接近满分，profile 不会真实命中 A。

### 结论
- A 类应该保留一个“清晰错误”的 anchor item。
- 同时增加一个“边界型 citation judgment” item，用来测参与者能否区分：
  - 完全不能用
  - 需要修复才能用
  - 可以保留但必须核验

---

## 3.5 next_action 的信息增益偏低，容易被“默认 verify”策略吃掉

从当前 gold next_action 分布看：
- `核查或检视原始来源` 出现最频繁
- `弱化论述措辞` 次之
- `要求 AI 重新生成并附上证据` 很少
- `接受并做小幅修改` 几乎没有

### 风险
- 如果参与者形成 “不确定就选 verify” 的保守策略，action score 会被显著抬高。
- 这会让 profile recommendation 更依赖 judgment text，而不是 action 本身。

### 对研究设计的影响
- 题目矩阵表面上收集了 action choice，但 action dimension 的诊断价值还不够强。
- 这和 `computeProfile()` 只用 judgment + action 自动推荐 profile 的实现逻辑叠加后，会放大该问题。

### 结论
- action 不是不能留，而是要让它更有“错题指向性”。
- 不同题的 gold next_action 集不能过宽、过像。

---

## 3.6 warm-up 和多道正式题共享过于显眼的 lexical cues，存在 heuristic solving 风险

Warm-up 明确提示参与者关注：
- “all students”
- “benefit equally”
- “proves”

这本来是合理的入门教学，但如果正式题里也大量重复使用：
- all
- consistently
- reliably
- proven
- universally

那么参与者可能只是在用 **表层 cue matching**，而不是在做证据推理。

### 风险
- 参与者学到的不是 `AI judgment rule`
- 而是“见到 all/proves 就选 revise/reject”

### 结论
- 后续题目中应有一部分错误是 **没有明显 trigger word** 的。
- 真问题应该藏在 source boundary、construct mismatch、sample limitation 或 evidence absence 中，而不只是 lexical overclaim。

---

## 4. 一个更强、但仍然最小可行的 redesign 原则

最优先的不是把 16 题全部推翻重写，而是把每个 category 从“同质的两道错题”改成“一个 anchor + 一个 calibration/boundary item”。

### 推荐结构

对于每个 category，在 pre 和 post 都保持：

1. `Anchor item`
- 错误相对清楚
- 主要用于稳定识别该类 weakness

2. `Calibration / boundary item`
- 不只是识别明显错误
- 要求参与者判断：
  - 是 reject 还是 revise
  - 是 revise 还是 accept with minor edits
  - 在两个答案里到底谁更 evidence-aligned，而不是谁更保守

### 这样做的收益
- profile 仍然可计算
- pilot 时长不增加
- 但 instrument 的解释力会大幅提高

---

## 5. 按 category 给出的具体 redesign 方向

## 5.1 A 类：从“虚构 citation 识别”升级为“citation validity calibration”

### 当前建议
- 保留一个明显 fabricated citation item 作为 anchor
- 另一个 item 改成“repairable but not fully clean”的 citation case

### 更好的 A 类二元结构

#### A-anchor
- citation 不存在 / 关键元数据无法核验
- 正确判断：`Reject`

#### A-boundary
- citation 对应真实论文，主题也大体相关
- 但 AI 给出的 metadata 有小错，或把近邻 source 当成 exact source
- 这里正确处理不一定是 `Reject`
- 可以设计成：
  - `Revise`
  - 或 `Accept with minor edits` + `verify or inspect the source`

### 这样做的意义
- 防止 A 类只测“会不会抓 fake”
- 也能测“会不会过度怀疑一个其实可修复的 citation”

---

## 5.2 B 类：保留 source alignment，但加入一个“可接受的谨慎表述”项

### 当前问题
- B 类 4 题全部是 revise-only
- 这会把 B 类变成“找 overstated claim”的单调任务

### 更好的 B 类二元结构

#### B-anchor
- source exists but does not support claimed outcome / causality
- 正确判断：`Revise`

#### B-boundary
- AI 输出已经采用了相对准确、谨慎、evidence-aligned 的说法
- 正确判断：
  - `Accept`
  - 或 `Accept with minor edits`

### 这样做的意义
- B 类才能真正测出：
  - 谁在过信 source
  - 谁在过度否定一个其实已经基本合格的 AI sentence

---

## 5.3 C 类：从“选更谨慎的句子”升级为“选更 evidence-aligned 的句子”

### 当前建议
- 保留一题“bounded answer beats fluent overclaim”
- 另加一题“specific evidence-aligned answer beats generic hedged answer”

### 更好的 C 类二元结构

#### C-anchor
- A = confident overclaim
- B = careful and evidence-bounded
- 正确：选 evidence-bounded answer

#### C-boundary
- 一个答案更具体、更贴近 evidence
- 另一个答案虽然 hedged，但其实过度空泛，甚至错失关键 boundary
- 正确：选 evidence-aligned answer，而不是机械地选更软的句子

### 这样做的意义
- C 类才能真正测 trust calibration
- 不会退化成“谁更像 reviewer 口吻就选谁”

---

## 5.4 D 类：纯化 scope generalization，不要和 construct mismatch 混在一起

### 当前建议
- 每道 D 题只允许一个主错误维度：scope expansion

### 更好的 D 类二元结构

#### D-anchor
- 单课程 / 单院校 / 单学科 / 小样本 → 被写成 all students / all courses
- 正确：`Revise`

#### D-boundary
- 原研究确实支持某个 outcome，但只在窄情境下成立
- AI 保留了 outcome，但把适用范围悄悄扩到更大人群或更多课程类型
- 正确：`Revise`

### 不建议的写法
- 原研究测 recall，AI 写 critical thinking
- 原研究测 surface error，AI 写 overall writing ability

这类更像 B，而不是纯 D。

---

## 6. 最小可行修订清单（在 dry run 前最值得做的 5 件事）

### 优先级 1：加入至少 `2` 个 calibrated-acceptance item
- 建议放在：
  - B 类 `1` 个
  - A 或 D 类 `1` 个

### 优先级 2：重写 `1` 个 C 类 item
- 目标不是打破 A/B 位置本身
- 而是打破“更谨慎 = 更对”的单一启发式

### 优先级 3：纯化 `POST_D1`
- 把它改成 scope-only 错误，不再混入 recall vs critical thinking 的 outcome replacement

### 优先级 4：收紧 gold next_action 集
- 尤其是不要让太多题都把 `verify or inspect the source` 作为最稳妥默认答案

### 优先级 5：控制 lexical cue 重复
- 不要让正式题总是依赖 “all / proven / universally” 这种显眼 trigger

---

## 7. 建议的 revised matrix pattern

不是现在就把 item id 全部推翻，而是把每类题改造成下面这个 pattern：

| Category | Item 1 role | Item 2 role | 目标 |
|----------|-------------|-------------|------|
| A | fabricated citation anchor | repairable / boundary citation case | 区分 fake detection 与 over-skepticism |
| B | unsupported claim anchor | evidence-aligned acceptable case | 区分 overtrust 与 undertrust |
| C | overconfident vs bounded | generic hedging vs evidence-aligned specificity | 测真正的 trust calibration |
| D | obvious scope expansion | subtle scope expansion without construct switch | 测纯 scope awareness |

这套 pattern 在 `pre` 和 `post` 各复制一次，就会比当前矩阵更有研究解释力。

---

## 8. 对论文 claim 的直接影响

如果不改，论文最安全的表述应更保守：
- 你们测到的是 students' ability to identify problematic AI outputs
- 还不够强到说完整的 trust calibration

如果按上面的最小修订改完，论文 claim 会更稳：
- 不仅能说 participants became better at detecting problematic AI outputs
- 还能更有底气地说 participants showed more calibrated judgment about when AI-generated writing support should be rejected, revised, or cautiously retained

---

## 9. 最终判断

结论不是“当前题库不行”。

结论是：
- **当前题库已经足够跑一次 pilot**
- 但它更像一个 `error-detection-heavy v1 instrument`
- 距离一个更强的 `judgment-calibration instrument`，还差三步：
  1. 加入 acceptance / boundary items
  2. 纯化 B / D 边界
  3. 让 C 类真正比较 evidence alignment，而不是只比较语气保守度

如果只允许做最少量修改，我建议优先改：
- `POST_D1`
- `PRE_C2` 或 `POST_C2`
- 再新增或重写 `1-2` 个可接受型 item

这会是本项目在 `2026-03-21` dry run 前，收益最高的一轮 redesign。
