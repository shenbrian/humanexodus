# Why a Graph? Design Thinking Behind HAG

*Research note — March 2026*

---

## The problem with flat datasets

Most labour market datasets are flat. Each row is a person, a job title, a salary, a date. You can count things. You can average things. But you cannot follow a signal as it propagates through a labour topology.

When AI automates drafting work for consultants, the pressure doesn't stop at consulting. It moves — to adjacent roles, to connected skills, to related industries. A flat dataset cannot show you that movement. A graph can.

This is why HumanExodus is building HAG.

---

## The three properties that matter

**1. Heterogeneous**

The graph contains multiple node types — Roles, Skills, Industries, PressureSignals. Each has different properties. Each connects to others through different edge types with different semantics.

A homogeneous graph (all nodes the same type) would lose the structure that makes the labour market legible.

**2. Temporal**

Every edge carries timestamps. `first_seen`, `last_confirmed`, `update_count`. This means the graph is not a snapshot — it is a recording.

When a transition edge between "Junior Designer" and "AI Interaction Designer" appears for the first time, we know when. When it strengthens over six months as more people make that transition, we can see the velocity. When it stabilises, we can see the new equilibrium.

Static graphs cannot do this.

**3. Probabilistic**

Edges carry confidence scores. Not every reported transition is equally reliable. Early data from a handful of contributors carries less weight than a pattern confirmed by hundreds. The graph reflects this uncertainty explicitly rather than hiding it behind averages.

---

## The key insight: pressure propagation

The most intellectually interesting property of HAG is the `PressureSignal → Role` edge with its `lag_time_estimate` field.

This allows us to model how a pressure signal that hits one role eventually reaches adjacent roles — and how long that propagation takes.

Example:

1. "AI-enabled client self-service" signal hits "Customer Support Agent" roles first (lag: 0)
2. Six months later it reaches "Customer Success Manager" roles (lag: ~180 days)
3. Twelve months later it reaches "Account Executive" roles (lag: ~365 days)

Without the temporal edge properties, you cannot see this propagation. You just see two separate events. With them, you see a wave.

This is a genuinely new research primitive.

---

## The open governance problem

One problem we have not solved: who decides edge weights?

If 10 people report a transition from "Backend Engineer" to "AI Engineer" and 2 people report it as a failed transition, how do we weight the edge? Do we use frequency? Outcome quality? Contributor credibility?

This is an open problem. We are not pretending to have solved it. We are documenting it openly so contributors can engage with it seriously.

See the open problems list in the HAG spec.

---

## What we are not building

HAG is not a recommendation engine. It does not tell individuals what to do.

HAG is not a prediction market. It does not assign probabilities to future events.

HAG is not a sentiment tracker. It does not measure how people feel about AI.

HAG measures what people do — and what happens as a result. The interpretations are left to researchers, journalists, policymakers, and individuals who engage with the data.

---

## The starting point

We are beginning with software engineers because:

- They are technically literate and likely to contribute accurately
- They are the first profession to feel AI pressure at scale
- They are the most likely early contributors to an open-source project

But the model is not limited to engineers. The pressure taxonomy, response taxonomy, and graph structure are designed to capture adaptation across any profession.

The engineer-first approach is a pragmatic data collection strategy, not a design constraint.

---

## What we need from contributors

The hardest problems in HAG are not implementation problems. They are design problems:

- How granular should Role nodes be? (Is "Backend Engineer" one node or many?)
- How do you handle role titles that don't map cleanly to any taxonomy?
- How do you detect when two different contributors are describing the same PressureSignal?
- How do you handle the case where a reported transition never actually happened?

If you have experience with graph databases, temporal data modeling, or labour economics — these are the problems worth engaging with.

Open an issue. Start a discussion. The design is not finished.

---

*This is a living document. It will be updated as the design evolves.*

*HumanExodus — https://github.com/shenbrian/humanexodus*
