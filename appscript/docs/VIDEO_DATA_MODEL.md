# Video Data Model — PROPOSED (M3)

All content below is a design proposal, not implemented. Vocabulary values marked "seed" are
new and invented for review; values marked "from Shots" are quoted verbatim from the existing
sheet/code and must not be altered when ported.

## 0. Grounding

The 17 motion/shot entries verified in `Main Prompt Builder` (Code map §Video, promptbuilder_code_map.md
lines 92–127), quoted verbatim: `Camera Angle:`, `Motion Techniques:`, `Movement & Locomotion:`,
`Emotional Expression:`, `Extreme Wide Shot:`, `Wide Shot / Long Shot:`, `Medium Shot:`,
`Over-the-Shoulder Shot:`, `Establishing Shot:`, `Aerial Shot:`, `Trunk Shot:`, `Money Shot:`,
`SnorriCam Shot:`, `Zolly Shot / Dolly Zoom:`, `Pivotal Character Shot:`, `Split Diopter Shot:`,
and `Motion Blur:` is the 18th related-but-distinct entry (a post-fx modifier, not a shot/move
itself — kept out of the 17 count, listed under Motion Intensity below). None of these carry
duration, fps, or sequencing today — confirmed absent in Code.js (code map §5).

## 1. PROPOSED "Video" tab — categories (Character/Scene Settings column convention)

| Category | Values (paste-ready, 8–15 each) |
|---|---|
| **Shot Type** (reuse Shots tab, do not duplicate) | `Extreme Wide Shot`, `Wide Shot / Long Shot`, `Medium Shot`, `Over-the-Shoulder Shot`, `Establishing Shot`, `Aerial Shot`, `Trunk Shot`, `Money Shot`, `SnorriCam Shot`, `Zolly Shot / Dolly Zoom`, `Pivotal Character Shot`, `Split Diopter Shot` — all quoted verbatim from Shots/Main Prompt Builder |
| **Camera Move** (seed, new) | Static, Pan Left, Pan Right, Tilt Up, Tilt Down, Dolly In, Dolly Out, Truck Left, Truck Right, Handheld, Crane Up, Orbit/Arc, Zoom In, Zoom Out |
| **Duration** (seed, new) | 2s, 3s, 4s, 5s, 6s, 8s, 10s, 15s, 20s, 30s |
| **Aspect Ratio + FPS** (seed, new — paired per DAILY_AUTOMATION_SCHEDULE plates) | 16:9 @ 24fps, 16:9 @ 30fps, 9:16 @ 24fps, 9:16 @ 30fps, 1:1 @ 24fps, 4:5 @ 30fps, 16:9 @ 60fps, 9:16 @ 60fps |
| **Motion Intensity** (seed, new) | Static/None, Subtle, Moderate, High, Frenetic, Slow Motion, Motion Blur (from Shots, `Motion Blur:`), Freeze Frame |
| **Transition** (seed, new) | Cut, Match Cut, Cross Dissolve, Whip Pan, Push Through, Fade to Black, Fade from Black, J-Cut, L-Cut, Smash Cut |
| **Sequence Role** (seed, new) | Establishing, Action, Reaction, Handoff |

Rationale for the seven: Shot Type stays a pointer into the existing 458-item Shots tab so no
duplication is introduced; the other six are the minimum set a video-capable prompt needs that a
still-image prompt does not (movement, time, frame shape, energy, cut, and position-in-sequence).
PROPOSED — Erik may want Lighting Change or Focus Pull as an eighth column; deferred to avoid
scope creep on M3.

## 2. PROPOSED "video" format for `generateMultiFormatPrompts`

Template (fifth branch alongside narrative/technical/poetic/bulletPoint, Code.js:884–964):

```
[Subject] in [Scene], captured as a [Shot Type] with [Camera Move],
[Duration] at [Aspect]@[FPS], motion intensity: [Motion Intensity],
transitioning via [Transition]. Sequence role: [Sequence Role].
Negative: [Negative]. Seed hint: [Seed Hint].
```

Filled example (real vocabulary — Character/Outfit `Assassin (Hooded cloak, Leather armor,
Throwing knives)`, Scene Settings/Environment `Abandoned Fairy Court`, Shots `Aerial Shot`, plus
proposed video values):

```
Assassin (Hooded cloak, Leather armor, Throwing knives) in Abandoned Fairy Court,
captured as an Aerial Shot with Crane Up, 5s at 16:9@24fps, motion intensity: Moderate,
transitioning via Match Cut. Sequence role: Establishing.
Negative: blurry, low-res, extra limbs. Seed hint: 482017.
```

JSON shape for agent consumers (PROPOSED, mirrors the template 1:1):

```json
{
  "subject": "Assassin (Hooded cloak, Leather armor, Throwing knives)",
  "scene": "Abandoned Fairy Court",
  "shot": "Aerial Shot",
  "camera_move": "Crane Up",
  "duration_s": 5,
  "aspect": "16:9",
  "fps": 24,
  "negative": "blurry, low-res, extra limbs",
  "seed_hint": 482017
}
```

## 3. Scene/shot sequencing (PROPOSED)

A multi-shot request is a **shot list**: one row per shot in a new sheet or an in-memory array,
each row carrying `sequence_id`, `shot_index` (1-based, explicit — never inferred from array
position), `sequence_role`, and a `handoff_state` object: `{carries_subject: bool,
carries_scene: bool, continuity_notes: string}`. Erik's Flow work is referenced by name in this
task's brief as having hit a "consumed future scenes" failure; no specifics of that failure were
found in the read files, so this section proposes a structural safeguard rather than describing
the original bug: each shot row is generated and marked `status: draft` independently, and a shot
may only flip to `status: locked` after its own row's fields are confirmed — no shot list
generation step is allowed to pre-populate or lock a later `shot_index` while resolving an earlier
one. This mirrors the `needs_reconciliation`-must-have-a-terminal-state fix pattern already used
in Morrison1 (per memory: head-of-line block fix, `13369f6`) applied here to shot rows instead of
batch jobs.

## 4. Compatibility table (PROPOSED, unknowns marked, no invented limits)

| Field | Veo (via Flow) | NotebookLM short video | Kling | Runway | Sora | Blender camera rig | DaVinci |
|---|---|---|---|---|---|---|---|
| shot / camera_move | unknown | unknown | unknown | unknown | unknown | consumes directly (rig keyframes) | n/a (editorial, not generative) |
| duration_s | unknown | fixed by product, likely short-form only | unknown | unknown | unknown | consumes directly | consumes as timeline duration |
| aspect + fps | unknown | 16:9 and 9:16 confirmed in DAILY_AUTOMATION_SCHEDULE.md | unknown | unknown | unknown | consumes directly | consumes directly |
| motion_intensity | unknown | unknown | unknown | unknown | unknown | n/a (motion is keyframed, not a scalar) | n/a |
| transition | n/a (single-shot output) | unknown | unknown | unknown | unknown | n/a | consumes directly (edit points) |
| negative / seed_hint | unknown | unknown | unknown | unknown | unknown | n/a | n/a |

Only the 16:9/9:16 plate requirement for NotebookLM's video path is directly sourced
(DAILY_AUTOMATION_SCHEDULE.md, Fail-Closed Verification tenet). Every other cell is marked
unknown rather than guessed, per the no-fabrication instruction.

## 5. Migration steps (PROPOSED — via Apps Script, not by hand)

1. Add a `VIDEO` sheet key to `CONFIG.SHEETS` in Code.js (alongside existing `CHARACTER`/`SCENE`/`CAMERA`).
2. Extend the `setupCoreCategorySheets`-pattern function (the one that seeds Character/Scene
   Settings today) with a `seedVideoCategories()` case: writes the seven category headers from
   §1 as row-1 headers, item counts in row 2, seed values below — same layout as Character/Scene.
3. Run it once from the `🎨 AI Prompt Builder` menu (new item: "Setup Video Category Sheet"),
   mirroring the existing "Setup Import Sheets" menu entry (Code.js:229–248).
4. `clasp push`, verify via `getSectionCategories('VIDEO')` returns the seven categories, tag the
   commit per M3.
5. Wire the `video` format into `generateMultiFormatPrompts` (§2) in the same push; do not ship
   the sheet change and the format change separately, since M3's Definition of Done couples them.
