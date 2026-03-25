# Follow-up Experiment v2 Lean-30 Implementation Plan

## 1. Goal

把 follow-up v2 收口为一套 **可直接执行的 Lean-30 experiment package**，核心目标是：

1. 保留 `AI-free pretest -> profiling -> targeted micro-intervention -> AI-free posttest -> interview` 主骨架。
2. 把 session 压到 `24-30 分钟`。
3. 继续检验：
   - targeted-vs-untargeted `decision differential`
   - targeted-vs-untargeted `action differential`
   - `decision-action decoupling`
   - `revise-reject confusion`
4. 保留 v1 独立版本，不污染已完成的第一轮 runner 与数据。

---

## 2. Canonical Artifacts

Lean-30 的 canonical artifacts 现在应固定为以下 5 个：

1. [experiment_protocol_v2_followup_30mins.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/experiment_protocol_v2_followup_30mins.md)
2. [item_matrix_v2_followup.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/item_matrix_v2_followup.md)
3. [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json)
4. [system_design_prd_v2_followup.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/system_design_prd_v2_followup.md)
5. [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup)
6. [data_capture_template_v2_followup.csv](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/data_capture_template_v2_followup.csv)

full-v2 设计不再作为默认执行基线。

---

## 3. Lean-30 Non-Negotiables

### 3.1 Study Skeleton

必须保留：

1. consent
2. warm-up
3. `AI-free pretest`
4. profiling
5. `targeted micro-intervention`
6. transition
7. `AI-free posttest`
8. short interview
9. export / debrief

### 3.2 Session Length

必须压到：

- `24-30 min`

### 3.3 Item Count

必须固定为：

- pretest `4 items`
- posttest `4 items`

### 3.4 Scene Count

必须固定为：

- `1 scene per profile`
- `2 scenes total per participant`

### 3.5 Explanation Policy

必须保留 explanation，但改成：

- `one-sentence explanation`

### 3.6 Version Isolation

必须保证：

- v1: [networked](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked)
- v2: [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup)

物理隔离。

---

## 4. Minimal Executable Design

### 4.1 Retained Item Pairs

Lean-30 只保留以下 4 组 pair：

- `V2_PRE_A1 <-> V2_POST_A1`
- `V2_PRE_B1 <-> V2_POST_B1`
- `V2_PRE_C2 <-> V2_POST_C2`
- `V2_PRE_D2 <-> V2_POST_D2`

这 4 组分别承担：

- A = `Reject anchor`
- B = `Accept with boundary`
- C = `comparative trust`
- D = `revise-boundary bottleneck`

### 4.2 Retained Scene Set

Lean-30 每个 profile 只保留一个 high-density scene：

- `H1_TRIAGE_TUTOR`
- `V1_TRIAGE_TUTOR`
- `T1_TRIAGE_TUTOR`
- `D1_TRIAGE_TUTOR`

participant 根据 weakest-two profiles 只进入其中 `2` 个。

### 4.3 Profiling Logic

profiling 使用：

- decision correctness
- action correctness

Lean-30 tie-break：

1. combined score
2. `D > B > C > A`
3. lower confidence
4. operator override

---

## 5. File Strategy

### 5.1 Keep As Canonical

- [experiment_protocol_v2_followup_30mins.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/experiment_protocol_v2_followup_30mins.md)
- [item_matrix_v2_followup.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/item_matrix_v2_followup.md)
- [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json)
- [system_design_prd_v2_followup.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/system_design_prd_v2_followup.md)
- [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup)

### 5.2 Keep Unchanged

- [networked](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked)
- [prototype](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/prototype)
- v1 materials
- v1 analysis outputs

### 5.3 No Longer Canonical

- full-v2 题量假设
- `2 scenes per profile`
- `75-90 min` session

---

## 6. Implementation Tasks

### Task 1: Freeze Lean-30 Research Contract

Artifacts:

- [experiment_protocol_v2_followup_30mins.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/experiment_protocol_v2_followup_30mins.md)
- [item_matrix_v2_followup.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/item_matrix_v2_followup.md)

Done when:

- protocol 写清 `24-30 min`
- matrix 写清 `4+4+2 scenes`
- selected items and retained scenes 被写死

### Task 2: Freeze Lean-30 Materials

Artifact:

- [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json)

Done when:

- item count = `8`
- phase split = `4 pre + 4 post`
- scene counts = `4 profiles × 1 scene`
- version = `v2-lean30-runnable-draft-2026-03-25`

### Task 3: Establish Independent Runtime

Artifact:

- [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup)

Done when:

- runtime directory exists independently
- it no longer depends on v1 materials
- it writes to `data_lean30/`

### Task 4: Sync Participant UX

Files:

- [participant/app.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/participant/app.js)
- [participant/i18n.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/participant/i18n.js)

Done when:

- `V2_PRE_* / V2_POST_*` labels display correctly
- reason prompt is one-sentence
- consent screen shows `x4 / x2 / x4`
- interview screen shows only 3 prompts

### Task 5: Sync Dashboard UX

Files:

- [dashboard/dashboard.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/dashboard/dashboard.js)
- [dashboard/i18n.js](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/dashboard/i18n.js)

Done when:

- score panel displays `combined / J / A / confidence`
- interview prompts reduced to 3
- Lean-30 version is visible in copy

### Task 6: Verify Runner Contract

Checks:

- `node --check` on server / participant / dashboard JS
- boot server successfully
- `/api/materials` returns 8 items
- `/api/materials` scene counts show 1 per profile
- `/api/sessions` returns valid JSON

---

## 7. Verification Commands

### 7.1 Materials

```bash
python3 -m json.tool /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json > /dev/null
```

### 7.2 JS Syntax

```bash
node --check /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/server.js
node --check /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/participant/app.js
node --check /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/participant/i18n.js
node --check /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/dashboard/dashboard.js
node --check /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup/dashboard/i18n.js
```

### 7.3 Boot Check

```bash
cd /Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup
PORT=3010 node server.js
```

Expected:

- boot log shows `zh=8 items`
- data dir shows `data_lean30`

### 7.4 API Check

```bash
python3 -c "import json,urllib.request; obj=json.load(urllib.request.urlopen('http://127.0.0.1:3010/api/materials')); print(len(obj['items']), {k: len(v) for k,v in obj['scene_sequences'].items()})"
curl -s 'http://127.0.0.1:3010/api/sessions'
```

Expected:

- `8`
- `{'hallucination-weak': 1, 'verification-weak': 1, 'trust-calibration-weak': 1, 'scope-generalization-weak': 1}`
- `[]` before any participant joins

---

## 8. Risks and Stop Rules

### Risk 1: Hidden Full-v2 Assumptions

症状：

- UI 仍写 `x8 / x4`
- panel 仍以 full-v2 时长或题量为基准

Stop rule：

- 任何残留 full-v2 文案都必须在正式实验前删干净

### Risk 2: v1/v2 Data Mixing

症状：

- v2 runner 写进 `networked/data/`

Stop rule：

- 一旦发现混写，当前导出不可用作正式数据

### Risk 3: Lean-30 Tie-break Drift

症状：

- profiling recommendation 与 protocol 写的不一致

Stop rule：

- 若运行逻辑和 protocol 不一致，以 protocol 为准修代码，不做口头解释替代

### Risk 4: Explanation Load Creep

症状：

- 现场要求学生写长 explanation

Stop rule：

- 任何超过一句话的 explanation 要求都视为 protocol drift

---

## 9. Completion Checklist

Lean-30 v2 被视为收口完成，需要同时满足：

1. [experiment_protocol_v2_followup_30mins.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/experiment_protocol_v2_followup_30mins.md) 是 canonical protocol。
2. [item_matrix_v2_followup.md](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/item_matrix_v2_followup.md) 与 materials 选题一致。
3. [materials_v2_followup.json](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/materials_v2_followup.json) 是 Lean-30 schema。
4. [networked_v2_followup](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked_v2_followup) 独立可启动。
5. `data_lean30/` 已建立。
6. participant 与 dashboard 文案已切换到 Lean-30。
7. boot/API 验证通过。
8. v1 的 [networked](/Users/alone/Desktop/论文/ICAIE/plan/ai-judgment-micro-intervention-2026-03-19/networked) 仍保持独立版本。

到这一步，follow-up v2 就不再是“构想中的下一版”，而是一个已经收口的 Lean-30 execution package。
