import { AppData, Category, SectionName } from '../types';

const SHEET_ID = '1Gxj0VfgtkqtTicsjK2_2Gx5sOXK8L3PJtI2-yKjftOE';
const TABS: SectionName[] = ['CHARACTER', 'SCENE', 'CAMERA'];

// Robust CSV Line Parser to handle quoted values containing commas
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  // Push the last value
  values.push(currentValue.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
  
  return values;
};

const fetchTabCSV = async (tabName: string): Promise<string[][]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch tab ${tabName}`);
  const text = await response.text();
  
  // Split by newlines and filter empty rows
  return text
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(parseCSVLine);
};

const transformToCategories = (rows: string[][], sheetName: string): Category[] => {
  if (rows.length === 0) return [];

  const headers = rows[0]; // First row assumes Category Names
  const categories: Category[] = [];

  // Iterate through columns
  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const categoryName = headers[colIndex];
    if (!categoryName) continue;

    // Collect values for this column from subsequent rows
    const values = rows.slice(1)
      .map(row => row[colIndex])
      .filter(val => val && val.trim() !== ''); // Remove empty values

    if (values.length > 0) {
      categories.push({
        name: categoryName,
        values: values,
        src: {
          sheet: sheetName,
          col: colIndex + 1, // 1-based index for display
          rowStart: 2
        }
      });
    }
  }

  return categories;
};

export const fetchSheetData = async (): Promise<AppData | null> => {
  try {
    const results = await Promise.all(
      TABS.map(async (tab) => {
        try {
          const rows = await fetchTabCSV(tab);
          return { tab, data: transformToCategories(rows, tab) };
        } catch (e) {
          console.warn(`Could not load tab ${tab}:`, e);
          return { tab, data: [] };
        }
      })
    );

    const appData: Partial<AppData> = {};
    results.forEach(({ tab, data }) => {
      appData[tab] = data;
    });

    return appData as AppData;
  } catch (error) {
    console.error("Critical error fetching sheet data:", error);
    return null;
  }
};