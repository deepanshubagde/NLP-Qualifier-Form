import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, FileText, Send, Sparkles, AlertCircle, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/googleAppsScript';
import { generateStandaloneHTML } from '../utils/generateStandaloneCode';

const DEFAULT_BANNER = '/assets/header-banner.png';
const CUSTOM_BANNER_STORAGE_KEY = 'monkhood_custom_banner';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  webhookUrl,
  onSaveWebhookUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'script' | 'standalone' | 'banner'>('setup');
  const [urlInput, setUrlInput] = useState<string>(webhookUrl);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string>(() => {
    try {
      return localStorage.getItem(CUSTOM_BANNER_STORAGE_KEY) || DEFAULT_BANNER;
    } catch {
      return DEFAULT_BANNER;
    }
  });
  const [bannerSuccessMsg, setBannerSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveWebhookUrl(urlInput.trim());
    onClose();
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyStandalone = () => {
    const html = generateStandaloneHTML(urlInput.trim());
    navigator.clipboard.writeText(html);
    setCopiedHTML(true);
    setTimeout(() => setCopiedHTML(false), 2500);
  };

  const handleDownloadStandalone = () => {
    const html = generateStandaloneHTML(urlInput.trim());
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const testWebhook = async () => {
    if (!urlInput.trim() || urlInput.trim() === 'YOUR_WEBHOOK_URL_HERE') {
      setTestStatus('failed');
      setTestMessage('Please enter your actual Google Apps Script Web App URL first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Pinging your Google Apps Script webhook...');

    try {
      // In Google Apps Script, sending a test payload
      await fetch(urlInput.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Ping (Monkhood Form)',
          city: 'Test City',
          whatsapp: '+919999999999',
          occupation: 'Test Run',
          strugglingAreas: ['Test'],
          investmentCapacity: 'Test Tier',
          personalNotes: 'Test ping from configuration modal'
        })
      });

      setTestStatus('success');
      setTestMessage('Connection succeeded! (Check your Google Sheet for a new test row)');
    } catch (e: any) {
      setTestStatus('failed');
      setTestMessage('Could not reach the webhook. Check that the script is deployed as Web App with access set to "Anyone".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-display">
                Google Sheets Integration & Deployment
              </h2>
              <p className="text-xs text-stone-500">
                Subdomain: <code className="text-amber-800 font-semibold">align.monkhood.in</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50/30 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'setup'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Webhook URL & Test
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'script'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Google Apps Script Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standalone')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'standalone'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Standalone HTML Export
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('banner')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'banner'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>4. Header Photo</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-stone-700 flex-1">
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm text-amber-900 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  How the Google Sheets Connection Works
                </p>
                <p className="leading-relaxed text-stone-700">
                  When a participant submits the form on <code>align.monkhood.in</code>, their answers are transmitted via a lightweight Google Apps Script Webhook directly into your Google Spreadsheet in real-time.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="webhook-url-input" className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="webhook-url-input"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 bg-stone-50/40 text-stone-900 text-xs sm:text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={testWebhook}
                    disabled={testStatus === 'testing'}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testStatus === 'testing' ? 'Testing...' : 'Test URL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-400">
                  If empty or set to placeholder, the form will simulate submissions locally without errors.
                </p>
              </div>

              {testStatus !== 'idle' && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                  testStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : testStatus === 'failed'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {testStatus === 'success' ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{testMessage}</span>
                </div>
              )}

              {/* Quick Setup Checklist */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2.5 text-xs text-stone-600">
                <p className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">2-Minute Quick Setup Checklist:</p>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                  <li>Open your Google Sheet (e.g. "NLP Coaching Leads").</li>
                  <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Copy the code from Tab 2 and paste it into the editor.</li>
                  <li>Click <strong>Deploy &gt; New Deployment</strong>, choose <strong>Web App</strong>.</li>
                  <li>Set <em>"Execute as"</em> to <strong>Me</strong> and <em>"Who has access"</em> to <strong>Anyone</strong>.</li>
                  <li>Deploy, copy the Web App URL, and paste it in the box above!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500">
                  Paste this into your Google Sheet's Apps Script editor:
                </p>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-stone-900 text-amber-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[320px] leading-relaxed select-all">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'standalone' && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-xs text-stone-700 space-y-2">
                <p className="font-semibold text-stone-900">
                  Ready to host on <code className="text-amber-800 font-bold">align.monkhood.in</code>
                </p>
                <p className="leading-relaxed">
                  This export generates a 100% self-contained, single-file HTML/CSS/JS file. You can upload this single <code className="bg-stone-200 px-1 py-0.5 rounded">index.html</code> file to your web server, cPanel, Cloudflare Pages, Netlify, or subdomain root.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyStandalone}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
                >
                  {copiedHTML ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHTML ? 'Copied HTML Code!' : 'Copy Single-File HTML'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStandalone}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download index.html</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'banner' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  Custom Header Photo / SRM Banner
                </p>
                <p className="leading-relaxed text-stone-700">
                  Select or drag-and-drop your new <strong>Header img SRM Form.png</strong> file. It will immediately replace the header graphic across the form and persist in your browser.
                </p>
              </div>

              {/* Current Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Active Banner Preview
                </label>
                <div className="rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-black relative">
                  <img
                    src={bannerPreview}
                    alt="Active Header Banner Preview"
                    className="w-full h-auto block select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* File Upload / Drag Zone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Upload New Header Image
                </label>
                <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-6 text-center bg-stone-50 hover:bg-amber-50/40 transition flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-amber-600" />
                  <p className="text-xs font-semibold text-stone-800">
                    Click to select <code>Header img SRM Form.png</code> or drag & drop here
                  </p>
                  <p className="text-2xs text-stone-500">
                    Supports PNG, JPG, WEBP • Recommended aspect ratio: 4:1 to 5:1 wide banner
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    id="modal-banner-file-input"
                    className="mt-2 text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const result = evt.target?.result as string;
                          if (result) {
                            try {
                              localStorage.setItem(CUSTOM_BANNER_STORAGE_KEY, result);
                            } catch {
                              console.warn('LocalStorage limit reached');
                            }
                            setBannerPreview(result);
                            setBannerSuccessMsg(true);
                            setTimeout(() => setBannerSuccessMsg(false), 3000);
                            // Also trigger custom event so App/Banner updates live
                            window.dispatchEvent(new Event('storage'));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              {bannerSuccessMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Header photo updated successfully!</span>
                </div>
              )}

              {/* Reset Option */}
              {bannerPreview !== DEFAULT_BANNER && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.removeItem(CUSTOM_BANNER_STORAGE_KEY);
                      } catch {
                        // ignore
                      }
                      setBannerPreview(DEFAULT_BANNER);
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 underline font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to original default banner</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <span className="text-xs text-stone-400">Settings saved to local storage</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
