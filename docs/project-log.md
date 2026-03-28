# HumanExodus — Project Log

*This document exists to preserve continuity across working sessions. It contains every major decision made, why it was made, and the current state of the project. Paste this at the start of any new session to restore context.*

---

## 1. Who Built This

**Founder:** Brian Shen (GitHub: shenbrian, Dev.to: shenbrian)
**Background:** Advertising, not engineering. This is intentional and a strength — the project is about observing human behaviour under technological pressure, not building technology for its own sake.
**Location:** Sydney, Australia
**Collaborators:** Built with Claude (Anthropic) across three sessions. Prior design work done with ChatGPT (see Section 10).

---

## 2. What HumanExodus Is

HumanExodus is building the **Human Adaptation Graph (HAG)** — an open, time-aware graph of how people reposition careers under AI pressure.

**One sentence:** HumanExodus is an open dataset project tracking how people reposition under AI-induced pressure over time.

**The atomic unit:**
```
AI-Induced Pressure → Human Repositioning → Observed Outcome
```

**What it is NOT:**
- A career advice tool
- A prediction engine
- A discussion forum
- A dashboard
- A survey system

**What it IS:**
- Measurement infrastructure for one of the largest labour transitions in history
- The first attempt to build structured longitudinal data on human career adaptation under AI

---

## 3. The Core Design Principle

**Data discipline first.**

Do not build:
- Dashboards (until data volume justifies it)
- ML models (until patterns are confirmed)
- User accounts (until necessary)
- Complex features (until the data demands them)

This principle has been held consistently across all versions.

---

## 4. Version History and Decisions

### v0.1 — Tool + Feedback Capture
**Built:** Single HTML file tool. Engineers input role, experience, stack. Rule-based engine estimates AI exposure (HIGH/MEDIUM/LOW). Claude API generates 3 adjacent moves + 3 time-bound actions. Four next-move buttons capture intended response. Console.log only.

### v0.2 — Supabase Persistence
**Built:** Replaced console.log with Supabase API call. Sessions table with 6 fields. RLS disabled. Anon key stored in HTML.

### v0.3 — Pattern Aggregation Dashboard
**Built:** `patterns.html` — reads live from Supabase, shows next-move distribution by exposure level.

### v0.4 — Email Capture + 30-Day Follow-up Loop
**Built:** Optional email field, `followup.html`, Supabase Edge Function `send-followups`, daily cron via pg_cron.

### v0.5 — HAG Architecture + Schema v0.1
**Built:** Repo restructured with HAG folder architecture. `hag-core/graph_schema/HAG-v0.1-spec.md`. `research-notes/HAG-design-thinking.md`. `schema/humanexodus_record.schema.json` (v0.1). Three synthetic example records (consulting, radiology, engineering).

### v0.5 continued — Schema v0.2 + 10 Engineer Example Records (Session 3)
**Built:**

**Schema upgrade (v0.2):** Integrated 9 changes from ChatGPT feedback review:
1. Added `workflow_change` object — `before`, `after`, `ai_tools_used` (most important addition)
2. Restructured `role` — `level` and `focus_area` as structured enums
3. Added `stack` as structured object — `languages`, `frameworks`, `environment`
4. Added `burnout_increase` to `outcome.status`
5. Added `hiring_signal_change` to `pressure.pressure_type`
6. Merged career level taxonomy — added `lead`, `independent`, `founder`
7. Merged `focus_area` taxonomy — added `qa`
8. Merged `response_type` — added `team_shift`, `managerial_transition`, kept `entrepreneurship`, `portfolio_career`
9. Merged `outcome.status` — kept `income_reduced`, `income_improved`

**10 engineer example records added:**
- `engineer_junior_frontend.json` — replacement pressure, reskilling
- `engineer_mid_backend.json` — augmentation pressure, tool adoption
- `engineer_senior_backend.json` — productivity pressure, role shift (benchmark quality)
- `engineer_devops_infra.json` — scope expansion, upskilling (fix: intent → increase_leverage)
- `engineer_data_engineer.json` — opportunity emergence, role shift
- `engineer_ml_engineer.json` — tooling disruption, upskilling (benchmark quality)
- `engineer_fullstack_startup.json` — augmentation pressure, tool adoption
- `engineer_qa.json` — replacement pressure, reskilling (fix: focus_area → qa)
- `engineer_manager.json` — productivity pressure, managerial transition (fix: pressure_type → productivity_pressure)
- `engineer_student.json` — hiring signal change, upskilling (best single record in set)

**Key decisions from Session 3:**

- `workflow_change` confirmed as the most important field — engineers think in "what changed in my day-to-day work", not abstract AI impact
- Scope boundary held: engineers are the *entry point*, not the permanent boundary. ChatGPT recommended engineers-only permanently — rejected.
- Fake hardcoded engine rejected — we have a real engine already live
- JSON schema validation CLI deferred — data collection is the priority
- Three original synthetic examples (consulting, radiology, engineering) remain in `examples/` alongside the 10 new engineer records — they demonstrate the broader scope of the project beyond software engineering

---

## 5. Infrastructure

### GitHub
- **Repo:** https://github.com/shenbrian/humanexodus
- **Pages:** https://shenbrian.github.io/humanexodus/
- **Branch:** main only

### Live URLs
- Tool: https://shenbrian.github.io/humanexodus/humanexodus-v01.html
- Patterns: https://shenbrian.github.io/humanexodus/patterns.html
- Follow-up: https://shenbrian.github.io/humanexodus/followup.html

### Supabase
- **Project ref:** xsnjqbxarzflxgczaqev
- **URL:** https://xsnjqbxarzflxgczaqev.supabase.co
- **Region:** Northeast Asia (Tokyo)
- **Tables:** `sessions`, `follow_ups` — both RLS disabled
- **Edge function:** `send-followups` — deployed, running daily at 9am UTC
- **Secrets:** RESEND_API_KEY set via dashboard

### Resend
- **Account:** shen.baiping@hotmail.com
- **From:** onboarding@resend.dev

### Git (local)
- **Path:** ~/Desktop/humanexodus
- **Editor:** VS Code (primary — use Source Control panel for commits)
- **Terminal:** Ctrl+` opens terminal inside VS Code
- **Git config:** name=shenbrian, email=shen.baiping@hotmail.com
- **Supabase CLI:** ~/bin/supabase (v2.84.2)

---

## 6. Supabase Schema (Current — flat, v0.1)

### sessions table
```
id, created_at, session_id, role_input, experience_years,
tech_stack, exposure_level, selected_next_move, email
```

### follow_ups table
```
id, created_at, session_id, email, actual_outcome, notes, follow_up_date
```

**Note:** The Supabase schema is still flat v0.1. The richer schema (v0.2) exists in `schema/humanexodus_record.schema.json` but has NOT been migrated to Supabase yet. Migration deferred until 50+ sessions.

---

## 7. Schema Versions

### schema/humanexodus_record.schema.json — v0.2 (current)
Full structured schema with `workflow_change`, structured `role`, structured `stack`, all upgraded taxonomies.

### Supabase sessions table — v0.1 (flat)
Still uses original 6-field flat structure. Migration pending.

---

## 8. Exposure Engine Logic (in humanexodus-v01.html)

Rule-based `computeExposure()` function. Maps role keywords to HIGH/MEDIUM/LOW with seniority modifier. Known limitation: simple keyword matching. Needs improvement as data reveals misclassifications.

---

## 9. Key Design Decisions Not Yet Implemented

1. **Richer next-move taxonomy** — current 4 buttons deferred until 50+ sessions
2. **Supabase schema migration** — deferred until 50+ sessions
3. **Custom email domain** — currently using onboarding@resend.dev
4. **HAG ingestion layer** — spec exists, code does not
5. **JSON schema validation CLI** — deferred, not a priority yet

---

## 10. Distribution Status

| Channel | Status | Handle |
|---|---|---|
| GitHub | ✅ Live | github.com/shenbrian/humanexodus |
| GitHub Pages | ✅ Live | shenbrian.github.io/humanexodus |
| Dev.to | ✅ Published | dev.to/shenbrian |
| LinkedIn | ✅ Posted | Personal account |
| Reddit r/SideProject | ✅ Posted | u/Fit-Scholar1879 |
| Reddit r/cscareerquestions | ⏳ Waiting for karma | u/Fit-Scholar1879 |
| Reddit r/ExperiencedDevs | ⏳ Waiting for karma | u/Fit-Scholar1879 |
| Hacker News | ⏳ Waiting for karma | u/shenbrian (1 karma) |

**LinkedIn framing that works:** "I'm not an engineer. I'm in advertising. I watch how people respond to disruption for a living. So I built a system to watch how engineers respond to AI."

---

## 11. ChatGPT Prior Work — Integration Status

Three design documents reviewed and selectively integrated:

**Document 1 — Schema:** workflow_change, structured role, structured stack, burnout_increase, hiring_signal_change → all integrated into schema v0.2

**Document 2 — Debrief:** Dual layer architecture (data/graph + user surface) adopted. Fake hardcoded engine rejected. Engineer-only scope rejected as permanent boundary.

**Document 3 — 10 Example Records:** All 10 reviewed, 3 fixes applied (record 4 intent, record 8 focus_area, record 9 pressure_type). All 10 committed to examples/.

---

## 12. How to Update This Log

At the end of every working session with Claude, ask:
*"Please update the project log with everything we did in this session."*

Replace `docs/project-log.md` in the repo and push.

---

## 13. What to Do Next (Priority Order)

1. **Build Reddit karma** — comment on r/cscareerquestions, r/ExperiencedDevs. Post when 20+ karma.
2. **Build HN karma** — comment on Show HN and Ask HN. Submit when 5-10 karma.
3. **Watch for first contributors** — respond to GitHub Issues/PRs within 48 hours.
4. **Watch Supabase sessions** — when 50+, design schema migration.
5. **First follow-up data** — arrives 30 days from first sessions with email.
6. **HAG ingestion layer** — after schema migration and sufficient data.

---

## 14. Files in the Repo (Current)

```
humanexodus/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .gitignore
├── humanexodus-v01.html           ← Entry tool (v0.4)
├── patterns.html                  ← Pattern dashboard
├── followup.html                  ← 30-day outcome page
├── hag-core/
│   ├── graph_schema/
│   │   └── HAG-v0.1-spec.md
│   ├── ingestion/.gitkeep
│   ├── transition_builder/.gitkeep
│   ├── pressure_model/.gitkeep
│   ├── metrics/.gitkeep
│   └── tests/.gitkeep
├── schema/
│   └── humanexodus_record.schema.json   ← v0.2
├── examples/
│   ├── example_consulting_reskilling.json
│   ├── example_radiology_scope_reduction.json
│   ├── example_engineer_role_shift.json
│   ├── engineer_junior_frontend.json
│   ├── engineer_mid_backend.json
│   ├── engineer_senior_backend.json
│   ├── engineer_devops_infra.json
│   ├── engineer_data_engineer.json
│   ├── engineer_ml_engineer.json
│   ├── engineer_fullstack_startup.json
│   ├── engineer_qa.json
│   ├── engineer_manager.json
│   └── engineer_student.json
├── datasets/.gitkeep
├── research-notes/
│   └── HAG-design-thinking.md
├── docs/
│   └── project-log.md
└── supabase/
    └── functions/
        └── send-followups/
            └── index.ts
```

---

*Last updated: March 2026 — Session 3*
*Built with Claude (Anthropic) + Brian Shen*