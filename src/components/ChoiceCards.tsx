import React from 'react';
import { Check } from 'lucide-react';

interface ChoiceCardsProps {
  id: string;
  label: string;
  description?: string;
  options: { label: string; value: string; hint?: string; badge?: string }[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  columns?: 1 | 2;
  hasOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  otherPlaceholder?: string;
}

export const ChoiceCards: React.FC<ChoiceCardsProps> = ({
  id,
  label,
  description,
  options,
  value,
  onChange,
  required = true,
  error,
  columns = 2,
  hasOther = false,
  otherValue = '',
  onOtherChange,
  otherPlaceholder = 'Please specify...',
}) => {
  return (
    <div id={`choice-field-${id}`} className="space-y-4 sm:space-y-4.5">
      <div>
        <label className="block text-sm sm:text-base font-semibold text-stone-900 leading-snug">
          {label}
          {required && <span className="text-amber-600 ml-1">*</span>}
        </label>
        {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
      </div>

      <div className={`grid gap-3 sm:gap-4 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              id={`${id}-opt-${opt.value.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
              onClick={() => onChange(opt.value)}
              className={`text-left p-3.5 sm:p-4 min-h-[50px] rounded-xl border transition-colors duration-100 flex items-start justify-between gap-3 cursor-pointer select-none touch-manipulation active:scale-[0.985] ${
                isSelected
                  ? 'bg-amber-50/75 border-amber-500 ring-1 ring-amber-500/30 shadow-xs'
                  : 'bg-stone-50/40 border-stone-200/90 hover:bg-stone-50 hover:border-stone-300 active:bg-amber-50/30'
              }`}
            >
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm sm:text-base font-semibold ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {opt.hint && (
                  <p className="text-xs text-stone-500 leading-relaxed">{opt.hint}</p>
                )}
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-100 ${
                  isSelected
                    ? 'border-amber-600 bg-amber-600 text-white'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Conditional Other Text Field */}
      {hasOther && value === 'Other' && (
        <div className="pt-2 animate-fadeIn">
          <input
            id={`${id}-other-input`}
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
            placeholder={otherPlaceholder}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 bg-white text-sm text-stone-900 placeholder-stone-400"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};
