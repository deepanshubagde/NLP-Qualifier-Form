import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Clock, ArrowLeft, ShieldCheck, Sparkles, Video, AlertTriangle } from 'lucide-react';
import { FormData } from '../types';

interface ThankYouViewProps {
  submissionData: FormData;
  onReset: () => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({
  submissionData,
  onReset,
}) => {
  return (
    <motion.div
      id="thank-you-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="px-5 sm:px-12 py-10 sm:py-14 text-center space-y-6 sm:space-y-7"
    >
      {/* Badge icon */}
      <div className="relative inline-block">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border-2 border-emerald-300/80 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 stroke-[2.2]" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>

      {/* Main Heading */}
      <div className="space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Form Submitted Successfully
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display tracking-tight leading-snug">
          Thank you, <span className="text-amber-700">{submissionData.name || 'Friend'}</span>.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Your form submission has been completely done. Thank you so very much for your patience and your time.
        </p>
      </div>

      {/* Live Masterclass Session Section */}
      <div className="max-w-xl mx-auto bg-stone-50/90 rounded-2xl border border-stone-200/80 p-5 sm:p-6 text-left space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 border border-amber-200/70 px-3 py-1.5 rounded-lg w-fit">
          <Video className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Important Next Step</span>
        </div>

        <div className="space-y-3 pt-1 text-xs sm:text-sm text-stone-700">
          {/* Point 1: Join Live Session */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              1
            </span>
            <p className="leading-relaxed">
              Let's meet live today <strong className="text-stone-900">9:00 PM IST</strong> for our <span className="font-semibold text-amber-950">The Ultimate Confidence Mastery</span> class. See you live!
            </p>
          </div>

          {/* Point 2: Live Only Warning */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
              2
            </span>
            <p className="leading-relaxed">
              <strong className="text-stone-900">Note:</strong> This session is <span className="font-semibold text-rose-700 underline underline-offset-2">live only</span>. No recording will be provided.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Another Response Button - Plain & Small */}
      <div className="pt-2 flex items-center justify-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300 text-xs sm:text-sm font-semibold transition-colors duration-100 cursor-pointer select-none touch-manipulation active:scale-[0.97] shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Submit another response</span>
        </button>
      </div>
    </motion.div>
  );
};
