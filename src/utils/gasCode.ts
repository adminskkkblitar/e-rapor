/**
 * Definisi Header Kolom Google Sheets dan Source Code Google Apps Script (Code.gs)
 * Siap untuk diintegrasikan dengan Frontend yang di-deploy di Cloudflare Pages
 */

export interface SheetHeaderDefinition {
  sheetName: string;
  description: string;
  columns: string[];
}

export const GOOGLE_SHEETS_HEADERS: SheetHeaderDefinition[] = [
  {
    sheetName: 'Data_Siswa',
    description: 'Menyimpan identitas lengkap siswa untuk biodata, Sampul Rapor, dan halaman Identitas Peserta Didik',
    columns: [
      'NIS',
      'NISN',
      'Nama_Siswa',
      'Kelas',
      'Fase',
      'Tempat_Lahir',
      'Tanggal_Lahir',
      'Jenis_Kelamin',
      'Agama',
      'Alamat_Siswa',
      'Nama_Ayah',
      'Nama_Ibu',
      'Pekerjaan_Ayah',
      'Pekerjaan_Ibu',
      'Alamat_Ortu_Jalan',
      'Alamat_Ortu_Desa',
      'Alamat_Ortu_Kecamatan',
      'Alamat_Ortu_Kota',
      'Alamat_Ortu_Provinsi',
      'Nama_Wali',
      'Pekerjaan_Wali',
      'Alamat_Wali',
    ],
  },
  {
    sheetName: 'Master_Kurikulum',
    description: 'Mengikat Mata Pelajaran, CP, ATP, dan teks narasi untuk 25 TP (TP_1 hingga TP_25)',
    columns: [
      'Kode_Mapel',
      'Nama_Mapel',
      'Kelompok',
      'Capaian_Pembelajaran_CP',
      'Alur_Tujuan_Pembelajaran_ATP',
      'TP_1',
      'TP_2',
      'TP_3',
      'TP_4',
      'TP_5',
      'TP_6',
      'TP_7',
      'TP_8',
      'TP_9',
      'TP_10',
      'TP_11',
      'TP_12',
      'TP_13',
      'TP_14',
      'TP_15',
      'TP_16',
      'TP_17',
      'TP_18',
      'TP_19',
      'TP_20',
      'TP_21',
      'TP_22',
      'TP_23',
      'TP_24',
      'TP_25',
    ],
  },
  {
    sheetName: 'Nilai_Formatif',
    description: 'Menampung nilai formatif 25 TP per siswa per mapel',
    columns: [
      'NIS',
      'Kode_Mapel',
      'Nilai_TP_1',
      'Nilai_TP_2',
      'Nilai_TP_3',
      'Nilai_TP_4',
      'Nilai_TP_5',
      'Nilai_TP_6',
      'Nilai_TP_7',
      'Nilai_TP_8',
      'Nilai_TP_9',
      'Nilai_TP_10',
      'Nilai_TP_11',
      'Nilai_TP_12',
      'Nilai_TP_13',
      'Nilai_TP_14',
      'Nilai_TP_15',
      'Nilai_TP_16',
      'Nilai_TP_17',
      'Nilai_TP_18',
      'Nilai_TP_19',
      'Nilai_TP_20',
      'Nilai_TP_21',
      'Nilai_TP_22',
      'Nilai_TP_23',
      'Nilai_TP_24',
      'Nilai_TP_25',
      'Rata_Formatif',
    ],
  },
  {
    sheetName: 'Nilai_Sumatif',
    description: 'Menampung nilai sumatif lingkup materi (LM1-LM4), STS, SAS, dan Nilai Akhir',
    columns: [
      'NIS',
      'Kode_Mapel',
      'Sumatif_LM_1',
      'Sumatif_LM_2',
      'Sumatif_LM_3',
      'Sumatif_LM_4',
      'Rata_LM',
      'STS',
      'SAS',
      'Rata_Sumatif',
      'Nilai_Akhir',
    ],
  },
  {
    sheetName: 'Kokurikuler_8_Dimensi',
    description: 'Capaian 8 Dimensi Profil Lulusan Kurikulum Deep Learning (Predikat BB/MB/BSH/SB)',
    columns: [
      'NIS',
      'Semester',
      'Dimensi_1_Iman_Taqwa_Predikat',
      'Dimensi_1_Catatan',
      'Dimensi_2_Kewargaan_Predikat',
      'Dimensi_2_Catatan',
      'Dimensi_3_Penalaran_Kritis_Predikat',
      'Dimensi_3_Catatan',
      'Dimensi_4_Kreativitas_Predikat',
      'Dimensi_4_Catatan',
      'Dimensi_5_Kolaborasi_Predikat',
      'Dimensi_5_Catatan',
      'Dimensi_6_Kemandirian_Predikat',
      'Dimensi_6_Catatan',
      'Dimensi_7_Komunikasi_Predikat',
      'Dimensi_7_Catatan',
      'Dimensi_8_Kebugaran_Karakter_Predikat',
      'Dimensi_8_Catatan',
    ],
  },
  {
    sheetName: 'Ekstrakurikuler',
    description: 'Mendukung pengisian dinamis >2 kegiatan ekstrakurikuler per siswa',
    columns: [
      'NIS',
      'Semester',
      'Ekstra_1_Nama',
      'Ekstra_1_Predikat',
      'Ekstra_1_Deskripsi',
      'Ekstra_2_Nama',
      'Ekstra_2_Predikat',
      'Ekstra_2_Deskripsi',
      'Ekstra_3_Nama',
      'Ekstra_3_Predikat',
      'Ekstra_3_Deskripsi',
      'Ekstra_4_Nama',
      'Ekstra_4_Predikat',
      'Ekstra_4_Deskripsi',
    ],
  },
  {
    sheetName: 'Leger_Nilai',
    description: 'Rekapitulasi lengkap seluruh Nilai Akhir tiap mapel, total nilai, rata-rata, peringkat terselubung, dan status kenaikan kelas',
    columns: [
      'NIS',
      'Nama_Siswa',
      'Kelas',
      'Semester',
      'NA_Agama_Kristen',
      'NA_Pendidikan_Pancasila',
      'NA_Bahasa_Indonesia',
      'NA_Matematika',
      'NA_IPAS',
      'NA_Seni_Musik',
      'NA_PJOK',
      'NA_Bahasa_Inggris',
      'NA_Bahasa_Jawa',
      'NA_Komputer',
      'Total_Nilai',
      'Rata_Rata',
      'Peringkat_Terselubung',
      'Persentil_Kategori',
      'Catatan_Wali_Kelas_Custom',
      'Catatan_Wali_Kelas_Final',
      'Status_Kenaikan',
      'Target_Kelas',
    ],
  },
];

export const GOOGLE_APPS_SCRIPT_CODE_GS = `/**
 * ============================================================================
 * SISTEM INFORMASI RAPOR BERBASIS WEB - KURIKULUM DEEP LEARNING & 8 DIMENSI
 * Google Apps Script Backend (Code.gs)
 * Siap untuk diintegrasikan dengan Frontend di Cloudflare Pages / Workers
 * Satuan Pendidikan: SD KRISTEN KALAM KUDUS BLITAR
 * Wali Kelas: Petrus Apriprasetyo, S.Pd | Kepala Sekolah: Dian Natalia Widiasih, S.Psi
 * ============================================================================
 */

const SHEET_NAMES = {
  DATA_SISWA: 'Data_Siswa',
  MASTER_KURIKULUM: 'Master_Kurikulum',
  NILAI_FORMATIF: 'Nilai_Formatif',
  NILAI_SUMATIF: 'Nilai_Sumatif',
  KOKURIKULER: 'Kokurikuler_8_Dimensi',
  EKSTRAKURIKULER: 'Ekstrakurikuler',
  LEGER_NILAI: 'Leger_Nilai',
};

/**
 * 1. FUNGSI SETUP OTOMATIS SELURUH SHEET & HEADER (SEKALI KLIK)
 * Buka Apps Script Editor, pilih fungsi ini di dropdown toolbar, lalu klik "Run / Jalankan".
 * Seluruh 7 sheet relasional akan otomatis dibuat lengkap dengan styling, freeze rows, dan data awal!
 */
function setupDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const headersConfig = {
    Data_Siswa: [
      'NIS', 'NISN', 'Nama_Siswa', 'Kelas', 'Fase', 'Tempat_Lahir', 'Tanggal_Lahir',
      'Jenis_Kelamin', 'Agama', 'Alamat_Siswa', 'Nama_Ayah', 'Nama_Ibu', 'Pekerjaan_Ayah', 'Pekerjaan_Ibu',
      'Alamat_Ortu_Jalan', 'Alamat_Ortu_Desa', 'Alamat_Ortu_Kecamatan', 'Alamat_Ortu_Kota', 'Alamat_Ortu_Provinsi',
      'Nama_Wali', 'Pekerjaan_Wali', 'Alamat_Wali'
    ],
    Master_Kurikulum: [
      'Kode_Mapel', 'Nama_Mapel', 'Kelompok', 'Capaian_Pembelajaran_CP', 'Alur_Tujuan_Pembelajaran_ATP',
      'TP_1', 'TP_2', 'TP_3', 'TP_4', 'TP_5', 'TP_6', 'TP_7', 'TP_8', 'TP_9', 'TP_10',
      'TP_11', 'TP_12', 'TP_13', 'TP_14', 'TP_15', 'TP_16', 'TP_17', 'TP_18', 'TP_19', 'TP_20',
      'TP_21', 'TP_22', 'TP_23', 'TP_24', 'TP_25'
    ],
    Nilai_Formatif: [
      'NIS', 'Kode_Mapel',
      'Nilai_TP_1', 'Nilai_TP_2', 'Nilai_TP_3', 'Nilai_TP_4', 'Nilai_TP_5', 'Nilai_TP_6', 'Nilai_TP_7', 'Nilai_TP_8', 'Nilai_TP_9', 'Nilai_TP_10',
      'Nilai_TP_11', 'Nilai_TP_12', 'Nilai_TP_13', 'Nilai_TP_14', 'Nilai_TP_15', 'Nilai_TP_16', 'Nilai_TP_17', 'Nilai_TP_18', 'Nilai_TP_19', 'Nilai_TP_20',
      'Nilai_TP_21', 'Nilai_TP_22', 'Nilai_TP_23', 'Nilai_TP_24', 'Nilai_TP_25', 'Rata_Formatif'
    ],
    Nilai_Sumatif: [
      'NIS', 'Kode_Mapel', 'Sumatif_LM_1', 'Sumatif_LM_2', 'Sumatif_LM_3', 'Sumatif_LM_4',
      'Rata_LM', 'STS', 'SAS', 'Rata_Sumatif', 'Nilai_Akhir'
    ],
    Kokurikuler_8_Dimensi: [
      'NIS', 'Semester',
      'Dimensi_1_Iman_Taqwa_Predikat', 'Dimensi_1_Catatan',
      'Dimensi_2_Kewargaan_Predikat', 'Dimensi_2_Catatan',
      'Dimensi_3_Penalaran_Kritis_Predikat', 'Dimensi_3_Catatan',
      'Dimensi_4_Kreativitas_Predikat', 'Dimensi_4_Catatan',
      'Dimensi_5_Kolaborasi_Predikat', 'Dimensi_5_Catatan',
      'Dimensi_6_Kemandirian_Predikat', 'Dimensi_6_Catatan',
      'Dimensi_7_Komunikasi_Predikat', 'Dimensi_7_Catatan',
      'Dimensi_8_Kebugaran_Karakter_Predikat', 'Dimensi_8_Catatan'
    ],
    Ekstrakurikuler: [
      'NIS', 'Semester',
      'Ekstra_1_Nama', 'Ekstra_1_Predikat', 'Ekstra_1_Deskripsi',
      'Ekstra_2_Nama', 'Ekstra_2_Predikat', 'Ekstra_2_Deskripsi',
      'Ekstra_3_Nama', 'Ekstra_3_Predikat', 'Ekstra_3_Deskripsi',
      'Ekstra_4_Nama', 'Ekstra_4_Predikat', 'Ekstra_4_Deskripsi'
    ],
    Leger_Nilai: [
      'NIS', 'Nama_Siswa', 'Kelas', 'Semester',
      'NA_Agama_Kristen', 'NA_Pendidikan_Pancasila', 'NA_Bahasa_Indonesia', 'NA_Matematika',
      'NA_IPAS', 'NA_Seni_Musik', 'NA_PJOK', 'NA_Bahasa_Inggris', 'NA_Bahasa_Jawa', 'NA_Komputer',
      'Total_Nilai', 'Rata_Rata', 'Peringkat_Terselubung', 'Persentil_Kategori',
      'Catatan_Wali_Kelas_Custom', 'Catatan_Wali_Kelas_Final', 'Status_Kenaikan', 'Target_Kelas'
    ]
  };

  for (const sheetName in headersConfig) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    const headers = headersConfig[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#0F172A')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }

  // Seed sample data siswa: ADRY GRACIO SURYAJAYA jika sheet Data_Siswa masih kosong
  const sheetSiswa = ss.getSheetByName(SHEET_NAMES.DATA_SISWA);
  if (sheetSiswa.getLastRow() === 1) {
    sheetSiswa.appendRow([
      '230101', '0158352348', 'ADRY GRACIO SURYAJAYA', 'V', 'Fase C (Kelas V)', 'Blitar', '14 Maret 2014',
      'L', 'Kristen Protestan', 'Dsn. Tambak, RT 02/RW 03, Pagergunung, Kesamben, Blitar',
      'SURYA WIJAYA', 'GRACE SANTOSO', 'WIRASWASTA', 'IBU RUMAH TANGGA',
      'Dsn. Tambak RT 02/RW 03', 'Pagergunung', 'Kesamben', 'Kab. Blitar', 'Jawa Timur',
      '-', '-', '-'
    ]);
  }

  Logger.log('Inisialisasi 7 Sheet Database Berhasil Dilakukan!');
}

/**
 * 2. WEB APP API ENDPOINTS (DAPAT DIAKSES OLEH FRONTEND CLOUDFLARE VIA FETCH/CORS)
 */
function doGet(e) {
  // Jika parameter action diminta via API JSON (dari Cloudflare frontend)
  if (e && e.parameter && e.parameter.action) {
    return handleGetApi(e.parameter.action, e.parameter);
  }

  // Standalone HTML Web App view
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('E-Rapor Kurikulum Deep Learning')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    const contents = e.postData.contents;
    const body = JSON.parse(contents);
    const action = body.action;
    const result = handlePostApi(action, body.data);
    return createJsonResponse({ status: 'success', data: result });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function handleGetApi(action, params) {
  if (action === 'getRapor') {
    const nis = params.nis || '230101';
    const semester = params.semester || 2;
    const data = getRaporDataLengkap(nis, semester);
    return createJsonResponse(data);
  }
  if (action === 'init') {
    setupDatabaseSheets();
    return createJsonResponse({ status: 'initialized' });
  }
  return createJsonResponse({ status: 'ok', message: 'API E-Rapor Deep Learning Siap' });
}

function handlePostApi(action, data) {
  if (action === 'initSheets') {
    setupDatabaseSheets();
    return { success: true };
  }
  if (action === 'saveCatatanWali') {
    return updateCatatanWaliDanLeger(data.nis, data.semester, data.catatanCustom, data.statusKenaikan);
  }
  return { success: true };
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 3. LOGIKA BACKEND: KALKULASI NILAI AKHIR (NA)
 */
function hitungNilaiAkhir(rataFormatif, rataSumatif) {
  if (rataFormatif > 0 && rataSumatif > 0) {
    return Math.round((rataFormatif + rataSumatif) / 2);
  }
  return Math.round(rataSumatif || rataFormatif || 0);
}

/**
 * 4. LOGIKA BACKEND: AUTO-DESKRIPSI MAPEL (MAX/MIN TP)
 */
function generateAutoDeskripsiMapel(nilaiTpArray, tpNarasiArray) {
  const scoredTps = [];

  for (let i = 0; i < 25; i++) {
    const val = Number(nilaiTpArray[i]) || 0;
    const narasi = (tpNarasiArray[i] || 'tujuan pembelajaran ke-' + (i + 1)).trim();
    if (val > 0) {
      scoredTps.push({ index: i + 1, nilai: val, narasi: narasi });
    }
  }

  if (scoredTps.length === 0) {
    return 'Menunjukkan pemahaman dasar pada capaian pembelajaran yang dipelajari.';
  }

  let maxItem = scoredTps[0];
  let minItem = scoredTps[0];

  for (let i = 1; i < scoredTps.length; i++) {
    if (scoredTps[i].nilai > maxItem.nilai) maxItem = scoredTps[i];
    if (scoredTps[i].nilai < minItem.nilai) minItem = scoredTps[i];
  }

  const teksMax = maxItem.narasi.charAt(0).toLowerCase() + maxItem.narasi.slice(1);
  const teksMin = minItem.narasi.charAt(0).toLowerCase() + minItem.narasi.slice(1);

  if (maxItem.index === minItem.index || maxItem.nilai === minItem.nilai) {
    if (maxItem.nilai >= 85) {
      return 'Menunjukkan penguasaan yang sangat istimewa dan konsisten dalam ' + teksMax + '.';
    }
    return 'Menunjukkan pemahaman yang baik dan merata dalam ' + teksMax + '.';
  }

  const predikatMax = maxItem.nilai >= 85
    ? 'Menunjukkan penguasaan sangat baik'
    : 'Menunjukkan pemahaman yang baik';

  const predikatMin = minItem.nilai < 75
    ? 'namun perlu pendampingan serta penguatan lebih lanjut'
    : 'serta perlu pemantapan berkelanjutan';

  return predikatMax + ' dalam ' + teksMax + ', ' + predikatMin + ' dalam ' + teksMin + '.';
}

/**
 * 5. LOGIKA BACKEND: AUTO-DESKRIPSI EKSTRAKURIKULER
 */
function generateAutoDeskripsiEkstra(namaEkstra, predikat) {
  const nama = namaEkstra ? namaEkstra.trim() : 'ekstrakurikuler';
  switch (predikat) {
    case 'Sangat Baik':
      return 'Sangat aktif, berdedikasi tinggi, dan menunjukkan penguasaan teknik serta keterampilan yang unggul dalam kegiatan ' + nama + '.';
    case 'Baik':
      return 'Aktif mengikuti rangkaian latihan, disiplin, dan terampil dalam menguasai materi kegiatan ' + nama + '.';
    case 'Cukup':
      return 'Cukup aktif mengikuti kegiatan ' + nama + ', diharapkan lebih konsisten meningkatkan kehadiran dan latihan mandiri.';
    case 'Kurang':
      return 'Perlu motivasi dan bimbingan untuk meningkatkan keaktifan serta komitmen dalam kegiatan ' + nama + '.';
    default:
      return 'Aktif berpartisipasi dalam kegiatan ' + nama + '.';
  }
}

/**
 * 6. LOGIKA BACKEND: PERINGKAT TERSELUBUNG & CATATAN WALI KELAS HYBRID
 * Peringkat hanya dicatat di backend Sheet Leger_Nilai. Dilarang dimunculkan di cetakan rapor!
 */
function prosesLegerDanPeringkatTerselubung(semester) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetLeger = ss.getSheetByName(SHEET_NAMES.LEGER_NILAI);
  if (!sheetLeger) return [];

  const data = sheetLeger.getDataRange().getValues();
  if (data.length <= 1) return [];

  const baris = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (Number(row[3]) === Number(semester)) {
      baris.push({
        rowIndex: i + 1,
        nis: String(row[0]),
        nama: row[1],
        kelas: row[2],
        semester: row[3],
        totalNilai: Number(row[14]) || 0,
        rataRata: Number(row[15]) || 0,
        customCatatan: row[18] ? String(row[18]).trim() : '',
        statusKenaikan: row[20] || ''
      });
    }
  }

  baris.sort(function(a, b) { return b.rataRata - a.rataRata; });
  const total = baris.length;

  baris.forEach(function(item, idx) {
    const rank = idx + 1;
    let persentil = 'Middle 60%';
    const topCutoff = Math.max(1, Math.ceil(total * 0.10));
    const bottomCutoff = Math.max(topCutoff + 1, Math.floor(total * 0.70));

    if (rank <= topCutoff) {
      persentil = 'Top 10%';
    } else if (rank > bottomCutoff) {
      persentil = 'Bottom 30%';
    }

    let catatanFinal = item.customCatatan;
    if (!catatanFinal || catatanFinal === '') {
      if (persentil === 'Top 10%') {
        catatanFinal = 'Pertahankan prestasi gemilang, ketekunan belajar, dan keluhuran budi pekertimu. Tetaplah menjadi pribadi yang rendah hati, gemar berbagi kebaikan kepada sesama, serta terus asah potensi diri untuk meraih cita-cita mulia.';
      } else if (persentil === 'Middle 60%') {
        catatanFinal = 'Pencapaian belajar ananda sudah baik dan menunjukkan kemajuan yang membanggakan. Terus tingkatkan kedisiplinan, keberanian dalam bertanya, serta perluas wawasan dengan gemar membaca agar capaian berikutnya semakin unggul.';
      } else {
        catatanFinal = 'Tetap bersemangat dan jangan berkecil hati. Setiap tantangan adalah peluang untuk bertumbuh. Tingkatkan fokus saat pembelajaran, rutin mengulang materi di rumah, dan jangan ragu untuk berdiskusi dengan guru maupun teman.';
      }
    }

    // Tulis ke Sheet Leger (1-based index)
    sheetLeger.getRange(item.rowIndex, 17).setValue(rank); // Kolom 17: Peringkat Terselubung
    sheetLeger.getRange(item.rowIndex, 18).setValue(persentil); // Kolom 18: Persentil Kategori
    sheetLeger.getRange(item.rowIndex, 20).setValue(catatanFinal); // Kolom 20: Catatan Final
  });

  return baris;
}

/**
 * 7. PENGAMBILAN DATA LENGKAP SISWA
 */
function getRaporDataLengkap(nis, semester) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetS = ss.getSheetByName(SHEET_NAMES.DATA_SISWA);
  const dataS = sheetS.getDataRange().getValues();
  let siswa = null;
  for (let i = 1; i < dataS.length; i++) {
    if (String(dataS[i][0]) === String(nis)) {
      siswa = {
        nis: dataS[i][0], nisn: dataS[i][1], nama: dataS[i][2], kelas: dataS[i][3],
        fase: dataS[i][4], tempatLahir: dataS[i][5], tanggalLahir: dataS[i][6],
        alamat: dataS[i][9], orangTua: dataS[i][10] + ' / ' + dataS[i][11]
      };
      break;
    }
  }

  return {
    siswa: siswa,
    semester: Number(semester)
  };
}
`;
