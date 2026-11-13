import {
  AbsensiSiswa,
  DataSiswa,
  EkstrakurikulerSiswa,
  KokurikulerSiswa,
  MasterKurikulumMapel,
  NilaiFormatifSiswa,
  NilaiSumatifSiswa,
  ProfilSekolah,
  UserAccount,
} from '../types/rapor';

const GAS_URL_STORAGE_KEY = 'erapor_gas_webapp_url';
const APP_SNAPSHOT_STORAGE_KEY = 'erapor_app_snapshot_v1';

const ENV_GAS_URL =
  typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GAS_WEBAPP_URL
    ? String((import.meta as any).env.VITE_GAS_WEBAPP_URL).trim()
    : '';

/**
 * URL Web App Google Apps Script (GAS) permanen bawaan aplikasi.
 * Ganti konstanta ini dengan URL Web App (/exec) hasil deploy Google Spreadsheet sekolah Anda
 * agar semua perangkat (Komputer maupun Mobile Browser / HP) otomatis terhubung ke database yang sama
 * tanpa perlu mengatur ulang URL di menu Integrasi GAS.
 */
export const DEFAULT_GAS_WEBAPP_URL =
  ENV_GAS_URL ||
  'https://script.google.com/macros/s/AKfycbyG2q3fn49EvHpwOZ2V17fbTiA-ZML2v7y_eGsdawdrMVtCQ_-eJTlujXxQ9cI6DJe-/exec';

// Alias untuk kompatibilitas impor lama
export const DEFAULT_DEMO_GAS_URL = DEFAULT_GAS_WEBAPP_URL;

export const PLACEHOLDER_GAS_URL =
  'https://script.google.com/macros/s/AKfycbwSD_KalamKudus_Blitar_ERapor/exec';

export function isPlaceholderGasUrl(url?: string): boolean {
  const target = (url ?? getStoredGasUrl()).trim();
  return !target || target === PLACEHOLDER_GAS_URL;
}

export function getStoredGasUrl(): string {
  try {
    const custom = localStorage.getItem(GAS_URL_STORAGE_KEY);
    if (custom && custom.trim() && custom.trim() !== PLACEHOLDER_GAS_URL) {
      return custom.trim();
    }
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
  return DEFAULT_GAS_WEBAPP_URL;
}

export function setStoredGasUrl(url: string): void {
  try {
    const trimmed = url.trim();
    if (!trimmed || trimmed === DEFAULT_GAS_WEBAPP_URL) {
      localStorage.removeItem(GAS_URL_STORAGE_KEY);
    } else {
      localStorage.setItem(GAS_URL_STORAGE_KEY, trimmed);
    }
  } catch (e) {
    console.error('Failed to save GAS URL in localStorage', e);
  }
}

export type StatusKenaikanMap = Record<
  string,
  { status: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan'; targetKelas: string }
>;

export interface AppDataSnapshot {
  sekolah: ProfilSekolah;
  userAccounts: UserAccount[];
  siswaList: DataSiswa[];
  semester: 1 | 2;
  kurikulum: MasterKurikulumMapel[];
  nilaiFormatif: NilaiFormatifSiswa[];
  nilaiSumatif: NilaiSumatifSiswa[];
  kokurikulerList: KokurikulerSiswa[];
  ekstrakurikulerList: EkstrakurikulerSiswa[];
  absensiList: AbsensiSiswa[];
  customNotes: Record<string, string>;
  statusKenaikanMap: StatusKenaikanMap;
  lastUpdatedAt?: string;
}

export function saveLocalSnapshot(snapshot: AppDataSnapshot): void {
  try {
    localStorage.setItem(
      APP_SNAPSHOT_STORAGE_KEY,
      JSON.stringify({
        ...snapshot,
        lastUpdatedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.warn('Gagal menyimpan cache lokal aplikasi:', e);
  }
}

export function loadLocalSnapshot(): Partial<AppDataSnapshot> | null {
  try {
    const raw = localStorage.getItem(APP_SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as Partial<AppDataSnapshot>;
    }
    return null;
  } catch {
    return null;
  }
}

export interface GasSyncPayload {
  action?: 'saveAll' | 'saveNilai' | 'saveSiswa' | 'saveUsers' | 'saveSekolah' | 'saveKurikulum';
  semester: 1 | 2;
  sekolah?: ProfilSekolah;
  userAccounts?: UserAccount[];
  siswaList: DataSiswa[];
  kurikulum: MasterKurikulumMapel[];
  nilaiFormatif: NilaiFormatifSiswa[];
  nilaiSumatif: NilaiSumatifSiswa[];
  kokurikulerList?: KokurikulerSiswa[];
  ekstrakurikulerList?: EkstrakurikulerSiswa[];
  absensiList?: AbsensiSiswa[];
  customNotes?: Record<string, string>;
  statusKenaikanMap?: StatusKenaikanMap;
}

export interface GasSyncResult {
  success: boolean;
  message: string;
  timestamp?: string;
  updatedSheets?: string[];
  rawResponse?: any;
}

export interface GasLoadResult {
  success: boolean;
  message: string;
  timestamp?: string;
  isPlaceholder?: boolean;
  data?: Partial<AppDataSnapshot>;
}

/**
 * Bangun query string aman meski URL sudah memiliki parameter
 */
function buildGasGetUrl(baseUrl: string, params: Record<string, string>): string {
  const separator = baseUrl.includes('?') ? '&' : '?';
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return `${baseUrl}${separator}${query}`;
}

/**
 * Tarik seluruh data E-Rapor (Guru, Password, Identitas Sekolah, Siswa, Kurikulum, Nilai)
 * dari Google Apps Script via GET fetch(?action=readAll)
 */
export async function loadFromGoogleSheets(gasUrl?: string): Promise<GasLoadResult> {
  const targetUrl = (gasUrl || getStoredGasUrl()).trim();
  if (!targetUrl) {
    return {
      success: false,
      message: 'URL Web App Google Apps Script belum dikonfigurasi.',
    };
  }

  if (isPlaceholderGasUrl(targetUrl)) {
    return {
      success: false,
      isPlaceholder: true,
      message:
        'Menggunakan data lokal. Ganti DEFAULT_GAS_WEBAPP_URL dengan URL Web App (/exec) sekolah Anda untuk sinkronisasi lintas perangkat.',
    };
  }

  try {
    const urlWithParams = buildGasGetUrl(targetUrl, {
      action: 'readAll',
      t: String(Date.now()),
    });

    const response = await fetch(urlWithParams, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.status !== 'success' || !json.data) {
      return {
        success: false,
        message: json.message || 'Respon Google Sheets tidak valid saat mengambil data.',
      };
    }

    const raw = json.data;
    const loaded: Partial<AppDataSnapshot> = {};

    if (raw.sekolah && typeof raw.sekolah === 'object' && raw.sekolah.namaSekolah) {
      loaded.sekolah = raw.sekolah as ProfilSekolah;
    }
    if (Array.isArray(raw.userAccounts) && raw.userAccounts.length > 0) {
      loaded.userAccounts = raw.userAccounts as UserAccount[];
    }
    if (Array.isArray(raw.siswaList) && raw.siswaList.length > 0) {
      loaded.siswaList = raw.siswaList as DataSiswa[];
    }
    if (Array.isArray(raw.kurikulum) && raw.kurikulum.length > 0) {
      loaded.kurikulum = raw.kurikulum as MasterKurikulumMapel[];
    }
    if (Array.isArray(raw.nilaiFormatif)) {
      loaded.nilaiFormatif = raw.nilaiFormatif as NilaiFormatifSiswa[];
    }
    if (Array.isArray(raw.nilaiSumatif)) {
      loaded.nilaiSumatif = raw.nilaiSumatif as NilaiSumatifSiswa[];
    }
    if (Array.isArray(raw.kokurikulerList) && raw.kokurikulerList.length > 0) {
      loaded.kokurikulerList = raw.kokurikulerList as KokurikulerSiswa[];
    }
    if (Array.isArray(raw.ekstrakurikulerList) && raw.ekstrakurikulerList.length > 0) {
      loaded.ekstrakurikulerList = raw.ekstrakurikulerList as EkstrakurikulerSiswa[];
    }
    if (Array.isArray(raw.absensiList) && raw.absensiList.length > 0) {
      loaded.absensiList = raw.absensiList as AbsensiSiswa[];
    }
    if (raw.customNotes && typeof raw.customNotes === 'object') {
      loaded.customNotes = raw.customNotes as Record<string, string>;
    }
    if (raw.statusKenaikanMap && typeof raw.statusKenaikanMap === 'object') {
      loaded.statusKenaikanMap = raw.statusKenaikanMap as StatusKenaikanMap;
    }

    return {
      success: true,
      message: 'Data berhasil disinkronkan dari Google Sheets.',
      timestamp: json.timestamp || new Date().toISOString(),
      data: loaded,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.message?.includes('Failed to fetch') || err?.name === 'TypeError'
          ? 'Gagal terhubung ke Google Sheets saat mengambil data. Pastikan akses Web App Apps Script diset ke "Anyone".'
          : `Gagal mengambil data: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Kirim seluruh data (Guru/Akun, Sekolah, Siswa, Kurikulum, Nilai, Kokurikuler, Absensi)
 * ke Google Apps Script via POST fetch()
 */
export async function saveToGoogleSheets(
  gasUrl: string,
  payload: GasSyncPayload
): Promise<GasSyncResult> {
  const targetUrl = (gasUrl || getStoredGasUrl()).trim();
  if (!targetUrl) {
    return {
      success: false,
      message: 'URL Web App Google Apps Script belum disetel. Silakan masukkan URL Web App Anda.',
    };
  }

  if (isPlaceholderGasUrl(targetUrl)) {
    return {
      success: false,
      message:
        'URL Web App masih menggunakan URL placeholder. Silakan deploy Code.gs ke Google Sheets Anda dan simpan URL Web App (/exec) pada menu Integrasi GAS atau konstanta DEFAULT_GAS_WEBAPP_URL.',
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Menghindari CORS preflight pada GAS Web App redirect
      },
      body: JSON.stringify({
        action: payload.action || 'saveAll',
        semester: payload.semester,
        sekolah: payload.sekolah,
        userAccounts: payload.userAccounts,
        siswaList: payload.siswaList,
        nilaiFormatif: payload.nilaiFormatif,
        nilaiSumatif: payload.nilaiSumatif,
        kurikulum: payload.kurikulum.map((k) => ({
          kodeMapel: k.kodeMapel,
          namaMapel: k.namaMapel,
          kelompok: k.kelompok,
          cp: k.cp,
          atp: k.atp,
          tpNarasi: k.tpNarasi,
          cpFaseA: k.cpFaseA,
          cpFaseB: k.cpFaseB,
          cpFaseC: k.cpFaseC,
          atpFaseA: k.atpFaseA,
          atpFaseB: k.atpFaseB,
          atpFaseC: k.atpFaseC,
          tpNarasiFaseA: k.tpNarasiFaseA,
          tpNarasiFaseB: k.tpNarasiFaseB,
          tpNarasiFaseC: k.tpNarasiFaseC,
          elemenCapaian: k.elemenCapaian,
          fileAtpLampiran: k.fileAtpLampiran?.map((f) => ({
            id: f.id,
            fileName: f.fileName,
            fileSize: f.fileSize,
            fileType: f.fileType,
            uploadedAt: f.uploadedAt,
          })),
        })),
        kokurikulerList: payload.kokurikulerList,
        ekstrakurikulerList: payload.ekstrakurikulerList,
        absensiList: payload.absensiList,
        customNotes: payload.customNotes,
        statusKenaikanMap: payload.statusKenaikanMap,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error status ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.status === 'success') {
      return {
        success: true,
        message: json.message || 'Data berhasil disimpan ke Google Sheets!',
        timestamp: json.timestamp || new Date().toISOString(),
        updatedSheets: json.updatedSheets || [
          'Identitas_Sekolah',
          'Akun_Guru',
          'Data_Siswa',
          'Master_Kurikulum',
          'Nilai_Formatif',
          'Nilai_Sumatif',
          'Leger_Nilai',
        ],
        rawResponse: json,
      };
    } else {
      return {
        success: false,
        message: json.message || 'Google Sheets mengembalikan pesan status bukan sukses.',
        rawResponse: json,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.message?.includes('Failed to fetch') || err?.name === 'TypeError'
          ? 'Koneksi ke Google Apps Script gagal atau diblokir CORS. Pastikan saat deploy di Apps Script: "Who has access / Siapa yang memiliki akses" dipilih "Anyone / Siapa saja".'
          : `Gagal menyimpan: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Uji koneksi ke endpoint Google Apps Script via GET fetch()
 */
export async function testGasConnection(gasUrl: string): Promise<GasSyncResult> {
  const targetUrl = (gasUrl || getStoredGasUrl()).trim();
  if (!targetUrl) {
    return {
      success: false,
      message: 'Silakan masukkan URL Web App Google Apps Script.',
    };
  }

  if (isPlaceholderGasUrl(targetUrl)) {
    return {
      success: false,
      message:
        'URL ini adalah URL contoh bawaan. Silakan deploy Code.gs di Google Spreadsheet Anda sebagai Web App dan tempel URL (/exec) asli di sini.',
    };
  }

  try {
    const urlWithParams = buildGasGetUrl(targetUrl, {
      action: 'test',
      t: String(Date.now()),
    });
    const response = await fetch(urlWithParams, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Koneksi ke Google Apps Script & Google Sheets berhasil!',
      timestamp: data.timestamp,
      rawResponse: data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal terhubung: ${err?.message || String(err)}. Pastikan akses web app diset ke "Anyone".`,
    };
  }
}
