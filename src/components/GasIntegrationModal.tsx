import React, { useState, useEffect } from 'react';
import {
  GOOGLE_APPS_SCRIPT_CODE_GS,
  GOOGLE_SHEETS_HEADERS,
} from '../utils/gasCode';
import {
  getStoredGasUrl,
  setStoredGasUrl,
  testGasConnection as testGasService,
} from '../utils/gasSyncService';
import {
  AlertCircle,
  Check,
  Cloud,
  Code,
  Copy,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Layers,
  Play,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  UploadCloud,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface GasIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToGoogleSheets?: () => Promise<void>;
  isSaving?: boolean;
}

export const GasIntegrationModal: React.FC<GasIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSaveToGoogleSheets,
  isSaving = false,
}) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'codegs' | 'cloudflare' | 'guide'>('guide');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [gasUrlInput, setGasUrlInput] = useState<string>('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; timestamp?: string } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [urlSaveSuccess, setUrlSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setGasUrlInput(getStoredGasUrl());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleSaveUrl = () => {
    setStoredGasUrl(gasUrlInput);
    setUrlSaveSuccess(true);
    setTimeout(() => setUrlSaveSuccess(false), 2500);
  };

  const runTestConnection = async () => {
    if (!gasUrlInput.trim()) {
      setTestResult({
        success: false,
        message: 'Silakan masukkan URL Web App Google Apps Script Anda terlebih dahulu.',
      });
      return;
    }
    setStoredGasUrl(gasUrlInput);
    setIsTesting(true);
    setTestResult(null);

    const res = await testGasService(gasUrlInput.trim());
    setIsTesting(false);
    setTestResult(res);
  };

  const handleTriggerSave = async () => {
    setStoredGasUrl(gasUrlInput);
    if (onSaveToGoogleSheets) {
      await onSaveToGoogleSheets();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Integrasi Google Apps Script (GAS) & Google Sheets API
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                  API & Sync Aktif
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hubungkan frontend E-Rapor ke basis data Google Sheets dengan skrip <code>doGet()</code> dan <code>doPost()</code>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1 rounded-md hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
            1. Simpan & Uji Endpoint Web App (doGet / doPost)
          </button>
          <button
            onClick={() => setActiveTab('codegs')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'codegs'
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4 text-indigo-600" />
            2. Skrip Lengkap Code.gs (doGet & doPost)
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'headers'
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            3. Struktur 7 Header Sheet
          </button>
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-amber-600 text-amber-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-500" />
            4. Panduan Deploy Cloudflare Pages
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: API TESTER & DIRECT SYNC */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                      Endpoint Integrasi Google Sheets
                    </span>
                    <h3 className="text-base font-bold text-emerald-950 mt-1">
                      URL Web App Google Apps Script
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5 max-w-2xl leading-relaxed">
                      Masukkan URL Web App hasil deploy skrip <code>Code.gs</code> dari Google Spreadsheet Anda. Frontend akan mengirimkan data form terbaru langsung via <code>fetch()</code> ke endpoint <code>doPost()</code> ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTriggerSave}
                      disabled={isSaving}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Menyimpan Data...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          Simpan ke Google Sheets Sekarang
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">
                      URL Web App Google Apps Script (Deployment ID / Exec URL):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                        value={gasUrlInput}
                        onChange={(e) => setGasUrlInput(e.target.value)}
                        className="flex-1 bg-white border border-emerald-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveUrl}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {urlSaveSuccess ? 'Tersimpan!' : 'Simpan URL'}
                        </button>
                        <button
                          type="button"
                          onClick={runTestConnection}
                          disabled={isTesting}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                        >
                          {isTesting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Menguji...
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              Uji Koneksi (doGet)
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {testResult && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                        testResult.success
                          ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-bold">{testResult.message}</p>
                        {testResult.timestamp && (
                          <p className="text-[11px] opacity-75 mt-0.5">Waktu: {testResult.timestamp}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step-by-Step Setup Guide */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  3 Langkah Cepat Memasang Skrip di Google Spreadsheet Anda:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <h5 className="font-bold text-slate-900">Buka Apps Script</h5>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Di Google Spreadsheet Anda, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <h5 className="font-bold text-slate-900">Salin & Simpan Code.gs</h5>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Buka tab <strong>"2. Otomasi Code.gs Backend"</strong> di atas, klik tombol <strong>Salin Seluruh Skrip Code.gs</strong>, lalu tempel di editor dan simpan (Ctrl+S).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <h5 className="font-bold text-slate-900">Deploy sebagai Web App</h5>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Klik tombol <strong>Deploy</strong> &gt; <strong>New Deployment</strong>. Pilih jenis <strong>Web App</strong>. Setel <em>Execute as: Me</em> dan <em>Who has access: Anyone (Siapa saja)</em>. Salin URL Web App dan tempel pada kolom di atas!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE.GS FULL SCRIPT */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/70 p-4 rounded-xl border border-indigo-200">
                <div>
                  <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    Skrip Lengkap Google Apps Script (Code.gs)
                  </h3>
                  <p className="text-xs text-indigo-800 mt-0.5">
                    Mencakup <code>setupDatabaseSheets()</code>, fungsi kalkulasi rapor, serta API endpoint <code>doGet(e)</code> dan <code>doPost(e)</code>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(GOOGLE_APPS_SCRIPT_CODE_GS, 'full_codegs')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition"
                >
                  {copiedSection === 'full_codegs' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Skrip Berhasil Disalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Salin Seluruh Skrip Code.gs
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto">
                  {GOOGLE_APPS_SCRIPT_CODE_GS}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: HEADERS */}
          {activeTab === 'headers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Struktur 7 Sheet Relasional Basis Data Google Sheets
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Seluruh sheet ini dapat digenerate otomatis menggunakan fungsi <code>setupDatabaseSheets()</code> di tab <strong>2. Otomasi Code.gs</strong>.
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      GOOGLE_SHEETS_HEADERS.map((s) => `[${s.sheetName}]\n${s.columns.join('\t')}`).join('\n\n'),
                      'all_headers'
                    )
                  }
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  {copiedSection === 'all_headers' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Tersalin Semua!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Salin Semua Header
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {GOOGLE_SHEETS_HEADERS.map((sheet) => (
                  <div
                    key={sheet.sheetName}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    <div className="px-4 py-2.5 bg-slate-100 flex items-center justify-between border-b border-slate-200">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {sheet.sheetName}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          ({sheet.columns.length} kolom) — {sheet.description}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(sheet.columns.join('\t'), sheet.sheetName)
                        }
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-2xs transition"
                      >
                        {copiedSection === sheet.sheetName ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Salin Header
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 overflow-x-auto">
                      <div className="flex flex-wrap gap-1.5">
                        {sheet.columns.map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLOUDFLARE PAGES GUIDE */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <Rocket className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 space-y-1">
                  <p className="font-bold">Aplikasi Ini Siap 100% untuk Cloudflare Pages</p>
                  <p className="leading-relaxed">
                    Aplikasi E-Rapor ini dibangun dengan arsitektur SPA statis murni (*Client-Side React SPA*) yang kompatibel penuh dengan Cloudflare Pages, Cloudflare Workers, maupun hosting statis global lainnya tanpa memerlukan server Node.js khusus.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Metode 1: Hubungkan ke GitHub (Otomatis & Direkomendasikan)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li>Buat repositori baru di GitHub (misal: <code>erapor-kalamkudus</code>) dan push kode aplikasi ini.</li>
                  <li>Buka dashboard <strong>Cloudflare Dashboard</strong> &gt; pilih <strong>Workers & Pages</strong>.</li>
                  <li>Klik <strong>Create application</strong> &gt; pilih tab <strong>Pages</strong> &gt; <strong>Connect to Git</strong>.</li>
                  <li>Pilih repositori Anda, lalu masukkan pengaturan build berikut:
                    <div className="mt-2 p-3 bg-slate-900 text-white rounded-lg font-mono text-xs space-y-1">
                      <p><span className="text-slate-400">Framework preset:</span> <span className="text-emerald-400">Vite</span></p>
                      <p><span className="text-slate-400">Build command:</span> <span className="text-emerald-400">npm run build</span></p>
                      <p><span className="text-slate-400">Build output directory:</span> <span className="text-emerald-400">dist</span></p>
                    </div>
                  </li>
                  <li>Klik <strong>Save and Deploy</strong>. Dalam 1 menit, aplikasi rapor Anda akan langsung online dengan domain gratis seperti <code>erapor.pages.dev</code>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
