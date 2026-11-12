import React, { useState, useMemo, useEffect } from 'react';
import {
  DataSiswa,
  MasterKurikulumMapel,
  NilaiFormatifSiswa,
  NilaiSumatifSiswa,
  UserSession,
} from '../types/rapor';
import {
  generateAutoDeskripsiMapel,
  hitungNilaiAkhir,
  hitungRataFormatif,
  hitungRataSumatif,
} from '../utils/raporCalculations';
import {
  AlertCircle,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  Download,
  Edit3,
  FileSpreadsheet,
  FileText,
  Lock,
  RefreshCw,
  Search,
  Sparkles,
  Table,
  Upload,
  User,
  Users,
  X,
  Zap,
  UploadCloud,
  Database,
} from 'lucide-react';

interface NilaiEditorProps {
  siswaList: DataSiswa[];
  selectedNis: string;
  onSelectNis: (nis: string) => void;
  kurikulum: MasterKurikulumMapel[];
  nilaiFormatif: NilaiFormatifSiswa[];
  nilaiSumatif: NilaiSumatifSiswa[];
  onUpdateFormatif: (nis: string, kodeMapel: string, tpIndex: number, value: number) => void;
  onUpdateSumatif: (
    nis: string,
    kodeMapel: string,
    field: 'lm1' | 'lm2' | 'lm3' | 'lm4' | 'sts' | 'sas',
    value: number
  ) => void;
  userSession?: UserSession;
  onSaveToGoogleSheets?: () => void;
  isSavingToSheets?: boolean;
}

export const NilaiEditor: React.FC<NilaiEditorProps> = ({
  siswaList,
  selectedNis,
  onSelectNis,
  kurikulum,
  nilaiFormatif,
  nilaiSumatif,
  onUpdateFormatif,
  onUpdateSumatif,
  userSession,
  onSaveToGoogleSheets,
  isSavingToSheets = false,
}) => {
  // Mode View: 'massal' (Grid seluruh siswa) atau 'satuan' (Per individu siswa)
  const [inputMode, setInputMode] = useState<'massal' | 'satuan'>('massal');

  // Selected Mapel Code
  const initialMapelKode =
    userSession?.role === 'guru_mapel' && userSession.kodeMapelAjar
      ? userSession.kodeMapelAjar
      : kurikulum[0]?.kodeMapel || '';

  const [selectedMapelKode, setSelectedMapelKode] = useState<string>(initialMapelKode);
  const [showAllTps, setShowAllTps] = useState<boolean>(false);
  const [searchSiswa, setSearchSiswa] = useState<string>('');
  const [showKurikulumPatokan, setShowKurikulumPatokan] = useState<boolean>(false);

  // Bulk Paste Modal State
  const [isBulkPasteOpen, setIsBulkPasteOpen] = useState<boolean>(false);
  const [pasteColumnTarget, setPasteColumnTarget] = useState<'all' | 'formatif' | 'sumatif'>('all');
  const [pastedRawText, setPastedRawText] = useState<string>('');
  const [bulkPasteSuccess, setBulkPasteSuccess] = useState<string>('');

  // Quick Fill State
  const [isQuickFillOpen, setIsQuickFillOpen] = useState<boolean>(false);
  const [quickFillColumn, setQuickFillColumn] = useState<'lm1' | 'lm2' | 'lm3' | 'lm4' | 'sts' | 'sas' | 'tp1'>('sts');
  const [quickFillValue, setQuickFillValue] = useState<number>(85);

  // If role is guru_mapel, lock selectedMapelKode to their assigned subject
  useEffect(() => {
    if (userSession?.role === 'guru_mapel' && userSession.kodeMapelAjar) {
      setSelectedMapelKode(userSession.kodeMapelAjar);
    }
  }, [userSession]);

  const isRoleLocked =
    userSession?.role === 'guru_mapel' &&
    userSession.kodeMapelAjar !== undefined &&
    userSession.kodeMapelAjar !== '';

  const activeSiswa = siswaList.find((s) => s.nis === selectedNis) || siswaList[0];
  const activeMapel =
    kurikulum.find((m) => m.kodeMapel === selectedMapelKode) || kurikulum[0];

  // Current Formatif & Sumatif for Active Student (in 'satuan' mode)
  const currentFormatif =
    nilaiFormatif.find((f) => f.nis === selectedNis && f.kodeMapel === selectedMapelKode) || {
      nis: selectedNis,
      kodeMapel: selectedMapelKode,
      nilaiTp: new Array(25).fill(0),
    };

  const currentSumatif =
    nilaiSumatif.find((s) => s.nis === selectedNis && s.kodeMapel === selectedMapelKode) || {
      nis: selectedNis,
      kodeMapel: selectedMapelKode,
      sumatifLm: [0, 0, 0, 0],
      sts: 0,
      sas: 0,
    };

  // Live Calculations for Active Student
  const rataFormatif = hitungRataFormatif(currentFormatif.nilaiTp);
  const rataSumatif = hitungRataSumatif(
    currentSumatif.sumatifLm,
    currentSumatif.sts,
    currentSumatif.sas
  );
  const nilaiAkhir = hitungNilaiAkhir(rataFormatif, rataSumatif);
  const autoDeskripsi = generateAutoDeskripsiMapel(
    currentFormatif.nilaiTp,
    activeMapel.tpNarasi,
    activeMapel.namaMapel
  );

  // Grid Data for ALL students in active mapel
  const allStudentsGridData = useMemo(() => {
    return siswaList.map((siswa) => {
      const fItem =
        nilaiFormatif.find((f) => f.nis === siswa.nis && f.kodeMapel === selectedMapelKode) || {
          nis: siswa.nis,
          kodeMapel: selectedMapelKode,
          nilaiTp: new Array(25).fill(0),
        };

      const sItem =
        nilaiSumatif.find((s) => s.nis === siswa.nis && s.kodeMapel === selectedMapelKode) || {
          nis: siswa.nis,
          kodeMapel: selectedMapelKode,
          sumatifLm: [0, 0, 0, 0],
          sts: 0,
          sas: 0,
        };

      const rForm = hitungRataFormatif(fItem.nilaiTp);
      const rSum = hitungRataSumatif(sItem.sumatifLm, sItem.sts, sItem.sas);
      const na = hitungNilaiAkhir(rForm, rSum);
      const desc = generateAutoDeskripsiMapel(fItem.nilaiTp, activeMapel.tpNarasi, activeMapel.namaMapel);

      return {
        siswa,
        formatif: fItem,
        sumatif: sItem,
        rataFormatif: rForm,
        rataSumatif: rSum,
        nilaiAkhir: na,
        deskripsi: desc.deskripsi,
      };
    });
  }, [siswaList, nilaiFormatif, nilaiSumatif, selectedMapelKode, activeMapel]);

  // Filter grid by search
  const filteredGridData = useMemo(() => {
    if (!searchSiswa.trim()) return allStudentsGridData;
    const q = searchSiswa.toLowerCase();
    return allStudentsGridData.filter(
      (item) =>
        item.siswa.nama.toLowerCase().includes(q) ||
        item.siswa.nis.includes(q) ||
        item.siswa.nisn.includes(q)
    );
  }, [allStudentsGridData, searchSiswa]);

  // Class averages for this subject
  const subjectClassAvg = useMemo(() => {
    const valid = allStudentsGridData.filter((i) => i.nilaiAkhir > 0);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, curr) => acc + curr.nilaiAkhir, 0);
    return Math.round((sum / valid.length) * 10) / 10;
  }, [allStudentsGridData]);

  // Completion percentage
  const subjectCompletionRate = useMemo(() => {
    if (allStudentsGridData.length === 0) return 0;
    const filledCount = allStudentsGridData.filter((i) => i.nilaiAkhir > 0).length;
    return Math.round((filledCount / allStudentsGridData.length) * 100);
  }, [allStudentsGridData]);

  // Handler: Parse and apply bulk paste from spreadsheet
  const handleApplyBulkPaste = () => {
    if (!pastedRawText.trim()) return;

    const lines = pastedRawText.trim().split(/\r?\n/);
    let matchedCount = 0;

    lines.forEach((line) => {
      const parts = line.split('\t').map((p) => p.trim());
      if (parts.length < 2) return;

      // Cek apakah kolom pertama adalah NIS atau Nama
      const identifier = parts[0];
      const targetStudent = siswaList.find(
        (s) =>
          s.nis === identifier ||
          s.nisn === identifier ||
          s.nama.toLowerCase().includes(identifier.toLowerCase())
      );

      if (targetStudent) {
        matchedCount++;
        // Kolom berikutnya berisi nilai
        // Format standar copy tabel: NIS/Nama | LM1 | LM2 | LM3 | LM4 | STS | SAS
        if (pasteColumnTarget === 'sumatif' || pasteColumnTarget === 'all') {
          const lm1 = parseInt(parts[1], 10);
          const lm2 = parseInt(parts[2], 10);
          const lm3 = parseInt(parts[3], 10);
          const lm4 = parseInt(parts[4], 10);
          const sts = parseInt(parts[5], 10);
          const sas = parseInt(parts[6], 10);

          if (!isNaN(lm1)) onUpdateSumatif(targetStudent.nis, selectedMapelKode, 'lm1', lm1);
          if (!isNaN(lm2)) onUpdateSumatif(targetStudent.nis, selectedMapelKode, 'lm2', lm2);
          if (!isNaN(lm3)) onUpdateSumatif(targetStudent.nis, selectedMapelKode, 'lm3', lm3);
          if (!isNaN(lm4)) onUpdateSumatif(targetStudent.nis, selectedMapelKode, 'lm4', lm4);
          if (!isNaN(sts)) onUpdateSumatif(targetStudent.nis, selectedMapelKode, 'sts', sts);
          if (!isNaN(sas)) onUpdateSumatif(targetStudent.nis, selectedMapelKode, 'sas', sas);
        }

        // Jika ada kolom TP 1..5
        if (pasteColumnTarget === 'formatif') {
          for (let tpIdx = 0; tpIdx < Math.min(parts.length - 1, 10); tpIdx++) {
            const val = parseInt(parts[tpIdx + 1], 10);
            if (!isNaN(val)) {
              onUpdateFormatif(targetStudent.nis, selectedMapelKode, tpIdx, val);
            }
          }
        }
      }
    });

    setBulkPasteSuccess(`Berhasil mengisi nilai secara massal untuk ${matchedCount} siswa!`);
    setTimeout(() => {
      setIsBulkPasteOpen(false);
      setPastedRawText('');
      setBulkPasteSuccess('');
    }, 1500);
  };

  // Handler: Quick Fill for all students in this subject
  const handleApplyQuickFill = () => {
    siswaList.forEach((s) => {
      if (quickFillColumn === 'tp1') {
        onUpdateFormatif(s.nis, selectedMapelKode, 0, quickFillValue);
      } else {
        onUpdateSumatif(s.nis, selectedMapelKode, quickFillColumn, quickFillValue);
      }
    });
    setIsQuickFillOpen(false);
  };

  // Handler: Download CSV format template for this subject
  const handleDownloadTemplate = () => {
    const headers = [
      'NIS',
      'Nama_Siswa',
      'LM_1',
      'LM_2',
      'LM_3',
      'LM_4',
      'STS',
      'SAS',
      'TP_1',
      'TP_2',
      'TP_3',
      'TP_4',
    ];
    const rows = siswaList.map((s) => {
      const sumItem = nilaiSumatif.find(
        (sm) => sm.nis === s.nis && sm.kodeMapel === selectedMapelKode
      );
      const formItem = nilaiFormatif.find(
        (fm) => fm.nis === s.nis && fm.kodeMapel === selectedMapelKode
      );
      return [
        s.nis,
        `"${s.nama}"`,
        sumItem?.sumatifLm[0] || '',
        sumItem?.sumatifLm[1] || '',
        sumItem?.sumatifLm[2] || '',
        sumItem?.sumatifLm[3] || '',
        sumItem?.sts || '',
        sumItem?.sas || '',
        formItem?.nilaiTp[0] || '',
        formItem?.nilaiTp[1] || '',
        formItem?.nilaiTp[2] || '',
        formItem?.nilaiTp[3] || '',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Format_Nilai_${selectedMapelKode}_Kelas_${siswaList[0]?.kelas || 'V'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & MAPEL SELECTOR */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              Kurikulum Deep Learning • Penilaian Otentik
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
              Input & Pengelolaan Nilai Mapel
              {isRoleLocked && (
                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Mode Guru Mapel
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mata Pelajaran: <strong>{activeMapel.namaMapel}</strong> ({activeMapel.kelompok}) • Bobot NA: Rata-Rata Formatif & Sumatif.
            </p>
          </div>

          {/* Mapel & Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mapel Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Pilih Mata Pelajaran:
              </label>
              <select
                value={selectedMapelKode}
                onChange={(e) => setSelectedMapelKode(e.target.value)}
                disabled={isRoleLocked}
                className={`text-xs font-bold p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isRoleLocked
                    ? 'bg-slate-100 text-slate-700 border-slate-300 cursor-not-allowed'
                    : 'bg-slate-50 text-indigo-950 border-slate-300 cursor-pointer'
                }`}
              >
                {kurikulum.map((m) => (
                  <option key={m.kodeMapel} value={m.kodeMapel}>
                    [{m.kodeMapel}] {m.namaMapel}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Mode Toggle: Massal vs Satuan */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Metode Pengisian:
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setInputMode('massal')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                    inputMode === 'massal'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  Isi Massal (Seluruh Kelas)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('satuan')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                    inputMode === 'satuan'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Per Siswa (Detail 25 TP)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Alert if Role Locked */}
        {isRoleLocked && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Anda masuk sebagai <strong>{userSession?.namaUser}</strong>. Akses Anda difokuskan pada penginputan nilai <strong>{activeMapel.namaMapel}</strong>.
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
              Keamanan Terjamin
            </span>
          </div>
        )}

        {/* Subject KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Siswa Kelas
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{siswaList.length} Anak</div>
            <span className="text-[11px] text-slate-500">Kelas {siswaList[0]?.kelas || 'V'}</span>
          </div>

          <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
              Kelengkapan Nilai Mapel
            </span>
            <div className="text-2xl font-black text-sky-950 mt-1">{subjectCompletionRate}%</div>
            <span className="text-[11px] text-sky-700 font-medium">
              {allStudentsGridData.filter((i) => i.nilaiAkhir > 0).length} dari {siswaList.length} siswa terisi
            </span>
          </div>

          <div className="bg-indigo-50 rounded-xl p-3.5 border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
              Rata-Rata Kelas (NA)
            </span>
            <div className="text-2xl font-black text-indigo-950 mt-1">{subjectClassAvg}</div>
            <span className="text-[11px] text-indigo-700 font-medium">Skala 0 - 100</span>
          </div>

          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Status Mapel
            </span>
            <div className="text-lg font-black text-amber-950 mt-1">
              {subjectCompletionRate === 100 ? 'Lengkap 100%' : 'Sedang Diisi'}
            </div>
            <span className="text-[11px] text-amber-800 font-semibold">
              {activeMapel.kelompok}
            </span>
          </div>
        </div>

        {/* Patokan Penilaian & Rujukan 25 TP Accordion */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowKurikulumPatokan(!showKurikulumPatokan)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-950 border border-indigo-200 transition"
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Patokan Penilaian & 25 Tujuan Pembelajaran ({activeMapel.namaMapel})</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-white text-indigo-800 border border-indigo-200">
                Fase C (Kelas V) - Kepka BKPDM No. 020/2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
              <span>{showKurikulumPatokan ? 'Tutup Patokan' : 'Buka Patokan & Indikator TP'}</span>
              {showKurikulumPatokan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showKurikulumPatokan && (
            <div className="mt-3 p-4 rounded-xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Capaian Pembelajaran (CP) Aktif:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {activeMapel.cpFaseC || activeMapel.cp}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Alur Tujuan Pembelajaran (ATP) Aktif:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {activeMapel.atpFaseC || activeMapel.atp}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    Daftar Indikator 25 Tujuan Pembelajaran (Patokan Nilai Formatif):
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Nilai tertinggi & terendah menghasilkan kalimat capaian otomatis
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {activeMapel.tpNarasi.map((tp, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px]"
                    >
                      <span className="font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        TP_{idx + 1}
                      </span>
                      <span className="text-slate-700 leading-snug line-clamp-2">
                        {tp || <em className="text-slate-400 font-normal">Belum diisi</em>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {(activeMapel.fileAtpLampiran || []).length > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Tersedia berkas panduan ATP: <strong>{activeMapel.fileAtpLampiran?.[0]?.fileName}</strong>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Acuan Resmi Disetujui
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MODE INPUT MASSAL (GRID SELURUH SISWA)                            */}
      {/* ===================================================================== */}
      {inputMode === 'massal' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden space-y-4 p-5">
          {/* Action Toolbar for Bulk Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa di kelas..."
                  value={searchSiswa}
                  onChange={(e) => setSearchSiswa(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
                />
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Menampilkan {filteredGridData.length} siswa
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Tombol Tempel Massal */}
              <button
                type="button"
                onClick={() => {
                  setPastedRawText('');
                  setBulkPasteSuccess('');
                  setIsBulkPasteOpen(true);
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Tempel dari Excel / Sheets
              </button>

              {/* Tombol Isi Cepat / Quick Fill */}
              <button
                type="button"
                onClick={() => setIsQuickFillOpen(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Isi Seragam Cepat
              </button>

              {/* Tombol Unduh CSV Format */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                title="Unduh daftar siswa dan format nilai ini ke CSV"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                Unduh Format CSV
              </button>

              {/* Tombol Simpan ke Google Sheets */}
              {onSaveToGoogleSheets && (
                <button
                  type="button"
                  onClick={onSaveToGoogleSheets}
                  disabled={isSavingToSheets}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                  title="Kirim dan simpan data form terbaru ke endpoint Google Apps Script via fetch()"
                >
                  {isSavingToSheets ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan ke Sheets...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      Simpan ke Google Sheets
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Grid Table Input Massal */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] sticky top-0 border-b border-slate-200 z-10">
                <tr>
                  <th className="py-2.5 px-3 text-center w-10">No</th>
                  <th className="py-2.5 px-3 w-56">Peserta Didik</th>
                  <th className="py-2.5 px-2 text-center w-20 bg-sky-50 text-sky-900 border-x border-sky-100">
                    Rata Formatif
                  </th>
                  <th className="py-2.5 px-2 text-center w-16">TP 1</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 2</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 3</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 4</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-slate-200/50">LM 1</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-slate-200/50">LM 2</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-slate-200/50">LM 3</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-slate-200/50">LM 4</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-purple-50 text-purple-900">STS</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-purple-50 text-purple-900">SAS</th>
                  <th className="py-2.5 px-2 text-center w-20 bg-amber-50 text-amber-900 border-x border-amber-200">
                    Nilai Akhir
                  </th>
                  <th className="py-2.5 px-3">Capaian Kompetensi (Auto)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGridData.map((row, idx) => {
                  const s = row.siswa;
                  return (
                    <tr key={s.nis} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-slate-900">{s.nama}</div>
                        <div className="text-[10px] text-slate-500 font-mono">NIS: {s.nis}</div>
                      </td>

                      {/* Rata-Rata Formatif */}
                      <td className="py-2 px-2 text-center font-bold bg-sky-50/50 text-sky-950 border-x border-sky-100">
                        {row.rataFormatif || 0}
                      </td>

                      {/* TP 1 */}
                      <td className="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.formatif.nilaiTp[0] || ''}
                          onChange={(e) =>
                            onUpdateFormatif(s.nis, selectedMapelKode, 0, parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* TP 2 */}
                      <td className="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.formatif.nilaiTp[1] || ''}
                          onChange={(e) =>
                            onUpdateFormatif(s.nis, selectedMapelKode, 1, parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* TP 3 */}
                      <td className="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.formatif.nilaiTp[2] || ''}
                          onChange={(e) =>
                            onUpdateFormatif(s.nis, selectedMapelKode, 2, parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* TP 4 */}
                      <td className="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.formatif.nilaiTp[3] || ''}
                          onChange={(e) =>
                            onUpdateFormatif(s.nis, selectedMapelKode, 3, parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* LM 1 */}
                      <td className="py-2 px-1 text-center bg-slate-50">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.sumatif.sumatifLm[0] || ''}
                          onChange={(e) =>
                            onUpdateSumatif(s.nis, selectedMapelKode, 'lm1', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* LM 2 */}
                      <td className="py-2 px-1 text-center bg-slate-50">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.sumatif.sumatifLm[1] || ''}
                          onChange={(e) =>
                            onUpdateSumatif(s.nis, selectedMapelKode, 'lm2', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* LM 3 */}
                      <td className="py-2 px-1 text-center bg-slate-50">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.sumatif.sumatifLm[2] || ''}
                          onChange={(e) =>
                            onUpdateSumatif(s.nis, selectedMapelKode, 'lm3', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* LM 4 */}
                      <td className="py-2 px-1 text-center bg-slate-50">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.sumatif.sumatifLm[3] || ''}
                          onChange={(e) =>
                            onUpdateSumatif(s.nis, selectedMapelKode, 'lm4', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-slate-300 rounded py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* STS */}
                      <td className="py-2 px-1 text-center bg-purple-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.sumatif.sts || ''}
                          onChange={(e) =>
                            onUpdateSumatif(s.nis, selectedMapelKode, 'sts', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-purple-300 rounded py-1 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </td>

                      {/* SAS */}
                      <td className="py-2 px-1 text-center bg-purple-50/40">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.sumatif.sas || ''}
                          onChange={(e) =>
                            onUpdateSumatif(s.nis, selectedMapelKode, 'sas', parseInt(e.target.value, 10) || 0)
                          }
                          placeholder="0"
                          className="w-14 text-center font-bold text-xs bg-white border border-purple-300 rounded py-1 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </td>

                      {/* Nilai Akhir (NA) */}
                      <td className="py-2 px-2 text-center font-black bg-amber-50/60 text-amber-950 border-x border-amber-200">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            row.nilaiAkhir >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.nilaiAkhir >= 75
                              ? 'bg-blue-100 text-blue-800'
                              : row.nilaiAkhir > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {row.nilaiAkhir || '-'}
                        </span>
                      </td>

                      {/* Auto Description */}
                      <td className="py-2 px-3 text-slate-600 text-[11px] leading-relaxed max-w-xs truncate" title={row.deskripsi}>
                        {row.deskripsi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MODE INPUT SATUAN (DETAIL 25 TP PER SISWA)                         */}
      {/* ===================================================================== */}
      {inputMode === 'satuan' && (
        <div className="space-y-6">
          {/* Siswa Selector Bar */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pilih Siswa:
              </span>
              <select
                value={selectedNis}
                onChange={(e) => onSelectNis(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {siswaList.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Siswa terpilih: <strong className="text-slate-900">{activeSiswa.nama}</strong> ({activeSiswa.nis})
            </div>
          </div>

          {/* Formatif 25 TP Section */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center text-xs">
                    1
                  </span>
                  Asesmen Formatif (25 Tujuan Pembelajaran / TP)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Input skor 0 - 100 untuk TP yang telah dinilai. Sistem otomatis mendeteksi nilai tertinggi dan terendah.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllTps(!showAllTps)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
              >
                {showAllTps ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" /> Tampilkan TP 1-10 Saja
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> Buka Seluruh 25 TP
                  </>
                )}
              </button>
            </div>

            {/* Grid of TP Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {(showAllTps ? activeMapel.tpNarasi : activeMapel.tpNarasi.slice(0, 10)).map(
                (narasi, index) => {
                  const val = currentFormatif.nilaiTp[index] || 0;
                  const isMax = autoDeskripsi.maxIndex === index && val > 0;
                  const isMin = autoDeskripsi.minIndex === index && val > 0;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border transition ${
                        isMax
                          ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-300'
                          : isMin
                          ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-300'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-800">
                          TP {index + 1}
                        </span>
                        {isMax && (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                            Tertinggi
                          </span>
                        )}
                        {isMin && !isMax && (
                          <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded">
                            Terendah
                          </span>
                        )}
                      </div>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={val || ''}
                        onChange={(e) =>
                          onUpdateFormatif(
                            selectedNis,
                            selectedMapelKode,
                            index,
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        placeholder="Skor..."
                        className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-1.5"
                      />

                      <p
                        className="text-[11px] text-slate-500 line-clamp-2 leading-tight"
                        title={narasi}
                      >
                        {narasi}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Sumatif Section */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-xs">
                  2
                </span>
                Asesmen Sumatif (Lingkup Materi, STS & SAS)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai Sumatif Lingkup Materi (LM), Sumatif Tengah Semester (STS), dan Sumatif Akhir Semester (SAS).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { field: 'lm1', label: 'Sumatif LM 1', val: currentSumatif.sumatifLm[0] },
                { field: 'lm2', label: 'Sumatif LM 2', val: currentSumatif.sumatifLm[1] },
                { field: 'lm3', label: 'Sumatif LM 3', val: currentSumatif.sumatifLm[2] },
                { field: 'lm4', label: 'Sumatif LM 4', val: currentSumatif.sumatifLm[3] },
                { field: 'sts', label: 'STS (Tengah Sem.)', val: currentSumatif.sts },
                { field: 'sas', label: 'SAS (Akhir Sem.)', val: currentSumatif.sas },
              ].map((item) => (
                <div key={item.field} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    {item.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.val || ''}
                    onChange={(e) =>
                      onUpdateSumatif(
                        selectedNis,
                        selectedMapelKode,
                        item.field as any,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    placeholder="0"
                    className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Auto Description Preview */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-1">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Pratinjau Deskripsi Otomatis Rapor ({activeSiswa.nama}):
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-3 rounded-lg border border-indigo-100">
              "{autoDeskripsi.deskripsi}"
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: TEMPEL NILAI MASSAL DARI SPREADSHEET (EXCEL/SHEETS)            */}
      {/* ===================================================================== */}
      {isBulkPasteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Clipboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Tempel Nilai Massal dari Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-300">
                    Mata Pelajaran: <strong>{activeMapel.namaMapel}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkPasteOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {bulkPasteSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {bulkPasteSuccess}
                </div>
              )}

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Format Kolom yang Didukung (Copy dari Excel/Sheets):</p>
                <p className="text-slate-600 font-mono text-[11px]">
                  Kolom 1: <strong>NIS atau Nama Siswa</strong> | Kolom 2..7: <strong>LM1, LM2, LM3, LM4, STS, SAS</strong>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  💡 Cukup blok range tabel di Excel atau Google Sheets, tekan <kbd className="px-1 py-0.5 bg-white border rounded">Ctrl+C</kbd>, lalu paste di kotak di bawah.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Kolom Nilai:
                </label>
                <div className="flex gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPasteColumnTarget('sumatif')}
                    className={`px-3 py-1.5 rounded-lg border transition ${
                      pasteColumnTarget === 'sumatif'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Sumatif (LM1 - LM4, STS, SAS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasteColumnTarget('formatif')}
                    className={`px-3 py-1.5 rounded-lg border transition ${
                      pasteColumnTarget === 'formatif'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Formatif (TP 1 - TP 10)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Tempelkan (Paste) Teks Tabel di Sini:
                </label>
                <textarea
                  rows={6}
                  value={pastedRawText}
                  onChange={(e) => setPastedRawText(e.target.value)}
                  placeholder={`Contoh baris yang di-copy:\n230101\t85\t88\t90\t86\t88\t90\n230107\t80\t85\t84\t82\t85\t87`}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsBulkPasteOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleApplyBulkPaste}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition"
              >
                <Check className="w-4 h-4" />
                Terapkan Nilai Massal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: QUICK FILL (ISI SERAGAM CEPAT)                                 */}
      {/* ===================================================================== */}
      {isQuickFillOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">Isi Seragam Cepat</h3>
              </div>
              <button onClick={() => setIsQuickFillOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Isi nilai yang sama secara otomatis ke seluruh {siswaList.length} siswa pada mapel <strong>{activeMapel.namaMapel}</strong>.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Kolom:</label>
                <select
                  value={quickFillColumn}
                  onChange={(e) => setQuickFillColumn(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none"
                >
                  <option value="sts">Sumatif Tengah Semester (STS)</option>
                  <option value="sas">Sumatif Akhir Semester (SAS)</option>
                  <option value="lm1">Lingkup Materi 1 (LM 1)</option>
                  <option value="lm2">Lingkup Materi 2 (LM 2)</option>
                  <option value="lm3">Lingkup Materi 3 (LM 3)</option>
                  <option value="lm4">Lingkup Materi 4 (LM 4)</option>
                  <option value="tp1">Tujuan Pembelajaran 1 (TP 1)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nilai yang Diterapkan:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quickFillValue}
                  onChange={(e) => setQuickFillValue(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-base text-indigo-950 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsQuickFillOpen(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyQuickFill}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                Terapkan ke Seluruh Kelas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
