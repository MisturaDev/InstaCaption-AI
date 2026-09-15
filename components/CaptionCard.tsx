
import React, { useState } from 'react';
import { Copy, Check, Instagram, Globe } from 'lucide-react';
import { CaptionStyle, Language, LANGUAGE_OPTIONS } from '../types';

interface CaptionCardProps {
  text: string;
  language?: Language;
  style?: CaptionStyle;
}

const CaptionCard: React.FC<CaptionCardProps> = ({ text, language, style }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langOption = language ? LANGUAGE_OPTIONS.find(l => l.value === language) : undefined;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="group relative bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-white dark:border-white/20 p-5 rounded-2xl shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium transition-colors select-text">
          {text}
        </p>
        <button
          onClick={handleCopy}
          className="shrink-0 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer shadow-sm"
          title="Copy caption to clipboard"
          aria-label="Copy caption"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          {langOption && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-900/40">
              <span>{langOption.flag}</span>
              <span>{langOption.label}</span>
            </span>
          )}
          {style && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {style}
            </span>
          )}
          <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold inline-flex items-center gap-1">
            <Instagram className="w-3 h-3 text-pink-500" /> Instagram
          </span>
        </div>
        
        <div className="text-[11px] text-gray-400 dark:text-gray-500">
          {wordCount} words • {charCount} chars
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;
