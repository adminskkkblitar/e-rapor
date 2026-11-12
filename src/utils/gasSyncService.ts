import {
  AbsensiSiswa,
  DataSiswa,
  EkstrakurikulerSiswa,
  KokurikulerSiswa,
  MasterKurikulumMapel,
  NilaiFormatifSiswa,
  NilaiSumatifSiswa,
} from '../types/rapor';

const GAS_URL_STORAGE_KEY = 'erapor_gas_webapp_url';
export const DEFAULT_DEMO_GAS_URL = 'https://script.google.com/macros/s/AKfycbwSD_KalamKudus_Blitar_ERapor/exec';

export function getStoredGasUrl(): string {
  try {
    return localStorage.getItem(GAS_URL_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredGasUrl(url: string): void {
  try {
    localStorage.setItem(GAS_URL_STORAGE_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save GAS URL in localStorage', e);
  }
}

export interface GasSyncPayload {
  action?: 'saveAll' | 'saveNilai' | 'saveSiswa';
  semester: 1 | 2;
  siswaList: DataSiswa[];
  kurikulum: MasterKurikulumMapel[];
  nilaiFormatif: NilaiFormatifSiswa[];
  nilaiSumatif: NilaiSumatifSiswa[];
  kokurikulerList?: KokurikulerSiswa[];
  ekstrakurikulerList?: EkstrakurikulerSiswa[];
  absensiList?: AbsensiSiswa[];
}

export interface GasSyncResult {
  success: boolean;
  message: string;
  timestamp?: string;
  updatedSheets?: string[];
  rawResponse?: any;
}

/**
 * Kirim data ke Google Apps Script via POST fetch()
 */
export async function saveToGoogleSheets(
  gasUrl: string,
  payload: GasSyncPayload
): Promise<GasSyncResult> {
  const targetUrl = gasUrl.trim() || getStoredGasUrl();
  if (!targetUrl) {
    return {
      success: false,
      message: 'URL Web App Google Apps Script belum disetel. Silakan masukkan URL Web App Anda.',
    };
  }

  try {
    // Kirim dengan POST JSON
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // text/plain prevents CORS preflight issue with GAS redirects
      },
      body: JSON.stringify({
        action: payload.action || 'saveAll',
        semester: payload.semester,
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
        })),
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
        updatedSheets: json.updatedSheets || ['Data_Siswa', 'Nilai_Formatif', 'Nilai_Sumatif', 'Leger_Nilai'],
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
    // Deteksi jika Google Apps Script melakukan redirect yang tidak diizinkan oleh CORS lokal,
    // atau jika koneksi gagal
    return {
      success: false,
      message:
        err?.message?.includes('Failed to fetch') || err?.name === 'TypeError'
          ? 'Koneksi ke Google Apps Script gagal atau diblokir CORS. Pastikan saat deploy di Apps Script: "Who has access / Siapa yang memiliki akses" dipilih "Anyone / Siapa saja".'
          : `Gagal menyimpan: ${err.message || String(err)}`,
    };
  }
}

/**
 * Uji koneksi ke endpoint Google Apps Script via GET fetch()
 */
export async function testGasConnection(gasUrl: string): Promise<GasSyncResult> {
  const targetUrl = gasUrl.trim() || getStoredGasUrl();
  if (!targetUrl) {
    return {
      success: false,
      message: 'Silakan masukkan URL Web App Google Apps Script.',
    };
  }

  try {
    const urlWithParams = `${targetUrl}?action=test&t=${Date.now()}`;
    const response = await fetch(urlWithParams, {
      method: 'GET',
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
      message: `Gagal terhubung: ${err.message || String(err)}. Pastikan akses web app diset ke "Anyone".`,
    };
  }
}
