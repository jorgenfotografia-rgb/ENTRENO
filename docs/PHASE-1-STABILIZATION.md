# Phase 1 stabilization

Scope: the effective legacy M01 runtime at `0835cb475ea09958137a3b490749a4daf0a3e3b5`.
No M01 V2, Master Visit Card, new scoring model, client memory, replay variability, or Training/Evaluation semantics are introduced.

## Ownership and compatibility

- `app.js` owns the live state and explicit conversation/completion handlers. Progress reads retain object identity.
- `data/scenarios/m01.js` is scenario data. Its existing copy, answers, cast, visual mapping, and Boss Check remain in place.
- `data/scenarios/m01-legacy-adapter.js` is a temporary, named compatibility adapter for the effective PRE-PILOT decision outcomes, including zero-question scoring. It is not the future Scoring Engine.
- The fixed conversation tree and legacy score weights, thresholds, and Boss bonus remain unchanged.
- `reset-progress.js` is not loaded by the new shell. It exists only to repair progress access in older cached pages. It never deletes progress and does nothing in the new runtime.
- Conversation actions carry the originating node/option identity and a state token. Stale actions are rejected. A 300 ms interval also protects newly rendered controls from rapid repeated activation.
- Pending consequences retain the existing 700 ms delay. Completion is explicit and idempotent. The engine enforces sequential access and requires all six results before showing a completed module.
- Reviewing a completed case uses a separate presentation selection and cannot change the active conversation's case index.

## Persistence

The main key remains `pitbull-academy-quality-pass-01`. Schema version `1` adds `schemaVersion`, `storageRevision`, and per-module `revision`; existing module/result fields remain compatible.

Migration runs only during loading. Rendering does not normalize or replace progress objects.

For unversioned data:

1. Preserve the exact original string in `pitbull-academy-quality-pass-01-before-phase1` before writing the converted record.
2. Prefer an active `moduleProgress` record over divergent top-level legacy state. Import top-level state only when there is no active scoped record. Do not infer recency from conversation length.
3. Validate known modules, conversation fields, indices, pending outcomes, and score values. Derive completed indices from valid results. An orphan completion is not converted into an invented score.
4. Preserve unknown module records. Do not relabel legacy M01 results as future curriculum evidence.

Structural repairs to versioned records preserve the original in `pitbull-academy-quality-pass-01-recovery`. Invalid JSON and unsupported schema versions are never automatically overwritten. Explicit malformed-record recovery keeps a backup before creating new progress; further explicit recoveries use a timestamp suffix when necessary.

If a backup or write fails, display a compact status only while action is needed. A failed ordinary save keeps the live conversation in memory and offers retry. Unsupported/corrupt records block pedagogical actions until resolved. A different saved record from another tab blocks overwriting it and offers explicit reload.

This is local storage, not a transactional multi-user database. The compare-before-write check detects observed tab conflicts; it cannot guarantee compare-and-swap across simultaneous browser processes.

Module reset clears only the selected module. It preserves the alias, catalog selection, other module records, and backups. No reset marker is required. No upgrade silently resets progress.

## Approved UX changes

- Browser zoom is allowed.
- Conversation updates have an accessible log role.
- COPIAR RESULTADO is independent of native sharing. Native-share failure attempts copying; clipboard failure reveals selectable text. Cancellation leaves the independent copy action available.
- Storage and update notices are hidden during normal use.
- Existing pilot visual markup, styling, layout, and six-case flow are preserved.

## Release procedure

The release identity must match in `app.js`, `service-worker.js`, and the `academy-release` meta tag in `index.html`.

1. Finish asset rebuilding on the development branch first. The asset workflow rebuilds/commits only the three WebP files, never application source. Wait for its resulting commit before preparing a release.
2. For any shipped code, content, style, or asset change, advance the release identity in all three locations. Do not reuse an installed cache identity.
3. Run the regression suite, the separate browser checks when available, and `git diff --check`.
4. Publish a complete repository revision only through the project's approved release process. Phase 1 implementation itself does not publish or merge.
5. Test an already-open older installation as well as a fresh page and an offline reload.

The worker downloads and validates the required snapshot before caching it. It checks HTML/application release identity. It serves executable resources from that installed snapshot, not a mixture of later network responses. Only navigation receives the cached HTML shell; missing code receives a plain-text 503. Optional catalog image caching is independent of executable code and excludes HTTP error responses.

An updated worker waits while an existing client is open. ACTUALIZAR saves state before requesting activation and reloads on controller change. If saving fails, activation is not requested. Other open tabs are offered an update rather than silently reloaded. A worker may also activate normally when all older clients close.

Cleanup is limited to names beginning `pitbull-academy-`. Unrelated origin caches remain intact. Service-worker and storage versions are independent.

## Verification

Dependency-free suite (Node 20 or later):

```sh
node --test tests/stabilization.test.cjs tests/service-worker.test.cjs
```

Equivalent command: `npm test` when npm is available. CI runs this suite on Node 22.

Optional browser suite:

```sh
node --test tests/browser.test.cjs
```

It uses an already available Playwright runtime, without adding a project dependency. If it is outside normal module resolution, set `ACADEMY_PLAYWRIGHT_PATH` to that installation. Optionally set `ACADEMY_BROWSER_EXECUTABLE` to an installed Chromium-family browser. Missing runtimes are reported as skipped checks, not passed browser coverage.

The tests start a temporary local HTTP server and isolated browser profiles. Browser screenshots go to the operating system's temporary directory, not the repository. Browser checks include desktop/mobile six-case completion, rapid input, reload, copy fallback, offline behavior, and old-to-new worker activation. They do not represent physical-device or Safari verification.

Legacy characterization was committed before application refactoring. It checks 324 complete-route/action combinations and 72 early decisions against hashes captured from the effective original runtime, including overrides. It also checks ASK_MORE, score weights, rank boundaries, Boss bonus, and unchanged curriculum/catalog content.

## Rollback

Keep storage backups and the working branch's small commits. Roll back a failing change with a new corrective release identity; do not reuse a cache identity.

Do not redeploy the audited original wholesale: its reset script can delete progress and its core progress reader contains the detached-reference defect. A rollback must retain the no-reset compatibility shim, stable state access, and a reader compatible with schema version 1.

Prefer reverting the specific failing change while preserving persistence fixes. Never overwrite the main storage key automatically with a backup: it may contain a newer session. Restore a backup only through an explicit, reviewed recovery that preserves the newer raw record too.

## Deferred work

The later architecture separation and all new pedagogical behavior remain subject to separate approval. This phase deliberately retains fixed scripts, exhausted ASK_MORE behavior, legacy score labels, and the current visual pilot identity mapping.
