
export enum CaptionStyle {
  FUNNY = 'Funny',
  CASUAL = 'Casual',
  PROFESSIONAL = 'Professional',
  INSPIRATIONAL = 'Inspirational',
  MINIMALIST = 'Minimalist',
  PUNNY = 'Punny'
}

export interface GeneratedCaption {
  id: string;
  text: string;
  style: CaptionStyle;
  topic: string;
  timestamp: number;
}
