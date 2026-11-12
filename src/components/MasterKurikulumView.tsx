import React, { useState, useRef } from 'react';
import { MasterKurikulumMapel, FaseKurikulum, FileAtpLampiran } from '../types/rapor';
import {
  BookOpen,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  Upload,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Info,
  Trash2,
  Sparkles,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface MasterKurikulumViewProps {
  kurikulum: MasterKurikulumMapel[];
  onUpdateMapel: (updatedMapel: MasterKurikulumMapel) => void;
}

export const MasterKurikulumView: React.FC<MasterKurikulumViewProps> = ({
  kurikulum,
  onUpdateMapel,
}) => {
  const [selectedKode, setSelectedKode] = useState<string>(kurikulum[0]?.kodeMapel || '');
  const activeMapel = kurikulum.find((m) => m.kodeMapel === selectedKode) || kurikulum[0];

  // Fase view switcher
  const [activeFaseTab, setActiveFaseTab] = useState<FaseKurikulum>(
    activeMapel?.faseAktif || 'Fase C'
  );

  // Sub-tabs: 'cp_elemen' | 'tp_list' | 'upload_atp'
  const [activeSection, setActiveSection] = useState<'cp_elemen' | 'tp_list' | 'upload_atp'>('cp_elemen');

  // Upload state
  const [uploadNote, setUploadNote] = useState('');
  const [parsedPreviewTp, setParsedPreviewTp] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle TP text change
  const handleTpChange = (index: number, newText: string) => {
    const updatedTp = [...activeMapel.tpNarasi];
    updatedTp[index] = newText;
    onUpdateMapel({
      ...activeMapel,
      tpNarasi: updatedTp,
    });
  };

  // Get CP and ATP text for currently selected Fase tab
  const getFaseCpText = (fase: FaseKurikulum) => {
    if (fase === 'Fase A') return activeMapel.cpFaseA || activeMapel.cp;
    if (fase === 'Fase B') return activeMapel.cpFaseB || activeMapel.cp;
    return activeMapel.cpFaseC || activeMapel.cp;
  };

  const getFaseAtpText = (fase: FaseKurikulum) => {
    if (fase === 'Fase A') return activeMapel.atpFaseA || activeMapel.atp;
    if (fase === 'Fase B') return activeMapel.atpFaseB || activeMapel.atp;
    return activeMapel.atpFaseC || activeMapel.atp;
  };

  const handleUpdateCpText = (text: string) => {
    if (activeFaseTab === 'Fase A') {
      onUpdateMapel({ ...activeMapel, cpFaseA: text });
    } else if (activeFaseTab === 'Fase B') {
      onUpdateMapel({ ...activeMapel, cpFaseB: text });
    } else {
      onUpdateMapel({ ...activeMapel, cpFaseC: text, cp: text });
    }
  };

  const handleUpdateAtpText = (text: string) => {
    if (activeFaseTab === 'Fase A') {
      onUpdateMapel({ ...activeMapel, atpFaseA: text });
    } else if (activeFaseTab === 'Fase B') {
      onUpdateMapel({ ...activeMapel, atpFaseB: text });
    } else {
      onUpdateMapel({ ...activeMapel, atpFaseC: text, atp: text });
    }
  };

  // Set default active Fase
  const handleSetActiveFase = (fase: FaseKurikulum) => {
    setActiveFaseTab(fase);
    const cpText = fase === 'Fase A' ? activeMapel.cpFaseA : fase === 'Fase B' ? activeMapel.cpFaseB : activeMapel.cpFaseC;
    const atpText = fase === 'Fase A' ? activeMapel.atpFaseA : fase === 'Fase B' ? activeMapel.atpFaseB : activeMapel.atpFaseC;
    onUpdateMapel({
      ...activeMapel,
      faseAktif: fase,
      cp: cpText || activeMapel.cp,
      atp: atpText || activeMapel.atp,
    });
  };

  // File Upload & Parser for TP / ATP
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Memproses ${file.name}...`);
    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase();
      let extractedTp: string[] = [];

      if (fileExt === 'csv' || fileExt === 'txt') {
        const text = await file.text();
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.toLowerCase().startsWith('no') && !l.toLowerCase().startsWith('kode'));

        extractedTp = lines.map((line) => {
          // Remove leading numbers, bullet points, quotes
          return line
            .replace(/^["']|["']$/g, '')
            .replace(/^(TP[_\s]*\d+[:.-]*|\d+[:.-]*)\s*/i, '')
            .trim();
        }).filter((t) => t.length > 3);
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

        jsonData.forEach((row) => {
          if (Array.isArray(row)) {
            row.forEach((cell) => {
              if (cell && typeof cell === 'string' && cell.trim().length > 5) {
                const cleaned = cell
                  .replace(/^(TP[_\s]*\d+[:.-]*|\d+[:.-]*)\s*/i, '')
                  .trim();
                if (cleaned.length > 5 && !cleaned.toLowerCase().includes('tujuan pembelajaran')) {
                  extractedTp.push(cleaned);
                }
              }
            });
          }
        });
      }

      // Add to attachment list
      const newAttachment: FileAtpLampiran = {
        id: 'file-' + Date.now(),
        fileName: file.name,
        fileType: file.type || fileExt || 'dokumen',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleString('id-ID'),
        uploadedBy: 'Guru / Wali Kelas',
        catatan: uploadNote || 'Berkas acuan kurikulum ATP/TP',
        tpExtracted: extractedTp.slice(0, 25),
      };

      const existingAttachments = activeMapel.fileAtpLampiran || [];
      onUpdateMapel({
        ...activeMapel,
        fileAtpLampiran: [newAttachment, ...existingAttachments],
      });

      if (extractedTp.length > 0) {
        setParsedPreviewTp(extractedTp.slice(0, 25));
        setUploadStatus(`Berhasil membaca ${extractedTp.length} Tujuan Pembelajaran (TP) dari file!`);
      } else {
        setUploadStatus(`File ${file.name} berhasil diunggah sebagai lampiran referensi ATP.`);
      }
      setUploadNote('');
    } catch (err: any) {
      setUploadStatus(`Gagal membaca berkas: ${err?.message || 'Format tidak didukung'}`);
    }
  };

  // Apply parsed TPs to activeMapel.tpNarasi
  const handleApplyExtractedTp = () => {
    if (parsedPreviewTp.length === 0) return;
    const newTpNarasi = [...activeMapel.tpNarasi];
    parsedPreviewTp.forEach((tp, idx) => {
      if (idx < 25) {
        newTpNarasi[idx] = tp;
      }
    });

    onUpdateMapel({
      ...activeMapel,
      tpNarasi: newTpNarasi,
    });
    setUploadStatus(`Berhasil menerapkan ${parsedPreviewTp.length} TP ke dalam Master Kurikulum mapel ${activeMapel.namaMapel}!`);
    setParsedPreviewTp([]);
  };

  // Remove attachment
  const handleRemoveAttachment = (fileId: string) => {
    const updated = (activeMapel.fileAtpLampiran || []).filter((f) => f.id !== fileId);
    onUpdateMapel({
      ...activeMapel,
      fileAtpLampiran: updated,
    });
  };

  // Download template CSV
  const handleDownloadCsvTemplate = () => {
    const csvRows = [
      'No,Kode_TP,Teks_Tujuan_Pembelajaran',
      ...activeMapel.tpNarasi.map((tp, idx) => `${idx + 1},TP_${idx + 1},"${tp.replace(/"/g, '""')}"`),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Template_TP_${activeMapel.kodeMapel}_${activeMapel.namaMapel.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filled TP count
  const filledTpCount = activeMapel.tpNarasi.filter((t) => t && t.trim().length > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                Kepka BKPDM No. 020/2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                SD Kristen Kalam Kudus Blitar
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-2">
              <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
              Master Kurikulum Deep Learning: Capaian Pembelajaran (Fase A s.d. C) & 25 TP
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Memuat Capaian Pembelajaran (CP) SD resmi untuk <strong>Fase A (Kelas I-II)</strong>, <strong>Fase B (Kelas III-IV)</strong>, dan <strong>Fase C (Kelas V-VI)</strong> beserta elemen-elemennya. Dilengkapi fitur unggah berkas Alur Tujuan Pembelajaran (ATP) dan 25 narasi TP sebagai <strong>patokan otomatis pemberian nilai dan deskripsi capaian rapor</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Pilih Mapel:</span>
              <select
                value={selectedKode}
                onChange={(e) => setSelectedKode(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500"
              >
                {kurikulum.map((m) => (
                  <option key={m.kodeMapel} value={m.kodeMapel}>
                    [{m.kodeMapel}] {m.namaMapel}
                  </option>
                ))}
              </select>
            </div>

            <a
              href="/assets/aistudio/Salinan_Kepka_BKPDM_No._020_Tahun_2026_tentang_Perubahan_atas_Keputusan_Kepala_BSKAP_Kemendikdasmen_No._046_H_KR_2025_59827874.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition"
              title="Buka Dokumen Resmi Kepka BKPDM No. 020 Tahun 2026"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Regulasi Kepka 020/2026
            </a>
          </div>
        </div>

        {/* Phase Selector Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-4 h-4 text-indigo-600" />
              Pilih Fase SD:
            </span>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {(['Fase A', 'Fase B', 'Fase C'] as FaseKurikulum[]).map((fase) => {
                const isSelected = activeFaseTab === fase;
                const isCurrentActive = activeMapel.faseAktif === fase;
                return (
                  <button
                    key={fase}
                    type="button"
                    onClick={() => handleSetActiveFase(fase)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{fase}</span>
                    <span className="text-[10px] font-normal opacity-75">
                      {fase === 'Fase A' ? '(Kelas I-II)' : fase === 'Fase B' ? '(Kelas III-IV)' : '(Kelas V-VI)'}
                    </span>
                    {isCurrentActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Fase Aktif Rapor" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              TP Terisi: <strong>{filledTpCount} / 25</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold text-[11px]">
              Fase Aktif Kelas V: {activeMapel.faseAktif || 'Fase C'}
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSection('cp_elemen')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSection === 'cp_elemen'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1. Capaian Pembelajaran & Elemen ({activeFaseTab})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('tp_list')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSection === 'tp_list'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            2. Daftar 25 Narasi TP (Patokan Penilaian)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('upload_atp')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSection === 'upload_atp'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            3. Unggah Berkas ATP / TP & Panduan
            {(activeMapel.fileAtpLampiran?.length || 0) > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700">
                {activeMapel.fileAtpLampiran?.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: CP & ELEMEN VIEW */}
      {activeSection === 'cp_elemen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CP Box */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Capaian Pembelajaran (CP) - {activeFaseTab}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeFaseTab === 'Fase A' ? 'Kelas I-II' : activeFaseTab === 'Fase B' ? 'Kelas III-IV' : 'Kelas V-VI'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Teks resmi kompetensi yang harus dicapai peserta didik pada akhir fase pembelajaran ini.
              </p>
              <textarea
                rows={5}
                value={getFaseCpText(activeFaseTab)}
                onChange={(e) => handleUpdateCpText(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>

            {/* ATP Box */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                  Alur Tujuan Pembelajaran (ATP) - {activeFaseTab}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeFaseTab === 'Fase A' ? 'Kelas I-II' : activeFaseTab === 'Fase B' ? 'Kelas III-IV' : 'Kelas V-VI'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Rangkaian tujuan pembelajaran yang disusun secara logis dan runtut menuju ketercapaian CP.
              </p>
              <textarea
                rows={5}
                value={getFaseAtpText(activeFaseTab)}
                onChange={(e) => handleUpdateAtpText(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Breakdown Elemen Capaian Pembelajaran */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Rincian Elemen Capaian Pembelajaran ({activeMapel.namaMapel})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi kompetensi per elemen materi sesuai Lampiran Kepka BKPDM Kemendikdasmen No. 020 Tahun 2026.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                Menampilkan: {activeFaseTab}
              </span>
            </div>

            {activeMapel.elemenCapaian && activeMapel.elemenCapaian.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3 border border-slate-200 font-bold w-12 text-center">No</th>
                      <th className="py-2.5 px-3 border border-slate-200 font-bold w-48">Elemen / Subelemen</th>
                      <th className="py-2.5 px-3 border border-slate-200 font-bold">
                        Deskripsi Capaian Pembelajaran ({activeFaseTab})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeMapel.elemenCapaian.map((el, idx) => {
                      const deskripsi =
                        activeFaseTab === 'Fase A'
                          ? el.deskripsiFaseA
                          : activeFaseTab === 'Fase B'
                          ? el.deskripsiFaseB
                          : el.deskripsiFaseC;

                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 border border-slate-200 text-center font-bold text-slate-600">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 border border-slate-200">
                            <span className="font-bold text-slate-900 block">{el.elemen}</span>
                            {el.subElemen && (
                              <span className="text-[11px] text-indigo-600 block mt-0.5 font-medium">
                                {el.subElemen}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 border border-slate-200 text-slate-800 leading-relaxed">
                            {deskripsi || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                Data elemen capaian spesifik belum didefinisikan untuk mata pelajaran ini. Anda dapat mengisinya melalui berkas lampiran ATP.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: 25 TP LIST VIEW */}
      {activeSection === 'tp_list' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                25 Teks Narasi Tujuan Pembelajaran (TP_1 s.d. TP_25)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tiap TP menjadi patokan penilaian formatif. Nilai tertinggi (Max TP) dan terendah (Min TP) akan dirangkai menjadi narasi capaian otomatis pada rapor siswa.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsvTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition"
                title="Unduh 25 TP dalam bentuk file CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Unduh Format CSV
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('upload_atp')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Impor dari File
              </button>
            </div>
          </div>

          {/* Formula notice */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Rumus Kalimat Rapor Otomatis:</strong> Tuliskan narasi TP dengan kata kerja operasional atau esensi materi (contoh: <em>"memahami operasi hitung pecahan desimal"</em>). Sistem akan merangkai capaian menjadi:
              <span className="block font-mono text-[11px] bg-white/70 p-1.5 rounded mt-1 border border-amber-200 text-slate-800">
                "Ananda [Nama] menunjukkan penguasaan yang sangat baik dalam <strong>[Teks TP Tertinggi]</strong>, namun perlu bimbingan dalam <strong>[Teks TP Terendah]</strong>."
              </span>
            </div>
          </div>

          {/* 25 Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[650px] overflow-y-auto pr-1">
            {activeMapel.tpNarasi.map((tpText, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition"
              >
                <span className="w-12 h-7 rounded bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  TP_{idx + 1}
                </span>

                <div className="flex-1">
                  <input
                    type="text"
                    value={tpText}
                    onChange={(e) => handleTpChange(idx, e.target.value)}
                    placeholder={`Indikator TP ke-${idx + 1} (${activeMapel.namaMapel})...`}
                    className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: UPLOAD FILE ATP / TP */}
      {activeSection === 'upload_atp' && (
        <div className="space-y-6">
          {/* Upload Drop Zone Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Upload className="w-5 h-5 text-indigo-600" />
              Unggah File TP / ATP sebagai Patokan Penilaian
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Unggah dokumen panduan ATP, silabus, atau berkas tabel TP dalam format <strong>Excel (.xlsx, .xls)</strong>, <strong>CSV</strong>, atau <strong>PDF/Teks</strong>. Sistem dapat secara otomatis mengekstrak poin-poin TP untuk mengisi 25 indikator penilaian siswa di Master Kurikulum.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/70 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px]"
                >
                  <FileSpreadsheet className="w-10 h-10 text-indigo-600 mb-2" />
                  <p className="text-xs font-bold text-indigo-950">
                    Klik di sini untuk memilih berkas dari komputer/perangkat Anda
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Mendukung format: .xlsx, .xls, .csv, .pdf, .txt, .docx (Maksimal 15 MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls, .pdf, .txt, .doc, .docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Dokumen / Keterangan:
                  </label>
                  <textarea
                    rows={3}
                    value={uploadNote}
                    onChange={(e) => setUploadNote(e.target.value)}
                    placeholder="Contoh: Dokumen ATP Kelas V Semester 1 & 2 disetujui Kepala Sekolah..."
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Unduh Format Baku:
                  </span>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-slate-300 text-xs font-bold rounded shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Template TP (.csv)
                  </button>
                </div>
              </div>
            </div>

            {uploadStatus && (
              <div className="p-3 rounded-lg text-xs bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center justify-between">
                <span>{uploadStatus}</span>
                <button
                  type="button"
                  onClick={() => setUploadStatus(null)}
                  className="text-indigo-600 hover:text-indigo-950 font-bold ml-2 text-[11px]"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* Parsed Preview Modal / Box */}
            {parsedPreviewTp.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Pratinjau Hasil Ekstraksi TP dari Berkas ({parsedPreviewTp.length} TP ditemukan):
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyExtractedTp}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Terapkan ke 25 TP Mapel Ini
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1 max-h-48 overflow-y-auto text-xs text-emerald-950 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                  {parsedPreviewTp.map((item, idx) => (
                    <li key={idx} className="line-clamp-1 py-0.5">
                      <strong className="text-emerald-800">TP_{idx + 1}:</strong> {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* List of Uploaded Documents */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              Daftar Dokumen ATP & TP Terlampir ({activeMapel.namaMapel})
            </h3>

            {(activeMapel.fileAtpLampiran || []).length > 0 ? (
              <div className="space-y-3">
                {activeMapel.fileAtpLampiran?.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{file.fileName}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                          <span>Ukuran: {file.fileSize || '-'}</span>
                          <span>•</span>
                          <span>Diunggah: {file.uploadedAt}</span>
                          <span>•</span>
                          <span className="text-indigo-700 font-semibold">{file.uploadedBy || 'Wali Kelas'}</span>
                        </div>
                        {file.catatan && (
                          <p className="text-[11px] text-slate-600 mt-1 italic">
                            "{file.catatan}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id)}
                        className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus berkas lampiran ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                Belum ada dokumen ATP / TP khusus yang diunggah untuk mata pelajaran ini. Silakan gunakan area unggah di atas.
              </div>
            )}
          </div>

          {/* Official Kemendikdasmen Reference Card */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-800 text-indigo-200 rounded">
                Rujukan Resmi Pemerintah RI
              </span>
              <h4 className="text-sm font-bold mt-1">
                Keputusan Kepala BKPDM Kemendikdasmen No. 020 Tahun 2026
              </h4>
              <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
                Perubahan atas Keputusan Kepala BSKAP No. 046/H/KR/2025 tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah (Kurikulum Merdeka / Deep Learning).
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="/assets/aistudio/Salinan_Kepka_BKPDM_No._020_Tahun_2026_tentang_Perubahan_atas_Keputusan_Kepala_BSKAP_Kemendikdasmen_No._046_H_KR_2025_59827874.pdf"
                download="Salinan_Kepka_BKPDM_No._020_Tahun_2026.pdf"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </a>
              <a
                href="/assets/aistudio/Salinan_Kepka_BKPDM_No._020_Tahun_2026_tentang_Perubahan_atas_Keputusan_Kepala_BSKAP_Kemendikdasmen_No._046_H_KR_2025_59827874.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs rounded-lg shadow-sm transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka Salinan
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
