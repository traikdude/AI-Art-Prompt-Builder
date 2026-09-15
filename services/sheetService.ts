import { AppData, Category, SectionName } from '../types';

const SHEET_ID = '1Gxj0VfgtkqtTicsjK2_2Gx5sOXK8L3PJtI2-yKjftOE';
const API_URL = 'https://script.google.com/macros/s/AKfycbyCjig1ociubkgrGw5P814n3aX1pQvzM4N5erySJWTJijL2oQW9ZfBZDUvwohLxHmyjNw/exec?action=categories';

const SECTION_TABS: Record<SectionName, string[]> = {
  CHARACTER: ['DB_Character', 'CHARACTER', '[X] CHARACTER'],
  SCENE: ['DB_Scene', 'SCENE', '[X] SCENE'],
  CAMERA: ['DB_Camera', 'CAMERA', '[X] CAMERA', 'Shots'],
};

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
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch tab ${tabName}`);
  const text = await response.text();
  
  // Guard against HTML error or redirect pages returned with 200
  if (text.trim().startsWith('<!DOCTYPE html') || text.includes('google-visualization-errors')) {
    throw new Error(`Invalid CSV returned for ${tabName}`);
  }

  // Split by newlines and filter empty rows
  return text
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(parseCSVLine);
};

const transformToCategories = (rows: string[][], sheetName: string): Category[] => {
  if (rows.length === 0) return [];

  const headers = rows[0]; // First row assumes Category Names
  // If first header is the navigation guide, this tab is not valid category data
  if (headers[0] && headers[0].includes('Navigation Guide')) {
    return [];
  }

  const categories: Category[] = [];

  // Iterate through columns
  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const categoryName = headers[colIndex];
    if (!categoryName) continue;

    // Filter out rogue headers like formatting summaries
    if (categoryName.includes('Formatting Approach') || categoryName.includes('Professor Synapse')) {
      continue;
    }

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

// Fallback: Fetch directly from JSON Web App API
const fetchFromWebApi = async (): Promise<AppData | null> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return null;
    const json = await response.json();
    if (!json.ok || !json.data) return null;

    const mapSection = (sectionObj: Record<string, string[]>, sheetName: string): Category[] => {
      return Object.entries(sectionObj).map(([name, values], colIdx) => ({
        name,
        values: Array.isArray(values) ? values : [],
        src: {
          sheet: sheetName,
          col: colIdx + 1,
          rowStart: 2,
        },
      }));
    };

    return {
      CHARACTER: mapSection(json.data.character || {}, 'DB_Character'),
      SCENE: mapSection(json.data.scene || {}, 'DB_Scene'),
      CAMERA: mapSection(json.data.camera || {}, 'DB_Camera'),
    };
  } catch (err) {
    console.warn('API fallback failed:', err);
    return null;
  }
};

export const fetchSheetData = async (): Promise<AppData | null> => {
  try {
    const sections: SectionName[] = ['CHARACTER', 'SCENE', 'CAMERA'];
    const results = await Promise.all(
      sections.map(async (section) => {
        const candidateTabs = SECTION_TABS[section];
        for (const tab of candidateTabs) {
          try {
            const rows = await fetchTabCSV(tab);
            const categories = transformToCategories(rows, tab);
            if (categories.length > 0) {
              return { section, data: categories };
            }
          } catch (e) {
            // Try next candidate tab
          }
        }
        return { section, data: [] };
      })
    );

    const appData: Partial<AppData> = {};
    results.forEach(({ section, data }) => {
      appData[section] = data;
    });

    // If CSV fetching got 0 categories, try the JSON Web App API as high-reliability fallback
    if (!appData.CHARACTER?.length && !appData.SCENE?.length) {
      const apiFallback = await fetchFromWebApi();
      if (apiFallback) return apiFallback;
    }

    return appData as AppData;
  } catch (error) {
    console.error('Critical error fetching sheet data, trying API fallback:', error);
    return fetchFromWebApi();
  }
};