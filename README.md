# AI Judgment Micro-Intervention Prototype

Minimal web prototype for a pilot study on **Personalized Micro-Interventions for Improving University Students' Judgment of Generative AI Outputs in Academic Writing Tasks**.

This is a research instrument, not a production application.

## Features

- Pretest item rendering (8 items across 4 judgment categories)
- Semi-automated profile recommendation (weakest-two categories)
- Personalized intervention scene display (Tutor / Skeptic / Reflector)
- AI-free posttest with randomized item order
- Session JSON export
- Interaction pattern annotation export

## Run

```bash
python3 -m http.server
```

Then open: [http://localhost:8000/index.html](http://localhost:8000/index.html)

## Files

- `index.html` — Single-page app shell
- `styles.css` — Styles
- `app.js` — Full experiment flow logic
- `materials_v1.json` — Items, scenes, rubric, and codebook data

## Notes

- Profile recommendation uses `judgment + next_action` scores; `explanation quality` requires post-hoc rubric scoring
- Posttest is designed as an `AI-free judgment assessment` per experiment protocol
- No authentication, no database — session data is exported as JSON

## Citation

This prototype accompanies a research paper submitted to **ICAIE 2026**. If you use or reference this code, please cite the associated paper.
