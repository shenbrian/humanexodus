# HumanExodus

> "We don't predict the future. We watch how people respond to it — and learn faster than anyone else."

**A longitudinal observation system for human adaptation under AI pressure.**

[![Live Tool](https://img.shields.io/badge/tool-live-brightgreen)](https://shenbrian.github.io/humanexodus/humanexodus-v01.html)
[![Patterns](https://img.shields.io/badge/patterns-live-brightgreen)](https://shenbrian.github.io/humanexodus/patterns.html)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Open Source](https://img.shields.io/badge/open-source-orange)](https://github.com/shenbrian/humanexodus)

---

## What this is

HumanExodus is **not** a career advice tool.

It is an **observation layer** — a system that captures how engineers actually respond to AI disruption, tracks what they intend to do, and follows up 30 days later to find out what really happened.

The gap between intention and reality is the most valuable signal in the system.

Most tools tell engineers what to do. HumanExodus watches what they actually do — and builds a dataset from it.

---

## Why it matters

AI is restructuring the engineering profession in real time. But almost no one is measuring it systematically:

- Career platforms collect clicks, not decisions
- Surveys capture opinions, not behaviour
- Job boards show outcomes, not the transitions that led there

HumanExodus is building the first structured dataset of **how engineers adapt to AI** — role by role, stack by stack, over time.

---

## How it works

```
Engineer enters role + experience + stack
        ↓
System estimates AI exposure level (rule-based)
        ↓
Claude API generates personalised adjacent moves + actions
        ↓
Engineer selects intended next move
        ↓
Session saved to database [Session entity]
        ↓
30 days later: automated follow-up email
        ↓
Engineer reports what actually happened [Follow-up entity]
        ↓
Intention vs reality gap is measured
```

---

## Data model

Every session produces two structured records:

**Session** (captured at tool use)
```json
{
  "session_id": "uuid",
  "timestamp": "ISO8601",
  "role_input": "Backend Engineer",
  "experience_years": 5,
  "tech_stack": ["Java", "Spring", "AWS"],
  "exposure_level": "HIGH",
  "selected_next_move": "learn_ai",
  "email": "optional"
}
```

**Follow-up** (captured 30 days later)
```json
{
  "session_id": "uuid",
  "actual_outcome": "switched_role",
  "notes": "Got a job as an AI engineer at a startup",
  "follow_up_date": "ISO8601"
}
```

The delta between `selected_next_move` and `actual_outcome` is the signal.

---

## System architecture

```
GitHub Pages (static frontend)
    humanexodus-v01.html  — tool + session capture
    patterns.html         — live pattern dashboard
    followup.html         — 30-day outcome collection

Supabase (database + backend)
    sessions table        — all engineer sessions
    follow_ups table      — 30-day outcome records
    Edge Function         — daily follow-up email sender

Resend (email)
    Automated follow-up emails at 30 days
```

---

## Roadmap

| Version | What | Status |
|---|---|---|
| v0.1 | Tool + feedback capture | ✅ Done |
| v0.2 | Supabase persistence | ✅ Done |
| v0.3 | Pattern aggregation dashboard | ✅ Done |
| v0.4 | Email capture + 30-day follow-up loop | ✅ Done |
| v0.5 | Predictive layer | 🔜 Next |
| v0.6 | Cohort analysis | Planned |
| v0.7 | Public API | Planned |

---

## Live links

| | URL |
|---|---|
| 🔧 Tool | [humanexodus-v01.html](https://shenbrian.github.io/humanexodus/humanexodus-v01.html) |
| 📊 Patterns | [patterns.html](https://shenbrian.github.io/humanexodus/patterns.html) |
| 📬 Follow-up | [followup.html](https://shenbrian.github.io/humanexodus/followup.html) |

---

## Contributing

This is an early-stage open-source research project. Contributions are welcome at every layer.

**What we need most right now:**

- More sessions — use the tool, share it with other engineers
- Exposure engine improvements — better role → exposure mapping
- Pattern analysis — what signals are emerging from the data?
- v0.5 design — how should the predictive layer work?

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

**Ground rules:**
- No dashboards until the data exists
- No ML models until patterns are confirmed
- No user accounts until they're necessary
- Data discipline first — always

---

## Tech stack

- **Frontend:** Vanilla HTML/CSS/JS — no build step, no framework
- **Database:** Supabase (Postgres)
- **AI:** Claude API (Anthropic) for move generation
- **Email:** Resend
- **Hosting:** GitHub Pages

---

## License

MIT — use it, fork it, build on it.

---

*HumanExodus is an observation layer, not a prediction engine. The data will tell us what's true. We just have to collect it carefully.*
