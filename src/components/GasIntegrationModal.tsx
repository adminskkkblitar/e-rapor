import React, { useState } from 'react';
import {
  GOOGLE_APPS_SCRIPT_CODE_GS,
  GOOGLE_SHEETS_HEADERS,
} from '../utils/gasCode';
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
} from 'lucide-react';

interface GasIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasIntegrationModal: React.FC<GasIntegrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'codegs' | 'cloudflare' | 'guide'>('headers');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [gasUrlInput, setGasUrlInput] = useState<string>('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const testGasConnection = async () => {
    if (!gasUrlInput.trim()) {
      setTestResult('Silakan masukkan URL Web App Google Apps Script Anda terlebih dahulu.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`${gasUrlInput.trim()}?action=test`);
      const data = await response.json();
      setTestResult(`Koneksi Berhasil! Respons: ${JSON.stringify(data)}`);
    } catch (err: any) {
      setTestResult(`Koneksi Terhubung / Menunggu Otorisasi: ${err.message || err.toString()}`);
    } finally {
      setIsTesting(false);
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
                Otomasi Google Sheets & Deploy Cloudflare Pages
                <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-semibold">
                  SD Kristen Kalam Kudus Blitar
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate header otomatis, skrip Code.gs terpusat, dan panduan deploy production ke Cloudflare Pages.
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
            onClick={() => setActiveTab('headers')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'headers'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            1. Struktur Header Kolom (7 Sheet)
          </button>
          <button
            onClick={() => setActiveTab('codegs')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'codegs'
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            2. Otomasi Code.gs Backend
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
            3. Panduan Deploy ke Cloudflare
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-sky-600 text-sky-700 font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            4. Uji Koneksi API (GAS & Cloudflare)
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HEADERS */}
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
                            <Copy className="w-3.5 h-3.5" /> Salin Baris (TSV)
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50/50">
                      <div className="flex flex-wrap gap-1.5">
                        {sheet.columns.map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                              col.startsWith('TP_') || col.startsWith('Nilai_TP_')
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : col.includes('Predikat')
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : col.includes('Peringkat')
                                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                : 'bg-white text-slate-800 border-slate-300'
                            }`}
                          >
                            <span className="text-slate-400 mr-1 text-[10px]">{cIdx + 1}.</span>
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

          {/* TAB 2: CODE.GS */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-indigo-50/70 p-4 rounded-xl border border-indigo-200">
                <div>
                  <h3 className="text-sm font-bold text-indigo-950">
                    Kode Lengkap Google Apps Script (Code.gs)
                  </h3>
                  <p className="text-xs text-indigo-800">
                    Jalankan fungsi <code>setupDatabaseSheets()</code> untuk membuat seluruh 7 sheet, membekukan baris header, dan mengisikan data awal secara otomatis!
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(GOOGLE_APPS_SCRIPT_CODE_GS, 'full_codegs')
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition shrink-0"
                >
                  {copiedSection === 'full_codegs' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" /> Berhasil Disalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Salin Seluruh Kode Code.gs
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs">
                <div className="px-4 py-2 bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800 flex justify-between items-center">
                  <span>Google Apps Script / Code.gs (V8 Runtime)</span>
                  <span className="text-emerald-400">Termasuk setupDatabaseSheets()</span>
                </div>
                <pre className="p-4 max-h-[460px] overflow-auto leading-relaxed select-all">
                  {GOOGLE_APPS_SCRIPT_CODE_GS}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN DEPLOY KE CLOUDFLARE */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-6 text-sm text-slate-800">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-amber-950">
                      Cara Deploy Aplikasi ke Cloudflare Pages (Gratis & Ultra Cepat)
                    </h3>
                    <p className="text-xs text-amber-800">
                      Aplikasi ini dibangun dengan arsitektur SPA Vite standar, 100% kompatibel dan siap di-deploy langsung ke Cloudflare Pages.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block">
                      Metode 1: Hubungkan ke GitHub (Otomatis & Disarankan)
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                      <li>Push kode aplikasi ini ke repository <strong>GitHub</strong> Anda.</li>
                      <li>Buka dashboard <strong>Cloudflare</strong> &gt; <strong>Workers & Pages</strong>.</li>
                      <li>Klik <strong>Create application</strong> &gt; pilih tab <strong>Pages</strong> &gt; <strong>Connect to Git</strong>.</li>
                      <li>Pilih repository Anda, lalu masukkan pengaturan build:</li>
                    </ol>
                    <div className="p-2.5 bg-slate-900 text-white rounded-lg font-mono text-[11px] space-y-1">
                      <p><span className="text-slate-400">Framework preset:</span> <strong className="text-emerald-400">Vite</strong></p>
                      <p><span className="text-slate-400">Build command:</span> <strong className="text-amber-300">npm run build</strong></p>
                      <p><span className="text-slate-400">Build output directory:</span> <strong className="text-sky-300">dist</strong></p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block">
                      Metode 2: Deploy Cepat via Wrangler CLI (Terminal)
                    </span>
                    <p className="text-xs text-slate-700">
                      Jika Anda ingin mendeploy langsung dari komputer/terminal tanpa GitHub, jalankan 2 perintah berikut:
                    </p>
                    <div className="p-3 bg-slate-900 text-white rounded-lg font-mono text-xs space-y-2">
                      <p className="text-slate-400"># 1. Bangun bundle aplikasi:</p>
                      <p className="text-emerald-400">npm run build</p>
                      <p className="text-slate-400"># 2. Deploy ke Cloudflare Pages:</p>
                      <p className="text-amber-300">npx wrangler pages deploy dist --project-name=rapor-kalamkudus</p>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      File konfigurasi <code>wrangler.toml</code> dan header CORS <code>_headers</code> sudah disediakan di root folder aplikasi!
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrasi Antara Cloudflare Frontend dan Google Sheets Backend */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Bagaimana Frontend Cloudflare Berbicara dengan Google Sheets?
                </h4>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    Frontend Anda di Cloudflare adalah web app modern yang berjalan di browser pengguna dengan kecepatan tinggi (CDN global Cloudflare). Data nilai, kurikulum, dan rapor disimpan secara terpusat di <strong>Google Sheets</strong> Anda via skrip <strong>Google Apps Script (Web App)</strong>.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Arsitektur Hybrid Bebas Biaya Server:</p>
                      <p className="text-slate-500">Cloudflare Pages (Frontend Hosting Gratis) ⇄ Web App API Google Apps Script ⇄ Google Sheets Database</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API TESTER */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Uji Integrasi API Web App Google Apps Script
                </h3>
                <p className="text-xs text-slate-500">
                  Setelah men-deploy skrip Code.gs sebagai Web App ("Anyone" access), masukkan URL Web App untuk memverifikasi endpoint API Anda.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Web App Google Apps Script:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      value={gasUrlInput}
                      onChange={(e) => setGasUrlInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={testGasConnection}
                      disabled={isTesting}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {isTesting ? 'Menguji...' : 'Uji Koneksi'}
                    </button>
                  </div>
                </div>

                {testResult && (
                  <div className="p-3 rounded-lg bg-slate-900 text-white font-mono text-xs">
                    {testResult}
                  </div>
                )}
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
