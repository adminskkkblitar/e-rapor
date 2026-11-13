import React, { useState } from 'react';
import { MasterKurikulumMapel, TingkatKelasSD, UserAccount, UserRole, UserSession } from '../types/rapor';
import { TINGKAT_KELAS_SD, getFaseFromKelas, normalizeKelasCode } from '../utils/raporCalculations';
import {
  BookOpen,
  Check,
  Edit2,
  KeyRound,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface AdminUserManagerProps {
  users: UserAccount[];
  kurikulum: MasterKurikulumMapel[];
  currentSession: UserSession;
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchSession: (session: UserSession) => void;
}

export const AdminUserManager: React.FC<AdminUserManagerProps> = ({
  users,
  kurikulum,
  currentSession,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSwitchSession,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<UserAccount>>({
    nama: '',
    nip: '-',
    role: 'guru_mapel',
    kelasAjar: 'V',
    kodeMapel: 'PAK-01',
    password: 'guru123',
    email: '',
  });

  // Password visibility map
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchQuery =
      u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.namaMapel && u.namaMapel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.nip && u.nip.includes(searchQuery));
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchQuery && matchRole;
  });

  const handleOpenAddModal = () => {
    setFormData({
      nama: '',
      nip: '-',
      role: 'guru_mapel',
      kelasAjar: 'V',
      kodeMapel: kurikulum[0]?.kodeMapel || 'PAK-01',
      password: 'guru123',
      email: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({ ...user, kelasAjar: user.kelasAjar || 'V' });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama?.trim()) return;

    const mapelObj = kurikulum.find((m) => m.kodeMapel === formData.kodeMapel);
    const resolvedRole = formData.role || 'guru_mapel';
    const resolvedKelas =
      resolvedRole === 'wali_kelas' ? normalizeKelasCode(formData.kelasAjar || 'V') : undefined;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        nama: formData.nama.trim(),
        nip: formData.nip || '-',
        role: resolvedRole,
        kelasAjar: resolvedKelas,
        kodeMapel: resolvedRole === 'guru_mapel' ? formData.kodeMapel : undefined,
        namaMapel: resolvedRole === 'guru_mapel' ? mapelObj?.namaMapel : undefined,
        password: formData.password || 'guru123',
        email: formData.email || '',
      });
      setEditingUser(null);
    } else {
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        nama: formData.nama.trim(),
        nip: formData.nip || '-',
        role: resolvedRole,
        kelasAjar: resolvedKelas,
        kodeMapel: resolvedRole === 'guru_mapel' ? formData.kodeMapel : undefined,
        namaMapel: resolvedRole === 'guru_mapel' ? mapelObj?.namaMapel : undefined,
        password: formData.password || 'guru123',
        email: formData.email || '',
      };
      onAddUser(newUser);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel Khusus Administrator & Manajemen Guru
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Kelola Data Guru, Hak Akses & Password Masuk
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Administrator bertindak untuk menginputkan data guru baru, menentukan tugas (Wali Kelas / Guru Mapel tertentu), serta mereset atau mengatur password akun aplikasi rapor.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="self-start md:self-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Guru / Akun Baru</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Filter Peran:
          </span>
          <button
            type="button"
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterRole === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Admin ({users.filter((u) => u.role === 'admin').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('wali_kelas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterRole === 'wali_kelas'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Wali Kelas ({users.filter((u) => u.role === 'wali_kelas').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('guru_mapel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterRole === 'guru_mapel'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Guru Mapel ({users.filter((u) => u.role === 'guru_mapel').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari guru atau mapel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-[11px] border-b border-slate-300">
              <tr>
                <th className="py-3 px-3 text-center w-12 border-r border-slate-200">No</th>
                <th className="py-3 px-4 border-r border-slate-200">Nama Lengkap & NIP</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Peran / Hak Akses</th>
                <th className="py-3 px-4 border-r border-slate-200">Mata Pelajaran yang Diampu</th>
                <th className="py-3 px-3 border-r border-slate-200">Password Masuk</th>
                <th className="py-3 px-4 text-center">Aksi / Kontrol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => {
                  const isCurrent = user.id === currentSession.userId;
                  const isVisible = showPasswordMap[user.id];

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isCurrent ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-medium text-slate-500 border-r border-slate-200">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              user.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800'
                                : user.role === 'wali_kelas'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {user.nama.slice(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {user.nama}
                              {isCurrent && (
                                <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              NIP: {user.nip && user.nip !== '-' ? user.nip : '-'}
                              {user.email ? ` • ${user.email}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            user.role === 'admin'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : user.role === 'wali_kelas'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'wali_kelas' && <UserCheck className="w-3 h-3" />}
                          {user.role === 'guru_mapel' && <BookOpen className="w-3 h-3" />}
                          {user.role === 'admin'
                            ? 'Administrator'
                            : user.role === 'wali_kelas'
                            ? 'Wali Kelas'
                            : 'Guru Mapel'}
                        </span>
                      </td>

                      <td className="py-3 px-4 border-r border-slate-200">
                        {user.role === 'guru_mapel' ? (
                          <div>
                            <span className="font-bold text-indigo-900 block">
                              {user.namaMapel || user.kodeMapel || '-'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Kode: {user.kodeMapel || '-'}
                            </span>
                          </div>
                        ) : user.role === 'wali_kelas' ? (
                          <span className="text-emerald-700 font-semibold text-xs">
                            Wali Kelas {user.kelasAjar || 'V'} ({getFaseFromKelas(user.kelasAjar || 'V')}) — Seluruh Mapel
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium italic text-xs">
                            Akses Pengaturan &amp; Database
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 border border-slate-200 px-2 py-1 rounded font-mono text-xs text-slate-800">
                            {isVisible ? user.password : '••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition"
                            title={isVisible ? 'Sembunyikan Password' : 'Lihat Password'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Edit Data Guru & Password"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onSwitchSession({
                                isLoggedIn: true,
                                userId: user.id,
                                role: user.role,
                                namaUser: user.nama,
                                kelasAjar:
                                  user.role === 'wali_kelas'
                                    ? normalizeKelasCode(user.kelasAjar || 'V')
                                    : undefined,
                                kodeMapelAjar: user.kodeMapel,
                                namaMapelAjar: user.namaMapel,
                              });
                            }}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold transition"
                            title="Coba Masuk Sebagai Akun Ini"
                          >
                            Uji Masuk
                          </button>

                          {users.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus akun ${user.nama}?`)) {
                                  onDeleteUser(user.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Hapus Akun Guru Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    Tidak ditemukan data guru sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TAMBAH / EDIT GURU */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingUser ? 'Edit Data Guru & Akun' : 'Tambah Guru & Akun Masuk Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Konfigurasi nama, peran, mata pelajaran dan password
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Guru & Gelar: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Petrus Apriprasetyo, S.Pd"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP / NUPTK:</label>
                  <input
                    type="text"
                    value={formData.nip || '-'}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peran Masuk:</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRole })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="wali_kelas">Wali Kelas (Akses Lengkap)</option>
                    <option value="guru_mapel">Guru Mapel (Mapel Khusus)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {formData.role === 'wali_kelas' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tingkat Kelas yang Diampu (Wali Kelas):
                  </label>
                  <select
                    value={normalizeKelasCode(formData.kelasAjar || 'V')}
                    onChange={(e) =>
                      setFormData({ ...formData, kelasAjar: e.target.value as TingkatKelasSD })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                  >
                    {TINGKAT_KELAS_SD.map((t) => (
                      <option key={t.kode} value={t.kode}>
                        {t.label} — {t.fase}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.role === 'guru_mapel' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mata Pelajaran yang Diampu:
                  </label>
                  <select
                    value={formData.kodeMapel}
                    onChange={(e) => setFormData({ ...formData, kodeMapel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                  >
                    {kurikulum.map((m) => (
                      <option key={m.kodeMapel} value={m.kodeMapel}>
                        {m.kodeMapel} - {m.namaMapel} ({m.kelompok})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Masuk Aplikasi: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contoh: guru123"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Guru akan menggunakan kata sandi ini saat masuk di layar gerbang aplikasi.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Akun (Opsional / Akun Belajar.id):
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contoh@guru.sd.belajar.id"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'Perbarui Akun' : 'Simpan Akun Guru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
