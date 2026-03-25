# Item Matrix v2 Follow-up Lean-30

## 1. Purpose

这份 matrix 服务于 Lean-30 follow-up，不再追求 full v2 的全面覆盖，而追求：

1. 在 `30 分钟内` 保留完整 skeleton
2. 保留四个 category 的 profiling 能力
3. 保留 `Reject / Revise / Accept with boundary` 的最小 triage spectrum
4. 保留 targeted-vs-untargeted differential 的可计算性

---

## 2. Fixed Counts

Lean-30 固定为：

- Pretest: `4 items`
- Posttest: `4 items`
- Total scored items: `8`
- Scene count per profile: `1`
- Scene count per participant session: `2`

### Why This Count Is Fixed

- `4 pre` 是 profiling 的下限，因为四个 category 都必须至少出现一次。
- `4 post` 是 targeted-vs-untargeted comparison 的下限，因为四个 category 在 posttest 中也必须各保留一个 measure。
- 每个 profile `1 scene` 是时长控制的关键；如果恢复到 `2 scenes per profile`，session 很容易重新超过 30 分钟。

---

## 3. Category Set

- A: hallucinated citation
- B: source verification
- C: comparative trust calibration
- D: scope generalization

---

## 4. Archetype Allocation

Lean-30 不再追求在每个 category 内同时放多个 archetypes，而是采用最小覆盖：

- A = `clear-reject`
- B = `calibrated-accept`
- C = `comparative-trust`
- D = `revise-boundary`

Across all 8 items:

- `clear-reject`: `2`
- `calibrated-accept`: `2`
- `comparative-trust`: `2`
- `revise-boundary`: `2`

这个分配的目的不是平均主义，而是保留 triage spectrum 的四个关键位置：

- A 负责 `Reject anchor`
- B 负责 `Accept with boundary`
- C 负责 evidence-aligned trust choice
- D 负责 `Revise vs Reject` 核心 bottleneck

---

## 5. Item Overview

| Item ID | Phase | Category | Domain | Archetype | Gold Decision | Gold Action | Pair |
|---------|-------|----------|--------|-----------|---------------|-------------|------|
| V2_PRE_A1 | Pre | A | Research Report | clear-reject | Reject | 标记为不可用 | V2_POST_A1 |
| V2_PRE_B1 | Pre | B | Financial Analysis | calibrated-accept | Accept | 接受并做小幅修改 | V2_POST_B1 |
| V2_PRE_C2 | Pre | C | Financial Analysis | comparative-trust | Prefer B | 要求 AI 重新生成并附上证据 | V2_POST_C2 |
| V2_PRE_D2 | Pre | D | Data Processing | revise-boundary | Revise | 弱化论述措辞 | V2_POST_D2 |
| V2_POST_A1 | Post | A | Financial Analysis | clear-reject | Reject | 标记为不可用 | V2_PRE_A1 |
| V2_POST_B1 | Post | B | History/Humanities | calibrated-accept | Accept | 接受并做小幅修改 | V2_PRE_B1 |
| V2_POST_C2 | Post | C | History/Humanities | comparative-trust | Prefer A | 要求 AI 重新生成并附上证据 | V2_PRE_C2 |
| V2_POST_D2 | Post | D | Research Report | revise-boundary | Revise | 弱化论述措辞 | V2_PRE_D2 |

---

## 6. Pairing Rules

每个 posttest item 必须满足：

1. same category
2. same response mode
3. same archetype family
4. same intended cognitive demand
5. different surface topic / names / wording

Lean-30 不再保留 category 内双 pair 结构，因此每个 category 只有一对 pre/post pair。

---

## 7. Category-Level Intent

### 7.1 Category A: Hallucinated Citation

Lean-30 中 A 类只保留 `clear-reject`。

作用：

- 作为 Reject anchor
- 保证学生仍需面对“完全不可用”的 citation case
- 防止整套 instrument 只剩下边界型题目

### 7.2 Category B: Source Verification

Lean-30 中 B 类只保留 `calibrated-accept`。

作用：

- 检验学生是否会因风险 framing 而过度修正或过度拒绝
- 保留 anti-blanket-distrust 测量位

### 7.3 Category C: Comparative Trust Calibration

Lean-30 中 C 类只保留一个比较型 boundary item。

作用：

- 检验是否能选出更 evidence-aligned 的答案
- 检验选中之后是否仍知道 next action 不一定等于直接接受

### 7.4 Category D: Scope Generalization

Lean-30 中 D 类只保留 `revise-boundary`。

作用：

- 直接承接第一轮发现的 `Revise vs Reject` bottleneck
- 成为 follow-up 的关键机制题

---

## 8. Timing Guidance Per Item

建议 item-level target:

- A clear-reject: `95 sec`
- B calibrated-accept: `100 sec`
- C comparative-trust: `110 sec`
- D revise-boundary: `105 sec`

每个 phase 合计约 `6.8-7.0 min`。
两个 phase 合计约 `13.5-14 min`。

---

## 9. Explanation and Confidence

### 9.1 Explanation

每题仍保留 explanation，但必须限制为：

- `一句话`
- 指向最关键的 evidence gap 或 boundary

Lean-30 不接受长段 explanation。

### 9.2 Confidence

confidence 继续保留 1-5 scale，以保留 secondary evidence 和 profiling tie-break 支持。

---

## 10. Profiling Implication

由于每类 pretest 只有一题，online profiling 必须写入明确 tie-break：

1. 先看 `combinedScore`
2. 并列时优先 `D > B > C > A`
3. 再看较低 confidence
4. 最后由 operator note 决定

---

## 11. Scene Mapping

Lean-30 每个 profile 只保留 `1` 个高密度 scene：

| Profile | Retained Scene | Scene Function |
|---------|----------------|----------------|
| hallucination-weak | H1 | fabricated vs repairable vs boundary-acceptable citation triage |
| verification-weak | V1 | source support strength triage |
| trust-calibration-weak | T1 | fluent vs evidence-aligned vs still-needs-evidence triage |
| scope-generalization-weak | D1 | scope leap vs salvageable narrowing triage |

每位参与者只进入 weakest two profiles 对应的两条 scene。

---

## 12. Matrix Success Criteria

Lean-30 matrix 被视为可用，需要同时满足：

1. pre/post 各 `4` 题
2. 四个 category 在 pre/post 各出现一次
3. triage spectrum 四个关键 archetype 都被保留
4. 每位参与者 session 中只出现 `2` 个 targeted scenes
5. 每题 explanation 仍可被双评分
6. matrix 可直接转译为 `materials_v2_followup.json`
