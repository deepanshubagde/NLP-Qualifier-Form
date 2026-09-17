/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Check, AlertCircle, HeartHandshake, Eye, ShieldCheck } from 'lucide-react';
import { FormData, FormErrors, SubmissionStatus } from './types';
import { HeaderBanner } from './components/HeaderBanner';
import { TopStatusBar } from './components/TopStatusBar';
import { ChoiceCards } from './components/ChoiceCards';
import { YesNoToggle } from './components/YesNoToggle';
import { MultiSelectPills } from './components/MultiSelectPills';
import { ThankYouView } from './components/ThankYouView';
import {
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  STRUGGLING_AREAS_OPTIONS,
  OBSTACLE_OPTIONS,
  INVESTMENT_OPTIONS,
} from './data/formQuestions';

const STORAGE_KEY = 'monkhood_nlp_form_draft_v1';
const WEBHOOK_KEY = 'monkhood_webhook_url';
export const DEFAULT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwGCsAc3BXU3rwYLzJRxzwrr7boKSoMcZlnhIo3wRrwreVGsBqhoRm8ZSCk1vXH5x0/exec';

const INITIAL_FORM_DATA: FormData = {
  name: '',
  gender: '',
  age: '',
  city: '',
  whatsapp: '',
  email: '',
  occupation: '',
  strugglingAreas: [],
  patternsOfFailure: '',
  attendedDeepanshuEvent: '',
  brainFogTired: '',
  capableMoreNotHappening: '',
  heardOfNLP: '',
  attendedNLPWorkshop: '',
  majorObstacle: '',
  majorObstacleOther: '',
  investmentCapacity: '',
  personalNotes: '',
};

const DUMMY_SUBMISSION_DATA: FormData = {
  name: 'Aarav Patel',
  gender: 'Male',
  age: '29',
  city: 'Mumbai',
  whatsapp: '+91 98765 43210',
  email: 'aarav.patel@example.com',
  occupation: 'Business / Entrepreneur',
  strugglingAreas: ['Money & Finance', 'Business', 'Self Growth'],
  patternsOfFailure: 'Yes',
  attendedDeepanshuEvent: 'Yes',
  brainFogTired: 'No',
  capableMoreNotHappening: 'Yes',
  heardOfNLP: 'Yes',
  attendedNLPWorkshop: 'No',
  majorObstacle: 'Lack of Strategy & Plan',
  majorObstacleOther: '',
  investmentCapacity: 'D) Ready To Invest Any Amount, If I Get A Result',
  personalNotes: 'Looking forward to transforming my business and mental clarity with Deepanshu Sir.',
};

export default function App() {
  // State
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved draft', e);
    }
    return INITIAL_FORM_DATA;
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    const saved = localStorage.getItem(WEBHOOK_KEY);
    return saved && saved !== 'YOUR_WEBHOOK_URL_HERE' ? saved : DEFAULT_WEBHOOK_URL;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save debounced effect without unnecessary intermediate state renders
  useEffect(() => {
    if (submissionStatus === 'success') return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (err) {
        console.error('Failed to auto-save', err);
      }
    }, 400);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [formData, submissionStatus]);

  // Handle updates
  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  // Calculate completion progress
  const requiredChecklist = [
    Boolean(formData.name.trim()),
    Boolean(formData.gender),
    Boolean(formData.age.trim()),
    Boolean(formData.city.trim()),
    Boolean(formData.occupation),
    formData.strugglingAreas.length > 0,
    Boolean(formData.patternsOfFailure),
    Boolean(formData.attendedDeepanshuEvent),
    Boolean(formData.brainFogTired),
    Boolean(formData.capableMoreNotHappening),
    Boolean(formData.heardOfNLP),
    Boolean(formData.attendedNLPWorkshop),
    Boolean(formData.majorObstacle),
    Boolean(formData.investmentCapacity),
  ];
  const totalCount = requiredChecklist.length;
  const answeredCount = requiredChecklist.filter(Boolean).length;
  const progressPercent = Math.round((answeredCount / totalCount) * 100);

  // Validate form
  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.gender) errs.gender = 'Please select your gender';
    if (!formData.age.trim()) {
      errs.age = 'Please enter your age';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 14 || Number(formData.age) > 100) {
      errs.age = 'Please enter a valid age (14 - 100)';
    }
    if (!formData.city.trim()) errs.city = 'Please enter your city';

    if (!formData.occupation) errs.occupation = 'Please select which describes you best';
    if (formData.strugglingAreas.length === 0) errs.strugglingAreas = 'Please select at least one struggling area';
    if (!formData.patternsOfFailure) errs.patternsOfFailure = 'Please answer this question';
    if (!formData.attendedDeepanshuEvent) errs.attendedDeepanshuEvent = 'Please answer this question';
    if (!formData.brainFogTired) errs.brainFogTired = 'Please answer this question';
    if (!formData.capableMoreNotHappening) errs.capableMoreNotHappening = 'Please answer this question';
    if (!formData.heardOfNLP) errs.heardOfNLP = 'Please answer this question';
    if (!formData.attendedNLPWorkshop) errs.attendedNLPWorkshop = 'Please answer this question';
    if (!formData.majorObstacle) errs.majorObstacle = 'Please select your major obstacle';
    if (formData.majorObstacle === 'Other' && !formData.majorObstacleOther?.trim()) {
      errs.majorObstacle = 'Please describe your specific obstacle';
    }
    if (!formData.investmentCapacity) errs.investmentCapacity = 'Please select your self-investment willingness';

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Scroll to the first error
      const firstErrKey = Object.keys(errs)[0];
      const el = document.getElementById(firstErrKey) ||
                 document.getElementById(`choice-field-${firstErrKey}`) ||
                 document.getElementById(`question-container-${firstErrKey}`) ||
                 document.getElementById(`multiselect-${firstErrKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) {
      return;
    }

    setSubmissionStatus('submitting');

    // Mapped precisely to the 15 columns of code.gs in the connected Google Sheet
    const payload = {
      // Identity & Contact
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
      city: formData.city,
      whatsapp: formData.whatsapp || '',
      email: formData.email || '',

      // 10 Program & Mindset Qualifier Questions (matching data.q1 to data.q10 in code.gs)
      q1: formData.occupation,
      q2: Array.isArray(formData.strugglingAreas) ? formData.strugglingAreas.join(', ') : formData.strugglingAreas,
      q3: formData.patternsOfFailure,
      q4: formData.attendedDeepanshuEvent,
      q5: formData.brainFogTired,
      q6: formData.capableMoreNotHappening,
      q7: formData.heardOfNLP,
      q8: formData.attendedNLPWorkshop,
      q9: formData.majorObstacle === 'Other' && formData.majorObstacleOther
        ? `Other: ${formData.majorObstacleOther}`
        : formData.majorObstacle,
      q10: formData.investmentCapacity,

      // Extra metadata
      personalNotes: formData.personalNotes || '',
      submittedAt: new Date().toISOString(),
      sourceSubdomain: 'align.monkhood.in',
    };

    try {
      // If a real webhook is specified
      if (webhookUrl && webhookUrl !== 'YOUR_WEBHOOK_URL_HERE' && webhookUrl.startsWith('http')) {
        // Dispatch immediately to Google Apps Script
        const networkPromise = fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // standard protocol for Google Apps Script Webhook redirects
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).catch((err) => {
          console.warn('Background webhook dispatch:', err);
        });

        // Ensure network payload is dispatched to Google's servers
        await Promise.race([
          networkPromise,
          new Promise((resolve) => setTimeout(resolve, 1200)),
        ]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      // Success! Clear local draft
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        // ignore
      }

      setSubmittedData(formData);
      setSubmissionStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission failed', err);
      setSubmissionError('There was an issue dispatching your submission. Please check your connection or try again.');
      setSubmissionStatus('error');
    }
  };

  // Reset form
  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmissionStatus('idle');
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-stone-900 flex flex-col items-center selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top sticky progress line */}
      {submissionStatus !== 'success' && (
        <TopStatusBar progressPercent={progressPercent} />
      )}

      {/* Main Single-Page Form Canvas */}
      <main className="w-full max-w-3xl px-2.5 sm:px-6 py-4 sm:py-10 flex-1">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06),0_2px_10px_-2px_rgba(0,0,0,0.03)] border border-stone-200/90 overflow-hidden transition-all">
          
          {/* Header Banner */}
          <HeaderBanner />

          {/* Render Thank You View or Single-Page Form */}
          <AnimatePresence mode="wait">
            {submissionStatus === 'success' && submittedData ? (
              <ThankYouView key="thank-you" submissionData={submittedData} onReset={handleReset} />
            ) : (
              <motion.div
                key="form-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Inviting Welcome Intro */}
                <div className="px-4 sm:px-8 md:px-12 pt-6 sm:pt-10 pb-5 sm:pb-6 border-b border-stone-100">
                  <div className="mb-2.5 sm:mb-3">
                    <div className="inline-flex max-w-full items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-[10.5px] min-[360px]:text-[11.5px] min-[400px]:text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap shadow-xs">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">Your Outer World is Reflection of Your Internal World</span>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 font-display tracking-tight leading-snug">
                    Qualifier — Mind Reprograming
                  </h1>
                </div>

                {/* Form Fields Container */}
                <form id="qualifier-form" onSubmit={handleSubmit} className="px-4 sm:px-8 md:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8" noValidate>
                  
                  {/* Participant Details */}
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-stone-900 mb-1.5">
                        Full Name <span className="text-amber-600">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3.5 sm:py-3 min-h-[48px] rounded-xl border bg-stone-50/50 text-stone-900 placeholder-stone-400 text-base transition-colors duration-100 touch-manipulation ${
                          errors.name
                            ? 'border-red-400 ring-2 ring-red-100 bg-red-50/10'
                            : 'border-stone-200 hover:border-stone-300 focus:border-amber-600 focus:bg-white focus:ring-3 focus:ring-amber-500/15'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠ {errors.name}</p>}
                    </div>

                    {/* Gender Selection Options */}
                    <div id="choice-field-gender">
                      <label className="block text-sm sm:text-base font-semibold text-stone-900 mb-2">
                        Gender <span className="text-amber-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                        {GENDER_OPTIONS.map((g) => {
                          const isSelected = formData.gender === g.value;
                          return (
                            <button
                              key={g.value}
                              type="button"
                              id={`gender-opt-${g.value.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() => updateField('gender', g.value as any)}
                              className={`text-left p-3.5 sm:p-4 min-h-[48px] rounded-xl border transition-colors duration-100 flex items-center justify-between gap-3 cursor-pointer select-none touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-amber-50/75 border-amber-500 ring-1 ring-amber-500/20 shadow-xs'
                                  : 'bg-stone-50/40 border-stone-200/90 hover:bg-stone-50 hover:border-stone-300 active:bg-amber-50/30'
                              }`}
                            >
                              <span className={`text-sm sm:text-base font-semibold ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
                                {g.label}
                              </span>

                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-100 ${
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
                      {errors.gender && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠ {errors.gender}</p>}
                    </div>

                    {/* Age & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="age" className="block text-sm sm:text-base font-semibold text-stone-900 mb-1.5">
                          Age <span className="text-amber-600">*</span>
                        </label>
                        <input
                          id="age"
                          type="number"
                          min="14"
                          max="100"
                          value={formData.age}
                          onChange={(e) => updateField('age', e.target.value)}
                          placeholder="e.g. 29"
                          className={`w-full px-4 py-3.5 sm:py-3 min-h-[48px] rounded-xl border bg-stone-50/50 text-stone-900 placeholder-stone-400 text-base transition-colors duration-100 touch-manipulation ${
                            errors.age
                              ? 'border-red-400 ring-2 ring-red-100'
                              : 'border-stone-200 hover:border-stone-300 focus:border-amber-600 focus:bg-white'
                          }`}
                        />
                        {errors.age && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠ {errors.age}</p>}
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm sm:text-base font-semibold text-stone-900 mb-1.5">
                          City / Location <span className="text-amber-600">*</span>
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          placeholder="e.g. Pune, Mumbai"
                          className={`w-full px-4 py-3.5 sm:py-3 min-h-[48px] rounded-xl border bg-stone-50/50 text-stone-900 placeholder-stone-400 text-base transition-colors duration-100 touch-manipulation ${
                            errors.city
                              ? 'border-red-400 ring-2 ring-red-100'
                              : 'border-stone-200 hover:border-stone-300 focus:border-amber-600 focus:bg-white'
                          }`}
                        />
                        {errors.city && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠ {errors.city}</p>}
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-200/80" />

                  {/* Questions 1 & 2 */}
                  <div className="space-y-6">
                    {/* Q1 */}
                    <ChoiceCards
                      id="occupation"
                      label="1. Which of the Following Describes you the Best?"
                      options={OCCUPATION_OPTIONS}
                      value={formData.occupation}
                      onChange={(val) => updateField('occupation', val)}
                      error={errors.occupation}
                    />

                    {/* Q2 */}
                    <MultiSelectPills
                      id="strugglingAreas"
                      label="2. Which of the Following Areas you are Struggling?"
                      description="Select every domain where you are currently hitting a ceiling or facing friction."
                      options={STRUGGLING_AREAS_OPTIONS}
                      selectedValues={formData.strugglingAreas}
                      onChange={(vals) => updateField('strugglingAreas', vals)}
                      error={errors.strugglingAreas}
                    />
                  </div>

                  <hr className="border-stone-200/80" />

                  {/* Questions 3 to 6 */}
                  <div className="space-y-4">
                    {/* Q3 */}
                    <YesNoToggle
                      id="patternsOfFailure"
                      questionNumber={3}
                      questionText="Are you working hard to achieve success and health, yet experiencing patterns of failure, frustration, depression, anxiety, stress, lack of money and diseases?"
                      value={formData.patternsOfFailure}
                      onChange={(val) => updateField('patternsOfFailure', val)}
                      error={errors.patternsOfFailure}
                    />

                    {/* Q4 */}
                    <YesNoToggle
                      id="attendedDeepanshuEvent"
                      questionNumber={4}
                      questionText="Have you attended Deepanshu Sir’s Event earlier?"
                      value={formData.attendedDeepanshuEvent}
                      onChange={(val) => updateField('attendedDeepanshuEvent', val)}
                      error={errors.attendedDeepanshuEvent}
                    />

                    {/* Q5 */}
                    <YesNoToggle
                      id="brainFogTired"
                      questionNumber={5}
                      questionText="Do you feel brain fog, tired and lack of motivation, drive, energy and purpose?"
                      value={formData.brainFogTired}
                      onChange={(val) => updateField('brainFogTired', val)}
                      error={errors.brainFogTired}
                    />

                    {/* Q6 */}
                    <YesNoToggle
                      id="capableMoreNotHappening"
                      questionNumber={6}
                      questionText="You know you have more in you and you are capable of achieving it, but it’s not happening and you don’t know what is stopping you?"
                      value={formData.capableMoreNotHappening}
                      onChange={(val) => updateField('capableMoreNotHappening', val)}
                      error={errors.capableMoreNotHappening}
                    />
                  </div>

                  <hr className="border-stone-200/80" />

                  {/* Questions 7 to 9 */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Q7 */}
                      <YesNoToggle
                        id="heardOfNLP"
                        questionNumber={7}
                        questionText="Have you ever heard of NLP?"
                        value={formData.heardOfNLP}
                        onChange={(val) => updateField('heardOfNLP', val)}
                        error={errors.heardOfNLP}
                      />

                      {/* Q8 */}
                      <YesNoToggle
                        id="attendedNLPWorkshop"
                        questionNumber={8}
                        questionText="Have you ever attended an NLP workshop earlier?"
                        value={formData.attendedNLPWorkshop}
                        onChange={(val) => updateField('attendedNLPWorkshop', val)}
                        error={errors.attendedNLPWorkshop}
                      />
                    </div>

                    {/* Q9 */}
                    <ChoiceCards
                      id="majorObstacle"
                      label="9. What is the major obstacle stopping you from achieving your Dream life?"
                      options={OBSTACLE_OPTIONS}
                      value={formData.majorObstacle}
                      onChange={(val) => updateField('majorObstacle', val)}
                      columns={1}
                      hasOther={true}
                      otherValue={formData.majorObstacleOther}
                      onOtherChange={(val) => updateField('majorObstacleOther', val)}
                      otherPlaceholder="Describe your primary obstacle in your own words..."
                      error={errors.majorObstacle}
                    />
                  </div>

                  <hr className="border-stone-200/80" />

                  {/* Question 10 */}
                  <div className="space-y-6">
                    {/* Q10 */}
                    <ChoiceCards
                      id="investmentCapacity"
                      label="10. If you get an exact blueprint and system to achieve your health, business, income, and relationship goal, how much will you be willing to invest in yourself?"
                      options={INVESTMENT_OPTIONS}
                      value={formData.investmentCapacity}
                      onChange={(val) => updateField('investmentCapacity', val)}
                      columns={1}
                      error={errors.investmentCapacity}
                    />
                  </div>

                  {/* Submission Error Banner if any */}
                  {submissionError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Submission Alert</p>
                        <p className="text-xs mt-0.5">{submissionError}</p>
                      </div>
                    </div>
                  )}

                  {/* Prominent Submit Section */}
                  <div className="pt-6 pb-2">
                    <button
                      id="submit-qualification-button"
                      type="submit"
                      disabled={submissionStatus === 'submitting'}
                      className="relative overflow-hidden group w-full min-h-[56px] py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-bold text-base sm:text-lg border-t border-amber-300/40 shadow-xl shadow-amber-600/30 hover:shadow-2xl hover:shadow-amber-600/45 active:scale-[0.98] transition-transform duration-100 flex items-center justify-center gap-2.5 cursor-pointer select-none touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {/* Top gloss reflection highlight */}
                      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-2xl" />

                      {/* Continuous animated shimmer beam */}
                      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                      {submissionStatus === 'submitting' ? (
                        <div className="flex items-center gap-2.5 relative z-10">
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span className="tracking-wide">Submitting...</span>
                        </div>
                      ) : (
                        <span className="relative z-10 tracking-wide text-white drop-shadow-xs font-bold">Submit</span>
                      )}
                    </button>

                    {/* 100% Secure Trust Line */}
                    <div
                      id="data-security-badge"
                      className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 select-none tracking-tight"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>100% Secure — Your Data is Safe With Us</span>
                    </div>
                  </div>

                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer Branding */}
        <footer className="mt-10 text-center space-y-2 pb-10">
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            © Monkhood. All Rights Reserved. Private &amp; Confidential.
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-semibold text-stone-800 tracking-tight font-display">
            Digital Sangha, which aims to inspire transformation from within.
          </p>
        </footer>
      </main>
    </div>
  );
}
