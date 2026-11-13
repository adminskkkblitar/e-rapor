import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  TingkatKelasSD,
  UserAccount,
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
  TINGKAT_KELAS_SD,
  generateAutoDeskripsiMapel,
  getFaseFromKelas,
  getTargetKelasLanjutan,
  getTpNarasiForFase,
  hitungNilaiAkhir,
  hitungRataFormatif,
  hitungRataSumatif,
  kalkulasiPeringkatTerselubung,
  normalizeKelasCode,
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
  AppDataSnapshot,
  GasSyncPayload,
  StatusKenaikanMap,
  getStoredGasUrl,
  isPlaceholderGasUrl,
  loadFromGoogleSheets,
  loadLocalSnapshot,
  saveLocalSnapshot,
  saveToGoogleSheets,
} from './utils/gasSyncService';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Database,
  FileText,
  Menu,
  Plus,
  Printer,
  RefreshCw,
  School,
  Trash2,
  UploadCloud,
  UserCheck,
  Users,
} from 'lucide-react';

function mergeKurikulumWithDefaults(incoming: MasterKurikulumMapel[]): MasterKurikulumMapel[] {
  return incoming.map((item) => {
    const base = INITIAL_KURIKULUM.find((k) => k.kodeMapel === item.kodeMapel);
    if (!base) return item;
    return {
      ...base,
      ...item,
      cpFaseA: item.cpFaseA || base.cpFaseA,
      cpFaseB: item.cpFaseB || base.cpFaseB,
      cpFaseC: item.cpFaseC || base.cpFaseC,
      atpFaseA: item.atpFaseA || base.atpFaseA,
      atpFaseB: item.atpFaseB || base.atpFaseB,
      atpFaseC: item.atpFaseC || base.atpFaseC,
      tpNarasiFaseA: item.tpNarasiFaseA?.length ? item.tpNarasiFaseA : base.tpNarasiFaseA,
      tpNarasiFaseB: item.tpNarasiFaseB?.length ? item.tpNarasiFaseB : base.tpNarasiFaseB,
      tpNarasiFaseC: item.tpNarasiFaseC?.length ? item.tpNarasiFaseC : base.tpNarasiFaseC,
      elemenCapaian: item.elemenCapaian?.length ? item.elemenCapaian : base.elemenCapaian,
    };
  });
}

export default function App() {
  const initialSnapshot = useMemo(() => loadLocalSnapshot(), []);

  // 1. Core State (terhidrasi dari cache lokal + diperbarui otomatis oleh Google Sheets)
  const [sekolah, setSekolah] = useState<ProfilSekolah>(
    () => initialSnapshot?.sekolah || INITIAL_PROFIL_SEKOLAH
  );
  const [siswaList, setSiswaList] = useState<DataSiswa[]>(
    () => (initialSnapshot?.siswaList?.length ? initialSnapshot.siswaList : INITIAL_SISWA)
  );
  const [selectedNis, setSelectedNis] = useState<string>(
    () => initialSnapshot?.siswaList?.[0]?.nis || INITIAL_SISWA[0].nis
  );
  const [semester, setSemester] = useState<1 | 2>(() => initialSnapshot?.semester || 2);
  const [kurikulum, setKurikulum] = useState<MasterKurikulumMapel[]>(() =>
    initialSnapshot?.kurikulum?.length
      ? mergeKurikulumWithDefaults(initialSnapshot.kurikulum)
      : INITIAL_KURIKULUM
  );
  const [nilaiFormatif, setNilaiFormatif] = useState<NilaiFormatifSiswa[]>(() =>
    initialSnapshot?.nilaiFormatif?.length ? initialSnapshot.nilaiFormatif : getInitialNilaiFormatif()
  );
  const [nilaiSumatif, setNilaiSumatif] = useState<NilaiSumatifSiswa[]>(() =>
    initialSnapshot?.nilaiSumatif?.length ? initialSnapshot.nilaiSumatif : getInitialNilaiSumatif()
  );
  const [kokurikulerList, setKokurikulerList] = useState<KokurikulerSiswa[]>(() =>
    initialSnapshot?.kokurikulerList?.length
      ? initialSnapshot.kokurikulerList
      : getInitialKokurikuler()
  );
  const [ekstrakurikulerList, setEkstrakurikulerList] = useState<EkstrakurikulerSiswa[]>(() =>
    initialSnapshot?.ekstrakurikulerList?.length
      ? initialSnapshot.ekstrakurikulerList
      : getInitialEkstrakurikuler()
  );
  const [absensiList, setAbsensiList] = useState<AbsensiSiswa[]>(() =>
    initialSnapshot?.absensiList?.length ? initialSnapshot.absensiList : INITIAL_ABSENSI
  );

  // User Accounts State (Managed by Admin)
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() =>
    initialSnapshot?.userAccounts?.length ? initialSnapshot.userAccounts : INITIAL_USERS
  );

  // Authentication & Gate State
  const [userSession, setUserSession] = useState<UserSession>({
    isLoggedIn: false, // Default false: Shows Login Gate first
    userId: 'user-wali',
    role: 'wali_kelas',
    namaUser: 'Petrus Apriprasetyo, S.Pd',
    kelasAjar: 'V',
  });

  // Hybrid Catatan Wali Kelas State per student NIS
  const [customNotes, setCustomNotes] = useState<Record<string, string>>(
    () =>
      initialSnapshot?.customNotes || {
        '230101': '', // ADRY GRACIO SURYAJAYA -> Auto-generate Top 10%
        '230102': 'Ananda Clara memiliki kepemimpinan yang baik dan selalu tekun dalam tugas kelompok.',
        '230105': '', // Michael -> Auto-generate Bottom 30%
      }
  );

  // Status Kenaikan State per student NIS (Semester 2)
  const [statusKenaikanMap, setStatusKenaikanMap] = useState<StatusKenaikanMap>(
    () =>
      initialSnapshot?.statusKenaikanMap || {
        '230101': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
        '230102': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
        '230103': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
        '230104': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
        '230105': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
        '230106': { status: 'Naik Kelas', targetKelas: 'Kelas VI (Enam)' },
      }
  );

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [printSubTab, setPrintSubTab] = useState<'inti' | 'cover'>('inti');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Modals
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAbsensiModalOpen, setIsAbsensiModalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Google Apps Script Sync State
  const [isSavingToSheets, setIsSavingToSheets] = useState<boolean>(false);
  const [isLoadingFromSheets, setIsLoadingFromSheets] = useState<boolean>(false);
  const [syncNotification, setSyncNotification] = useState<{
    type: 'loading' | 'success' | 'error';
    message: string;
    timestamp?: string;
  } | null>(null);
  const [loginSyncStatus, setLoginSyncStatus] = useState<{
    type: 'loading' | 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  // Latest Snapshot Ref (menghindari stale closure saat auto-sync langsung setelah setState)
  const latestDataRef = useRef<AppDataSnapshot>({
    sekolah,
    userAccounts,
    siswaList,
    semester,
    kurikulum,
    nilaiFormatif,
    nilaiSumatif,
    kokurikulerList,
    ekstrakurikulerList,
    absensiList,
    customNotes,
    statusKenaikanMap,
  });

  useEffect(() => {
    const currentSnapshot: AppDataSnapshot = {
      sekolah,
      userAccounts,
      siswaList,
      semester,
      kurikulum,
      nilaiFormatif,
      nilaiSumatif,
      kokurikulerList,
      ekstrakurikulerList,
      absensiList,
      customNotes,
      statusKenaikanMap,
    };
    latestDataRef.current = currentSnapshot;
    saveLocalSnapshot(currentSnapshot);
  }, [
    sekolah,
    userAccounts,
    siswaList,
    semester,
    kurikulum,
    nilaiFormatif,
    nilaiSumatif,
    kokurikulerList,
    ekstrakurikulerList,
    absensiList,
    customNotes,
    statusKenaikanMap,
  ]);

  const debouncedSyncTimerRef = useRef<number | null>(null);

  // Auto-Load (GET) dari Google Sheets
  const pullSyncFromServer = useCallback(async (reason: 'mount' | 'login' | 'manual' = 'manual') => {
    const url = getStoredGasUrl();
    setIsLoadingFromSheets(true);
    setLoginSyncStatus({
      type: 'loading',
      message: 'Menyinkronkan data dari server...',
    });

    if (reason !== 'mount') {
      setSyncNotification({
        type: 'loading',
        message: 'Menyinkronkan data dari server...',
      });
    } else {
      setSyncNotification({
        type: 'loading',
        message: 'Menyinkronkan data dari server...',
      });
    }

    const result = await loadFromGoogleSheets(url);
    setIsLoadingFromSheets(false);

    if (result.success && result.data) {
      const incoming = result.data;
      const mergedSnapshot: AppDataSnapshot = { ...latestDataRef.current };

      if (incoming.sekolah) {
        setSekolah(incoming.sekolah);
        mergedSnapshot.sekolah = incoming.sekolah;
      }
      if (incoming.userAccounts && incoming.userAccounts.length > 0) {
        setUserAccounts(incoming.userAccounts);
        mergedSnapshot.userAccounts = incoming.userAccounts;
      }
      if (incoming.siswaList && incoming.siswaList.length > 0) {
        setSiswaList(incoming.siswaList);
        mergedSnapshot.siswaList = incoming.siswaList;
      }
      if (incoming.kurikulum && incoming.kurikulum.length > 0) {
        const mergedKuri = mergeKurikulumWithDefaults(incoming.kurikulum);
        setKurikulum(mergedKuri);
        mergedSnapshot.kurikulum = mergedKuri;
      }
      if (incoming.nilaiFormatif) {
        setNilaiFormatif(incoming.nilaiFormatif);
        mergedSnapshot.nilaiFormatif = incoming.nilaiFormatif;
      }
      if (incoming.nilaiSumatif) {
        setNilaiSumatif(incoming.nilaiSumatif);
        mergedSnapshot.nilaiSumatif = incoming.nilaiSumatif;
      }
      if (incoming.kokurikulerList && incoming.kokurikulerList.length > 0) {
        setKokurikulerList(incoming.kokurikulerList);
        mergedSnapshot.kokurikulerList = incoming.kokurikulerList;
      }
      if (incoming.ekstrakurikulerList && incoming.ekstrakurikulerList.length > 0) {
        setEkstrakurikulerList(incoming.ekstrakurikulerList);
        mergedSnapshot.ekstrakurikulerList = incoming.ekstrakurikulerList;
      }
      if (incoming.absensiList && incoming.absensiList.length > 0) {
        setAbsensiList(incoming.absensiList);
        mergedSnapshot.absensiList = incoming.absensiList;
      }
      if (incoming.customNotes) {
        setCustomNotes(incoming.customNotes);
        mergedSnapshot.customNotes = incoming.customNotes;
      }
      if (incoming.statusKenaikanMap) {
        setStatusKenaikanMap(incoming.statusKenaikanMap);
        mergedSnapshot.statusKenaikanMap = incoming.statusKenaikanMap;
      }

      latestDataRef.current = mergedSnapshot;
      saveLocalSnapshot(mergedSnapshot);

      const timeStr = new Date().toLocaleTimeString('id-ID');
      setLoginSyncStatus({
        type: 'success',
        message: `Data guru, sekolah & nilai tersinkron (${timeStr})`,
      });
      setSyncNotification({
        type: 'success',
        message: 'Data berhasil disinkronkan dari server Google Sheets!',
        timestamp: timeStr,
      });
      window.setTimeout(() => {
        setSyncNotification((prev) => (prev?.type === 'success' ? null : prev));
      }, 4500);
      return;
    }

    if (result.isPlaceholder) {
      setLoginSyncStatus({
        type: 'info',
        message:
          'Memakai data lokal (ganti DEFAULT_GAS_WEBAPP_URL di kode atau atur URL GAS untuk sync lintas perangkat).',
      });
      if (reason === 'manual') {
        setSyncNotification({
          type: 'error',
          message: result.message,
        });
      } else {
        setSyncNotification(null);
      }
      return;
    }

    setLoginSyncStatus({
      type: 'error',
      message: result.message || 'Gagal mengambil data dari server Google Sheets.',
    });
    setSyncNotification({
      type: 'error',
      message: result.message || 'Gagal menyinkronkan data dari server.',
    });
  }, []);

  // Auto-Load pertama kali aplikasi dimuat
  useEffect(() => {
    void pullSyncFromServer('mount');
  }, [pullSyncFromServer]);

  // Helper Auto-Sync / Manual POST ke Google Sheets dengan snapshot terbaru
  const pushSyncToServer = useCallback(
    async (
      overrides?: Partial<AppDataSnapshot>,
      action: GasSyncPayload['action'] = 'saveAll',
      loadingMessage = 'Menyimpan data dan menyinkronkan ke Google Sheets...',
      silentIfPlaceholder = false
    ) => {
      if (debouncedSyncTimerRef.current !== null) {
        window.clearTimeout(debouncedSyncTimerRef.current);
        debouncedSyncTimerRef.current = null;
      }

      const nextData: AppDataSnapshot = {
        ...latestDataRef.current,
        ...overrides,
      };
      latestDataRef.current = nextData;
      saveLocalSnapshot(nextData);

      const url = getStoredGasUrl();
      if (!url) {
        if (!silentIfPlaceholder) {
          setIsGasModalOpen(true);
          setSyncNotification({
            type: 'error',
            message:
              'Silakan masukkan URL Web App Google Apps Script Anda terlebih dahulu untuk memulai sinkronisasi.',
          });
        }
        return;
      }

      if (silentIfPlaceholder && isPlaceholderGasUrl(url)) {
        return;
      }

      setIsSavingToSheets(true);
      setSyncNotification({
        type: 'loading',
        message: loadingMessage,
      });

      const payload: GasSyncPayload = {
        action,
        semester: nextData.semester,
        sekolah: nextData.sekolah,
        userAccounts: nextData.userAccounts,
        siswaList: nextData.siswaList,
        kurikulum: nextData.kurikulum,
        nilaiFormatif: nextData.nilaiFormatif,
        nilaiSumatif: nextData.nilaiSumatif,
        kokurikulerList: nextData.kokurikulerList,
        ekstrakurikulerList: nextData.ekstrakurikulerList,
        absensiList: nextData.absensiList,
        customNotes: nextData.customNotes,
        statusKenaikanMap: nextData.statusKenaikanMap,
      };

      const result = await saveToGoogleSheets(url, payload);
      setIsSavingToSheets(false);

      if (result.success) {
        setSyncNotification({
          type: 'success',
          message: result.message || 'Data berhasil disimpan dan disinkronkan ke Google Sheets!',
          timestamp: new Date().toLocaleTimeString('id-ID'),
        });
        window.setTimeout(() => {
          setSyncNotification((prev) => (prev?.type === 'success' ? null : prev));
        }, 4500);
      } else {
        setSyncNotification({
          type: 'error',
          message: result.message || 'Gagal menyimpan ke Google Sheets.',
        });
      }
    },
    []
  );

  // Debounced Auto-Sync untuk input nilai cepat agar tidak membanjiri endpoint GAS per ketikan
  const scheduleAutoSync = useCallback(
    (
      overrides?: Partial<AppDataSnapshot>,
      action: GasSyncPayload['action'] = 'saveNilai',
      loadingMessage = 'Menyinkronkan perubahan nilai ke Google Sheets...'
    ) => {
      const nextData: AppDataSnapshot = {
        ...latestDataRef.current,
        ...overrides,
      };
      latestDataRef.current = nextData;
      saveLocalSnapshot(nextData);

      if (isPlaceholderGasUrl(getStoredGasUrl())) {
        return;
      }

      if (debouncedSyncTimerRef.current !== null) {
        window.clearTimeout(debouncedSyncTimerRef.current);
      }

      debouncedSyncTimerRef.current = window.setTimeout(() => {
        debouncedSyncTimerRef.current = null;
        void pushSyncToServer(undefined, action, loadingMessage, true);
      }, 1400);
    },
    [pushSyncToServer]
  );

  const handleSaveToGoogleSheets = async () => {
    await pushSyncToServer(
      undefined,
      'saveAll',
      'Menyimpan seluruh data (Guru, Sekolah, Siswa & Nilai) ke Google Sheets...',
      false
    );
  };

  // Scoped Siswa List (Wali Kelas terkunci hanya pada kelas yang diampu)
  const scopedSiswaList = useMemo(() => {
    if (userSession.role === 'wali_kelas' && userSession.kelasAjar) {
      const targetKelas = normalizeKelasCode(userSession.kelasAjar);
      return siswaList.filter((s) => normalizeKelasCode(s.kelas) === targetKelas);
    }
    return siswaList;
  }, [siswaList, userSession.role, userSession.kelasAjar]);

  // Keep selectedNis valid within scopedSiswaList
  useEffect(() => {
    if (scopedSiswaList.length === 0) return;
    if (!scopedSiswaList.some((s) => s.nis === selectedNis)) {
      setSelectedNis(scopedSiswaList[0].nis);
    }
  }, [scopedSiswaList, selectedNis]);

  // Active Student
  const activeSiswa = useMemo(() => {
    return scopedSiswaList.find((s) => s.nis === selectedNis) || scopedSiswaList[0];
  }, [scopedSiswaList, selectedNis]);

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

  // Hidden ranking calculation map (dihitung per kelas agar lintas tingkat tidak bercampur)
  const hiddenRankingMap = useMemo(() => {
    const combined = new Map<
      string,
      { ranking: number; totalSiswa: number; persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%' }
    >();
    const byKelas = new Map<string, typeof studentAverages>();

    studentAverages.forEach((s) => {
      const k = normalizeKelasCode(s.kelas);
      const group = byKelas.get(k) || [];
      group.push(s);
      byKelas.set(k, group);
    });

    byKelas.forEach((group) => {
      const rankMap = kalkulasiPeringkatTerselubung(group);
      rankMap.forEach((val, key) => {
        combined.set(key, val);
      });
    });

    return combined;
  }, [studentAverages]);

  // Calculated Mapel values for the currently selected student (uses student's Fase TPs)
  const calculatedMapelsForActiveSiswa: RaporMapelKalkulasi[] = useMemo(() => {
    const activeFase = getFaseFromKelas(activeSiswa?.kelas || userSession.kelasAjar);
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
      const tpNarasiFase = getTpNarasiForFase(mapel, activeFase);
      const autoDesc = generateAutoDeskripsiMapel(tpScores, tpNarasiFase, mapel.namaMapel, nickname);

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
  }, [kurikulum, nilaiFormatif, nilaiSumatif, selectedNis, activeSiswa, userSession.kelasAjar]);

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
    totalSiswa: scopedSiswaList.length,
    persentil: 'Top 10%' as const,
  };

  const defaultTargetKelasActive = getTargetKelasLanjutan(activeSiswa?.kelas);
  const activeStatusKenaikan = statusKenaikanMap[selectedNis] || {
    status: defaultTargetKelasActive === 'Lulus SD' ? ('Lulus' as const) : ('Naik Kelas' as const),
    targetKelas: defaultTargetKelasActive,
  };

  // Leger Rows (full + scoped)
  const legerRows: LegerRowData[] = useMemo(() => {
    return studentAverages.map((s) => {
      const rankInfo = hiddenRankingMap.get(s.nis) || {
        ranking: 1,
        totalSiswa: studentAverages.length,
        persentil: 'Middle 60%' as const,
      };
      const defaultTarget = getTargetKelasLanjutan(s.kelas);
      const statusInfo = statusKenaikanMap[s.nis] || {
        status: defaultTarget === 'Lulus SD' ? ('Lulus' as const) : ('Naik Kelas' as const),
        targetKelas: defaultTarget,
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

  const scopedLegerRows = useMemo(() => {
    const allowedNis = new Set(scopedSiswaList.map((s) => s.nis));
    return legerRows.filter((r) => allowedNis.has(r.nis));
  }, [legerRows, scopedSiswaList]);

  // Handlers for updates + Auto-Sync ke Google Sheets
  const handleUpdateFormatif = (
    nis: string,
    kodeMapel: string,
    tpIndex: number,
    value: number
  ) => {
    setNilaiFormatif((prev) => {
      const idx = prev.findIndex((item) => item.nis === nis && item.kodeMapel === kodeMapel);
      let next: NilaiFormatifSiswa[];
      if (idx >= 0) {
        const copy = [...prev];
        const newTp = [...copy[idx].nilaiTp];
        newTp[tpIndex] = value;
        copy[idx] = { ...copy[idx], nilaiTp: newTp };
        next = copy;
      } else {
        const newTp = new Array(25).fill(0);
        newTp[tpIndex] = value;
        next = [...prev, { nis, kodeMapel, nilaiTp: newTp }];
      }
      scheduleAutoSync({ nilaiFormatif: next }, 'saveNilai', 'Menyinkronkan nilai formatif ke Google Sheets...');
      return next;
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
      let next: NilaiSumatifSiswa[];
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
        next = copy;
      } else {
        const sumLm = [0, 0, 0, 0];
        let sts = 0;
        let sas = 0;
        if (field.startsWith('lm')) {
          const lmIdx = parseInt(field.replace('lm', ''), 10) - 1;
          sumLm[lmIdx] = value;
        } else if (field === 'sts') sts = value;
        else if (field === 'sas') sas = value;

        next = [...prev, { nis, kodeMapel, sumatifLm: sumLm, sts, sas }];
      }
      scheduleAutoSync({ nilaiSumatif: next }, 'saveNilai', 'Menyinkronkan nilai sumatif ke Google Sheets...');
      return next;
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
        scheduleAutoSync({ kokurikulerList: copy }, 'saveAll', 'Menyinkronkan data kokurikuler ke Google Sheets...');
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
      let next: KokurikulerSiswa[];
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], dimensi };
        next = copy;
      } else {
        next = [...prev, { nis, semester, dimensi }];
      }
      scheduleAutoSync({ kokurikulerList: next }, 'saveAll', 'Menyinkronkan data kokurikuler ke Google Sheets...');
      return next;
    });
  };

  const handleApplyDimensiToAll = (templateDimensi: ItemKokurikuler8Dimensi[]) => {
    const allowedNis = new Set(scopedSiswaList.map((s) => s.nis));
    setKokurikulerList((prev) => {
      const untouched = prev.filter((k) => !allowedNis.has(k.nis));
      const updatedScoped = scopedSiswaList.map((siswa) => {
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
      });
      const next = [...untouched, ...updatedScoped];
      void pushSyncToServer({ kokurikulerList: next }, 'saveAll', 'Menyimpan template kokurikuler ke Google Sheets...', true);
      return next;
    });
  };

  const handleUpdateEkstrakurikuler = (nis: string, daftarEkstra: ItemEkstrakurikuler[]) => {
    setEkstrakurikulerList((prev) => {
      const idx = prev.findIndex((e) => e.nis === nis);
      let next: EkstrakurikulerSiswa[];
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], daftarEkstra };
        next = copy;
      } else {
        next = [...prev, { nis, semester, daftarEkstra }];
      }
      scheduleAutoSync({ ekstrakurikulerList: next }, 'saveAll', 'Menyinkronkan ekstrakurikuler ke Google Sheets...');
      return next;
    });
  };

  const handleUpdateAbsensi = (
    nis: string,
    field: 'sakit' | 'izin' | 'tanpaKeterangan',
    val: number
  ) => {
    setAbsensiList((prev) => {
      const idx = prev.findIndex((a) => a.nis === nis);
      let next: AbsensiSiswa[];
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [field]: val };
        next = copy;
      } else {
        next = [...prev, { nis, semester, sakit: 0, izin: 0, tanpaKeterangan: 0, [field]: val }];
      }
      scheduleAutoSync({ absensiList: next }, 'saveAll', 'Menyinkronkan absensi ke Google Sheets...');
      return next;
    });
  };

  const handleUpdateCustomCatatan = (nis: string, text: string) => {
    setCustomNotes((prev) => {
      const next = { ...prev, [nis]: text };
      scheduleAutoSync({ customNotes: next }, 'saveAll', 'Menyinkronkan catatan wali kelas ke Google Sheets...');
      return next;
    });
  };

  const handleUpdateStatusKenaikan = (
    nis: string,
    status: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan',
    targetKelas?: string
  ) => {
    const siswa = siswaList.find((s) => s.nis === nis);
    setStatusKenaikanMap((prev) => {
      const next = {
        ...prev,
        [nis]: { status, targetKelas: targetKelas || getTargetKelasLanjutan(siswa?.kelas) },
      };
      void pushSyncToServer({ statusKenaikanMap: next }, 'saveAll', 'Menyimpan status kenaikan kelas ke Google Sheets...', true);
      return next;
    });
  };

  const handleUpdateMapelKurikulum = (updatedMapel: MasterKurikulumMapel) => {
    const nextKurikulum = kurikulum.map((m) =>
      m.kodeMapel === updatedMapel.kodeMapel ? updatedMapel : m
    );
    setKurikulum(nextKurikulum);
    void pushSyncToServer(
      { kurikulum: nextKurikulum },
      'saveKurikulum',
      'Menyimpan perubahan Master Kurikulum ke Google Sheets...',
      true
    );
  };

  const handleUpdateSiswa = (updatedSiswa: DataSiswa) => {
    const nextSiswa = siswaList.map((s) => (s.nis === updatedSiswa.nis ? updatedSiswa : s));
    setSiswaList(nextSiswa);
    void pushSyncToServer(
      { siswaList: nextSiswa },
      'saveSiswa',
      'Menyimpan perubahan data siswa ke Google Sheets...',
      true
    );
  };

  const handleAddSiswa = (newSiswa: DataSiswa) => {
    const nextSiswa = [...siswaList, newSiswa];
    const nextAbsensi = [...absensiList, { nis: newSiswa.nis, semester, sakit: 0, izin: 0, tanpaKeterangan: 0 }];

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

    const nextKoku = [...kokurikulerList, { nis: newSiswa.nis, semester, dimensi: defaultDimensi }];
    const nextStatus: StatusKenaikanMap = {
      ...statusKenaikanMap,
      [newSiswa.nis]: { status: 'Naik Kelas', targetKelas: getTargetKelasLanjutan(newSiswa.kelas) },
    };

    setSiswaList(nextSiswa);
    setAbsensiList(nextAbsensi);
    setKokurikulerList(nextKoku);
    setStatusKenaikanMap(nextStatus);

    void pushSyncToServer(
      {
        siswaList: nextSiswa,
        absensiList: nextAbsensi,
        kokurikulerList: nextKoku,
        statusKenaikanMap: nextStatus,
      },
      'saveSiswa',
      'Menyimpan data siswa baru ke Google Sheets...',
      true
    );
  };

  const handleAddBulkSiswa = (siswaArr: DataSiswa[]) => {
    const existingNis = new Set(siswaList.map((s) => s.nis));
    const toAdd = siswaArr.filter((s) => !existingNis.has(s.nis));
    if (toAdd.length === 0) return;

    const nextSiswa = [...siswaList, ...toAdd];
    const newAbsensi = toAdd.map((s) => ({
      nis: s.nis,
      semester,
      sakit: 0,
      izin: 0,
      tanpaKeterangan: 0,
    }));
    const nextAbsensi = [...absensiList, ...newAbsensi];

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
    const nextKoku = [...kokurikulerList, ...newKoku];

    const newStatus: StatusKenaikanMap = {};
    toAdd.forEach((s) => {
      newStatus[s.nis] = { status: 'Naik Kelas', targetKelas: getTargetKelasLanjutan(s.kelas) };
    });
    const nextStatus = { ...statusKenaikanMap, ...newStatus };

    setSiswaList(nextSiswa);
    setAbsensiList(nextAbsensi);
    setKokurikulerList(nextKoku);
    setStatusKenaikanMap(nextStatus);

    void pushSyncToServer(
      {
        siswaList: nextSiswa,
        absensiList: nextAbsensi,
        kokurikulerList: nextKoku,
        statusKenaikanMap: nextStatus,
      },
      'saveSiswa',
      `Menyimpan ${toAdd.length} siswa baru ke Google Sheets...`,
      true
    );
  };

  const handleDeleteSiswa = (nis: string) => {
    const filtered = siswaList.filter((s) => s.nis !== nis);
    setSiswaList(filtered);
    if (selectedNis === nis && filtered.length > 0) {
      setSelectedNis(filtered[0].nis);
    }
    void pushSyncToServer(
      { siswaList: filtered },
      'saveSiswa',
      'Memperbarui penghapusan siswa ke Google Sheets...',
      true
    );
  };

  const handleUpdateBulkAbsensi = (newAbsensi: AbsensiSiswa[]) => {
    setAbsensiList(newAbsensi);
    void pushSyncToServer(
      { absensiList: newAbsensi },
      'saveAll',
      'Menyimpan rekap absensi ke Google Sheets...',
      true
    );
  };

  const handleNavigateToPrint = (nis: string, subTab: 'cover' | 'inti') => {
    setSelectedNis(nis);
    setPrintSubTab(subTab);
    setActiveTab('preview');
  };

  // Admin User Account Management (Otomatis sinkron ke Google Sheets)
  const handleAddUser = (newUser: UserAccount) => {
    const nextUsers = [...userAccounts, newUser];
    setUserAccounts(nextUsers);
    void pushSyncToServer(
      { userAccounts: nextUsers },
      'saveUsers',
      'Menyimpan akun guru baru & password ke Google Sheets...',
      true
    );
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    const nextUsers = userAccounts.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUserAccounts(nextUsers);
    void pushSyncToServer(
      { userAccounts: nextUsers },
      'saveUsers',
      'Menyimpan pembaruan akun guru & password ke Google Sheets...',
      true
    );
  };

  const handleDeleteUser = (userId: string) => {
    const nextUsers = userAccounts.filter((u) => u.id !== userId);
    setUserAccounts(nextUsers);
    void pushSyncToServer(
      { userAccounts: nextUsers },
      'saveUsers',
      'Menyinkronkan penghapusan akun guru ke Google Sheets...',
      true
    );
  };

  const handleLogout = () => {
    setUserSession((prev) => ({ ...prev, isLoggedIn: false }));
  };

  // Terapkan sesi login / switch role & arahkan halaman sesuai hak akses + tarik data terbaru dari GAS
  const applySessionAndRoute = (newSession: UserSession) => {
    const normalizedSession: UserSession = {
      ...newSession,
      kelasAjar:
        newSession.role === 'wali_kelas'
          ? normalizeKelasCode(newSession.kelasAjar || 'V')
          : undefined,
    };
    setUserSession(normalizedSession);

    if (normalizedSession.role === 'admin') {
      setActiveTab('guru_manager');
    } else if (normalizedSession.role === 'wali_kelas') {
      setActiveTab('siswa');
      const targetKelas = normalizeKelasCode(normalizedSession.kelasAjar || 'V');
      const firstInClass = siswaList.find((s) => normalizeKelasCode(s.kelas) === targetKelas);
      if (firstInClass) {
        setSelectedNis(firstInClass.nis);
      }
    } else if (normalizedSession.role === 'guru_mapel') {
      setActiveTab('nilai');
    } else {
      setActiveTab('dashboard');
    }

    // Auto-Load ulang dari Google Sheets saat pengguna baru masuk agar data lintas perangkat selalu terbaru
    void pullSyncFromServer('login');
  };

  // Sinkronkan Profil Sekolah & Master Penugasan Wali Kelas 1-6 / Guru Mapel ke Akun Masuk + Google Sheets
  const handleUpdateSekolahAndSyncUsers = (updatedSekolah: ProfilSekolah, syncNow = true) => {
    const syncedWaliMap = { ...(updatedSekolah.waliKelasPerTingkat || {}) };
    if (
      updatedSekolah.namaWaliKelas &&
      (!syncedWaliMap.V || syncedWaliMap.V.nama !== updatedSekolah.namaWaliKelas)
    ) {
      syncedWaliMap.V = {
        nama: updatedSekolah.namaWaliKelas,
        nip: updatedSekolah.nipWaliKelas || syncedWaliMap.V?.nip || '-',
      };
    }

    const finalSekolah: ProfilSekolah = {
      ...updatedSekolah,
      waliKelasPerTingkat: syncedWaliMap,
      namaWaliKelas: syncedWaliMap.V?.nama || updatedSekolah.namaWaliKelas,
      nipWaliKelas: syncedWaliMap.V?.nip || updatedSekolah.nipWaliKelas,
    };
    setSekolah(finalSekolah);

    const prevUsers = latestDataRef.current.userAccounts;
    const updatedUsers = prevUsers.map((u) => {
      if (u.role === 'wali_kelas') {
        const kelasKey = normalizeKelasCode(u.kelasAjar || 'V');
        const mappedWali = finalSekolah.waliKelasPerTingkat?.[kelasKey];
        if (mappedWali && mappedWali.nama.trim()) {
          return {
            ...u,
            nama: mappedWali.nama.trim(),
            nip: mappedWali.nip || '-',
            kelasAjar: kelasKey,
          };
        }
      } else if (u.role === 'guru_mapel' && u.kodeMapel) {
        const mappedGm = finalSekolah.guruMapelList?.find((gm) => gm.kodeMapel === u.kodeMapel);
        if (mappedGm && mappedGm.nama.trim()) {
          return {
            ...u,
            nama: mappedGm.nama.trim(),
            nip: mappedGm.nip || '-',
            namaMapel: mappedGm.namaMapel || u.namaMapel,
          };
        }
      }
      return u;
    });

    // Tambahkan akun Wali Kelas baru jika tingkat tsb belum memiliki akun
    TINGKAT_KELAS_SD.forEach((t) => {
      const entry = finalSekolah.waliKelasPerTingkat?.[t.kode];
      if (entry && entry.nama.trim()) {
        const exists = updatedUsers.some(
          (u) => u.role === 'wali_kelas' && normalizeKelasCode(u.kelasAjar || 'V') === t.kode
        );
        if (!exists) {
          updatedUsers.push({
            id: `user-wali-${t.angka}`,
            nama: entry.nama.trim(),
            nip: entry.nip || '-',
            role: 'wali_kelas',
            kelasAjar: t.kode,
            password: 'wali123',
          });
        }
      }
    });

    // Tambahkan akun Guru Mapel baru jika mapel tsb belum memiliki akun
    (finalSekolah.guruMapelList || []).forEach((gm) => {
      if (gm.nama.trim()) {
        const exists = updatedUsers.some(
          (u) => u.role === 'guru_mapel' && u.kodeMapel === gm.kodeMapel
        );
        if (!exists) {
          updatedUsers.push({
            id: `user-gm-${gm.kodeMapel.toLowerCase()}`,
            nama: gm.nama.trim(),
            nip: gm.nip || '-',
            role: 'guru_mapel',
            kodeMapel: gm.kodeMapel,
            namaMapel: gm.namaMapel,
            password: 'guru123',
          });
        }
      }
    });

    setUserAccounts(updatedUsers);

    if (syncNow) {
      void pushSyncToServer(
        { sekolah: finalSekolah, userAccounts: updatedUsers },
        'saveSekolah',
        'Menyimpan Identitas Sekolah & Penugasan Guru ke Google Sheets...',
        true
      );
    }
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
        onLoginSuccess={applySessionAndRoute}
        serverSyncStatus={loginSyncStatus}
        onRefreshFromSheets={() => void pullSyncFromServer('manual')}
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
        siswaList={scopedSiswaList}
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
              onClick={handleSaveToGoogleSheets}
              disabled={isSavingToSheets}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              title="Simpan ke Google Sheets"
            >
              {isSavingToSheets ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
            </button>
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

        {/* Desktop & Tablet Top Bar (no-print) */}
        <header className="hidden md:flex no-print bg-white border-b border-slate-200 px-6 py-3 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 capitalize flex items-center gap-2">
              {activeTab === 'dashboard' && 'Dashboard Utama & Capaian Kelas'}
              {activeTab === 'preview' && 'Pratinjau & Format Cetak Rapor (A4)'}
              {activeTab === 'nilai' && 'Penilaian Formatif 25 TP & Sumatif'}
              {activeTab === 'kokurikuler' && 'Penilaian Kokurikuler 8 Dimensi & Ekstrakurikuler'}
              {activeTab === 'leger' && 'Leger Nilai & Peringkat Terselubung'}
              {activeTab === 'siswa' && 'Manajemen Data Peserta Didik'}
              {activeTab === 'kurikulum' && 'Master Kurikulum & Capaian Pembelajaran (Fase A-C)'}
              {activeTab === 'guru_manager' && 'Manajemen Akun Guru & Akses Role'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {sekolah.namaSekolah} • Semester {semester} ({semester === 2 ? 'Genap' : 'Ganjil'}) • TP {sekolah.tahunPelajaran}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Tombol Simpan ke Google Sheets */}
            <button
              type="button"
              onClick={handleSaveToGoogleSheets}
              disabled={isSavingToSheets}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
              title="Simpan seluruh data terbaru ke Google Sheets via endpoint Web App Apps Script"
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

            {/* Tombol Konfigurasi GAS */}
            <button
              type="button"
              onClick={() => setIsGasModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="Buka dialog integrasi Google Apps Script & Cloudflare"
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              Integrasi GAS
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
              title="Cetak Halaman (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Global Sync Notification Banner */}
        {syncNotification && (
          <div className="no-print px-4 sm:px-6 pt-3">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition shadow-xs ${
                syncNotification.type === 'loading'
                  ? 'bg-sky-50 border-sky-200 text-sky-900'
                  : syncNotification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {syncNotification.type === 'loading' && (
                  <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
                )}
                {syncNotification.type === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {syncNotification.type === 'error' && (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold">{syncNotification.message}</span>
                  {syncNotification.timestamp && (
                    <span className="text-[11px] opacity-75 ml-2">
                      (Pukul {syncNotification.timestamp})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {syncNotification.type === 'error' && (
                  <button
                    type="button"
                    onClick={() => setIsGasModalOpen(true)}
                    className="text-xs font-bold underline text-rose-700 hover:text-rose-900 mr-2"
                  >
                    Atur URL GAS
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSyncNotification(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded text-sm leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 0: DASHBOARD UTAMA */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              sekolah={sekolah}
              siswaList={scopedSiswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              semester={semester}
              onSelectTab={setActiveTab}
              onOpenGasModal={() => setIsGasModalOpen(true)}
              onOpenAbsensiModal={() => setIsAbsensiModalOpen(true)}
              onOpenRoleModal={() => setIsRoleModalOpen(true)}
              onUpdateSekolah={handleUpdateSekolahAndSyncUsers}
              onOpenSettingsModal={() => setIsSettingsOpen(true)}
              legerRows={scopedLegerRows}
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
              {activeSiswa ? (
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
                      allSiswa={scopedSiswaList}
                      onSelectSiswa={setSelectedNis}
                      onUpdateSiswa={handleUpdateSiswa}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-xs space-y-2">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Belum ada peserta didik pada kelas ini untuk dicetak
                  </h3>
                  <p className="text-xs text-slate-500">
                    Silakan tambahkan data siswa melalui menu Data Siswa Lengkap.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INPUT NILAI 25 TP (FORMATIF & SUMATIF) */}
          {activeTab === 'nilai' && (
            <NilaiEditor
              siswaList={userSession.role === 'wali_kelas' ? scopedSiswaList : siswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              kurikulum={kurikulum}
              nilaiFormatif={nilaiFormatif}
              nilaiSumatif={nilaiSumatif}
              onUpdateFormatif={handleUpdateFormatif}
              onUpdateSumatif={handleUpdateSumatif}
              userSession={userSession}
              onSaveToGoogleSheets={handleSaveToGoogleSheets}
              isSavingToSheets={isSavingToSheets}
            />
          )}

          {/* TAB 3: KOKURIKULER 8 DIMENSI & EKSTRA */}
          {activeTab === 'kokurikuler' && (
            <KokurikulerEditor
              siswaList={scopedSiswaList}
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
              rows={scopedLegerRows}
              semester={semester}
              kurikulum={kurikulum}
              onUpdateCustomCatatan={handleUpdateCustomCatatan}
              onUpdateStatusKenaikan={handleUpdateStatusKenaikan}
            />
          )}

          {/* TAB 5: DATA SISWA LENGKAP (MANUAL & MASSAL) */}
          {activeTab === 'siswa' && (
            <DataSiswaManager
              siswaList={scopedSiswaList}
              selectedNis={selectedNis}
              onSelectNis={setSelectedNis}
              onAddSiswa={handleAddSiswa}
              onAddBulkSiswa={handleAddBulkSiswa}
              onUpdateSiswa={handleUpdateSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              onNavigateToPrint={handleNavigateToPrint}
              userSession={userSession}
              onNavigateToNilai={() => setActiveTab('nilai')}
            />
          )}

          {/* TAB 6: MASTER KURIKULUM */}
          {activeTab === 'kurikulum' && (
            <MasterKurikulumView
              kurikulum={kurikulum}
              onUpdateMapel={handleUpdateMapelKurikulum}
              userSession={userSession}
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
              onSwitchSession={applySessionAndRoute}
            />
          )}
        </main>
      </div>

      {/* MODAL: INTEGRASI REKAP ABSENSI GOOGLE SHEETS */}
      <AbsensiIntegrationModal
        isOpen={isAbsensiModalOpen}
        onClose={() => setIsAbsensiModalOpen(false)}
        siswaList={scopedSiswaList}
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
        onSwitchSession={applySessionAndRoute}
        kurikulum={kurikulum}
        namaWaliKelas={sekolah.namaWaliKelas}
        sekolah={sekolah}
        users={userAccounts}
      />

      {/* MODAL: GOOGLE SHEETS HEADERS, CODE.GS & CLOUDFLARE */}
      <GasIntegrationModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        onSaveToGoogleSheets={handleSaveToGoogleSheets}
        onLoadFromGoogleSheets={() => pullSyncFromServer('manual')}
        isSaving={isSavingToSheets}
        isLoadingFromSheets={isLoadingFromSheets}
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
                    <label className="block font-semibold text-slate-700 mb-1">Nama Wali Kelas Default (Kelas V):</label>
                    <input
                      type="text"
                      value={sekolah.namaWaliKelas}
                      onChange={(e) =>
                        handleUpdateSekolahAndSyncUsers(
                          {
                            ...sekolah,
                            namaWaliKelas: e.target.value,
                          },
                          false
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Wali Kelas (Kelas V):</label>
                    <input
                      type="text"
                      value={sekolah.nipWaliKelas}
                      onChange={(e) =>
                        handleUpdateSekolahAndSyncUsers(
                          {
                            ...sekolah,
                            nipWaliKelas: e.target.value,
                            waliKelasPerTingkat: {
                              ...(sekolah.waliKelasPerTingkat || {}),
                              V: {
                                nama: sekolah.waliKelasPerTingkat?.V?.nama || sekolah.namaWaliKelas,
                                nip: e.target.value,
                              },
                            },
                          },
                          false
                        )
                      }
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

              {/* Pengaturan Daftar Wali Kelas 1 s.d. 6 */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Master Wali Kelas 1 s.d. 6 (Acuan Penanda Tangan Rapor):</span>
                </div>
                <div className="space-y-2">
                  {TINGKAT_KELAS_SD.map((t) => {
                    const entry = sekolah.waliKelasPerTingkat?.[t.kode] || { nama: '', nip: '-' };
                    return (
                      <div key={t.kode} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div className="col-span-3 font-bold text-slate-700">
                          Kelas {t.angka} ({t.fase})
                        </div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={entry.nama}
                            onChange={(e) => {
                              const nextMap = {
                                ...(sekolah.waliKelasPerTingkat || {}),
                                [t.kode]: { ...entry, nama: e.target.value },
                              };
                              handleUpdateSekolahAndSyncUsers(
                                {
                                  ...sekolah,
                                  waliKelasPerTingkat: nextMap,
                                  namaWaliKelas: t.kode === 'V' ? e.target.value : sekolah.namaWaliKelas,
                                },
                                false
                              );
                            }}
                            placeholder={`Nama Wali Kelas ${t.angka}...`}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-medium"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={entry.nip}
                            onChange={(e) => {
                              const nextMap = {
                                ...(sekolah.waliKelasPerTingkat || {}),
                                [t.kode]: { ...entry, nip: e.target.value },
                              };
                              handleUpdateSekolahAndSyncUsers(
                                {
                                  ...sekolah,
                                  waliKelasPerTingkat: nextMap,
                                  nipWaliKelas: t.kode === 'V' ? e.target.value : sekolah.nipWaliKelas,
                                },
                                false
                              );
                            }}
                            placeholder="NIP..."
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pengaturan Daftar Guru Mapel */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Master Guru Mata Pelajaran:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const def = kurikulum[0];
                      handleUpdateSekolahAndSyncUsers(
                        {
                          ...sekolah,
                          guruMapelList: [
                            ...(sekolah.guruMapelList || []),
                            {
                              id: `gm-${Date.now()}`,
                              kodeMapel: def?.kodeMapel || 'PAK-01',
                              namaMapel: def?.namaMapel || 'Pendidikan Agama',
                              nama: '',
                              nip: '-',
                            },
                          ],
                        },
                        false
                      );
                    }}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {(sekolah.guruMapelList || []).map((gm) => (
                    <div key={gm.id} className="grid grid-cols-12 gap-1.5 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="col-span-4">
                        <select
                          value={gm.kodeMapel}
                          onChange={(e) => {
                            const mapelObj = kurikulum.find((m) => m.kodeMapel === e.target.value);
                            handleUpdateSekolahAndSyncUsers(
                              {
                                ...sekolah,
                                guruMapelList: (sekolah.guruMapelList || []).map((item) =>
                                  item.id === gm.id
                                    ? { ...item, kodeMapel: e.target.value, namaMapel: mapelObj?.namaMapel || item.namaMapel }
                                    : item
                                ),
                              },
                              false
                            );
                          }}
                          className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 font-bold"
                        >
                          {kurikulum.map((m) => (
                            <option key={m.kodeMapel} value={m.kodeMapel}>
                              {m.kodeMapel} - {m.namaMapel}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={gm.nama}
                          onChange={(e) =>
                            handleUpdateSekolahAndSyncUsers(
                              {
                                ...sekolah,
                                guruMapelList: (sekolah.guruMapelList || []).map((item) =>
                                  item.id === gm.id ? { ...item, nama: e.target.value } : item
                                ),
                              },
                              false
                            )
                          }
                          placeholder="Nama Guru..."
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-medium"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={gm.nip}
                          onChange={(e) =>
                            handleUpdateSekolahAndSyncUsers(
                              {
                                ...sekolah,
                                guruMapelList: (sekolah.guruMapelList || []).map((item) =>
                                  item.id === gm.id ? { ...item, nip: e.target.value } : item
                                ),
                              },
                              false
                            )
                          }
                          placeholder="NIP..."
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateSekolahAndSyncUsers(
                              {
                                ...sekolah,
                                guruMapelList: (sekolah.guruMapelList || []).filter((item) => item.id !== gm.id),
                              },
                              false
                            )
                          }
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                onClick={() => {
                  handleUpdateSekolahAndSyncUsers(sekolah, true);
                  setIsSettingsOpen(false);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Simpan &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
