/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 AI ART PROMPT BUILDER — COLUMNAR DATABASE REORGANIZATION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This module restructures the workbook into clean, canonical, columnar reference sheets:
 *   - DB_Character (8 columns: Gender, Hair Color, Hair Type, Facial Hair, Skin Tone, Body Type, Accessories, Outfit)
 *   - DB_Scene     (6 columns: Render Type, Style / Genre, Lighting, Time of Day, Weather Effects, Environment)
 *   - DB_Camera    (6 columns: Camera Angle, Composition, Effects, Action, Experimental / Unnatural, Cult / Ritualistic)
 *
 * Legacy source tabs are safely preserved and marked with '[X] ' prefix.
 * Rebuilds the in-sheet PROMPT_BUILDER studio with 100% contiguous data validations.
 */

const CANONICAL_CATEGORIES = {
  CHARACTER: [
    'Gender',
    'Hair Color',
    'Hair Type',
    'Facial Hair',
    'Skin Tone',
    'Body Type',
    'Accessories',
    'Outfit'
  ],
  SCENE: [
    'Render Type',
    'Style / Genre',
    'Lighting',
    'Time of Day',
    'Weather Effects',
    'Environment'
  ],
  CAMERA: [
    'Camera Angle',
    'Composition',
    'Effects',
    'Action',
    'Experimental / Unnatural',
    'Cult / Ritualistic'
  ]
};

/**
 * 🌟 Master migration runner.
 */
function migrateToColumnarDBs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    console.log('🚀 Starting Columnar DB Migration...');

    // 1. Extract clean data for each section
    const charData = extractSectionData_(ss, 'CHARACTER');
    const sceneData = extractSectionData_(ss, 'SCENE');
    const cameraData = extractSectionData_(ss, 'CAMERA');

    // 2. Build or populate the 3 canonical columnar sheets
    const sheetChar = populateColumnarSheet_(ss, 'DB_Character', CANONICAL_CATEGORIES.CHARACTER, charData, '#ec4899');
    const sheetScene = populateColumnarSheet_(ss, 'DB_Scene', CANONICAL_CATEGORIES.SCENE, sceneData, '#10b981');
    const sheetCamera = populateColumnarSheet_(ss, 'DB_Camera', CANONICAL_CATEGORIES.CAMERA, cameraData, '#3b82f6');

    // 3. Mark legacy raw sheets with '[X] ' prefix without deleting any data
    deprecateLegacySheets_(ss);

    // 4. Flush all caches
    flushAllCategoryCaches_();

    // 5. Rebuild the in-sheet Prompt Builder studio from the fresh columnar DBs
    const studioResult = setupPromptBuilderSheet();

    // 6. Pre-seed getDashboardData cache
    getDashboardData(true);

    const summary = {
      ok: true,
      timestamp: new Date().toISOString(),
      characterCategories: Object.keys(charData).length,
      sceneCategories: Object.keys(sceneData).length,
      cameraCategories: Object.keys(cameraData).length,
      totalCategories: Object.keys(charData).length + Object.keys(sceneData).length + Object.keys(cameraData).length,
      studioResult: studioResult
    };

    console.log('✅ Columnar DB Migration completed successfully: ' + JSON.stringify(summary));
    safeToast_(ss, 'Migration Complete! Clean DBs created and Studio rebuilt.', '🎉 Migration Success', 5);
    return summary;

  } catch (error) {
    console.error('❌ Migration failed: ' + error.message, error.stack);
    logError('migrateToColumnarDBs', error);
    return { ok: false, error: error.message, stack: error.stack };
  }
}

/**
 * 📥 Extracts category vocabularies from whichever sheet format exists (vertical 2-col or wide).
 */
function extractSectionData_(ss, sectionKey) {
  const allowed = CANONICAL_CATEGORIES[sectionKey] || [];
  const allowedSet = new Set(allowed);

  // Candidate tab names in order of preference
  let candidates = [];
  if (sectionKey === 'CHARACTER') {
    candidates = ['📄 Character', '[X] 📄 Character', 'Character', 'CHARACTER', '[X] CHARACTER'];
  } else if (sectionKey === 'SCENE') {
    candidates = ['📄 Scene Settings', '[X] 📄 Scene Settings', 'Scene Settings', 'SCENE', '[X] SCENE'];
  } else if (sectionKey === 'CAMERA') {
    candidates = ['📄 Shots', '[X] 📄 Shots', 'Shots', 'CAMERA', '[X] CAMERA'];
  }

  let targetSheet = null;
  for (let i = 0; i < candidates.length; i++) {
    const s = ss.getSheetByName(candidates[i]);
    if (s && s.getLastRow() > 1) {
      targetSheet = s;
      break;
    }
  }

  if (!targetSheet) {
    console.warn('⚠️ No source sheet found for ' + sectionKey + ', using fallback empty sets.');
    const fallback = {};
    allowed.forEach(function(k) { fallback[k] = []; });
    return fallback;
  }

  console.log('📖 Extracting ' + sectionKey + ' from sheet: ' + targetSheet.getName());

  const lastRow = targetSheet.getLastRow();
  const lastCol = targetSheet.getLastColumn();

  // Check if this sheet is formatted as a vertical 2-column list ([Name]|[Count] then [index]|[val])
  const isVertical = (lastCol <= 4 && lastRow > 5);
  const result = {};
  allowed.forEach(function(k) { result[k] = []; });

  if (isVertical) {
    const numRows = Math.min(lastRow, 10000);
    const grid = targetSheet.getRange(1, 1, numRows, Math.min(lastCol, 3)).getValues();
    let curCat = null;

    for (let r = 0; r < grid.length; r++) {
      const v1 = String(grid[r][0] || '').trim();
      const v2 = String(grid[r][1] || '').trim();

      if (v1 && (looksNumeric(v2) || v2 === '')) {
        if (allowedSet.has(v1)) {
          curCat = v1;
        } else {
          curCat = null;
        }
      } else if (curCat && looksNumeric(v1) && v2) {
        if (!result[curCat].includes(v2)) {
          result[curCat].push(v2);
        }
      }
    }
  } else {
    // Wide column layout
    const headers = targetSheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const data = targetSheet.getRange(2, 1, Math.min(lastRow - 1, 2000), lastCol).getValues();

    for (let c = 0; c < headers.length; c++) {
      const h = String(headers[c] || '').trim();
      if (!allowedSet.has(h)) continue;

      const seen = new Set();
      const vals = [];
      for (let r = 0; r < data.length; r++) {
        const cell = String(data[r][c] || '').trim();
        if (!cell || looksNumeric(cell) || cell.startsWith('#') || cell === '0' || seen.has(cell)) continue;
        seen.add(cell);
        vals.push(cell);
      }
      if (vals.length > 0) {
        result[h] = vals;
      }
    }
  }

  // Ensure Gender has Male and Female if extracted
  if (sectionKey === 'CHARACTER' && (!result['Gender'] || result['Gender'].length === 0)) {
    result['Gender'] = ['Male', 'Female'];
  }

  return result;
}

/**
 * 🧱 Populates or creates a clean columnar reference sheet.
 */
function populateColumnarSheet_(ss, sheetName, categoryKeys, dataObj, tabColor) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.setFrozenRows(0);
    sheet.setFrozenColumns(0);
    sheet.clear();
  }

  sheet.setTabColor(tabColor);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(0);

  const numCols = categoryKeys.length;
  let maxRowCount = 1;
  categoryKeys.forEach(function(k) {
    const list = dataObj[k] || [];
    if (list.length > maxRowCount) maxRowCount = list.length;
  });

  // Ensure dimensions
  const currentMaxRows = sheet.getMaxRows();
  if (currentMaxRows < maxRowCount + 10) {
    sheet.insertRowsAfter(currentMaxRows, (maxRowCount + 10) - currentMaxRows);
  }
  const currentMaxCols = sheet.getMaxColumns();
  if (currentMaxCols < numCols) {
    sheet.insertColumnsAfter(currentMaxCols, numCols - currentMaxCols);
  }

  // Row 1: Headers
  sheet.getRange(1, 1, 1, numCols).setValues([categoryKeys])
    .setBackground('#1e293b')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 32);

  // Write values per column
  for (let c = 0; c < numCols; c++) {
    const key = categoryKeys[c];
    const vals = dataObj[key] || [];
    if (vals.length > 0) {
      const colValues = vals.map(function(v) { return [v]; });
      sheet.getRange(2, c + 1, vals.length, 1).setValues(colValues)
        .setFontColor('#0f172a')
        .setFontSize(10)
        .setVerticalAlignment('middle');
    }
    sheet.setColumnWidth(c + 1, 230);
  }

  console.log('✅ Created columnar sheet ' + sheetName + ' with ' + numCols + ' columns.');
  return sheet;
}

/**
 * 🏷️ Safely renames legacy raw/wide sheets to '[X] ...' prefix.
 */
function deprecateLegacySheets_(ss) {
  const legacyNames = [
    '📄 Character',
    '📄 Scene Settings',
    '📄 Shots',
    'CHARACTER',
    'SCENE',
    'CAMERA',
    'Selections Log'
  ];

  legacyNames.forEach(function(oldName) {
    try {
      const sheet = ss.getSheetByName(oldName);
      if (sheet) {
        const newName = '[X] ' + oldName;
        if (!ss.getSheetByName(newName)) {
          sheet.setName(newName);
          sheet.setTabColor('#94a3b8'); // Slate gray
          console.log('🏷️ Renamed legacy sheet "' + oldName + '" → "' + newName + '"');
        }
      }
    } catch (e) {
      console.warn('Note renaming ' + oldName + ': ' + e.message);
    }
  });
}

/**
 * 🏷️ Dedicated function to archive the legacy Selections Log tab.
 */
function archiveSelectionsLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const oldSheet = ss.getSheetByName('Selections Log');
  if (!oldSheet) {
    return { ok: false, message: 'Tab "Selections Log" not found (may already be archived as [X] Selections Log)' };
  }
  const newName = '[X] Selections Log';
  if (ss.getSheetByName(newName)) {
    return { ok: false, message: 'Tab "' + newName + '" already exists' };
  }
  oldSheet.setName(newName);
  oldSheet.setTabColor('#94a3b8');
  console.log('🏷️ Archived legacy log sheet: Selections Log → ' + newName);
  return { ok: true, oldName: 'Selections Log', newName: newName };
}

/**
 * 🧹 Flushes all category caches in CacheService and PropertiesService.
 */
function flushAllCategoryCaches_() {
  try {
    const cache = CacheService.getScriptCache();
    cache.removeAll(['categories_CHARACTER', 'categories_SCENE', 'categories_CAMERA', 'dashboard_selections']);
    const props = PropertiesService.getScriptProperties();
    props.deleteProperty('COMPILED_CATEGORIES_V5');
    console.log('🧹 Flushed all category caches.');
  } catch (e) {
    console.warn('Cache flush note: ' + e.message);
  }
}
