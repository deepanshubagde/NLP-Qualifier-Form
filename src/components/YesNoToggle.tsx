import React from 'react';
import { Check } from 'lucide-react';

interface YesNoToggleProps {
  id: string;
  questionNumber: number;
  questionText: string;
  description?: string;
  value: 'Yes' | 'No' | '';
  onChange: (val: 'Yes' | 'No') => void;
  required?: boolean;
  error?: string;
}

export const YesNoToggle: React.FC<YesNoToggleProps> = ({
  id,
  questionNumber,
  questionText,
  description,
  value,
  onChange,
  required = true,
  error,
}) => {
  return (
    <div id={`question-container-${id}`} className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
      error 
        ? 'border-red-300 bg-red-50/20' 
        : value 
          ? 'border-amber-200/80 bg-stone-50/50' 
          : 'border-stone-200/80 bg-stone-50/30 hover:border-stone-300'
    }`}>
      <div className="mb-3">
        <label htmlFor={id} className="block text-sm sm:text-base font-semibold text-stone-900 leading-snug">
          <span className="text-amber-700 font-mono mr-1.5 font-bold">{questionNumber}.</span>
          {questionText}
          {required && <span className="text-amber-600 ml-1" title="Required field">*</span>}
        </label>
        {description && (
          <p className="text-xs text-stone-500 mt-1">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
        {(['Yes', 'No'] as const).map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              id={`${id}-${opt.toLowerCase()}-btn`}
              onClick={() => onChange(opt)}
              className={`flex items-center justify-center gap-2 min-h-[48px] py-3.5 px-4 rounded-xl border text-sm sm:text-base font-semibold transition-colors duration-100 cursor-pointer select-none touch-manipulation active:scale-[0.96] ${
                isSelected
                  ? 'bg-amber-600 border-amber-600 text-white shadow-sm shadow-amber-600/25 ring-2 ring-amber-500/20'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 active:bg-amber-50/50'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};
