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
    'History/Log': ['History/Log', '[X] Selections Log', 'Selections Log'],
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
 * ⚡ Multi-Select Dropdown Handler & Interactive Live Trigger for PROMPT_BUILDER
 * Allows selecting multiple options from native dropdowns in Column D.
 * Appends new selections separated by commas; selecting an existing item toggles it off.
 * Handles parenthetical traits (e.g. "Gas mask, Worn-out trench coat") safely without splitting inside parens.
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const range = e.range;
    
    // Guard against multi-cell bulk edits
    if (range.getNumRows() > 1 || range.getNumColumns() > 1) return;
    
    const sheet = range.getSheet();
    const sheetName = sheet.getName();
    
    // Check if user edited a dropdown in PROMPT_BUILDER
    const isPbSheet = sheetName === CONFIG.SHEETS.PROMPT_BUILDER || 
                      (CONFIG.SHEET_ALIASES && CONFIG.SHEET_ALIASES.PROMPT_BUILDER && CONFIG.SHEET_ALIASES.PROMPT_BUILDER.includes(sheetName));
    if (!isPbSheet) return;
    
    const col = range.getColumn();
    const row = range.getRow();
    
    // Column 4 is "Select Option (Dropdown Menu)", rows 8 through 28
    if (col !== 4 || row < 8 || row > 28) return;
    
    const newValue = String(e.value !== undefined ? e.value : (range.getValue() || '')).trim();
    const oldValue = String(e.oldValue || '').trim();
    
    // User deleted/cleared the cell with Delete/Backspace -> preserve blank
    if (!newValue) return;
    
    // If cell was previously empty, Google Sheets set it to newValue.
    if (!oldValue) {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'Selected: "' + newValue + '" ✨ Pick more from dropdown to append, or re-select to remove!',
        '🎨 Multi-Select Studio',
        3
      );
      return;
    }
    
    // Parse existing items without splitting inside parentheses (e.g. "(Gas mask, Worn-out coat)")
    let items = splitTraits_(oldValue);
    const existingIndex = items.indexOf(newValue);
    
    if (existingIndex >= 0) {
      // Toggle OFF: If already chosen, remove it!
      items.splice(existingIndex, 1);
    } else {
      // Append: Add new option to list
      items.push(newValue);
    }
    
    if (items.length === 0) {
      range.clearContent();
      SpreadsheetApp.getActiveSpreadsheet().toast('Removed trait. Cell cleared.', '🎨 Multi-Select Studio', 3);
    } else {
      const finalValue = items.join(', ');
      range.setValue(finalValue);
      SpreadsheetApp.getActiveSpreadsheet().toast(
        (existingIndex >= 0 ? 'Removed "' : 'Added "') + newValue + '" (' + items.length + ' traits in category)',
        '🎨 Multi-Select Studio',
        3
      );
    }
  } catch (err) {
    console.error('onEdit multi-select error: ' + err.message);
  }
}

/**
 * 🔍 Helper: Splits comma-separated traits while preserving commas enclosed in parentheses
 * e.g. "Male, Apocalyptic Survivor (Gas mask, Worn-out trench coat), Cyberpunk"
 * -> ["Male", "Apocalyptic Survivor (Gas mask, Worn-out trench coat)", "Cyberpunk"]
 */
function splitTraits_(str) {
  if (!str) return [];
  const results = [];
  let current = '';
  let parenDepth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') parenDepth++;
    else if (char === ')' && parenDepth > 0) parenDepth--;
    
    if (char === ',' && parenDepth === 0) {
      if (current.trim()) results.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) results.push(current.trim());
  return results;
}

/**
 * 📱 Opens the interactive Multi-Select Trait Studio sidebar
 * Provides checkboxes for every category across Character, Scene, and Camera!
 */
function showMultiSelectPicker() {
  try {
    const template = HtmlService.createTemplateFromFile('Dashboard_v5_0_ENHANCED');
    template.preloadedCategories = getDashboardData(false);
    const html = template.evaluate()
      .setTitle('🎨 Multi-Select Trait Studio (v5.2.0)');
    SpreadsheetApp.getUi().showSidebar(html);
  } catch (error) {
    logError('showMultiSelectPicker', error);
    safeAlert_('❌ Error opening Multi-Select Studio: ' + error.message);
  }
}

/**
 * 📥 Pushes multi-select choices from Web App / Sidebar into PROMPT_BUILDER Column D
 * @param {Object} selections Map of section -> category -> array of strings
 */
function applyDashboardSelectionsToSheet(selections) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!sheet) {
      return { success: false, message: 'PROMPT_BUILDER sheet not found' };
    }
    
    const maxRows = sheet.getLastRow();
    let updatedCount = 0;
    
    for (let r = 8; r <= 28 && r <= maxRows; r++) {
      const secText = String(sheet.getRange(r, 2).getValue() || '').toLowerCase();
      const catText = String(sheet.getRange(r, 3).getValue() || '').trim();
      
      let sectionKey = null;
      if (secText.includes('character')) sectionKey = 'character';
      else if (secText.includes('scene')) sectionKey = 'scene';
      else if (secText.includes('camera') || secText.includes('shot')) sectionKey = 'camera';
      
      if (sectionKey && selections && selections[sectionKey]) {
        for (const [catName, items] of Object.entries(selections[sectionKey])) {
          if (catName.toLowerCase() === catText.toLowerCase() || catText.toLowerCase().includes(catName.toLowerCase())) {
            const valStr = Array.isArray(items) ? items.join(', ') : String(items || '');
            sheet.getRange(r, 4).setValue(valStr);
            updatedCount++;
            break;
          }
        }
      }
    }
    
    safeToast_(ss, '📥 Synced ' + updatedCount + ' categories to PROMPT_BUILDER!', '🎨 Studio Synced', 4);
    return { success: true, updatedCount: updatedCount };
  } catch (error) {
    logError('applyDashboardSelectionsToSheet', error);
    return { success: false, error: error.message };
  }
}

/**
 * ⚡ Optional: Sets up an installable edit trigger as fallback if simple onEdit is restricted
 */
function setupInstallableEditTrigger() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getUserTriggers(ss);
    const hasTrigger = triggers.some(t => t.getHandlerFunction() === 'onEdit');
    if (!hasTrigger) {
      ScriptApp.newTrigger('onEdit')
        .forSpreadsheet(ss)
        .onEdit()
        .create();
      safeAlert_('✅ Installable Edit Trigger installed successfully! Multi-select now has elevated permissions.');
    } else {
      safeAlert_('ℹ️ Installable Edit Trigger is already configured.');
    }
  } catch (err) {
    safeAlert_('⚠️ Note on Installable Trigger: ' + err.message);
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
      .addItem('☑️ Multi-Select Trait Studio (Sidebar)', 'showMultiSelectPicker')
      .addItem('📋 1-Click Copy Generated Prompt', 'showPromptCopyModal')
      .addSeparator()
      .addSubMenu(ui.createMenu('✨ Quick Presets (1-Click)')
        .addItem('🌆 Cyberpunk Noir', 'applyPresetCyberpunkNoir')
        .addItem('✨ Ethereal Fantasy', 'applyPresetEtherealFantasy')
        .addItem('🚀 Retro Synthwave', 'applyPresetRetroSynthwave')
        .addItem('🌌 Hyperrealistic Sci-Fi', 'applyPresetSciFi')
        .addItem('🏯 Cinematic Anime', 'applyPresetAnime')
        .addItem('🕯️ Gothic Dark Fantasy', 'applyPresetGothic')
        .addSeparator()
        .addItem('🎲 Random Inspiration', 'applyPresetRandom'))
      .addSeparator()
      .addItem('🚀 Send Prompt to Discord / Webhook', 'sendCurrentInSheetPromptToDiscord')
      .addItem('⚙️ Configure Discord Webhook URL', 'configureWebhookUrlPrompt')
      .addSeparator()
      .addItem('🚀 Reorganize Workbook to Columnar DBs', 'migrateToColumnarDBs')
      .addItem('✨ Setup / Rebuild In-Sheet Studio', 'setupPromptBuilderSheet')
      .addItem('🧹 Clear In-Sheet Selections', 'clearPromptBuilderSelections')
      .addItem('💾 Save In-Sheet Prompt to History Log', 'saveInSheetPromptToLog')
      .addItem('🔄 Refresh All Validations & Caches', 'refreshAllDropdowns')
      .addSeparator()
      .addItem('🧹 Clean Tab Bar (Hide [X] & Backend Tabs)', 'cleanTabBar')
      .addItem('🛡️ Studio Focus (Hide DBs Too)', 'cleanTabBarStudioFocus')
      .addSeparator()
      .addSubMenu(ui.createMenu('📁 Media Studio & Automation')
        .addItem('✨ Setup ALL Media Studio Sheets (1-Click)', 'setupAllMediaStudioSheets')
        .addSeparator()
        .addItem('🌐 Setup Web Resources Sheet', 'setupWebResourcesSheet')
        .addItem('🖼️ Setup Artwork Registry Sheet', 'setupArtworkRegistrySheet')
        .addItem('📅 Setup Production Queue Sheet', 'setupProductionQueueSheet')
        .addItem('🧠 Setup NotebookLM Sync Sheet', 'setupNotebookLMSyncSheet')
        .addSeparator()
        .addItem('🔄 Sync Drive Artwork Index Now', 'syncDriveArtworkIndex')
        .addItem('⚙️ Configure Drive Artwork Folder ID', 'configureDriveArtFolderPrompt')
        .addItem('⚙️ Configure NotebookLM Notebook ID', 'configureNotebookLMNotebookIdPrompt')
        .addItem('⏱️ Install Daily Drive Sync Trigger (6 AM)', 'installDailyDriveArtworkTrigger'))
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
      .addItem('⚡ Setup Installable Trigger (Multi-Select Fallback)', 'setupInstallableEditTrigger')
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
    
    const flattenVal = function(val) {
      if (!val) return;
      if (Array.isArray(val)) {
        val.forEach(function(v) { if (v) parts.push(String(v).trim()); });
      } else if (typeof val === 'string' && val.includes(',')) {
        val.split(',').forEach(function(v) {
          const trimmed = v.trim();
          if (trimmed) parts.push(trimmed);
        });
      } else {
        parts.push(String(val).trim());
      }
    };
    
    // Collect CHARACTER selections 👤
    if (selections && selections.character) {
      Object.values(selections.character).forEach(flattenVal);
    }
    
    // Collect SCENE selections 🎬
    if (selections && selections.scene) {
      Object.values(selections.scene).forEach(flattenVal);
    }
    
    // Collect CAMERA selections 📸
    if (selections && selections.camera) {
      Object.values(selections.camera).forEach(flattenVal);
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
  
  const formatVal = function(v) {
    if (Array.isArray(v)) return v.join(', ');
    return String(v);
  };

  if (selections.character && Object.keys(selections.character).length > 0) {
    output += '👤 CHARACTER:\n';
    Object.entries(selections.character).forEach(([cat, val]) => {
      if (val) output += `  • ${cat}: ${formatVal(val)}\n`;
    });
    output += '\n';
  }
  
  if (selections.scene && Object.keys(selections.scene).length > 0) {
    output += '🎬 SCENE:\n';
    Object.entries(selections.scene).forEach(([cat, val]) => {
      if (val) output += `  • ${cat}: ${formatVal(val)}\n`;
    });
    output += '\n';
  }
  
  if (selections.camera && Object.keys(selections.camera).length > 0) {
    output += '📸 CAMERA:\n';
    Object.entries(selections.camera).forEach(([cat, val]) => {
      if (val) output += `  • ${cat}: ${formatVal(val)}\n`;
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
  const countItems = function(secObj) {
    if (!secObj) return 0;
    let total = 0;
    Object.values(secObj).forEach(function(v) {
      if (Array.isArray(v)) total += v.length;
      else if (v) total++;
    });
    return total;
  };

  const charCount = countItems(selections.character);
  const sceneCount = countItems(selections.scene);
  const cameraCount = countItems(selections.camera);
  
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
        const val = sectionSelections[category];
        if (!val) return;
        if (Array.isArray(val)) {
          val.forEach(function(item) {
            const trimmed = String(item || '').trim();
            if (trimmed) {
              sheet.appendRow([category, trimmed, 'Dashboard', timestamp]);
              rowsAppended++;
            }
          });
        } else if (typeof val === 'string' && val.includes(',')) {
          val.split(',').forEach(function(item) {
            const trimmed = item.trim();
            if (trimmed) {
              sheet.appendRow([category, trimmed, 'Dashboard', timestamp]);
              rowsAppended++;
            }
          });
        } else {
          sheet.appendRow([category, String(val).trim(), 'Dashboard', timestamp]);
          rowsAppended++;
        }
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

// Note: onEdit(e) multi-select and live trigger is canonically implemented above at line 263.

// Note: clearPromptBuilderSelections is canonically implemented below at line 2481 with dynamic category bounds and safe toast.

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
    
    // 4. Row 5 (Cols B to E) - Real-time Character Length & Safety Bar
    const lengthBarTop = sheet.getRange('B5:E5');
    lengthBarTop.merge()
      .setBackground('#0f172a')
      .setFontColor('#38bdf8')
      .setFontWeight('bold')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(5, 24);
    
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
      .setValue('✨ Multi-Select Enabled: Pick dropdowns in Col D to append traits (or re-select to toggle off). Or use Menu → 🎨 AI Prompt Builder → ☑️ Multi-Select Trait Studio')
      .setBackground('#f8fafc')
      .setFontColor('#475569')
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
    
    // Set dynamic prompt formulas & real-time character limit indicator
    if (lastCategoryRow >= 8) {
      lengthBarTop.setFormula(
        '=IF(COUNTA(D8:D' + lastCategoryRow + ')=0, "📏 Length: 0 chars | AI Generator Status: ⚪ Awaiting Selection", ' +
        '"📏 Clean Prompt Length: " & LEN(B2) & " chars | Midjourney (1,000 cap): " & ' +
        'IF(LEN(B2)<=1000, "🟢 SAFE (" & (1000-LEN(B2)) & " chars remaining)", "⚠️ EXCEEDS BY " & (LEN(B2)-1000) & " CHARS") & ' +
        '" | Discord (2,000 cap): " & IF(LEN(B2)<=2000, "🟢 SAFE", "⚠️ OVER"))'
      );
      
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 DYNAMIC OUTPUT & STRUCTURED MESSAGE CARD (DEBT DISPUTE PATTERN)
    // ═══════════════════════════════════════════════════════════════════════════
    const outStart = lastCategoryRow + 2; // Row 29
    sheet.setRowHeight(outStart - 1, 16); // Row 28 spacer

    // 1. Output Banner Header
    const outBanner = sheet.getRange('B' + outStart + ':E' + outStart);
    outBanner.merge()
      .setValue('📋 COMPLETE ASSEMBLED PROMPT & MULTI-LINE BREAKDOWN')
      .setBackground('#1e293b')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(11)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(outStart, 32);

    // 2. Subheader
    const outSub = sheet.getRange('B' + (outStart + 1) + ':E' + (outStart + 1));
    outSub.merge()
      .setValue('✨ Real-time dynamic composition from single & multi-selected traits above — Ready to copy!')
      .setBackground('#f8fafc')
      .setFontColor('#64748b')
      .setFontStyle('italic')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 1, 22);

    // 3. Full Clean Prompt Box (Rows outStart + 2 to outStart + 4)
    const promptBoxBottom = sheet.getRange('B' + (outStart + 2) + ':E' + (outStart + 4));
    promptBoxBottom.merge()
      .setFormula('=B2')
      .setBackground('#f8fafc')
      .setFontColor('#0f172a')
      .setFontWeight('bold')
      .setFontSize(11)
      .setWrap(true)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('top');
    promptBoxBottom.setBorder(true, true, true, true, false, false, '#6366f1', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    sheet.setRowHeight(outStart + 2, 26);
    sheet.setRowHeight(outStart + 3, 26);
    sheet.setRowHeight(outStart + 4, 26);

    // 4. Spacing
    sheet.setRowHeight(outStart + 5, 10);

    // 5. Section Breakdown Header
    const secHeader = sheet.getRange('B' + (outStart + 6) + ':E' + (outStart + 6));
    secHeader.merge()
      .setValue('🏷️ STRUCTURED SECTION BREAKDOWN')
      .setBackground('#334155')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 6, 26);

    // 6. Section Rows
    // Character (Rows 8 to 15)
    sheet.getRange(outStart + 7, 2).setValue('👤 Character Design')
      .setBackground('#eff6ff').setFontColor('#1d4ed8').setFontWeight('bold').setVerticalAlignment('middle');
    const charBreakdown = sheet.getRange('C' + (outStart + 7) + ':E' + (outStart + 7));
    charBreakdown.merge()
      .setFormula('=IF(COUNTA(D8:D15)=0, "—", TEXTJOIN(", ", TRUE, D8:D15))')
      .setFontColor('#0f172a').setFontWeight('medium').setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 7, 26);

    // Scene (Rows 16 to 21)
    sheet.getRange(outStart + 8, 2).setValue('🎬 Scene Settings')
      .setBackground('#ecfdf5').setFontColor('#047857').setFontWeight('bold').setVerticalAlignment('middle');
    const sceneBreakdown = sheet.getRange('C' + (outStart + 8) + ':E' + (outStart + 8));
    sceneBreakdown.merge()
      .setFormula('=IF(COUNTA(D16:D21)=0, "—", TEXTJOIN(", ", TRUE, D16:D21))')
      .setFontColor('#0f172a').setFontWeight('medium').setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 8, 26);

    // Camera (Rows 22 to 27)
    sheet.getRange(outStart + 9, 2).setValue('📸 Camera & Concept')
      .setBackground('#f5f3ff').setFontColor('#6d28d9').setFontWeight('bold').setVerticalAlignment('middle');
    const cameraBreakdown = sheet.getRange('C' + (outStart + 9) + ':E' + (outStart + 9));
    cameraBreakdown.merge()
      .setFormula('=IF(COUNTA(D22:D27)=0, "—", TEXTJOIN(", ", TRUE, D22:D27))')
      .setFontColor('#0f172a').setFontWeight('medium').setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 9, 26);

    // Border for section breakdown table
    sheet.getRange(outStart + 7, 2, 3, 4).setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);

    // 7. Spacing
    sheet.setRowHeight(outStart + 10, 10);

    // 8. Formatted Multi-Line Message Card (Debt Dispute Replica!)
    const cardHeader = sheet.getRange('B' + (outStart + 11) + ':E' + (outStart + 11));
    cardHeader.merge()
      .setValue('💬 FORMATTED MULTI-LINE PROMPT (COPY CARD)')
      .setBackground('#1e293b')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 11, 26);

    const multiLineFormula =
      '=IF(COUNTA(D8:D' + lastCategoryRow + ')=0, ' +
      '"✨ Pick dropdown options above to generate your structured prompt...", ' +
      '"🎨 AI ART GENERATION PROMPT:" & CHAR(10) & ' +
      'IF(COUNTA(D8:D15)>0, "👤 CHARACTER: " & TEXTJOIN(", ", TRUE, D8:D15) & CHAR(10), "") & ' +
      'IF(COUNTA(D16:D21)>0, "🎬 SCENE: " & TEXTJOIN(", ", TRUE, D16:D21) & CHAR(10), "") & ' +
      'IF(COUNTA(D22:D27)>0, "📸 CAMERA: " & TEXTJOIN(", ", TRUE, D22:D27) & CHAR(10), "") & ' +
      'CHAR(10) & "⚡ FULL COMMAND: GENERATE AN IMAGE: " & B2)';

    const cardBox = sheet.getRange('B' + (outStart + 12) + ':E' + (outStart + 15));
    cardBox.merge()
      .setFormula(multiLineFormula)
      .setBackground('#fffbeb')
      .setFontColor('#78350f')
      .setFontWeight('bold')
      .setFontSize(10)
      .setWrap(true)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('top');
    cardBox.setBorder(true, true, true, true, false, false, '#f59e0b', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    sheet.setRowHeight(outStart + 12, 24);
    sheet.setRowHeight(outStart + 13, 24);
    sheet.setRowHeight(outStart + 14, 24);
    sheet.setRowHeight(outStart + 15, 24);

    // 9. Card Length & Discord Safety Bar (Row outStart + 16)
    const cardLengthBar = sheet.getRange('B' + (outStart + 16) + ':E' + (outStart + 16));
    cardLengthBar.merge()
      .setFormula(
        '=IF(COUNTA(D8:D' + lastCategoryRow + ')=0, "", ' +
        '"📏 Card Length: " & LEN(B' + (outStart + 12) + ') & " chars | Discord Webhook (2,000 max): " & ' +
        'IF(LEN(B' + (outStart + 12) + ')<=2000, "🟢 Ready to dispatch (" & (2000-LEN(B' + (outStart + 12) + ')) & " chars available)", "⚠️ Exceeds Discord 2,000 limit"))'
      )
      .setBackground('#fef3c7')
      .setFontColor('#92400e')
      .setFontWeight('bold')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 16, 22);

    // 10. Direct Webhook & Quick Action Guidance (Row outStart + 17)
    const actionGuidance = sheet.getRange('B' + (outStart + 17) + ':E' + (outStart + 17));
    actionGuidance.merge()
      .setValue('🚀 Send to Discord/Agent: Menu → 🎨 AI Prompt Builder → 🚀 Send Prompt to Discord / Webhook')
      .setBackground('#eff6ff')
      .setFontColor('#1e40af')
      .setFontWeight('bold')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(outStart + 17, 22);

    // Clear any leftover rows below the bottom card
    const finalRow = outStart + 19;
    const maxSheetRows = sheet.getMaxRows();
    if (maxSheetRows > finalRow) {
      const leftover = maxSheetRows - finalRow + 1;
      if (leftover > 0) {
        sheet.getRange(finalRow, 1, leftover, sheet.getMaxColumns()).clear();
      }
    }
    
    safeToast_(ss, 'Prompt Builder studio is ready! 🎨 Includes Multi-Select & Dynamic Breakdown Card.', '✅ Studio Configured', 4);
    return { success: true, totalCategories: lastCategoryRow - 7, finalRow: finalRow };
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
 * 🧹 Clears only user dropdown selections in Column D of PROMPT_BUILDER (rows 8 to category end)
 * Preserves all formula cards, headers, validations, and formatting intact!
 */
function clearPromptBuilderSelections() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!sheet) {
      safeAlert_('⚠️ PROMPT_BUILDER sheet not found.');
      return { success: false, message: 'Sheet not found' };
    }
    
    // Find category rows dynamically (starts row 8, ends before spacer or output banner)
    let lastCatRow = 27;
    const maxRows = sheet.getLastRow();
    for (let r = 8; r <= maxRows; r++) {
      const bVal = String(sheet.getRange(r, 2).getValue() || '');
      if (bVal.includes('COMPLETE ASSEMBLED') || bVal.includes('STRUCTURED') || bVal.includes('FORMATTED') || !bVal) {
        lastCatRow = r - 2;
        break;
      }
      lastCatRow = r;
    }
    if (lastCatRow < 8) lastCatRow = 27;
    
    sheet.getRange('D8:D' + lastCatRow).clearContent();
    safeToast_(ss, 'In-sheet dropdown selections cleared! All prompt cards reset.', '🧹 Selections Cleared', 4);
    return { success: true, clearedRows: lastCatRow - 7 };
  } catch (error) {
    logError('clearPromptBuilderSelections', error);
    safeAlert_('❌ Error clearing selections: ' + error.message);
    return { success: false, error: error.message };
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
    
    // Find the category boundary so we never ingest bottom output cards
    let lastCatRow = 27;
    const maxRows = pbSheet.getLastRow();
    for (let r = 8; r <= maxRows; r++) {
      const bVal = String(pbSheet.getRange(r, 2).getValue() || '');
      if (bVal.includes('COMPLETE ASSEMBLED') || bVal.includes('STRUCTURED') || bVal.includes('FORMATTED') || !bVal) {
        lastCatRow = r - 2;
        break;
      }
      lastCatRow = r;
    }
    if (lastCatRow < 8) return;
    
    const tableData = pbSheet.getRange(8, 2, lastCatRow - 7, 3).getValues(); // Cols B, C, D
    const selections = { character: {}, scene: {}, camera: {} };
    
    tableData.forEach(function(row) {
      const secName = String(row[0] || '').toLowerCase();
      const catName = String(row[1] || '').trim();
      const val = String(row[2] || '').trim();
      if (!val || secName.includes('complete') || secName.includes('structured') || secName.includes('formatted')) return;
      
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

// ═══════════════════════════════════════════════════════════════════════════
// ✨ CURATED QUICK PRESETS & INSPIRATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const PRESETS = {
  cyberpunk: {
    name: 'Cyberpunk Noir',
    icon: '🌆',
    description: 'Neon-soaked dystopian mystery with volumetric rain and sharp reflections',
    selections: {
      character: { 'Gender': 'Cyborg Detective', 'Attire': 'Neon Trenchcoat', 'Hair': 'Undercut Hologram' },
      scene: { 'Setting': 'Rainy Neo-Tokyo Rooftop', 'Lighting': 'Volumetric Neon Glow', 'Atmosphere': 'Cyberpunk Dystopian' },
      camera: { 'Shot Type': 'Cinematic Wide Angle', 'Lens': 'Anamorphic Lens' }
    }
  },
  fantasy: {
    name: 'Ethereal Fantasy',
    icon: '✨',
    description: 'Enchanted mystical realms with celestial lighting and braided silk',
    selections: {
      character: { 'Gender': 'Elf Sorceress', 'Attire': 'Flowing Celestial Silk', 'Hair': 'Silver Braided' },
      scene: { 'Setting': 'Enchanted Bioluminescent Forest', 'Lighting': 'Golden Hour God Rays', 'Atmosphere': 'Mystical Dreamscape' },
      camera: { 'Shot Type': 'Medium Portrait', 'Lens': 'Macro Bokeh Depth' }
    }
  },
  synthwave: {
    name: 'Retro Synthwave',
    icon: '🚀',
    description: '1984 wireframe aesthetic with magenta sunsets and chrome leather',
    selections: {
      character: { 'Gender': 'Futuristic Pilot', 'Attire': 'Chrome Leather Jacket' },
      scene: { 'Setting': 'Endless Grid Horizon 1984', 'Lighting': 'Purple Magenta Sunset', 'Atmosphere': 'Retro 80s Nostalgia' },
      camera: { 'Shot Type': 'Low Angle Hero Shot', 'Lens': 'VHS Film Grain' }
    }
  },
  scifi: {
    name: 'Hyperrealistic Sci-Fi',
    icon: '🌌',
    description: 'Deep space exploration with IMAX clarity and high-tech exosuits',
    selections: {
      character: { 'Gender': 'Deep Space Astronaut', 'Attire': 'High-Tech Exosuit' },
      scene: { 'Setting': 'Orbital Space Station Over Earth', 'Lighting': 'Harsh Solar Flare', 'Atmosphere': 'Zero Gravity Cinematic' },
      camera: { 'Shot Type': 'Ultra-Wide Establishing Shot', 'Lens': 'IMAX 70mm Sharp' }
    }
  },
  anime: {
    name: 'Cinematic Anime',
    icon: '🏯',
    description: 'Wind-swept cherry blossom shrine with hand-painted Ghibli warmth',
    selections: {
      character: { 'Gender': 'Samurai Wanderer', 'Attire': 'Traditional Haori & Katana' },
      scene: { 'Setting': 'Cherry Blossom Shrine in Wind', 'Lighting': 'Soft Pastel Twilight', 'Atmosphere': 'Studio Ghibli Aesthetic' },
      camera: { 'Shot Type': 'Dynamic Action Pose', 'Lens': 'Anime Shintaku Cel' }
    }
  },
  gothic: {
    name: 'Gothic Dark Fantasy',
    icon: '🕯️',
    description: 'Haunted ruins illuminated by candlelight and silver moonlight',
    selections: {
      character: { 'Gender': 'Vampire Aristocrat', 'Attire': 'Victorian Velvet Cape' },
      scene: { 'Setting': 'Haunted Cathedral Ruins', 'Lighting': 'Flickering Candlelight & Moonlight', 'Atmosphere': 'Ominous Foggy Eldritch' },
      camera: { 'Shot Type': 'Close-Up Dramatic Portrait', 'Lens': 'Dark Chiaroscuro 35mm' }
    }
  }
};

/**
 * ✨ Applies a curated preset to the in-sheet PROMPT_BUILDER studio
 */
function applyPresetToSheet(presetKey) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!sheet) {
      safeAlert_('⚠️ PROMPT_BUILDER sheet not found. Please run "Setup / Rebuild In-Sheet Studio" first.');
      return { success: false, message: 'Sheet not found' };
    }

    const preset = PRESETS[presetKey];
    if (!preset) {
      safeAlert_('⚠️ Preset "' + presetKey + '" not recognized.');
      return { success: false, message: 'Unknown preset' };
    }

    // Clear existing dropdown selections (D8:D27)
    sheet.getRange('D8:D27').clearContent();

    const maxRows = sheet.getLastRow();
    let appliedCount = 0;

    for (let r = 8; r <= 27 && r <= maxRows; r++) {
      const secText = String(sheet.getRange(r, 2).getValue() || '').toLowerCase();
      const catText = String(sheet.getRange(r, 3).getValue() || '').trim();

      let targetSec = null;
      if (secText.includes('character')) targetSec = preset.selections.character;
      else if (secText.includes('scene')) targetSec = preset.selections.scene;
      else if (secText.includes('camera') || secText.includes('shot')) targetSec = preset.selections.camera;

      if (targetSec) {
        for (const [pCat, pVal] of Object.entries(targetSec)) {
          if (pCat.toLowerCase() === catText.toLowerCase() || catText.toLowerCase().includes(pCat.toLowerCase())) {
            sheet.getRange(r, 4).setValue(pVal);
            appliedCount++;
            break;
          }
        }
      }
    }

    safeToast_(ss, `${preset.icon} Preset "${preset.name}" applied! (${appliedCount} traits loaded)`, '✨ Preset Applied', 4);
    return { success: true, preset: preset.name, appliedCount: appliedCount };
  } catch (error) {
    logError('applyPresetToSheet', error);
    safeAlert_('❌ Error applying preset: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 🎲 Random Inspiration: Picks 1 random trait from each column across DBs
 */
function applyPresetRandom() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!sheet) return;

    sheet.getRange('D8:D27').clearContent();

    let appliedCount = 0;
    for (let r = 8; r <= 27; r++) {
      const secText = String(sheet.getRange(r, 2).getValue() || '').toLowerCase();
      const catText = String(sheet.getRange(r, 3).getValue() || '').trim();
      if (!catText) continue;

      let dbSheetName = 'DB_Character';
      if (secText.includes('scene')) dbSheetName = 'DB_Scene';
      else if (secText.includes('camera')) dbSheetName = 'DB_Camera';

      const dbSheet = getSheetByAnyName(ss, dbSheetName);
      if (!dbSheet) continue;

      const lastCol = dbSheet.getLastColumn();
      const lastRow = dbSheet.getLastRow();
      if (lastCol < 1 || lastRow < 2) continue;

      const headers = dbSheet.getRange(1, 1, 1, lastCol).getValues()[0];
      for (let c = 0; c < lastCol; c++) {
        if (String(headers[c] || '').trim().toLowerCase() === catText.toLowerCase()) {
          const colVals = dbSheet.getRange(2, c + 1, lastRow - 1, 1).getValues()
            .map(v => String(v[0] || '').trim())
            .filter(v => v && !looksNumeric(v) && !v.startsWith('#'));
          if (colVals.length > 0) {
            const randomVal = colVals[Math.floor(Math.random() * colVals.length)];
            sheet.getRange(r, 4).setValue(randomVal);
            appliedCount++;
          }
          break;
        }
      }
    }

    safeToast_(ss, `🎲 Random Inspiration loaded with ${appliedCount} traits!`, '🎲 Random Inspiration', 4);
    return { success: true, appliedCount: appliedCount };
  } catch (error) {
    logError('applyPresetRandom', error);
    safeAlert_('❌ Error generating random preset: ' + error.message);
  }
}

// Preset wrapper functions for Google Sheets menu items
function applyPresetCyberpunkNoir() { return applyPresetToSheet('cyberpunk'); }
function applyPresetEtherealFantasy() { return applyPresetToSheet('fantasy'); }
function applyPresetRetroSynthwave() { return applyPresetToSheet('synthwave'); }
function applyPresetSciFi() { return applyPresetToSheet('scifi'); }
function applyPresetAnime() { return applyPresetToSheet('anime'); }
function applyPresetGothic() { return applyPresetToSheet('gothic'); }

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 DISCORD & LOCAL AI AGENT ECOSYSTEM WEBHOOK ENGINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🚀 Dispatches prompt text to Discord or a local AI agent ecosystem webhook
 */
function sendPromptToWebhook(promptText, customUrl) {
  try {
    const text = String(promptText || '').trim();
    if (!text || text.startsWith('✨') || text.startsWith('❌')) {
      return { success: false, message: 'No prompt text to send. Please make selections first.' };
    }

    const props = PropertiesService.getScriptProperties();
    const webhookUrl = (customUrl && String(customUrl).trim()) || props.getProperty('DISCORD_WEBHOOK_URL');

    if (!webhookUrl) {
      return {
        success: false,
        needUrl: true,
        message: 'No Webhook URL configured. Please set your Discord Webhook URL first.'
      };
    }

    // Split into chunks if text exceeds Discord 2,000 char limit
    const chunks = [];
    if (text.length <= 1950) {
      chunks.push(text);
    } else {
      let remaining = text;
      while (remaining.length > 0) {
        if (remaining.length <= 1950) {
          chunks.push(remaining);
          break;
        }
        let breakIdx = remaining.lastIndexOf('\n', 1950);
        if (breakIdx === -1) breakIdx = remaining.lastIndexOf(' ', 1950);
        if (breakIdx === -1) breakIdx = 1950;
        chunks.push(remaining.substring(0, breakIdx).trim());
        remaining = remaining.substring(breakIdx).trim();
      }
    }

    let allSucceeded = true;
    chunks.forEach(function(chunk, idx) {
      const payload = {
        username: 'AI Art Prompt Studio 🎨',
        avatar_url: 'https://img.icons8.com/color/512/paint-palette.png',
        content: (chunks.length > 1 ? `**[Part ${idx + 1}/${chunks.length}]**\n` : '') + chunk
      };

      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(webhookUrl, options);
      const code = response.getResponseCode();
      if (code < 200 || code >= 300) {
        allSucceeded = false;
        console.warn('Webhook HTTP ' + code + ': ' + response.getContentText());
      }
    });

    if (allSucceeded) {
      return { success: true, message: '🚀 Prompt dispatched to Discord / Webhook successfully! (' + text.length + ' chars)' };
    } else {
      return { success: false, message: 'Webhook endpoint returned an HTTP error response.' };
    }
  } catch (error) {
    logError('sendPromptToWebhook', error);
    return { success: false, error: error.message };
  }
}

/**
 * 🚀 Sends current prompt from PROMPT_BUILDER (Debt Dispute card or B2) to Discord Webhook
 */
function sendCurrentInSheetPromptToDiscord() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetByAnyName(ss, CONFIG.SHEETS.PROMPT_BUILDER);
    if (!sheet) {
      safeAlert_('⚠️ PROMPT_BUILDER sheet not found.');
      return;
    }

    let promptText = '';
    const lastRow = sheet.getLastRow();
    for (let r = 28; r <= lastRow; r++) {
      const bVal = String(sheet.getRange(r, 2).getValue() || '');
      if (bVal.includes('AI ART GENERATION PROMPT:')) {
        promptText = bVal;
        break;
      }
    }
    if (!promptText) {
      promptText = String(sheet.getRange('B2').getValue() || '').trim();
    }

    if (!promptText || promptText.includes('Pick dropdown options') || promptText.includes('Awaiting Selection')) {
      safeAlert_('⚠️ Please select some options before sending to Discord.');
      return;
    }

    const res = sendPromptToWebhook(promptText);
    if (res.needUrl) {
      configureWebhookUrlPrompt(promptText);
    } else if (res.success) {
      safeToast_(ss, res.message, '🚀 Discord Dispatched', 5);
    } else {
      safeAlert_('❌ Webhook error: ' + (res.message || res.error));
    }
  } catch (error) {
    logError('sendCurrentInSheetPromptToDiscord', error);
    safeAlert_('❌ Error sending to Discord: ' + error.message);
  }
}

/**
 * ⚙️ Prompts user to input or update Discord / Agent Webhook URL
 */
function configureWebhookUrlPrompt(pendingPromptToSend) {
  try {
    const ui = SpreadsheetApp.getUi();
    const props = PropertiesService.getScriptProperties();
    const current = props.getProperty('DISCORD_WEBHOOK_URL') || '';

    const resp = ui.prompt(
      '⚙️ Discord & Agent Webhook Configuration',
      'Paste your Discord Webhook URL (or local agent bridge URL):\n\n' +
      (current ? 'Current: ' + current.substring(0, 35) + '...' : 'Currently not set'),
      ui.ButtonSet.OK_CANCEL
    );

    if (resp.getSelectedButton() === ui.Button.OK) {
      const newUrl = resp.getResponseText().trim();
      if (newUrl) {
        props.setProperty('DISCORD_WEBHOOK_URL', newUrl);
        ui.alert('✅ Webhook URL saved successfully!');
        if (pendingPromptToSend) {
          const res = sendPromptToWebhook(pendingPromptToSend, newUrl);
          if (res.success) {
            SpreadsheetApp.getActiveSpreadsheet().toast('🚀 Prompt sent to Discord!', 'Sent', 4);
          }
        }
      }
    }
  } catch (error) {
    logError('configureWebhookUrlPrompt', error);
  }
}

function setDiscordWebhookUrl(url) {
  try {
    PropertiesService.getScriptProperties().setProperty('DISCORD_WEBHOOK_URL', String(url || '').trim());
    return { success: true, message: 'Webhook URL updated' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function getDiscordWebhookUrl() {
  try {
    const u = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL') || '';
    return {
      success: true,
      hasUrl: Boolean(u),
      maskedUrl: u ? (u.substring(0, 30) + '...****') : ''
    };
  } catch (e) {
    return { success: false, error: e.message };
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

// ═══════════════════════════════════════════════════════════════════════════
// 📑 TAB BAR MANAGEMENT & CLEANUP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🧹 Clean Tab Bar: Automatically hides all archived legacy tabs ([X] ...)
 * and internal staging/utility tabs (ALIAS, RAW_AI_DATA, IMPORT_DB, HELP_DB).
 * Ensures PROMPT_BUILDER or Overview remains visible and active.
 */
function cleanTabBar(options) {
  try {
    const opts = options || {};
    const hideDbs = opts.hideDbs === true;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Ensure primary studio tab is visible and active first
    const primaryTab = ss.getSheetByName(CONFIG.SHEETS.PROMPT_BUILDER) || 
                       ss.getSheetByName('📋 Overview') || 
                       ss.getSheets()[0];
    if (primaryTab) {
      if (primaryTab.isSheetHidden()) {
        primaryTab.showSheet();
      }
      ss.setActiveSheet(primaryTab);
    }

    // Auto-archive legacy Image Prompts tab if present without prefix
    try {
      const imgSheet = ss.getSheetByName('Image Prompts');
      if (imgSheet && !ss.getSheetByName('[X] Image Prompts')) {
        imgSheet.setName('[X] Image Prompts');
        imgSheet.setTabColor('#94a3b8');
        console.log('🏷️ Auto-archived Image Prompts → [X] Image Prompts');
      }
    } catch (e) {
      console.warn('Note auto-archiving Image Prompts: ' + e.message);
    }

    const backendNames = new Set([
      'ALIAS',
      'RAW_AI_DATA',
      'IMPORT_DB',
      'HELP_DB',
      'Image Prompts',
      '[X] Image Prompts'
    ]);

    const dbNames = new Set([
      CONFIG.SHEETS.CHARACTER, // DB_Character
      CONFIG.SHEETS.SCENE,     // DB_Scene
      CONFIG.SHEETS.CAMERA,    // DB_Camera
      'Video'
    ]);

    const allSheets = ss.getSheets();
    const newlyHidden = [];
    const alreadyHidden = [];
    const keptVisible = [];

    allSheets.forEach(function(sheet) {
      const name = sheet.getName();
      const isLegacy = name.trim().startsWith('[X]');
      const isBackend = backendNames.has(name);
      const isDb = hideDbs && dbNames.has(name);

      // Primary studio, log, and overview should never be auto-hidden
      const isProtected = (name === CONFIG.SHEETS.PROMPT_BUILDER || name === 'History/Log' || name === '📋 Overview');

      if (!isProtected && (isLegacy || isBackend || isDb)) {
        if (!sheet.isSheetHidden()) {
          try {
            sheet.hideSheet();
            newlyHidden.push(name);
          } catch (e) {
            console.warn('Could not hide sheet ' + name + ': ' + e.message);
          }
        } else {
          alreadyHidden.push(name);
        }
      } else {
        keptVisible.push(name);
      }
    });

    const totalHidden = newlyHidden.length + alreadyHidden.length;
    const modeLabel = hideDbs ? 'Studio Focus' : 'Standard';
    const msg = '🧹 Tab bar cleaned (' + modeLabel + ')! ' + totalHidden + ' backend/archived tab(s) hidden. ' + keptVisible.length + ' active tab(s) visible.';
    console.log(msg);
    safeToast_(ss, msg, '🧹 Clean Tab Bar', 4);
    return {
      ok: true,
      action: 'clean_tab_bar',
      mode: hideDbs ? 'studio_focus' : 'standard',
      newlyHidden: newlyHidden,
      alreadyHidden: alreadyHidden,
      totalHidden: totalHidden,
      visibleCount: keptVisible.length,
      visibleSheets: keptVisible
    };
  } catch (error) {
    logError('cleanTabBar', error);
    return { ok: false, error: error.message };
  }
}

/**
 * 🛡️ Studio Focus mode: Hides backend/archived tabs AND database reference tabs,
 * keeping only the interactive studio, overview, and history log.
 */
function cleanTabBarStudioFocus() {
  return cleanTabBar({ hideDbs: true });
}

/**
 * 👁️ Unhide All Tabs: Restores visibility for all sheets in the workbook.
 */
function unhideAllTabs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const allSheets = ss.getSheets();
    let unhiddenCount = 0;
    const revealedSheets = [];

    allSheets.forEach(function(sheet) {
      if (sheet.isSheetHidden()) {
        try {
          sheet.showSheet();
          unhiddenCount++;
          revealedSheets.push(sheet.getName());
        } catch (e) {
          console.warn('Could not unhide sheet ' + sheet.getName() + ': ' + e.message);
        }
      }
    });

    const msg = '👁️ Unhid all tabs! ' + unhiddenCount + ' tab(s) restored. Total visible: ' + allSheets.length + '.';
    console.log(msg);
    safeToast_(ss, msg, '👁️ Unhide Tabs', 4);
    return {
      ok: true,
      action: 'unhide_all_tabs',
      unhiddenCount: unhiddenCount,
      revealedSheets: revealedSheets,
      totalSheets: allSheets.length
    };
  } catch (error) {
    logError('unhideAllTabs', error);
    return { ok: false, error: error.message };
  }
}