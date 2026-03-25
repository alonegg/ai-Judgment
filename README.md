# AI Judgment Micro-Intervention Pilot

Research artifacts and runnable web prototypes for an ICAIE 2026 pilot study on **Personalized AI Judgment Micro-Interventions**. The study focuses on how short, scaffolded interventions help university students judge generative AI outputs in bounded knowledge tasks such as research reports, financial analysis, data processing, and history/humanities summaries.

This repository is a **research instrument bundle**, not a production system. Claims should stay within pilot-study boundaries: feasibility, initial improvement signals, and participant acceptability.

## What Is Included

- A static single-page prototype under `prototype/` for local dry runs
- A networked multi-device version for operator-led pilot sessions
- A follow-up Lean-30 networked runner under `networked_v2_followup/`
- Structured study materials, item banks, scene scripts, and scoring rubric
- Pilot operation documents, data capture templates, and architecture notes

## Folder Guide

- `prototype/` is a self-contained static demo bundle. It keeps its own `README.md`, localized materials, and can be run with `python3 -m http.server` without Node.js.
- `networked/` is the multi-device pilot runner with a participant client, operator dashboard, and pure-Node WebSocket server.
- `networked_v2_followup/` is the Lean-30 follow-up runner. It preserves the AI-free skeleton while compressing the session to `4 pretest items + 2 targeted scenes + 4 posttest items + short interview`.
- If someone is reviewing the branch for the first time, `prototype/` is the fastest runnable entry point, `networked/` is the original pilot workflow, and `networked_v2_followup/` is the recommended entry point for the revised follow-up study.

## Repository Structure

```text
.
├── README.md
├── research_proposal.md
├── experiment_protocol.md
├── task_plan.md
├── notes.md
├── item_bank_v1.md
├── item_bank_full_v1.md
├── scene_scripts_v1.md
├── scoring_rubric_v1.md
├── interaction_pattern_codebook_v1.md
├── participant_packet_v1.md
├── pilot_runbook_v1.md
├── networked_architecture_v1.md
├── materials_v1.json
├── data_capture_template.csv
├── rater_sheet_template.csv
├── experiment_protocol_v2_followup_30mins.md
├── item_matrix_v2_followup.md
├── materials_v2_followup.json
├── system_design_prd_v2_followup.md
├── data_capture_template_v2_followup.csv
├── prototype/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── materials_v1.json
│   ├── materials_en.json
│   └── README.md
├── networked/
    ├── server.js
    ├── package.json
    ├── participant/
    ├── dashboard/
    └── data/
└── networked_v2_followup/
    ├── server.js
    ├── README.md
    ├── package.json
    ├── participant/
    ├── dashboard/
    └── data_lean30/
```

## Study Design Snapshot

- Population: university students
- Positioning: pilot / feasibility study
- Core flow: `pretest -> personalized intervention -> posttest -> interview`
- Judgment categories:
  - Hallucinated Citation Detection
  - Source Verification
  - Comparative Trust Calibration
  - Scope Generalization Detection
- Posttest policy: **AI-free**
- Profiling strategy: weakest-two-category recommendation with operator override

## Run The Static Prototype

The static prototype in `prototype/` is useful for dry runs, materials review, and single-device checks.

```bash
cd prototype
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- English mode: `http://localhost:8000/index.html?lang=en`
- Folder-specific notes: see `prototype/README.md`

## Run The Networked Pilot

The networked version supports multiple participants plus one operator dashboard on the same local network.

### Requirements

- Node.js 18+ recommended
- No external runtime dependencies

### Start

```bash
cd networked
node server.js
```

If you want a custom port:

```bash
cd networked
PORT=3000 node server.js
```

### Access URLs

- Participant client: `http://<server-ip>:3000/participant/`
- Participant client in English: `http://<server-ip>:3000/participant/?lang=en`
- Operator dashboard: `http://<server-ip>:3000/dashboard/`
- Operator dashboard in English: `http://<server-ip>:3000/dashboard/?lang=en`

### Networked Features

- Native WebSocket transport implemented in pure Node.js
- Real-time participant progress monitoring
- Operator approval for profile selection
- Operator nudges, observation notes, and interview logging
- Local JSON session persistence under `networked/data/`
- Dual-language UI and materials loading (`zh` / `en`)

## Run The Follow-up Lean-30 Runner

Use the Lean-30 runner when you want the revised follow-up design rather than the original full-length pilot.

### Follow-up Design Snapshot

- Flow: `AI-free pretest -> profiling approval -> targeted micro-intervention -> AI-free posttest -> short interview`
- Session length target: `24-30 minutes`
- Fixed structure: `4 pretest items + 2 targeted scenes + 4 posttest items + 3 interview prompts`
- Canonical materials: `materials_v2_followup.json`
- Canonical protocol: `experiment_protocol_v2_followup_30mins.md`

### Start

```bash
cd networked_v2_followup
npm start
```

Or:

```bash
cd networked_v2_followup
PORT=3000 node server.js
```

### Access URLs

- Participant client: `http://<server-ip>:3000/participant/`
- Participant client in English: `http://<server-ip>:3000/participant/?lang=en`
- Operator dashboard: `http://<server-ip>:3000/dashboard/`
- Operator dashboard in English: `http://<server-ip>:3000/dashboard/?lang=en`

### Follow-up Runtime Notes

- Session files are written to `networked_v2_followup/data_lean30/`
- `*_session.json` stores the live ledger
- `*_final.json` stores the exported finalized record
- The v2 follow-up runner is kept separate from `networked/` so the original v1 pilot runtime remains unchanged

## Internationalization

The repository currently supports Chinese and English in both runnable interfaces:

- `prototype/` uses localized UI strings plus `materials_en.json`
- `networked/participant/` and `networked/dashboard/` use dedicated `i18n.js`
- `networked/server.js` routes material payloads by `?lang=en` and falls back to Chinese by default

## Data And Outputs

- Generated session files are written to `networked/data/`
- These generated records are intentionally excluded from version control
- Materials and scoring assets remain source-controlled in the repository root

## Verification

Useful quick checks:

```bash
node --check networked/server.js
node --check networked/participant/app.js
node --check networked/dashboard/dashboard.js
node --check networked_v2_followup/server.js
node --check networked_v2_followup/participant/app.js
node --check networked_v2_followup/dashboard/dashboard.js
```

## Research Use Notes

- This codebase is designed for small-sample pilot execution, not large-scale deployment
- There is no auth, database, or production hardening
- Session logs may contain participant research data; review local storage and ethics requirements before field use

## Citation

If you use this repository in a paper, presentation, or replication package, cite the associated ICAIE 2026 study and describe whether you used the static prototype or the networked pilot system.
