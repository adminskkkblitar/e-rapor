import React, { useState, useMemo, useEffect } from 'react';
import { DataSiswa, UserSession } from '../types/rapor';
import {
  TINGKAT_KELAS_SD,
  getFaseDisplayForKelas,
  getFaseFromKelas,
  getKelasAngka,
  normalizeKelasCode,
} from '../utils/raporCalculations';
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  Edit2,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Lock,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

interface DataSiswaManagerProps {
  siswaList: DataSiswa[];
  selectedNis: string;
  onSelectNis: (nis: string) => void;
  onAddSiswa: (siswa: DataSiswa) => void;
  onAddBulkSiswa: (siswaArr: DataSiswa[]) => void;
  onUpdateSiswa: (siswa: DataSiswa) => void;
  onDeleteSiswa: (nis: string) => void;
  onNavigateToPrint: (nis: string, subTab: 'cover' | 'inti') => void;
  onNavigateToNilai?: () => void;
  userSession?: UserSession;
}

const DEFAULT_NEW_SISWA: DataSiswa = {
  nis: '',
  nisn: '',
  nama: '',
  namaPanggilan: '',
  kelas: 'V',
  fase: 'Fase C (Kelas V)',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: 'L',
  agama: 'Kristen Protestan',
  alamat: '',
  namaAyah: '',
  namaIbu: '',
  pekerjaanAyah: '',
  pekerjaanIbu: '',
  alamatOrtuJalan: '',
  alamatOrtuKelurahan: '',
  alamatOrtuKecamatan: '',
  alamatOrtuKota: 'Kab. Blitar',
  alamatOrtuProvinsi: 'Jawa Timur',
  namaWali: '-',
  pekerjaanWali: '-',
  alamatWali: '-',
  telepon: '',
};

export const DataSiswaManager: React.FC<DataSiswaManagerProps> = ({
  siswaList,
  selectedNis,
  onSelectNis,
  onAddSiswa,
  onAddBulkSiswa,
  onUpdateSiswa,
  onDeleteSiswa,
  onNavigateToPrint,
  onNavigateToNilai,
  userSession,
}) => {
  const isWaliKelasLocked =
    userSession?.role === 'wali_kelas' && Boolean(userSession.kelasAjar);
  const lockedKelas = isWaliKelasLocked
    ? normalizeKelasCode(userSession?.kelasAjar)
    : undefined;

  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>(
    lockedKelas || 'Semua'
  );
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [editingSiswa, setEditingSiswa] = useState<DataSiswa | null>(null);

  // Form State for Manual Add/Edit
  const [formData, setFormData] = useState<DataSiswa>(DEFAULT_NEW_SISWA);
  const [formError, setFormError] = useState<string>('');

  // Bulk Import State
  const [bulkInputText, setBulkInputText] = useState<string>('');
  const [bulkParsed, setBulkParsed] = useState<DataSiswa[]>([]);
  const [bulkError, setBulkError] = useState<string>('');
  const [bulkTargetKelas, setBulkTargetKelas] = useState<string>(lockedKelas || 'V');
  const [bulkTargetFase, setBulkTargetFase] = useState<string>(
    getFaseDisplayForKelas(lockedKelas || 'V')
  );

  useEffect(() => {
    if (lockedKelas) {
      setSelectedKelasFilter(lockedKelas);
      setBulkTargetKelas(lockedKelas);
      setBulkTargetFase(getFaseDisplayForKelas(lockedKelas));
    } else {
      setSelectedKelasFilter('Semua');
    }
  }, [lockedKelas]);

  // Ambil daftar kelas unik dari data siswa
  const availableKelasList = useMemo(() => {
    const setKelas = new Set<string>();
    siswaList.forEach((s) => setKelas.add(s.kelas));
    return Array.from(setKelas).sort();
  }, [siswaList]);

  // Filter siswa berdasarkan kelas & pencarian
  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      const effectiveFilter = lockedKelas || selectedKelasFilter;
      const matchKelas =
        effectiveFilter === 'Semua' ||
        normalizeKelasCode(s.kelas) === normalizeKelasCode(effectiveFilter);
      const matchSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery) ||
        s.nisn.includes(searchQuery);
      return matchKelas && matchSearch;
    });
  }, [siswaList, selectedKelasFilter, searchQuery, lockedKelas]);

  // Statistik
  const countL = filteredSiswa.filter((s) => s.jenisKelamin === 'L').length;
  const countP = filteredSiswa.filter((s) => s.jenisKelamin === 'P').length;

  // Buka Form Manual untuk Tambah Siswa Baru
  const handleOpenAddManual = () => {
    setEditingSiswa(null);
    const defaultKelas =
      lockedKelas || (selectedKelasFilter === 'Semua' ? 'V' : selectedKelasFilter);
    setFormData({
      ...DEFAULT_NEW_SISWA,
      kelas: defaultKelas,
      fase: getFaseDisplayForKelas(defaultKelas),
    });
    setFormError('');
    setIsManualModalOpen(true);
  };

  // Buka Form Manual untuk Edit Siswa
  const handleOpenEdit = (siswa: DataSiswa) => {
    setEditingSiswa(siswa);
    setFormData({ ...siswa });
    setFormError('');
    setIsManualModalOpen(true);
  };

  // Simpan Form Manual (Tambah / Edit)
  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.nis.trim()) {
      setFormError('Nomor Induk Siswa (NIS) wajib diisi.');
      return;
    }
    if (!formData.nama.trim()) {
      setFormError('Nama lengkap siswa wajib diisi.');
      return;
    }

    // Jika tambah baru, pastikan NIS belum dipakai
    if (!editingSiswa && siswaList.some((s) => s.nis === formData.nis.trim())) {
      setFormError(`NIS "${formData.nis}" sudah digunakan oleh siswa lain.`);
      return;
    }

    if (editingSiswa) {
      onUpdateSiswa(formData);
    } else {
      onAddSiswa(formData);
      onSelectNis(formData.nis);
    }

    setIsManualModalOpen(false);
  };

  // Unduh Template CSV Siswa
  const handleDownloadTemplate = () => {
    const headers = [
      'NIS',
      'NISN',
      'Nama_Lengkap',
      'Kelas',
      'Fase',
      'Tempat_Lahir',
      'Tanggal_Lahir',
      'Jenis_Kelamin',
      'Agama',
      'Alamat_Siswa',
      'Nama_Ayah',
      'Nama_Ibu',
      'Pekerjaan_Ayah',
      'Pekerjaan_Ibu',
      'Alamat_Ortu_Jalan',
      'Alamat_Ortu_Desa',
      'Alamat_Ortu_Kecamatan',
      'Alamat_Ortu_Kota',
      'Alamat_Ortu_Provinsi',
      'Nama_Wali',
      'Pekerjaan_Wali',
      'Alamat_Wali',
    ];

    const sampleRow1 = [
      '230108',
      '0159988771',
      'JONATHAN KRISNA PUTRA',
      'V',
      'Fase C (Kelas V)',
      'Blitar',
      '18 Mei 2014',
      'L',
      'Kristen Protestan',
      'Dsn. Tambak RT 01/RW 02, Pagergunung',
      'KRISNA WIJAYA',
      'YULIANA',
      'WIRASWASTA',
      'GURU',
      'Dsn. Tambak',
      'Pagergunung',
      'Kesamben',
      'Kab. Blitar',
      'Jawa Timur',
      '-',
      '-',
      '-',
    ];

    const sampleRow2 = [
      '230109',
      '0159988772',
      'MARIA NATHANIA',
      'V',
      'Fase C (Kelas V)',
      'Blitar',
      '22 Agustus 2014',
      'P',
      'Kristen Protestan',
      'Dsn. Kesamben RT 03/RW 01, Kesamben',
      'HENDRA SANTOSO',
      'LILIS SURYANI',
      'PNS',
      'WIRASWASTA',
      'Jl. Raya Kesamben No. 12',
      'Kesamben',
      'Kesamben',
      'Kab. Blitar',
      'Jawa Timur',
      '-',
      '-',
      '-',
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), sampleRow1.join(','), sampleRow2.join(',')].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Template_Daftar_Siswa_Rapor.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse Bulk Input (CSV / Copy Paste dari Excel / Sheets)
  const handleParseBulk = () => {
    setBulkError('');
    if (!bulkInputText.trim()) {
      setBulkError('Silakan tempel (paste) data siswa atau unggah file CSV terlebih dahulu.');
      return;
    }

    const lines = bulkInputText.trim().split(/\r?\n/);
    if (lines.length === 0) {
      setBulkError('Data masukan kosong.');
      return;
    }

    const parsed: DataSiswa[] = [];

    // Deteksi header
    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    if (
      firstLineLower.includes('nis') ||
      firstLineLower.includes('nama') ||
      firstLineLower.includes('siswa')
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let parts = line.split('\t');
      if (parts.length === 1) parts = line.split(',');
      if (parts.length === 1) parts = line.split(';');

      const clean = parts.map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (clean.length < 2) continue;

      // Parsing fleksibel:
      // Pola standar: NIS, NISN, Nama, Kelas, Fase, TempatLahir, TglLahir, JK, Agama, Alamat, Ayah, Ibu, PekAyah, PekIbu, Jalan, Desa, Kec, Kota, Prov, Wali, PekWali, AlamatWali
      const nis = clean[0] || `2301${siswaList.length + parsed.length + 10}`;
      const nisn = clean[1] || '-';
      const nama = clean[2] || clean[1] || 'Siswa Baru';
      const kelas = lockedKelas || clean[3] || bulkTargetKelas;
      const fase = lockedKelas
        ? getFaseDisplayForKelas(lockedKelas)
        : clean[4] || getFaseDisplayForKelas(kelas);
      const tempatLahir = clean[5] || 'Blitar';
      const tanggalLahir = clean[6] || '1 Januari 2014';
      const jenisKelamin = clean[7]?.toUpperCase() === 'P' ? 'P' : 'L';
      const agama = clean[8] || 'Kristen Protestan';
      const alamat = clean[9] || 'Dsn. Tambak, Pagergunung, Kesamben, Blitar';
      const namaAyah = clean[10] || '-';
      const namaIbu = clean[11] || '-';
      const pekerjaanAyah = clean[12] || '-';
      const pekerjaanIbu = clean[13] || '-';
      const alamatOrtuJalan = clean[14] || alamat;
      const alamatOrtuKelurahan = clean[15] || 'Pagergunung';
      const alamatOrtuKecamatan = clean[16] || 'Kesamben';
      const alamatOrtuKota = clean[17] || 'Kab. Blitar';
      const alamatOrtuProvinsi = clean[18] || 'Jawa Timur';
      const namaWali = clean[19] || '-';
      const pekerjaanWali = clean[20] || '-';
      const alamatWali = clean[21] || '-';

      parsed.push({
        nis,
        nisn,
        nama,
        kelas,
        fase,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        alamat,
        namaAyah,
        namaIbu,
        pekerjaanAyah,
        pekerjaanIbu,
        alamatOrtuJalan,
        alamatOrtuKelurahan,
        alamatOrtuKecamatan,
        alamatOrtuKota,
        alamatOrtuProvinsi,
        namaWali,
        pekerjaanWali,
        alamatWali,
      });
    }

    if (parsed.length === 0) {
      setBulkError('Tidak ada baris data siswa yang berhasil terbaca.');
    } else {
      setBulkParsed(parsed);
    }
  };

  // Upload file CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBulkInputText(text);
    };
    reader.readAsText(file);
  };

  // Simpan Bulk ke Database
  const handleSaveBulk = () => {
    if (bulkParsed.length === 0) return;
    onAddBulkSiswa(bulkParsed);
    setIsBulkModalOpen(false);
    setBulkInputText('');
    setBulkParsed([]);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER PENGELOLAAN DATA SISWA */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Sistem Basis Data Peserta Didik
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Daftar & Identitas Peserta Didik
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data lengkap identitas siswa untuk Sampul Rapor, Lembar Identitas, dan integrasi nilai.
            </p>
          </div>

          {/* Action Buttons: Pengisian Rapor, Tambah Manual & Massal */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateToNilai && (
              <button
                type="button"
                onClick={onNavigateToNilai}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition"
              >
                <BookOpen className="w-4 h-4" />
                Pengisian Nilai & Rapor {lockedKelas ? `Kelas ${lockedKelas}` : ''}
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAddManual}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/30 transition"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Siswa Manual
            </button>

            <button
              type="button"
              onClick={() => {
                setBulkInputText('');
                setBulkParsed([]);
                setBulkError('');
                setIsBulkModalOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              Tambah Siswa Massal (Excel/CSV)
            </button>
          </div>
        </div>

        {/* 2. STATS & FILTER BAR */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Kelas (Locked if Wali Kelas) */}
          {lockedKelas ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Akses Kelas Terkunci: Kelas {lockedKelas} ({getKelasAngka(lockedKelas)}) • {getFaseFromKelas(lockedKelas)} ({filteredSiswa.length} Siswa)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5" />
                Filter Kelas:
              </span>
              <button
                type="button"
                onClick={() => setSelectedKelasFilter('Semua')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedKelasFilter === 'Semua'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({siswaList.length})
              </button>
              {availableKelasList.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKelasFilter(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedKelasFilter === k
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Kelas {k} ({siswaList.filter((s) => s.kelas === k).length})
                </button>
              ))}
            </div>
          )}

          {/* Search Box & Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-2 border-r border-slate-200 pr-3">
              <span className="font-semibold text-blue-600">L: {countL}</span>
              <span>•</span>
              <span className="font-semibold text-rose-600">P: {countP}</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABEL DATA SISWA LENGKAP */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap & NISN/NIS</th>
                <th className="py-3 px-4 text-center w-20">Kelas</th>
                <th className="py-3 px-4 text-center w-16">L/P</th>
                <th className="py-3 px-4">Tempat, Tanggal Lahir</th>
                <th className="py-3 px-4">Orang Tua (Ayah / Ibu)</th>
                <th className="py-3 px-4">Alamat Domisili</th>
                <th className="py-3 px-4 text-right w-48">Aksi & Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSiswa.map((siswa, idx) => {
                const isSelected = siswa.nis === selectedNis;
                return (
                  <tr
                    key={siswa.nis}
                    className={`transition hover:bg-slate-50 ${
                      isSelected ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {siswa.nama}
                        {isSelected && (
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        NISN: {siswa.nisn} • NIS: {siswa.nis}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        Kelas {siswa.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block w-6 h-6 rounded-full font-bold text-[11px] leading-6 ${
                          siswa.jenisKelamin === 'L'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {siswa.jenisKelamin}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{siswa.tempatLahir}</div>
                      <div className="text-[11px] text-slate-500">{siswa.tanggalLahir}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {siswa.namaAyah} / {siswa.namaIbu}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Pekerjaan: {siswa.pekerjaanAyah || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs" title={siswa.alamat}>
                      {siswa.alamat}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectNis(siswa.nis);
                            onNavigateToPrint(siswa.nis, 'cover');
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition"
                          title="Cetak Sampul Rapor A4"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectNis(siswa.nis);
                            onNavigateToPrint(siswa.nis, 'inti');
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition"
                          title="Cetak Rapor Inti A4"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(siswa)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Edit Data Siswa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (siswaList.length <= 1) {
                              alert('Minimal harus ada satu siswa di dalam sistem.');
                              return;
                            }
                            if (confirm(`Yakin ingin menghapus data siswa "${siswa.nama}"?`)) {
                              onDeleteSiswa(siswa.nis);
                            }
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL TAMBAH / EDIT SISWA MANUAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  {editingSiswa ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingSiswa ? 'Edit Identitas Siswa' : 'Tambah Siswa Baru (Manual)'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Isian data terintegrasi ke Sampul Rapor, Buku Induk, dan Nilai
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  {formError}
                </div>
              )}

              {/* SEKSI 1: IDENTITAS UTAMA SISWA */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                  <Users className="w-3.5 h-3.5" />
                  1. Identitas Pokok Peserta Didik
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nis}
                      onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                      placeholder="Contoh: 230108"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      NISN (Nomor Induk Siswa Nasional)
                    </label>
                    <input
                      type="text"
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      placeholder="Contoh: 0158352348"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      Nama Lengkap Peserta Didik <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                      placeholder="Contoh: ADRY GRACIO SURYAJAYA"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Panggilan</label>
                    <input
                      type="text"
                      value={formData.namaPanggilan || ''}
                      onChange={(e) => setFormData({ ...formData, namaPanggilan: e.target.value })}
                      placeholder="Contoh: Adry"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        Kelas
                        {lockedKelas && <Lock className="w-3 h-3 text-indigo-600" />}
                      </label>
                      <select
                        value={lockedKelas || normalizeKelasCode(formData.kelas)}
                        disabled={Boolean(lockedKelas)}
                        onChange={(e) => {
                          const newKelas = e.target.value;
                          setFormData({
                            ...formData,
                            kelas: newKelas,
                            fase: getFaseDisplayForKelas(newKelas),
                          });
                        }}
                        className={`w-full p-2.5 border border-slate-300 rounded-xl font-bold text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          lockedKelas ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-slate-50'
                        }`}
                      >
                        {TINGKAT_KELAS_SD.map((k) => (
                          <option key={k.kode} value={k.kode}>
                            {k.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
                      <select
                        value={formData.jenisKelamin}
                        onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="L">Laki-Laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.tempatLahir}
                      onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                      placeholder="Blitar"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                    <input
                      type="text"
                      value={formData.tanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                      placeholder="Contoh: 14 Maret 2014"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Agama</label>
                    <select
                      value={formData.agama}
                      onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Kristen Protestan">Kristen Protestan</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Islam">Islam</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fase Kurikulum</label>
                    <input
                      type="text"
                      value={formData.fase}
                      readOnly
                      className="w-full p-2.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal Siswa</label>
                    <input
                      type="text"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      placeholder="Contoh: Dsn. Tambak, RT 02/RW 03, Pagergunung, Kesamben, Blitar"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SEKSI 2: DATA ORANG TUA */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  2. Data Orang Tua (Ayah & Ibu)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Ayah</label>
                    <input
                      type="text"
                      value={formData.namaAyah}
                      onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value.toUpperCase() })}
                      placeholder="SURYA WIJAYA"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl uppercase font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pekerjaan Ayah</label>
                    <input
                      type="text"
                      value={formData.pekerjaanAyah}
                      onChange={(e) => setFormData({ ...formData, pekerjaanAyah: e.target.value.toUpperCase() })}
                      placeholder="WIRASWASTA"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Ibu</label>
                    <input
                      type="text"
                      value={formData.namaIbu}
                      onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value.toUpperCase() })}
                      placeholder="GRACE SANTOSO"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl uppercase font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pekerjaan Ibu</label>
                    <input
                      type="text"
                      value={formData.pekerjaanIbu}
                      onChange={(e) => setFormData({ ...formData, pekerjaanIbu: e.target.value.toUpperCase() })}
                      placeholder="IBU RUMAH TANGGA"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Detail Alamat Ortu untuk Lembar Identitas */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alamat Orang Tua (Jalan/Dsn)</label>
                    <input
                      type="text"
                      value={formData.alamatOrtuJalan}
                      onChange={(e) => setFormData({ ...formData, alamatOrtuJalan: e.target.value })}
                      placeholder="Dsn. Tambak RT 02/RW 03"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kelurahan / Desa</label>
                    <input
                      type="text"
                      value={formData.alamatOrtuKelurahan}
                      onChange={(e) => setFormData({ ...formData, alamatOrtuKelurahan: e.target.value })}
                      placeholder="Pagergunung"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kecamatan</label>
                    <input
                      type="text"
                      value={formData.alamatOrtuKecamatan}
                      onChange={(e) => setFormData({ ...formData, alamatOrtuKecamatan: e.target.value })}
                      placeholder="Kesamben"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kabupaten / Kota & Provinsi</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.alamatOrtuKota}
                        onChange={(e) => setFormData({ ...formData, alamatOrtuKota: e.target.value })}
                        placeholder="Kab. Blitar"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.alamatOrtuProvinsi}
                        onChange={(e) => setFormData({ ...formData, alamatOrtuProvinsi: e.target.value })}
                        placeholder="Jawa Timur"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEKSI 3: DATA WALI (OPSIONAL) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                  <Users className="w-3.5 h-3.5" />
                  3. Data Wali Murid (Jika ada)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Wali</label>
                    <input
                      type="text"
                      value={formData.namaWali || '-'}
                      onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                      placeholder="-"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pekerjaan Wali</label>
                    <input
                      type="text"
                      value={formData.pekerjaanWali || '-'}
                      onChange={(e) => setFormData({ ...formData, pekerjaanWali: e.target.value })}
                      placeholder="-"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alamat Wali</label>
                    <input
                      type="text"
                      value={formData.alamatWali || '-'}
                      onChange={(e) => setFormData({ ...formData, alamatWali: e.target.value })}
                      placeholder="-"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition"
                >
                  <Check className="w-4 h-4" />
                  {editingSiswa ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL TAMBAH SISWA MASSAL (CSV & PASTE DARI EXCEL) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Tambah Siswa Massal (Excel / CSV)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Impor puluhan siswa sekaligus dengan mengunggah file CSV atau copy-paste langsung dari spreadsheet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Petunjuk & Download Template */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Format Tabel Yang Didukung:
                  </span>
                  Kolom minimal: <strong>NIS, NISN, Nama Siswa, L/P, TTL, dsb.</strong> Anda dapat menyalin langsung dari Excel/Google Sheets.
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  Unduh Template CSV
                </button>
              </div>

              {/* Upload file CSV */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Atau Pilih File CSV dari Komputer:
                  </label>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    Kelas Default:
                    {lockedKelas && <Lock className="w-3 h-3 text-indigo-600" />}
                  </label>
                  <select
                    value={lockedKelas || bulkTargetKelas}
                    disabled={Boolean(lockedKelas)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBulkTargetKelas(val);
                      setBulkTargetFase(getFaseDisplayForKelas(val));
                    }}
                    className={`w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      lockedKelas ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-slate-50'
                    }`}
                  >
                    {TINGKAT_KELAS_SD.map((k) => (
                      <option key={k.kode} value={k.kode}>
                        {k.label} ({k.fase})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Textarea Paste */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Tempelkan (Paste) Teks Tabel dari Excel atau Google Sheets:
                </label>
                <textarea
                  rows={5}
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  placeholder={`Contoh baris tabel yang di-copy dari Excel / Sheets:\n230108\t0159988771\tJONATHAN KRISNA PUTRA\tV\tFase C (Kelas V)\tBlitar\t18 Mei 2014\tL\n230109\t0159988772\tMARIA NATHANIA\tV\tFase C (Kelas V)\tBlitar\t22 Agustus 2014\tP`}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleParseBulk}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Analisis & Pratinjau Siswa
                </button>
              </div>

              {bulkError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  {bulkError}
                </div>
              )}

              {/* Pratinjau Hasil Parse */}
              {bulkParsed.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">
                      Pratinjau {bulkParsed.length} Siswa Siap Ditambahkan:
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Valid & Siap Disimpan
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 w-10 text-center">No</th>
                          <th className="py-2 px-3">Nama Siswa</th>
                          <th className="py-2 px-3">NIS</th>
                          <th className="py-2 px-3">NISN</th>
                          <th className="py-2 px-3 text-center">Kelas</th>
                          <th className="py-2 px-3 text-center">L/P</th>
                          <th className="py-2 px-3">TTL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bulkParsed.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{s.nama}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{s.nis}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{s.nisn}</td>
                            <td className="py-2 px-3 text-center font-bold">Kelas {s.kelas}</td>
                            <td className="py-2 px-3 text-center font-bold">{s.jenisKelamin}</td>
                            <td className="py-2 px-3 text-slate-600">{s.tempatLahir}, {s.tanggalLahir}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleSaveBulk}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition"
                    >
                      <Check className="w-4 h-4" />
                      Simpan {bulkParsed.length} Siswa ke Database E-Rapor
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Siswa baru otomatis diinisialisasi nilai rapor dan absensinya.
              </span>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
