/**
 * Verification script for AI Art Prompt Builder endpoints.
 * Tests live Google Sheet CSV endpoints and Google Apps Script Web App API.
 */

const SHEET_ID = '1Gxj0VfgtkqtTicsjK2_2Gx5sOXK8L3PJtI2-yKjftOE';
const API_URL = 'https://script.google.com/macros/s/AKfycbyCjig1ociubkgrGw5P814n3aX1pQvzM4N5erySJWTJijL2oQW9ZfBZDUvwohLxHmyjNw/exec?action=categories';

const REQUIRED_SHEETS = [
  { name: 'DB_Character', expectedHeader: 'Gender' },
  { name: 'DB_Scene', expectedHeader: 'Lighting' },
  { name: 'DB_Camera', expectedHeader: 'Camera Angle' },
];

async function verifySheetEndpoint(sheetName, expectedHeader) {
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
  if (lines.length < 2) {
    throw new Error(`Expected at least 2 rows (header + values), got ${lines.length}`);
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
  process.stdout.write('Checking Google Apps Script Web App API... ');

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
}

async function main() {
  console.log('--- AI Art Prompt Builder: Endpoint Reachability Gate ---');
  let failures = 0;

  for (const { name, expectedHeader } of REQUIRED_SHEETS) {
    try {
      await verifySheetEndpoint(name, expectedHeader);
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
    console.log('All endpoints healthy and verified!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
