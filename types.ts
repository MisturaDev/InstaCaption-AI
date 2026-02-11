
export enum CaptionStyle {
  FUNNY = 'Funny',
  CASUAL = 'Casual',
  PROFESSIONAL = 'Professional',
  INSPIRATIONAL = 'Inspirational',
  MINIMALIST = 'Minimalist',
  PUNNY = 'Punny'
}

export enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German'
}

export interface GeneratedCaption {
  id: string;
  text: string;
  style: CaptionStyle;
  topic: string;
  timestamp: number;
}