# Video Schema Decision — PROPOSED (2026-09-11)

All content below is PROPOSED. Nothing here has been implemented or committed. Field names
under "28-field schema" are quoted VERBATIM from Google Doc "Universal AI Video Production
Orchestrator" (id 1gPOPtQo_Qksb-mCj_q5bu32Snz4ynPO6Q3MkSImD9mY), §34 "MOVIE SHOTLINE /
SPREADSHEET ADAPTER". The 13-stage pipeline is quoted VERBATIM from the doc's "Canonical law"
in §1: **SEED → UNDERSTAND → EXPAND → WORLD → STORY → SCENES → SHOTS → PROMPTS → TOOL ROUTE →
GENERATION → ASSEMBLY → QA → DELIVERY**.

Read of Google Sheet "Movie Shotline" (id 1DjYIPwICV6niYXrncKLlVleMHkWo4ytO73H1QUlVMaE)
succeeded. Its tabs are **vocabulary lists**, not a per-shot row schema: a Prompt-example tab,
an Eleven Labs voice-matching tab, a "Shots" vocabulary tab (Camera Angle, Composition, Effects,
Action — hundreds of verb phrases like "Approaching cautiously", "Branding skin with hot metal"),
a Character vocabulary tab (Gender, Hair Color/Type, Outfit combos), a Scene Settings vocabulary
tab (Render Type, Style, Lighting), and a combined dropdown-reference tab. **None of its tabs
contain the 28-field row schema** — that schema exists only in the Orchestrator doc as a design
recommendation, not as an implemented sheet.

## 1. Field-by-field crosswalk

| # | 28-field schema (verbatim) | Movie Shotline column | Current Video tab / JSON field | Status |
|---|---|---|---|---|
| 1 | PROJECT | not present (vocab sheet only) | not present | add — shot-list only |
| 2 | SCENE ID | not present | not present | add — shot-list only |
| 3 | SHOT ID | not present | not present | add — shot-list only |
| 4 | CHARACTER ID | Character tab has no ID column, only vocab | `subject` (joined string, not ID) | add — shot-list only |
| 5 | CHARACTER STATE | not present | not present | add — shot-list only |
| 6 | ENVIRONMENT ID | not present | not present | add — shot-list only |
| 7 | LOCATION | Scene Settings vocab (no "Location" header found) | `scene` (joined string) | already covered (as `scene`) |
| 8 | TIME | "Time of Day" (Scene Settings, existing app tab) | existing Scene Settings category | already covered |
| 9 | WEATHER | "Weather Effects" (Scene Settings) | existing Scene Settings category | already covered |
| 10 | ACTION | "Action" (Shots vocab tab, existing app Shots category) | existing Shots category | already covered |
| 11 | EXPRESSION | not a distinct column in Shots vocab | not present | ignore-with-reason: no source vocab found; would need invention |
| 12 | SHOT SIZE | "Camera Angle" (Shots vocab: Close-up, Medium shot, Wide shot…) | `shot` / Camera tab "Shot Type" | already covered (renamed: Camera Angle = Shot Type) |
| 13 | ANGLE | overlaps Camera Angle (Low/High angle values live inside same list) | not separately modeled | rename — split "Camera Angle" values into Shot Size vs Angle if precision matters, else ignore |
| 14 | COMPOSITION | "Composition" (Shots vocab: Centered, Rule of thirds…) | not present | add (new column, values verbatim below) |
| 15 | CAMERA MOVEMENT | not present in Sheet | `Camera Move` (Video tab, seed) | already covered |
| 16 | SUBJECT MOVEMENT | not present | not present | add — shot-list field, not vocabulary |
| 17 | ENVIRONMENT MOVEMENT | not present | not present | ignore-with-reason: no source vocab, low value vs. Motion Intensity already covering energy |
| 18 | LIGHTING | "Lighting" (Scene Settings, existing) | existing Scene Settings category | already covered |
| 19 | PALETTE | not present in Sheet (no "Palette" vocab found) | not present | ignore-with-reason: no source vocab; defer |
| 20 | STYLE | "Style"/"Render Type" (Scene Settings, existing) | existing Scene Settings category | already covered |
| 21 | AUDIO | not present in Sheet's vocab tabs (voices tab is casting, not per-shot audio) | not present | ignore-with-reason: production-tracking, not prompt vocabulary |
| 22 | DURATION | not present | `Duration` (Video tab, seed) | already covered |
| 23 | CONTINUITY | not present | not present | ignore-with-reason: cross-shot state, belongs in Shot List not vocabulary |
| 24 | NEGATIVE CONDITIONS | not present | `negative` (JSON field, currently unseeded) | already covered (rename target: keep `negative`) |
| 25 | MASTER PROMPT | not present | `generateVideoFormat().text` | already covered (generated, not stored vocab) |
| 26 | SELECTED TOOL | not present | not present | ignore-with-reason: production-tracking noise for this app |
| 27 | TOOL-ADAPTED PROMPT | not present | not present | ignore-with-reason: production-tracking noise |
| 28 | STATUS | not present | not present | ignore-with-reason: production-tracking noise |

## 2. Recommendation

**Adopt into the Video tab now (vocabulary a prompt generator needs):** add one new category,
**Composition**, sourced verbatim from the Movie Shotline Shots vocab tab. Everything else a
prompt/JSON consumer needs (Shot Type, Camera Move, Duration, Aspect+FPS, Motion Intensity,
Transition, Sequence Role, Time of Day, Weather, Lighting, Style) is already covered by existing
Video/Scene Settings/Camera tabs — no renames are needed on the implemented side.

**Belongs in a separate "Shot List" tab (per-shot rows, not vocabulary):** PROJECT, SCENE ID,
SHOT ID, CHARACTER ID, CHARACTER STATE, ENVIRONMENT ID, SUBJECT MOVEMENT, CONTINUITY. These are
identifiers and per-instance state — they cannot be seeded as a paste-ready dropdown list the way
Camera Move or Duration can; they only make sense as one row per generated shot, matching
VIDEO_DATA_MODEL.md §3's shot-list proposal (`sequence_id`, `shot_index`, `handoff_state`).

**Production-tracking noise for this purpose (Apps Script prompt builder, not a project-tracker):**
SELECTED TOOL, TOOL-ADAPTED PROMPT, STATUS, AUDIO. These describe pipeline/tool-routing state from
the Orchestrator's much larger 13-stage system (through GENERATION/ASSEMBLY/QA/DELIVERY) that this
app does not operate — it stops at PROMPTS, stage 8 of 13. EXPRESSION, ENVIRONMENT MOVEMENT, and
PALETTE are deferred: no verbatim source vocabulary exists in either read source, so seeding them
would mean inventing values, which is out of scope here.

## 3. Proposed seed values (verbatim from Movie Shotline "Shots" vocab tab)

**Composition** (new column): `Centered`, `Off-center`, `Rule of thirds`, `Framed through doorway`,
`Silhouette`, `In motion blur`, `Foreground obstruction`, `Depth of field`

## 4. Migration note

`seedVideoCategories()` (Video.js) is idempotent by header name: it reads row 1, skips any
category already present (`existing.indexOf(category) !== -1`), and only appends new columns at
`nextCol`. Adding Composition requires appending one key to `VIDEO_SEED_CATEGORIES`:

```javascript
'Composition': ['Centered', 'Off-center', 'Rule of thirds', 'Framed through doorway',
  'Silhouette', 'In motion blur', 'Foreground obstruction', 'Depth of field']
```

Re-running the menu item writes only this new column; the six existing categories (Camera Move,
Duration, Aspect Ratio + FPS, Motion Intensity, Transition, Sequence Role) are untouched because
their header strings already match. A separate "Shot List" tab and its 8 identifier/state fields
are out of scope for `seedVideoCategories()` (which seeds vocabulary, not row data) and would need
a new function, e.g. `setupShotListSheet()`, per VIDEO_DATA_MODEL.md §5's migration pattern.
