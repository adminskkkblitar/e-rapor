/**
 * Definisi Header Kolom Google Sheets dan Source Code Google Apps Script (Code.gs)
 * Siap untuk diintegrasikan dengan Frontend E-Rapor (Desktop & Mobile Browser)
 */

export interface SheetHeaderDefinition {
  sheetName: string;
  description: string;
  columns: string[];
}

export const GOOGLE_SHEETS_HEADERS: SheetHeaderDefinition[] = [
  {
    sheetName: 'Identitas_Sekolah',
    description:
      'Menyimpan Identitas Sekolah, Kepala Sekolah, Titimangsa, Wali Kelas 1-6, serta daftar Guru Mapel (tersinkron lintas perangkat)',
    columns: [
      'Key',
      'Nama_Sekolah',
      'NPSN',
      'Tahun_Pelajaran',
      'Nama_Kepala_Sekolah',
      'NIP_Kepala_Sekolah',
      'Nama_Wali_Kelas_Default',
      'NIP_Wali_Kelas_Default',
      'Alamat_Sekolah',
      'Kelurahan',
      'Kecamatan',
      'Kota_Kabupaten',
      'Provinsi',
      'Titimangsa_Tempat',
      'Titimangsa_Tanggal',
      'Profil_Lengkap_JSON',
    ],
  },
  {
    sheetName: 'Akun_Guru',
    description:
      'Menyimpan seluruh akun login Administrator, Wali Kelas (1-6), dan Guru Mapel beserta Password masuknya',
    columns: [
      'ID_Akun',
      'Nama_Guru',
      'NIP',
      'Peran_Role',
      'Kelas_Ajar',
      'Kode_Mapel',
      'Nama_Mapel',
      'Password',
      'Email',
    ],
  },
  {
    sheetName: 'Data_Siswa',
    description:
      'Menyimpan identitas lengkap siswa untuk biodata, Sampul Rapor, dan halaman Identitas Peserta Didik',
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
      'Nama_Panggilan',
      'Telepon',
    ],
  },
  {
    sheetName: 'Master_Kurikulum',
    description:
      'Mengikat Mata Pelajaran, CP, ATP, dan teks narasi untuk 25 TP (TP_1 hingga TP_25) serta detail Fase A/B/C',
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
      'Detail_Fase_JSON',
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
      'Deskripsi_Capaian',
    ],
  },
  {
    sheetName: 'Kokurikuler_8_Dimensi',
    description: 'Capaian 8 Dimensi Profil Lulusan Kurikulum Deep Learning (Predikat BB/MB/BSH/SB)',
    columns: [
      'NIS',
      'Semester',
      'Dimensi_1_Predikat',
      'Dimensi_1_Catatan',
      'Dimensi_2_Predikat',
      'Dimensi_2_Catatan',
      'Dimensi_3_Predikat',
      'Dimensi_3_Catatan',
      'Dimensi_4_Predikat',
      'Dimensi_4_Catatan',
      'Dimensi_5_Predikat',
      'Dimensi_5_Catatan',
      'Dimensi_6_Predikat',
      'Dimensi_6_Catatan',
      'Dimensi_7_Predikat',
      'Dimensi_7_Catatan',
      'Dimensi_8_Predikat',
      'Dimensi_8_Catatan',
      'Dimensi_Lengkap_JSON',
    ],
  },
  {
    sheetName: 'Ekstrakurikuler',
    description: 'Mendukung pengisian dinamis kegiatan ekstrakurikuler per siswa',
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
      'Daftar_Ekstra_JSON',
    ],
  },
  {
    sheetName: 'Absensi_Dan_Catatan',
    description: 'Rekapitulasi Absensi (Sakit/Izin/Alpa), Catatan Wali Kelas Custom, dan Status Kenaikan Kelas',
    columns: [
      'NIS',
      'Semester',
      'Sakit',
      'Izin',
      'Tanpa_Keterangan',
      'Catatan_Wali_Kelas_Custom',
      'Status_Kenaikan',
      'Target_Kelas',
    ],
  },
  {
    sheetName: 'Leger_Nilai',
    description:
      'Rekapitulasi lengkap seluruh Nilai Akhir tiap mapel, total nilai, rata-rata, peringkat terselubung, dan status kenaikan kelas',
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
 * Google Apps Script Backend (Code.gs) - Sinkronisasi Penuh Lintas Perangkat
 * Satuan Pendidikan: SD KRISTEN KALAM KUDUS BLITAR
 * Mendukung Sinkronisasi: Identitas Sekolah, Akun & Password Guru, Data Siswa,
 * Master Kurikulum (Fase A-C), Nilai Formatif 25 TP, Sumatif, Kokurikuler,
 * Ekstrakurikuler, Absensi, Catatan Wali Kelas, & Leger Nilai.
 * ============================================================================
 */

const SHEET_NAMES = {
  IDENTITAS_SEKOLAH: 'Identitas_Sekolah',
  AKUN_GURU: 'Akun_Guru',
  DATA_SISWA: 'Data_Siswa',
  MASTER_KURIKULUM: 'Master_Kurikulum',
  NILAI_FORMATIF: 'Nilai_Formatif',
  NILAI_SUMATIF: 'Nilai_Sumatif',
  KOKURIKULER: 'Kokurikuler_8_Dimensi',
  EKSTRAKURIKULER: 'Ekstrakurikuler',
  ABSENSI_CATATAN: 'Absensi_Dan_Catatan',
  LEGER_NILAI: 'Leger_Nilai',
};

/**
 * 1. FUNGSI SETUP OTOMATIS SELURUH SHEET & HEADER (SEKALI KLIK)
 * Pilih fungsi ini di dropdown toolbar Apps Script, lalu klik "Run / Jalankan".
 */
function setupDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const headersConfig = {
    Identitas_Sekolah: [
      'Key', 'Nama_Sekolah', 'NPSN', 'Tahun_Pelajaran', 'Nama_Kepala_Sekolah', 'NIP_Kepala_Sekolah',
      'Nama_Wali_Kelas_Default', 'NIP_Wali_Kelas_Default', 'Alamat_Sekolah', 'Kelurahan', 'Kecamatan',
      'Kota_Kabupaten', 'Provinsi', 'Titimangsa_Tempat', 'Titimangsa_Tanggal', 'Profil_Lengkap_JSON'
    ],
    Akun_Guru: [
      'ID_Akun', 'Nama_Guru', 'NIP', 'Peran_Role', 'Kelas_Ajar', 'Kode_Mapel', 'Nama_Mapel', 'Password', 'Email'
    ],
    Data_Siswa: [
      'NIS', 'NISN', 'Nama_Siswa', 'Kelas', 'Fase', 'Tempat_Lahir', 'Tanggal_Lahir',
      'Jenis_Kelamin', 'Agama', 'Alamat_Siswa', 'Nama_Ayah', 'Nama_Ibu', 'Pekerjaan_Ayah', 'Pekerjaan_Ibu',
      'Alamat_Ortu_Jalan', 'Alamat_Ortu_Desa', 'Alamat_Ortu_Kecamatan', 'Alamat_Ortu_Kota', 'Alamat_Ortu_Provinsi',
      'Nama_Wali', 'Pekerjaan_Wali', 'Alamat_Wali', 'Nama_Panggilan', 'Telepon'
    ],
    Master_Kurikulum: [
      'Kode_Mapel', 'Nama_Mapel', 'Kelompok', 'Capaian_Pembelajaran_CP', 'Alur_Tujuan_Pembelajaran_ATP',
      'TP_1', 'TP_2', 'TP_3', 'TP_4', 'TP_5', 'TP_6', 'TP_7', 'TP_8', 'TP_9', 'TP_10',
      'TP_11', 'TP_12', 'TP_13', 'TP_14', 'TP_15', 'TP_16', 'TP_17', 'TP_18', 'TP_19', 'TP_20',
      'TP_21', 'TP_22', 'TP_23', 'TP_24', 'TP_25', 'Detail_Fase_JSON'
    ],
    Nilai_Formatif: [
      'NIS', 'Kode_Mapel',
      'Nilai_TP_1', 'Nilai_TP_2', 'Nilai_TP_3', 'Nilai_TP_4', 'Nilai_TP_5', 'Nilai_TP_6', 'Nilai_TP_7', 'Nilai_TP_8', 'Nilai_TP_9', 'Nilai_TP_10',
      'Nilai_TP_11', 'Nilai_TP_12', 'Nilai_TP_13', 'Nilai_TP_14', 'Nilai_TP_15', 'Nilai_TP_16', 'Nilai_TP_17', 'Nilai_TP_18', 'Nilai_TP_19', 'Nilai_TP_20',
      'Nilai_TP_21', 'Nilai_TP_22', 'Nilai_TP_23', 'Nilai_TP_24', 'Nilai_TP_25', 'Rata_Formatif'
    ],
    Nilai_Sumatif: [
      'NIS', 'Kode_Mapel', 'Sumatif_LM_1', 'Sumatif_LM_2', 'Sumatif_LM_3', 'Sumatif_LM_4',
      'Rata_LM', 'STS', 'SAS', 'Rata_Sumatif', 'Nilai_Akhir', 'Deskripsi_Capaian'
    ],
    Kokurikuler_8_Dimensi: [
      'NIS', 'Semester',
      'Dimensi_1_Predikat', 'Dimensi_1_Catatan',
      'Dimensi_2_Predikat', 'Dimensi_2_Catatan',
      'Dimensi_3_Predikat', 'Dimensi_3_Catatan',
      'Dimensi_4_Predikat', 'Dimensi_4_Catatan',
      'Dimensi_5_Predikat', 'Dimensi_5_Catatan',
      'Dimensi_6_Predikat', 'Dimensi_6_Catatan',
      'Dimensi_7_Predikat', 'Dimensi_7_Catatan',
      'Dimensi_8_Predikat', 'Dimensi_8_Catatan',
      'Dimensi_Lengkap_JSON'
    ],
    Ekstrakurikuler: [
      'NIS', 'Semester',
      'Ekstra_1_Nama', 'Ekstra_1_Predikat', 'Ekstra_1_Deskripsi',
      'Ekstra_2_Nama', 'Ekstra_2_Predikat', 'Ekstra_2_Deskripsi',
      'Ekstra_3_Nama', 'Ekstra_3_Predikat', 'Ekstra_3_Deskripsi',
      'Ekstra_4_Nama', 'Ekstra_4_Predikat', 'Ekstra_4_Deskripsi',
      'Daftar_Ekstra_JSON'
    ],
    Absensi_Dan_Catatan: [
      'NIS', 'Semester', 'Sakit', 'Izin', 'Tanpa_Keterangan', 'Catatan_Wali_Kelas_Custom', 'Status_Kenaikan', 'Target_Kelas'
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

  Logger.log('Inisialisasi seluruh Sheet Database E-Rapor Berhasil!');
}

/**
 * 2. ENDPOINT API: doGet(e) - MEMBACA SELURUH DATA DARI GOOGLE SHEETS
 * Mendukung:
 * - ?action=test -> Uji koneksi Web App
 * - ?action=readAll -> Membaca Akun Guru, Identitas Sekolah, Siswa, Kurikulum, Nilai, Kokurikuler, Ekstra, Absensi
 * - ?action=readSiswa -> Membaca daftar siswa saja
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || 'readAll';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'test') {
      return jsonResponse({
        status: 'success',
        message: 'Koneksi Google Apps Script & Google Sheets Berhasil Terhubung!',
        spreadsheetId: ss.getId(),
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'init') {
      setupDatabaseSheets();
      return jsonResponse({
        status: 'success',
        message: 'Inisialisasi sheet berhasil dilakukan.',
        timestamp: new Date().toISOString()
      });
    }

    // 1. Baca Identitas Sekolah
    let sekolah = null;
    const sheetSekolah = ss.getSheetByName(SHEET_NAMES.IDENTITAS_SEKOLAH);
    if (sheetSekolah && sheetSekolah.getLastRow() > 1) {
      const sekolahValues = sheetSekolah.getDataRange().getValues();
      const row = sekolahValues[1];
      if (row[15]) {
        try {
          sekolah = JSON.parse(String(row[15]));
        } catch (errParseSekolah) {
          sekolah = null;
        }
      }
      if (!sekolah && row[1]) {
        sekolah = {
          namaSekolah: String(row[1] || ''),
          npsn: String(row[2] || ''),
          tahunPelajaran: String(row[3] || ''),
          namaKepalaSekolah: String(row[4] || ''),
          nipKepalaSekolah: String(row[5] || '-'),
          namaWaliKelas: String(row[6] || ''),
          nipWaliKelas: String(row[7] || '-'),
          alamatSekolah: String(row[8] || ''),
          kelurahan: String(row[9] || ''),
          kecamatan: String(row[10] || ''),
          kotaKabupaten: String(row[11] || ''),
          provinsi: String(row[12] || ''),
          titimangsaTempat: String(row[13] || ''),
          titimangsaTanggal: String(row[14] || '')
        };
      }
    }

    // 2. Baca Akun Guru & Password
    const sheetAkun = ss.getSheetByName(SHEET_NAMES.AKUN_GURU);
    const akunValues = sheetAkun ? sheetAkun.getDataRange().getValues() : [];
    const userAccounts = [];
    for (let i = 1; i < akunValues.length; i++) {
      const r = akunValues[i];
      if (r[0] && r[1]) {
        userAccounts.push({
          id: String(r[0]),
          nama: String(r[1]),
          nip: String(r[2] || '-'),
          role: String(r[3] || 'wali_kelas'),
          kelasAjar: r[4] ? String(r[4]) : undefined,
          kodeMapel: r[5] ? String(r[5]) : undefined,
          namaMapel: r[6] ? String(r[6]) : undefined,
          password: String(r[7] || 'guru123'),
          email: r[8] ? String(r[8]) : ''
        });
      }
    }

    // 3. Baca Data Siswa
    const sheetSiswa = ss.getSheetByName(SHEET_NAMES.DATA_SISWA);
    const dataSiswaValues = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
    const siswaList = [];
    for (let i = 1; i < dataSiswaValues.length; i++) {
      const r = dataSiswaValues[i];
      if (r[0]) {
        siswaList.push({
          nis: String(r[0]),
          nisn: String(r[1] || ''),
          nama: String(r[2] || ''),
          kelas: String(r[3] || 'V'),
          fase: String(r[4] || 'Fase C (Kelas V)'),
          tempatLahir: String(r[5] || ''),
          tanggalLahir: String(r[6] || ''),
          jenisKelamin: String(r[7] || 'L'),
          agama: String(r[8] || 'Kristen Protestan'),
          alamat: String(r[9] || ''),
          namaAyah: String(r[10] || ''),
          namaIbu: String(r[11] || ''),
          pekerjaanAyah: String(r[12] || ''),
          pekerjaanIbu: String(r[13] || ''),
          alamatOrtuJalan: String(r[14] || ''),
          alamatOrtuKelurahan: String(r[15] || ''),
          alamatOrtuKecamatan: String(r[16] || ''),
          alamatOrtuKota: String(r[17] || ''),
          alamatOrtuProvinsi: String(r[18] || ''),
          namaWali: String(r[19] || '-'),
          pekerjaanWali: String(r[20] || '-'),
          alamatWali: String(r[21] || '-'),
          namaPanggilan: r[22] ? String(r[22]) : undefined,
          telepon: r[23] ? String(r[23]) : undefined
        });
      }
    }

    if (action === 'readSiswa') {
      return jsonResponse({ status: 'success', data: siswaList });
    }

    // 4. Baca Master Kurikulum
    const sheetKurikulum = ss.getSheetByName(SHEET_NAMES.MASTER_KURIKULUM);
    const kurikulumValues = sheetKurikulum ? sheetKurikulum.getDataRange().getValues() : [];
    const kurikulumList = [];
    for (let i = 1; i < kurikulumValues.length; i++) {
      const r = kurikulumValues[i];
      if (r[0]) {
        const tpNarasi = [];
        for (let t = 5; t <= 29; t++) {
          tpNarasi.push(String(r[t] || ''));
        }
        let detailExtra = {};
        if (r[30]) {
          try {
            detailExtra = JSON.parse(String(r[30]));
          } catch (errKuri) {
            detailExtra = {};
          }
        }
        kurikulumList.push(Object.assign({
          kodeMapel: String(r[0]),
          namaMapel: String(r[1]),
          kelompok: String(r[2] || 'A'),
          cp: String(r[3] || ''),
          atp: String(r[4] || ''),
          tpNarasi: tpNarasi
        }, detailExtra));
      }
    }

    // 5. Baca Nilai Formatif
    const sheetFormatif = ss.getSheetByName(SHEET_NAMES.NILAI_FORMATIF);
    const formatifValues = sheetFormatif ? sheetFormatif.getDataRange().getValues() : [];
    const nilaiFormatifList = [];
    for (let i = 1; i < formatifValues.length; i++) {
      const r = formatifValues[i];
      if (r[0] && r[1]) {
        const nilaiTp = [];
        for (let t = 2; t < 27; t++) {
          nilaiTp.push(Number(r[t]) || 0);
        }
        nilaiFormatifList.push({
          nis: String(r[0]),
          kodeMapel: String(r[1]),
          nilaiTp: nilaiTp
        });
      }
    }

    // 6. Baca Nilai Sumatif (Index: 0=NIS, 1=Kode, 2..5=LM1..4, 6=Rata_LM, 7=STS, 8=SAS)
    const sheetSumatif = ss.getSheetByName(SHEET_NAMES.NILAI_SUMATIF);
    const sumatifValues = sheetSumatif ? sheetSumatif.getDataRange().getValues() : [];
    const nilaiSumatifList = [];
    for (let i = 1; i < sumatifValues.length; i++) {
      const r = sumatifValues[i];
      if (r[0] && r[1]) {
        nilaiSumatifList.push({
          nis: String(r[0]),
          kodeMapel: String(r[1]),
          sumatifLm: [Number(r[2]) || 0, Number(r[3]) || 0, Number(r[4]) || 0, Number(r[5]) || 0],
          sts: Number(r[7]) || 0,
          sas: Number(r[8]) || 0
        });
      }
    }

    // 7. Baca Kokurikuler 8 Dimensi
    const sheetKoku = ss.getSheetByName(SHEET_NAMES.KOKURIKULER);
    const kokuValues = sheetKoku ? sheetKoku.getDataRange().getValues() : [];
    const kokurikulerList = [];
    for (let i = 1; i < kokuValues.length; i++) {
      const r = kokuValues[i];
      if (r[0]) {
        let dimensiArr = [];
        if (r[18]) {
          try {
            dimensiArr = JSON.parse(String(r[18]));
          } catch (errKoku) {
            dimensiArr = [];
          }
        }
        kokurikulerList.push({
          nis: String(r[0]),
          semester: Number(r[1]) === 1 ? 1 : 2,
          dimensi: dimensiArr
        });
      }
    }

    // 8. Baca Ekstrakurikuler
    const sheetEkstra = ss.getSheetByName(SHEET_NAMES.EKSTRAKURIKULER);
    const ekstraValues = sheetEkstra ? sheetEkstra.getDataRange().getValues() : [];
    const ekstrakurikulerList = [];
    for (let i = 1; i < ekstraValues.length; i++) {
      const r = ekstraValues[i];
      if (r[0]) {
        let daftarEkstra = [];
        if (r[14]) {
          try {
            daftarEkstra = JSON.parse(String(r[14]));
          } catch (errEkstra) {
            daftarEkstra = [];
          }
        } else {
          for (let k = 0; k < 4; k++) {
            const baseIdx = 2 + k * 3;
            if (r[baseIdx]) {
              daftarEkstra.push({
                id: 'eks-' + r[0] + '-' + (k + 1),
                namaKegiatan: String(r[baseIdx]),
                predikat: String(r[baseIdx + 1] || 'Baik'),
                deskripsi: String(r[baseIdx + 2] || '')
              });
            }
          }
        }
        ekstrakurikulerList.push({
          nis: String(r[0]),
          semester: Number(r[1]) === 1 ? 1 : 2,
          daftarEkstra: daftarEkstra
        });
      }
    }

    // 9. Baca Absensi, Catatan Custom & Status Kenaikan
    const sheetAbs = ss.getSheetByName(SHEET_NAMES.ABSENSI_CATATAN);
    const absValues = sheetAbs ? sheetAbs.getDataRange().getValues() : [];
    const absensiList = [];
    const customNotes = {};
    const statusKenaikanMap = {};
    for (let i = 1; i < absValues.length; i++) {
      const r = absValues[i];
      if (r[0]) {
        const nisStr = String(r[0]);
        absensiList.push({
          nis: nisStr,
          semester: Number(r[1]) === 1 ? 1 : 2,
          sakit: Number(r[2]) || 0,
          izin: Number(r[3]) || 0,
          tanpaKeterangan: Number(r[4]) || 0
        });
        if (r[5] !== undefined && r[5] !== '') {
          customNotes[nisStr] = String(r[5]);
        }
        if (r[6]) {
          statusKenaikanMap[nisStr] = {
            status: String(r[6]),
            targetKelas: String(r[7] || '')
          };
        }
      }
    }

    return jsonResponse({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        sekolah: sekolah,
        userAccounts: userAccounts,
        siswaList: siswaList,
        kurikulum: kurikulumList,
        nilaiFormatif: nilaiFormatifList,
        nilaiSumatif: nilaiSumatifList,
        kokurikulerList: kokurikulerList,
        ekstrakurikulerList: ekstrakurikulerList,
        absensiList: absensiList,
        customNotes: customNotes,
        statusKenaikanMap: statusKenaikanMap
      }
    });

  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: 'Gagal membaca data dari Google Sheets: ' + err.toString()
    });
  }
}

/**
 * 3. ENDPOINT API: doPost(e) - MENYIMPAN SELURUH DATA E-RAPOR KE GOOGLE SHEETS
 * Menerima payload JSON dari frontend (Auto-Sync & tombol manual "Simpan ke Google Sheets").
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'Payload data kosong.' });
    }

    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const updatedSheets = [];

    // 1. Simpan Identitas Sekolah & Penugasan Guru (Wali Kelas 1-6 + Guru Mapel)
    if (payload.sekolah && payload.sekolah.namaSekolah) {
      const s = payload.sekolah;
      const sheetSekolah =
        ss.getSheetByName(SHEET_NAMES.IDENTITAS_SEKOLAH) ||
        ss.insertSheet(SHEET_NAMES.IDENTITAS_SEKOLAH);
      const rows = [
        [
          'Key', 'Nama_Sekolah', 'NPSN', 'Tahun_Pelajaran', 'Nama_Kepala_Sekolah', 'NIP_Kepala_Sekolah',
          'Nama_Wali_Kelas_Default', 'NIP_Wali_Kelas_Default', 'Alamat_Sekolah', 'Kelurahan', 'Kecamatan',
          'Kota_Kabupaten', 'Provinsi', 'Titimangsa_Tempat', 'Titimangsa_Tanggal', 'Profil_Lengkap_JSON'
        ],
        [
          'PROFIL_UTAMA',
          String(s.namaSekolah || ''),
          String(s.npsn || ''),
          String(s.tahunPelajaran || ''),
          String(s.namaKepalaSekolah || ''),
          String(s.nipKepalaSekolah || '-'),
          String(s.namaWaliKelas || ''),
          String(s.nipWaliKelas || '-'),
          String(s.alamatSekolah || ''),
          String(s.kelurahan || ''),
          String(s.kecamatan || ''),
          String(s.kotaKabupaten || ''),
          String(s.provinsi || ''),
          String(s.titimangsaTempat || ''),
          String(s.titimangsaTanggal || ''),
          JSON.stringify(s)
        ]
      ];
      sheetSekolah.clearContents();
      sheetSekolah.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.IDENTITAS_SEKOLAH);
    }

    // 2. Simpan Akun Guru & Password
    if (payload.userAccounts && Array.isArray(payload.userAccounts) && payload.userAccounts.length > 0) {
      const sheetAkun =
        ss.getSheetByName(SHEET_NAMES.AKUN_GURU) ||
        ss.insertSheet(SHEET_NAMES.AKUN_GURU);
      const rows = [
        ['ID_Akun', 'Nama_Guru', 'NIP', 'Peran_Role', 'Kelas_Ajar', 'Kode_Mapel', 'Nama_Mapel', 'Password', 'Email']
      ];
      payload.userAccounts.forEach(function(u) {
        rows.push([
          String(u.id || ''),
          String(u.nama || ''),
          String(u.nip || '-'),
          String(u.role || 'wali_kelas'),
          String(u.kelasAjar || ''),
          String(u.kodeMapel || ''),
          String(u.namaMapel || ''),
          String(u.password || 'guru123'),
          String(u.email || '')
        ]);
      });
      sheetAkun.clearContents();
      sheetAkun.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.AKUN_GURU);
    }

    // 3. Simpan Data Siswa
    if (payload.siswaList && Array.isArray(payload.siswaList) && payload.siswaList.length > 0) {
      const sheetSiswa = ss.getSheetByName(SHEET_NAMES.DATA_SISWA) || ss.insertSheet(SHEET_NAMES.DATA_SISWA);
      const rows = [
        [
          'NIS', 'NISN', 'Nama_Siswa', 'Kelas', 'Fase', 'Tempat_Lahir', 'Tanggal_Lahir',
          'Jenis_Kelamin', 'Agama', 'Alamat_Siswa', 'Nama_Ayah', 'Nama_Ibu', 'Pekerjaan_Ayah', 'Pekerjaan_Ibu',
          'Alamat_Ortu_Jalan', 'Alamat_Ortu_Desa', 'Alamat_Ortu_Kecamatan', 'Alamat_Ortu_Kota', 'Alamat_Ortu_Provinsi',
          'Nama_Wali', 'Pekerjaan_Wali', 'Alamat_Wali', 'Nama_Panggilan', 'Telepon'
        ]
      ];

      payload.siswaList.forEach(function(s) {
        rows.push([
          String(s.nis), String(s.nisn || ''), String(s.nama), String(s.kelas || 'V'), String(s.fase || 'Fase C (Kelas V)'),
          String(s.tempatLahir || ''), String(s.tanggalLahir || ''), String(s.jenisKelamin || 'L'), String(s.agama || 'Kristen Protestan'),
          String(s.alamat || ''), String(s.namaAyah || ''), String(s.namaIbu || ''), String(s.pekerjaanAyah || ''), String(s.pekerjaanIbu || ''),
          String(s.alamatOrtuJalan || ''), String(s.alamatOrtuKelurahan || ''), String(s.alamatOrtuKecamatan || ''), String(s.alamatOrtuKota || ''),
          String(s.alamatOrtuProvinsi || ''), String(s.namaWali || '-'), String(s.pekerjaanWali || '-'), String(s.alamatWali || '-'),
          String(s.namaPanggilan || ''), String(s.telepon || '')
        ]);
      });

      sheetSiswa.clearContents();
      sheetSiswa.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.DATA_SISWA);
    }

    // 4. Simpan Master Kurikulum (termasuk Fase A/B/C JSON)
    if (payload.kurikulum && Array.isArray(payload.kurikulum) && payload.kurikulum.length > 0) {
      const sheetKuri =
        ss.getSheetByName(SHEET_NAMES.MASTER_KURIKULUM) ||
        ss.insertSheet(SHEET_NAMES.MASTER_KURIKULUM);
      const header = [
        'Kode_Mapel', 'Nama_Mapel', 'Kelompok', 'Capaian_Pembelajaran_CP', 'Alur_Tujuan_Pembelajaran_ATP'
      ];
      for (let i = 1; i <= 25; i++) header.push('TP_' + i);
      header.push('Detail_Fase_JSON');
      const rows = [header];

      payload.kurikulum.forEach(function(k) {
        const row = [
          String(k.kodeMapel || ''),
          String(k.namaMapel || ''),
          String(k.kelompok || 'A'),
          String(k.cp || ''),
          String(k.atp || '')
        ];
        const tps = Array.isArray(k.tpNarasi) ? k.tpNarasi : [];
        for (let i = 0; i < 25; i++) {
          row.push(String(tps[i] || ''));
        }
        row.push(JSON.stringify({
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
          fileAtpLampiran: k.fileAtpLampiran
        }));
        rows.push(row);
      });

      sheetKuri.clearContents();
      sheetKuri.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.MASTER_KURIKULUM);
    }

    // 5. Simpan Nilai Formatif
    if (payload.nilaiFormatif && Array.isArray(payload.nilaiFormatif) && payload.nilaiFormatif.length > 0) {
      const sheetFormatif = ss.getSheetByName(SHEET_NAMES.NILAI_FORMATIF) || ss.insertSheet(SHEET_NAMES.NILAI_FORMATIF);
      const rows = [];
      const header = ['NIS', 'Kode_Mapel'];
      for (let i = 1; i <= 25; i++) header.push('Nilai_TP_' + i);
      header.push('Rata_Formatif');
      rows.push(header);

      payload.nilaiFormatif.forEach(function(item) {
        const row = [String(item.nis), String(item.kodeMapel)];
        let total = 0;
        let count = 0;
        for (let i = 0; i < 25; i++) {
          const val = item.nilaiTp && item.nilaiTp[i] ? Number(item.nilaiTp[i]) : 0;
          row.push(val);
          if (val > 0) {
            total += val;
            count++;
          }
        }
        const avg = count > 0 ? Math.round((total / count) * 10) / 10 : 0;
        row.push(avg);
        rows.push(row);
      });

      sheetFormatif.clearContents();
      sheetFormatif.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.NILAI_FORMATIF);
    }

    // 6. Simpan Nilai Sumatif
    if (payload.nilaiSumatif && Array.isArray(payload.nilaiSumatif) && payload.nilaiSumatif.length > 0) {
      const sheetSumatif = ss.getSheetByName(SHEET_NAMES.NILAI_SUMATIF) || ss.insertSheet(SHEET_NAMES.NILAI_SUMATIF);
      const rows = [
        ['NIS', 'Kode_Mapel', 'Sumatif_LM_1', 'Sumatif_LM_2', 'Sumatif_LM_3', 'Sumatif_LM_4', 'Rata_LM', 'STS', 'SAS', 'Rata_Sumatif', 'Nilai_Akhir', 'Deskripsi_Capaian']
      ];

      payload.nilaiSumatif.forEach(function(item) {
        const lm1 = item.sumatifLm && item.sumatifLm[0] ? Number(item.sumatifLm[0]) : 0;
        const lm2 = item.sumatifLm && item.sumatifLm[1] ? Number(item.sumatifLm[1]) : 0;
        const lm3 = item.sumatifLm && item.sumatifLm[2] ? Number(item.sumatifLm[2]) : 0;
        const lm4 = item.sumatifLm && item.sumatifLm[3] ? Number(item.sumatifLm[3]) : 0;
        const sts = item.sts ? Number(item.sts) : 0;
        const sas = item.sas ? Number(item.sas) : 0;

        let lmTotal = 0;
        let lmCount = 0;
        [lm1, lm2, lm3, lm4].forEach(function(v) { if (v > 0) { lmTotal += v; lmCount++; } });
        const rataLm = lmCount > 0 ? lmTotal / lmCount : 0;

        let sumatifSum = 0;
        let sumatifDiv = 0;
        if (rataLm > 0) { sumatifSum += rataLm * 2; sumatifDiv += 2; }
        if (sts > 0) { sumatifSum += sts; sumatifDiv += 1; }
        if (sas > 0) { sumatifSum += sas; sumatifDiv += 1; }
        const rataSumatif = sumatifDiv > 0 ? Math.round((sumatifSum / sumatifDiv) * 10) / 10 : 0;

        rows.push([
          String(item.nis), String(item.kodeMapel), lm1, lm2, lm3, lm4,
          Math.round(rataLm * 10) / 10, sts, sas, rataSumatif,
          item.nilaiAkhir ? Number(item.nilaiAkhir) : rataSumatif,
          item.deskripsiCapaian || '-'
        ]);
      });

      sheetSumatif.clearContents();
      sheetSumatif.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.NILAI_SUMATIF);
    }

    // 7. Simpan Kokurikuler 8 Dimensi
    if (payload.kokurikulerList && Array.isArray(payload.kokurikulerList) && payload.kokurikulerList.length > 0) {
      const sheetKoku =
        ss.getSheetByName(SHEET_NAMES.KOKURIKULER) ||
        ss.insertSheet(SHEET_NAMES.KOKURIKULER);
      const rows = [
        [
          'NIS', 'Semester',
          'Dimensi_1_Predikat', 'Dimensi_1_Catatan',
          'Dimensi_2_Predikat', 'Dimensi_2_Catatan',
          'Dimensi_3_Predikat', 'Dimensi_3_Catatan',
          'Dimensi_4_Predikat', 'Dimensi_4_Catatan',
          'Dimensi_5_Predikat', 'Dimensi_5_Catatan',
          'Dimensi_6_Predikat', 'Dimensi_6_Catatan',
          'Dimensi_7_Predikat', 'Dimensi_7_Catatan',
          'Dimensi_8_Predikat', 'Dimensi_8_Catatan',
          'Dimensi_Lengkap_JSON'
        ]
      ];
      payload.kokurikulerList.forEach(function(k) {
        const dims = Array.isArray(k.dimensi) ? k.dimensi : [];
        const row = [String(k.nis), Number(k.semester || payload.semester || 2)];
        for (let d = 1; d <= 8; d++) {
          const found = dims.find(function(item) { return item.kode === 'D' + d; });
          row.push(found ? String(found.predikat || '') : '');
          row.push(found ? String(found.catatanPerkembangan || '') : '');
        }
        row.push(JSON.stringify(dims));
        rows.push(row);
      });
      sheetKoku.clearContents();
      sheetKoku.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.KOKURIKULER);
    }

    // 8. Simpan Ekstrakurikuler
    if (payload.ekstrakurikulerList && Array.isArray(payload.ekstrakurikulerList) && payload.ekstrakurikulerList.length > 0) {
      const sheetEkstra =
        ss.getSheetByName(SHEET_NAMES.EKSTRAKURIKULER) ||
        ss.insertSheet(SHEET_NAMES.EKSTRAKURIKULER);
      const rows = [
        [
          'NIS', 'Semester',
          'Ekstra_1_Nama', 'Ekstra_1_Predikat', 'Ekstra_1_Deskripsi',
          'Ekstra_2_Nama', 'Ekstra_2_Predikat', 'Ekstra_2_Deskripsi',
          'Ekstra_3_Nama', 'Ekstra_3_Predikat', 'Ekstra_3_Deskripsi',
          'Ekstra_4_Nama', 'Ekstra_4_Predikat', 'Ekstra_4_Deskripsi',
          'Daftar_Ekstra_JSON'
        ]
      ];
      payload.ekstrakurikulerList.forEach(function(eItem) {
        const list = Array.isArray(eItem.daftarEkstra) ? eItem.daftarEkstra : [];
        const row = [String(eItem.nis), Number(eItem.semester || payload.semester || 2)];
        for (let idx = 0; idx < 4; idx++) {
          const eks = list[idx];
          row.push(eks ? String(eks.namaKegiatan || '') : '');
          row.push(eks ? String(eks.predikat || '') : '');
          row.push(eks ? String(eks.deskripsi || '') : '');
        }
        row.push(JSON.stringify(list));
        rows.push(row);
      });
      sheetEkstra.clearContents();
      sheetEkstra.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.EKSTRAKURIKULER);
    }

    // 9. Simpan Absensi, Catatan Wali Kelas Custom & Status Kenaikan
    if (payload.absensiList && Array.isArray(payload.absensiList) && payload.absensiList.length > 0) {
      const sheetAbs =
        ss.getSheetByName(SHEET_NAMES.ABSENSI_CATATAN) ||
        ss.insertSheet(SHEET_NAMES.ABSENSI_CATATAN);
      const customNotes = payload.customNotes || {};
      const statusMap = payload.statusKenaikanMap || {};
      const rows = [
        ['NIS', 'Semester', 'Sakit', 'Izin', 'Tanpa_Keterangan', 'Catatan_Wali_Kelas_Custom', 'Status_Kenaikan', 'Target_Kelas']
      ];
      payload.absensiList.forEach(function(a) {
        const nisStr = String(a.nis);
        const st = statusMap[nisStr] || {};
        rows.push([
          nisStr,
          Number(a.semester || payload.semester || 2),
          Number(a.sakit || 0),
          Number(a.izin || 0),
          Number(a.tanpaKeterangan || 0),
          String(customNotes[nisStr] || ''),
          String(st.status || ''),
          String(st.targetKelas || '')
        ]);
      });
      sheetAbs.clearContents();
      sheetAbs.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      updatedSheets.push(SHEET_NAMES.ABSENSI_CATATAN);
    }

    return jsonResponse({
      status: 'success',
      message: 'Seluruh data E-Rapor berhasil disinkronkan dan disimpan ke Google Sheets!',
      timestamp: new Date().toISOString(),
      updatedSheets: updatedSheets
    });

  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: 'Gagal menyimpan ke Google Sheets: ' + err.toString()
    });
  }
}

/**
 * HELPER: Mengembalikan JSON Response
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
