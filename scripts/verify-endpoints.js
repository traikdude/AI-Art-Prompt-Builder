/**
 * Verification script for AI Art Prompt Builder endpoints.
 * Tests live Google Sheet CSV endpoints and Google Apps Script Web App API.
 */

const SHEET_ID = '1Gxj0VfgtkqtTicsjK2_2Gx5sOXK8L3PJtI2-yKjftOE';
const API_URL = 'https://script.google.com/macros/s/AKfycbyCjig1ociubkgrGw5P814n3aX1pQvzM4N5erySJWTJijL2oQW9ZfBZDUvwohLxHmyjNw/exec?action=categories';

const REQUIRED_SHEETS = [
  { name: 'DB_Character', expectedHeader: 'Gender', minRows: 2 },
  { name: 'DB_Scene', expectedHeader: 'Lighting', minRows: 2 },
  { name: 'DB_Camera', expectedHeader: 'Camera Angle', minRows: 2 },
  { name: '🌐 Web_Resources', expectedHeader: 'Site / Resource Name', minRows: 2 },
  { name: '🖼️ Artwork_Registry', expectedHeader: 'Thumbnail Preview', minRows: 1 },
  { name: '📅 Production_Queue', expectedHeader: 'Generated Output Prompt', minRows: 1 },
  { name: '🧠 NotebookLM_Sync', expectedHeader: 'Source Title', minRows: 2 },
];

async function verifySheetEndpoint(sheetName, expectedHeader, minRows = 2) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  process.stdout.write(`Checking Google Sheet tab [${sheetName}]... `);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (text.trim().startsWith('<!DOCTYPE html') || text.includes('google-visualization-errors')) {
    throw new Error(`Google Visualization returned an error page for tab ${sheetName}`);
  }

  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < minRows) {
    throw new Error(`Expected at least ${minRows} row(s), got ${lines.length}`);
  }

  const headerRow = lines[0];
  if (headerRow.includes('Navigation Guide')) {
    throw new Error(`Tab ${sheetName} fell back to the default sheet index`);
  }

  if (!headerRow.includes(expectedHeader)) {
    throw new Error(`Expected header "${expectedHeader}" not found in row 1: ${headerRow}`);
  }

  console.log(`PASS (${lines.length} rows, header verified)`);
  return lines.length;
}

async function verifyWebApiEndpoint() {
  process.stdout.write('Checking Google Apps Script Categories API... ');

  const response = await fetch(API_URL, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (!json.ok || !json.data) {
    throw new Error(`API returned invalid payload: ok=${json.ok}`);
  }

  const charCats = Object.keys(json.data.character || {});
  const sceneCats = Object.keys(json.data.scene || {});
  const camCats = Object.keys(json.data.camera || {});

  if (charCats.length === 0 || sceneCats.length === 0 || camCats.length === 0) {
    throw new Error(`Incomplete category payload: char=${charCats.length}, scene=${sceneCats.length}, cam=${camCats.length}`);
  }

  console.log(`PASS (char=${charCats.length}, scene=${sceneCats.length}, cam=${camCats.length} categories)`);

  // Verify Web Resources Endpoint
  process.stdout.write('Checking Web Resources API (?action=resources)... ');
  const resourcesUrl = `${API_URL.split('?')[0]}?action=resources`;
  const resResponse = await fetch(resourcesUrl, { redirect: 'follow' });
  if (!resResponse.ok) {
    throw new Error(`Resources endpoint returned HTTP ${resResponse.status}`);
  }
  const resJson = await resResponse.json();
  if (!resJson.ok || !resJson.data || resJson.data.count === 0) {
    throw new Error('Resources endpoint returned empty or invalid data');
  }
  console.log(`PASS (${resJson.data.count} curated resources live)`);
}

async function main() {
  console.log('--- AI Art Prompt Builder: Endpoint Reachability Gate ---');
  let failures = 0;

  for (const { name, expectedHeader, minRows } of REQUIRED_SHEETS) {
    try {
      await verifySheetEndpoint(name, expectedHeader, minRows);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      failures++;
    }
  }

  try {
    await verifyWebApiEndpoint();
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
    failures++;
  }

  console.log('---------------------------------------------------------');
  if (failures > 0) {
    console.error(`Endpoint verification FAILED with ${failures} defect(s).`);
    process.exit(1);
  } else {
    console.log('All 7 Google Sheet tabs and Web App API endpoints healthy and verified!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
