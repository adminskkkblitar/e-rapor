import React, { useState } from 'react';
import { MasterKurikulumMapel, UserSession } from '../types/rapor';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: UserSession;
  onSwitchSession: (session: UserSession) => void;
  kurikulum: MasterKurikulumMapel[];
  namaWaliKelas: string;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onSwitchSession,
  kurikulum,
  namaWaliKelas,
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'wali_kelas' | 'guru_mapel'>(
    currentSession.role
  );
  const [selectedKodeMapel, setSelectedKodeMapel] = useState<string>(
    currentSession.kodeMapelAjar || kurikulum[0]?.kodeMapel || ''
  );
  const [namaGuruMapel, setNamaGuruMapel] = useState<string>(
    currentSession.role === 'guru_mapel' ? currentSession.namaUser : ''
  );

  if (!isOpen) return null;

  const handleApplyLogin = () => {
    if (selectedRole === 'admin') {
      onSwitchSession({
        isLoggedIn: true,
        userId: 'user-admin',
        role: 'admin',
        namaUser: 'Dian Natalia Widiasih, S.Psi',
      });
    } else if (selectedRole === 'wali_kelas') {
      onSwitchSession({
        isLoggedIn: true,
        userId: 'user-wali',
        role: 'wali_kelas',
        namaUser: namaWaliKelas,
      });
    } else {
      const mapelObj = kurikulum.find((m) => m.kodeMapel === selectedKodeMapel);
      const nama =
        namaGuruMapel.trim() || `Guru ${mapelObj ? mapelObj.namaMapel : 'Mata Pelajaran'}`;
      onSwitchSession({
        isLoggedIn: true,
        userId: 'user-mapel',
        role: 'guru_mapel',
        namaUser: nama,
        kodeMapelAjar: selectedKodeMapel,
        namaMapelAjar: mapelObj ? mapelObj.namaMapel : '',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Akses Masuk & Peran Pengguna
              </h2>
              <p className="text-xs text-slate-300">
                Pilih peran Anda untuk menyesuaikan hak akses dan keamanan penginputan nilai.
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Sistem mendukung pembatasan akses: <strong>Wali Kelas</strong> memiliki kontrol penuh seluruh rapor, sedangkan <strong>Guru Mapel</strong> hanya memiliki hak akses untuk menginput nilai pada mata pelajaran yang diampunya.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* OPSI 1: WALI KELAS */}
            <div
              onClick={() => setSelectedRole('wali_kelas')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                selectedRole === 'wali_kelas'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  {selectedRole === 'wali_kelas' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Wali Kelas</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Akses penuh: Semua 10 Mapel, Nilai, Data Siswa, Leger & Peringkat, 8 Dimensi Karakter, Absensi, dan Cetak Rapor.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] font-semibold text-indigo-900">
                👤 {namaWaliKelas}
              </div>
            </div>

            {/* OPSI 2: GURU MATA PELAJARAN */}
            <div
              onClick={() => setSelectedRole('guru_mapel')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                selectedRole === 'guru_mapel'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  {selectedRole === 'guru_mapel' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Guru Mata Pelajaran</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Akses khusus: Menginput nilai formatif (25 TP) dan sumatif untuk mata pelajaran yang Anda ampu saja.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Mapel lain otomatis terkunci
              </div>
            </div>
          </div>

          {/* Form Detail jika memilih Guru Mapel */}
          {selectedRole === 'guru_mapel' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 pt-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Konfigurasi Akses Guru Mapel:
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pilih Mata Pelajaran yang Anda Ajar: <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedKodeMapel}
                  onChange={(e) => setSelectedKodeMapel(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {kurikulum.map((m) => (
                    <option key={m.kodeMapel} value={m.kodeMapel}>
                      {m.namaMapel} ({m.kelompok})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Anda / Guru Pengampu (Opsional):
                </label>
                <input
                  type="text"
                  value={namaGuruMapel}
                  onChange={(e) => setNamaGuruMapel(e.target.value)}
                  placeholder={`Contoh: Guru ${
                    kurikulum.find((m) => m.kodeMapel === selectedKodeMapel)?.namaMapel || 'Mapel'
                  }`}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Info Status Saat Ini */}
          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-700">
            <span className="text-slate-500">Sesi Aktif Sekarang:</span>
            <span className="font-bold text-slate-900">
              {currentSession.role === 'wali_kelas'
                ? `Wali Kelas (${currentSession.namaUser})`
                : `Guru Mapel (${currentSession.namaMapelAjar || currentSession.namaUser})`}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyLogin}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition"
          >
            <Check className="w-4 h-4" />
            Terapkan Akses Masuk
          </button>
        </div>
      </div>
    </div>
  );
};
