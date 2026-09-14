# AGENTS.md · Pitbull Academy

This repository is governed by the product and pedagogical specifications in `/docs/academy-system/`.

## Before modifying code
1. Read every file in `/docs/academy-system/`.
2. Treat those specifications as the current normative product direction.
3. Inspect the current implementation before proposing changes.
4. Distinguish legacy behavior from desired behavior.
5. Prefer incremental, testable migrations over broad rewrites.

## Non-negotiable architecture rules
- CLIENTS describe persistent people.
- VISITS describe temporary situations.
- MODULES describe curriculum and competencies.
- CATALOG describes products, categories, ingredients and terminology.
- ENGINE owns conversation state, readiness, scoring, progress, persistence and memory.
- VISUALS are presentation only and must not mutate pedagogical state.

## Pedagogical rules
- Client first, product second.
- A stated request is not automatically the real need.
- Buyer and end user may differ.
- Remembering a client must improve questions, never justify assumptions.
- Appearance may trigger a question but never determine a recommendation.
- ASK_MORE is conversational, not terminal.
- Scores must be explainable from auditable evidence.
- Do not introduce product-first behavior when the specification calls for competency-first training.

## Engineering rules
- Avoid monkey-patching engine functions from scenario/data files.
- Avoid multiple competing sources of truth for progress.
- Read helpers must not silently replace mutable state objects.
- Any engine behavior change requires tests.
- Preserve working UX unless a task explicitly changes it.
- Keep storage migrations explicit and versioned.
- Treat service worker/cache behavior as part of release correctness.

## Working protocol
For substantial architecture work, first provide an audit and migration plan before editing. Do not implement speculative product behavior. When the specification is incomplete, identify the gap instead of inventing a rule.
