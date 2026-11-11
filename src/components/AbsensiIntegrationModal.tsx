import React, { useState } from 'react';
import { AbsensiSiswa, DataSiswa } from '../types/rapor';
import {
  AlertCircle,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clipboard,
  Code,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  HelpCircle,
  Link2,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

interface AbsensiIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: DataSiswa[];
  absensiList: AbsensiSiswa[];
  semester: 1 | 2;
  onUpdateBulkAbsensi: (newAbsensi: AbsensiSiswa[]) => void;
  onUpdateSingleAbsensi: (nis: string, field: 'sakit' | 'izin' | 'tanpaKeterangan', value: number) => void;
}

export const AbsensiIntegrationModal: React.FC<AbsensiIntegrationModalProps> = ({
  isOpen,
  onClose,
  siswaList,
  absensiList,
  semester,
  onUpdateBulkAbsensi,
  onUpdateSingleAbsensi,
}) => {
  const [activeMethod, setActiveMethod] = useState<'paste' | 'url' | 'script'>('paste');

  // Method 1: Paste Text from Sheets
  const [pastedData, setPastedData] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<
    Array<{
      nis: string;
      nama: string;
      matchedStudent?: DataSiswa;
      sakit: number;
      izin: number;
      tanpaKeterangan: number;
      status: 'valid' | 'matched_by_name' | 'not_found';
    }>
  >([]);
  const [parseError, setParseError] = useState<string>('');
  const [isCopiedScript, setIsCopiedScript] = useState<boolean>(false);

  // Method 2: Google Sheets URL Fetch
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>('');
  const [fetchSuccessMessage, setFetchSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  // Fungsi untuk mem-parse data copy-paste dari Google Sheets / Excel
  const handleParsePastedData = () => {
    setParseError('');
    if (!pastedData.trim()) {
      setParseError('Silakan tempel (paste) data dari Google Sheets terlebih dahulu.');
      return;
    }

    const lines = pastedData.trim().split(/\r?\n/);
    if (lines.length === 0) {
      setParseError('Data yang ditempel kosong.');
      return;
    }

    const results: Array<{
      nis: string;
      nama: string;
      matchedStudent?: DataSiswa;
      sakit: number;
      izin: number;
      tanpaKeterangan: number;
      status: 'valid' | 'matched_by_name' | 'not_found';
    }> = [];

    // Deteksi apakah baris pertama adalah header
    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    if (
      firstLineLower.includes('nama') ||
      firstLineLower.includes('nis') ||
      firstLineLower.includes('sakit') ||
      firstLineLower.includes('izin') ||
      firstLineLower.includes('alpa')
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by tab (biasa saat copy dari Sheets/Excel) atau koma/titik koma
      let parts = line.split('\t');
      if (parts.length === 1) {
        parts = line.split(',');
      }
      if (parts.length === 1) {
        parts = line.split(';');
      }

      // Bersihkan whitespace
      const cleanParts = parts.map((p) => p.trim());

      // Pola fleksibel:
      // Pola 1 (4-5 kolom): NIS | Nama | Sakit | Izin | Alpa
      // Pola 2 (3-4 kolom): Nama | Sakit | Izin | Alpa
      // Pola 3 (6 kolom): No | NIS | Nama | Sakit | Izin | Alpa
      let nisRaw = '';
      let namaRaw = '';
      let s = 0;
      let iz = 0;
      let a = 0;

      if (cleanParts.length >= 5 && /^\d+$/.test(cleanParts[0]) && cleanParts[0].length <= 3) {
        // Pola dengan kolom No di awal: No | NIS | Nama | S | I | A
        nisRaw = cleanParts[1];
        namaRaw = cleanParts[2];
        s = parseInt(cleanParts[3], 10) || 0;
        iz = parseInt(cleanParts[4], 10) || 0;
        a = parseInt(cleanParts[5], 10) || 0;
      } else if (cleanParts.length >= 5) {
        // NIS | Nama | S | I | A
        nisRaw = cleanParts[0];
        namaRaw = cleanParts[1];
        s = parseInt(cleanParts[2], 10) || 0;
        iz = parseInt(cleanParts[3], 10) || 0;
        a = parseInt(cleanParts[4], 10) || 0;
      } else if (cleanParts.length >= 4) {
        // Nama | S | I | A
        namaRaw = cleanParts[0];
        s = parseInt(cleanParts[1], 10) || 0;
        iz = parseInt(cleanParts[2], 10) || 0;
        a = parseInt(cleanParts[3], 10) || 0;
      } else if (cleanParts.length >= 3) {
        // Nama | S | I (alpa 0)
        namaRaw = cleanParts[0];
        s = parseInt(cleanParts[1], 10) || 0;
        iz = parseInt(cleanParts[2], 10) || 0;
      }

      // Cocokkan dengan siswaList
      let matchedStudent = siswaList.find((st) => st.nis === nisRaw || st.nisn === nisRaw);
      let status: 'valid' | 'matched_by_name' | 'not_found' = 'valid';

      if (!matchedStudent && namaRaw) {
        const normName = namaRaw.toLowerCase().replace(/[^a-z0-9]/g, '');
        matchedStudent = siswaList.find((st) => {
          const stName = st.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
          return stName.includes(normName) || normName.includes(stName);
        });
        if (matchedStudent) {
          status = 'matched_by_name';
          nisRaw = matchedStudent.nis;
        } else {
          status = 'not_found';
        }
      } else if (!matchedStudent) {
        status = 'not_found';
      }

      results.push({
        nis: nisRaw,
        nama: namaRaw || (matchedStudent ? matchedStudent.nama : 'Tidak Diketahui'),
        matchedStudent,
        sakit: Math.max(0, s),
        izin: Math.max(0, iz),
        tanpaKeterangan: Math.max(0, a),
        status,
      });
    }

    if (results.length === 0) {
      setParseError('Tidak ada data absensi valid yang dapat dibaca. Pastikan format tabel sesuai.');
    } else {
      setParsedPreview(results);
    }
  };

  // Terapkan hasil import ke state absensi
  const handleApplyImport = () => {
    const validItems = parsedPreview.filter((p) => p.matchedStudent);
    if (validItems.length === 0) {
      setParseError('Tidak ada siswa yang cocok untuk diterapkan.');
      return;
    }

    const updatedList = [...absensiList];
    validItems.forEach((item) => {
      const studentNis = item.matchedStudent!.nis;
      const existingIdx = updatedList.findIndex((a) => a.nis === studentNis);
      if (existingIdx >= 0) {
        updatedList[existingIdx] = {
          ...updatedList[existingIdx],
          sakit: item.sakit,
          izin: item.izin,
          tanpaKeterangan: item.tanpaKeterangan,
        };
      } else {
        updatedList.push({
          nis: studentNis,
          semester,
          sakit: item.sakit,
          izin: item.izin,
          tanpaKeterangan: item.tanpaKeterangan,
        });
      }
    });

    onUpdateBulkAbsensi(updatedList);
    setFetchSuccessMessage(`Berhasil menyinkronkan data absensi untuk ${validItems.length} siswa!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Method 2: Fetch dari URL Publik Google Sheets (Export CSV)
  const handleFetchFromUrl = async () => {
    setFetchError('');
    setFetchSuccessMessage('');
    if (!sheetUrl.trim()) {
      setFetchError('Masukkan URL Google Sheets terlebih dahulu.');
      return;
    }

    setIsLoadingFetch(true);
    try {
      // Ekstrak ID spreadsheet
      const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('URL Google Sheets tidak valid. Pastikan link memiliki format: https://docs.google.com/spreadsheets/d/...');
      }

      const sheetId = match[1];
      // Ekstrak gid jika ada
      const gidMatch = sheetUrl.match(/gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : '0';

      // Bentuk URL export CSV resmi Google Sheets
      const csvExportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

      const res = await fetch(csvExportUrl);
      if (!res.ok) {
        throw new Error(`Gagal mengambil data dari Google Sheets (Status: ${res.status}). Pastikan spreadsheet disetel "Siapa saja yang memiliki link dapat melihat" (Public/Anyone with link).`);
      }

      const csvText = await res.text();
      setPastedData(csvText);
      setActiveMethod('paste');
      setFetchSuccessMessage('Data CSV dari Google Sheets berhasil diambil! Silakan periksa pratinjau.');

      // Otomatis parse
      setTimeout(() => {
        handleParsePastedData();
      }, 100);
    } catch (err: any) {
      setFetchError(err.message || 'Terjadi kesalahan saat mengambil spreadsheet.');
    } finally {
      setIsLoadingFetch(false);
    }
  };

  // Script Apps Script siap pakai untuk Google Sheets Absensi guru
  const gasAbsensiSnippet = `/**
 * ==============================================================================
 * SCRIPT OTOMASI REKAP ABSENSI KE E-RAPOR KURIKULUM DEEP LEARNING
 * Pasang script ini di Google Sheets Absensi Anda:
 * 1. Buka Google Sheets Absensi Anda
 * 2. Klik menu 'Ekstensi' > 'Apps Script'
 * 3. Hapus kode default, lalu tempel (paste) kode di bawah ini
 * 4. Klik 'Simpan', lalu refresh halaman spreadsheet Anda
 * 5. Akan muncul menu baru: '🎓 E-Rapor' > 'Ekspor Rekap Absensi Semester'
 * ==============================================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎓 E-Rapor')
    .addItem('📊 Ekspor Rekap Absensi Semester', 'eksporRekapAbsensi')
    .addToUi();
}

function eksporRekapAbsensi() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('Data pada sheet ini masih kosong.');
    return;
  }
  
  // Format ekspor teks yang siap di-copy langsung ke Web Rapor
  let hasilText = 'NIS\\tNama\\tSakit\\tIzin\\tTanpa Keterangan\\n';
  
  // Asumsi kolom standar absensi:
  // Kolom A: NIS / No | Kolom B: Nama Siswa | Kolom Sakit (S) | Kolom Izin (I) | Kolom Alpa (A)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const colA = String(row[0] || '').trim();
    const colB = String(row[1] || '').trim();
    
    // Cari angka pada 3 kolom absensi
    const s = Number(row[2]) || 0;
    const iz = Number(row[3]) || 0;
    const a = Number(row[4]) || 0;
    
    hasilText += colA + '\\t' + colB + '\\t' + s + '\\t' + iz + '\\t' + a + '\\n';
  }
  
  const ui = SpreadsheetApp.getUi();
  const htmlOutput = HtmlService.createHtmlOutput(
    '<p>Salin teks di bawah ini lalu tempelkan di aplikasi Web Rapor (Tab <b>Integrasi Absensi</b>):</p>' +
    '<textarea style="width:100%;height:200px;font-family:monospace;font-size:11px;" readonly id="rekapBox">' + hasilText + '</textarea>' +
    '<br><button onclick="document.getElementById(\\'rekapBox\\').select();document.execCommand(\\'copy\\');alert(\\'Teks berhasil disalin!\\');" style="margin-top:10px;padding:8px 16px;background:#4f46e5;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">Salin ke Clipboard</button>'
  ).setWidth(500).setHeight(320);
  
  ui.showModalDialog(htmlOutput, 'Rekap Absensi Siap untuk E-Rapor');
}
`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(gasAbsensiSnippet);
    setIsCopiedScript(true);
    setTimeout(() => setIsCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Integrasi Rekap Absensi Semester {semester}
                <span className="text-[11px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Google Sheets Ready
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Sinkronkan rekap kehadiran (Sakit, Izin, Tanpa Keterangan) dari aplikasi absensi Google Sheets Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Selector Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 pt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveMethod('paste')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-t border-x ${
              activeMethod === 'paste'
                ? 'bg-white text-indigo-700 border-slate-200 shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Clipboard className="w-4 h-4 text-indigo-600" />
            Salin-Tempel (Quick Paste)
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('url')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-t border-x ${
              activeMethod === 'url'
                ? 'bg-white text-indigo-700 border-slate-200 shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Link2 className="w-4 h-4 text-emerald-600" />
            Tarik via Link Google Sheets
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('script')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-t border-x ${
              activeMethod === 'script'
                ? 'bg-white text-indigo-700 border-slate-200 shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Code className="w-4 h-4 text-amber-600" />
            Script Otomasi Google Sheets
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {fetchSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{fetchSuccessMessage}</span>
            </div>
          )}

          {/* METHOD 1: QUICK PASTE */}
          {activeMethod === 'paste' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200/80 p-4 rounded-xl text-xs text-indigo-950 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-900">Cara Cepat & Mudah (Tanpa Kendala Izin Link):</h4>
                  <p className="mt-1 text-slate-700 leading-relaxed">
                    1. Buka Google Sheets absensi Anda.<br />
                    2. Blok tabel kolom <strong>NIS / Nama</strong>, <strong>Sakit</strong>, <strong>Izin</strong>, dan <strong>Alpa/Tanpa Keterangan</strong>.<br />
                    3. Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px]">Ctrl+C</kbd>, lalu klik kotak di bawah dan tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px]">Ctrl+V</kbd>.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                    Tempelkan Data Rekap Absensi di Sini:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPastedData(
                        `NIS\tNama Siswa\tSakit\tIzin\tTanpa Keterangan\n230101\tADRY GRACIO SURYAJAYA\t4\t0\t0\n230107\tAUREL AFCELLA SINURAT\t4\t0\t0\n230102\tCLARA BERNADETH\t1\t2\t0\n230103\tDANIEL KRISTIANTO\t0\t1\t0\n230104\tGABRIELLA ANGELINA\t2\t0\t0\n230105\tMICHAEL PRASETYA\t5\t3\t1\n230106\tREBECCA PUTRI\t0\t0\t0`
                      );
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Muat Contoh Data
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={pastedData}
                  onChange={(e) => setPastedData(e.target.value)}
                  placeholder={`Contoh baris tabel yang di-copy dari spreadsheet:\n230101\tADRY GRACIO SURYAJAYA\t4\t0\t0\n230107\tAUREL AFCELLA SINURAT\t4\t0\t0`}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleParsePastedData}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Analisis & Pratinjau Rekap
                </button>
                {pastedData && (
                  <button
                    type="button"
                    onClick={() => {
                      setPastedData('');
                      setParsedPreview([]);
                      setParseError('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Bersihkan
                  </button>
                )}
              </div>

              {parseError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Preview Table */}
              {parsedPreview.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">
                      Pratinjau Hasil Sinkronisasi ({parsedPreview.length} Baris Terdeteksi):
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {parsedPreview.filter((p) => p.matchedStudent).length} Siswa Cocok
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] uppercase sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Nama Siswa di Database</th>
                          <th className="py-2 px-3">NIS</th>
                          <th className="py-2 px-3 text-center">Sakit</th>
                          <th className="py-2 px-3 text-center">Izin</th>
                          <th className="py-2 px-3 text-center">Alpa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedPreview.map((item, idx) => (
                          <tr
                            key={idx}
                            className={
                              item.status === 'not_found'
                                ? 'bg-rose-50/60 text-rose-900'
                                : 'hover:bg-slate-50'
                            }
                          >
                            <td className="py-2 px-3 font-semibold text-[11px]">
                              {item.status === 'valid' && (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                                  <Check className="w-3 h-3" /> Cocok
                                </span>
                              )}
                              {item.status === 'matched_by_name' && (
                                <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                                  Cocok Nama
                                </span>
                              )}
                              {item.status === 'not_found' && (
                                <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                                  Tidak Ditemukan
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {item.matchedStudent ? item.matchedStudent.nama : item.nama}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-600">{item.nis || '-'}</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-800">
                              {item.sakit} hari
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-800">
                              {item.izin} hari
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-800">
                              {item.tanpaKeterangan} hari
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleApplyImport}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition"
                    >
                      <Check className="w-4 h-4" />
                      Terapkan Rekap ke E-Rapor Sekarang
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* METHOD 2: FETCH URL */}
          {activeMethod === 'url' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-emerald-600" />
                  Hubungkan via Tautan Publik Google Sheets
                </h4>
                <p className="leading-relaxed">
                  Pastikan spreadsheet absensi Anda telah disetel aksesnya ke:
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mx-1">
                    Siapa saja yang memiliki tautan dapat melihat (Viewer)
                  </span>.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Tautan (URL) Google Sheets Absensi Anda:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1A2B3C.../edit#gid=0"
                    className="flex-1 text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFromUrl}
                    disabled={isLoadingFetch}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0"
                  >
                    {isLoadingFetch ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Mengambil...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Tarik Data
                      </>
                    )}
                  </button>
                </div>
              </div>

              {fetchError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Gagal mengambil data:</p>
                    <p>{fetchError}</p>
                    <p className="text-[11px] text-slate-600 pt-1">
                      💡 <strong>Tips:</strong> Jika Google Sheets Anda bersifat privat/khusus internal organisasi belajar.id, gunakan <strong>Metode 1 (Salin-Tempel / Quick Paste)</strong> yang bekerja 100% tanpa perlu mengubah hak akses spreadsheet!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* METHOD 3: GOOGLE APPS SCRIPT SNIPPET */}
          {activeMethod === 'script' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex items-start gap-3">
                <Code className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900">
                    Otomasi Menu di Spreadsheet Absensi Anda:
                  </h4>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    Pasang script ini di Google Sheets absensi Anda untuk menambahkan tombol menu ekspor satu-klik langsung dari dalam spreadsheet.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    Google Apps Script (Code.gs Absensi)
                  </span>
                  <button
                    type="button"
                    onClick={copyScriptToClipboard}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {isCopiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Script
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto max-h-64 border border-slate-800">
                  {gasAbsensiSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* Tabel Rekapitulasi Absensi Saat Ini di Aplikasi Rapor */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-indigo-600" />
                Rekap Kehadiran Siswa di E-Rapor Saat Ini ({siswaList.length} Siswa):
              </h4>
              <span className="text-[11px] text-slate-500">
                Langsung tampil pada cetakan lembar Rapor Inti (A4)
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center">No</th>
                    <th className="py-2 px-3">Nama Siswa</th>
                    <th className="py-2 px-3">NIS</th>
                    <th className="py-2 px-3 text-center w-24">Sakit</th>
                    <th className="py-2 px-3 text-center w-24">Izin</th>
                    <th className="py-2 px-3 text-center w-28">Tanpa Ket.</th>
                    <th className="py-2 px-3 text-center w-28">Total Tidak Hadir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {siswaList.map((siswa, idx) => {
                    const abs = absensiList.find((a) => a.nis === siswa.nis) || {
                      sakit: 0,
                      izin: 0,
                      tanpaKeterangan: 0,
                    };
                    const totalAbsent = abs.sakit + abs.izin + abs.tanpaKeterangan;
                    return (
                      <tr key={siswa.nis} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-500 font-semibold">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{siswa.nama}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{siswa.nis}</td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={abs.sakit}
                            onChange={(e) =>
                              onUpdateSingleAbsensi(
                                siswa.nis,
                                'sakit',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-16 text-center font-bold text-xs bg-slate-50 border border-slate-300 rounded-lg py-1 focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={abs.izin}
                            onChange={(e) =>
                              onUpdateSingleAbsensi(
                                siswa.nis,
                                'izin',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-16 text-center font-bold text-xs bg-slate-50 border border-slate-300 rounded-lg py-1 focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={abs.tanpaKeterangan}
                            onChange={(e) =>
                              onUpdateSingleAbsensi(
                                siswa.nis,
                                'tanpaKeterangan',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-16 text-center font-bold text-xs bg-slate-50 border border-slate-300 rounded-lg py-1 focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-900">
                          {totalAbsent} hari
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Keterangan ketidakhadiran otomatis terakumulasi di Rapor Inti siswa.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
