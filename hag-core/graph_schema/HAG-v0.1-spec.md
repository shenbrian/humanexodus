# Human Adaptation Graph (HAG) — v0.1 Specification

> The Human Adaptation Graph models how individuals transition between roles, skills, and industries over time in response to AI-induced pressure signals.

It is a time-aware, probabilistic graph built from contributed repositioning events.

---

## 0. Core Definition

HAG is not a dashboard. It is not a survey output. It is not a prediction engine.

It is structural measurement infrastructure for one of the most significant labour transitions in history.

The atomic unit is:

```
AI-Induced Pressure → Human Repositioning → Observed Outcome
```

HAG makes this unit computable, linkable, and longitudinal.

---

## 1. Graph Structure

HAG is a **heterogeneous temporal graph**.

### Node Types (v0.1)

Four node types only.

| Node | Represents |
|---|---|
| `Role` | A functional career position |
| `Skill` | A capability cluster |
| `Industry` | A sector or domain |
| `PressureSignal` | A perceived or observed AI pressure event |

Deferred to later versions: Geography, Organization, Tool, OutcomeState.

---

### 1.1 Role Node

Represents a functional career position.

**Examples:**
- Senior Consultant
- Radiology Registrar
- Junior Accountant
- UX Designer
- Backend Engineer

**Fields:**
```json
{
  "role_id": "string",
  "title": "string",
  "industry_id": "string",
  "skill_vector": ["tag1", "tag2"],
  "emergence_timestamp": "ISO8601"
}
```

---

### 1.2 Skill Node

Represents capability clusters — not individual tools.

**Examples:**
- problem_structuring
- client_synthesis
- prompt_engineering
- first_pass_diagnosis
- financial_reporting

**Fields:**
```json
{
  "skill_id": "string",
  "category": "string",
  "ai_exposure_estimate": "low | medium | high | unknown"
}
```

---

### 1.3 Industry Node

**Examples:**
- management_consulting
- healthcare
- finance
- legal_services
- software_engineering

**Fields:**
```json
{
  "industry_id": "string",
  "volatility_index": "derived — not in v0.1"
}
```

---

### 1.4 PressureSignal Node

Represents a perceived or observed AI pressure event.

**Examples:**
- drafting_automation_signal
- image_reading_ai_adoption
- client_self_service_ai
- internal_productivity_mandate
- ai_enabled_competitor_entry

**Fields:**
```json
{
  "signal_id": "string",
  "pressure_type": "see controlled vocabulary",
  "first_observed_time": "ISO8601",
  "confidence_aggregate": "1-5"
}
```

---

## 2. Edge Types

Edges are where the real intellectual challenge lives.

---

### 2.1 Role → Role Transition Edge

Represents observed repositioning between career positions.

**Examples:**
- Junior Designer → AI Interaction Designer
- Consultant → AI-enabled Strategy Specialist
- Accountant → Automation Oversight Analyst

**Fields:**
```json
{
  "transition_id": "string",
  "source_role_id": "string",
  "target_role_id": "string",
  "transition_trigger_signal_id": "string",
  "transition_start_time": "ISO8601",
  "observed_frequency": "integer",
  "median_transition_duration": "days",
  "confidence_score": "0.0-1.0"
}
```

This edge is the backbone metric surface of HAG.

---

### 2.2 Role → Skill Edge

Represents skill importance within a role and how it is changing.

**Fields:**
```json
{
  "weight": "0.0-1.0",
  "trend_direction": "increasing | stable | declining | emerging"
}
```

---

### 2.3 PressureSignal → Role Edge

Represents how strongly a pressure signal affects a role.

**Fields:**
```json
{
  "exposure_score": "0.0-1.0",
  "lag_time_estimate": "days"
}
```

This enables modelling of **pressure propagation across the labour topology** — how a signal that hits one role eventually reaches adjacent roles.

---

### 2.4 Skill → Skill Substitution Edge *(v0.1-lite)*

Represents automation replacement or augmentation pairing.

**Examples:**
- first_draft_copywriting ↔ prompt_structuring
- manual_data_entry ↔ workflow_orchestration
- image_diagnosis ↔ ai_assisted_review

---

## 3. Time Model

Every edge supports:

```json
{
  "first_seen_timestamp": "ISO8601",
  "last_confirmed_timestamp": "ISO8601",
  "update_count": "integer"
}
```

This makes HAG **longitudinal by design** — not static. The graph evolves as new submissions arrive and existing contributors update their records.

---

## 4. From Dataset Record → Graph Update Logic

This is the critical transformation layer.

When a user submits a repositioning record:

```
role: Senior Consultant
pressure: drafting automation
response: reskill toward AI-enabled synthesis
```

The graph update logic:

1. Ensure `Role` node exists for "Senior Consultant"
2. Ensure `PressureSignal` node exists for "drafting_automation"
3. Create or strengthen: `PressureSignal → Role` edge
4. If target trajectory inferred or later confirmed:
   - Create or strengthen: `Role → Role` transition edge
5. Update `Role → Skill` weights based on response type

This logic lives in `hag-core/ingestion/` and `hag-core/transition_builder/`.

---

## 5. Controlled Vocabularies

### pressure_type
```
replacement_pressure
augmentation_pressure
scope_reduction
scope_expansion
skill_obsolescence_signal
productivity_expectation_shift
market_demand_shift
organizational_restructuring
opportunity_emergence
unclear
```

### response_type
```
reskilling
upskilling
role_shift
industry_switch
tool_adoption
entrepreneurship
portfolio_career
wait_and_observe
resistance
relocation
other
```

### outcome_status
```
in_progress
stabilized
improved_position
role_lost
role_changed
income_reduced
income_improved
unclear
```

### career_stage
```
early
mid
senior
executive
founder
independent
unknown
```

---

## 6. First Computable Metrics (v0.1)

These are the first measurable outputs from the graph.

| Metric | Definition |
|---|---|
| **Transition Density** | How many transitions observed between two roles |
| **Pressure Exposure Score** | Aggregate perceived pressure per role |
| **Adaptation Velocity** | Median time between signal and repositioning |
| **Skill Drift Index** | Rate at which skill importance changes over time |

These are publishable research primitives — not dashboard vanity metrics.

---

## 7. What HAG Is Not

HAG is not a prediction engine. It does not tell people what will happen.

HAG is an observation layer. It records what is happening — role by role, signal by signal, transition by transition — and makes that record computable.

The predictions will emerge from the data. Not from assumptions built before the data exists.

---

## 8. Open Problems (Contribution Opportunities)

These are real unsolved problems in the v0.1 design:

1. **Graph schema design** — How do you represent messy human transitions without losing signal?
2. **Signal validation** — How do you prevent noise and hype entries from degrading the graph?
3. **Temporal modeling** — How do transitions evolve over months and years?
4. **Taxonomy evolution** — Roles and skills change — how does the schema adapt without breaking compatibility?
5. **Inference layers** — How do you compute emerging pathways from sparse early data?
6. **Visualization** — How do you make the graph interpretable without oversimplifying it?
7. **Open governance** — Who curates edge weighting? What is the decision process?

If any of these problems interest you — open an issue.

---

## 9. Versioning Philosophy

- Schema evolves in versions (v0.1, v0.2, etc.)
- Controlled vocabularies remain adaptable
- Backward compatibility is considered from the start
- Breaking changes require a version increment and migration notes

---

*HAG v0.1 — March 2026*
*HumanExodus open-source project*
*https://github.com/shenbrian/humanexodus*
