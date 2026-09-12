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
| Dashboard `google.script.run` calls with a matching backend function | leading | 1 of 4 | 4 of 4 |
| Vocabulary values reachable via API | lagging | 0 | 1,173+ |
| Video-layer categories | leading | 0 | 5 |
| Morrison1 stills generated from Prompt Builder prompts | lagging | 0 | 1, then daily |
| Creative tools installed | leading | 3 of 4 (DaVinci pending Erik) | 4 of 4 |

## 🪜 Milestones

| # | Milestone | State change | Status |
|---|---|---|---|
| M0 | Repo under clasp + git, code and sheet fully mapped | done 2026-09-11 (ad784dc) | ✅ verified |
| M1 | Dashboard repaired: `getDashboardData`, `savePromptToLog`, `exportPromptToDrive` implemented; version strings aligned to 5.2.0; live tab names resolved via `SHEET_ALIASES`; pushed via clasp (tags v5.2.0-push1/push2, remote updateTime 2026-09-12T02:54Z) | Tool works again | 🟡 pushed, live click-through pending |
| M2 | Agent API: `doGet`/`doPost` returning JSON prompts; deployed as web app; documented curl example | Agents can call it | ⬜ blocked on M1 |
| M3 | Video data model: new `Video` tab + categories; `generateMultiFormatPrompts` gains a video format | Prompts describe motion | ⬜ blocked on M1 |
| M4 | Morrison1 integration: `species_catalog.py` fetches its Codex-still prompt from M2 | Two projects joined | ⬜ blocked on M2 |
| M5 | Tool hooks: `tools/davinci_smoke.py` (exits 3 until Resolve installed), `tools/blender_smoke.py` (rendered 640x360 PNG, 128 KB, verified) | Post-production is scriptable | 🟡 Blender verified; DaVinci awaits install |

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
- Current milestone: M1 (pushed, unverified live)
- A-1: open the Sheet, menu 🎨 AI Prompt Builder → Open Interactive Dashboard, confirm dropdowns populate for all three sections and Log/Export buttons succeed; then M2 (web-app endpoint)
- Blockers: live click-through needs a human in the Sheet UI; DaVinci installer download in progress via Playwright
- Next review: after M1 push, or at the next session start
