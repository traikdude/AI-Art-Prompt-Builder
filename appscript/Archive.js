/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📜 ARCHIVE RECOVERY — stage values from the 11/21/2025 archive sheet through the
 * existing RAW_AI_DATA → IMPORT_DB → category-sheet pipeline (Idea 6, "The Archaeologist")
 * ═══════════════════════════════════════════════════════════════════════════
 * Source of truth for the diff: docs/ARCHIVE_DIFF_2026-09-11.md in the repo.
 * Nothing here writes to a category tab directly; every value goes through
 * executeImportFromRawData(), so dedupe and column placement stay in one place.
 */

const ARCHIVE_SHEET_ID = '16CTkMZ7t5dwHFjAjvHQZaikzaCpjtx3t9m0Zq9ipDjk'; // 11_21_2025_AI_Art_Categories_Advanced

// logical section → archive tab names to try (first that exists wins)
const ARCHIVE_TABS = {
  CHARACTER: ['Character', 'CHARACTER'],
  SCENE: ['Scene Settings', 'SCENE', 'Scene'],
  CAMERA: ['Shots', 'CAMERA', 'Camera']
};

function stageArchiveCharacter() { return stageAndImportArchive_('CHARACTER'); }
function stageArchiveScene()     { return stageAndImportArchive_('SCENE'); }
function stageArchiveShots()     { return stageAndImportArchive_('CAMERA'); }

/**
 * 🔁 One section: read archive tab → diff against live tab → write RAW_AI_DATA → run the import.
 */
function stageAndImportArchive_(section) {
  const ui = SpreadsheetApp.getUi();
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const archive = SpreadsheetApp.openById(ARCHIVE_SHEET_ID);
    const archiveTab = firstExistingTab_(archive, ARCHIVE_TABS[section]);
    if (!archiveTab) throw new Error('Archive tab for ' + section + ' not found in ' + ARCHIVE_SHEET_ID);

    const liveTab = getSheetByAnyName(ss, CONFIG.SECTIONS[section].dbSheet);
    const liveSet = liveTab ? categoryValueSet_(liveTab) : new Set();
    const rows = archiveMissingRows_(archiveTab, liveSet);

    if (!rows.length) {
      ui.alert('📜 Archive diff', 'Nothing to stage: the live ' + section + ' tab already has every archive value.', ui.ButtonSet.OK);
      return { success: true, staged: 0, imported: 0 };
    }

    const go = ui.alert('📜 Archive diff → ' + section,
      rows.length + ' values from the 11/21/2025 archive are missing from the live tab.\n\n' +
      'Stage them into RAW_AI_DATA and run the import (dedupe applies)?', ui.ButtonSet.YES_NO);
    if (go !== ui.Button.YES) return { success: false, staged: 0, imported: 0, message: 'cancelled' };

    writeRawData_(ss, rows);
    const result = executeImportFromRawData(section);
    ui.alert('📜 Archive import → ' + section, result.message, ui.ButtonSet.OK);
    return { success: result.success, staged: rows.length, imported: result.newRowsAdded || 0 };
  } catch (error) {
    logError('stageAndImportArchive_:' + section, error);
    ui.alert('❌ Archive import failed: ' + error.message);
    return { success: false, message: error.message };
  }
}

function firstExistingTab_(spreadsheet, names) {
  for (let i = 0; i < names.length; i++) {
    const sheet = spreadsheet.getSheetByName(names[i]);
    if (sheet) return sheet;
  }
  return null;
}

/** Set of "category|||value" keys (lower-cased, trimmed) for a category-per-column tab. */
function categoryValueSet_(sheet) {
  const set = new Set();
  const lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return set;
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  for (let c = 0; c < lastCol; c++) {
    const cat = String(headers[c] || '').trim().toLowerCase();
    if (!cat) continue;
    for (let r = 0; r < data.length; r++) {
      const v = String(data[r][c] || '').trim();
      if (v) set.add(cat + '|||' + v.toLowerCase());
    }
  }
  return set;
}

/** [Category, Value] rows present in the archive tab but absent from the live set. */
function archiveMissingRows_(archiveTab, liveSet) {
  const rows = [];
  const seen = new Set();
  const lastRow = archiveTab.getLastRow(), lastCol = archiveTab.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return rows;
  const headers = archiveTab.getRange(1, 1, 1, lastCol).getValues()[0];
  const data = archiveTab.getRange(2, 1, lastRow - 1, lastCol).getValues();
  for (let c = 0; c < lastCol; c++) {
    const category = String(headers[c] || '').trim();
    if (!category || looksNumeric(category)) continue;
    for (let r = 0; r < data.length; r++) {
      const value = String(data[r][c] || '').trim();
      if (!value || looksNumeric(value)) continue;
      const key = category.toLowerCase() + '|||' + value.toLowerCase();
      if (liveSet.has(key) || seen.has(key)) continue;
      seen.add(key);
      rows.push([category, value]);
    }
  }
  return rows;
}

/** Replaces RAW_AI_DATA contents with header + rows (the import reads from row 2). */
function writeRawData_(ss, rows) {
  const raw = getOrCreateSheet(ss, CONFIG.SHEETS.RAW_AI_DATA);
  raw.clearContents();
  raw.getRange(1, 1, 1, 2).setValues([['Category', 'Value']]);
  raw.getRange(2, 1, rows.length, 2).setValues(rows);
}
