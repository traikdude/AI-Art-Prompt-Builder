# Idea Set — what the Prompt Builder + tonight's tools can become (Nova-Genesis pass, 2026-09-11)

Occupied territory (what exists, verified tonight):
- **AI Art Prompt Builder** (this repo): 1,173-value vocabulary, live JSON API, video layer. Pure templating, no model calls.
- **Smart Prompt Builder** (`AppsScript/SmartPromptBuilder`, 2026): 1.5 MB single-page Gemini web app ("Elite Multi-Channel Architect"), templates incl. video/Runway/Pika, saves to a Google Doc, RLHF telemetry sheet. Calls a model; has no vocabulary.
- **NOVA-GENESIS GAS** (`AppsScript/NovaGenesisGAS`, 2026-04): `generateFilmAnalysis` web app.
- **Morrison1**: verified local → Drive → Sheet → Google Photos delivery, daily scheduler, watchdog.
- **Tools**: DaVinci Resolve 21.1 (Python API, headless render), Blender 5.2 (`bpy`, render proven), Unity Hub, VLC.
- **Archive**: Drive `ai art work APp script/__VERSION HISTORY` VERSION 1–11 (docx exports), sheet screenshots, 11/19/2025 xlsx.

Unexplored territory: nothing today turns a prompt into a *delivered, verified artifact* for anyone but Matt; nothing closes the loop from result back into vocabulary; nothing runs without you.

## 1. The Assembly Line — Prompt Builder feeds Morrison1's delivery rail
**Concept** Morrison1 already owns the hardest part: verified delivery with receipts. Detach its delivery rail from dinosaurs and let any Prompt Builder prompt ride it.
**Core mechanism** `species_catalog.py` fetches `?action=prompt` (image) or `data.video` (motion) from the API; the receipt records the vocabulary IDs used.
**Why this opens new territory** Two dead-end projects become one pipeline; every generated file is traceable to the exact selections that made it.
**Key trade-off** Couples the Prompt Builder to a Python host; the Sheet alone can't deliver.

## 2. The Taste Loop — RLHF telemetry becomes vocabulary weights
**Concept** The Smart Prompt Builder already logs RLHF telemetry. Point that at Prompt Builder selections: every kept/rejected image votes on the vocabulary values that produced it.
**Core mechanism** History/Log gains a `kept` column; a weekly Apps Script job ranks values per category and the dashboard sorts dropdowns by win rate.
**Why it matters** The 1,173 values stop being a flat list and become *your* taste model, portable to any client.
**Key trade-off** Needs honest labeling; one aesthetically lucky run must not become a rule (evidence class stays Observed until repeated).

## 3. Shot-List-to-Cut — DaVinci assembles the sequence you designed in the Sheet
**Concept** The Video tab's Sequence Role + Transition columns are already an edit decision list. Let DaVinci's Python API read the shot list, import the generated clips, and build the timeline with the named transitions, headless.
**Core mechanism** `tools/davinci_smoke.py` grows into `davinci_assemble.py`: JSON shot list in, `.drp` timeline + rendered MP4 out.
**Why distinct** Today every video step after generation is manual. This makes the *edit* a generated artifact too.
**Key trade-off** Needs the external-scripting toggle and clips that actually exist; nondeterministic generators will need a reconciliation step like Morrison1's.

## 4. Previz Rig — Blender renders the camera move before you spend a generation
**Concept** Camera Move + Shot Type + Aspect map onto a Blender camera rig around a placeholder subject. Render a 2-second grey previz for pennies before paying for a Veo/Runway generation.
**Core mechanism** `blender_smoke.py` already animates a dolly; parametrize it from the API's `video.json`.
**Why it matters** Turns vocabulary into a physical check on framing and motion; catches "Extreme Wide Shot + Dolly In on a 9:16 frame" mistakes early.
**Key trade-off** Previz is not the final look; useful for motion and framing only.

## 5. Client Mode — one Sheet per client, one API, one delivery rail
**Concept** Copy the Sheet template per client (Matt's dinosaurs, next client's brand), each with its own vocabulary and Photos album; the API takes a `client` parameter that selects the bound Sheet.
**Core mechanism** Standalone script + a registry tab mapping client → Sheet ID → Drive roots → Photos album; Morrison1's receipts become per-client ledgers.
**Why this opens new territory** This is the "friend today, clients tomorrow" step; everything else stays identical.
**Key trade-off** Multi-tenant auth: the anonymous API must gain the `PROMPT_API_TOKEN` per client first.

## 6. Wildcard: The Archaeologist — VERSION 1–11 as a training corpus
**Concept** The eleven archived docx versions and the Smart Prompt Builder's Doc log are a record of how your prompting evolved for a year. Mine them for values that were dropped, aliases that recurred, and prompts you kept coming back to.
**Core mechanism** Drive read → diff against the live 1,173 values → candidates land in RAW_AI_DATA for the existing import/dedupe pipeline.
**Why distinct** Nothing else here grows the vocabulary from your own history instead of from new brainstorming.
**Key trade-off** Old versions may carry values you abandoned on purpose; import stages, never auto-merges.

## Pattern across the set
Ideas 1, 3, 4 turn prompts into artifacts. Idea 2 turns artifacts back into better prompts. Idea 5 makes the whole thing sellable. Idea 6 mines the past.

**Strongest practical candidate:** 1 (all pieces exist; it is milestone M4 and only waits on tomorrow's 11:05 observation).
**Most unconventional:** 4 (Blender as a cheap pre-flight for expensive generations).
**Most promising hybrid:** 1 + 3, a request in the Sheet becomes a delivered, edited MP4 with receipts at every hop.

💡 One blind spot the current framing may be hiding: every design so far treats *you* as the operator. Idea 5 plus Morrison1's scheduler means the operator can be a scheduled task, and you only handle `NEEDS_RECONCILIATION` exceptions.
