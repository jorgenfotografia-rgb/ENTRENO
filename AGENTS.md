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
- ASK_MORE and CLARIFY_REQUEST are conversational, not terminal.
- Scores must be explainable from auditable evidence.
- Do not introduce product-first behavior when the specification calls for competency-first training.
- Difficulty must come from the client situation, not from confusing wording.
- Replaying a module must test the competence, not memory of a fixed script.

## Conversation rules
- Follow `11_CONVERSATION_EDITORIAL_BIBLE.md` for all customer and seller copy.
- A seller intervention should have one primary intent.
- Poor options must remain plausible; do not create obviously bad decoys.
- A single fact may be discoverable through more than one natural route.
- Do not make exact phrase matching the basis of success.

## UX rules
- Follow `12_UX_FUNCTIONAL_RULES.md`.
- Mobile is the primary interaction context.
- Prefer one dominant action per screen.
- Training and Evaluation modes have different navigation semantics.
- Always provide a copy-result fallback when sharing is supported.

## Engineering rules
- Avoid monkey-patching engine functions from scenario/data files.
- Avoid multiple competing sources of truth for progress.
- Read helpers must not silently replace mutable state objects.
- Any engine behavior change requires tests.
- Preserve working UX unless a task explicitly changes it.
- Keep storage migrations explicit and versioned.
- Treat service worker/cache behavior as part of release correctness.
- Prevent duplicate conversation actions and double-tap execution.

## Working protocol
For substantial architecture work, first provide an audit and migration plan before editing. Do not implement speculative product behavior. When the specification is incomplete, identify the gap instead of inventing a rule.
