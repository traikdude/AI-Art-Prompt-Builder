/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🖼️🌐 MEDIA STUDIO ENGINE — Drive URL Indexer, Web Resources & Production
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Agnostic Enterprise Media Studio for AI-Art-Prompt-Builder:
 *   1. 🌐 Web_Resources: Curated inspiration directory of websites to visit.
 *   2. 🖼️ Artwork_Registry: Living registry of referenced artwork and renders with
 *      live =IMAGE() thumbnail rendering and Google Drive links.
 *   3. 📅 Production_Queue: Scheduled batch queue for prompt generation pipelines.
 *   4. 🧠 NotebookLM_Sync: Knowledge base sync tracking for Google NotebookLM.
 *   5. 🔄 syncDriveArtworkIndex(): Autonomous Google Drive crawler with LockService.
 *   6. ⏱️ installDailyDriveArtworkTrigger(): Automated 6:00 AM daily indexing.
 * 
 * Modeled after the production-tested Morrison 1 engine, made 100% art-agnostic.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const MEDIA_STUDIO_CONFIG = Object.freeze({
  TABS: {
    WEB_RESOURCES: '🌐 Web_Resources',
    ARTWORK_REGISTRY: '🖼️ Artwork_Registry',
    PRODUCTION_QUEUE: '📅 Production_Queue',
    NOTEBOOKLM_SYNC: '🧠 NotebookLM_Sync'
  },
  PROPERTIES: {
    ROOT_FOLDER_ID: 'DRIVE_ART_ROOT_FOLDER_ID',
    NOTEBOOKLM_URL: 'NOTEBOOKLM_NOTEBOOK_URL',
    NOTEBOOKLM_ID: 'NOTEBOOKLM_NOTEBOOK_ID'
  },
  LOCK_TIMEOUT_MS: 30000,
  SUPPORTED_MIME_TYPES: Object.freeze([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime'
  ])
});

// ═══════════════════════════════════════════════════════════════════════════
// 🌐 1. WEB RESOURCES (WEBSITES TO VISIT / INSPIRATION DIRECTORY)
// ═══════════════════════════════════════════════════════════════════════════

const STARTER_WEB_RESOURCES = Object.freeze([
  [
    'WEB-MIDJOURNEY-SHOWCASE',
    'Prompt Galleries',
    'Midjourney Community Showcase',
    'https://www.midjourney.com/showcase',
    'Explore community top-ranked prompts and emerging aesthetic trends',
    'VERIFIED_LIVE',
    'midjourney, gallery, trending',
    'Check weekly for novel descriptor keywords and lighting tokens',
    '2026-09-23'
  ],
  [
    'WEB-CIVITAI-MODELS',
    'Model Hub & Galleries',
    'Civitai Prompt & Model Hub',
    'https://civitai.com',
    'Discover LoRA triggers, negative prompt libraries, and checkpoint styles',
    'VERIFIED_LIVE',
    'sdxl, flux, lora, triggers',
    'Great for extracting specialized clothing and character concept tokens',
    '2026-09-23'
  ],
  [
    'WEB-ARTSTATION-EXPLORE',
    'Artist Portfolios',
    'ArtStation Digital Galleries',
    'https://www.artstation.com',
    'Masterwork digital painting, concept art, matte painting references',
    'VERIFIED_LIVE',
    'portfolio, concept-art, masters',
    'Source inspiration for lighting schemes and architectural perspective',
    '2026-09-23'
  ],
  [
    'WEB-SHOTDECK-CINEMA',
    'Cinematography & Framing',
    'ShotDeck Film Cinematography Reference',
    'https://shotdeck.com',
    'High-resolution cinematic still frames indexed by lighting, lens, and director',
    'VERIFIED_LIVE',
    'cinematography, lenses, lighting, framing',
    'Gold standard for movie-grade camera angles, aspect ratios, and color grading',
    '2026-09-23'
  ],
  [
    'WEB-NOTEBOOKLM-STUDIO',
    'AI Research & RAG',
    'Google NotebookLM Studio',
    'https://notebooklm.google.com',
    'Synthesize deep prompt concepts from art history, lighting guides, and style books',
    'VERIFIED_LIVE',
    'notebooklm, research, rag, synthesis',
    'Dedicated notebook syncs prompt guides and vocabulary lexicons',
    '2026-09-23'
  ],
  [
    'WEB-OPENART-PROMPTBOOK',
    'Prompt Engineering Guides',
    'OpenArt Prompt Engineering Book',
    'https://openart.ai',
    'Structured prompt engineering strategies, modifiers, and syntax comparisons',
    'VERIFIED_LIVE',
    'guides, syntax, weightings',
    'Reference for aspect ratio flags and style blending grammar',
    '2026-09-23'
  ],
  [
    'WEB-PROMPTHERO-SEARCH',
    'Prompt Search Engines',
    'PromptHero AI Prompt Database',
    'https://prompthero.com',
    'Searchable multi-model prompt repository across DALL-E, Midjourney, and Stable Diffusion',
    'VERIFIED_LIVE',
    'prompts, search, multi-model',
    'Excellent for reverse-engineering specific visual atmospheres',
    '2026-09-23'
  ],
  [
    'WEB-COOLORS-PALETTES',
    'Color Theory & Palettes',
    'Coolors Palette Generator',
    'https://coolors.co',
    'Harmonious color palettes, hex codes, and atmospheric tone pairings',
    'VERIFIED_LIVE',
    'color-grading, palettes, tones',
    'Helps define precise color grading and mood token values',
    '2026-09-23'
  ],
  [
    'WEB-KREA-REALTIME',
    'Generative Studios',
    'Krea AI Real-Time Studio',
    'https://www.krea.ai',
    'Real-time generation canvas, image enhancement, and prompt morphing',
    'VERIFIED_LIVE',
    'realtime, upscale, canvas',
    'Useful for fast visual prototyping before committing to full batches',
    '2026-09-23'
  ],
  [
    'WEB-HUGGINGFACE-SPACES',
    'AI Research & Model Demos',
    'Hugging Face Spaces Creative AI',
    'https://huggingface.co/spaces',
    'State-of-the-art open-source image and video model web demonstrations',
    'VERIFIED_LIVE',
    'open-source, research, demos, video',
    'Test new open weights and video generation architectures (Flux, Wan, CogVideo)',
    '2026-09-23'
  ]
]);

function setupWebResourcesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = MEDIA_STUDIO_CONFIG.TABS.WEB_RESOURCES;
  let sheet = ss.getSheetByName(tabName);
  
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.setTabColor('#3b82f6'); // Electric blue tab
  }

  const headers = [
    'Resource Key',
    'Category',
    'Site / Resource Name',
    'URL',
    'Role & Purpose',
    'Verification Status',
    'Tags',
    'Human Notes',
    'Last Verified'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1e293b') // Dark slate
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);

  // Seed starter resources if sheet has only headers
  if (sheet.getLastRow() <= 1) {
    sheet.getRange(2, 1, STARTER_WEB_RESOURCES.length, headers.length).setValues(STARTER_WEB_RESOURCES);
  }

  // Column widths
  sheet.setColumnWidth(1, 180); // Resource Key
  sheet.setColumnWidth(2, 160); // Category
  sheet.setColumnWidth(3, 220); // Site Name
  sheet.setColumnWidth(4, 250); // URL
  sheet.setColumnWidth(5, 320); // Role & Purpose
  sheet.setColumnWidth(6, 140); // Status
  sheet.setColumnWidth(7, 180); // Tags
  sheet.setColumnWidth(8, 250); // Notes
  sheet.setColumnWidth(9, 120); // Last Verified

  return { ok: true, tab: tabName, rows: sheet.getLastRow() };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🖼️ 2. ARTWORK REGISTRY (REFERENCED ARTWORK & IMAGE INDEXER)
// ═══════════════════════════════════════════════════════════════════════════

function setupArtworkRegistrySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = MEDIA_STUDIO_CONFIG.TABS.ARTWORK_REGISTRY;
  let sheet = ss.getSheetByName(tabName);

  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.setTabColor('#0f766e'); // Deep teal tab
  }

  const headers = [
    'Asset ID',
    'Thumbnail Preview',
    'Title / Subject',
    'Artist / Style Reference',
    'Drive File URL',
    'Prompt Recipe / Seed',
    'Aspect Ratio',
    'Engine / Model',
    'Category / Folder',
    'File Name',
    'Last Modified',
    'Indexed At'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0f766e')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);

  // Column widths
  sheet.setColumnWidth(1, 120); // Asset ID
  sheet.setColumnWidth(2, 120); // Thumbnail Preview
  sheet.setColumnWidth(3, 200); // Title / Subject
  sheet.setColumnWidth(4, 180); // Artist / Style
  sheet.setColumnWidth(5, 260); // Drive File URL
  sheet.setColumnWidth(6, 320); // Prompt Recipe
  sheet.setColumnWidth(7, 110); // Aspect Ratio
  sheet.setColumnWidth(8, 140); // Engine / Model
  sheet.setColumnWidth(9, 150); // Category / Folder
  sheet.setColumnWidth(10, 200); // File Name
  sheet.setColumnWidth(11, 140); // Last Modified
  sheet.setColumnWidth(12, 140); // Indexed At

  // Default row height for thumbnail rows
  sheet.setRowHeights(2, Math.max(sheet.getMaxRows() - 1, 10), 100);

  return { ok: true, tab: tabName, rows: sheet.getLastRow() };
}

// ═══════════════════════════════════════════════════════════════════════════
// 📅 3. PRODUCTION QUEUE (BATCH GENERATION & SCHEDULER QUEUE)
// ═══════════════════════════════════════════════════════════════════════════

function setupProductionQueueSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = MEDIA_STUDIO_CONFIG.TABS.PRODUCTION_QUEUE;
  let sheet = ss.getSheetByName(tabName);

  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.setTabColor('#4338ca'); // Royal indigo tab
  }

  const headers = [
    'Queue ID',
    'Target Slot / Date',
    'Concept / Subject',
    'Category Selections',
    'Engine',
    'Aspect Ratio',
    'Status',
    'Generated Output Prompt',
    'Output Asset URL',
    'Execution Receipt / Notes',
    'Created At'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4338ca')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);

  // Data validations for Status & Engine
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ARCHIVED'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('G2:G500').setDataValidation(statusRule);

  const engineRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Midjourney v6', 'Flux.1 Schnell', 'Flux.1 Dev', 'SDXL / ComfyUI', 'Google Imagen 3', 'DALL-E 3', 'Runway Gen-3', 'Luma Dream Machine'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E2:E500').setDataValidation(engineRule);

  const ratioRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['16:9 (Landscape)', '9:16 (Vertical)', '1:1 (Square)', '4:5 (Portrait)', '21:9 (Ultrawide)'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('F2:F500').setDataValidation(ratioRule);

  sheet.setColumnWidth(1, 110); // Queue ID
  sheet.setColumnWidth(2, 140); // Target Date
  sheet.setColumnWidth(3, 200); // Concept / Subject
  sheet.setColumnWidth(4, 250); // Category Selections
  sheet.setColumnWidth(5, 140); // Engine
  sheet.setColumnWidth(6, 140); // Aspect Ratio
  sheet.setColumnWidth(7, 120); // Status
  sheet.setColumnWidth(8, 350); // Generated Prompt
  sheet.setColumnWidth(9, 220); // Output URL
  sheet.setColumnWidth(10, 240); // Receipt / Notes
  sheet.setColumnWidth(11, 140); // Created At

  return { ok: true, tab: tabName, rows: sheet.getLastRow() };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧠 4. NOTEBOOKLM SYNC (KNOWLEDGE BASE & RAG RESEARCH REGISTRY)
// ═══════════════════════════════════════════════════════════════════════════

const STARTER_NOTEBOOKLM_SOURCES = Object.freeze([
  [
    'SRC-VOCAB-DB',
    'AI Art Master Vocabulary Lexicon (1,173 Curated Values)',
    'Database Export',
    'Comprehensive categorization across Character (8), Scene (6), and Camera (6) traits',
    'https://notebooklm.google.com',
    'READY_FOR_SYNC',
    1173,
    '2026-09-23'
  ],
  [
    'SRC-CINEMATOGRAPHY-GUIDE',
    'Cinematography, Framing & Lens Compendium',
    'Monograph / Guide',
    'Focal lengths, anamorphic ratios, camera rigs, and dynamic motion descriptors',
    'https://notebooklm.google.com',
    'READY_FOR_SYNC',
    420,
    '2026-09-23'
  ],
  [
    'SRC-LIGHTING-ATMOSPHERE',
    'Atmospheric Lighting & Volumetric Illumination Guide',
    'Technical Reference',
    'Chiaroscuro, rim lighting, bioluminescence, caustic reflections, golden hour',
    'https://notebooklm.google.com',
    'READY_FOR_SYNC',
    350,
    '2026-09-23'
  ],
  [
    'SRC-ARTIST-AESTHETICS',
    'Artist Aesthetics & Stylistic Movement Synthesis',
    'Art History Reference',
    'Cross-era aesthetic descriptors: Moebius, Syd Mead, Caravaggio, Studio Ghibli, Greg Rutkowski',
    'https://notebooklm.google.com',
    'READY_FOR_SYNC',
    510,
    '2026-09-23'
  ]
]);

function setupNotebookLMSyncSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = MEDIA_STUDIO_CONFIG.TABS.NOTEBOOKLM_SYNC;
  let sheet = ss.getSheetByName(tabName);

  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.setTabColor('#059669'); // Emerald tab
  }

  const headers = [
    'Source Key',
    'Source Title',
    'Document Type',
    'Content Summary',
    'Notebook ID / URL',
    'Sync Status',
    'Estimated Word Count',
    'Last Synced At'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#065f46')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);

  if (sheet.getLastRow() <= 1) {
    sheet.getRange(2, 1, STARTER_NOTEBOOKLM_SOURCES.length, headers.length).setValues(STARTER_NOTEBOOKLM_SOURCES);
  }

  sheet.setColumnWidth(1, 180); // Source Key
  sheet.setColumnWidth(2, 260); // Source Title
  sheet.setColumnWidth(3, 160); // Document Type
  sheet.setColumnWidth(4, 340); // Content Summary
  sheet.setColumnWidth(5, 250); // Notebook URL
  sheet.setColumnWidth(6, 140); // Sync Status
  sheet.setColumnWidth(7, 140); // Word Count
  sheet.setColumnWidth(8, 140); // Last Synced At

  return { ok: true, tab: tabName, rows: sheet.getLastRow() };
}

// ═══════════════════════════════════════════════════════════════════════════
// ✨ 5. MASTER 1-CLICK SETUP FOR ALL MEDIA STUDIO SHEETS
// ═══════════════════════════════════════════════════════════════════════════

function setupAllMediaStudioSheets() {
  const r1 = setupWebResourcesSheet();
  const r2 = setupArtworkRegistrySheet();
  const r3 = setupProductionQueueSheet();
  const r4 = setupNotebookLMSyncSheet();

  const msg = '🎉 All 4 Media Studio sheets initialized successfully!\n' +
    '• 🌐 Web_Resources (Inspiration websites)\n' +
    '• 🖼️ Artwork_Registry (Referenced artwork & thumbnails)\n' +
    '• 📅 Production_Queue (Scheduled prompt generation queue)\n' +
    '• 🧠 NotebookLM_Sync (Knowledge base & research sync)';

  try {
    SpreadsheetApp.getUi().alert('Media Studio Setup Complete', msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {
    // Non-UI context (API or automation execution)
    console.log(msg);
  }

  return {
    ok: true,
    results: { webResources: r1, artworkRegistry: r2, productionQueue: r3, notebookLmSync: r4 }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 6. AUTONOMOUS DRIVE URL INDEXER ENGINE
// ═══════════════════════════════════════════════════════════════════════════

function getDriveArtRootFolderId_() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty(MEDIA_STUDIO_CONFIG.PROPERTIES.ROOT_FOLDER_ID) || '';
}

function setDriveArtRootFolderId(folderId) {
  const cleanId = String(folderId || '').trim();
  PropertiesService.getScriptProperties().setProperty(MEDIA_STUDIO_CONFIG.PROPERTIES.ROOT_FOLDER_ID, cleanId);
  return { ok: true, folderId: cleanId };
}

function configureDriveArtFolderPrompt() {
  const ui = SpreadsheetApp.getUi();
  const currentId = getDriveArtRootFolderId_();
  const response = ui.prompt(
    'Configure Google Drive Artwork Folder',
    'Paste the Google Drive Folder ID (or full folder URL) where your referenced artwork and renders are stored:\n' +
    '(Current ID: ' + (currentId || 'None set') + ')',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    let input = response.getResponseText().trim();
    // Extract ID from URL if full URL was pasted
    const match = input.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match) input = match[1];

    if (input) {
      setDriveArtRootFolderId(input);
      ui.alert('Configured!', 'Drive Artwork Folder ID saved: ' + input, ui.ButtonSet.OK);
    } else {
      ui.alert('Empty Input', 'No Folder ID was set.', ui.ButtonSet.OK);
    }
  }
}

/**
 * Scans the configured Google Drive folder and syncs all image assets into
 * the '🖼️ Artwork_Registry' sheet with live =IMAGE() thumbnail formulas.
 */
function syncDriveArtworkIndex() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(MEDIA_STUDIO_CONFIG.LOCK_TIMEOUT_MS)) {
    throw new Error('Could not acquire script lock for syncDriveArtworkIndex after ' + MEDIA_STUDIO_CONFIG.LOCK_TIMEOUT_MS + 'ms.');
  }

  try {
    const folderId = getDriveArtRootFolderId_();
    if (!folderId) {
      const msg = 'No Drive Artwork Folder ID configured. Run "Configure Drive Artwork Folder ID" first.';
      console.warn(msg);
      return { ok: false, error: msg, count: 0 };
    }

    const rootFolder = DriveApp.getFolderById(folderId);
    setupArtworkRegistrySheet(); // Ensure tab exists with headers
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(MEDIA_STUDIO_CONFIG.TABS.ARTWORK_REGISTRY);

    const pulledAt = new Date().toISOString();
    const collectedRows = [];

    // Helper to walk folders
    function collectImages_(folder, categoryName) {
      const files = folder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        const mime = file.getMimeType();
        if (!MEDIA_STUDIO_CONFIG.SUPPORTED_MIME_TYPES.includes(mime)) continue;

        const id = file.getId();
        const name = file.getName();
        const url = file.getUrl();
        const lastMod = file.getLastUpdated();
        
        // Thumbnail formula using Google Drive thumbnail endpoint
        const thumbFormula = '=IMAGE("https://drive.google.com/thumbnail?id=' + id + '&sz=w200-h200", 4, 90, 90)';
        const assetId = 'ART-' + id.substring(0, 8).toUpperCase();

        collectedRows.push([
          assetId,
          thumbFormula,
          name.replace(/\.[^/.]+$/, ""), // Title defaults to filename without extension
          categoryName,                 // Artist / Style reference defaults to folder name
          url,
          '',                           // Prompt (user editable)
          '16:9',                       // Default aspect ratio
          'AI Render / Reference',      // Engine
          categoryName,
          name,
          lastMod,
          pulledAt
        ]);
      }

      const subfolders = folder.getFolders();
      while (subfolders.hasNext()) {
        const sub = subfolders.next();
        collectImages_(sub, sub.getName());
      }
    }

    collectImages_(rootFolder, rootFolder.getName());

    if (collectedRows.length > 0) {
      // Clear old rows below header and write fresh batch
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 12).clearContent();
      }
      sheet.getRange(2, 1, collectedRows.length, 12).setValues(collectedRows);
      sheet.setRowHeights(2, collectedRows.length, 100);
    }

    console.log('Indexed ' + collectedRows.length + ' artwork items into ' + MEDIA_STUDIO_CONFIG.TABS.ARTWORK_REGISTRY);
    return { ok: true, count: collectedRows.length, pulledAt: pulledAt };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Installs an automated daily trigger (default 6:00 AM) to sync the Drive artwork index.
 */
function installDailyDriveArtworkTrigger(hour) {
  hour = typeof hour === 'number' ? hour : 6;
  const functionName = 'syncDriveArtworkIndex';

  // Remove existing triggers for this function to prevent duplicate runs
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyDays(1)
    .atHour(hour)
    .create();

  const msg = 'Installed daily Google Drive Artwork Indexer trigger for ' + hour + ':00 AM.';
  console.log(msg);
  try {
    SpreadsheetApp.getUi().alert('Trigger Installed', msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}

  return { ok: true, trigger: functionName, hour: hour };
}
