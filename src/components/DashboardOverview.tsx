import React, { useState, useMemo } from 'react';
import {
  DataSiswa,
  MasterKurikulumMapel,
  NilaiFormatifSiswa,
  NilaiSumatifSiswa,
  ProfilSekolah,
  UserSession,
} from '../types/rapor';
import { LegerRowData } from './LegerTable';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Database,
  EyeOff,
  FileCheck,
  GraduationCap,
  Layers,
  Lock,
  PieChart,
  Printer,
  School,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

interface DashboardOverviewProps {
  sekolah: ProfilSekolah;
  siswaList: DataSiswa[];
  selectedNis: string;
  onSelectNis: (nis: string) => void;
  semester: 1 | 2;
  onSelectTab: (tab: 'dashboard' | 'preview' | 'nilai' | 'kokurikuler' | 'leger' | 'kurikulum' | 'siswa') => void;
  onOpenGasModal: () => void;
  onOpenAbsensiModal?: () => void;
  onOpenRoleModal?: () => void;
  legerRows: LegerRowData[];
  kurikulum?: MasterKurikulumMapel[];
  nilaiFormatif?: NilaiFormatifSiswa[];
  nilaiSumatif?: NilaiSumatifSiswa[];
  userSession?: UserSession;
  onSelectMapelForNilai?: (kodeMapel: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sekolah,
  siswaList,
  selectedNis,
  onSelectNis,
  semester,
  onSelectTab,
  onOpenGasModal,
  onOpenAbsensiModal,
  onOpenRoleModal,
  legerRows,
  kurikulum = [],
  nilaiFormatif = [],
  nilaiSumatif = [],
  userSession,
  onSelectMapelForNilai,
}) => {
  // Pilihan Tampilan Dashboard:
  // 'overview' = Ikhtisar Lengkap & Roster Siswa
  // 'progres' = Progres Pengisian Nilai (Umum & Per Mapel)
  // 'rata_rata' = Statistik & Nilai Rata-Rata Per Mapel
  const [dashboardView, setDashboardView] = useState<'overview' | 'progres' | 'rata_rata'>('overview');

  const activeSiswa = siswaList.find((s) => s.nis === selectedNis) || siswaList[0];
  const totalSiswa = siswaList.length;

  // Hitung Nilai Rata-rata Kelas Keseluruhan
  const avgClass = useMemo(() => {
    if (legerRows.length === 0) return 0;
    const total = legerRows.reduce((acc, curr) => acc + curr.rataRata, 0);
    return Math.round((total / legerRows.length) * 10) / 10;
  }, [legerRows]);

  // =========================================================================
  // KALKULASI PROGRES PENGISIAN & RATA-RATA PER MAPEL
  // =========================================================================
  const mapelStats = useMemo(() => {
    return kurikulum.map((mapel) => {
      let filledCount = 0;
      let totalScore = 0;
      let maxScore = 0;
      let minScore = 100;
      let maxStudentName = '-';
      let sbCount = 0; // >= 85
      let bCount = 0;  // 75 - 84
      let pbCount = 0; // < 75

      siswaList.forEach((s) => {
        const studentRow = legerRows.find((r) => r.nis === s.nis);
        const score = studentRow?.nilaiPerMapel?.[mapel.kodeMapel] || 0;

        if (score > 0) {
          filledCount++;
          totalScore += score;
          if (score > maxScore) {
            maxScore = score;
            maxStudentName = s.nama;
          }
          if (score < minScore) {
            minScore = score;
          }

          if (score >= 85) sbCount++;
          else if (score >= 75) bCount++;
          else pbCount++;
        }
      });

      const avg = filledCount > 0 ? Math.round((totalScore / filledCount) * 10) / 10 : 0;
      const progressPercent = totalSiswa > 0 ? Math.round((filledCount / totalSiswa) * 100) : 0;

      return {
        kodeMapel: mapel.kodeMapel,
        namaMapel: mapel.namaMapel,
        kelompok: mapel.kelompok,
        filledCount,
        totalSiswa,
        progressPercent,
        average: avg,
        maxScore: maxScore > 0 ? maxScore : 0,
        maxStudentName,
        minScore: minScore <= 100 && filledCount > 0 ? minScore : 0,
        sbCount,
        bCount,
        pbCount,
        isCompleted: progressPercent === 100,
        isPartiallyFilled: progressPercent > 0 && progressPercent < 100,
      };
    });
  }, [kurikulum, siswaList, legerRows, totalSiswa]);

  // Agregat Progres Umum Seluruh Kelas
  const generalProgress = useMemo(() => {
    if (mapelStats.length === 0) return 0;
    const totalPossibleSlots = mapelStats.length * totalSiswa;
    const totalFilledSlots = mapelStats.reduce((acc, curr) => acc + curr.filledCount, 0);
    return totalPossibleSlots > 0 ? Math.round((totalFilledSlots / totalPossibleSlots) * 100) : 0;
  }, [mapelStats, totalSiswa]);

  const completedMapelCount = mapelStats.filter((m) => m.isCompleted).length;
  const inProgressMapelCount = mapelStats.filter((m) => m.isPartiallyFilled).length;
  const unstartedMapelCount = mapelStats.filter((m) => m.progressPercent === 0).length;

  const handleOpenMapelGrading = (kodeMapel: string) => {
    if (onSelectMapelForNilai) {
      onSelectMapelForNilai(kodeMapel);
    }
    onSelectTab('nilai');
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER RESMI & ELEGAN */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Sistem Informasi Rapor Kurikulum Deep Learning
              </span>

              {/* User Session Role Badge */}
              {userSession && (
                <button
                  type="button"
                  onClick={onOpenRoleModal}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                    userSession.role === 'wali_kelas'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                  }`}
                  title="Klik untuk mengganti peran pengguna"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {userSession.role === 'wali_kelas'
                    ? `Wali Kelas: ${userSession.namaUser}`
                    : `Guru: ${userSession.namaMapelAjar || userSession.namaUser}`}
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Selamat Bertugas, {userSession?.namaUser || sekolah.namaWaliKelas}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Wali Kelas {activeSiswa.kelas} • <strong>{sekolah.namaSekolah}</strong> ({sekolah.alamatSekolah}, {sekolah.kelurahan}, {sekolah.kecamatan}, {sekolah.kotaKabupaten}).
              Pengelolaan hasil evaluasi belajar terpadu dengan Kurikulum Deep Learning dan Kokurikuler 8 Dimensi Profil Lulusan.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Semester {semester} ({semester === 1 ? 'Ganjil' : 'Genap'}) • TP {sekolah.tahunPelajaran}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80">
                <School className="w-3.5 h-3.5 text-sky-400" />
                Kepsek: {sekolah.namaKepalaSekolah}
              </span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('preview')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <FileCheck className="w-4 h-4" />
              Pratinjau & Cetak Rapor A4
            </button>

            <button
              onClick={() => onSelectTab('siswa')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Users className="w-4 h-4 text-sky-400" />
              Kelola Data Siswa
            </button>

            {onOpenAbsensiModal && (
              <button
                onClick={onOpenAbsensiModal}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Rekap Absensi (Google Sheets)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PILIHAN TAMPILAN DASHBOARD (VIEW SELECTOR) */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2 hidden sm:inline">
            Tampilan:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setDashboardView('overview')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                dashboardView === 'overview'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Ikhtisar Umum & Roster
            </button>

            <button
              type="button"
              onClick={() => setDashboardView('progres')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                dashboardView === 'progres'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Progres Pengisian Nilai ({generalProgress}%)
            </button>

            <button
              type="button"
              onClick={() => setDashboardView('rata_rata')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                dashboardView === 'rata_rata'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Rata-Rata Nilai Per Mapel
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <span className="text-xs text-slate-500">
            Total <strong>10</strong> Mata Pelajaran • <strong>{totalSiswa}</strong> Siswa
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAMPILAN 1: PROGRES PENGISIAN NILAI (UMUM & PER MAPEL)                */}
      {/* ===================================================================== */}
      {dashboardView === 'progres' && (
        <div className="space-y-6">
          {/* Card Agregat Progres Pengisian Umum */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Progres Pengisian Nilai Rapor Semester {semester}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pemantauan kelengkapan asesmen formatif (25 TP) dan sumatif di seluruh mata pelajaran.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-950">{generalProgress}%</span>
                  <span className="text-xs text-slate-500 block">Total Data Terisi</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-600 flex items-center justify-center font-black text-indigo-950 text-sm">
                  {generalProgress}%
                </div>
              </div>
            </div>

            {/* Breakdown Status Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 block">Mapel Selesai (100%)</span>
                  <span className="text-2xl font-black text-emerald-950">{completedMapelCount} Mapel</span>
                </div>
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-800 block">Sedang Diisi (Proses)</span>
                  <span className="text-2xl font-black text-amber-950">{inProgressMapelCount} Mapel</span>
                </div>
                <Clock className="w-7 h-7 text-amber-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Belum Dimulai</span>
                  <span className="text-2xl font-black text-slate-900">{unstartedMapelCount} Mapel</span>
                </div>
                <AlertCircle className="w-7 h-7 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Grid Progres Pengisian Per Mapel */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Rincian Progres Pengisian per Mata Pelajaran (10 Mapel)</span>
              <span className="text-xs font-normal text-slate-500">Klik tombol untuk langsung mengisi nilai</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mapelStats.map((stat) => (
                <div
                  key={stat.kodeMapel}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                          {stat.kodeMapel.split('-')[0]}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{stat.namaMapel}</h4>
                          <span className="text-[10px] text-slate-500">{stat.kelompok}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          stat.progressPercent === 100
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : stat.progressPercent > 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {stat.progressPercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-2.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.progressPercent === 100
                            ? 'bg-emerald-600'
                            : stat.progressPercent > 50
                            ? 'bg-indigo-600'
                            : stat.progressPercent > 0
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${stat.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>
                        Siswa terisi: <strong>{stat.filledCount}</strong> / {stat.totalSiswa} anak
                      </span>
                      <span>
                        Rerata Kelas: <strong>{stat.average || '-'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenMapelGrading(stat.kodeMapel)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition"
                    >
                      <span>Input Nilai Mapel Ini</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAMPILAN 2: NILAI RATA-RATA & STATISTIK PER MAPEL                     */}
      {/* ===================================================================== */}
      {dashboardView === 'rata_rata' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Statistik & Rata-Rata Nilai Akhir per Mata Pelajaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analisis perolehan nilai kelas, skor tertinggi, skor terendah, dan distribusi predikat capaian.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase block">Rerata Keseluruhan</span>
                <span className="text-2xl font-black text-indigo-950">{avgClass}</span>
              </div>
            </div>

            {/* Grid Kartu Rata-Rata Mapel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {mapelStats.map((stat) => (
                <div
                  key={stat.kodeMapel}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {stat.kodeMapel}
                      </span>
                      <span className="text-[10px] text-slate-500">{stat.kelompok}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {stat.namaMapel}
                    </h4>

                    {/* Nilai Rata-Rata Utama */}
                    <div className="my-4 flex items-baseline justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-500">Rata-Rata Kelas:</span>
                      <span className="text-2xl font-black text-indigo-950">
                        {stat.average || '-'}
                      </span>
                    </div>

                    {/* High & Low Scores */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nilai Tertinggi:</span>
                        <span className="font-bold text-emerald-700">
                          {stat.maxScore || '-'} ({stat.maxStudentName.split(' ')[0]})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nilai Terendah:</span>
                        <span className="font-bold text-slate-700">
                          {stat.minScore || '-'}
                        </span>
                      </div>
                    </div>

                    {/* Predikat Distribution */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[10px]">
                      <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded font-bold">
                        <div>SB (&gt;85)</div>
                        <div className="text-xs mt-0.5">{stat.sbCount}</div>
                      </div>
                      <div className="bg-blue-50 text-blue-800 p-1.5 rounded font-bold">
                        <div>B (75-84)</div>
                        <div className="text-xs mt-0.5">{stat.bCount}</div>
                      </div>
                      <div className="bg-amber-50 text-amber-800 p-1.5 rounded font-bold">
                        <div>PB (&lt;75)</div>
                        <div className="text-xs mt-0.5">{stat.pbCount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMapelGrading(stat.kodeMapel)}
                      className="w-full py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>Lihat Rincian Nilai</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAMPILAN 0: IKHTISAR LENGKAP & ROSTER SISWA (DEFAULT)                 */}
      {/* ===================================================================== */}
      {dashboardView === 'overview' && (
        <>
          {/* STATISTIK UTAMA (KPI CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Siswa Terdaftar */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Siswa
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900">{totalSiswa}</div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Kelas {activeSiswa.kelas} (Fase C)
                </p>
              </div>
            </div>

            {/* Nilai Rata-Rata Kelas */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Rata-Rata Kelas
                </span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-indigo-950">{avgClass}</div>
                <p className="text-xs text-indigo-700 font-medium mt-1">
                  Skala 0 - 100 • Deep Learning
                </p>
              </div>
            </div>

            {/* Capaian Progres Pengisian */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Progres Rapor
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-emerald-900">{generalProgress}%</div>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  {completedMapelCount} dari 10 Mapel Lengkap
                </p>
              </div>
            </div>

            {/* Status Kenaikan Kelas */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status Kenaikan
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-amber-950">Naik Kelas VI</div>
                <p className="text-xs text-amber-700 font-medium mt-1">
                  {semester === 2 ? 'Aktif di Semester 2' : 'Dinonaktifkan di Semester 1'}
                </p>
              </div>
            </div>
          </div>

          {/* GRID 2 KOLOM: PROFIL SISWA AKTIF & DISTRIBUSI KARAKTER 8 DIMENSI */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Siswa Terpilih Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Peserta Didik Aktif
                  </span>
                  <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                    NISN: {activeSiswa.nisn}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
                    {activeSiswa.nama.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {activeSiswa.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      NIS: {activeSiswa.nis} • Kelas {activeSiswa.kelas} • {activeSiswa.agama}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                    <span className="font-semibold text-slate-900">{activeSiswa.tempatLahir}, {activeSiswa.tanggalLahir}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Orang Tua:</span>
                    <span className="font-semibold text-slate-900">{activeSiswa.namaAyah} / {activeSiswa.namaIbu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alamat:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[180px]">{activeSiswa.alamat}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('preview')}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Rapor Siswa Ini
                </button>
                <button
                  onClick={() => onSelectTab('nilai')}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Edit Nilai
                </button>
              </div>
            </div>

            {/* 8 Dimensi Profil Lulusan Tracker */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    Capaian 8 Dimensi Profil Lulusan (Kurikulum Deep Learning)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Penguatan karakter kontekstual berbasis pemikiran mendalam, refleksi mandiri, dan gotong royong.
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab('kokurikuler')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  Kelola <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { code: 'D1', title: 'Keimanan, Ketakwaan & Akhlak Mulia', score: '96%', pred: 'Sangat Berkembang' },
                  { code: 'D2', title: 'Kewargaan & Kebhinekaan Global', score: '90%', pred: 'Berkembang Sesuai Harapan' },
                  { code: 'D3', title: 'Penalaran Kritis & Problem Solving', score: '94%', pred: 'Sangat Berkembang' },
                  { code: 'D4', title: 'Kreativitas, Inovasi & Eksplorasi', score: '88%', pred: 'Berkembang Sesuai Harapan' },
                  { code: 'D5', title: 'Kolaborasi & Gotong Royong', score: '98%', pred: 'Sangat Berkembang' },
                  { code: 'D6', title: 'Kemandirian & Regulasi Diri', score: '92%', pred: 'Berkembang Sesuai Harapan' },
                  { code: 'D7', title: 'Komunikasi Efektif & Literasi Digital', score: '95%', pred: 'Sangat Berkembang' },
                  { code: 'D8', title: 'Kebugaran Jasmani & Karakter Tangguh', score: '90%', pred: 'Berkembang Sesuai Harapan' },
                ].map((dim) => (
                  <div
                    key={dim.code}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-indigo-50/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-[11px] shrink-0">
                        {dim.code}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-[11px] leading-snug line-clamp-1">
                          {dim.title}
                        </h4>
                        <span className="text-[10px] text-emerald-700 font-semibold">{dim.pred}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs">{dim.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROSTER SISWA LENGKAP */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Daftar Peserta Didik Kelas {activeSiswa.kelas} ({siswaList.length} Siswa)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih siswa untuk melihat langsung pratinjau Rapor Inti atau Sampul Cetak A4.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  Peringkat backend tidak ditampilkan pada cetakan fisik rapor
                </span>

                <button
                  onClick={() => onSelectTab('siswa')}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  Kelola Siswa Lengkap
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-center w-12">No</th>
                    <th className="py-3 px-4">Nama Peserta Didik</th>
                    <th className="py-3 px-4">NISN / NIS</th>
                    <th className="py-3 px-4 text-center w-24">Rata-Rata</th>
                    <th className="py-3 px-4 text-center w-32 bg-amber-50/50">Kategori Persentil</th>
                    <th className="py-3 px-4 text-center w-32">Status Kenaikan</th>
                    <th className="py-3 px-4 text-right w-44">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {legerRows.map((r, idx) => {
                    const isSelected = r.nis === selectedNis;
                    return (
                      <tr
                        key={r.nis}
                        className={`transition hover:bg-slate-50 ${
                          isSelected ? 'bg-indigo-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {r.nama}
                            {isSelected && (
                              <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded">
                                Dipilih
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {siswaList.find((s) => s.nis === r.nis)?.nisn} / {r.nis}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-slate-900 text-sm">
                          {r.rataRata}
                        </td>
                        <td className="py-3 px-4 text-center bg-amber-50/30">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              r.persentil === 'Top 10%'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : r.persentil === 'Bottom 30%'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {r.persentil}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            {r.statusKenaikan}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectNis(r.nis);
                                onSelectTab('preview');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs transition"
                            >
                              Rapor
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectNis(r.nis);
                                onSelectTab('nilai');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            >
                              Nilai
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
        </>
      )}
    </div>
  );
};
