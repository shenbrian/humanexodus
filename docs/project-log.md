# HumanExodus — Project Log

*This document exists to preserve continuity across working sessions. It contains every major decision made, why it was made, and the current state of the project. Paste this at the start of any new session to restore context.*

---

## 1. Who Built This

**Founder:** Brian Shen (GitHub: shenbrian, Dev.to: shenbrian)
**Background:** Not an engineer. This is intentional and a strength — the project is about observing human behaviour under technological pressure, not building technology for its own sake.
**Location:** Sydney, Australia
**Collaborators:** Built with Claude (Anthropic) across five sessions. Prior design work done with ChatGPT (see Section 11).

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
**Built:** Schema upgraded to v0.2 with 9 changes. 10 engineer example records added and committed.

### v0.5 continued — Security Fix (Session 5)
**Built:** Enabled RLS on both `sessions` and `follow_ups` tables via SQL editor. Added anonymous insert policies to keep tool functional while locking down read access. Verified tool still writes correctly after fix.

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
- **Tables:** `sessions`, `follow_ups` — RLS now ENABLED (Session 5)
- **Policies:** Anonymous insert allowed on both tables. Read access locked down.
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

## 6. Supabase Schema (Current)

### sessions table
```
id, created_at, session_id, role_input, experience_years,
tech_stack, exposure_level, selected_next_move, email
```

### follow_ups table
```
id, created_at, session_id, email, actual_outcome, notes, follow_up_date
```

**Note:** The Supabase schema is still flat v0.1. The richer schema (v0.2) exists in `schema/humanexodus_record.schema.json` but has NOT been migrated to Supabase yet. Migration deferred until 50+ sessions. As of Session 5, there are 11 rows in sessions (mostly test data from March 27) plus 1 verified post-RLS write.

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
6. **Open source governance structure** — decided to open source; governance model not yet defined

---

## 10. Distribution Status

| Channel | Status | Handle |
|---|---|---|
| GitHub | ✅ Live | github.com/shenbrian/humanexodus |
| GitHub Pages | ✅ Live | shenbrian.github.io/humanexodus |
| Dev.to | ✅ 2 posts published | dev.to/shenbrian |
| LinkedIn | ✅ 2 posts live, 90+ impressions | Personal account |
| Reddit r/SideProject | ❌ Removed by spam filter | u/Fit-Scholar1879 |
| Reddit r/cscareerquestions | ⚠️ Rule 6 — AI comments forbidden | u/Fit-Scholar1879 |
| Reddit r/ExperiencedDevs | ✅ 1 comment posted, 1 upvote | u/Fit-Scholar1879 |
| Hacker News | ⏳ 1 karma, 1 comment posted | u/shenbrian |

**Reddit karma status (u/Fit-Scholar1879):** 1 post karma, 0 comment karma. Target: 20+ comment karma before reposting project. Approx 10-15 more quality comments needed.

**Important:** r/cscareerquestions has Rule 6 — AI use in comments is forbidden. Do not comment there.

**LinkedIn framing that works:** "I'm not an engineer. I watch how people respond to disruption for a living. So I built a system to watch how engineers respond to AI."

**Dev.to posts:**
1. "I built an open-source system to track how engineers actually adapt to AI" — Mar 28, 1 reaction
2. "HumanExodus: Why I'm Building Measurement Infrastructure for the Largest Labour Transition in History" — Mar 29, methodology essay

---

## 11. ChatGPT Prior Work — Integration Status

Three design documents reviewed and selectively integrated. Full details in Session 3 log.

---

## 12. Open Source Decision (Session 4)

**Decision:** HumanExodus will be open source.

**Fear addressed:** Brian expressed concern that tech-savvy teams could grab the idea and execute faster. Resolved by recognising that the asset is not the code — it's the framing, the longitudinal methodology, the data discipline, and the public intellectual authorship. The methodology essay establishes priority in a way a GitHub repo alone cannot.

**Governance:** Not yet defined. Key question is what contributors can touch — schema needs tight control, example records could be open, tool is lower stakes.

---

## 13. Outreach Status

**Brijesh Pandya** (Senior GRC & Risk Leader, National Cyber Security Research Council) — LinkedIn DM sent Session 4. Commented: *"Data-driven insight beats speculative opinion every time - observing the delta between intention and action is where the real truth about our industry's future lies."* Awaiting response.

---

## 14. Session Log Summary

| Session | Date | Key Work |
|---|---|---|
| 1 | Mar 2026 | v0.1 tool built, Supabase persistence |
| 2 | Mar 2026 | Pattern dashboard, email follow-up loop |
| 3 | Mar 2026 | HAG architecture, schema v0.2, 10 example records |
| 4 | Mar 29, 2026 | Methodology essay, Brijesh outreach, HN comment |
| 5 | Apr 2, 2026 | RLS security fix, Reddit karma building started |

---

## 15. What to Do Next (Priority Order)

1. **Build Reddit karma** — 2-3 comments per day on r/ExperiencedDevs. Target 20+ comment karma before reposting project. Space comments out naturally.
2. **Wait on Brijesh** — respond within 24 hours if he replies
3. **Check HN comment** — respond to any replies, build karma toward 5-10
4. **Watch Dev.to and LinkedIn** — check every 2-3 days for traction
5. **Watch Supabase sessions** — when 50+, design schema migration
6. **First follow-up data** — arrives 30 days from first sessions with email
7. **Define open source governance** — what can contributors touch?
8. **HAG ingestion layer** — after schema migration and sufficient data

---

## 16. Files in the Repo (Current)

```
humanexodus/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .gitignore
├── humanexodus-v01.html
├── patterns.html
├── followup.html
├── hag-core/
│   ├── graph_schema/
│   │   └── HAG-v0.1-spec.md
│   ├── ingestion/.gitkeep
│   ├── transition_builder/.gitkeep
│   ├── pressure_model/.gitkeep
│   ├── metrics/.gitkeep
│   └── tests/.gitkeep
├── schema/
│   └── humanexodus_record.schema.json
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

*Last updated: April 2, 2026 — Session 5*
*Built with Claude (Anthropic) + Brian Shen*
