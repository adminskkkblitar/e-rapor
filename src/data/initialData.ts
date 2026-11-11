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
import { DIMENSI_8_PROFIL_LULUSAN } from '../utils/raporCalculations';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    nama: 'Dian Natalia Widiasih, S.Psi',
    nip: '-',
    role: 'admin',
    password: 'admin123',
    email: 'kepala.sekolah@kalamkudusblitar.sch.id',
  },
  {
    id: 'user-wali',
    nama: 'Petrus Apriprasetyo, S.Pd',
    nip: '-',
    role: 'wali_kelas',
    password: 'wali123',
    email: 'petrusapriprasetyo54@guru.sd.belajar.id',
  },
  {
    id: 'user-pak',
    nama: 'Budi Hartono, S.Th',
    nip: '-',
    role: 'guru_mapel',
    kodeMapel: 'PAK-01',
    namaMapel: 'Pendidikan Agama Kristen & Budi Pekerti',
    password: 'guru123',
  },
  {
    id: 'user-pjok',
    nama: 'Wahyu Hidayat, S.Pd',
    nip: '-',
    role: 'guru_mapel',
    kodeMapel: 'PJOK-07',
    namaMapel: 'Pendidikan Jasmani dan Olahraga',
    password: 'guru123',
  },
  {
    id: 'user-bing',
    nama: 'Sarah Wijaya, S.Pd',
    nip: '-',
    role: 'guru_mapel',
    kodeMapel: 'BING-08',
    namaMapel: 'Bahasa Inggris',
    password: 'guru123',
  },
  {
    id: 'user-sb',
    nama: 'Grace Melati, S.Sn',
    nip: '-',
    role: 'guru_mapel',
    kodeMapel: 'SB-06',
    namaMapel: 'Seni Musik',
    password: 'guru123',
  },
  {
    id: 'user-bj',
    nama: 'Siti Rahayu, S.Pd',
    nip: '-',
    role: 'guru_mapel',
    kodeMapel: 'BJ-09',
    namaMapel: 'Bahasa Jawa',
    password: 'guru123',
  },
  {
    id: 'user-komp',
    nama: 'Rizky Pratama, S.Kom',
    nip: '-',
    role: 'guru_mapel',
    kodeMapel: 'KOMP-10',
    namaMapel: 'Komputer',
    password: 'guru123',
  },
];

export const INITIAL_PROFIL_SEKOLAH: ProfilSekolah = {
  namaSekolah: 'SD KRISTEN KALAM KUDUS BLITAR',
  npsn: '-',
  alamatSekolah: 'Dsn. Tambak',
  kelurahan: 'Pagergunung',
  kecamatan: 'Kesamben',
  kotaKabupaten: 'Blitar',
  provinsi: 'Jawa Timur',
  kodePos: '-',
  telepon: '-',
  email: '-',
  website: '-',
  namaKepalaSekolah: 'Dian Natalia Widiasih, S.Psi',
  nipKepalaSekolah: '-',
  namaWaliKelas: 'Petrus Apriprasetyo, S.Pd',
  nipWaliKelas: '-',
  titimangsaTempat: 'Blitar',
  titimangsaTanggal: '20 Desember 2025',
  tahunPelajaran: '2025/2026',
  semesterAktif: 2,
};

export const INITIAL_SISWA: DataSiswa[] = [
  {
    nis: '230101',
    nisn: '0158352348',
    nama: 'ADRY GRACIO SURYAJAYA',
    kelas: 'V',
    fase: 'Fase C (Kelas V)',
    tempatLahir: 'Blitar',
    tanggalLahir: '14 Maret 2014',
    jenisKelamin: 'L',
    agama: 'Kristen Protestan',
    alamat: 'Dsn. Tambak, RT 02/RW 03, Pagergunung, Kesamben, Blitar',
    namaAyah: 'SURYA WIJAYA',
    namaIbu: 'GRACE SANTOSO',
    pekerjaanAyah: 'WIRASWASTA',
    pekerjaanIbu: 'IBU RUMAH TANGGA',
    alamatOrtuJalan: 'Dsn. Tambak RT 02/RW 03',
    alamatOrtuKelurahan: 'Pagergunung',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567890',
  },
  {
    nis: '230102',
    nisn: '0158352349',
    nama: 'CLARA GABRIELLA SIMANJUNTAK',
    kelas: 'V',
    fase: 'Fase C (Kelas V)',
    tempatLahir: 'Blitar',
    tanggalLahir: '05 Mei 2014',
    jenisKelamin: 'P',
    agama: 'Kristen Protestan',
    alamat: 'Dsn. Tambak, RT 01/RW 02, Pagergunung, Kesamben',
    namaAyah: 'TOGAR SIMANJUNTAK',
    namaIbu: 'MARITA SILALAHI',
    pekerjaanAyah: 'KARYAWAN SWASTA',
    pekerjaanIbu: 'GURU',
    alamatOrtuJalan: 'Dsn. Tambak RT 01/RW 02',
    alamatOrtuKelurahan: 'Pagergunung',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567891',
  },
  {
    nis: '230103',
    nisn: '0158352350',
    nama: 'VALERIE CELINE TANUWIJAYA',
    kelas: 'V',
    fase: 'Fase C (Kelas V)',
    tempatLahir: 'Surabaya',
    tanggalLahir: '29 Juli 2014',
    jenisKelamin: 'P',
    agama: 'Kristen Katolik',
    alamat: 'Jl. Merdeka No. 12, Kesamben, Blitar',
    namaAyah: 'WELLY TANUWIJAYA',
    namaIbu: 'LINDA HARTANTO',
    pekerjaanAyah: 'WIRASWASTA',
    pekerjaanIbu: 'WIRASWASTA',
    alamatOrtuJalan: 'Jl. Merdeka No. 12',
    alamatOrtuKelurahan: 'Kesamben',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567892',
  },
  {
    nis: '230104',
    nisn: '0158352351',
    nama: 'JONATHAN TIMOTHY PRATAMA',
    kelas: 'V',
    fase: 'Fase C (Kelas V)',
    tempatLahir: 'Blitar',
    tanggalLahir: '18 Oktober 2014',
    jenisKelamin: 'L',
    agama: 'Kristen Protestan',
    alamat: 'Dsn. Krajan, Pagergunung, Kesamben',
    namaAyah: 'HENDRA PRATAMA',
    namaIbu: 'RUTH WIDODO',
    pekerjaanAyah: 'PNS',
    pekerjaanIbu: 'KARYAWAN',
    alamatOrtuJalan: 'Dsn. Krajan No. 4',
    alamatOrtuKelurahan: 'Pagergunung',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567893',
  },
  {
    nis: '230105',
    nisn: '0158352352',
    nama: 'MICHAEL SAMUEL KUSUMA',
    kelas: 'V',
    fase: 'Fase C (Kelas V)',
    tempatLahir: 'Malang',
    tanggalLahir: '11 Januari 2014',
    jenisKelamin: 'L',
    agama: 'Kristen Protestan',
    alamat: 'Dsn. Tambak RT 03/RW 03, Pagergunung',
    namaAyah: 'SAMUEL KUSUMA',
    namaIbu: 'YULIANA',
    pekerjaanAyah: 'WIRASWASTA',
    pekerjaanIbu: 'IBU RUMAH TANGGA',
    alamatOrtuJalan: 'Dsn. Tambak RT 03/RW 03',
    alamatOrtuKelurahan: 'Pagergunung',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567894',
  },
  {
    nis: '230106',
    nisn: '0158352353',
    nama: 'REBECCA NATALIE WIJAYA',
    kelas: 'V',
    fase: 'Fase C (Kelas V)',
    tempatLahir: 'Blitar',
    tanggalLahir: '22 Agustus 2014',
    jenisKelamin: 'P',
    agama: 'Kristen Protestan',
    alamat: 'Dsn. Sumberarum, Kesamben, Blitar',
    namaAyah: 'DANIEL WIJAYA',
    namaIbu: 'ESTER LIANTO',
    pekerjaanAyah: 'WIRASWASTA',
    pekerjaanIbu: 'WIRASWASTA',
    alamatOrtuJalan: 'Dsn. Sumberarum No. 8',
    alamatOrtuKelurahan: 'Pagergunung',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567895',
  },
  {
    nis: '230107',
    nisn: '0152573944',
    nama: 'AUREL AFCELLA SINURAT',
    namaPanggilan: 'Aurel',
    kelas: 'IV',
    fase: 'Fase B (Kelas IV)',
    tempatLahir: 'Blitar',
    tanggalLahir: '12 September 2015',
    jenisKelamin: 'P',
    agama: 'Kristen Protestan',
    alamat: 'Dsn. Tambak, RT 03/RW 02, Pagergunung, Kesamben',
    namaAyah: 'HOTMAN SINURAT',
    namaIbu: 'ESTER MARBUN',
    pekerjaanAyah: 'WIRASWASTA',
    pekerjaanIbu: 'IBU RUMAH TANGGA',
    alamatOrtuJalan: 'Dsn. Tambak RT 03/RW 02',
    alamatOrtuKelurahan: 'Pagergunung',
    alamatOrtuKecamatan: 'Kesamben',
    alamatOrtuKota: 'Kab. Blitar',
    alamatOrtuProvinsi: 'Jawa Timur',
    namaWali: '-',
    pekerjaanWali: '-',
    alamatWali: '-',
    telepon: '081234567896',
  },
];

function buat25Tp(subjekSingkat: string, topik: string[], explicitTp1And2?: [string, string]): string[] {
  const result: string[] = [];
  if (explicitTp1And2) {
    result.push(explicitTp1And2[0]);
    result.push(explicitTp1And2[1]);
  }
  const startIndex = result.length + 1;
  for (let i = startIndex; i <= 25; i++) {
    const topikIdx = (i - 1) % topik.length;
    const topikPilihan = topik[topikIdx];
    const variasi =
      i <= 8
        ? `memahami esensi konsep dasar ${topikPilihan} dalam kehidupan nyata`
        : i <= 16
        ? `menganalisis serta menerapkan prinsip ${topikPilihan} secara kritis dan mandiri`
        : `menciptakan solusi inovatif dan merefleksikan pemecahan masalah ${topikPilihan}`;
    result.push(variasi);
  }
  return result;
}

export const INITIAL_KURIKULUM: MasterKurikulumMapel[] = [
  {
    kodeMapel: 'PAK-01',
    namaMapel: 'Pendidikan Agama Kristen & Budi Pekerti',
    kelompok: 'A',
    cp: 'Peserta didik memahami karya keselamatan Allah, keteladanan Yesus Kristus, hidup beriman dan berpengharapan, serta mewujudkan kasih dan kepedulian terhadap sesama dan alam ciptaan-Nya.',
    atp: 'Memahami kasih Allah, mengasihi sesama manusia tanpa membedakan, menerapkan buah-buah roh dalam kehidupan sehari-hari, dan bertanggung jawab menjaga kelestarian lingkungan ciptaan Tuhan.',
    tpNarasi: buat25Tp('PAK', [
      'makna pemeliharaan dan kasih Allah dalam kehidupan pribadi',
      'keteladanan hidup Yesus Kristus dalam melayani sesama dengan kasih',
      'penerapan nilai kejujuran, pengampunan, dan kerendahan hati',
      'tanggung jawab memelihara keutuhan ciptaan Tuhan di lingkungan sekitar',
      'kebiasaan berdoa, bersyukur, dan membaca firman Tuhan secara teratur',
      'sikap toleransi dan hidup rukun bersama sesama teman dan masyarakat',
    ]),
  },
  {
    kodeMapel: 'PP-02',
    namaMapel: 'Pendidikan Pancasila',
    kelompok: 'A',
    cp: 'Peserta didik memahami makna sila-sila Pancasila, norma dan hukum di masyarakat, identitas keberagaman suku bangsa, serta hak dan kewajiban warga negara dalam bingkai NKRI.',
    atp: 'Menganalisis pengamalan Pancasila, merumuskan kesepakatan norma bersama, menghargai budaya nusantara, dan mempraktikkan musyawarah mufakat.',
    tpNarasi: buat25Tp('PP', [
      'penerapan nilai sila-sila Pancasila dalam gotong royong dan toleransi',
      'kepatuhan terhadap norma tata tertib sekolah dan masyarakat',
      'penghormatan terhadap keragaman budaya dan kearifan lokal',
    ], [
      'mengidentifikasi aturan di sekolah dan lingkungan tempat tinggal',
      'menunjukkan sikap bangga menjadi anak Indonesia yang memiliki bahasa Indonesia sebagai bahasa persatuan di lingkungan sekitar',
    ]),
  },
  {
    kodeMapel: 'BI-03',
    namaMapel: 'Bahasa Indonesia',
    kelompok: 'A',
    cp: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai tujuan, memahami ide pokok teks narasi dan eksplanasi, menulis teks eksposisi dan surat resmi secara santun.',
    atp: 'Menyimak instruksi kompleks, membaca intensif untuk menemukan ide pokok, menulis teks terstruktur dengan kosakata baku, dan berbicara persuasif.',
    tpNarasi: buat25Tp('BI', [
      'menemukan ide pokok dan informasi tersirat pada teks narasi',
      'mengidentifikasi struktur dan kaidah kebahasaan teks eksposisi',
    ], [
      'membaca kata-kata baru dengan fasih dari bacaan dan/atau tayangan yang dipirsa',
      'memahami ide pokok suatu informasi dari teks nonsastra berbentuk teks aural',
    ]),
  },
  {
    kodeMapel: 'MTK-04',
    namaMapel: 'Matematika',
    kelompok: 'A',
    cp: 'Peserta didik dapat menyelesaikan operasi hitung pecahan dan desimal, memahami konsep kelipatan, faktor, bangun ruang, penyajian data diagram, serta penalaran proporsional.',
    atp: 'Mengoperasikan pecahan biasa dan campuran, menghitung volume kubus dan balok, mengolah data statistik sederhana, dan memecahkan soal cerita kontekstual.',
    tpNarasi: buat25Tp('MTK', [
      'operasi hitung penjumlahan dan pengurangan pecahan campuran',
      'perkalian dan pembagian pecahan dengan bilangan bulat',
    ], [
      'menyelesaikan masalah operasi penjumlahan bilangan cacah sampai 10.000',
      'menulis Bilangan cacah sampai 10.000',
    ]),
  },
  {
    kodeMapel: 'IPAS-05',
    namaMapel: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    kelompok: 'A',
    cp: 'Peserta didik memahami sistem pernapasan dan pencernaan manusia, siklus air, perubahan wujud zat, dinamika interaksi sosial, sejarah kerajaan nusantara, dan ketahanan ekonomi lokal.',
    atp: 'Menyelidiki organ tubuh manusia, menguji sifat cahaya dan bunyi, menelusuri peninggalan sejarah daerah, dan merancang proyek konservasi air bersih.',
    tpNarasi: buat25Tp('IPAS', [
      'mekanisme sistem pernapasan dan sirkulasi darah manusia',
      'rantai makanan dan jaring-jaring kehidupan pada ekosistem',
    ], [
      'menyebutkan beberapa contoh perubahan wujud zat seperti mencair, membeku, menguap',
      'menyebutkan berbagai sumber energi yang dikenal dalam kehidupan sehari-hari',
    ]),
  },
  {
    kodeMapel: 'SB-06',
    namaMapel: 'Seni Musik',
    kelompok: 'B',
    cp: 'Peserta didik mengekspresikan diri melalui eksplorasi unsur ritme musik nusantara, tempo, dinamika vokal, dan pengenalan karakter alat musik ritmis maupun melodis.',
    atp: 'Mengimitasi tempo alat musik ritmis atau melodis, mengidentifikasi ragam bunyi instrumen musik, dan menyanyikan lagu nasional dengan intonasi tepat.',
    tpNarasi: buat25Tp('Seni Musik', [
      'mengeksplorasi dinamika nada keras dan lembut pada lagu anak',
      'memainkan pola irama sederhana menggunakan perkusi tubuh',
    ], [
      'mengimitasi tempo alat musik ritmis atau melodis',
      'mengidentifikasi karakteristik ragam alat musik dan bunyi yang dihasilkan',
    ]),
  },
  {
    kodeMapel: 'PJOK-07',
    namaMapel: 'Pendidikan Jasmani dan Olahraga',
    kelompok: 'B',
    cp: 'Peserta didik mempraktikkan keterampilan gerak dasar lokomotor, non-lokomotor, dan manipulatif dalam olahraga permainan, senam kebugaran, serta pembiasaan hidup sehat.',
    atp: 'Menerapkan variasi gerak lokomotor jalan, lari, dan lompat berpasangan/beregu, serta gerak non-lokomotor memutar, mengayun, dan menekuk secara kompak.',
    tpNarasi: buat25Tp('PJOK', [
      'mempraktikkan gerak manipulatif melempar dan menangkap bola kecil',
      'menjaga kebugaran jasmani melalui latihan sirkuit training sederhana',
    ], [
      'menerapkan variasi gerak lokomotor jalan, lari, dan lompat secara berkelompok / berpasangan dengan baik dan benar',
      'menerapkan variasi gerak non lokomotor variasi gerak memutar, mengayun, membungkuk, menekuk,dan meliuk secara berkelompok / berpasangan dengan baik dan benar',
    ]),
  },
  {
    kodeMapel: 'BING-08',
    namaMapel: 'Bahasa Inggris',
    kelompok: 'B',
    cp: 'Peserta didik mampu berinteraksi menggunakan kalimat sederhana bahasa Inggris mengenai aktivitas sehari-hari, preferensi, deskripsi benda, dan instruksi kelas.',
    atp: 'Merespons sapaan ramah, mendeskripsikan kegiatan di waktu luang, memahami teks deskripsi pendek, dan mengekspresikan rasa senang.',
    tpNarasi: buat25Tp('BING', [
      'mengungkapkan kegiatan harian menggunakan simple present tense',
      'mendeskripsikan ciri fisik orang dan hewan peliharaan secara lisan',
    ]),
  },
  {
    kodeMapel: 'BJ-09',
    namaMapel: 'Bahasa Jawa',
    kelompok: 'Muatan Lokal',
    cp: 'Peserta didik memahami teks cerita rakyat (folklore) Jawa, unggah-ungguh basa Jawa dalam percakapan sehari-hari, tembang dolanan, dan aksara Jawa nglegena.',
    atp: 'Mengenal dan memahami unsur intrinsik teks cerita rakyat secara lisan dan tulis, serta melakukan dialog bermain peran dengan unggah-ungguh basa yang santun.',
    tpNarasi: buat25Tp('Bahasa Jawa', [
      'memahami makna isi tembang dolanan Jawa yang sarat pitutur luhur',
      'membaca dan menulis kalimat sederhana beraksara Jawa nglegena',
    ], [
      'mengenal dan memahami unsur intrinsik teks cerita rakyat secara lisan dan tulis',
      'melakukan dialog, bermain peran, bercerita, dengan tatakrama',
    ]),
  },
  {
    kodeMapel: 'KOMP-10',
    namaMapel: 'Komputer',
    kelompok: 'Muatan Lokal',
    cp: 'Peserta didik mengenal perangkat keras dan lunak komputer, pengetikan dokumen sederhana, etika berinternet sehat, serta dasar berpikir komputasional pemecahan masalah.',
    atp: 'Mengoperasikan pengolah kata untuk mengetik dokumen terformat, mengenal fungsi peramban internet, dan mempraktikkan logika pemecahan masalah bertahap.',
    tpNarasi: buat25Tp('Komputer', [
      'mengetik dokumen cerita sederhana menggunakan perangkat lunak pengolah kata',
      'mengenal fungsi komponen perangkat keras input, proses, dan output komputer',
      'mempraktikkan etika keamanan digital dan pemanfaatan internet sehat',
      'menyisipkan gambar dan mengatur tata letak format paragraf dokumen',
      'mengenal algoritma langkah demi langkah dalam pemrograman visual blok dasar',
      'mengelola berkas dan folder penyimpanan data secara rapi dan tertib',
    ]),
  },
];

export function getInitialNilaiFormatif(): NilaiFormatifSiswa[] {
  const data: NilaiFormatifSiswa[] = [];

  INITIAL_SISWA.forEach((siswa, sIdx) => {
    INITIAL_KURIKULUM.forEach((mapel, mIdx) => {
      const baseScore =
        sIdx === 0 ? 92 : // ADRY GRACIO SURYAJAYA (Top 10%)
        sIdx === 1 ? 88 :
        sIdx === 2 ? 86 :
        sIdx === 3 ? 84 :
        sIdx === 4 ? 74 : // Michael (Bottom 30%)
        87;

      const arr: number[] = [];
      if (siswa.nis === '230107') {
        // Sample Rapor from images: Mapel 1, 8, 10 are unassessed (0)
        if (mapel.kodeMapel === 'PAK-01' || mapel.kodeMapel === 'BING-08' || mapel.kodeMapel === 'KOMP-10') {
          for (let i = 0; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'PP-02') {
          arr.push(93, 81); // Max TP1 (93 >= 85 -> sangat baik), Min TP2 (81 < 82 -> cukup baik)
          for (let i = 2; i < 14; i++) arr.push(89);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'BI-03') {
          arr.push(92, 84); // Max TP1 (92 -> sangat baik), Min TP2 (84 -> baik)
          for (let i = 2; i < 14; i++) arr.push(88);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'MTK-04') {
          arr.push(95, 80); // Max TP1 (95 -> sangat baik), Min TP2 (80 -> cukup baik)
          for (let i = 2; i < 14; i++) arr.push(89);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'IPAS-05') {
          arr.push(84, 78); // Max TP1 (84 -> baik), Min TP2 (78 -> cukup baik)
          for (let i = 2; i < 14; i++) arr.push(81);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'SB-06') {
          arr.push(88, 83); // Max TP1 (88 -> sangat baik), Min TP2 (83 -> baik)
          for (let i = 2; i < 14; i++) arr.push(83);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'PJOK-07') {
          arr.push(84, 83); // Max TP1 (84 -> baik), Min TP2 (83 -> baik)
          for (let i = 2; i < 14; i++) arr.push(91);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else if (mapel.kodeMapel === 'BJ-09') {
          arr.push(83, 76); // Max TP1 (83 -> baik), Min TP2 (76 -> cukup baik)
          for (let i = 2; i < 14; i++) arr.push(78);
          for (let i = 14; i < 25; i++) arr.push(0);
        } else {
          for (let i = 0; i < 25; i++) arr.push(0);
        }
      } else {
        for (let i = 0; i < 25; i++) {
          if (i < 14) {
            const jitter = ((i * 3 + mIdx * 2 + sIdx * 5) % 9) - 4;
            let val = baseScore + jitter;
            if (val > 100) val = 100;
            if (val < 60) val = 65;
            if (i === 0) val = Math.min(100, baseScore + 5);
            if (i === 1) val = Math.max(68, baseScore - 6);
            arr.push(val);
          } else {
            arr.push(0);
          }
        }
      }

      data.push({
        nis: siswa.nis,
        kodeMapel: mapel.kodeMapel,
        nilaiTp: arr,
      });
    });
  });

  return data;
}

export function getInitialNilaiSumatif(): NilaiSumatifSiswa[] {
  const data: NilaiSumatifSiswa[] = [];

  INITIAL_SISWA.forEach((siswa, sIdx) => {
    INITIAL_KURIKULUM.forEach((mapel, mIdx) => {
      if (siswa.nis === '230107') {
        let na = 0;
        if (mapel.kodeMapel === 'PP-02') na = 89;
        else if (mapel.kodeMapel === 'BI-03') na = 88;
        else if (mapel.kodeMapel === 'MTK-04') na = 89;
        else if (mapel.kodeMapel === 'IPAS-05') na = 81;
        else if (mapel.kodeMapel === 'SB-06') na = 83;
        else if (mapel.kodeMapel === 'PJOK-07') na = 91;
        else if (mapel.kodeMapel === 'BJ-09') na = 78;

        data.push({
          nis: siswa.nis,
          kodeMapel: mapel.kodeMapel,
          sumatifLm: na > 0 ? [na, na, na, na] : [0, 0, 0, 0],
          sts: na,
          sas: na,
        });
        return;
      }

      const base =
        sIdx === 0 ? 94 :
        sIdx === 1 ? 88 :
        sIdx === 2 ? 86 :
        sIdx === 3 ? 83 :
        sIdx === 4 ? 74 :
        87;

      const lm1 = Math.min(100, Math.max(65, base + ((mIdx % 3) - 1) * 2));
      const lm2 = Math.min(100, Math.max(65, base + (((mIdx + 1) % 3) - 1) * 2));
      const lm3 = Math.min(100, Math.max(65, base + (((mIdx + 2) % 3) - 1) * 2));
      const lm4 = Math.min(100, Math.max(65, base));
      const sts = Math.min(100, Math.max(60, base - 1));
      const sas = Math.min(100, Math.max(60, base + 2));

      data.push({
        nis: siswa.nis,
        kodeMapel: mapel.kodeMapel,
        sumatifLm: [lm1, lm2, lm3, lm4],
        sts,
        sas,
      });
    });
  });

  return data;
}

export function getInitialKokurikuler(): KokurikulerSiswa[] {
  return INITIAL_SISWA.map((siswa, sIdx) => {
    // Kurikulum Deep Learning: Memilih 2-4 Dimensi fokus per semester/projek
    // Default 3 dimensi fokus: D1 (Akhlak Pribadi), D3 (Penalaran Kritis), D6 (Kemandirian & Regulasi Diri)
    const dimensi: KokurikulerSiswa['dimensi'] = [
      {
        id: `koku-${siswa.nis}-1`,
        kode: 'D1',
        namaDimensi: 'Keimanan & Ketakwaan Terhadap Tuhan YME & Berakhlak Mulia',
        kodeSubDimensi: 'D1-1',
        namaSubDimensi: 'Akhlak Pribadi (Integritas & Kejujuran)',
        fokusPembelajaran: 'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi nyata',
        predikat: sIdx === 0 ? 'SB' : 'BSH',
        catatanPerkembangan: 'sudah cakap dalam membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
      },
      {
        id: `koku-${siswa.nis}-2`,
        kode: 'D3',
        namaDimensi: 'Penalaran Kritis & Pemecahan Masalah',
        kodeSubDimensi: 'D3-1',
        namaSubDimensi: 'Mengajukan Pertanyaan & Mengolah Informasi',
        fokusPembelajaran: 'Menyampaikan argumen sederhana secara runtut disertai alasan yang logis',
        predikat: sIdx === 0 ? 'SB' : 'BSH',
        catatanPerkembangan: 'sudah cakap dalam menyampaikan argumen sederhana secara runtut disertai alasan',
      },
      {
        id: `koku-${siswa.nis}-3`,
        kode: 'D6',
        namaDimensi: 'Kemandirian & Regulasi Diri',
        kodeSubDimensi: 'D6-1',
        namaSubDimensi: 'Regulasi Diri & Menetapkan Target Belajar',
        fokusPembelajaran: 'Sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya',
        predikat: sIdx === 0 ? 'SB' : 'BSH',
        catatanPerkembangan: 'sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya',
      },
    ];

    return {
      nis: siswa.nis,
      semester: 2,
      dimensi,
    };
  });
}

export function getInitialEkstrakurikuler(): EkstrakurikulerSiswa[] {
  return [
    {
      nis: '230101',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Praja Muda Karana (Pramuka)',
          predikat: 'Sangat Baik',
          deskripsi: 'Sangat aktif, berdedikasi tinggi, dan menunjukkan kecakapan kepemimpinan regu yang unggul dalam kegiatan Pramuka.',
        },
        {
          id: 'ex-2',
          nama: 'Paduan Suara & Musik',
          predikat: 'Sangat Baik',
          deskripsi: 'Sangat disiplin berlatih vokal, memiliki penghayatan lagu yang baik, dan kompak dalam ansambel musik.',
        },
        {
          id: 'ex-3',
          nama: 'Bulutangkis',
          predikat: 'Baik',
          deskripsi: 'Aktif mengikuti latihan teknik pukulan dan footwork, serta menjunjung tinggi sportivitas bertanding.',
        },
        {
          id: 'ex-4',
          nama: 'Dokter Kecil (UKS)',
          predikat: 'Sangat Baik',
          deskripsi: 'Sigap dan terampil dalam mengampanyekan Perilaku Hidup Bersih dan Sehat (PHBS) di lingkungan sekolah.',
        },
      ],
    },
    {
      nis: '230102',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Praja Muda Karana (Pramuka)',
          predikat: 'Baik',
          deskripsi: 'Aktif dan disiplin mengikuti kegiatan perkemahan serta terampil dalam semaphore dan tali temali.',
        },
        {
          id: 'ex-2',
          nama: 'Seni Tari Tradisional',
          predikat: 'Sangat Baik',
          deskripsi: 'Sangat luwes dan ekspresif dalam memperagakan tarian nusantara pada pentas seni sekolah.',
        },
        {
          id: 'ex-3',
          nama: 'English Club',
          predikat: 'Baik',
          deskripsi: 'Percaya diri dalam berdialog bahasa Inggris sederhana di ruang kelas.',
        },
      ],
    },
    {
      nis: '230103',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Praja Muda Karana (Pramuka)',
          predikat: 'Baik',
          deskripsi: 'Disiplin dan aktif mengikuti latihan rutin kepanduan.',
        },
        {
          id: 'ex-2',
          nama: 'Seni Lukis & Kriya',
          predikat: 'Sangat Baik',
          deskripsi: 'Kreatif dalam memadukan warna cerah serta memiliki goresan kuas yang ekspresif.',
        },
        {
          id: 'ex-3',
          nama: 'Paduan Suara',
          predikat: 'Baik',
          deskripsi: 'Harmonis dalam menyanyikan lagu-lagu pujian dan lagu wajib nasional.',
        },
      ],
    },
    {
      nis: '230104',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Futsal & Sepak Bola',
          predikat: 'Sangat Baik',
          deskripsi: 'Memiliki stamina fisik prima, teknik menggiring bola lincah, dan sportivitas tinggi.',
        },
        {
          id: 'ex-2',
          nama: 'Praja Muda Karana (Pramuka)',
          predikat: 'Baik',
          deskripsi: 'Cekatan dalam mendirikan tenda dan baris berbaris.',
        },
        {
          id: 'ex-3',
          nama: 'Robotika & Coding Pemula',
          predikat: 'Baik',
          deskripsi: 'Antusias mempelajari logika pemrograman blok visual dan perakitan sensor.',
        },
      ],
    },
    {
      nis: '230105',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Praja Muda Karana (Pramuka)',
          predikat: 'Cukup',
          deskripsi: 'Cukup aktif dalam kegiatan kepramukaan, diharapkan lebih konsisten meningkatkan kehadiran.',
        },
        {
          id: 'ex-2',
          nama: 'Bulutangkis',
          predikat: 'Baik',
          deskripsi: 'Giat berlatih pukulan smash dan servis pendek.',
        },
        {
          id: 'ex-3',
          nama: 'Kriya Tangan',
          predikat: 'Cukup',
          deskripsi: 'Mulai memahami teknik menganyam dasar, perlu lebih rapi dalam proses finishing.',
        },
      ],
    },
    {
      nis: '230106',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Praja Muda Karana (Pramuka)',
          predikat: 'Baik',
          deskripsi: 'Aktif, ramah, dan cepat beradaptasi dalam regu putri kepramukaan.',
        },
        {
          id: 'ex-2',
          nama: 'Seni Tari Tradisional',
          predikat: 'Sangat Baik',
          deskripsi: 'Sangat gemulai dan percaya diri saat pentas di hadapan umum.',
        },
        {
          id: 'ex-3',
          nama: 'Dokter Kecil (UKS)',
          predikat: 'Baik',
          deskripsi: 'Peduli terhadap kebersihan lingkungan kelas dan sarana sanitasi.',
        },
      ],
    },
    {
      nis: '230107',
      semester: 2,
      daftarEkstra: [
        {
          id: 'ex-1',
          nama: 'Pramuka',
          predikat: 'Baik',
          deskripsi: 'Cukup Baik dalam mengamalkan Dasa Darma Pramuka',
        },
        {
          id: 'ex-2',
          nama: 'MIPA',
          predikat: 'Sangat Baik',
          deskripsi: 'Sangat Baik dalam mengidentifikasi tiga wujud benda (padat, cair, gas) dan memberikan contoh masing-masing dalam kehidupan sehari-hari.',
        },
      ],
    },
  ];
}

export const INITIAL_ABSENSI: AbsensiSiswa[] = [
  { nis: '230101', semester: 2, sakit: 0, izin: 1, tanpaKeterangan: 0 },
  { nis: '230102', semester: 2, sakit: 1, izin: 0, tanpaKeterangan: 0 },
  { nis: '230103', semester: 2, sakit: 0, izin: 0, tanpaKeterangan: 0 },
  { nis: '230104', semester: 2, sakit: 2, izin: 1, tanpaKeterangan: 0 },
  { nis: '230105', semester: 2, sakit: 3, izin: 2, tanpaKeterangan: 1 },
  { nis: '230106', semester: 2, sakit: 0, izin: 1, tanpaKeterangan: 0 },
  { nis: '230107', semester: 2, sakit: 4, izin: 0, tanpaKeterangan: 0 },
];
