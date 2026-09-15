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
      default:
        return apiJson_({ ok: false, action: req.action, error: 'Unknown action. Use health | categories | prompt | setup_sheet' });
    }
  } catch (error) {
    logError('apiHandle_', error);
    return apiJson_({ ok: false, error: error.message });
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
