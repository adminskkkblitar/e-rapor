import React, { useMemo, useState } from 'react';
import {
  AbsensiSiswa,
  DataSiswa,
  EkstrakurikulerSiswa,
  ItemEkstrakurikuler,
  ItemKokurikuler8Dimensi,
  KokurikulerSiswa,
  MasterKurikulumMapel,
  NilaiFormatifSiswa,
  NilaiSumatifSiswa,
  PredikatKokurikuler,
  ProfilSekolah,
  RaporMapelKalkulasi,
  UserAccount,
  UserRole,
  UserSession,
} from './types/rapor';
import {
  INITIAL_ABSENSI,
  INITIAL_KURIKULUM,
  INITIAL_PROFIL_SEKOLAH,
  INITIAL_SISWA,
  INITIAL_USERS,
  getInitialEkstrakurikuler,
  getInitialKokurikuler,
  getInitialNilaiFormatif,
  getInitialNilaiSumatif,
} from './data/initialData';
import {
  DIMENSI_8_PROFIL_LULUSAN,
  generateAutoDeskripsiMapel,
  hitungNilaiAkhir,
  hitungRataFormatif,
  hitungRataSumatif,
  kalkulasiPeringkatTerselubung,
} from './utils/raporCalculations';
import { DashboardOverview } from './components/DashboardOverview';
import { PrintCover } from './components/PrintCover';
import { PrintRaporInti } from './components/PrintRaporInti';
import { NilaiEditor } from './components/NilaiEditor';
import { KokurikulerEditor } from './components/KokurikulerEditor';
import { LegerRowData, LegerTable } from './components/LegerTable';
import { MasterKurikulumView } from './components/MasterKurikulumView';
import { GasIntegrationModal } from './components/GasIntegrationModal';
import { DataSiswaManager } from './components/DataSiswaManager';
import { AbsensiIntegrationModal } from './components/AbsensiIntegrationModal';
import { RoleLoginModal } from './components/RoleLoginModal';
import { LoginPage } from './components/LoginPage';
import { AdminUserManager } from './components/AdminUserManager';
import { Sidebar, TabType } from './components/Sidebar';
import {
  Calendar,
  FileText,
  Menu,
  Printer,
  School,
  Sparkles,
  Users,
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [sekolah, setSekolah] = useState<ProfilSekolah>(INITIAL_PROFIL_SEKOLAH);
  const [siswaList, setSiswaList] = useState<DataSiswa[]>(INITIAL_SISWA);
  const [selectedNis, setSelectedNis] = useState<string>(INITIAL_SISWA[0].nis);
  const [semester, setSemester] = useState<1 | 2>(2); // Default Semester 2 (Genap)
  const [kurikulum, setKurikulum] = useState<MasterKurikulumMapel[]>(INITIAL_KURIKULUM);
  const [nilaiFormatif, setNilaiFormatif] = useState<NilaiFormatifSiswa[]>(getInitialNilaiFormatif);
  const [nilaiSumatif, setNilaiSumatif] = useState<NilaiSumatifSiswa[]>(getInitialNilaiSumatif);
  const [kokurikulerList, setKokurikulerList] = useState<KokurikulerSiswa[]>(getInitialKokurikuler);
  const [ekstrakurikulerList, setEkstrakurikulerList] = useState<EkstrakurikulerSiswa[]>(getInitialEkstrakurikuler);
  const [absensiList, setAbsensiList] = useState<AbsensiSiswa[]>(INITIAL_ABSENSI);

  // User Accounts State (Managed by Admin)
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(INITIAL_USERS);

  // Authentication & Gate State
  const [userSession, setUserSession] = useState<UserSession>({
    isLoggedIn: false, // Default false: Shows Login Gate first
    userId: 'user-wali',
    role: 'wali_kelas',
    namaUser: 'Petrus Apriprasetyo, S.Pd',
  });

  // Hybrid Catatan Wali Kelas State per student NIS
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({
    '230101': '', // ADRY GRACIO SURYAJAYA -> Auto-generate Top 10%
    '230102': 'Ananda Clara memiliki kepemimpinan yang baik dan selalu tekun dalam tugas kelompok.',
    '230105': '', // Michael -> Auto-generate Bottom 30%
  });

  // Status Kenaikan State per student NIS (Semester 2)
  const [statusKenaikanMap, setStatusKenaikanMap] = useState<
    Record<string, { status: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan'; targetKelas: string }>
  >({
    '230101': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
    '230102': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
    '230103': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
    '230104': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
    '230105': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
    '230106': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [printSubTab, setPrintSubTab] = useState<'inti' | 'cover'>('inti');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Modals
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAbsensiModalOpen, setIsAbsensiModalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Active Student
  const activeSiswa = useMemo(() => {
    return siswaList.find((s) => s.nis === selectedNis) || siswaList[0];
  }, [siswaList, selectedNis]);

  // Calculations for all students to compute hidden ranking and complete subject breakdown
  const studentAverages = useMemo(() => {
    return siswaList.map((siswa) => {
      let totalAkhir = 0;
      let countMapel = 0;
      const nilaiPerMapel: Record<string, number> = {};

      kurikulum.forEach((mapel) => {
        const form = nilaiFormatif.find((f) => f.nis === siswa.nis && f.kodeMapel === mapel.kodeMapel);
        const sum = nilaiSumatif.find((s) => s.nis === siswa.nis && s.kodeMapel === mapel.kodeMapel);

        const rForm = form ? hitungRataFormatif(form.nilaiTp) : 0;
        const rSum = sum ? hitungRataSumatif(sum.sumatifLm, sum.sts, sum.sas) : 0;
        const na = hitungNilaiAkhir(rForm, rSum);

        nilaiPerMapel[mapel.kodeMapel] = na;

        if (na > 0) {
          totalAkhir += na;
          countMapel++;
        }
      });

      const avg = countMapel > 0 ? Math.round((totalAkhir / countMapel) * 10) / 10 : 0;
      return {
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        nilaiPerMapel,
        totalNilai: totalAkhir,
        rataRata: avg,
      };
    });
  }, [siswaList, kurikulum, nilaiFormatif, nilaiSumatif]);

  // Hidden ranking calculation map
  const hiddenRankingMap = useMemo(() => {
    return kalkulasiPeringkatTerselubung(studentAverages);
  }, [studentAverages]);

  // Calculated Mapel values for the currently selected student
  const calculatedMapelsForActiveSiswa: RaporMapelKalkulasi[] = useMemo(() => {
    return kurikulum.map((mapel) => {
      const form = nilaiFormatif.find((f) => f.nis === selectedNis && f.kodeMapel === mapel.kodeMapel);
      const sum = nilaiSumatif.find((s) => s.nis === selectedNis && s.kodeMapel === mapel.kodeMapel);

      const tpScores = form ? form.nilaiTp : new Array(25).fill(0);
      const sumLm = sum ? sum.sumatifLm : [0, 0, 0, 0];
      const sts = sum ? sum.sts : 0;
      const sas = sum ? sum.sas : 0;

      const rForm = hitungRataFormatif(tpScores);
      const rSum = hitungRataSumatif(sumLm, sts, sas);
      const na = hitungNilaiAkhir(rForm, rSum);
      const nickname = activeSiswa?.namaPanggilan || activeSiswa?.nama.split(' ')[0] || '';
      const autoDesc = generateAutoDeskripsiMapel(tpScores, mapel.tpNarasi, mapel.namaMapel, nickname);

      return {
        kodeMapel: mapel.kodeMapel,
        namaMapel: mapel.namaMapel,
        kelompok: mapel.kelompok,
        rataFormatif: rForm,
        rataSumatif: rSum,
        nilaiAkhir: na,
        deskripsiCapaian: autoDesc.deskripsi,
        deskripsiMax: autoDesc.deskripsiMax,
        deskripsiMin: autoDesc.deskripsiMin,
        maxTpIndex: autoDesc.maxIndex,
        maxTpNilai: autoDesc.maxNilai,
        minTpIndex: autoDesc.minIndex,
        minTpNilai: autoDesc.minNilai,
      };
    });
  }, [kurikulum, nilaiFormatif, nilaiSumatif, selectedNis, activeSiswa]);

  // Current Kokurikuler, Ekstra, and Absensi for Active Student
  const currentKokurikuler = useMemo(() => {
    return kokurikulerList.find((k) => k.nis === selectedNis);
  }, [kokurikulerList, selectedNis]);

  const currentEkstrakurikuler = useMemo(() => {
    return ekstrakurikulerList.find((e) => e.nis === selectedNis);
  }, [ekstrakurikulerList, selectedNis]);

  const currentAbsensi = useMemo(() => {
    return absensiList.find((a) => a.nis === selectedNis);
  }, [absensiList, selectedNis]);

  // Active student ranking info
  const activeRankingInfo = hiddenRankingMap.get(selectedNis) || {
    ranking: 1,
    totalSiswa: siswaList.length,
    persentil: 'Top 10%' as const,
  };

  const activeStatusKenaikan = statusKenaikanMap[selectedNis] || {
    status: 'Naik Kelas',
    targetKelas: 'Kelas VI (Enam)',
  };

  // Leger Rows
  const legerRows: LegerRowData[] = useMemo(() => {
    return studentAverages.map((s) => {
      const rankInfo = hiddenRankingMap.get(s.nis) || {
        ranking: 1,
        totalSiswa: studentAverages.length,
        persentil: 'Middle 60%' as const,
      };
      const statusInfo = statusKenaikanMap[s.nis] || {
        status: 'Naik Kelas',
        targetKelas: 'Kelas VI (Enam)',
      };
      return {
        nis: s.nis,
        nama: s.nama,
        kelas: s.kelas,
        nilaiPerMapel: s.nilaiPerMapel,
        totalNilai: s.totalNilai,
        rataRata: s.rataRata,
        ranking: rankInfo.ranking,
        persentil: rankInfo.persentil,
        customCatatan: customNotes[s.nis] || '',
        statusKenaikan: statusInfo.status,
        targetKelas: statusInfo.targetKelas,
      };
    });
  }, [studentAverages, hiddenRankingMap, statusKenaikanMap, customNotes]);

  // Handlers for updates
  const handleUpdateFormatif = (
    nis: string,
    kodeMapel: string,
    tpIndex: number,
    value: number
  ) => {
    setNilaiFormatif((prev) => {
      const idx = prev.findIndex((item) => item.nis === nis && item.kodeMapel === kodeMapel);
      if (idx >= 0) {
        const copy = [...prev];
        const newTp = [...copy[idx].nilaiTp];
        newTp[tpIndex] = value;
        copy[idx] = { ...copy[idx], nilaiTp: newTp };
        return copy;
      }
      const newTp = new Array(25).fill(0);
      newTp[tpIndex] = value;
      return [...prev, { nis, kodeMapel, nilaiTp: newTp }];
    });
  };

  const handleUpdateSumatif = (
    nis: string,
    kodeMapel: string,
    field: 'lm1' | 'lm2' | 'lm3' | 'lm4' | 'sts' | 'sas',
    value: number
  ) => {
    setNilaiSumatif((prev) => {
      const idx = prev.findIndex((item) => item.nis === nis && item.kodeMapel === kodeMapel);
      if (idx >= 0) {
        const copy = [...prev];
        const item = { ...copy[idx] };
        if (field.startsWith('lm')) {
          const lmIdx = parseInt(field.replace('lm', ''), 10) - 1;
          const newLm = [...item.sumatifLm];
          newLm[lmIdx] = value;
          item.sumatifLm = newLm;
        } else if (field === 'sts') {
          item.sts = value;
        } else if (field === 'sas') {
          item.sas = value;
        }
        copy[idx] = item;
        return copy;
      }
      const sumLm = [0, 0, 0, 0];
      let sts = 0;
      let sas = 0;
      if (field.startsWith('lm')) {
        const lmIdx = parseInt(field.replace('lm', ''), 10) - 1;
        sumLm[lmIdx] = value;
      } else if (field === 'sts') sts = value;
      else if (field === 'sas') sas = value;

      return [...prev, { nis, kodeMapel, sumatifLm: sumLm, sts, sas }];
    });
  };

  const handleUpdateDimensi = (
    nis: string,
    kodeDimensi: string,
    predikat: PredikatKokurikuler,
    catatan: string
  ) => {
    setKokurikulerList((prev) => {
      const idx = prev.findIndex((k) => k.nis === nis);
      if (idx >= 0) {
        const copy = [...prev];
        const studentKoku = { ...copy[idx] };
        studentKoku.dimensi = studentKoku.dimensi.map((d) =>
          d.kode === kodeDimensi ? { ...d, predikat, catatanPerkembangan: catatan } : d
        );
        copy[idx] = studentKoku;
        return copy;
      }
      return prev;
    });
  };

  const handleUpdateStudentDimensiList = (
    nis: string,
    dimensi: ItemKokurikuler8Dimensi[]
  ) => {
    setKokurikulerList((prev) => {
      const idx = prev.findIndex((k) => k.nis === nis);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], dimensi };
        return copy;
      }
      return [...prev, { nis, semester, dimensi }];
    });
  };

  const handleApplyDimensiToAll = (templateDimensi: ItemKokurikuler8Dimensi[]) => {
    setKokurikulerList((prev) =>
      siswaList.map((siswa) => {
        const existing = prev.find((k) => k.nis === siswa.nis);
        const newDimensi = templateDimensi.map((tmpl) => {
          const match = existing?.dimensi.find((d) => d.kode === tmpl.kode);
          return {
            ...tmpl,
            id: `koku-${siswa.nis}-${tmpl.kode}-${Date.now()}`,
            predikat: match ? match.predikat : tmpl.predikat,
            catatanPerkembangan: match ? match.catatanPerkembangan : tmpl.catatanPerkembangan,
          };
        });
        return {
          nis: siswa.nis,
          semester,
          dimensi: newDimensi,
        };
      })
    );
  };

  const handleUpdateEkstrakurikuler = (nis: string, daftarEkstra: ItemEkstrakurikuler[]) => {
    setEkstrakurikulerList((prev) => {
      const idx = prev.findIndex((e) => e.nis === nis);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], daftarEkstra };
        return copy;
      }
      return [...prev, { nis, semester, daftarEkstra }];
    });
  };

  const handleUpdateAbsensi = (
    nis: string,
    field: 'sakit' | 'izin' | 'tanpaKeterangan',
    val: number
  ) => {
    setAbsensiList((prev) => {
      const idx = prev.findIndex((a) => a.nis === nis);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [field]: val };
        return copy;
      }
      return [...prev, { nis, semester, sakit: 0, izin: 0, tanpaKeterangan: 0, [field]: val }];
    });
  };

  const handleUpdateCustomCatatan = (nis: string, text: string) => {
    setCustomNotes((prev) => ({ ...prev, [nis]: text }));
  };

  const handleUpdateStatusKenaikan = (
    nis: string,
    status: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan',
    targetKelas?: string
  ) => {
    setStatusKenaikanMap((prev) => ({
      ...prev,
      [nis]: { status, targetKelas: targetKelas || 'Kelas VI (Enam)' },
    }));
  };

  const handleUpdateMapelKurikulum = (updatedMapel: MasterKurikulumMapel) => {
    setKurikulum((prev) =>
      prev.map((m) => (m.kodeMapel === updatedMapel.kodeMapel ? updatedMapel : m))
    );
  };

  const handleUpdateSiswa = (updatedSiswa: DataSiswa) => {
    setSiswaList((prev) =>
      prev.map((s) => (s.nis === updatedSiswa.nis ? updatedSiswa : s))
    );
  };

  const handleAddSiswa = (newSiswa: DataSiswa) => {
    setSiswaList((prev) => [...prev, newSiswa]);

    setAbsensiList((prev) => [
      ...prev,
      { nis: newSiswa.nis, semester, sakit: 0, izin: 0, tanpaKeterangan: 0 },
    ]);

    const defaultDimensi: ItemKokurikuler8Dimensi[] = [
      {
        id: 'D1-1',
        kode: 'D1',
        namaDimensi: 'Keimanan, Ketakwaan & Akhlak Mulia',
        kodeSubDimensi: 'D1-1',
        namaSubDimensi: 'Akhlak Pribadi',
        fokusPembelajaran:
          'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
        predikat: 'BSH',
        catatanPerkembangan:
          'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
      },
      {
        id: 'D3-1',
        kode: 'D3',
        namaDimensi: 'Penalaran Kritis & Problem Solving',
        kodeSubDimensi: 'D3-1',
        namaSubDimensi: 'Memproses Informasi & Gagasan',
        fokusPembelajaran: 'Menyampaikan argumen sederhana secara runtut disertai alasan',
        predikat: 'BSH',
        catatanPerkembangan: 'Menyampaikan argumen sederhana secara runtut disertai alasan',
      },
      {
        id: 'D6-1',
        kode: 'D6',
        namaDimensi: 'Kemandirian & Regulasi Diri',
        kodeSubDimensi: 'D6-1',
        namaSubDimensi: 'Regulasi Diri & Pembelajaran Mandiri',
        fokusPembelajaran: 'Berlatih menetapkan tujuan pembelajaran untuk dirinya',
        predikat: 'BSH',
        catatanPerkembangan: 'Berlatih menetapkan tujuan pembelajaran untuk dirinya',
      },
    ];

    setKokurikulerList((prev) => [
      ...prev,
      { nis: newSiswa.nis, semester, dimensi: defaultDimensi },
    ]);

    setStatusKenaikanMap((prev) => ({
      ...prev,
      [newSiswa.nis]: { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
    }));
  };

  const handleAddBulkSiswa = (siswaArr: DataSiswa[]) => {
    const existingNis = new Set(siswaList.map((s) => s.nis));
    const toAdd = siswaArr.filter((s) => !existingNis.has(s.nis));
    if (toAdd.length === 0) return;

    setSiswaList((prev) => [...prev, ...toAdd]);

    const newAbsensi = toAdd.map((s) => ({
      nis: s.nis,
      semester,
      sakit: 0,
      izin: 0,
      tanpaKeterangan: 0,
    }));
    setAbsensiList((prev) => [...prev, ...newAbsensi]);

    const defaultDimensi: ItemKokurikuler8Dimensi[] = [
      {
        id: 'D1-1',
        kode: 'D1',
        namaDimensi: 'Keimanan, Ketakwaan & Akhlak Mulia',
        kodeSubDimensi: 'D1-1',
        namaSubDimensi: 'Akhlak Pribadi',
        fokusPembelajaran:
          'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
        predikat: 'BSH',
        catatanPerkembangan:
          'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
      },
      {
        id: 'D3-1',
        kode: 'D3',
        namaDimensi: 'Penalaran Kritis & Problem Solving',
        kodeSubDimensi: 'D3-1',
        namaSubDimensi: 'Memproses Informasi & Gagasan',
        fokusPembelajaran: 'Menyampaikan argumen sederhana secara runtut disertai alasan',
        predikat: 'BSH',
        catatanPerkembangan: 'Menyampaikan argumen sederhana secara runtut disertai alasan',
      },
      {
        id: 'D6-1',
        kode: 'D6',
        namaDimensi: 'Kemandirian & Regulasi Diri',
        kodeSubDimensi: 'D6-1',
        namaSubDimensi: 'Regulasi Diri & Pembelajaran Mandiri',
        fokusPembelajaran: 'Berlatih menetapkan tujuan pembelajaran untuk dirinya',
        predikat: 'BSH',
        catatanPerkembangan: 'Berlatih menetapkan tujuan pembelajaran untuk dirinya',
      },
    ];

    const newKoku = toAdd.map((s) => ({
      nis: s.nis,
      semester,
      dimensi: defaultDimensi,
    }));
    setKokurikulerList((prev) => [...prev, ...newKoku]);

    const newStatus: Record<string, { status: 'Naik Kelas'; targetKelas: string }> = {};
    toAdd.forEach((s) => {
      newStatus[s.nis] = { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' };
    });
    setStatusKenaikanMap((prev) => ({ ...prev, ...newStatus }));
  };

  const handleDeleteSiswa = (nis: string) => {
    setSiswaList((prev) => {
      const filtered = prev.filter((s) => s.nis !== nis);
      if (selectedNis === nis && filtered.length > 0) {
        setSelectedNis(filtered[0].nis);
      }
      return filtered;
    });
  };

  const handleUpdateBulkAbsensi = (newAbsensi: AbsensiSiswa[]) => {
    setAbsensiList(newAbsensi);
  };

  const handleNavigateToPrint = (nis: string, subTab: 'cover' | 'inti') => {
    setSelectedNis(nis);
    setPrintSubTab(subTab);
    setActiveTab('preview');
  };

  // Admin User Account Management
  const handleAddUser = (newUser: UserAccount) => {
    setUserAccounts((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUserAccounts((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUserAccounts((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleLogout = () => {
    setUserSession((prev) => ({ ...prev, isLoggedIn: false }));
  };

  const handlePrint = () => {
    window.print();
  };

  // =========================================================================
  // GATE SCREEN: TAMPILKAN LOGIN SCREEN JIKA BELUM LOGIN
  // =========================================================================
  if (!userSession.isLoggedIn) {
    return (
      <LoginPage
        sekolah={sekolah}
        users={userAccounts}
        kurikulum={kurikulum}
        onLoginSuccess={(newSession) => {
          setUserSession(newSession);
          if (newSession.role === 'admin') {
            setActiveTab('guru_manager');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />
    );
  }

  // =========================================================================
  // MAIN DASHBOARD DENGAN LEFT SIDEBAR LAYOUT
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans antialiased">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        sekolah={sekolah}
        siswaList={siswaList}
        selectedNis={selectedNis}
        onSelectNis={setSelectedNis}
        semester={semester}
        onToggleSemester={setSemester}
        userSession={userSession}
        onLogout={handleLogout}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenAbsensiModal={() => setIsAbsensiModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onPrint={handlePrint}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />

      {/* 2. MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Top Header Bar with Hamburger (Only visible on mobile < 768px, pinned sidebar on tablet & PC) */}
        <header className="md:hidden no-print bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSidebarOpenMobile(true)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="overflow-hidden">
              <h1 className="text-xs font-black tracking-tight text-white truncate">
                E-Rapor Deep Learning
              </h1>
              <p className="text-[10px] text-slate-400 truncate">
                {sekolah.namaSekolah} • Sem {semester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
              title="Cetak A4"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 0: DASHBOARD UTAMA */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              sekolah={sekolah}
              siswaList={siswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              semester={semester}
              onSelectTab={setActiveTab}
              onOpenGasModal={() => setIsGasModalOpen(true)}
              onOpenAbsensiModal={() => setIsAbsensiModalOpen(true)}
              onOpenRoleModal={() => setIsRoleModalOpen(true)}
              legerRows={legerRows}
              kurikulum={kurikulum}
              nilaiFormatif={nilaiFormatif}
              nilaiSumatif={nilaiSumatif}
              userSession={userSession}
            />
          )}

          {/* TAB 1: PRATINJAU & CETAK RAPOR A4 */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Print Mode Subbar */}
              <div className="no-print bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
                    Format Cetak:
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrintSubTab('inti')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      printSubTab === 'inti'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    (1) Rapor Inti & Kokurikuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintSubTab('cover')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      printSubTab === 'cover'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <School className="w-3.5 h-3.5" />
                    (2) Sampul Rapor (3 Halaman Resmi)
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500 text-right hidden md:block">
                    <p>
                      Kertas: <strong>A4 Portrait</strong> (Margin 1.5cm)
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold">
                      {semester === 2 ? 'Semester 2: Keputusan Kenaikan Aktif' : 'Semester 1: Keputusan Kenaikan Disembunyikan'}
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Printer className="w-4 h-4 text-indigo-400" />
                    Cetak Dokumen Ini
                  </button>
                </div>
              </div>

              {/* Rapor Print Canvas Container */}
              <div className="transition-all">
                {printSubTab === 'inti' ? (
                  <PrintRaporInti
                    siswa={activeSiswa}
                    sekolah={sekolah}
                    semester={semester}
                    daftarNilaiMapel={calculatedMapelsForActiveSiswa}
                    kokurikuler={currentKokurikuler}
                    ekstrakurikuler={currentEkstrakurikuler}
                    absensi={currentAbsensi}
                    customCatatanWaliKelas={customNotes[selectedNis]}
                    persentil={activeRankingInfo.persentil}
                    statusKenaikan={activeStatusKenaikan.status}
                    targetKelasLanjutan={activeStatusKenaikan.targetKelas}
                  />
                ) : (
                  <PrintCover
                    siswa={activeSiswa}
                    sekolah={sekolah}
                    allSiswa={siswaList}
                    onSelectSiswa={setSelectedNis}
                    onUpdateSiswa={handleUpdateSiswa}
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INPUT NILAI 25 TP (FORMATIF & SUMATIF) */}
          {activeTab === 'nilai' && (
            <NilaiEditor
              siswaList={siswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              kurikulum={kurikulum}
              nilaiFormatif={nilaiFormatif}
              nilaiSumatif={nilaiSumatif}
              onUpdateFormatif={handleUpdateFormatif}
              onUpdateSumatif={handleUpdateSumatif}
              userSession={userSession}
            />
          )}

          {/* TAB 3: KOKURIKULER 8 DIMENSI & EKSTRA */}
          {activeTab === 'kokurikuler' && (
            <KokurikulerEditor
              siswaList={siswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              semester={semester}
              kokurikulerData={kokurikulerList}
              ekstrakurikulerData={ekstrakurikulerList}
              absensiData={absensiList}
              onUpdateDimensi={handleUpdateDimensi}
              onUpdateStudentDimensiList={handleUpdateStudentDimensiList}
              onApplyDimensiToAll={handleApplyDimensiToAll}
              onUpdateEkstrakurikuler={handleUpdateEkstrakurikuler}
              onUpdateAbsensi={handleUpdateAbsensi}
              onOpenAbsensiModal={() => setIsAbsensiModalOpen(true)}
            />
          )}

          {/* TAB 4: LEGER & PERINGKAT TERSELUBUNG */}
          {activeTab === 'leger' && (
            <LegerTable
              rows={legerRows}
              semester={semester}
              kurikulum={kurikulum}
              onUpdateCustomCatatan={handleUpdateCustomCatatan}
              onUpdateStatusKenaikan={handleUpdateStatusKenaikan}
            />
          )}

          {/* TAB 5: DATA SISWA LENGKAP (MANUAL & MASSAL) */}
          {activeTab === 'siswa' && (
            <DataSiswaManager
              siswaList={siswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              onAddSiswa={handleAddSiswa}
              onAddBulkSiswa={handleAddBulkSiswa}
              onUpdateSiswa={handleUpdateSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              onNavigateToPrint={handleNavigateToPrint}
            />
          )}

          {/* TAB 6: MASTER KURIKULUM */}
          {activeTab === 'kurikulum' && (
            <MasterKurikulumView
              kurikulum={kurikulum}
              onUpdateMapel={handleUpdateMapelKurikulum}
            />
          )}

          {/* TAB 7: KELOLA DATA GURU & AKUN MASUK (ADMINISTRATOR) */}
          {activeTab === 'guru_manager' && (
            <AdminUserManager
              users={userAccounts}
              kurikulum={kurikulum}
              currentSession={userSession}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onSwitchSession={(session) => setUserSession(session)}
            />
          )}
        </main>
      </div>

      {/* MODAL: INTEGRASI REKAP ABSENSI GOOGLE SHEETS */}
      <AbsensiIntegrationModal
        isOpen={isAbsensiModalOpen}
        onClose={() => setIsAbsensiModalOpen(false)}
        siswaList={siswaList}
        absensiList={absensiList}
        semester={semester}
        onUpdateBulkAbsensi={handleUpdateBulkAbsensi}
        onUpdateSingleAbsensi={handleUpdateAbsensi}
      />

      {/* MODAL: ROLE & AKSES MASUK CEPAT */}
      <RoleLoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentSession={userSession}
        onSwitchSession={(newSession) => setUserSession(newSession)}
        kurikulum={kurikulum}
        namaWaliKelas={sekolah.namaWaliKelas}
      />

      {/* MODAL: GOOGLE SHEETS HEADERS, CODE.GS & CLOUDFLARE */}
      <GasIntegrationModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
      />

      {/* MODAL: EDIT PROFIL SEKOLAH & TITIMANGSA */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                Pengaturan Profil Satuan Pendidikan & Tanda Tangan
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan:</label>
                <input
                  type="text"
                  value={sekolah.namaSekolah}
                  onChange={(e) => setSekolah({ ...sekolah, namaSekolah: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPSN:</label>
                  <input
                    type="text"
                    value={sekolah.npsn}
                    onChange={(e) => setSekolah({ ...sekolah, npsn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran:</label>
                  <input
                    type="text"
                    value={sekolah.tahunPelajaran}
                    onChange={(e) => setSekolah({ ...sekolah, tahunPelajaran: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Sekolah:</label>
                <input
                  type="text"
                  value={sekolah.alamatSekolah}
                  onChange={(e) => setSekolah({ ...sekolah, alamatSekolah: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desa / Kelurahan:</label>
                  <input
                    type="text"
                    value={sekolah.kelurahan}
                    onChange={(e) => setSekolah({ ...sekolah, kelurahan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kecamatan:</label>
                  <input
                    type="text"
                    value={sekolah.kecamatan}
                    onChange={(e) => setSekolah({ ...sekolah, kecamatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota:</label>
                  <input
                    type="text"
                    value={sekolah.kotaKabupaten}
                    onChange={(e) => setSekolah({ ...sekolah, kotaKabupaten: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provinsi:</label>
                  <input
                    type="text"
                    value={sekolah.provinsi}
                    onChange={(e) => setSekolah({ ...sekolah, provinsi: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Pos:</label>
                  <input
                    type="text"
                    value={sekolah.kodePos}
                    onChange={(e) => setSekolah({ ...sekolah, kodePos: e.target.value })}
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telepon:</label>
                  <input
                    type="text"
                    value={sekolah.telepon}
                    onChange={(e) => setSekolah({ ...sekolah, telepon: e.target.value })}
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Website:</label>
                  <input
                    type="text"
                    value={sekolah.website}
                    onChange={(e) => setSekolah({ ...sekolah, website: e.target.value })}
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="text"
                    value={sekolah.email}
                    onChange={(e) => setSekolah({ ...sekolah, email: e.target.value })}
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Wali Kelas:</label>
                    <input
                      type="text"
                      value={sekolah.namaWaliKelas}
                      onChange={(e) => setSekolah({ ...sekolah, namaWaliKelas: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Wali Kelas:</label>
                    <input
                      type="text"
                      value={sekolah.nipWaliKelas}
                      onChange={(e) => setSekolah({ ...sekolah, nipWaliKelas: e.target.value })}
                      placeholder="-"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah:</label>
                    <input
                      type="text"
                      value={sekolah.namaKepalaSekolah}
                      onChange={(e) => setSekolah({ ...sekolah, namaKepalaSekolah: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah:</label>
                    <input
                      type="text"
                      value={sekolah.nipKepalaSekolah}
                      onChange={(e) => setSekolah({ ...sekolah, nipKepalaSekolah: e.target.value })}
                      placeholder="-"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tempat Titimangsa:</label>
                    <input
                      type="text"
                      value={sekolah.titimangsaTempat}
                      onChange={(e) => setSekolah({ ...sekolah, titimangsaTempat: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Titimangsa Rapor:</label>
                    <input
                      type="text"
                      value={sekolah.titimangsaTanggal}
                      onChange={(e) => setSekolah({ ...sekolah, titimangsaTanggal: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
