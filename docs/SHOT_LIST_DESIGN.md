# Shot List Tab Design — PROPOSED (2026-09-11)

Everything below is PROPOSED. Nothing here is implemented, pushed, or committed. This designs
the per-shot **row** tab that `docs/VIDEO_SCHEMA_DECISION_2026-09-11.md` deferred out of the
vocabulary-only `Video` tab, matching the row model already sketched in
`docs/VIDEO_DATA_MODEL.md` §3 (`sequence_id`, `shot_index`, `sequence_role`, `handoff_state`).

## 1. Column list (in order)

| # | Column | Type | Req? | Allowed values |
|---|---|---|---|---|
| 1 | `sequence_id` | string | required | free text (groups rows into one shot list) |
| 2 | `shot_index` | integer | required | 1-based, explicit, never inferred from row position |
| 3 | `project` | string | optional | free text |
| 4 | `scene_id` | string | optional | free text (points at a scene grouping; no existing Scene ID tab, so free text until one exists) |
| 5 | `shot_id` | string | required | free text, unique within `sequence_id` |
| 6 | `shot_type` | string | required | data validation → **Shots** tab (Camera Angle list, e.g. `Establishing Shot`, `Aerial Shot`) |
| 7 | `camera_move` | string | required | data validation → **Video** tab, `Camera Move` column |
| 8 | `duration_s` | string | required | data validation → **Video** tab, `Duration` column |
| 9 | `aspect_fps` | string | required | data validation → **Video** tab, `Aspect Ratio + FPS` column |
| 10 | `motion_intensity` | string | optional | data validation → **Video** tab, `Motion Intensity` column |
| 11 | `transition` | string | optional | data validation → **Video** tab, `Transition` column |
| 12 | `sequence_role` | string | required | data validation → **Video** tab, `Sequence Role` column |
| 13 | `composition` | string | optional | data validation → **Video** tab, `Composition` column |
| 14 | `character_id` | string | optional | data validation → **Character** tab (row key/name column) |
| 15 | `character_state` | string | optional | free text (no existing vocab; per SCHEMA_DECISION #5, invented state is out of scope for vocab, but per-instance text is fine here) |
| 16 | `environment_id` | string | optional | data validation → **Scene Settings** tab (row key/name column) |
| 17 | `subject_movement` | string | optional | free text (SCHEMA_DECISION #16: shot-list field, not vocabulary) |
| 18 | `negative` | string | optional | free text |
| 19 | `seed_hint` | string | optional | free text/number |
| 20 | `carries_subject` | boolean | required | `TRUE` / `FALSE` (data validation checkbox) |
| 21 | `carries_scene` | boolean | required | `TRUE` / `FALSE` (data validation checkbox) |
| 22 | `continuity_notes` | string | optional | free text (SCHEMA_DECISION #23 CONTINUITY, scoped to shot-list per its own recommendation) |
| 23 | `status` | string | required | data validation, fixed list: `draft`, `locked`, `generated`, `delivered` |
| 24 | `created_at` | datetime | required | ISO 8601 string, set on row creation, never edited by hand |
| 25 | `locked_at` | datetime | optional | ISO 8601 string, set only by the lock action |

Columns 20–22 are the `handoff_state` object from VIDEO_DATA_MODEL.md §3 flattened into sheet
cells (`{carries_subject, carries_scene, continuity_notes}`).

## 2. Row lifecycle

```
draft → locked → generated → delivered
```

- **draft** — default status on row creation. Any field may still change.
- **locked** — the row's fields are confirmed final; `locked_at` is stamped. Locking is the only
  transition a downstream shot may depend on.
- **generated** — the video for this shot has been produced from the locked fields.
- **delivered** — the generated asset has been handed off / assembled downstream.

**Anti-"consumed future scenes" guard:** a shot at `shot_index = N` may only *read* the
`handoff_state` (`carries_subject`, `carries_scene`, `continuity_notes`) of shot `N-1`, and only
once shot `N-1`'s `status` is `locked` or later. No process may read ahead to `shot_index > N-1`,
and no process may pre-populate or auto-lock a later `shot_index` while an earlier one is still
`draft`. This mirrors the `needs_reconciliation` terminal-state fix pattern already used in
Morrison1 (per project memory: head-of-line block fix `13369f6`), applied to shot rows instead of
batch jobs.

## 3. API surface (PROPOSED)

### `GET ?action=shotlist&sequence_id=…`

Returns all rows for `sequence_id`, sorted by `shot_index` ascending, each with its fields plus a
`video` object in the **same shape as `generateVideoFormat().json`** so Morrison1's
`previz_preflight.py` can consume a whole sequence without a separate schema:

```json
{
  "success": true,
  "sequence_id": "seq-fox-01",
  "shots": [
    {
      "shot_id": "shot-01",
      "shot_index": 1,
      "status": "locked",
      "sequence_role": "Establishing",
      "handoff_state": {"carries_subject": true, "carries_scene": true, "continuity_notes": "Fox enters frame left"},
      "video": {
        "subject": "Red Fox (Winter coat, Alert posture)",
        "scene": "Snow-covered Pine Forest",
        "shot": "Establishing Shot",
        "camera_move": "Crane Up",
        "duration_s": 5,
        "aspect": "16:9",
        "fps": 24,
        "motion_intensity": "Subtle",
        "transition": "Cut",
        "sequence_role": "Establishing",
        "composition": "Rule of thirds",
        "negative": "blurry, low-res",
        "seed_hint": null
      }
    }
  ]
}
```

Unlocked (`draft`) shots at `shot_index > requested cursor` are never withheld by this endpoint
itself — the read-only guard is enforced by the *consumer* only reading up through the highest
`locked` shot, per §2; the endpoint always returns the true current state of every row so a
caller can display draft rows if it wants to.

### `POST {action:'shotlist_lock', sequence_id, shot_index, token}`

Token-gated the same way `Api.js`'s existing `apiCheckToken_(req.token)` gates other POSTs.
Flips exactly one row's `status` from `draft` → `locked`, stamps `locked_at`, and refuses (with
`success:false`) if the row is already `locked`/`generated`/`delivered`, or if any row with a
smaller `shot_index` in the same `sequence_id` is still `draft` (enforces sequential locking —
no skipping ahead).

## 4. Apps Script migration sketch

```javascript
const SHOTLIST_SHEET_NAME = 'Shot List';
const SHOTLIST_HEADERS = [
  'sequence_id', 'shot_index', 'project', 'scene_id', 'shot_id', 'shot_type', 'camera_move',
  'duration_s', 'aspect_fps', 'motion_intensity', 'transition', 'sequence_role', 'composition',
  'character_id', 'character_state', 'environment_id', 'subject_movement', 'negative',
  'seed_hint', 'carries_subject', 'carries_scene', 'continuity_notes', 'status', 'created_at',
  'locked_at'
];

/**
 * 🎬 Creates the Shot List tab with header row + data validations. Idempotent: if the header
 * row already matches SHOTLIST_HEADERS, only (re)applies validations and exits.
 */
function setupShotListSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, SHOTLIST_SHEET_NAME);
    const lastCol = sheet.getLastColumn();
    const existing = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    const headersMatch = existing.length === SHOTLIST_HEADERS.length &&
      existing.every(function (h, i) { return h === SHOTLIST_HEADERS[i]; });
    if (!headersMatch) {
      sheet.getRange(1, 1, 1, SHOTLIST_HEADERS.length).setValues([SHOTLIST_HEADERS])
        .setFontWeight('bold').setBackground('#673AB7').setFontColor('white');
    }
    const videoSheet = ss.getSheetByName(VIDEO_SHEET_NAME);
    const shotsSheet = ss.getSheetByName('Shots');
    applyShotListValidations_(sheet, videoSheet, shotsSheet);
    return { success: true, message: '✅ Shot List tab ready.' };
  } catch (error) {
    logError('setupShotListSheet', error);
    return { success: false, message: error.message };
  }
}

/** Applies dropdown/checkbox validations to Shot List data rows 2..500 (extend as needed). */
function applyShotListValidations_(sheet, videoSheet, shotsSheet) {
  const ROWS = 500;
  const dv = function (col, sourceRange) {
    const rule = SpreadsheetApp.newDataValidation().requireValueInRange(sourceRange, true)
      .setAllowInvalid(false).build();
    sheet.getRange(2, col, ROWS, 1).setDataValidation(rule);
  };
  if (shotsSheet) dv(6, shotsSheet.getRange('A2:A' + shotsSheet.getLastRow()));  // shot_type
  if (videoSheet) {
    dv(7, videoSheet.getRange('B2:B11'));   // camera_move
    dv(8, videoSheet.getRange('C2:C11'));   // duration_s
    dv(9, videoSheet.getRange('D2:D9'));    // aspect_fps
    dv(10, videoSheet.getRange('E2:E9'));   // motion_intensity
    dv(11, videoSheet.getRange('F2:F11'));  // transition
    dv(12, videoSheet.getRange('G2:G5'));   // sequence_role
    dv(13, videoSheet.getRange('H2:H9'));   // composition
  }
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['draft', 'locked', 'generated', 'delivered'], true)
    .setAllowInvalid(false).build();
  sheet.getRange(2, 23, ROWS, 1).setDataValidation(statusRule);
  const boolRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange(2, 20, ROWS, 2).setDataValidation(boolRule);
}

/**
 * 📖 Reads all Shot List rows for one sequence_id, sorted by shot_index ascending, mapped to
 * {..., handoff_state, video} shape for API consumption (see §3 above).
 */
function getShotList(sequenceId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHOTLIST_SHEET_NAME);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1)
    .map(function (r) {
      const o = {};
      SHOTLIST_HEADERS.forEach(function (h, i) { o[h] = r[i]; });
      return o;
    })
    .filter(function (o) { return o.sequence_id === sequenceId; })
    .sort(function (a, b) { return a.shot_index - b.shot_index; });
  return rows.map(function (o) {
    return Object.assign({}, o, {
      handoff_state: {
        carries_subject: !!o.carries_subject,
        carries_scene: !!o.carries_scene,
        continuity_notes: o.continuity_notes || ''
      },
      video: {
        subject: null, scene: null, shot: o.shot_type, camera_move: o.camera_move,
        duration_s: parseInt(String(o.duration_s).replace(/[^0-9]/g, ''), 10) || null,
        aspect: String(o.aspect_fps).split('@')[0].trim() || null,
        fps: parseInt((String(o.aspect_fps).split('@')[1] || '').replace(/[^0-9]/g, ''), 10) || null,
        motion_intensity: o.motion_intensity, transition: o.transition,
        sequence_role: o.sequence_role, composition: o.composition,
        negative: o.negative, seed_hint: o.seed_hint
      }
    });
  });
}
```

`subject`/`scene` in the returned `video` object are left `null` here because `character_id` /
`environment_id` resolution to full vocabulary strings is a separate lookup (Character/Scene
Settings tabs) out of scope for this reader's first cut; PROPOSED follow-up would join those
tabs the same way `generateVideoFormat` joins `character`/`scene` selections today.

## 5. Filled example sequence (3 rows, real vocabulary)

| sequence_id | shot_index | shot_id | shot_type | camera_move | duration_s | aspect_fps | motion_intensity | transition | sequence_role | composition | subject_movement | carries_subject | carries_scene | continuity_notes | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| seq-fox-01 | 1 | shot-01 | Establishing Shot | Crane Up | 5s | 16:9 @ 24fps | Subtle | Cut | Establishing | Rule of thirds | Fox stands still, ears up | TRUE | TRUE | Fox enters frame left, snow falling | locked |
| seq-fox-01 | 2 | shot-02 | Medium Shot | Dolly In | 3s | 16:9 @ 24fps | Moderate | Match Cut | Action | Centered | Fox lunges forward toward prey | TRUE | TRUE | Continues fox from shot-01, same lighting | draft |
| seq-fox-01 | 3 | shot-03 | Over-the-Shoulder Shot | Handheld | 4s | 16:9 @ 24fps | High | Whip Pan | Reaction | Off-center | Prey scatters, fox pivots | FALSE | TRUE | Same forest clearing as prior two shots | draft |

Shot 3 may not read shot 2's `handoff_state` yet because shot 2 is still `draft` — per the §2
guard, a downstream consumer can only rely on shot 1's locked handoff at this point in the
sequence's lifecycle.
