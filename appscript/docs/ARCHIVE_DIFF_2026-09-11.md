# Archive vs Live Vocabulary Diff — 2026-09-11

Source: ARCHIVE sheet `16CTkMZ7t5dwHFjAjvHQZaikzaCpjtx3t9m0Zq9ipDjk` (11/21/2025) vs LIVE sheet `1Gxj0VfgtkqtTicsjK2_2Gx5sOXK8L3PJtI2-yKjftOE`. Case-insensitive, whitespace-trimmed value comparison. All counts below are measured directly from parsed rows.

| Tab | Category | Live Count (measured) | Archive Count (measured) | Missing-from-Live (measured) | Extra-in-Live (measured) |
|---|---|---|---|---|---|

83 of 83 matched categories were fully identical (excluded from the table above). Total missing-from-live across all tabs/categories: **0** (measured). Total extra-in-live: **0** (measured).

## Notes
- Non-vocabulary tabs skipped for diffing: Main Prompt Builder (narrative content), History/Log (timestamped edit log).
- No categories were found present in only one side's tab (category sets matched 1:1 by name in all 3 common tabs).
- **Shots tab coverage caveat (measured):** the Shots tab's own Quick Navigation summary declares 458 subcategories / 6264 items, but the clearly-tab-labeled `[merged] Shots Categories` block in both exports only contains 69 categories (~1,110-1,123 declared items) ending at "World Landmarks (Real Locations)". Immediately after that point (same line in both files) both exports switch to an unlabeled wide category-per-column reference block that re-lists values already covered under Character (Gender, Hair Color, Hair Type, Facial Hair, Skin Tone, Body Type, Accessories) and Scene Settings (Render Type, Style/Genre, Lighting, Time of Day, Weather Effects, Environment) - confirmed by spot-checking "Environment" against its labeled Scene Settings entry (line 404, declared count 356). No new, uniquely-Shots vocabulary was found in that trailing block; it was excluded from the diff as duplicate/validation-source content, not skipped blindly. The Drive-to-markdown conversion appears to truncate the true breadth of the Shots tab for both files equally, so this diff's Shots result compares the fully-labeled portion only, not all 458 declared Shots subcategories.

Per-tab CSVs of archive-only values (RAW_AI_DATA import format, `Category,Value`) written under `docs/archive_diff/`.
## Live re-check via API (2026-09-12 03:34Z, `?action=archive_diff`, reads raw cells, no export)

| Section | Archive tab | Live tab | Live values | Archive values | Missing from live |
|---|---|---|---|---|---|
| camera | CAMERA | CAMERA | 5,253 | 168 | **0** |
| character | CHARACTER | CHARACTER | 313 | 312 | **0** |
| scene | SCENE | SCENE | 402 | 402 | **0** |

Conclusion: the 11/21/2025 archive contains nothing the live sheet lacks. Nothing to import. The Shots
export limitation above is moot; the raw-cell comparison covers the full tab.

**Correction to the 2026-09-11 dashboard-repair finding:** the live spreadsheet DOES contain tabs named
`CHARACTER`, `SCENE`, `CAMERA` (hidden; the Drive export listed only the visible `Character`,
`Scene Settings`, `Shots`, `Main Prompt Builder`, `History/Log`). The original `CONFIG.SHEETS` names were
therefore correct, and the "tab-name mismatch" was a measurement error caused by trusting the export.
`SHEET_ALIASES` / `getSheetByAnyName` remain as a harmless resolver; the legacy names win first.
