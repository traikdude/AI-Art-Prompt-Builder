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

const API_VERSION = '5.2.0-api1';

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
      default:
        return apiJson_({ ok: false, action: req.action, error: 'Unknown action. Use health | categories | prompt' });
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
  if (!section) return all;
  const key = String(section).toLowerCase();
  if (!all[key]) throw new Error('Unknown section "' + section + '". Use character | scene | camera');
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
  return { ok: true, action: 'prompt', data: data };
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
