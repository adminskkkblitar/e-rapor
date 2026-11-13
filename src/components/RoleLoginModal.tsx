import React, { useEffect, useState } from 'react';
import {
  MasterKurikulumMapel,
  ProfilSekolah,
  TingkatKelasSD,
  UserAccount,
  UserSession,
} from '../types/rapor';
import {
  TINGKAT_KELAS_SD,
  getFaseFromKelas,
  getWaliKelasForSiswa,
  normalizeKelasCode,
} from '../utils/raporCalculations';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Lock,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: UserSession;
  onSwitchSession: (session: UserSession) => void;
  kurikulum: MasterKurikulumMapel[];
  namaWaliKelas: string;
  sekolah?: ProfilSekolah;
  users?: UserAccount[];
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onSwitchSession,
  kurikulum,
  namaWaliKelas,
  sekolah,
  users = [],
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'wali_kelas' | 'guru_mapel'>(
    currentSession.role
  );
  const [selectedKelasWali, setSelectedKelasWali] = useState<TingkatKelasSD>(
    normalizeKelasCode(currentSession.kelasAjar || 'V')
  );
  const [selectedKodeMapel, setSelectedKodeMapel] = useState<string>(
    currentSession.kodeMapelAjar || kurikulum[0]?.kodeMapel || ''
  );
  const [namaGuruMapel, setNamaGuruMapel] = useState<string>(
    currentSession.role === 'guru_mapel' ? currentSession.namaUser : ''
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(currentSession.role);
      setSelectedKelasWali(normalizeKelasCode(currentSession.kelasAjar || 'V'));
      setSelectedKodeMapel(currentSession.kodeMapelAjar || kurikulum[0]?.kodeMapel || '');
      if (currentSession.role === 'guru_mapel') {
        setNamaGuruMapel(currentSession.namaUser);
      } else {
        const defaultCode = currentSession.kodeMapelAjar || kurikulum[0]?.kodeMapel || '';
        const masterGm = sekolah?.guruMapelList?.find((g) => g.kodeMapel === defaultCode);
        const userGm = users.find((u) => u.role === 'guru_mapel' && u.kodeMapel === defaultCode);
        setNamaGuruMapel(masterGm?.nama || userGm?.nama || '');
      }
    }
  }, [isOpen, currentSession, kurikulum, sekolah, users]);

  if (!isOpen) return null;

  const resolveWaliKelasName = (kelas: TingkatKelasSD): { id: string; nama: string } => {
    const userMatch = users.find(
      (u) => u.role === 'wali_kelas' && normalizeKelasCode(u.kelasAjar || 'V') === kelas
    );
    if (sekolah) {
      const fromSekolah = getWaliKelasForSiswa(sekolah, kelas);
      if (fromSekolah.nama && fromSekolah.nama !== '-') {
        return {
          id: userMatch?.id || `user-wali-${kelas}`,
          nama: fromSekolah.nama,
        };
      }
    }
    if (userMatch) {
      return { id: userMatch.id, nama: userMatch.nama };
    }
    return { id: 'user-wali', nama: namaWaliKelas };
  };

  const handleSelectKodeMapel = (kode: string) => {
    setSelectedKodeMapel(kode);
    const masterGm = sekolah?.guruMapelList?.find((g) => g.kodeMapel === kode);
    const userGm = users.find((u) => u.role === 'guru_mapel' && u.kodeMapel === kode);
    if (masterGm?.nama) {
      setNamaGuruMapel(masterGm.nama);
    } else if (userGm?.nama) {
      setNamaGuruMapel(userGm.nama);
    }
  };

  const activeWaliPreview = resolveWaliKelasName(selectedKelasWali);

  const handleApplyLogin = () => {
    if (selectedRole === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin');
      onSwitchSession({
        isLoggedIn: true,
        userId: adminUser?.id || 'user-admin',
        role: 'admin',
        namaUser: adminUser?.nama || 'Dian Natalia Widiasih, S.Psi',
      });
    } else if (selectedRole === 'wali_kelas') {
      onSwitchSession({
        isLoggedIn: true,
        userId: activeWaliPreview.id,
        role: 'wali_kelas',
        namaUser: activeWaliPreview.nama,
        kelasAjar: selectedKelasWali,
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
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Akses Masuk &amp; Peran Pengguna
              </h2>
              <p className="text-xs text-slate-300">
                Pilih peran Anda untuk menyesuaikan hak akses kelas, Fase CP/TP, dan keamanan penginputan nilai.
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
            <strong>Wali Kelas</strong> diarahkan langsung &amp; terkunci pada kelas tugasnya (Kelas 1–6), sedangkan <strong>Guru Mapel</strong> terkunci pada mata pelajaran ampuannya namun bebas memilih Kelas 1–6.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* OPSI 1: WALI KELAS */}
            <div
              onClick={() => setSelectedRole('wali_kelas')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
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
                  Akses penuh semua mapel &amp; rapor khusus pada kelas yang diampu (terkunci 1 kelas).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-semibold text-indigo-900 truncate">
                👤 {activeWaliPreview.nama}
              </div>
            </div>

            {/* OPSI 2: GURU MATA PELAJARAN */}
            <div
              onClick={() => setSelectedRole('guru_mapel')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                selectedRole === 'guru_mapel'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  {selectedRole === 'guru_mapel' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Guru Mapel</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Akses semua kelas (Kelas 1–6) khusus untuk mata pelajaran ampuannya saja.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                Mapel lain terkunci
              </div>
            </div>

            {/* OPSI 3: ADMINISTRATOR */}
            <div
              onClick={() => setSelectedRole('admin')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                selectedRole === 'admin'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  {selectedRole === 'admin' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Administrator</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Akses penuh manajemen akun guru, identitas sekolah, &amp; seluruh kelas I–VI.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-semibold text-emerald-800">
                ⚙️ Pengelola Sistem
              </div>
            </div>
          </div>

          {/* Form Detail jika memilih Wali Kelas */}
          {selectedRole === 'wali_kelas' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                Konfigurasi Kelas Tugas Wali Kelas:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pilih Tingkat Kelas (1 s.d. 6): <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedKelasWali}
                    onChange={(e) => setSelectedKelasWali(e.target.value as TingkatKelasSD)}
                    className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {TINGKAT_KELAS_SD.map((t) => (
                      <option key={t.kode} value={t.kode}>
                        {t.label} — {t.fase}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Wali Kelas Terdaftar (Master Sekolah):
                  </label>
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 truncate">
                    {activeWaliPreview.nama}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Setelah diterapkan, aplikasi langsung membuka halaman Data Siswa khusus <strong>Kelas {selectedKelasWali}</strong> dan mengunci Fase CP ke <strong>{getFaseFromKelas(selectedKelasWali)}</strong>.
              </p>
            </div>
          )}

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
                  onChange={(e) => handleSelectKodeMapel(e.target.value)}
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
                ? `Wali Kelas ${currentSession.kelasAjar || 'V'} (${currentSession.namaUser})`
                : currentSession.role === 'admin'
                ? `Administrator (${currentSession.namaUser})`
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

