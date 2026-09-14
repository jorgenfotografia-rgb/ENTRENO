# Codex Phase 0 · Audit Prompt

Use this as the first task in Codex for `jorgenfotografia-rgb/pitbull-academy`.

---

Read `AGENTS.md` and every file in `/docs/academy-system/` before doing anything else.

Your task is PHASE 0: ARCHITECTURE AND MIGRATION AUDIT.

Do not modify code, configuration, content, assets, storage keys, service worker behavior or UI in this task. Do not open a PR with implementation changes. First understand the repository and compare the current implementation against the normative Academy V1.0 specifications.

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
10. Gaps between the current scoring/conversation model and Master Visit Card + Scoring Engine V1.0.
11. Test coverage that is missing for conversation, persistence, scoring, reset, migration and visual independence.
12. A proposed target architecture with clear module boundaries and ownership.
13. An incremental migration plan split into phases, with acceptance criteria, risks and rollback strategy for each phase.

Important constraints:
- Do not redesign the visual experience unless required to explain an architectural issue.
- Do not migrate M01 yet.
- Do not invent missing pedagogical rules.
- Prefer incremental migration over a full rewrite unless you can demonstrate why a rewrite is safer.
- The current repository is a prototype; legacy behavior is not automatically normative.
- The documents in `/docs/academy-system/` define the intended product direction.
- Scores must eventually be explainable and auditable.
- VISUALS must never mutate pedagogical state.
- ASK_MORE must eventually be modeled as a conversational action, not a terminal answer.

End your report with:
A. `KEEP` — components or patterns worth preserving.
B. `REFACTOR` — components that should be changed incrementally.
C. `REMOVE` — temporary or harmful patterns that should not survive the migration.
D. `PHASE 1 PLAN` — the smallest safe stabilization phase we should implement next.
E. `QUESTIONS` — only unresolved product/specification questions that block implementation. Do not ask questions that can be answered by inspecting the repository.

Do not start Phase 1 until we review and approve the audit.
