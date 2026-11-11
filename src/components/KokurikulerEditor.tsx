import React, { useState } from 'react';
import {
  AbsensiSiswa,
  DataSiswa,
  EkstrakurikulerSiswa,
  ItemEkstrakurikuler,
  ItemKokurikuler8Dimensi,
  KokurikulerSiswa,
  PredikatEkstra,
  PredikatKokurikuler,
} from '../types/rapor';
import {
  DIMENSI_8_PROFIL_LULUSAN,
  generateAutoDeskripsiEkstra,
  sintesisNarasiKokurikuler,
} from '../utils/raporCalculations';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle,
  Compass,
  Copy,
  HeartHandshake,
  Layers,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';

interface KokurikulerEditorProps {
  siswaList: DataSiswa[];
  selectedNis: string;
  onSelectNis: (nis: string) => void;
  semester: 1 | 2;
  kokurikulerData: KokurikulerSiswa[];
  ekstrakurikulerData: EkstrakurikulerSiswa[];
  absensiData: AbsensiSiswa[];
  onUpdateDimensi: (
    nis: string,
    kodeDimensi: string,
    predikat: PredikatKokurikuler,
    catatan: string
  ) => void;
  onUpdateStudentDimensiList?: (nis: string, dimensiList: ItemKokurikuler8Dimensi[]) => void;
  onApplyDimensiToAll?: (templateDimensi: ItemKokurikuler8Dimensi[]) => void;
  onUpdateEkstrakurikuler: (nis: string, daftarEkstra: ItemEkstrakurikuler[]) => void;
  onUpdateAbsensi: (nis: string, field: 'sakit' | 'izin' | 'tanpaKeterangan', val: number) => void;
  onOpenAbsensiModal?: () => void;
}

export const KokurikulerEditor: React.FC<KokurikulerEditorProps> = ({
  siswaList,
  selectedNis,
  onSelectNis,
  semester,
  kokurikulerData,
  ekstrakurikulerData,
  absensiData,
  onUpdateDimensi,
  onUpdateStudentDimensiList,
  onApplyDimensiToAll,
  onUpdateEkstrakurikuler,
  onUpdateAbsensi,
  onOpenAbsensiModal,
}) => {
  // Local state for Add New Dimension dropdowns
  const [selectedDimKode, setSelectedDimKode] = useState<string>('D1');
  const [selectedSubKode, setSelectedSubKode] = useState<string>('D1-1');
  const [initialPredikat, setInitialPredikat] = useState<PredikatKokurikuler>('BSH');

  // Local state for new Ekstrakurikuler
  const [newEkstraName, setNewEkstraName] = useState('');
  const [newEkstraPredikat, setNewEkstraPredikat] = useState<PredikatEkstra>('Baik');

  // Toast / Confirmation feedback
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  const activeSiswa = siswaList.find((s) => s.nis === selectedNis) || siswaList[0];

  // Current student Kokurikuler object
  const currentKoku = kokurikulerData.find((k) => k.nis === selectedNis) || {
    nis: selectedNis,
    semester,
    dimensi: [],
  };

  const activeDimensiList = currentKoku.dimensi || [];

  // Update selected sub-dimension whenever the parent dimension dropdown changes
  const handleDimChange = (dimKode: string) => {
    setSelectedDimKode(dimKode);
    const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === dimKode);
    if (dimDef && dimDef.subDimensi.length > 0) {
      setSelectedSubKode(dimDef.subDimensi[0].kode);
    }
  };

  // Add new dimension & sub-dimension
  const handleAddDimensi = () => {
    const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === selectedDimKode);
    if (!dimDef) return;

    const subDef = dimDef.subDimensi.find((s) => s.kode === selectedSubKode) || dimDef.subDimensi[0];
    const defaultNote =
      initialPredikat === 'SB'
        ? subDef?.narasiSB || `Sangat aktif mempraktikkan ${dimDef.namaDimensi.toLowerCase()}.`
        : initialPredikat === 'BSH'
        ? subDef?.narasiBSH || `Mampu mempraktikkan ${dimDef.namaDimensi.toLowerCase()} dengan baik.`
        : initialPredikat === 'MB'
        ? subDef?.narasiMB || `Mulai menunjukkan pemahaman ${dimDef.namaDimensi.toLowerCase()}.`
        : subDef?.narasiBB || `Perlu bimbingan bertahap dalam ${dimDef.namaDimensi.toLowerCase()}.`;

    const newItem: ItemKokurikuler8Dimensi = {
      id: `koku-${selectedNis}-${Date.now()}`,
      kode: dimDef.kode,
      namaDimensi: dimDef.namaDimensi,
      kodeSubDimensi: subDef?.kode,
      namaSubDimensi: subDef?.nama,
      fokusPembelajaran: subDef?.deskripsi || dimDef.fokus,
      predikat: initialPredikat,
      catatanPerkembangan: defaultNote,
    };

    const updatedList = [...activeDimensiList, newItem];
    if (onUpdateStudentDimensiList) {
      onUpdateStudentDimensiList(selectedNis, updatedList);
    } else {
      onUpdateDimensi(selectedNis, newItem.kode, newItem.predikat, newItem.catatanPerkembangan);
    }
  };

  // Update a specific dimension item in the active student's list
  const handleUpdateItem = (
    index: number,
    field: 'kode' | 'kodeSubDimensi' | 'predikat' | 'catatanPerkembangan',
    value: any
  ) => {
    const copy = [...activeDimensiList];
    const item = { ...copy[index] };

    if (field === 'kode') {
      const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === value);
      if (dimDef) {
        item.kode = dimDef.kode;
        item.namaDimensi = dimDef.namaDimensi;
        const sub = dimDef.subDimensi[0];
        item.kodeSubDimensi = sub?.kode;
        item.namaSubDimensi = sub?.nama;
        item.fokusPembelajaran = sub?.deskripsi || dimDef.fokus;
        item.catatanPerkembangan = sub?.narasiBSH || item.catatanPerkembangan;
      }
    } else if (field === 'kodeSubDimensi') {
      const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === item.kode);
      const sub = dimDef?.subDimensi.find((s) => s.kode === value);
      if (sub) {
        item.kodeSubDimensi = sub.kode;
        item.namaSubDimensi = sub.nama;
        item.fokusPembelajaran = sub.deskripsi;
        const pred = item.predikat || 'BSH';
        item.catatanPerkembangan =
          pred === 'SB'
            ? sub.narasiSB
            : pred === 'BSH'
            ? sub.narasiBSH
            : pred === 'MB'
            ? sub.narasiMB
            : sub.narasiBB;
      }
    } else if (field === 'predikat') {
      item.predikat = value;
      // Auto adjust narrative to new predikat if available
      const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === item.kode);
      const sub = dimDef?.subDimensi.find((s) => s.kode === item.kodeSubDimensi) || dimDef?.subDimensi[0];
      if (sub) {
        item.catatanPerkembangan =
          value === 'SB'
            ? sub.narasiSB
            : value === 'BSH'
            ? sub.narasiBSH
            : value === 'MB'
            ? sub.narasiMB
            : sub.narasiBB;
      }
    } else if (field === 'catatanPerkembangan') {
      item.catatanPerkembangan = value;
    }

    copy[index] = item;
    if (onUpdateStudentDimensiList) {
      onUpdateStudentDimensiList(selectedNis, copy);
    }
  };

  // Remove a dimension from the active student
  const handleRemoveItem = (index: number) => {
    const copy = activeDimensiList.filter((_, idx) => idx !== index);
    if (onUpdateStudentDimensiList) {
      onUpdateStudentDimensiList(selectedNis, copy);
    }
  };

  // Reset to standard recommended 3 dimensions package
  const handleResetToStandard3 = () => {
    const std: ItemKokurikuler8Dimensi[] = [
      {
        id: `koku-${selectedNis}-1`,
        kode: 'D1',
        namaDimensi: 'Keimanan & Ketakwaan Terhadap Tuhan YME & Berakhlak Mulia',
        kodeSubDimensi: 'D1-1',
        namaSubDimensi: 'Akhlak Pribadi (Integritas & Kejujuran)',
        fokusPembelajaran: 'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi nyata',
        predikat: 'BSH',
        catatanPerkembangan: 'sudah cakap dalam membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
      },
      {
        id: `koku-${selectedNis}-2`,
        kode: 'D3',
        namaDimensi: 'Penalaran Kritis & Pemecahan Masalah',
        kodeSubDimensi: 'D3-1',
        namaSubDimensi: 'Mengajukan Pertanyaan & Mengolah Informasi',
        fokusPembelajaran: 'Menyampaikan argumen sederhana secara runtut disertai alasan yang logis',
        predikat: 'BSH',
        catatanPerkembangan: 'sudah cakap dalam menyampaikan argumen sederhana secara runtut disertai alasan',
      },
      {
        id: `koku-${selectedNis}-3`,
        kode: 'D6',
        namaDimensi: 'Kemandirian & Regulasi Diri',
        kodeSubDimensi: 'D6-1',
        namaSubDimensi: 'Regulasi Diri & Menetapkan Target Belajar',
        fokusPembelajaran: 'Sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya',
        predikat: 'BSH',
        catatanPerkembangan: 'sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya',
      },
    ];

    if (onUpdateStudentDimensiList) {
      onUpdateStudentDimensiList(selectedNis, std);
    }
  };

  // Copy current dimension structure to all students in class
  const handleApplyToAllClass = () => {
    if (onApplyDimensiToAll && activeDimensiList.length > 0) {
      onApplyDimensiToAll(activeDimensiList);
      setCopiedMessage('Struktur dimensi berhasil disalin ke seluruh siswa di kelas!');
      setTimeout(() => setCopiedMessage(null), 3500);
    }
  };

  // Current Ekstrakurikuler and Absensi
  const currentEkstra = ekstrakurikulerData.find((e) => e.nis === selectedNis) || {
    nis: selectedNis,
    semester,
    daftarEkstra: [],
  };

  const currentAbsensi = absensiData.find((a) => a.nis === selectedNis) || {
    nis: selectedNis,
    semester,
    sakit: 0,
    izin: 0,
    tanpaKeterangan: 0,
  };

  const handleAddEkstra = () => {
    if (!newEkstraName.trim()) return;
    const autoDesc = generateAutoDeskripsiEkstra(newEkstraName.trim(), newEkstraPredikat);
    const newEntry: ItemEkstrakurikuler = {
      id: `ex-${Date.now()}`,
      nama: newEkstraName.trim(),
      predikat: newEkstraPredikat,
      deskripsi: autoDesc,
    };
    onUpdateEkstrakurikuler(selectedNis, [...currentEkstra.daftarEkstra, newEntry]);
    setNewEkstraName('');
    setNewEkstraPredikat('Baik');
  };

  const handleRemoveEkstra = (id: string) => {
    onUpdateEkstrakurikuler(
      selectedNis,
      currentEkstra.daftarEkstra.filter((item) => item.id !== id)
    );
  };

  const handleEkstraChange = (
    id: string,
    field: 'nama' | 'predikat' | 'deskripsi',
    value: string
  ) => {
    const updated = currentEkstra.daftarEkstra.map((item) => {
      if (item.id === id) {
        if (field === 'predikat') {
          const autoDesc = generateAutoDeskripsiEkstra(item.nama, value as PredikatEkstra);
          return { ...item, predikat: value as PredikatEkstra, deskripsi: autoDesc };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateEkstrakurikuler(selectedNis, updated);
  };

  // Selected Dimensi Definition for the Add form
  const selectedDimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === selectedDimKode);

  // Live Synthesized Preview
  const liveSynthesizedNarasi = sintesisNarasiKokurikuler(
    activeDimensiList,
    activeSiswa.namaPanggilan || activeSiswa.nama.split(' ')[0]
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Kokurikuler: Pilihan 2 - 4 Dimensi & Sub-Dimensi Profil Lulusan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sesuai kaidah Kurikulum Deep Learning, guru leluasa memilih <strong>2 hingga 4 Dimensi beserta Sub-dimensinya</strong> yang menjadi fokus projek/semester, tanpa harus menilai seluruh 8 dimensi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <div className="text-xs">
                <span className="text-slate-500 block text-[10px] font-semibold">Siswa Aktif:</span>
                <select
                  value={selectedNis}
                  onChange={(e) => onSelectNis(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {siswaList.map((s) => (
                    <option key={s.nis} value={s.nis}>
                      {s.nama} ({s.nis})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Count & Status Indicator */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Dimensi Terpilih:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800">
              {activeDimensiList.length} Dimensi
            </span>
            {activeDimensiList.length >= 2 && activeDimensiList.length <= 4 ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" /> Ideal (2 - 4 Dimensi)
              </span>
            ) : activeDimensiList.length < 2 ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" /> Disarankan minimal 2 dimensi
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <Layers className="w-3.5 h-3.5" /> 4+ Dimensi terpilih
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetToStandard3}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              title="Reset ke paket standar 3 dimensi (D1, D3, D6) sesuai contoh rapor resmi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Paket Standar 3 Dimensi
            </button>

            {onApplyDimensiToAll && (
              <button
                type="button"
                onClick={handleApplyToAllClass}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Terapkan struktur dimensi terpilih ini ke seluruh siswa di kelas"
              >
                <Copy className="w-3.5 h-3.5" />
                Salin Struktur ke Semua Siswa
              </button>
            )}
          </div>
        </div>

        {copiedMessage && (
          <div className="mt-3 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {copiedMessage}
          </div>
        )}
      </div>

      {/* SECTION 1: DROPDOWN FORM TAMBAH DIMENSI & SUB-DIMENSI */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4 text-indigo-600" />
          Pilih & Tambahkan Dimensi Fokus Baru
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Dropdown 1: Dimensi */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              1. Pilih Dimensi Profil Lulusan:
            </label>
            <select
              value={selectedDimKode}
              onChange={(e) => handleDimChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              {DIMENSI_8_PROFIL_LULUSAN.map((dim) => (
                <option key={dim.kode} value={dim.kode}>
                  {dim.kode}: {dim.namaDimensi}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Sub-Dimensi / Elemen */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              2. Pilih Sub-Dimensi / Elemen Fokus:
            </label>
            <select
              value={selectedSubKode}
              onChange={(e) => setSelectedSubKode(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              {selectedDimDef?.subDimensi.map((sub) => (
                <option key={sub.kode} value={sub.kode}>
                  {sub.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Initial Predikat */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              3. Predikat:
            </label>
            <select
              value={initialPredikat}
              onChange={(e) => setInitialPredikat(e.target.value as PredikatKokurikuler)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-indigo-700"
            >
              <option value="BSH">BSH (Berkembang)</option>
              <option value="SB">SB (Sangat Baik)</option>
              <option value="MB">MB (Mulai Berkembang)</option>
              <option value="BB">BB (Belum Berkembang)</option>
            </select>
          </div>

          {/* Button Add */}
          <div className="md:col-span-1 flex items-end">
            <button
              type="button"
              onClick={handleAddDimensi}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition"
              title="Tambahkan dimensi ini ke daftar aktif siswa"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: DAFTAR DIMENSI FOKUS TERPILIH (2-4 DIMENSI) */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-600" />
              Daftar Dimensi & Sub-Dimensi Terpilih untuk Siswa: {activeSiswa.nama}
            </h3>
            <p className="text-xs text-slate-500">
              Ubah dimensi, sub-dimensi, predikat, atau catatan perkembangan kapan saja.
            </p>
          </div>
        </div>

        {activeDimensiList.length > 0 ? (
          <div className="space-y-4">
            {activeDimensiList.map((item, idx) => {
              const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === item.kode);

              return (
                <div
                  key={item.id || `${item.kode}-${idx}`}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      {/* Dropdown ubah dimensi langsung */}
                      <select
                        value={item.kode}
                        onChange={(e) => handleUpdateItem(idx, 'kode', e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
                      >
                        {DIMENSI_8_PROFIL_LULUSAN.map((d) => (
                          <option key={d.kode} value={d.kode}>
                            {d.kode}: {d.namaDimensi}
                          </option>
                        ))}
                      </select>

                      {/* Dropdown ubah sub-dimensi langsung */}
                      <select
                        value={item.kodeSubDimensi || dimDef?.subDimensi[0]?.kode}
                        onChange={(e) => handleUpdateItem(idx, 'kodeSubDimensi', e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-900 max-w-xs truncate"
                      >
                        {dimDef?.subDimensi.map((s) => (
                          <option key={s.kode} value={s.kode}>
                            {s.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-auto">
                      {/* Predikat Buttons BB, MB, BSH, SB */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        {(['BB', 'MB', 'BSH', 'SB'] as PredikatKokurikuler[]).map((pred) => {
                          const isActive = item.predikat === pred;
                          return (
                            <button
                              key={pred}
                              type="button"
                              onClick={() => handleUpdateItem(idx, 'predikat', pred)}
                              className={`px-2.5 py-0.5 text-xs font-bold rounded transition ${
                                isActive
                                  ? pred === 'SB'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : pred === 'BSH'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : pred === 'MB'
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {pred}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Dimensi Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Catatan Perkembangan Sub-Dimensi */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <label className="font-semibold text-slate-600">
                        Catatan Perkembangan Sub-Dimensi:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const sub =
                            dimDef?.subDimensi.find((s) => s.kode === item.kodeSubDimensi) ||
                            dimDef?.subDimensi[0];
                          if (sub) {
                            const note =
                              item.predikat === 'SB'
                                ? sub.narasiSB
                                : item.predikat === 'BSH'
                                ? sub.narasiBSH
                                : item.predikat === 'MB'
                                ? sub.narasiMB
                                : sub.narasiBB;
                            handleUpdateItem(idx, 'catatanPerkembangan', note);
                          }
                        }}
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Reset Narasi Standar
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={item.catatanPerkembangan}
                      onChange={(e) =>
                        handleUpdateItem(idx, 'catatanPerkembangan', e.target.value)
                      }
                      className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 space-y-2">
            <Compass className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">
              Belum ada dimensi yang dipilih untuk siswa ini.
            </p>
            <p className="text-[11px] text-slate-400">
              Gunakan formulir di atas untuk memilih 2-4 dimensi atau klik "Paket Standar 3 Dimensi".
            </p>
          </div>
        )}

        {/* Live Preview Box of the Printed Kokurikuler */}
        <div className="mt-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Pratinjau Cetak Rapor (Kotak Kokurikuler Berarsir):
          </h4>
          <div className="border border-black bg-white">
            <div className="bg-slate-300 border-b border-black py-1 px-3 text-center font-bold text-xs text-black uppercase tracking-wider">
              Kokurikuler
            </div>
            <div className="p-3 text-xs leading-relaxed text-justify text-black font-sans">
              {liveSynthesizedNarasi}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: EKSTRAKURIKULER DINAMIS (>2 KEGIATAN) */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Kegiatan Ekstrakurikuler Siswa (Dinamis &gt;2 Kegiatan)
            </h3>
            <p className="text-xs text-slate-500">
              Tambah, edit, dan atur deskripsi predikat ekstrakurikuler untuk {activeSiswa.nama}.
            </p>
          </div>
        </div>

        {/* Form Tambah Ekstra */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 flex flex-col md:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Nama Kegiatan (contoh: Pramuka, MIPA, Seni Tari)..."
            value={newEkstraName}
            onChange={(e) => setNewEkstraName(e.target.value)}
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 w-full"
          />

          <select
            value={newEkstraPredikat}
            onChange={(e) => setNewEkstraPredikat(e.target.value as PredikatEkstra)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
          >
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Baik">Baik</option>
            <option value="Cukup">Cukup</option>
            <option value="Kurang">Kurang</option>
          </select>

          <button
            type="button"
            onClick={handleAddEkstra}
            className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Ekstra
          </button>
        </div>

        {/* List of Ekstra */}
        <div className="space-y-3">
          {currentEkstra.daftarEkstra.map((ekstra, idx) => (
            <div
              key={ekstra.id}
              className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={ekstra.nama}
                    onChange={(e) => handleEkstraChange(ekstra.id, 'nama', e.target.value)}
                    className="font-bold text-slate-900 text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1"
                  />
                  <select
                    value={ekstra.predikat}
                    onChange={(e) => handleEkstraChange(ekstra.id, 'predikat', e.target.value)}
                    className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded px-2 py-1"
                  >
                    <option value="Sangat Baik">Sangat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Kurang">Kurang</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ekstra.deskripsi}
                    onChange={(e) => handleEkstraChange(ekstra.id, 'deskripsi', e.target.value)}
                    className="flex-1 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                  />
                  <button
                    type="button"
                    title="Generate Ulang Deskripsi"
                    onClick={() =>
                      handleEkstraChange(
                        ekstra.id,
                        'deskripsi',
                        generateAutoDeskripsiEkstra(ekstra.nama, ekstra.predikat)
                      )
                    }
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveEkstra(ekstra.id)}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg self-end md:self-center transition"
                title="Hapus Ekstrakurikuler"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {currentEkstra.daftarEkstra.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
              Belum ada ekstrakurikuler. Tambahkan minimal 1-2 kegiatan di atas.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: KETIDAKHADIRAN / ABSENSI */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">
              Rekapitulasi Kehadiran Siswa (Semester {semester})
            </h3>
            <p className="text-xs text-slate-500">
              Data hari ketidakhadiran {activeSiswa.nama} selama satu semester.
            </p>
          </div>
          {onOpenAbsensiModal && (
            <button
              type="button"
              onClick={onOpenAbsensiModal}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-indigo-200 transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Integrasi Absensi (Google Sheets)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Sakit</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={currentAbsensi.sakit}
                onChange={(e) =>
                  onUpdateAbsensi(selectedNis, 'sakit', Number(e.target.value) || 0)
                }
                className="w-16 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500">hari</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Izin</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={currentAbsensi.izin}
                onChange={(e) =>
                  onUpdateAbsensi(selectedNis, 'izin', Number(e.target.value) || 0)
                }
                className="w-16 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500">hari</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Tanpa Keterangan (Alpa)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={currentAbsensi.tanpaKeterangan}
                onChange={(e) =>
                  onUpdateAbsensi(selectedNis, 'tanpaKeterangan', Number(e.target.value) || 0)
                }
                className="w-16 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500">hari</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
