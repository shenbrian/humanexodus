# Contributing to HumanExodus

Thank you for your interest. HumanExodus is an open-source research project — not a product. Contributions that help the system observe more accurately are more valuable than contributions that make it look better.

---

## The one rule

**Data discipline first.**

Before adding any feature, ask: does this help us collect better data, or does it just make the interface nicer? If it's the latter, it can wait.

Specifically — do not build:
- Dashboards (until data volume justifies it)
- ML models (until patterns are confirmed from real data)
- User accounts (until they're necessary)
- Animations or visual polish (not a priority)

---

## What we need most right now

### 1. Use the tool and share it
The most valuable contribution is a real session with a real next-move selection. Use it. Share it with engineers you know. Every session improves the dataset.

👉 [https://shenbrian.github.io/humanexodus/humanexodus-v01.html](https://shenbrian.github.io/humanexodus/humanexodus-v01.html)

### 2. Improve the exposure engine
The rule-based exposure engine (`computeExposure` in `humanexodus-v01.html`) maps roles and stacks to HIGH / MEDIUM / LOW exposure. It is deliberately simple and almost certainly wrong in many cases.

Good contributions here:
- Better role → exposure mappings
- Stack-aware adjustments (e.g. Rust engineers vs PHP engineers)
- Seniority modifiers that are better calibrated
- Edge cases you've noticed from using the tool

### 3. Pattern analysis
As sessions accumulate, what do you see in the data? Open an issue with observations. Patterns noticed by humans are more trustworthy than patterns discovered by models at this stage.

### 4. v0.5 design
The next version is the predictive layer. Before we build it, we need to agree on what it should say and how. Open an issue with your thinking.

---

## How to contribute code

### Setup
No build tools required. The entire frontend is a single HTML file.

1. Fork the repo
2. Clone your fork
3. Open `humanexodus-v01.html` in your browser — it runs immediately
4. Make your changes
5. Test locally
6. Submit a pull request

### For Supabase changes
You'll need your own Supabase project for local development. Replace the `SUPABASE_URL` and `SUPABASE_ANON_KEY` constants in the HTML with your own project credentials.

### For the Edge Function
The follow-up email function is in `supabase/functions/send-followups/index.ts`. Deploying requires the Supabase CLI and Docker.

---

## How to open a good issue

Use this format:

```
## What I observed
[What you noticed — in the tool, the data, or the code]

## Why it matters
[How it affects data quality or system accuracy]

## Suggested approach
[What you'd do about it — optional]
```

---

## Pull request checklist

- [ ] Does this improve data quality or system accuracy?
- [ ] Is the change minimal — no unnecessary additions?
- [ ] Does it work without a build step?
- [ ] Have you tested it in the browser?

---

## Questions

Open an issue with the `question` label. No question is too basic — this is an early project and the design decisions are still being made.

---

*HumanExodus is built by people who think the most important question right now is: what are engineers actually doing in response to AI? If you think that question matters, you're in the right place.*
