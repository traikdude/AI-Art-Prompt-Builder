/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎥 VIDEO LAYER — Video tab migration + video prompt format (Goal G3, milestone M3)
 * Design: docs/VIDEO_DATA_MODEL.md (categories and seed values quoted from there)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const VIDEO_SHEET_NAME = 'Video';

// Shot Type stays a pointer into the existing Shots tab (no duplication); six new columns here.
const VIDEO_SEED_CATEGORIES = {
  'Camera Move': ['Static', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down', 'Dolly In', 'Dolly Out',
    'Truck Left', 'Truck Right', 'Handheld', 'Crane Up', 'Orbit/Arc', 'Zoom In', 'Zoom Out'],
  'Duration': ['2s', '3s', '4s', '5s', '6s', '8s', '10s', '15s', '20s', '30s'],
  'Aspect Ratio + FPS': ['16:9 @ 24fps', '16:9 @ 30fps', '9:16 @ 24fps', '9:16 @ 30fps',
    '1:1 @ 24fps', '4:5 @ 30fps', '16:9 @ 60fps', '9:16 @ 60fps'],
  'Motion Intensity': ['Static/None', 'Subtle', 'Moderate', 'High', 'Frenetic', 'Slow Motion',
    'Motion Blur', 'Freeze Frame'],
  'Transition': ['Cut', 'Match Cut', 'Cross Dissolve', 'Whip Pan', 'Push Through', 'Fade to Black',
    'Fade from Black', 'J-Cut', 'L-Cut', 'Smash Cut'],
  'Sequence Role': ['Establishing', 'Action', 'Reaction', 'Handoff']
};

/**
 * 🎥 Creates the Video tab with seed vocabulary. Idempotent: never overwrites existing values,
 * only adds missing category columns. Run from the menu, never edit the tab by hand.
 */
function seedVideoCategories() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, VIDEO_SHEET_NAME);
    const lastCol = sheet.getLastColumn();
    const existing = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String) : [];
    let added = 0;
    let nextCol = existing.filter(function (h) { return h.trim(); }).length + 1;

    Object.keys(VIDEO_SEED_CATEGORIES).forEach(function (category) {
      if (existing.indexOf(category) !== -1) return;
      const values = VIDEO_SEED_CATEGORIES[category];
      sheet.getRange(1, nextCol).setValue(category)
        .setFontWeight('bold').setBackground('#9C27B0').setFontColor('white');
      sheet.getRange(2, nextCol, values.length, 1)
        .setValues(values.map(function (v) { return [v]; }));
      nextCol++;
      added++;
    });

    clearCacheForSection('VIDEO');
    const msg = added
      ? '✅ Video tab ready: added ' + added + ' categories.'
      : 'ℹ️ Video tab already has every category; nothing changed.';
    try { SpreadsheetApp.getUi().alert(msg); } catch (uiError) { /* headless call, no UI */ }
    return { success: true, added: added, message: msg };
  } catch (error) {
    logError('seedVideoCategories', error);
    return { success: false, message: error.message };
  }
}

/**
 * 🎬 Builds the video-format prompt from docs/VIDEO_DATA_MODEL.md §2.
 * Uses character + scene + camera selections for subject/scene/shot and the Video tab for motion.
 */
function generateVideoFormat(selections) {
  const pick = function (section, key) {
    const s = (selections && selections[section]) || {};
    return s[key] || '';
  };
  const joinValues = function (section) {
    const s = (selections && selections[section]) || {};
    return Object.keys(s).map(function (k) { return s[k]; }).filter(Boolean).join(', ');
  };
  const aspectFps = pick('video', 'Aspect Ratio + FPS');
  const aspect = aspectFps.split('@')[0].trim();
  const fps = parseInt((aspectFps.split('@')[1] || '').replace(/[^0-9]/g, ''), 10) || null;
  const duration = parseInt(String(pick('video', 'Duration')).replace(/[^0-9]/g, ''), 10) || null;

  const text = [
    joinValues('character') || 'Subject', 'in', joinValues('scene') || 'the scene',
    ', captured as a', pick('camera', 'Shot Type') || 'Medium Shot',
    'with', pick('video', 'Camera Move') || 'Static', ',',
    duration ? duration + 's' : 'unspecified duration', 'at', aspectFps || 'unspecified aspect',
    ', motion intensity:', pick('video', 'Motion Intensity') || 'Moderate',
    ', transitioning via', pick('video', 'Transition') || 'Cut', '.',
    'Sequence role:', pick('video', 'Sequence Role') || 'Establishing', '.'
  ].join(' ').replace(/\s+,/g, ',').replace(/\s+\./g, '.');

  return {
    text: text,
    json: {
      subject: joinValues('character'),
      scene: joinValues('scene'),
      shot: pick('camera', 'Shot Type'),
      camera_move: pick('video', 'Camera Move'),
      duration_s: duration,
      aspect: aspect || null,
      fps: fps,
      motion_intensity: pick('video', 'Motion Intensity'),
      transition: pick('video', 'Transition'),
      sequence_role: pick('video', 'Sequence Role'),
      negative: pick('video', 'Negative') || null,
      seed_hint: pick('video', 'Seed Hint') || null
    }
  };
}
