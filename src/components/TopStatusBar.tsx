import React from 'react';

interface TopStatusBarProps {
  progressPercent: number;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({ progressPercent }) => {
  return (
    <div id="sticky-top-bar" className="sticky top-0 z-30 w-full bg-stone-200/40">
      {/* Dynamic top progress line */}
      <div className="w-full h-1.5 bg-stone-200/60 overflow-hidden">
        <div
          id="progress-bar-fill"
          className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

