
import React, { useState } from 'react';
import { Copy, Check, Instagram } from 'lucide-react';

interface CaptionCardProps {
  text: string;
}

const CaptionCard: React.FC<CaptionCardProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-white dark:border-white/20 p-5 rounded-2xl shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium transition-colors">
          {text}
        </p>
        <button
          onClick={handleCopy}
          className="shrink-0 p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="mt-4 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1">
          <Instagram className="w-3 h-3" /> Instagram Ready
        </span>
      </div>
    </div>
  );
};

export default CaptionCard;
