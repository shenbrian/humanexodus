# HumanExodus — Project Log

*This document exists to preserve continuity across working sessions. It contains every major decision made, why it was made, and the current state of the project. Paste this at the start of any new session to restore context.*

---

## 1. Who Built This

**Founder:** Brian Shen (GitHub: shenbrian, Dev.to: shenbrian)
**Background:** Advertising, not engineering. This is intentional and a strength — the project is about observing human behaviour under technological pressure, not building technology for its own sake.
**Location:** Sydney, Australia
**Collaborators:** Built with Claude (Anthropic) across two sessions. Prior design work done with ChatGPT (see Section 10).

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

This principle has been held consistently across all versions. It came from the original investor memo and has been reinforced at every decision point.

---

## 4. Version History and Decisions

### v0.1 — Tool + Feedback Capture
**Built:** Single HTML file tool. Engineers input role, experience, stack. Rule-based engine estimates AI exposure (HIGH/MEDIUM/LOW). Claude API generates 3 adjacent moves + 3 time-bound actions. Four next-move buttons capture intended response.

**Key decision:** Hybrid approach — rule-based for exposure (fast, no API cost), Claude API for move suggestions (richer, personalised).

**Key decision:** Console.log only for v0.1. No database yet. Capture structure from Day 1 even before storage exists.

**Delivery:** Single HTML file. No build step. No framework. No dependencies.

### v0.2 — Supabase Persistence
**Built:** Replaced console.log with Supabase API call. Sessions table created with 6 fields: session_id, role_input, experience_years, tech_stack, exposure_level, selected_next_move.

**Key decision:** Supabase over DigitalOcean or other backends because: free tier, no server to manage, direct API from browser, fastest path to data collection.

**Key decision:** RLS disabled for simplicity at this stage. Data is anonymous — no personal information stored.

**Anon key:** Stored directly in HTML (acceptable because data is public/anonymous and RLS is off by design).

### v0.3 — Pattern Aggregation Dashboard
**Built:** `patterns.html` — reads live from Supabase, shows next-move distribution by exposure level, recent sessions list. Refresh button. No backend required.

**Key decision:** Separate page, not embedded in tool. Keeps tool minimal.

### v0.4 — Email Capture + 30-Day Follow-up Loop
**Built:**
- Optional email field added to tool (framed as research participation, not marketing)
- `followup.html` — engineers land here 30 days later via link in email, report actual outcome
- Supabase Edge Function `send-followups` — runs daily, finds sessions 30 days old with email, sends follow-up via Resend
- Daily cron job scheduled via pg_cron in Supabase SQL editor

**Key decision:** Email optional, not required. Framed as: "Get a follow-up in 30 days — see what actually happened to engineers like you."

**Key decision:** Used Resend (not Mailgun) — simpler, generous free tier, designed for transactional email.

**Key decision:** Follow-up outcome options are richer than initial next-move options: stayed_same, learned_ai, switched_role, still_deciding, role_lost, other.

**Resend from address:** `onboarding@resend.dev` (using Resend's shared domain — no custom domain set up yet)

**Edge function URL:** `https://xsnjqbxarzflxgczaqev.supabase.co/functions/v1/send-followups`

### v0.5 — HAG Architecture + Schema + Examples
**Built in this session:**
- Repo restructured with full HAG folder architecture
- `hag-core/graph_schema/HAG-v0.1-spec.md` — formal HAG specification
- `research-notes/HAG-design-thinking.md` — design reasoning document
- `schema/humanexodus_record.schema.json` — formal JSON schema for dataset records
- Three synthetic example records in `examples/`:
  - `example_consulting_reskilling.json`
  - `example_radiology_scope_reduction.json`
  - `example_engineer_role_shift.json`
- README fully rewritten with HAG vision, transformation logic, open problems
- CONTRIBUTING.md written with ground rules and contribution guide
- `docs/project-log.md` — this file — created for session continuity

**Key decision:** Build architecture and spec first. Build ingestion layer only after sufficient real data exists.

**Key decision:** Do NOT upgrade Supabase schema or tool UI yet — wait for 50+ sessions to avoid mid-stream migration problems.

**Key decision:** ChatGPT prior work reviewed and selectively integrated. Taken: conceptual model, richer schema design, HAG concept, repo architecture, computable metrics, node/edge types, transformation logic. Not taken: PR-based contribution workflow, pseudonymous ID system in tool, salary fields, complex causal scoring.

**Not yet built:**
- HAG ingestion layer (`hag-core/ingestion/`)
- Graph construction logic (`hag-core/transition_builder/`)
- Pressure propagation model (`hag-core/pressure_model/`)
- Computable metrics (`hag-core/metrics/`)
- Upgrade of tool UI to richer taxonomy
- Upgrade of Supabase schema to richer data model

---

## 5. Infrastructure

### GitHub
- **Repo:** https://github.com/shenbrian/humanexodus
- **Pages:** https://shenbrian.github.io/humanexodus/
- **Commits:** Clean history. Large file (supabase.tar.gz) removed from history via filter-branch.
- **Branch:** main only

### Live URLs
- Tool: https://shenbrian.github.io/humanexodus/humanexodus-v01.html
- Patterns: https://shenbrian.github.io/humanexodus/patterns.html
- Follow-up: https://shenbrian.github.io/humanexodus/followup.html

### Supabase
- **Project:** humanexodus
- **Project ref:** xsnjqbxarzflxgczaqev
- **URL:** https://xsnjqbxarzflxgczaqev.supabase.co
- **Region:** Northeast Asia (Tokyo)
- **Tables:**
  - `sessions` — main data table, RLS disabled, unrestricted
  - `follow_ups` — outcome records, RLS disabled, unrestricted
- **Edge function:** `send-followups` — deployed, running
- **Secrets set:** RESEND_API_KEY (real key, set via dashboard)
- **Cron:** Daily at 9am UTC via pg_cron

### Resend
- **Account:** shen.baiping@hotmail.com
- **From address:** onboarding@resend.dev (shared domain)
- **Purpose:** 30-day follow-up emails only

### Git (local)
- **Machine:** OWLUME-TP01 (Windows)
- **User:** Brian-Owlume
- **Git config name:** shenbrian
- **Git config email:** shen.baiping@hotmail.com
- **Local path:** ~/Desktop/humanexodus
- **Supabase CLI:** installed at ~/bin/supabase (version 2.84.2)
- **VS Code:** installed and configured as primary editor
  - Open project: `code ~/Desktop/humanexodus`
  - Built-in Git panel replaces Git Bash for routine commits
  - Built-in terminal (Ctrl+`) for command-line work

---

## 6. Supabase Schema (Current)

### sessions table
```
id                  int8 (primary key, auto)
created_at          timestamptz (default: now())
session_id          text
role_input          text
experience_years    int8
tech_stack          text
exposure_level      text
selected_next_move  text
email               text (nullable)
```

### follow_ups table
```
id              int8 (primary key, auto)
created_at      timestamptz (default: now())
session_id      text
email           text (nullable)
actual_outcome  text
notes           text
follow_up_date  text
```

---

## 7. Exposure Engine Logic

Rule-based. Lives in `humanexodus-v01.html` in the `computeExposure()` function.

**Logic:**
1. Check role against LOW_EXPOSURE_ROLES list → return LOW
2. Check role against HIGH_EXPOSURE_ROLES list → return HIGH
3. Check role against EXPOSURE_MAP (frontend/backend/fullstack/devops/data/ml/product/mobile/security/embedded) → return mapped level
4. Apply seniority modifier: 10+ years → -1 level, 2 or fewer years → +1 level
5. Fallback: check stack against HIGH_RISK_KEYWORDS

**Known limitation:** Simple keyword matching. Will need improvement as data reveals misclassifications.

---

## 8. Key Design Decisions Not Yet Implemented

These were identified and deliberately deferred:

1. **Richer next-move taxonomy** — current 4 buttons (stay/learn_ai/switch/not_sure) should eventually become the full response_type vocabulary from the JSON schema. Deferred until 50+ sessions.

2. **Richer Supabase schema** — current flat table should eventually capture pressure_type, response_type, career_stage, severity, confidence. Deferred to avoid mid-stream migration.

3. **Custom email domain** — currently using onboarding@resend.dev. Should eventually use a custom domain for credibility.

4. **Pseudonymous ID system** — the JSON schema supports PSEUDO-XXXX person IDs for longitudinal tracking. Not implemented in the tool yet.

5. **HAG ingestion layer** — the logic that transforms flat session records into graph nodes and edges. The spec exists. The code does not.

---

## 9. Distribution Status

| Channel | Status | Handle |
|---|---|---|
| GitHub | ✅ Live | github.com/shenbrian/humanexodus |
| GitHub Pages | ✅ Live | shenbrian.github.io/humanexodus |
| Dev.to | ✅ Published | dev.to/shenbrian |
| LinkedIn | ✅ Posted | Personal account (advertising background) |
| Reddit r/SideProject | ✅ Posted | u/Fit-Scholar1879 |
| Reddit r/cscareerquestions | ⏳ Waiting for karma | u/Fit-Scholar1879 (0 karma) |
| Reddit r/ExperiencedDevs | ⏳ Waiting for karma | u/Fit-Scholar1879 |
| Hacker News | ⏳ Waiting for karma | u/shenbrian (1 karma) |

**Reddit note:** Account u/Fit-Scholar1879 was pre-existing on the machine (linked to phone number). Need to comment on threads to build karma before posting in large subreddits.

**HN note:** Account u/shenbrian created. Bio set. Need 5-10 karma from commenting before submitting Show HN.

**LinkedIn framing that worked:** "I'm not an engineer. I'm in advertising. I watch how people respond to disruption for a living. So I built a system to watch how engineers respond to AI." Use this framing consistently.

---

## 10. ChatGPT Prior Work — What Was Taken

ChatGPT designed three documents before Brian decided to make the project open source:

1. **Execution Brief v1** — core purpose, problem statement, conceptual model, project nature
2. **Dataset v0.1 schema** — detailed record structure, controlled vocabularies, update mechanism, repo structure
3. **HAG specification** — graph structure, node types, edge types, time model, transformation logic, computable metrics

**Taken:** Conceptual model, richer data schema, HAG concept, repo architecture, computable metrics, node/edge types, transformation logic, controlled vocabularies.

**Not taken:** PR-based contribution workflow, pseudonymous ID system in tool, salary fields, complex causal scoring, reputation systems.

---

## 11. How to Update This Log

At the end of every working session with Claude, ask:

*"Please update the project log with everything we did in this session."*

Claude will write the updated version. Replace `docs/project-log.md` in the repo and push.

---

## 12. What to Do Next (Priority Order)

1. **Build Reddit karma** — comment genuinely on r/cscareerquestions and r/ExperiencedDevs. Post when 20+ karma.

2. **Build HN karma** — comment on Show HN and Ask HN threads. Submit Show HN when 5-10 karma.

3. **Watch for first contributors** — check GitHub Issues and Pull Requests. Respond within 48 hours.

4. **Watch the Supabase table** — when sessions reach 50+, begin designing schema upgrade.

5. **Wait for first follow-up data** — 30 days from first sessions with email. Update patterns.html to show intention vs reality gap.

6. **Build HAG ingestion layer** — when schema upgrade is done and data volume justifies it.

---

## 13. Files in the Repo (Current)

```
humanexodus/
├── README.md                              ← Full HAG vision, current state, open problems
├── CONTRIBUTING.md                        ← Contributor guide, ground rules
├── LICENSE                                ← MIT
├── .gitignore                             ← Includes supabase/.temp/
├── humanexodus-v01.html                   ← Entry tool (v0.4 — includes email field)
├── patterns.html                          ← Live pattern dashboard
├── followup.html                          ← 30-day outcome collection page
├── hag-core/
│   ├── graph_schema/
│   │   └── HAG-v0.1-spec.md              ← Formal HAG specification
│   ├── ingestion/.gitkeep                ← Empty — to be built
│   ├── transition_builder/.gitkeep       ← Empty — to be built
│   ├── pressure_model/.gitkeep           ← Empty — to be built
│   ├── metrics/.gitkeep                  ← Empty — to be built
│   └── tests/.gitkeep                    ← Empty — to be built
├── schema/
│   └── humanexodus_record.schema.json    ← Formal JSON schema for dataset records
├── examples/
│   ├── example_consulting_reskilling.json
│   ├── example_radiology_scope_reduction.json
│   └── example_engineer_role_shift.json
├── datasets/.gitkeep                      ← Empty — for real contributed records
├── research-notes/
│   └── HAG-design-thinking.md            ← Design reasoning document
├── docs/
│   └── project-log.md                    ← This file
└── supabase/
    └── functions/
        └── send-followups/
            └── index.ts                   ← Daily follow-up email edge function
```

---

*Last updated: March 2026 — Session 2*
*Built with Claude (Anthropic) + Brian Shen*