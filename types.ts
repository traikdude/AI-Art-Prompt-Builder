
export interface Category {
  name: string;
  values: string[];
  src: {
    sheet: string;
    col: number;
    rowStart: number;
  };
}

export type SectionName = 'CHARACTER' | 'SCENE' | 'CAMERA';

export interface Selections {
  character: Record<string, string>;
  scene: Record<string, string>;
  camera: Record<string, string>;
}

export interface HelpData {
  CHARACTER: Record<string, string>;
  SCENE: Record<string, string>;
  CAMERA: Record<string, string>;
}

export interface AppData {
  CHARACTER: Category[];
  SCENE: Category[];
  CAMERA: Category[];
}

export interface Theme {
  name: string;
  className: string;
  properties: Record<string, string>;
}

export interface MultiFormatPrompts {
  narrative: string;
  technical: string;
  poetic: string;
  bulletPoint: string;
}
