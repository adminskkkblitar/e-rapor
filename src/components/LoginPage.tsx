import React, { useEffect, useState } from 'react';
import { MasterKurikulumMapel, ProfilSekolah, TingkatKelasSD, UserAccount, UserRole, UserSession } from '../types/rapor';
import { TINGKAT_KELAS_SD, getFaseFromKelas, getWaliKelasForSiswa, normalizeKelasCode } from '../utils/raporCalculations';
import {
  KeyRound,
  Lock,
  LogIn,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface LoginPageProps {
  sekolah: ProfilSekolah;
  users: UserAccount[];
  kurikulum: MasterKurikulumMapel[];
  onLoginSuccess: (session: UserSession) => void;
  serverSyncStatus?: {
    type: 'loading' | 'success' | 'info' | 'error';
    message: string;
  } | null;
  onRefreshFromSheets?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  sekolah,
  users,
  kurikulum,
  onLoginSuccess,
  serverSyncStatus,
  onRefreshFromSheets,
}) => {
  // Selected role
  const [selectedRole, setSelectedRole] = useState<UserRole>('wali_kelas');
  
  // Selected or typed teacher name
  const defaultWali = users.find((u) => u.id === 'user-wali') || users.find((u) => u.role === 'wali_kelas');
  const [namaGuru, setNamaGuru] = useState<string>(defaultWali?.nama || 'Petrus Apriprasetyo, S.Pd');
  const [selectedUserId, setSelectedUserId] = useState<string>(defaultWali?.id || 'user-wali');

  // Selected class if Wali Kelas
  const [kelasWali, setKelasWali] = useState<TingkatKelasSD>(
    normalizeKelasCode(defaultWali?.kelasAjar || 'V')
  );
  
  // Selected subject if Guru Mapel
  const [kodeMapel, setKodeMapel] = useState<string>('PAK-01');
  
  // Password state
  const [password, setPassword] = useState<string>(defaultWali?.password || 'wali123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasEditedCredentials, setHasEditedCredentials] = useState<boolean>(false);
  
  // Error message
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Sinkronkan nama & akun terpilih saat daftar users baru ditarik dari Google Sheets
  useEffect(() => {
    if (hasEditedCredentials) return;
    const syncedUser =
      users.find((u) => u.id === selectedUserId) ||
      users.find((u) => u.role === selectedRole);
    if (syncedUser) {
      setSelectedUserId(syncedUser.id);
      setNamaGuru(syncedUser.nama);
      setPassword(syncedUser.password);
      if (syncedUser.role === 'wali_kelas' && syncedUser.kelasAjar) {
        setKelasWali(normalizeKelasCode(syncedUser.kelasAjar));
      }
      if (syncedUser.kodeMapel) {
        setKodeMapel(syncedUser.kodeMapel);
      }
    }
  }, [users, selectedUserId, selectedRole, hasEditedCredentials]);

  // Handle changing user from preset list
  const handleSelectPresetUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setHasEditedCredentials(true);
    setSelectedUserId(user.id);
    setNamaGuru(user.nama);
    setSelectedRole(user.role);
    setPassword(user.password);
    if (user.role === 'wali_kelas') {
      setKelasWali(normalizeKelasCode(user.kelasAjar || 'V'));
    }
    if (user.kodeMapel) {
      setKodeMapel(user.kodeMapel);
    }
    setErrorMessage('');
  };

  // Handle changing class for Wali Kelas
  const handleSelectKelasWali = (kelas: TingkatKelasSD) => {
    setHasEditedCredentials(true);
    setKelasWali(kelas);
    setErrorMessage('');
    const matchedWali = users.find(
      (u) => u.role === 'wali_kelas' && normalizeKelasCode(u.kelasAjar || 'V') === kelas
    );
    if (matchedWali) {
      setSelectedUserId(matchedWali.id);
      setNamaGuru(matchedWali.nama);
      setPassword(matchedWali.password);
    } else {
      const fromSekolah = getWaliKelasForSiswa(sekolah, kelas);
      if (fromSekolah.nama && fromSekolah.nama !== '-') {
        setNamaGuru(fromSekolah.nama);
      }
      setPassword('wali123');
    }
  };

  // Handle role change
  const handleChangeRole = (role: UserRole) => {
    setHasEditedCredentials(true);
    setSelectedRole(role);
    setErrorMessage('');
    
    // Suggest matching teacher
    const match =
      role === 'wali_kelas'
        ? users.find((u) => u.role === 'wali_kelas' && normalizeKelasCode(u.kelasAjar || 'V') === kelasWali) ||
          users.find((u) => u.role === 'wali_kelas')
        : users.find((u) => u.role === role);
    if (match) {
      setSelectedUserId(match.id);
      setNamaGuru(match.nama);
      setPassword(match.password);
      if (match.role === 'wali_kelas') setKelasWali(normalizeKelasCode(match.kelasAjar || 'V'));
      if (match.kodeMapel) setKodeMapel(match.kodeMapel);
    } else {
      if (role === 'admin') {
        setNamaGuru('Dian Natalia Widiasih, S.Psi');
        setPassword('admin123');
      } else if (role === 'wali_kelas') {
        setNamaGuru(getWaliKelasForSiswa(sekolah, kelasWali).nama || 'Petrus Apriprasetyo, S.Pd');
        setPassword('wali123');
      } else {
        setNamaGuru('Budi Hartono, S.Th');
        setPassword('guru123');
        setKodeMapel('PAK-01');
      }
    }
  };

  // Handle Login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!namaGuru.trim()) {
      setErrorMessage('Silakan masukkan atau pilih Nama Guru.');
      return;
    }

    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi / password.');
      return;
    }

    // Check against registered users
    const matchedUser = users.find(
      (u) =>
        (u.nama.toLowerCase().trim() === namaGuru.toLowerCase().trim() && u.role === selectedRole) ||
        u.nama.toLowerCase().trim() === namaGuru.toLowerCase().trim() ||
        (u.id === selectedUserId && u.role === selectedRole)
    );

    if (matchedUser) {
      if (matchedUser.password !== password) {
        setErrorMessage('Kata sandi salah. Silakan periksa kembali kata sandi Anda.');
        return;
      }

      // Successful login
      const mapelObj = kurikulum.find((m) => m.kodeMapel === (matchedUser.kodeMapel || kodeMapel));
      onLoginSuccess({
        isLoggedIn: true,
        userId: matchedUser.id,
        role: selectedRole,
        namaUser: namaGuru.trim() || matchedUser.nama,
        kelasAjar: selectedRole === 'wali_kelas' ? kelasWali : undefined,
        kodeMapelAjar: selectedRole === 'guru_mapel' ? (matchedUser.kodeMapel || kodeMapel) : undefined,
        namaMapelAjar: selectedRole === 'guru_mapel' ? (matchedUser.namaMapel || mapelObj?.namaMapel) : undefined,
      });
      return;
    }

    // If new / custom name entered
    const mapelObj = kurikulum.find((m) => m.kodeMapel === kodeMapel);
    onLoginSuccess({
      isLoggedIn: true,
      userId: `user-${Date.now()}`,
      role: selectedRole,
      namaUser: namaGuru,
      kelasAjar: selectedRole === 'wali_kelas' ? kelasWali : undefined,
      kodeMapelAjar: selectedRole === 'guru_mapel' ? kodeMapel : undefined,
      namaMapelAjar: selectedRole === 'guru_mapel' ? mapelObj?.namaMapel : undefined,
    });
  };

  // Quick Demo Login helper
  const handleQuickLogin = (role: UserRole, presetKelas?: TingkatKelasSD) => {
    if (role === 'admin') {
      onLoginSuccess({
        isLoggedIn: true,
        userId: 'user-admin',
        role: 'admin',
        namaUser: 'Dian Natalia Widiasih, S.Psi',
      });
    } else if (role === 'wali_kelas') {
      const targetKelas = presetKelas || 'V';
      const waliAccount = users.find(
        (u) => u.role === 'wali_kelas' && normalizeKelasCode(u.kelasAjar || 'V') === targetKelas
      );
      const waliProfil = getWaliKelasForSiswa(sekolah, targetKelas);
      onLoginSuccess({
        isLoggedIn: true,
        userId: waliAccount?.id || `user-wali-${targetKelas}`,
        role: 'wali_kelas',
        namaUser: waliAccount?.nama || waliProfil.nama || 'Petrus Apriprasetyo, S.Pd',
        kelasAjar: targetKelas,
      });
    } else {
      onLoginSuccess({
        isLoggedIn: true,
        userId: 'user-pjok',
        role: 'guru_mapel',
        namaUser: 'Wahyu Hidayat, S.Pd',
        kodeMapelAjar: 'PJOK-07',
        namaMapelAjar: 'Pendidikan Jasmani dan Olahraga',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background glow decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 text-center border-b border-slate-800/80">
          <div className="w-20 h-20 mx-auto mb-4 p-2 bg-white/10 rounded-2xl shadow-inner border border-white/20 flex items-center justify-center backdrop-blur-xs">
            <img
              src="/assets/aistudio/image_b00cfbb0.png"
              alt="Logo Tut Wuri Handayani"
              className="w-16 h-16 object-contain drop-shadow"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            E-RAPOR KURIKULUM DEEP LEARNING
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-indigo-300 mt-1 uppercase tracking-wider">
            {sekolah.namaSekolah}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-bold text-indigo-200 mt-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Kokurikuler 8 Dimensi Profil Lulusan • TA {sekolah.tahunPelajaran}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Status Sinkronisasi Otomatis dari Server Google Sheets */}
          {serverSyncStatus && (
            <div
              className={`mb-4 px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-semibold ${
                serverSyncStatus.type === 'loading'
                  ? 'bg-sky-500/10 border-sky-400/30 text-sky-200'
                  : serverSyncStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                  : serverSyncStatus.type === 'info'
                  ? 'bg-amber-500/10 border-amber-400/30 text-amber-200'
                  : 'bg-rose-500/10 border-rose-400/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {serverSyncStatus.type === 'loading' && (
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
                )}
                {serverSyncStatus.type === 'success' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
                {(serverSyncStatus.type === 'info' || serverSyncStatus.type === 'error') && (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span>{serverSyncStatus.message}</span>
              </div>
              {onRefreshFromSheets && serverSyncStatus.type !== 'loading' && (
                <button
                  type="button"
                  onClick={onRefreshFromSheets}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold shrink-0 transition"
                >
                  Muat Ulang
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Masuk Sebagai (Pilihan Peran) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Masuk Sebagai:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleChangeRole('wali_kelas')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedRole === 'wali_kelas'
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className={`w-5 h-5 ${selectedRole === 'wali_kelas' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold leading-tight">Wali Kelas</span>
                  <span className="text-[10px] text-slate-400">Akses Penuh</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeRole('guru_mapel')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedRole === 'guru_mapel'
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className={`w-5 h-5 ${selectedRole === 'guru_mapel' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold leading-tight">Guru Mapel</span>
                  <span className="text-[10px] text-slate-400">Mapel Khusus</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeRole('admin')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className={`w-5 h-5 ${selectedRole === 'admin' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold leading-tight">Admin</span>
                  <span className="text-[10px] text-slate-400">Kelola Akun</span>
                </button>
              </div>
            </div>

            {/* 2. Nama Guru */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Nama Guru:
                </label>
                <span className="text-[11px] text-slate-400">Pilih dari akun aktif</span>
              </div>
              
              <div className="relative">
                <select
                  value={selectedUserId}
                  onChange={(e) => handleSelectPresetUser(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <optgroup label="Akun Administrator:">
                    {users
                      .filter((u) => u.role === 'admin')
                      .map((u) => (
                        <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                          🛡️ {u.nama} (Administrator)
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Akun Wali Kelas:">
                    {users
                      .filter((u) => u.role === 'wali_kelas')
                      .map((u) => (
                        <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                          👨‍🏫 {u.nama} (Wali Kelas {u.kelasAjar || 'V'} • {getFaseFromKelas(u.kelasAjar || 'V')})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Akun Guru Mata Pelajaran:">
                    {users
                      .filter((u) => u.role === 'guru_mapel')
                      .map((u) => (
                        <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                          📚 {u.nama} ({u.namaMapel || u.kodeMapel})
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Editable Name Field */}
              <input
                type="text"
                value={namaGuru}
                onChange={(e) => {
                  setHasEditedCredentials(true);
                  setNamaGuru(e.target.value);
                }}
                placeholder="Contoh: Petrus Apriprasetyo, S.Pd"
                className="mt-2 w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 3. Tingkat Kelas (Khusus Wali Kelas) */}
            {selectedRole === 'wali_kelas' && (
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-indigo-200">
                  3. Kelas yang Diampu (Wali Kelas Tingkat I–VI):
                </label>
                <select
                  value={kelasWali}
                  onChange={(e) => handleSelectKelasWali(e.target.value as TingkatKelasSD)}
                  className="w-full bg-slate-900 border border-indigo-500/40 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {TINGKAT_KELAS_SD.map((t) => (
                    <option key={t.kode} value={t.kode}>
                      {t.label} — {t.fase}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Akses otomatis diarahkan dan dikunci khusus ke Data Siswa &amp; Rapor Kelas {kelasWali} ({getFaseFromKelas(kelasWali)}).
                </p>
              </div>
            )}

            {/* 3. Mata Pelajaran yang Diajar (Khusus Guru Mapel) */}
            {selectedRole === 'guru_mapel' && (
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold text-indigo-200">
                  3. Mata Pelajaran yang Diampu:
                </label>
                <select
                  value={kodeMapel}
                  onChange={(e) => setKodeMapel(e.target.value)}
                  className="w-full bg-slate-900 border border-indigo-500/40 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {kurikulum.map((m) => (
                    <option key={m.kodeMapel} value={m.kodeMapel}>
                      {m.kodeMapel} - {m.namaMapel} ({m.kelompok})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Guru mapel hanya dapat mengedit mata pelajaran ini untuk seluruh kelas (Kelas 1 s.d. 6).
                </p>
              </div>
            )}

            {/* 4. Password / Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  {selectedRole === 'guru_mapel' || selectedRole === 'wali_kelas' ? '4.' : '3.'} Password:
                </label>
                <span className="text-[11px] text-slate-400">
                  Default:{' '}
                  <code className="text-indigo-400 font-mono">
                    {selectedRole === 'admin'
                      ? 'admin123'
                      : selectedRole === 'wali_kelas'
                      ? 'wali123'
                      : 'guru123'}
                  </code>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setHasEditedCredentials(true);
                    setPassword(e.target.value);
                  }}
                  placeholder="Masukkan kata sandi..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Aplikasi Rapor</span>
            </button>
          </form>

          {/* Quick Demo Login Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Akses Cepat (Demo Langsung 1-Klik):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('wali_kelas', 'I')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition"
              >
                👨‍🏫 Wali Kelas 1
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('wali_kelas', 'V')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition"
              >
                👨‍🏫 Wali Kelas 5
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('guru_mapel')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition"
              >
                📚 Guru PJOK
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 p-3.5 text-center border-t border-slate-800 text-[11px] text-slate-500">
          Sistem Informasi Pendidikan • Terintegrasi Google Sheets Database & Cloudflare
        </div>
      </div>
    </div>
  );
};
