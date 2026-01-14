
import React from 'react';
import { CaptionStyle } from '../types';

interface StyleBadgeProps {
  style: CaptionStyle;
  isSelected: boolean;
  onClick: (style: CaptionStyle) => void;
}

const StyleBadge: React.FC<StyleBadgeProps> = ({ style, isSelected, onClick }) => {
  const getStyleColor = (s: CaptionStyle) => {
    if (isSelected) return 'bg-indigo-600 text-white shadow-md scale-105 dark:bg-indigo-500';
    return 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700';
  };

  return (
    <button
      onClick={() => onClick(style)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${getStyleColor(style)}`}
    >
      {style}
    </button>
  );
};

export default StyleBadge;
