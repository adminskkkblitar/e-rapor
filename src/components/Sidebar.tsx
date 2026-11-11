import React, { useState } from 'react';
import { DataSiswa, ProfilSekolah, UserSession } from '../types/rapor';
import {
  Award,
  BookOpen,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Compass,
  Database,
  FileCheck,
  GraduationCap,
  Home,
  Layers,
  LogOut,
  Menu,
  Pin,
  PinOff,
  Printer,
  School,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'preview'
  | 'nilai'
  | 'kokurikuler'
  | 'leger'
  | 'kurikulum'
  | 'siswa'
  | 'guru_manager';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  sekolah: ProfilSekolah;
  siswaList: DataSiswa[];
  selectedNis: string;
  onSelectNis: (nis: string) => void;
  semester: 1 | 2;
  onToggleSemester: (sem: 1 | 2) => void;
  userSession: UserSession;
  onLogout: () => void;
  onOpenGasModal: () => void;
  onOpenAbsensiModal: () => void;
  onOpenSettingsModal: () => void;
  onPrint: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  sekolah,
  siswaList,
  selectedNis,
  onSelectNis,
  semester,
  onToggleSemester,
  userSession,
  onLogout,
  onOpenGasModal,
  onOpenAbsensiModal,
  onOpenSettingsModal,
  onPrint,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isGuruMapel = userSession.role === 'guru_mapel';
  const isAdmin = userSession.role === 'admin';

  // State to toggle between expanded pinned (w-64/w-72) and compact pinned (w-20) on Tablet & PC
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const menuItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard Utama',
      icon: Home,
      badge: undefined,
    },
    {
      id: 'preview' as TabType,
      label: 'Pratinjau & Cetak Rapor',
      icon: FileCheck,
      badge: 'Cetak',
    },
    {
      id: 'nilai' as TabType,
      label: 'Input Nilai 25 TP',
      icon: Layers,
      badge: isGuruMapel ? userSession.kodeMapelAjar : undefined,
    },
    {
      id: 'kokurikuler' as TabType,
      label: '8 Dimensi & Ekstra',
      icon: Compass,
      badge: undefined,
    },
    {
      id: 'leger' as TabType,
      label: 'Leger & Peringkat',
      icon: Award,
      badge: undefined,
    },
    {
      id: 'siswa' as TabType,
      label: 'Data Siswa Lengkap',
      icon: Users,
      badge: `${siswaList.length}`,
    },
    {
      id: 'kurikulum' as TabType,
      label: 'Master Kurikulum',
      icon: BookOpen,
      badge: undefined,
    },
    {
      id: 'guru_manager' as TabType,
      label: 'Kelola Akun Guru',
      icon: ShieldCheck,
      badge: isAdmin ? 'Admin' : undefined,
      highlight: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop (< 768px) */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden no-print"
        />
      )}

      {/* Pinned Left Sidebar Container (Permanently Pinned on Tablet & PC via md:static md:translate-x-0 md:h-screen md:shrink-0) */}
      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-50 bg-slate-900 border-r border-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out md:static md:translate-x-0 md:h-screen md:shrink-0 ${
          isCollapsed ? 'w-20' : 'w-72 md:w-64 lg:w-72'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Header / School Branding & Pin Toggle Button */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-indigo-400/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-extrabold text-sm tracking-tight text-white truncate flex items-center gap-1.5">
                  E-Rapor Deep Learning
                </h1>
                <p className="text-[11px] text-slate-400 truncate">
                  {sekolah.namaSekolah}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Pin / Collapse Toggle for Tablet and PC */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title={isCollapsed ? 'Perlebar Sidebar (Pinned Penuh)' : 'Ciutkan Sidebar (Pinned Ringkas)'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-400 hover:text-white" />
              )}
            </button>

            {/* Close button for mobile drawer */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-800"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Semester & Student Quick Switcher (Hidden in collapsed mode to save vertical height) */}
        {!isCollapsed ? (
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 space-y-2.5">
            {/* Semester Selector */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1 px-1">
                <span>SEMESTER:</span>
                <span className="text-indigo-400">TA {sekolah.tahunPelajaran}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onToggleSemester(1)}
                  className={`py-1.5 px-2 rounded-lg text-center transition ${
                    semester === 1
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sem 1 (Ganjil)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSemester(2)}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    semester === 2
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Sem 2</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </button>
              </div>
            </div>

            {/* Quick Active Student */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1 px-1">
                <span>SISWA TERPILIH:</span>
                <span className="text-[10px] text-slate-500">{siswaList.length} Siswa</span>
              </div>
              <select
                value={selectedNis}
                onChange={(e) => onSelectNis(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer truncate"
              >
                {siswaList.map((s) => (
                  <option key={s.nis} value={s.nis} className="bg-slate-900 text-white">
                    {s.nama} ({s.nisn || s.nis})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Compact Indicator in Collapsed Mode */
          <div className="py-2.5 px-2 bg-slate-950/60 border-b border-slate-800 text-center">
            <button
              type="button"
              onClick={() => onToggleSemester(semester === 1 ? 2 : 1)}
              className="w-full py-1 rounded bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-bold text-indigo-300"
              title={`Semester ${semester} aktif. Klik untuk ganti.`}
            >
              S{semester}
            </button>
          </div>
        )}

        {/* Navigation Menu List (Vertically scrollable if screen height is constrained) */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Menu Utama
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } rounded-xl text-xs font-bold transition cursor-pointer group relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-indigo-700 text-indigo-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed active dot */}
                {isCollapsed && isActive && (
                  <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
              </button>
            );
          })}

          {/* Quick Integrations Section */}
          <div className="pt-3 pb-1">
            {!isCollapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Integrasi & Utilitas
              </div>
            )}

            <button
              type="button"
              onClick={onOpenAbsensiModal}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition`}
              title="Rekap Absensi (Sheets)"
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <CalendarCheck className="w-4 h-4 text-indigo-400" />
                {!isCollapsed && <span>Rekap Absensi (Sheets)</span>}
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenGasModal}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition`}
              title="Struktur Sheets & GAS"
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Database className="w-4 h-4 text-emerald-400" />
                {!isCollapsed && <span>Struktur Sheets & GAS</span>}
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenSettingsModal}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition`}
              title="Profil & Titimangsa"
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Settings className="w-4 h-4 text-amber-400" />
                {!isCollapsed && <span>Profil & Titimangsa</span>}
              </div>
            </button>
          </div>
        </div>

        {/* Print Quick Button in Sidebar */}
        <div className="px-2.5 py-2">
          <button
            type="button"
            onClick={onPrint}
            className={`w-full py-2 ${
              isCollapsed ? 'px-2 justify-center' : 'px-3 justify-center'
            } bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition`}
            title="Cetak Dokumen A4"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            {!isCollapsed && <span>Cetak Dokumen (A4)</span>}
          </button>
        </div>

        {/* User Profile & Logout Bottom Card */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-950/80">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between gap-2'
            } p-2 rounded-xl bg-slate-900 border border-slate-800`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                  userSession.role === 'admin'
                    ? 'bg-emerald-600 text-white'
                    : userSession.role === 'wali_kelas'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
                title={`${userSession.namaUser} (${userSession.role})`}
              >
                {userSession.role === 'admin' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : userSession.role === 'wali_kelas' ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="block text-xs font-bold text-white truncate">
                    {userSession.namaUser}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {userSession.role === 'admin'
                      ? 'Administrator'
                      : userSession.role === 'wali_kelas'
                      ? 'Wali Kelas V'
                      : userSession.namaMapelAjar || userSession.kodeMapelAjar || 'Guru Mapel'}
                  </span>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-lg transition shrink-0"
              title="Keluar / Ganti Akun Guru"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
