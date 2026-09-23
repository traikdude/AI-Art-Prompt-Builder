/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔌 AGENT API — JSON web-app endpoint (Goal G3, milestone M2)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * GET  ?action=health
 * GET  ?action=categories[&section=character|scene|camera]
 * GET  ?action=prompt&character.Gender=Male&scene.Lighting=Volumetric&camera.Shot%20Type=Wide%20Shot
 * POST { "action": "prompt", "selections": { "character": {...}, "scene": {...}, "camera": {...} },
 *        "formats": true }
 *
 * Optional auth: if Script Property PROMPT_API_TOKEN is set, every request must carry
 * ?token=... (GET) or "token" in the JSON body (POST). Unset = open read-only access.
 * All responses: { ok: boolean, action, data | error, version }
 */

const API_VERSION = '5.2.0-api3';

function doGet(e) {
  return apiHandle_(e, 'GET');
}

function doPost(e) {
  return apiHandle_(e, 'POST');
}

/**
 * 🧭 Single dispatcher for GET and POST.
 */
function apiHandle_(e, method) {
  try {
    const req = apiParseRequest_(e, method);
    const authError = apiCheckToken_(req.token);
    if (authError) return apiJson_({ ok: false, action: req.action, error: authError });

    switch (req.action) {
      case 'health':
        return apiJson_({ ok: true, action: 'health', data: { time: new Date().toISOString(), method: method } });
      case 'categories':
        return apiJson_({ ok: true, action: 'categories', data: apiCategories_(req.section) });
      case 'prompt':
        return apiJson_(apiPrompt_(req.selections, req.formats));
      case 'archive_diff':
        return apiJson_({ ok: true, action: 'archive_diff', data: apiArchiveDiff_(req.section) });
      case 'setup_sheet':
        return apiJson_({ ok: true, action: 'setup_sheet', data: setupPromptBuilderSheet() });
      case 'inspect_sheets':
        return apiJson_({ ok: true, action: 'inspect_sheets', data: apiInspectSheets_() });
      case 'inspect_tab':
        return apiJson_({ ok: true, action: 'inspect_tab', data: apiInspectTab_(e) });
      case 'migrate_to_columnar':
      case 'reorganize':
        return apiJson_({ ok: true, action: 'migrate_to_columnar', data: migrateToColumnarDBs() });
      case 'archive_old_log':
        return apiJson_({ ok: true, action: 'archive_old_log', data: archiveSelectionsLog() });
      case 'archive_image_prompts':
        return apiJson_({ ok: true, action: 'archive_image_prompts', data: archiveImagePrompts() });
      case 'clean_tab_bar':
        return apiJson_({ ok: true, action: 'clean_tab_bar', data: cleanTabBar() });
      case 'clean_tab_bar_focus':
        return apiJson_({ ok: true, action: 'clean_tab_bar_focus', data: cleanTabBarStudioFocus() });
      case 'unhide_all_tabs':
        return apiJson_({ ok: true, action: 'unhide_all_tabs', data: unhideAllTabs() });
      case 'clear_selections':
        return apiJson_({ ok: true, action: 'clear_selections', data: clearPromptBuilderSelections() });
      case 'presets':
        return apiJson_({ ok: true, action: 'presets', data: PRESETS });
      case 'apply_preset':
        return apiJson_({ ok: true, action: 'apply_preset', data: applyPresetToSheet(req.preset || (e && e.parameter && e.parameter.preset) || 'cyberpunk') });
      case 'send_webhook':
        return apiJson_({ ok: true, action: 'send_webhook', data: sendPromptToWebhook(req.promptText || (e && e.parameter && e.parameter.prompt), req.webhookUrl || (e && e.parameter && e.parameter.url)) });
      case 'get_webhook':
        return apiJson_({ ok: true, action: 'get_webhook', data: getDiscordWebhookUrl() });
      case 'set_webhook':
        return apiJson_({ ok: true, action: 'set_webhook', data: setDiscordWebhookUrl(req.webhookUrl || (e && e.parameter && e.parameter.url)) });
      case 'apply_selections':
        return apiJson_({ ok: true, action: 'apply_selections', data: applyDashboardSelectionsToSheet(req.selections || {}) });
      case 'setup_media_studio':
        return apiJson_({ ok: true, action: 'setup_media_studio', data: setupAllMediaStudioSheets() });
      case 'web_resources':
      case 'resources':
        return apiJson_({ ok: true, action: 'web_resources', data: apiGetTableData_(MEDIA_STUDIO_CONFIG.TABS.WEB_RESOURCES) });
      case 'artwork_registry':
      case 'artwork':
        return apiJson_({ ok: true, action: 'artwork_registry', data: apiGetTableData_(MEDIA_STUDIO_CONFIG.TABS.ARTWORK_REGISTRY) });
      case 'production_queue':
      case 'queue':
        return apiJson_({ ok: true, action: 'production_queue', data: apiGetTableData_(MEDIA_STUDIO_CONFIG.TABS.PRODUCTION_QUEUE) });
      case 'notebooklm_sync':
      case 'notebooklm':
        return apiJson_({ ok: true, action: 'notebooklm_sync', data: apiGetTableData_(MEDIA_STUDIO_CONFIG.TABS.NOTEBOOKLM_SYNC) });
      case 'sync_drive_artwork':
        return apiJson_({ ok: true, action: 'sync_drive_artwork', data: syncDriveArtworkIndex() });
      default:
        return apiJson_({ ok: false, action: req.action, error: 'Unknown action. Use health | categories | prompt | setup_sheet | inspect_sheets | inspect_tab | migrate_to_columnar | archive_old_log | clean_tab_bar | clean_tab_bar_focus | unhide_all_tabs | clear_selections | presets | apply_preset | send_webhook | get_webhook | set_webhook | apply_selections | setup_media_studio | resources | artwork | queue | notebooklm | sync_drive_artwork' });
    }
  } catch (error) {
    logError('apiHandle_', error);
    return apiJson_({ ok: false, error: error.message });
  }
}

/**
 * 📊 Generic table reader helper for Media Studio tabs.
 */
function apiGetTableData_(tabName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tabName);
    if (!sheet) return { exists: false, count: 0, items: [] };
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2 || lastCol < 1) {
      const headers = sheet.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0] || [];
      return { exists: true, count: 0, headers: headers, items: [] };
    }
    
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    const objects = data.map(function(row) {
      const obj = {};
      headers.forEach(function(h, idx) {
        if (h) obj[h] = row[idx];
      });
      return obj;
    });
    return { exists: true, count: objects.length, headers: headers, items: objects };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

/**
 * 📥 Normalises GET query params and POST JSON into one request shape.
 * GET selections use dotted keys: character.Gender=Male
 */
function apiParseRequest_(e, method) {
  const params = (e && e.parameter) || {};
  let body = {};
  if (method === 'POST' && e && e.postData && e.postData.contents) {
    body = JSON.parse(e.postData.contents);
  }
  const selections = body.selections || { character: {}, scene: {}, camera: {} };
  Object.keys(params).forEach(function (key) {
    const dot = key.indexOf('.');
    if (dot < 1) return;
    const section = key.slice(0, dot).toLowerCase();
    if (!selections[section]) selections[section] = {};
    selections[section][key.slice(dot + 1)] = params[key];
  });
  return {
    action: String(body.action || params.action || 'health').toLowerCase(),
    section: body.section || params.section || null,
    token: body.token || params.token || null,
    formats: body.formats === true || params.formats === 'true',
    selections: selections
  };
}

/**
 * 🔐 Token check only when PROMPT_API_TOKEN is configured.
 */
function apiCheckToken_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty('PROMPT_API_TOKEN');
  if (!expected) return null;
  if (token && token === expected) return null;
  return 'Unauthorized: missing or invalid token';
}

/**
 * 📚 Vocabulary for one section or all three.
 */
function apiCategories_(section) {
  const all = getDashboardData();
  const video = {};
  getSectionCategories('VIDEO').forEach(function (c) { video[c.name] = c.values; });
  all.video = video;
  if (!section) return all;
  const key = String(section).toLowerCase();
  if (!all[key]) throw new Error('Unknown section "' + section + '". Use character | scene | camera | video');
  const out = {};
  out[key] = all[key];
  return out;
}

/**
 * ✨ Builds the prompt from selections; optionally all four formats.
 */
function apiPrompt_(selections, wantFormats) {
  const prompt = generatePromptFromSelections(selections);
  if (typeof prompt !== 'string' || prompt.startsWith('✨') || prompt.startsWith('❌')) {
    return { ok: false, action: 'prompt', error: prompt || 'No prompt generated' };
  }
  const data = { prompt: prompt, selections: selections };
  if (wantFormats) {
    const multi = generateMultiFormatPrompts(selections);
    data.formats = multi.success ? multi.formats : null;
  }
  if (selections.video && Object.keys(selections.video).length) {
    data.video = generateVideoFormat(selections);
  }
  return { ok: true, action: 'prompt', data: data };
}

/**
 * 📜 Read-only diff of the 11/21/2025 archive sheet against the live tab (no writes).
 * section: character | scene | camera (Shots). Returns counts plus up to 50 sample missing values.
 */
function apiArchiveDiff_(section) {
  const key = String(section || 'camera').toUpperCase();
  const logical = CONFIG.SECTION_ALIASES[key] || key;
  if (!ARCHIVE_TABS[logical]) throw new Error('Unknown section "' + section + '". Use character | scene | camera');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const archive = SpreadsheetApp.openById(ARCHIVE_SHEET_ID);
  const archiveTab = firstExistingTab_(archive, ARCHIVE_TABS[logical]);
  if (!archiveTab) throw new Error('Archive tab not found for ' + logical);
  const liveTab = getSheetByAnyName(ss, CONFIG.SECTIONS[logical].dbSheet);
  const liveSet = liveTab ? categoryValueSet_(liveTab) : new Set();
  const archiveSet = categoryValueSet_(archiveTab);
  const missing = archiveMissingRows_(archiveTab, liveSet);
  const byCategory = {};
  missing.forEach(function (r) { byCategory[r[0]] = (byCategory[r[0]] || 0) + 1; });
  return {
    section: logical, archiveTab: archiveTab.getName(), liveTab: liveTab ? liveTab.getName() : null,
    liveValues: liveSet.size, archiveValues: archiveSet.size, missingFromLive: missing.length,
    missingByCategory: byCategory, sample: missing.slice(0, 50)
  };
}

/**
 * 📤 JSON response helper.
 */
function apiJson_(payload) {
  payload.version = API_VERSION;
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 🔍 Diagnostic inspector of all sheets in workbook.
 */
function apiInspectSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  return sheets.map(function(s) {
    const lastRow = s.getLastRow();
    const lastCol = s.getLastColumn();
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let col1 = [];
    if (lastRow >= 1 && lastCol >= 1) {
      const sampleCols = Math.min(lastCol, 25);
      row1 = s.getRange(1, 1, 1, sampleCols).getValues()[0].map(String);
      if (lastRow >= 2) {
        row2 = s.getRange(2, 1, 1, sampleCols).getValues()[0].map(String);
      }
      if (lastRow >= 3) {
        row3 = s.getRange(3, 1, 1, sampleCols).getValues()[0].map(String);
      }
      const sampleRows = Math.min(lastRow, 25);
      col1 = s.getRange(1, 1, sampleRows, 1).getValues().map(function(r) { return String(r[0]); });
    }
    return {
      name: s.getName(),
      index: s.getIndex(),
      isHidden: s.isSheetHidden(),
      lastRow: lastRow,
      lastCol: lastCol,
      maxRows: s.getMaxRows(),
      maxCols: s.getMaxColumns(),
      row1: row1,
      row2: row2,
      row3: row3,
      col1: col1
    };
  });
}

/**
 * 🔎 Detailed tab inspection.
 */
function apiInspectTab_(e) {
  const p = (e && e.parameter) || {};
  const tabName = p.tab || 'Character';
  const numRows = parseInt(p.rows || '15', 10);
  const numCols = parseInt(p.cols || '25', 10);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName(tabName);
  if (!s) return { error: 'Tab not found: ' + tabName };
  const lastRow = s.getLastRow();
  const lastCol = s.getLastColumn();
  const rCount = Math.min(lastRow, numRows);
  const cCount = Math.min(lastCol, numCols);
  let grid = [];
  if (rCount > 0 && cCount > 0) {
    grid = s.getRange(1, 1, rCount, cCount).getValues();
  }
  return {
    tab: tabName,
    lastRow: lastRow,
    lastCol: lastCol,
    grid: grid
  };
}


