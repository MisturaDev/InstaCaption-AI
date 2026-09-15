
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
  GERMAN = 'German',
  ITALIAN = 'Italian',
  PORTUGUESE = 'Portuguese',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  CHINESE = 'Chinese',
  HINDI = 'Hindi',
  ARABIC = 'Arabic',
  TURKISH = 'Turkish'
}

export interface LanguageOption {
  value: Language;
  label: string;
  flag: string;
  native: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: Language.ENGLISH, label: 'English', flag: '🇬🇧', native: 'English' },
  { value: Language.SPANISH, label: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { value: Language.FRENCH, label: 'French', flag: '🇫🇷', native: 'Français' },
  { value: Language.GERMAN, label: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { value: Language.ITALIAN, label: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  { value: Language.PORTUGUESE, label: 'Portuguese', flag: '🇧🇷', native: 'Português' },
  { value: Language.JAPANESE, label: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { value: Language.KOREAN, label: 'Korean', flag: '🇰🇷', native: '한국어' },
  { value: Language.CHINESE, label: 'Chinese', flag: '🇨🇳', native: '中文' },
  { value: Language.HINDI, label: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { value: Language.ARABIC, label: 'Arabic', flag: '🇦🇪', native: 'العربية' },
  { value: Language.TURKISH, label: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
];

export interface GeneratedCaption {
  id: string;
  text: string;
  style: CaptionStyle;
  language: Language;
  topic: string;
  timestamp: number;
}
