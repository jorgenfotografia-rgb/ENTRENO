# Codex Phase 0 · Audit Prompt

Use this as the first task in Codex for `jorgenfotografia-rgb/pitbull-academy`.

---

Read `AGENTS.md` and every file in `/docs/academy-system/` before doing anything else.

Your task is PHASE 0: ARCHITECTURE AND MIGRATION AUDIT.

Do not modify code, configuration, content, assets, storage keys, service worker behavior or UI in this task. Do not open a PR with implementation changes. First understand the repository and compare the current implementation against the normative Academy specifications, including the PRE-PILOT-derived requirements.

Audit the repository completely and return a structured report covering:

1. Current architecture and runtime flow.
2. How application state, module progress, conversation state and persistence currently work.
3. Where responsibilities are mixed across `app.js`, scenario data, UI rendering and other files.
4. Any monkey-patching, duplicated logic, implicit globals or fragile coupling.
5. Root causes or likely root causes of the recent conversation/progress regressions, including duplicate questions, lost state and stale cache behavior.
6. Service worker and cache update risks.
7. Current storage schema, migration behavior and reset mechanisms.
8. Which parts of the existing UI/UX and code can be safely preserved.
9. Gaps between the current implementation and the target separation: CLIENTS / VISITS / MODULES / CATALOG / ENGINE / VISUALS.
10. Gaps between the current conversation model and Master Visit Card, including facts, topics, readiness, multiple discovery routes and non-terminal ASK_MORE/CLARIFY_REQUEST.
11. Gaps between the current score model and the auditable Scoring Engine with score evidence ledger.
12. Gaps relative to PRE-PILOT requirements: replay validity, visit variability, natural conversation, Training vs Evaluation behavior, mobile density and result-sharing fallback.
13. Test coverage that is missing for conversation, persistence, scoring, reset, migration, replay, double-action prevention and visual independence.
14. A proposed target architecture with clear module boundaries and ownership.
15. An incremental migration plan split into phases, with acceptance criteria, risks and rollback strategy for each phase.

Important constraints:
- Do not redesign the visual experience unless required to explain an architectural issue.
- Do not migrate M01 yet.
- Do not invent missing pedagogical rules.
- Prefer incremental migration over a full rewrite unless you can demonstrate why a rewrite is safer.
- The current repository is a prototype; legacy behavior is not automatically normative.
- The documents in `/docs/academy-system/` define the intended product direction.
- `08_M01_REFERENCE_SPEC.md` V2 defines the canonical first module for the later migration phase.
- `10_PILOT_FEEDBACK_V1.md` contains validated qualitative findings that have already been converted into product requirements.
- Follow the conversation rules in `11_CONVERSATION_EDITORIAL_BIBLE.md` when evaluating current copy architecture, but do not rewrite copy in Phase 0.
- Follow `12_UX_FUNCTIONAL_RULES.md` when identifying UX debt, but do not implement it in Phase 0.
- Scores must eventually be explainable and auditable.
- VISUALS must never mutate pedagogical state.
- ASK_MORE and CLARIFY_REQUEST must eventually be modeled as conversational actions, not terminal answers.
- Replay must eventually measure competence rather than script memory.

End your report with:
A. `KEEP` — components or patterns worth preserving.
B. `REFACTOR` — components that should be changed incrementally.
C. `REMOVE` — temporary or harmful patterns that should not survive the migration.
D. `PHASE 1 PLAN` — the smallest safe stabilization phase we should implement next.
E. `QUESTIONS` — only unresolved product/specification questions that block implementation. Do not ask questions that can be answered by inspecting the repository.

Do not start Phase 1 until we review and approve the audit.
