import React from 'react';
import { Check, Plus } from 'lucide-react';

interface MultiSelectPillsProps {
  id: string;
  label: string;
  description?: string;
  options: { label: string; value: string; icon?: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  error?: string;
}

export const MultiSelectPills: React.FC<MultiSelectPillsProps> = ({
  id,
  label,
  description,
  options,
  selectedValues,
  onChange,
  required = true,
  error,
}) => {
  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((item) => item !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div id={`multiselect-${id}`} className="space-y-4 sm:space-y-4.5">
      <div>
        <label className="block text-sm sm:text-base font-semibold text-stone-900 leading-snug">
          {label}
          {required && <span className="text-amber-600 ml-1">*</span>}
        </label>
        {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-3.5">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              id={`${id}-tag-${opt.value.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
              onClick={() => toggleOption(opt.value)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs shadow-amber-600/20'
                  : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                isSelected ? 'bg-amber-700/50 text-white' : 'bg-stone-200/80 text-stone-600'
              }`}>
                {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {selectedValues.length > 0 && (
        <p className="text-xs text-stone-500 italic">
          {selectedValues.length} area{selectedValues.length > 1 ? 's' : ''} selected
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};
