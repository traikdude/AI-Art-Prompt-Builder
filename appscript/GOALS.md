# AI Art Prompt Builder → Media Generation Studio — Goal Plan

> Goal OS record, created 2026-09-11 by Claude (session `session_018iGnoSFyd788gpMxZZEtHR`).
> Canonical copy of the cursor also lives in `C:\Users\traik\.agents\GOAL_LEDGER.md` (G3).
> Inputs: clasp clone at HEAD ad784dc, code map `promptbuilder_code_map.md`, sheet map
> `promptbuilder_sheet_map.md`, tools research `creative_tools_research.md` (all in the session scratchpad).

## 🧭 North Star

**One prompt-and-asset system that Erik's agents and clients can use to generate, deliver, and
verify both AI images and AI video, so a friend's request today becomes a repeatable service tomorrow.**

Why it matters: Morrison1 proved the delivery half (verified local → Drive → Sheet → Photos). The
2025 Prompt Builder holds the vocabulary half (1,173 curated values). Neither talks to the other,
and neither knows what a video is yet.

## 🎯 Active Goal — G3

**Resurrect the AI Art Prompt Builder as a working, deployed, agent-callable prompt engine, then
extend its data model to video, so Morrison1-style pipelines can pull prompts from it instead of
hand-writing them.**

Classification: `COMMITTED GOAL` (Erik, 2026-09-11: "I'm going to resurrect it now").

## ✅ Definition of Done

1. The dashboard opens from the Sheet menu and every button works against a backend function that exists.
2. `clasp push` from this repo is the only way code reaches script `1cu3shbnqq…RGP42Jopz`; a git tag marks each pushed version.
3. A `doGet`/`doPost` web app (or Apps Script API execution) lets an agent ask for a prompt by category selections and get JSON back.
4. The vocabulary has a video layer: shot type, camera move, duration, fps/aspect, and scene/shot sequencing, seeded from the 17 existing motion entries in the `Shots` tab.
5. Morrison1 generates one real still using a prompt fetched from the Prompt Builder rather than a hand-written one, with its normal three-destination receipt.
6. DaVinci Resolve, Blender, Unity Hub, and VLC are installed, and one documented agent hook exists for DaVinci (Python API) and Blender (`bpy`).

## 📊 KPIs

| KPI | Type | Now | Target |
|---|---|---|---|
| Dashboard `google.script.run` calls with a matching backend function | leading | 4 of 4 | 4 of 4 |
| Vocabulary values reachable via API | lagging | 1,173 (live) | 1,173+ |
| Video-layer categories | leading | 6 defined, 0 seeded in sheet | 6 |
| Morrison1 stills generated from Prompt Builder prompts | lagging | 0 | 1, then daily |
| Creative tools installed | leading | 4 of 4 (DaVinci 21.1 installed 2026-09-11; external scripting toggle pending) | 4 of 4 |

## 🪜 Milestones

| # | Milestone | State change | Status |
|---|---|---|---|
| M0 | Repo under clasp + git, code and sheet fully mapped | done 2026-09-11 (ad784dc) | ✅ verified |
| M1 | Dashboard repaired: `getDashboardData`, `savePromptToLog`, `exportPromptToDrive` implemented; version strings aligned to 5.2.0; live tab names resolved via `SHEET_ALIASES`; pushed via clasp (tags v5.2.0-push1/push2, remote updateTime 2026-09-12T02:54Z) | Tool works again | ✅ verified: Erik clicked through the dashboard 2026-09-11; API read of live categories confirms the resolver |
| M2 | Agent API: `Api.js` `doGet`/`doPost` (health, categories, prompt with formats); deployed @2 as web app, ANYONE_ANONYMOUS, optional `PROMPT_API_TOKEN` script property; live-verified with curl 2026-09-12 03:03Z | Agents can call it | ✅ verified |
| M3 | Video layer: `Video.js` seed migration (menu 🎥 Setup Video Tab), `generateVideoFormat` text + JSON, API `video` section (api2 @3), live-verified prompt 2026-09-12 03:05Z | Prompts describe motion | 🟡 code live; Video tab seeding needs one menu click |
| M4 | Morrison1 integration: `species_catalog.py` fetches its Codex-still prompt from M2 | Two projects joined | ⬜ blocked on M2 |
| M5 | Tool hooks: `tools/davinci_smoke.py` (exits 3 until Resolve installed), `tools/blender_smoke.py` (rendered 640x360 PNG, 128 KB, verified) | Post-production is scriptable | 🟡 Blender verified; DaVinci awaits install |
| M6 | In-Sheet Dynamic Prompt Studio + Reactive Web Dashboard: eliminated `#REF!` camera bug by binding to `Shots`; created pinned `PROMPT_BUILDER` sheet with live `=TEXTJOIN(...)` formula and native dropdown validations; added real-time reactive composition, mode switching (Clean Tokens/Structured/Prefix), and click-to-copy in Dashboard | Live prompt composition everywhere | ✅ verified: pushed & deployed @5/@6 (2026-09-15) |
| M7 | Multi-Tier Instant Category Loading & Query Optimization: eliminated 572K-cell traversal in `Shots` (98.5% reduction via row-1 header indexing + O(1) Set dedupe); added persistent `ScriptProperties` cache (<15ms); upgraded modal opener to `HtmlService.createTemplateFromFile` with server pre-injected data (0ms client load); added 4-tier hierarchy (Template 0ms → localStorage <5ms → Backend RPC → Web App API fallback with 5s watchdog) | Categories load instantly without hanging | ✅ verified: pushed & deployed @7 (2026-09-15) |
| M8 | Clean Tab Bar & Studio Focus: automated menu commands to hide internal backend tabs (`ALIAS`, `RAW_AI_DATA`, `IMPORT_DB`, `[X]` legacy tabs, and optional DB reference tabs) and restore with Unhide All Tabs; deployed @19; live-verified via Web App API | Distraction-free sheet ribbon with 1-click cleanup | ✅ verified: pushed & deployed @19 (2026-09-15) |

## ✅ Priority Work

- **A-1** M1: implement the three missing backend functions the dashboard already calls (Dashboard_v5_0_ENHANCED.html lines 551–755), align the v5.1.1 strings to 5.2.0, `clasp push`, open the Sheet, click every button. Estimate 90–120 min, model estimate, medium confidence.
- **A-2** M5a: Erik downloads DaVinci Resolve from the official page; then a 20-line Python smoke test lists the current project via the Resolve API. Estimate 30 min plus Erik's click.
- **A-3** M2: web app endpoint. Estimate 60–90 min, medium confidence.

Big Three for the next session: A-1, A-2, A-3.

## 🗂️ Backlog (possibility, not obligation)

- Wire the unused v5.2.0 features (theme, sound, alias suggestions, persisted selections) into the dashboard or delete them.
- Multi-tenant: move from bound script to standalone library so other clients' sheets can consume it.
- Unity/Godot: only if a client asks for game-engine deliverables; no work planned.
- The zip of the older Apps Script Erik mentioned: not yet received; ingest when provided.

## ⏱️ Time & Capacity

Estimates are model estimates (no personal telemetry yet for this repo). Begin recording
actual minutes from A-1 onward so later estimates use history.

## 🌐 Live endpoint (M2)

```
https://script.google.com/macros/s/AKfycbyCjig1ociubkgrGw5P814n3aX1pQvzM4N5erySJWTJijL2oQW9ZfBZDUvwohLxHmyjNw/exec
```
`?action=health` · `?action=categories&section=character|scene|camera` · `?action=prompt&character.Gender=Male&scene.Lighting=Volumetric&camera.Shot%20Type=Wide%20Shot&formats=true` · POST `{action, selections, formats, token}`

## 🔌 Execution Routing

| Work | Owner |
|---|---|
| Code edits + `clasp push` | Claude in this repo (canonical writer) |
| Sheet structure changes (new Video tab) | Apps Script from this repo, never by hand in the UI, so it stays reproducible |
| Morrison1 integration | Morrison1 repo, separate commit, after M2 |
| DaVinci download | Erik (registration form) |
| Tool smoke scripts | this repo under `tools/` |

## 🚧 Blockers / Risks

- Dashboard is broken today (3 of 4 backend calls missing). Observed, not inferred.
- No AI model is called anywhere in the script; it is pure text templating. Generation stays in Morrison1's Python side by design.
- Folder renamed to `AiArtPromptBuilder` (done 2026-09-11).
- Sheet has 1,173 values with no schema validation; imports can silently drift.

## ▶️ Current Cursor

- Active goal: G3
- Completed milestones: M0, M1, M2, M6, M7 (all pushed and verified live)
- Current milestone: M3 (one click from done) → M4
- A-1: Erik: Sheet menu 🎨 AI Prompt Builder → 🎥 Setup Video Tab (idempotent). Then M4: Morrison1 `species_catalog.py` fetches its Codex-still prompt from the API. DELIBERATELY DEFERRED past 2026-09-12 11:05 so the first unattended Morrison1 run is observed on today's fixes alone.
- Blockers: DaVinci external scripting must be set to Local in Resolve Preferences (one UI click) before tools/davinci_smoke.py can pass
- Next review: live verification with Erik on dashboard instant loading
