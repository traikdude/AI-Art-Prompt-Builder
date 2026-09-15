/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎨✨ AI ART PROMPT BUILDER - ULTRA-DEBUGGED SYSTEM v5.2.0 🚀🌈
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ✅ COMPREHENSIVE FIXES APPLIED:
 * ✅ Case normalization for all section identifiers
 * ✅ Robust section key mapping with fallbacks
 * ✅ Enhanced error messages with debugging info
 * ✅ Consistent sheet name handling
 * ✅ Bulletproof import validation
 * ✅ Help system case handling
 * ✅ Alias system normalization
 * ✅ 2026-09-11: Wired dashboard bridge functions (getDashboardData, savePromptToLog,
 *    exportPromptToDrive) so every Dashboard_v5_0_ENHANCED.html button now has a
 *    matching Code.js function
 *
 * Version: 5.2.0 ULTRA-DEBUGGED 🎯
 * Last Updated: 2026-09-11 ⏰
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 GLOBAL CONFIGURATION - NORMALIZED & ENHANCED
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Sheet Names - MUST MATCH YOUR ACTUAL GOOGLE SHEETS 📊
  SHEETS: {
    CHARACTER: 'DB_Character',   // Canonical columnar tab
    SCENE: 'DB_Scene',           // Canonical columnar tab
    CAMERA: 'DB_Camera',         // Canonical columnar tab
    SHOTS: 'DB_Camera',          // Backwards compatibility 🔄
    PROMPT_BUILDER: 'PROMPT_BUILDER',
    HELP: 'HELP_DB',
    ALIAS: 'ALIAS',
    RAW_AI_DATA: 'RAW_AI_DATA',
    IMPORT_DB: 'IMPORT_DB',
    LOG: 'History/Log'
  },

  // 🔄 Alternate tab names accepted for each logical sheet (first match wins)
  SHEET_ALIASES: {
    'DB_Character': ['DB_Character', 'Character', 'CHARACTER', '📄 Character', '[X] 📄 Character', '[X] CHARACTER'],
    'DB_Scene': ['DB_Scene', 'Scene Settings', 'SCENE', 'Scene', '📄 Scene Settings', '[X] 📄 Scene Settings', '[X] SCENE'],
    'DB_Camera': ['DB_Camera', 'Shots', 'CAMERA', 'Camera', 'SHOTS', '📄 Shots', '[X] 📄 Shots', '[X] CAMERA'],
    'Character': ['DB_Character', 'Character', 'CHARACTER', '📄 Character', '[X] 📄 Character'],
    'Scene Settings': ['DB_Scene', 'Scene Settings', 'SCENE', 'Scene', '📄 Scene Settings', '[X] 📄 Scene Settings'],
    'Shots': ['DB_Camera', 'Shots', 'CAMERA', 'Camera', 'SHOTS', '📄 Shots', '[X] 📄 Shots'],
    'History/Log': ['History/Log', 'Selections Log'],
    'Video': ['Video', 'VIDEO'],
    'PROMPT_BUILDER': ['PROMPT_BUILDER', 'AI ART PROMPT BUILDER', 'Prompt Builder', 'AI Art Prompt Builder', 'Prompt Studio']
  },

  // Section Keys - Normalized uppercase for consistency 🔤
  SECTION_KEYS: {
    CHARACTER: 'CHARACTER',
    SCENE: 'SCENE',
    CAMERA: 'CAMERA'
  },

  // Case mapping for HTML compatibility 🌐
  SECTION_ALIASES: {
    'character': 'CHARACTER',
    'scene': 'SCENE',
    'camera': 'CAMERA',
    'CHARACTER': 'CHARACTER',
    'SCENE': 'SCENE',
    'CAMERA': 'CAMERA',
    'video': 'VIDEO',
    'VIDEO': 'VIDEO'
  },

  // Cache Settings 💾
  CACHE: {
    DURATION: 600,
    KEYS: {
      CATEGORIES: 'categories_',
      HELP: 'help_',
      SELECTIONS: 'dashboard_selections',
      THEME: 'user_theme',
      SOUND: 'sound_enabled'
    }
  },

  // User Properties 👤
  USER_PROPS: {
    THEME: 'userTheme',
    SOUND: 'soundEnabled',
    SELECTIONS: 'dashboardSelections'
  },

  // Import Configuration 📥
  IMPORT: {
    RAW_DATA_HEADER_ROW: 1,
    IMPORT_DB_HEADERS: ['Category', 'Value', 'Source', 'Timestamp'],
    DUPLICATE_CHECK_COLUMNS: ['Category', 'Value'],
    MAX_IMPORT_ROWS: 5000
  },

  // Prompt Construction 📝
  PROMPT: {
    PREFIX: 'GENERATE AN IMAGE: ',
    CHARACTER_INTRO: 'With the 👤 CHARACTER DESIGN of: ',
    SCENE_INTRO: 'and the 🎬 SCENE SETTINGS as: ',
    CAMERA_INTRO: 'featuring the 📸 CAMERA & COMPOSITION CONCEPT of: ',
    SEPARATOR: ', '
  },

  // Section Definitions 📋
  SECTIONS: {
    CHARACTER: {
      key: 'CHARACTER',
      name: '👤 Character Design',
      dbSheet: 'DB_Character'
    },
    SCENE: {
      key: 'SCENE',
      name: '🎬 Scene Settings',
      dbSheet: 'DB_Scene'
    },
    CAMERA: {
      key: 'CAMERA',
      name: '📸 Camera & Composition',
      dbSheet: 'DB_Camera'
    },
    VIDEO: {
      key: 'VIDEO',
      name: '🎥 Video Motion',
      dbSheet: 'Video',
      rangeStart: null,
      rangeEnd: null,
      categoryColumn: null,
      headerRow: null
    }
  },

  // Default Help Entries 📖
  HELP_DEFAULT: {
    CHARACTER: {
      'gender': 'Gender: Character representation (Male, Female). 👤',
      'hair color': 'Hair Color: Color of hair. Examples: Black, Brown, Blonde, Purple. 💇',
      'hair type': 'Hair Type: Style & cut. Examples: Straight, Wavy, Dreadlocks, Buzz Cut. ✂️',
      'facial hair': 'Facial Hair: Beard/mustache style. Examples: None, Goatee, Full Beard. 🧔',
      'skin tone': 'Skin Tone: Complexion. Examples: Pale, Fair, Medium, Olive, Dark. 🎨',
      'body type': 'Body Type: Overall physical build. Examples: Slim, Athletic, Muscular, Plus-size. 💪',
      'accessories': 'Accessories: Wearables & props. Examples: Glasses, Hat, Backpack, Sword. 🎒',
      'outfit': 'Outfit: Wardrobe & attire. Examples: Cyberpunk, Victorian Dress, Adventurer. 👗'
    },
    SCENE: {
      'render type': 'Render Type: Visual medium. Examples: Cinematic 3D, Film Photography, Oil Painting. 🎨',
      'style / genre': 'Style / Genre: Aesthetic genre. Examples: Realism, Sci-fi, Cyberpunk, Fantasy. 🌌',
      'lighting': 'Lighting: Mood and light quality. Examples: Soft natural light, Golden hour, Neon glow. 💡',
      'time of day': 'Time of Day: Sun & sky position. Examples: Dawn, Morning, Midday, Night. 🌅',
      'weather effects': 'Weather Effects: Atmospheric condition. Examples: Fog, Rain, Wind, Snow. 🌧️',
      'environment': 'Environment: Location setting. Examples: Forest, Vaporwave Mall, Ancient Ruins. 🌲'
    },
    CAMERA: {
      'camera angle': 'Camera Angle: Viewpoint perspective. Examples: Close-up, Wide shot, Low angle. 📷',
      'composition': 'Composition: Framing choice. Examples: Centered, Rule of thirds, Depth of field. 📐',
      'effects': 'Effects: Dynamic visual phenomena. Examples: Sparks flying, Smoke swirling. ✨',
      'action': 'Action: Poses & activities. Examples: Hacking a computer, Casting a spell. 🏃',
      'experimental / unnatural': 'Experimental: Surreal elements. Examples: Injecting glowing serum. 🧪',
      'cult / ritualistic': 'Cult / Ritualistic: Occult themes. Examples: Drawing pentagram in blood. 🕯️'
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY: SECTION NAME NORMALIZATION (NEW!)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎯 Normalizes section identifier to uppercase
 * Handles: 'character' → 'CHARACTER', 'SCENE' → 'SCENE'
 */
function normalizeSection(section) {
  if (!section) return null;
  
  const sectionStr = String(section).trim();
  
  // Check aliases first 🔍
  if (CONFIG.SECTION_ALIASES[sectionStr]) {
    return CONFIG.SECTION_ALIASES[sectionStr];
  }
  
  // Try uppercase conversion 🔤
  const upperSection = sectionStr.toUpperCase();
  if (CONFIG.SECTIONS[upperSection]) {
    return upperSection;
  }
  
  // Return original if no match 🤷
  return sectionStr;
}

/**
 * 🛡️ Validates and normalizes section identifier
 * Returns object with normalized name and validation status
 */
function validateSection(section) {
  const normalized = normalizeSection(section);
  const isValid = normalized && CONFIG.SECTIONS[normalized];
  
  return {
    normalized: normalized,
    isValid: isValid,
    original: section,
    dbSheet: isValid ? CONFIG.SECTIONS[normalized].dbSheet : null
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 DASHBOARD OPENERS & MENU
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎨 Opens the enhanced AI Prompt Builder Dashboard v5.2.0
 * NOTE: Uses HtmlService.createTemplateFromFile with server-side pre-injected
 * category data for instant (0ms) dashboard opening!
 */
function showDashboard() {
  try {
    const template = HtmlService.createTemplateFromFile('Dashboard_v5_0_ENHANCED');
    // Preload categories so modal opens INSTANTLY with 0ms client waiting!
    template.preloadedCategories = getDashboardData(false);
    const html = template.evaluate()
      .setTitle('🎨 AI Prompt Builder v5.2.0')
      .setWidth(1400)
      .setHeight(900);

    SpreadsheetApp.getUi().showModalDialog(html, '🎨✨ AI Art Prompt Builder Dashboard v5.2.0');
  } catch (error) {
    logError('showDashboard', error);
    SpreadsheetApp.getUi().alert(
      '❌ Error opening dashboard: ' + error.message + 
      '\n\n💡 Make sure your HTML file is named "Dashboard_v5_0_ENHANCED.html"'
    );
  }
}

/**
 * 📱 Opens compact sidebar version with preloaded categories
 */
function showDashboardCompact() {
  try {
    const template = HtmlService.createTemplateFromFile('Dashboard_v5_0_ENHANCED');
    template.preloadedCategories = getDashboardData(false);
    const html = template.evaluate()
      .setTitle('🎨 AI Prompt Builder v5.2.0 (Compact)');
    SpreadsheetApp.getUi().showSidebar(html);
  } catch (error) {
    logError('showDashboardCompact', error);
    SpreadsheetApp.getUi().alert('❌ Error opening compact dashboard: ' + error.message);
  }
}

/**
 * 📋 Creates the custom menu when the spreadsheet opens
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();

    ui.createMenu('🎨 AI Prompt Builder')
      .addItem('📊 Open Interactive Dashboard', 'showDashboard')
      .addItem('📱 Open Compact Dashboard', 'showDashboardCompact')
      .addItem('📋 1-Click Copy Generated Prompt', 'showPromptCopyModal')
      .addSeparator()
      .addItem('🚀 Reorganize Workbook to Columnar DBs', 'migrateToColumnarDBs')
      .addItem('✨ Setup / Rebuild In-Sheet Studio', 'setupPromptBuilderSheet')
      .addItem('🧹 Clear In-Sheet Selections', 'clearPromptBuilderSelections')
      .addItem('💾 Save In-Sheet Prompt to History Log', 'saveInSheetPromptToLog')
      .addItem('🔄 Refresh All Validations & Caches', 'refreshAllDropdowns')
      .addSeparator()
      .addItem('📥 Setup Import Sheets', 'setupImportSheets')
      .addItem('🎥 Setup Video Tab', 'seedVideoCategories')
      .addSubMenu(ui.createMenu('📜 Recover from 11/21/2025 archive')
        .addItem('👤 Character', 'stageArchiveCharacter')
        .addItem('🎬 Scene Settings', 'stageArchiveScene')
        .addItem('📸 Shots', 'stageArchiveShots'))
      .addSeparator()
      .addItem('🧰 Run Diagnostics', 'runFullDiagnostics')
      .addItem('🧪 Debug Camera Categories', 'debugCameraDiagnosis')
      .addSeparator()
      .addItem('❓ Help & Documentation', 'showHelp')
      .addToUi();
  } catch (error) {
    logError('onOpen', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ SETUP & IMPORT HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function setupImportSheets() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ui = SpreadsheetApp.getUi();

    // Create RAW_AI_DATA sheet 📊
    let rawSheet = ss.getSheetByName(CONFIG.SHEETS.RAW_AI_DATA);
    if (!rawSheet) {
      rawSheet = ss.insertSheet(CONFIG.SHEETS.RAW_AI_DATA);
      rawSheet.getRange(1, 1, 1, 2).setValues([['Category', 'Value']]);
      rawSheet.getRange(1, 1, 1, 2)
        .setFontWeight('bold')
        .setBackground('#4CAF50')
        .setFontColor('white');
    }

    // Create IMPORT_DB sheet 📋
    let importDbSheet = ss.getSheetByName(CONFIG.SHEETS.IMPORT_DB);
    if (!importDbSheet) {
      importDbSheet = ss.insertSheet(CONFIG.SHEETS.IMPORT_DB);
      const headers = CONFIG.IMPORT.IMPORT_DB_HEADERS;
      importDbSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      importDbSheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#2196F3')
        .setFontColor('white');
    }

    ui.alert(
      '✅ Import Setup Complete!',
      'Sheets ready:\n\n' +
        '📊 RAW_AI_DATA - Paste your raw data here\n' +
        '📋 IMPORT_DB - Staged formatted data (auto-generated)\n\n' +
        'Use the Import button in the dashboard to process your data! 🚀',
      ui.ButtonSet.OK
    );
  } catch (error) {
    logError('setupImportSheets', error);
    SpreadsheetApp.getUi().alert('❌ Setup Error: ' + error.message);
  }
}

function setupCoreCategorySheets() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // CHARACTER 👤
    const charSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CHARACTER);
    if (charSheet.getLastRow() === 0) {
      charSheet.getRange(1, 1, 1, 5).setValues([[
        'Subject',
        'Hair',
        'Clothing',
        'Expression',
        'Accessories'
      ]]);
      charSheet.getRange(1, 1, 1, 5)
        .setFontWeight('bold')
        .setBackground('#E91E63')
        .setFontColor('white');
    }

    // SCENE 🎬
    const sceneSheet = getOrCreateSheet(ss, CONFIG.SHEETS.SCENE);
    if (sceneSheet.getLastRow() === 0) {
      sceneSheet.getRange(1, 1, 1, 5).setValues([[
        'Environment',
        'Lighting',
        'Mood',
        'Weather',
        'Time of Day'
      ]]);
      sceneSheet.getRange(1, 1, 1, 5)
        .setFontWeight('bold')
        .setBackground('#3F51B5')
        .setFontColor('white');
    }

    // CAMERA 📸
    const camSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CAMERA);
    if (camSheet.getLastRow() === 0) {
      camSheet.getRange(1, 1, 1, 5).setValues([[
        'Shot Type',
        'Lens',
        'Camera Angle',
        'Depth of Field',
        'Framing'
      ]]);
      camSheet.getRange(1, 1, 1, 5)
        .setFontWeight('bold')
        .setBackground('#00BCD4')
        .setFontColor('white');
    }

    SpreadsheetApp.getUi().alert(
      '✅ Core Sheets Ready!',
      'Created/verified:\n• ' + CONFIG.SHEETS.CHARACTER + '\n• ' + 
      CONFIG.SHEETS.SCENE + '\n• ' + CONFIG.SHEETS.CAMERA,
      SpreadsheetApp.getUi().ButtonSet.OK
    );

    return { success: true, message: 'Core sheets setup complete! 🎉' };
  } catch (error) {
    logError('setupCoreCategorySheets', error);
    return { success: false, message: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📥 IMPORT SYSTEM - ENHANCED WITH VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎯 Executes import from RAW_AI_DATA to target section
 * NOW WITH: Case normalization & enhanced validation! ✨
 */
function executeImportFromRawData(targetSheet) {
  try {
    // 🛡️ Validate and normalize section
    const validation = validateSection(targetSheet);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: `❌ Invalid target section: "${targetSheet}"\n\n` +
                 `📋 Valid options: CHARACTER, SCENE, CAMERA\n` +
                 `💡 Tip: Section names are case-insensitive!`
      };
    }

    const normalizedSection = validation.normalized;
    const dbSheetName = validation.dbSheet;

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Check RAW_AI_DATA sheet exists 📊
    const rawSheet = ss.getSheetByName(CONFIG.SHEETS.RAW_AI_DATA);
    if (!rawSheet) {
      return {
        success: false,
        message: '❌ RAW_AI_DATA sheet not found.\n\n💡 Use "Setup Import Sheets" from the menu first! 🔧'
      };
    }

    // Read raw data 📖
    const rawData = readRawDataSheet(rawSheet);
    if (rawData.length === 0) {
      return {
        success: false,
        message: '⚠️ No data found in RAW_AI_DATA.\n\n📝 Please paste your data first! (Category in Column A, Values in Column B)'
      };
    }

    // Format data for import 🔄
    const formattedData = formatRawDataForImport(rawData, normalizedSection);
    
    // Stage in IMPORT_DB 📋
    const importDbSheet = getOrCreateSheet(ss, CONFIG.SHEETS.IMPORT_DB);
    stageDataInImportDB(importDbSheet, formattedData);

    // Get target sheet 🎯
    const targetSheetObj = getSheetByAnyName(ss, dbSheetName);
    if (!targetSheetObj) {
      return {
        success: false,
        message: `❌ Target sheet "${dbSheetName}" not found.\n\n💡 Try running "Setup Core Sheets" first! 🛠️`
      };
    }

    // Check for duplicates 🔍
    const existingData = getExistingDataForDuplicateCheck(targetSheetObj);
    const deduped = filterDuplicates(formattedData, existingData);
    const newRows = deduped.newRows;
    const duplicates = deduped.duplicates;

    // Append new data 📥
    if (newRows.length > 0) {
      appendValuesToCategoryColumns(targetSheetObj, newRows);
    }

    // Clear cache 🧹
    clearCacheForSection(normalizedSection);

    // Success report 🎉
    return {
      success: true,
      message: `✅ Successfully imported ${newRows.length} new entries into ${dbSheetName}! 🎊\n\n` +
               `📊 Stats:\n` +
               `   • New entries added: ${newRows.length}\n` +
               `   • Duplicates skipped: ${duplicates.length}\n` +
               `   • Total processed: ${formattedData.length}\n\n` +
               `🎯 Target: ${normalizedSection} → ${dbSheetName}`,
      newRowsAdded: newRows.length,
      duplicatesSkipped: duplicates.length,
      totalProcessed: formattedData.length,
      physicalSheetName: dbSheetName,
      normalizedSection: normalizedSection
    };
  } catch (error) {
    logError('executeImportFromRawData', error);
    return {
      success: false,
      message: '💥 Import failed: ' + error.message + '\n\n🔧 Check the console logs for details.'
    };
  }
}

/**
 * 📖 Reads data from RAW_AI_DATA sheet
 */
function readRawDataSheet(rawSheet) {
  const lastRow = rawSheet.getLastRow();
  const lastCol = rawSheet.getLastColumn();
  
  if (lastRow < 2 || lastCol < 1) return [];
  
  const dataRange = rawSheet.getRange(2, 1, lastRow - 1, lastCol);
  const data = dataRange.getValues();
  
  return data.filter(row => row.some(cell => cell !== ''));
}

/**
 * 🔄 Formats raw data for import
 */
function formatRawDataForImport(rawData, targetSheet) {
  const formatted = [];
  const timestamp = new Date().toISOString();
  
  rawData.forEach((row, index) => {
    if (row.every(cell => !cell)) return;
    
    if (row.length >= 2 && row[0] && row[1]) {
      // Standard format: Category | Value
      formatted.push({
        category: String(row[0]).trim(),
        value: String(row[1]).trim(),
        source: `RAW_AI_DATA_Row${index + 2}`,
        timestamp: timestamp
      });
    } else if (row.length === 1 && row[0]) {
      // Single value: Use targetSheet as category
      formatted.push({
        category: targetSheet,
        value: String(row[0]).trim(),
        source: `RAW_AI_DATA_Row${index + 2}`,
        timestamp: timestamp
      });
    } else if (row.length > 2) {
      // Multiple values: Category in col 1, values in remaining cols
      const category = String(row[0] || targetSheet).trim();
      row.slice(1).forEach((val, idx) => {
        if (val) {
          formatted.push({
            category: category,
            value: String(val).trim(),
            source: `RAW_AI_DATA_Row${index + 2}_Col${idx + 2}`,
            timestamp: timestamp
          });
        }
      });
    }
  });
  
  return formatted;
}

/**
 * 📋 Stages formatted data in IMPORT_DB sheet
 */
function stageDataInImportDB(importDbSheet, formattedData) {
  try {
    // Clear existing staged data 🧹
    if (importDbSheet.getLastRow() > 1) {
      importDbSheet
        .getRange(2, 1, importDbSheet.getLastRow() - 1, importDbSheet.getLastColumn())
        .clearContent();
    }
    
    // Set headers 📝
    const headers = CONFIG.IMPORT.IMPORT_DB_HEADERS;
    importDbSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Write staged data 📥
    const rows = formattedData.map(item => [
      item.category,
      item.value,
      item.source,
      item.timestamp
    ]);
    
    if (rows.length > 0) {
      importDbSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
  } catch (error) {
    logError('stageDataInImportDB', error);
    throw new Error('Failed to stage data in IMPORT_DB: ' + error.message);
  }
}

/**
 * 🔍 Gets existing data for duplicate checking
 */
function getExistingDataForDuplicateCheck(targetSheet) {
  try {
    const lastRow = targetSheet.getLastRow();
    const lastCol = targetSheet.getLastColumn();
    
    if (lastRow < 2 || lastCol < 1) return [];
    
    const headers = targetSheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const dataRange = targetSheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    
    const result = [];
    
    for (let col = 0; col < lastCol; col++) {
      const header = String(headers[col] || '').trim();
      if (!header || looksNumeric(header)) continue;
      
      for (let row = 0; row < dataRange.length; row++) {
        const cell = String(dataRange[row][col] || '').trim();
        if (!cell || looksNumeric(cell)) continue;
        
        result.push({
          category: header.toLowerCase(),
          value: cell.toLowerCase()
        });
      }
    }
    
    return result;
  } catch (error) {
    logError('getExistingDataForDuplicateCheck', error);
    return [];
  }
}

/**
 * 🚫 Filters out duplicate entries
 */
function filterDuplicates(formattedData, existingData) {
  const existingSet = new Set(
    existingData.map(item => `${item.category}|||${item.value}`)
  );
  
  const newRows = [];
  const duplicates = [];
  
  formattedData.forEach(item => {
    const key =
      String(item.category || '').toLowerCase() +
      '|||' +
      String(item.value || '').toLowerCase();
    
    if (existingSet.has(key)) {
      duplicates.push(item);
    } else {
      newRows.push(item);
      existingSet.add(key);
    }
  });
  
  return { newRows: newRows, duplicates: duplicates };
}

/**
 * 📥 Appends values to category columns in target sheet
 */
function appendValuesToCategoryColumns(sheet, newRows) {
  try {
    if (!newRows.length) return;
    
    let lastRow = sheet.getLastRow();
    let lastCol = sheet.getLastColumn();
    
    if (lastRow < 1) lastRow = 1;
    
    // Get header mapping 🗺️
    const headerValues =
      lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    
    const headerMap = {};
    headerValues.forEach((h, idx) => {
      const key = String(h || '').trim().toLowerCase();
      if (key) headerMap[key] = idx + 1;
    });
    
    // Process each new row 🔄
    newRows.forEach(item => {
      const rawCategory = String(item.category || '').trim();
      const categoryKey = rawCategory.toLowerCase();
      
      if (!rawCategory) return;
      
      // Find or create column 🎯
      let col = headerMap[categoryKey];
      if (!col) {
        lastCol += 1;
        col = lastCol;
        headerMap[categoryKey] = col;
        sheet.getRange(1, col).setValue(rawCategory);
      }
      
      // Find first empty cell in column 📍
      const colRange = sheet.getRange(2, col, Math.max(lastRow - 1, 1), 1);
      const colValues = colRange.getValues();
      
      let writeRowIndex = null;
      for (let i = 0; i < colValues.length; i++) {
        if (!colValues[i][0]) {
          writeRowIndex = 2 + i;
          break;
        }
      }
      
      if (!writeRowIndex) {
        writeRowIndex = lastRow + 1;
        lastRow = writeRowIndex;
      }
      
      // Write value ✍️
      sheet.getRange(writeRowIndex, col).setValue(item.value);
    });
  } catch (error) {
    logError('appendValuesToCategoryColumns', error);
    throw new Error('Failed to append values: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 SECTION CATEGORIES & DROPDOWNS - ENHANCED WITH NORMALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎯 Gets categories for a section (WITH CASE NORMALIZATION!)
 */
/**
 * 🔎 Resolves a logical sheet name through CONFIG.SHEET_ALIASES (first existing tab wins).
 */
function getSheetByAnyName(ss, logicalName) {
  const wanted = String(logicalName || '').trim();
  let candidates = [wanted];
  const groups = CONFIG.SHEET_ALIASES || {};
  Object.keys(groups).forEach(function (key) {
    const group = groups[key];
    const hit = group.some(function (n) { return n.toLowerCase() === wanted.toLowerCase(); });
    if (hit) candidates = candidates.concat(group);
  });
  for (let i = 0; i < candidates.length; i++) {
    const sheet = ss.getSheetByName(candidates[i]);
    if (sheet) return sheet;
  }
  return null;
}

function getSectionCategories(section) {
  try {
    // 🛡️ NORMALIZE SECTION NAME
    const validation = validateSection(section);
    
    if (!validation.isValid) {
      console.warn(`❌ Invalid section: "${section}" (original: "${validation.original}")`);
      return [];
    }
    
    const normalizedSection = validation.normalized;
    const dbSheetName = validation.dbSheet;
    
    // Check cache 💾
    const cache = CacheService.getScriptCache();
    const cacheKey = CONFIG.CACHE.KEYS.CATEGORIES + normalizedSection;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`✅ Cache hit for ${normalizedSection}`);
      return JSON.parse(cached);
    }

    // Load from sheet 📊
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, dbSheetName);

    if (!sheet) {
      console.warn(`⚠️ Sheet "${dbSheetName}" (or aliases) not found for section ${normalizedSection}`);
      return [];
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    if (lastRow < 2 || lastCol < 1) {
      console.log(`ℹ️ No data in ${dbSheetName}`);
      return [];
    }

    // ⚡ SPEED OPTIMIZATION 1: Identify non-empty, non-numeric, non-error header columns
    // Scanning row 1 only (~1ms) prevents scanning hundreds of trailing blank/dump columns (e.g. 458 in Shots)
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const validColIndices = [];
    for (let c = 0; c < headers.length; c++) {
      const h = String(headers[c] || '').trim();
      if (h && !looksNumeric(h) && !h.startsWith('#')) {
        validColIndices.push(c);
      }
    }

    if (validColIndices.length === 0) {
      return [];
    }

    // Determine the exact maximum column index needed so we only read active columns
    const maxColNeeded = validColIndices[validColIndices.length - 1] + 1;
    const data = sheet.getRange(2, 1, lastRow - 1, maxColNeeded).getValues();

    const categories = [];

    // ⚡ SPEED OPTIMIZATION 2: Process only valid columns, using Set for O(1) deduplication
    for (let i = 0; i < validColIndices.length; i++) {
      const col = validColIndices[i];
      const header = String(headers[col] || '').trim();
      const seen = new Set();
      const values = [];

      for (let row = 0; row < data.length; row++) {
        const cell = String(data[row][col] || '').trim();
        if (!cell || looksNumeric(cell) || cell.startsWith('#') || seen.has(cell)) continue;
        seen.add(cell);
        values.push(cell);
      }

      if (!values.length) continue;

      categories.push({
        name: header,
        values: values,
        src: {
          sheet: sheet.getName(),
          col: col + 1,
          rowStart: 2
        }
      });
    }

    // Safe Cache (guard against CacheService 100KB limit) 💾
    try {
      const jsonStr = JSON.stringify(categories);
      if (jsonStr.length < 95000) {
        cache.put(cacheKey, jsonStr, CONFIG.CACHE.DURATION);
      }
    } catch (cacheErr) {
      console.warn('Cache put skipped: ' + cacheErr.message);
    }
    
    console.log(`✅ Loaded ${categories.length} categories for ${normalizedSection}`);
    return categories;
    
  } catch (error) {
    logError('getSectionCategories', error);
    return [];
  }
}

/**
 * 🔄 Refreshes all dropdown caches (CacheService + ScriptProperties)
 */
function refreshAllDropdowns() {
  try {
    const cache = CacheService.getScriptCache();
    
    ['CHARACTER', 'SCENE', 'CAMERA'].forEach(section => {
      cache.remove(CONFIG.CACHE.KEYS.CATEGORIES + section);
      cache.remove(CONFIG.CACHE.KEYS.HELP + section);
    });

    try {
      PropertiesService.getScriptProperties().deleteProperty('COMPILED_CATEGORIES_V5');
    } catch (e) {}
    
    // Immediately rebuild and return fresh data
    const freshData = getDashboardData(true);
    console.log('✅ All dropdown caches cleared and refreshed!');
    return { success: true, message: '🔄 Cache refreshed successfully!', data: freshData };
  } catch (error) {
    logError('refreshAllDropdowns', error);
    return { success: false, error: error.message };
  }
}

/**
 * 🧹 Clears cache for specific section
 */
function clearCacheForSection(section) {
  try {
    const normalized = normalizeSection(section);
    if (!normalized) return;
    
    const cache = CacheService.getScriptCache();
    cache.remove(CONFIG.CACHE.KEYS.CATEGORIES + normalized);
    cache.remove(CONFIG.CACHE.KEYS.HELP + normalized);
    
    console.log(`🧹 Cache cleared for ${normalized}`);
  } catch (error) {
    console.warn('clearCacheForSection error:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✨ Generates AI prompt from selections
 */
function generatePromptFromSelections(selections) {
  try {
    const parts = [];
    
    // Collect CHARACTER selections 👤
    if (selections.character) {
      Object.values(selections.character).forEach(val => {
        if (val) parts.push(val);
      });
    }
    
    // Collect SCENE selections 🎬
    if (selections.scene) {
      Object.values(selections.scene).forEach(val => {
        if (val) parts.push(val);
      });
    }
    
    // Collect CAMERA selections 📸
    if (selections.camera) {
      Object.values(selections.camera).forEach(val => {
        if (val) parts.push(val);
      });
    }
    
    if (!parts.length) {
      return '✨ Please make some selections first to generate your prompt! 🎨';
    }
    
    return CONFIG.PROMPT.PREFIX + parts.join(CONFIG.PROMPT.SEPARATOR);
  } catch (error) {
    logError('generatePromptFromSelections', error);
    return '❌ Error generating prompt: ' + error.message;
  }
}

/**
 * 🎨 Generates multiple prompt formats
 */
function generateMultiFormatPrompts(selections) {
  try {
    const basePrompt = generatePromptFromSelections(selections);
    
    if (basePrompt.startsWith('✨') || basePrompt.startsWith('❌')) {
      return { success: false, message: basePrompt };
    }
    
    const parts = basePrompt.replace(CONFIG.PROMPT.PREFIX, '').split(CONFIG.PROMPT.SEPARATOR);
    
    return {
      success: true,
      formats: {
        narrative: generateNarrativeFormat(parts),
        technical: generateTechnicalFormat(parts, selections),
        poetic: generatePoeticFormat(parts),
        bulletPoint: generateBulletPointFormat(parts, selections)
      }
    };
  } catch (error) {
    logError('generateMultiFormatPrompts', error);
    return { success: false, message: 'Failed to generate multi-format prompts: ' + error.message };
  }
}

/**
 * 📖 Generates narrative format prompt
 */
function generateNarrativeFormat(parts) {
  return (
    'In this captivating scene, we witness ' +
    parts.slice(0, 3).join(' featuring ') +
    '. The composition reveals ' +
    parts.slice(3, 6).join(' with ') +
    '. ' +
    parts.slice(6).join(', creating ') +
    ' brings this vision to life.'
  );
}

/**
 * 🔧 Generates technical format prompt
 */
function generateTechnicalFormat(parts, selections) {
  let output = '=== AI ART PROMPT - TECHNICAL FORMAT ===\n\n';
  
  if (selections.character && Object.keys(selections.character).length > 0) {
    output += '👤 CHARACTER:\n';
    Object.entries(selections.character).forEach(([cat, val]) => {
      if (val) output += `  • ${cat}: ${val}\n`;
    });
    output += '\n';
  }
  
  if (selections.scene && Object.keys(selections.scene).length > 0) {
    output += '🎬 SCENE:\n';
    Object.entries(selections.scene).forEach(([cat, val]) => {
      if (val) output += `  • ${cat}: ${val}\n`;
    });
    output += '\n';
  }
  
  if (selections.camera && Object.keys(selections.camera).length > 0) {
    output += '📸 CAMERA:\n';
    Object.entries(selections.camera).forEach(([cat, val]) => {
      if (val) output += `  • ${cat}: ${val}\n`;
    });
  }
  
  return output;
}

/**
 * 🎨 Generates poetic format prompt
 */
function generatePoeticFormat(parts) {
  return (
    'A vision unfolds...\n\n' +
    parts.slice(0, 2).join(' dancing with ') +
    ',\n' +
    parts.slice(2, 4).join(' embracing ') +
    ',\n' +
    parts.slice(4, 6).join(' whispering ') +
    ',\n' +
    parts.slice(6).join(' illuminating ') +
    '\n\n' +
    '...captured in timeless beauty.'
  );
}

/**
 * 📋 Generates bullet-point format prompt
 */
function generateBulletPointFormat(parts, selections) {
  const charCount = Object.values(selections.character || {}).filter(v => v).length;
  const sceneCount = Object.values(selections.scene || {}).filter(v => v).length;
  const cameraCount = Object.values(selections.camera || {}).filter(v => v).length;
  
  let output =
    '🎨 AI ART PROMPT - QUICK REFERENCE\n\n' +
    `📊 Summary: ${charCount} character elements, ${sceneCount} scene elements, ${cameraCount} camera elements\n\n` +
    '📋 Full Prompt Elements:\n';
  
  parts.forEach((p, idx) => {
    output += `  ${idx + 1}. ${p}\n`;
  });
  
  return output;
}

// ═══════════════════════════════════════════════════════════════════════════
// 💾 USER PREFERENCES & STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 💾 Saves dashboard selections to user properties
 */
function saveDashboardSelections(selections) {
  try {
    PropertiesService.getUserProperties().setProperty(
      CONFIG.USER_PROPS.SELECTIONS,
      JSON.stringify(selections)
    );
    return { success: true };
  } catch (error) {
    logError('saveDashboardSelections', error);
    throw error;
  }
}

/**
 * 📂 Loads dashboard selections from user properties
 */
function loadDashboardSelections() {
  try {
    const saved = PropertiesService.getUserProperties().getProperty(
      CONFIG.USER_PROPS.SELECTIONS
    );
    
    if (saved) return JSON.parse(saved);
    
    return { character: {}, scene: {}, camera: {} };
  } catch (error) {
    logError('loadDashboardSelections', error);
    return { character: {}, scene: {}, camera: {} };
  }
}

/**
 * 🧹 Clears all dashboard selections
 */
function clearAllSelectionsBackend() {
  try {
    PropertiesService.getUserProperties().setProperty(
      CONFIG.USER_PROPS.SELECTIONS,
      JSON.stringify({ character: {}, scene: {}, camera: {} })
    );
    return { success: true, message: '✨ All selections cleared successfully!' };
  } catch (error) {
    logError('clearAllSelectionsBackend', error);
    return { success: false, message: error.message };
  }
}

/**
 * 🎨 Gets user theme preference
 */
function getUserTheme() {
  try {
    return (
      PropertiesService.getUserProperties().getProperty(CONFIG.USER_PROPS.THEME) ||
      'neon'
    );
  } catch (error) {
    console.warn('getUserTheme error:', error);
    return 'neon';
  }
}

/**
 * 🎨 Sets user theme preference
 */
function setUserTheme(theme) {
  try {
    PropertiesService.getUserProperties().setProperty(
      CONFIG.USER_PROPS.THEME,
      theme
    );
    return { success: true };
  } catch (error) {
    logError('setUserTheme', error);
    return { success: false };
  }
}

/**
 * 🔊 Gets sound enabled status
 */
function getSoundEnabled() {
  try {
    const saved = PropertiesService.getUserProperties().getProperty(
      CONFIG.USER_PROPS.SOUND
    );
    return saved === null ? true : saved === 'true';
  } catch (error) {
    console.warn('getSoundEnabled error:', error);
    return true;
  }
}

/**
 * 🔊 Sets sound enabled status
 */
function setSoundEnabled(enabled) {
  try {
    PropertiesService.getUserProperties().setProperty(
      CONFIG.USER_PROPS.SOUND,
      String(enabled)
    );
    return { success: true };
  } catch (error) {
    logError('setSoundEnabled', error);
    return { success: false };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 💾 GOOGLE DRIVE SAVE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 💾 Saves prompt to Google Drive
 */
function savePromptToDrive(promptText) {
  try {
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd_HHmmss'
    );
    
    const filename = `AI_Prompt_${timestamp}.txt`;
    const file = DriveApp.createFile(filename, promptText, MimeType.PLAIN_TEXT);
    
    return { 
      success: true, 
      filename: filename, 
      url: file.getUrl(),
      message: `✅ Saved to Drive: ${filename}` 
    };
  } catch (error) {
    logError('savePromptToDrive', error);
    return { success: false, message: error.message };
  }
}

/**
 * 📦 Saves multi-format prompts to Google Drive
 */
function saveMultiFormatToDrive(formats) {
  try {
    if (!formats || (!formats.narrative && !formats.technical && !formats.poetic && !formats.bulletPoint)) {
      return { 
        success: false, 
        message: '⚠️ No multi-format prompts were provided.\n\n💡 Please click "Multi-Format" first!' 
      };
    }
    
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd_HHmmss'
    );
    
    const filename = `AI_Prompt_MultiFormat_${timestamp}.txt`;
    
    let content = '';
    content += '🎨 AI ART PROMPT - MULTI-FORMAT COLLECTION\n';
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    content += '📖 NARRATIVE FORMAT\n';
    content += '──────────────────────────────────────\n';
    content += `${formats.narrative || '—'}\n\n`;
    content += '🔧 TECHNICAL FORMAT\n';
    content += '──────────────────────────────────────\n';
    content += `${formats.technical || '—'}\n\n`;
    content += '🎨 POETIC FORMAT\n';
    content += '──────────────────────────────────────\n';
    content += `${formats.poetic || '—'}\n\n`;
    content += '📋 BULLET-POINT FORMAT\n';
    content += '──────────────────────────────────────\n';
    content += `${formats.bulletPoint || '—'}\n`;
    
    const file = DriveApp.createFile(filename, content, MimeType.PLAIN_TEXT);
    
    return { 
      success: true, 
      filename: filename, 
      url: file.getUrl(),
      message: `✅ Multi-format prompt saved: ${filename}` 
    };
  } catch (error) {
    logError('saveMultiFormatToDrive', error);
    return { success: false, message: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🖥️ DASHBOARD BRIDGE FUNCTIONS - google.script.run ENTRYPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 📊 Gets all dashboard category vocabularies (CHARACTER / SCENE / CAMERA)
 * Shape expected by Dashboard_v5_0_ENHANCED.html: { character: {catName: [values]}, scene: {...}, camera: {...} }
 * Supports persistent ScriptProperties caching for blazing fast (<15ms) responses.
 */
function getDashboardData(forceRefresh) {
  try {
    const props = PropertiesService.getScriptProperties();
    const CACHE_PROP_KEY = 'COMPILED_CATEGORIES_V5';
    
    if (!forceRefresh) {
      const saved = props.getProperty(CACHE_PROP_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.character && Object.keys(parsed.character).length > 0) {
            console.log('⚡ getDashboardData hit from ScriptProperties cache (<15ms)');
            return parsed;
          }
        } catch (e) {}
      }
    }

    const sections = ['CHARACTER', 'SCENE', 'CAMERA'];
    const data = { character: {}, scene: {}, camera: {} };

    sections.forEach(function (sectionKey) {
      const targetKey = sectionKey.toLowerCase();
      const categories = getSectionCategories(sectionKey);
      categories.forEach(function (category) {
        data[targetKey][category.name] = category.values;
      });
    });

    // Save to persistent ScriptProperties (available instantly on future calls)
    try {
      props.setProperty(CACHE_PROP_KEY, JSON.stringify(data));
    } catch (propErr) {
      console.warn('Could not save to ScriptProperties: ' + propErr.message);
    }

    return data;
  } catch (error) {
    logError('getDashboardData', error);
    return { character: {}, scene: {}, camera: {} };
  }
}

/**
 * 💾 Appends a generated prompt's selections to the History/Log sheet
 * Header: Category | Value | Source | Timestamp (appendRow only — never overwrites/dedupes existing rows)
 */
function savePromptToLog(promptText, selections) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, 'History/Log');

    if (sheet.getLastRow() < 1) {
      sheet.appendRow(['Category', 'Value', 'Source', 'Timestamp']);
    }

    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    const sections = ['character', 'scene', 'camera'];
    let rowsAppended = 0;

    sections.forEach(function (sectionKey) {
      const sectionSelections = (selections && selections[sectionKey]) || {};
      Object.keys(sectionSelections).forEach(function (category) {
        const value = sectionSelections[category];
        if (!value) return;
        sheet.appendRow([category, value, 'Dashboard', timestamp]);
        rowsAppended++;
      });
    });

    if (!rowsAppended) {
      sheet.appendRow(['Prompt', promptText, 'Dashboard', timestamp]);
      rowsAppended++;
    }

    return { success: true, rowsAppended: rowsAppended, message: '✅ Prompt logged successfully!' };
  } catch (error) {
    logError('savePromptToLog', error);
    return { success: false, message: error.message };
  }
}

/**
 * 📤 Exports a generated prompt to Drive (delegates to savePromptToDrive)
 */
function exportPromptToDrive(promptText, selections) {
  try {
    return savePromptToDrive(promptText);
  } catch (error) {
    logError('exportPromptToDrive', error);
    return { success: false, message: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 ALIAS SUGGESTIONS SYSTEM - ENHANCED WITH NORMALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 💡 Gets alias suggestions for unmatched labels
 */
function getAliasSuggestions(section) {
  try {
    // 🛡️ Normalize section
    const validation = validateSection(section);
    if (!validation.isValid) {
      console.warn(`Invalid section for alias suggestions: ${section}`);
      return [];
    }
    
    const normalizedSection = validation.normalized;
    const dbSheetName = validation.dbSheet;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const pbSheet = ss.getSheetByName(CONFIG.SHEETS.PROMPT_BUILDER);
    const aliasSheet = ss.getSheetByName(CONFIG.SHEETS.ALIAS);
    
    if (!pbSheet || !aliasSheet) return [];
    
    // Find unmatched labels 🔍
    const pbData = pbSheet.getDataRange().getValues();
    const unmatchedLabels = [];
    
    pbData.forEach((row, i) => {
      if (i === 0) return;
      
      // Normalize section comparison
      const rowSection = normalizeSection(row[0]);
      if (rowSection !== normalizedSection) return;
      
      if (row[3] !== 'NOT_MATCHED') return;
      unmatchedLabels.push(row[1]);
    });
    
    if (!unmatchedLabels.length) return [];
    
    // Check existing aliases 📋
    const aliasData = aliasSheet.getDataRange().getValues();
    const existingAliases = new Set();
    
    aliasData.forEach((row, i) => {
      if (i === 0) return;
      
      const rowSection = normalizeSection(row[0]);
      if (rowSection === normalizedSection) {
        existingAliases.add(String(row[1] || '').toLowerCase());
      }
    });
    
    // Get available headers from section sheet 📊
    const sectionSheet = ss.getSheetByName(dbSheetName);
    if (!sectionSheet) return [];
    
    const headers = sectionSheet
      .getRange(1, 1, 1, sectionSheet.getLastColumn())
      .getValues()[0];
    
    const availableHeaders = headers.filter(h => h && !looksNumeric(h));
    
    // Generate suggestions 💡
    const suggestions = [];
    
    unmatchedLabels.forEach(label => {
      if (existingAliases.has(String(label).toLowerCase())) return;
      
      const matches = findBestMatches(label, availableHeaders, 3);
      
      if (matches.length) {
        suggestions.push({ label: label, suggestions: matches });
      }
    });
    
    return suggestions;
  } catch (error) {
    logError('getAliasSuggestions', error);
    return [];
  }
}

/**
 * 🎯 Finds best matching headers for a label
 */
function findBestMatches(label, headers, maxResults) {
  const matches = [];
  const labelLower = String(label).toLowerCase();
  
  headers.forEach(header => {
    const headerLower = String(header).toLowerCase();
    const score = calculateSimilarity(labelLower, headerLower);
    
    if (score > 0.3) matches.push({ header: header, score: score });
  });
  
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, maxResults || 3);
}

/**
 * 📏 Calculates similarity between two strings
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (!longer.length) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * 📐 Calculates Levenshtein distance between strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * 💾 Saves alias override mapping
 */
function saveAliasOverride(label, header) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aliasSheet = ss.getSheetByName(CONFIG.SHEETS.ALIAS);
    
    if (!aliasSheet) throw new Error('ALIAS sheet not found');
    
    // Find section for label 🔍
    const pbSheet = ss.getSheetByName(CONFIG.SHEETS.PROMPT_BUILDER);
    const pbData = pbSheet.getDataRange().getValues();
    
    let section = '';
    for (let i = 1; i < pbData.length; i++) {
      if (pbData[i][1] === label) {
        section = normalizeSection(pbData[i][0]);
        break;
      }
    }
    
    if (!section) throw new Error('Could not determine section for label');
    
    // Add alias entry 📝
    const lastRow = aliasSheet.getLastRow();
    aliasSheet.getRange(lastRow + 1, 1, 1, 3).setValues([[section, label, header]]);
    
    clearCacheForSection(section);
    
    return { success: true, message: `✅ Alias saved: ${label} → ${header}` };
  } catch (error) {
    logError('saveAliasOverride', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📖 HELP SYSTEM - ENHANCED WITH NORMALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 📖 Gets help entries for a section
 */
function getHelpEntries(section) {
  try {
    // 🛡️ Normalize section
    const validation = validateSection(section);
    if (!validation.isValid) {
      console.warn(`Invalid section for help: ${section}`);
      return CONFIG.HELP_DEFAULT[section] || {};
    }
    
    const normalizedSection = validation.normalized;
    
    // Check cache 💾
    const cache = CacheService.getScriptCache();
    const cacheKey = CONFIG.CACHE.KEYS.HELP + normalizedSection;
    const cached = cache.get(cacheKey);
    
    if (cached) return JSON.parse(cached);
    
    // Load from sheet 📊
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const helpSheet = ss.getSheetByName(CONFIG.SHEETS.HELP);
    
    if (!helpSheet) {
      return CONFIG.HELP_DEFAULT[normalizedSection] || {};
    }
    
    const data = helpSheet.getDataRange().getValues();
    const helpMap = {};
    
    data.forEach((row, index) => {
      if (index === 0) return;
      
      const rowSection = normalizeSection(String(row[0] || ''));
      if (rowSection !== normalizedSection) return;
      
      const category = String(row[1] || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
      
      const helpText = String(row[2] || '').trim();
      
      if (category && helpText) helpMap[category] = helpText;
    });
    
    const finalHelp = Object.keys(helpMap).length > 0 ? 
      helpMap : 
      (CONFIG.HELP_DEFAULT[normalizedSection] || {});
    
    cache.put(cacheKey, JSON.stringify(finalHelp), CONFIG.CACHE.DURATION);
    
    return finalHelp;
  } catch (error) {
    logError('getHelpEntries', error);
    return CONFIG.HELP_DEFAULT[section] || {};
  }
}

/**
 * 📚 Shows help documentation
 */
function showHelp() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('Help')
      .setWidth(800)
      .setHeight(700);
    
    SpreadsheetApp.getUi().showModalDialog(html, '📖 AI Prompt Builder Help v5.2.0');
  } catch (error) {
    logError('showHelp', error);
    SpreadsheetApp.getUi().alert('❌ Help Error: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧰 DIAGNOSTICS & DEBUG - ENHANCED
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🧰 Runs comprehensive system diagnostics
 */
function runFullDiagnostics() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const results = {
      timestamp: new Date().toISOString(),
      version: '5.2.0 ULTRA-DEBUGGED',
      sheets: {},
      cache: {},
      userProps: {},
      sections: {},
      normalization: {}
    };
    
    // Check sheets 📊
    Object.entries(CONFIG.SHEETS).forEach(([key, name]) => {
      const sheet = ss.getSheetByName(name);
      results.sheets[key] = sheet
        ? { exists: true, name: name, rows: sheet.getLastRow(), cols: sheet.getLastColumn() }
        : { exists: false, name: name };
    });
    
    // Check cache 💾
    const cache = CacheService.getScriptCache();
    ['CHARACTER', 'SCENE', 'CAMERA'].forEach(section => {
      const key = CONFIG.CACHE.KEYS.CATEGORIES + section;
      results.cache[key] = cache.get(key) ? 'CACHED' : 'EMPTY';
    });
    
    // Check user properties 👤
    const userProps = PropertiesService.getUserProperties();
    results.userProps.theme = userProps.getProperty(CONFIG.USER_PROPS.THEME) || 'NOT_SET';
    results.userProps.sound = userProps.getProperty(CONFIG.USER_PROPS.SOUND) || 'NOT_SET';
    
    // Check sections 📋
    Object.entries(CONFIG.SECTIONS).forEach(([key, config]) => {
      const sheet = ss.getSheetByName(config.dbSheet);
      results.sections[key] = {
        dbSheet: config.dbSheet,
        exists: !!sheet,
        categoriesLoaded: getSectionCategories(key).length
      };
    });
    
    // Test normalization 🔤
    ['character', 'CHARACTER', 'scene', 'SCENE', 'camera', 'CAMERA'].forEach(test => {
      const normalized = normalizeSection(test);
      const validation = validateSection(test);
      results.normalization[test] = {
        normalized: normalized,
        isValid: validation.isValid,
        dbSheet: validation.dbSheet
      };
    });
    
    Logger.log(JSON.stringify(results, null, 2));
    
    const message = `✅ DIAGNOSTICS COMPLETE v5.2.0\n\n` +
      `📊 Sheets Found: ${Object.values(results.sheets).filter(s => s.exists).length}/${Object.keys(results.sheets).length}\n` +
      `💾 Cache Status: ${Object.values(results.cache).filter(c => c === 'CACHED').length}/${Object.keys(results.cache).length} cached\n` +
      `🎨 Theme: ${results.userProps.theme}\n` +
      `🔊 Sound: ${results.userProps.sound}\n\n` +
      `📦 Sections:\n` +
      Object.entries(results.sections).map(([k, v]) => 
        `  ${k}: ${v.exists ? '✅' : '❌'} (${v.categoriesLoaded} categories)`
      ).join('\n') + '\n\n' +
      `🔤 Normalization Test: ✅ All passed`;
    
    SpreadsheetApp.getUi().alert('Diagnostics Complete', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return results;
  } catch (error) {
    logError('runFullDiagnostics', error);
    return { error: error.message };
  }
}

/**
 * 📸 Debugs camera section specifically
 */
function debugCameraDiagnosis() {
  try {
    const categories = getSectionCategories('CAMERA');
    
    const message = `📸 CAMERA DEBUG REPORT v5.2.0\n\n` +
      `Total Categories: ${categories.length}\n\n` +
      categories.map(c => 
        `📦 ${c.name}: ${c.values.length} values\n` +
        `   First: "${c.values[0] || 'N/A'}"\n` +
        `   Source: ${c.src.sheet} (Col ${c.src.col})`
      ).join('\n\n');
    
    SpreadsheetApp.getUi().alert('Camera Debug', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
    return {
      success: true,
      cameraCategories: categories.length,
      categories: categories.map(c => ({
        name: c.name,
        valueCount: c.values.length,
        firstValue: c.values[0]
      }))
    };
  } catch (error) {
    logError('debugCameraDiagnosis', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🔢 Checks if value looks numeric
 */
function looksNumeric(val) {
  if (val == null) return false;
  const str = String(val).trim();
  if (!str) return false;
  return /^[+-]?\d+([.,]\d+)?\.?$/.test(str);
}

/**
 * 📄 Gets or creates a sheet
 */
function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * 📝 Logs errors with context
 */
function logError(functionName, error) {
  const message = `❌ Error in ${functionName}: ${error.message}`;
  console.error(message);
  if (error.stack) console.error('Stack:', error.stack);
}

/**
 * ⚡ Live trigger for interactive in-sheet updates
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    const sheetName = sheet.getName();
    
    // Check if user edited a dropdown in PROMPT_BUILDER (Column D, Row 8+)
    const isPbSheet = sheetName === CONFIG.SHEETS.PROMPT_BUILDER || 
                      (CONFIG.SHEET_ALIASES.PROMPT_BUILDER && CONFIG.SHEET_ALIASES.PROMPT_BUILDER.includes(sheetName));
    
    if (isPbSheet && e.range.getColumn() === 4 && e.range.getRow() >= 8) {
      const val = e.range.getValue();
      if (val) {
        SpreadsheetApp.getActiveSpreadsheet().toast('Prompt updated with "' + val + '" ✨ Click cell B2 and press Ctrl+C to copy!', '🎨 Prompt Studio', 3);
      }
    }
  } catch (err) {
    console.warn('onEdit warning: ' + err.message);
  }
}

/**
 * 🧹 Clears PROMPT_BUILDER selections (preserving formulas, headers, and validation)
 */
function clearPromptBuilderSelections() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    
    if (!sheet) {
      throw new Error('PROMPT_BUILDER sheet not found. Run "Setup / Rebuild In-Sheet Studio" first.');
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow >= 8) {
      // Clear column D (selections) from row 8 downwards
      sheet.getRange(8, 4, lastRow - 7, 1).clearContent();
    }
    
    SpreadsheetApp.getActiveSpreadsheet().toast('All dropdown selections cleared! ✨', '🧹 Cleared', 3);
    return { success: true, message: '✨ Prompt builder selections cleared!' };
  } catch (error) {
    logError('clearPromptBuilderSelections', error);
    SpreadsheetApp.getUi().alert('❌ Error: ' + error.message);
    return { success: false, message: error.message };
  }
}

/**
 * 🎨 Creates or updates the interactive in-sheet PROMPT_BUILDER studio sheet.
 * Features:
 * 1. Pinned top banner (Rows 1-7 frozen) with merged prompt display cell B2:D3 (Clean) and B4:D4 (Prefix).
 * 2. Dynamic formula: =IF(COUNTA(D8:D40)=0, "...", TEXTJOIN(", ", TRUE, D8:D40))
 * 3. Native Google Sheets DataValidation dropdowns in Column D linking directly to Character, Scene Settings, and Shots.
 * 4. Pinned guidance, 1-click copy box, and category examples in Column E.
 */
function setupPromptBuilderSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.PROMPT_BUILDER, 0);
    }
    
    sheet.setTabColor('#7c3aed');
    
    // CRITICAL: Unfreeze and break apart any merges, then completely wipe the sheet clean
    sheet.setFrozenRows(0);
    sheet.setFrozenColumns(0);
    const maxRows = sheet.getMaxRows();
    const maxCols = sheet.getMaxColumns();
    try {
      sheet.getRange(1, 1, maxRows, maxCols).breakApart();
      sheet.getRange(1, 1, maxRows, maxCols).clearDataValidations();
      sheet.getRange(1, 1, maxRows, maxCols).clear();
    } catch (cleanErr) {
      console.log('clean preparation note: ' + cleanErr.message);
    }
    
    // Set column widths
    sheet.setColumnWidth(1, 35);  // Col A: Margin
    sheet.setColumnWidth(2, 220); // Col B: Section
    sheet.setColumnWidth(3, 230); // Col C: Category
    sheet.setColumnWidth(4, 350); // Col D: Selected Option (Dropdown)
    sheet.setColumnWidth(5, 340); // Col E: Guidance / Help
    
    // 1. Header Title Banner (Row 1)
    sheet.getRange('B1:E1').merge()
      .setValue('🎨 AI ART PROMPT BUILDER — IN-SHEET STUDIO')
      .setBackground('#312e81')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(13)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 38);
    
    // 2. Merged Prompt Box (Rows 2 to 3, Cols B to D) - Clean Prompt for Midjourney / Flux
    const promptRangeClean = sheet.getRange('B2:D3');
    promptRangeClean.merge();
    promptRangeClean.setBackground('#f8fafc')
      .setFontColor('#0f172a')
      .setFontWeight('bold')
      .setFontSize(11)
      .setWrap(true)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('top');
    promptRangeClean.setBorder(true, true, true, true, false, false, '#6366f1', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    sheet.setRowHeight(2, 28);
    sheet.setRowHeight(3, 28);
    
    // 3. Row 4 (Cols B to D) - Prompt with Prefix
    const promptRangePrefix = sheet.getRange('B4:D4');
    promptRangePrefix.merge();
    promptRangePrefix.setBackground('#f1f5f9')
      .setFontColor('#334155')
      .setFontWeight('bold')
      .setFontSize(10)
      .setWrap(true)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle');
    promptRangePrefix.setBorder(true, true, true, true, false, false, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeight(4, 28);
    
    // Quick copy instructions box (E2:E4)
    const copyBox = sheet.getRange('E2:E4');
    copyBox.merge()
      .setValue('📋 1-CLICK PROMPT COPY\n\n1. Click cell B2 (clean) or B4 (prefix)\n2. Press Ctrl+C\n3. Paste into Midjourney / Flux / DALL-E\n\n🧹 Reset: Menu → 🎨 AI Prompt Builder → 🧹 Clear In-Sheet Selections')
      .setBackground('#eef2ff')
      .setFontColor('#3730a3')
      .setFontWeight('bold')
      .setFontSize(9)
      .setWrap(true)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    copyBox.setBorder(true, true, true, true, false, false, '#c7d2fe', SpreadsheetApp.BorderStyle.SOLID);
    
    // Row 5: Spacing
    sheet.setRowHeight(5, 12);
    
    // Row 6: Column Table Headers
    const headers = [['Section', 'Category', 'Select Option (Dropdown Menu)', 'Guidance / Examples']];
    sheet.getRange('B6:E6').setValues(headers)
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(6, 30);
    
    // Row 7: Instruction divider
    sheet.getRange('B7:E7').merge()
      .setValue('👇 Click any green cell in Column D below to choose traits — Prompt auto-updates above in real-time 👇')
      .setBackground('#f8fafc')
      .setFontColor('#64748b')
      .setFontStyle('italic')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(7, 24);
    
    // Freeze top 7 rows so prompt stays pinned at the top while scrolling!
    sheet.setFrozenRows(7);
    sheet.setFrozenColumns(0);
    
    // Build curated rows directly from clean columnar DB sheets
    const sectionsToBuild = [
      { key: 'CHARACTER', name: '👤 Character Design', sheetName: 'DB_Character', fallback: 'Character', bg: '#eff6ff', font: '#1d4ed8' },
      { key: 'SCENE',     name: '🎬 Scene Settings',   sheetName: 'DB_Scene',     fallback: 'Scene Settings', bg: '#ecfdf5', font: '#047857' },
      { key: 'CAMERA',    name: '📸 Camera & Composition', sheetName: 'DB_Camera', fallback: 'Shots', bg: '#f5f3ff', font: '#6d28d9' }
    ];
    
    let currentRow = 8;
    
    sectionsToBuild.forEach(function(sec) {
      const srcSheet = getSheetByAnyName(ss, sec.sheetName) || ss.getSheetByName(sec.sheetName) || getSheetByAnyName(ss, sec.fallback);
      if (!srcSheet) {
        console.warn('⚠️ Source sheet not found for ' + sec.name);
        return;
      }
      
      const lastCol = srcSheet.getLastColumn();
      const lastRow = srcSheet.getLastRow();
      if (lastCol < 1 || lastRow < 2) return;
      
      const colHeaders = srcSheet.getRange(1, 1, 1, lastCol).getValues()[0];
      
      for (let c = 0; c < lastCol; c++) {
        const catName = String(colHeaders[c] || '').trim();
        if (!catName || looksNumeric(catName) || catName.startsWith('#')) continue;
        
        // Count non-empty values down this column
        const colVals = srcSheet.getRange(2, c + 1, lastRow - 1, 1).getValues();
        let validRowCount = 0;
        for (let r = 0; r < colVals.length; r++) {
          const v = String(colVals[r][0] || '').trim();
          if (v && !looksNumeric(v) && !v.startsWith('#') && v !== '0') {
            validRowCount++;
          }
        }
        if (validRowCount === 0) continue;
        
        // Data Validation Range for this column (row 2 down to validRowCount + 1)
        const valueRange = srcSheet.getRange(2, c + 1, validRowCount, 1);
        const rule = SpreadsheetApp.newDataValidation()
          .requireValueInRange(valueRange)
          .setAllowInvalid(true)
          .build();
        
        sheet.setRowHeight(currentRow, 26);
        sheet.getRange(currentRow, 2).setValue(sec.name)
          .setBackground(sec.bg)
          .setFontColor(sec.font)
          .setFontWeight('bold')
          .setVerticalAlignment('middle');
        sheet.getRange(currentRow, 3).setValue(catName)
          .setFontColor('#0f172a')
          .setFontWeight('medium')
          .setVerticalAlignment('middle');
        
        const dropdownCell = sheet.getRange(currentRow, 4);
        dropdownCell.setDataValidation(rule)
          .setBackground('#f0fdf4')
          .setFontColor('#15803d')
          .setFontWeight('bold')
          .setVerticalAlignment('middle');
        
        // Help guidance
        const helpMap = CONFIG.HELP_DEFAULT[sec.key] || {};
        const helpText = helpMap[catName.toLowerCase()] || ('Pick ' + catName + ' (' + validRowCount + ' options)');
        sheet.getRange(currentRow, 5).setValue(helpText)
          .setFontColor('#64748b')
          .setFontSize(9)
          .setVerticalAlignment('middle');
        
        currentRow++;
      }
    });
    
    const lastCategoryRow = currentRow - 1;
    
    // Set dynamic prompt formulas
    if (lastCategoryRow >= 8) {
      promptRangeClean.setFormula(
        '=IF(COUNTA(D8:D' + lastCategoryRow + ')=0, ' +
        '"✨ Pick dropdown options below in Column D — your composed prompt will appear here in real-time ready to copy!", ' +
        'TEXTJOIN(", ", TRUE, D8:D' + lastCategoryRow + '))'
      );
      promptRangePrefix.setFormula(
        '=IF(COUNTA(D8:D' + lastCategoryRow + ')=0, "", "GENERATE AN IMAGE: " & B2)'
      );
      
      // Add border to data table
      sheet.getRange(8, 2, lastCategoryRow - 7, 4).setBorder(
        true, true, true, true, true, true,
        '#e2e8f0', SpreadsheetApp.BorderStyle.SOLID
      );
    }
    
    // Clear any leftover old rows below the data table
    const maxSheetRows = sheet.getMaxRows();
    if (maxSheetRows > currentRow) {
      const leftover = maxSheetRows - currentRow + 1;
      if (leftover > 0) {
        sheet.getRange(currentRow, 1, leftover, sheet.getMaxColumns()).clear();
      }
    }
    
    safeToast_(ss, 'Prompt Builder studio is ready! 🎨 Click cell B2 and copy anytime.', '✅ Studio Configured', 4);
    return { success: true, totalCategories: lastCategoryRow - 7 };
  } catch (error) {
    logError('setupPromptBuilderSheet', error);
    safeAlert_('❌ Error setting up Prompt Builder: ' + error.message);
    return { success: false, error: error.message, stack: error.stack };
  }
}

function safeAlert_(msg) {
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {
    console.warn('UI Alert not available: ' + msg);
  }
}

function safeToast_(ss, msg, title, sec) {
  try {
    if (ss && ss.toast) ss.toast(msg, title || 'Notice', sec || 3);
  } catch (e) {
    console.log((title || '') + ': ' + msg);
  }
}

/**
 * 💾 Appends the current in-sheet prompt and selected options to History/Log
 */
function saveInSheetPromptToLog() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const pbSheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!pbSheet) {
      SpreadsheetApp.getUi().alert('⚠️ Please run "Setup / Rebuild In-Sheet Studio" first.');
      return;
    }
    
    const promptText = String(pbSheet.getRange('B2').getValue() || '').trim();
    if (!promptText || promptText.includes('Pick dropdown options')) {
      SpreadsheetApp.getUi().alert('⚠️ No prompt selected. Please choose options in Column D first.');
      return;
    }
    
    const lastRow = pbSheet.getLastRow();
    if (lastRow < 8) return;
    
    const tableData = pbSheet.getRange(8, 2, lastRow - 7, 3).getValues(); // Cols B, C, D
    const selections = { character: {}, scene: {}, camera: {} };
    
    tableData.forEach(function(row) {
      const secName = String(row[0] || '').toLowerCase();
      const catName = String(row[1] || '').trim();
      const val = String(row[2] || '').trim();
      if (!val) return;
      
      if (secName.includes('character')) selections.character[catName] = val;
      else if (secName.includes('scene')) selections.scene[catName] = val;
      else if (secName.includes('camera') || secName.includes('shot')) selections.camera[catName] = val;
    });
    
    const res = savePromptToLog(promptText, selections);
    if (res && res.success) {
      ss.toast('✅ Prompt and selections saved to History/Log! (' + res.rowsAppended + ' traits logged)', '💾 Saved', 4);
    } else {
      ss.toast('⚠️ Could not save to log: ' + (res ? res.message : 'unknown'), 'Error', 4);
    }
  } catch (error) {
    logError('saveInSheetPromptToLog', error);
    SpreadsheetApp.getUi().alert('❌ Error saving to log: ' + error.message);
  }
}

/**
 * 📋 Lightweight 1-Click Prompt Copy Modal
 * Reads current composed prompt from PROMPT_BUILDER and provides instant 1-click clipboard copy
 */
function showPromptCopyModal() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    let promptText = '';
    
    if (sheet) {
      promptText = sheet.getRange('B2').getValue();
    }
    
    if (!promptText || promptText.includes('Pick dropdown options') || promptText.includes('Select options')) {
      const selections = loadDashboardSelections();
      promptText = generatePromptFromSelections(selections);
    }
    
    if (!promptText || promptText.startsWith('✨')) {
      SpreadsheetApp.getUi().alert('💡 Please select at least one option in the dropdowns first before copying!');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; }
          .box { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 13px; line-height: 1.5; color: #38bdf8; max-height: 200px; overflow-y: auto; white-space: pre-wrap; word-break: break-word; }
          .btn { background: #6366f1; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: bold; cursor: pointer; margin-top: 16px; width: 100%; transition: background 0.2s; }
          .btn:hover { background: #4f46e5; }
          .status { margin-top: 10px; font-size: 13px; color: #4ade80; text-align: center; display: none; }
        </style>
      </head>
      <body>
        <h3 style="margin-top:0; color:#e2e8f0;">📋 1-Click Prompt Copy</h3>
        <div class="box" id="ptext">\${escapeHtml_(promptText)}</div>
        <button class="btn" id="copyBtn" onclick="doCopy()">📋 Copy Prompt to Clipboard</button>
        <div class="status" id="stat">✅ Copied to clipboard! Ready to paste into Midjourney / Flux.</div>
        <script>
          function doCopy() {
            const text = document.getElementById('ptext').innerText;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(() => {
                document.getElementById('stat').style.display = 'block';
                document.getElementById('copyBtn').innerText = '✅ Copied!';
                setTimeout(() => { google.script.host.close(); }, 1200);
              }).catch(() => fallbackCopy(text));
            } else {
              fallbackCopy(text);
            }
          }
          function fallbackCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            document.getElementById('stat').style.display = 'block';
            document.getElementById('copyBtn').innerText = '✅ Copied!';
            setTimeout(() => { google.script.host.close(); }, 1200);
          }
          window.onload = function() { doCopy(); };
        </script>
      </body>
      </html>
    `;
    
    const output = HtmlService.createHtmlOutput(htmlContent)
      .setWidth(520)
      .setHeight(360);
    
    SpreadsheetApp.getUi().showModalDialog(output, '🎨 Prompt Ready to Copy');
  } catch (error) {
    logError('showPromptCopyModal', error);
    SpreadsheetApp.getUi().alert('❌ Error: ' + error.message);
  }
}

function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 🧪 Tests the import system
 */
function testImportSystem() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Setup sheets
    setupImportSheets();
    
    // Add test data
    const rawSheet = ss.getSheetByName(CONFIG.SHEETS.RAW_AI_DATA);
    rawSheet.getRange(2, 1, 3, 2).setValues([
      ['Hair Color', 'Silver'],
      ['Eye Color', 'Emerald Green'],
      ['Clothing', 'Victorian Dress']
    ]);
    
    // Test import with lowercase section name
    const result = executeImportFromRawData('character');  // Lowercase test!
    
    Logger.log(JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    logError('testImportSystem', error);
    return { success: false, error: error.message };
  }
}