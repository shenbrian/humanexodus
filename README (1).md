# HumanExodus

> "We don't predict the future. We watch how people respond to it — and learn faster than anyone else."

**HumanExodus is building the Human Adaptation Graph — an open, time-aware graph of how people reposition careers under AI pressure.**

It aims to produce the first real longitudinal data on human career adaptation in the age of AI.

[![Live Tool](https://img.shields.io/badge/tool-live-brightgreen)](https://shenbrian.github.io/humanexodus/humanexodus-v01.html)
[![Patterns](https://img.shields.io/badge/patterns-live-brightgreen)](https://shenbrian.github.io/humanexodus/patterns.html)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Open Source](https://img.shields.io/badge/open-source-orange)](https://github.com/shenbrian/humanexodus)

---

## What this is

The world is undergoing one of the largest labour transitions in history. AI is reshaping roles, skills, industries, and career trajectories in real time.

But almost no one is measuring it properly.

Today's understanding is dominated by macro reports, speculative forecasts, productivity statistics, and opinion essays. What is missing is **micro-level longitudinal evidence** showing what pressure individuals actually perceive, what decisions they actually make, and what outcomes actually emerge.

HumanExodus is measurement infrastructure for this transition.

---

## The Human Adaptation Graph (HAG)

The canonical artifact of HumanExodus is the **Human Adaptation Graph** — a heterogeneous temporal graph that models:

**Nodes**
- Roles — functional career positions
- Skills — capability clusters
- Industries — sectors and domains
- PressureSignals — perceived or observed AI pressure events

**Edges**
- Role → Role transitions (with frequency, duration, confidence)
- PressureSignal → Role exposure (with intensity and lag time)
- Role → Skill weights (with trend direction)
- Skill → Skill substitution (automation replacement or augmentation pairing)

**Time dimension**
- When pressure first appears
- When repositioning occurs
- When outcomes stabilise

This is not a flat dataset. It is a dynamic structural model of human career movement under AI pressure.

---

## The Atomic Unit

```
AI-Induced Pressure → Human Repositioning → Observed Outcome
```

Every data point in HumanExodus represents one repositioning event. Not a whole career. Not an opinion. One event — with a pressure, a response, and an outcome tracked over time.

---

## From Record to Graph

When a user submits a repositioning record:

```
role: Senior Consultant
pressure: drafting automation
response: reskill toward AI-enabled synthesis
```

The graph update logic:

1. Ensure Role node exists
2. Ensure PressureSignal node exists
3. Create or strengthen: PressureSignal → Role edge
4. If transition confirmed: create Role → Role edge
5. Update Role → Skill weights

See [`hag-core/graph_schema/HAG-v0.1-spec.md`](hag-core/graph_schema/HAG-v0.1-spec.md) for the full specification.

---

## Current State

| Component | Status |
|---|---|
| Entry tool (browser-based) | ✅ Live |
| Session persistence (Supabase) | ✅ Live |
| Pattern aggregation dashboard | ✅ Live |
| 30-day follow-up loop | ✅ Live |
| HAG specification | ✅ Written |
| HAG ingestion layer | 🔜 Building |
| Graph construction | 🔜 Next |
| Computable metrics | 🔜 Next |

---

## Computable Metrics (v0.1 targets)

| Metric | Definition |
|---|---|
| Transition Density | How many transitions observed between two roles |
| Pressure Exposure Score | Aggregate perceived pressure per role |
| Adaptation Velocity | Median time between signal and repositioning |
| Skill Drift Index | Rate at which skill importance changes |

These are publishable research primitives — not dashboard vanity metrics.

---

## Repository Structure

```
humanexodus/
├── hag-core/
│   ├── graph_schema/        ← HAG formal specification
│   ├── ingestion/           ← Record → Graph transformation
│   ├── transition_builder/  ← Edge construction logic
│   ├── pressure_model/      ← PressureSignal propagation
│   ├── metrics/             ← Computable metric definitions
│   └── tests/
├── datasets/                ← Contributed repositioning records
├── examples/                ← Synthetic example records
├── research-notes/          ← Design thinking and open problems
├── docs/                    ← Dataset principles and governance
├── humanexodus-v01.html     ← Entry tool (browser-based)
├── patterns.html            ← Live pattern dashboard
├── followup.html            ← 30-day outcome collection
└── supabase/                ← Edge function for follow-up emails
```

---

## Open Problems (Contribution Opportunities)

These are real unsolved problems in the v0.1 design:

1. **Graph schema design** — How do you represent messy human transitions without losing signal?
2. **Signal validation** — How do you prevent noise entries from degrading the graph?
3. **Temporal modeling** — How do transitions evolve over months and years?
4. **Taxonomy evolution** — Roles and skills change — how does the schema adapt?
5. **Inference layers** — How do you compute emerging pathways from sparse early data?
6. **Visualization** — How do you make the graph interpretable without oversimplifying?
7. **Open governance** — Who curates edge weighting?

If any of these interest you — open an issue.

---

## Live Links

| | URL |
|---|---|
| 🔧 Entry Tool | [humanexodus-v01.html](https://shenbrian.github.io/humanexodus/humanexodus-v01.html) |
| 📊 Patterns | [patterns.html](https://shenbrian.github.io/humanexodus/patterns.html) |
| 📬 Follow-up | [followup.html](https://shenbrian.github.io/humanexodus/followup.html) |
| 📐 HAG Spec | [HAG-v0.1-spec.md](hag-core/graph_schema/HAG-v0.1-spec.md) |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

The one rule: **data discipline first.** Does this contribution improve data quality or system accuracy? If yes — open a PR. If not — it can wait.

---

## Tech Stack

- **Entry tool:** Vanilla HTML/CSS/JS — no build step, no framework
- **Database:** Supabase (Postgres — transitioning toward graph structure)
- **AI:** Claude API for move generation
- **Email:** Resend
- **Hosting:** GitHub Pages
- **Graph layer:** To be determined — contributions welcome

---

## License

MIT — use it, fork it, build on it.

---

*HumanExodus is an observation layer, not a prediction engine. The data will tell us what's true. We just have to collect it carefully.*
