import {
  FaseKurikulum,
  ItemKokurikuler8Dimensi,
  MasterKurikulumMapel,
  PredikatEkstra,
  PredikatKokurikuler,
  ProfilSekolah,
  RaporMapelKalkulasi,
  TingkatKelasSD,
} from '../types/rapor';

export interface SubDimensiProfil {
  kode: string;
  nama: string;
  deskripsi: string;
  narasiSB: string;
  narasiBSH: string;
  narasiMB: string;
  narasiBB: string;
}

export interface Dimensi8ProfilDef {
  kode: string;
  namaDimensi: string;
  fokus: string;
  indikator: string;
  subDimensi: SubDimensiProfil[];
}

export const DIMENSI_8_PROFIL_LULUSAN: Dimensi8ProfilDef[] = [
  {
    kode: 'D1',
    namaDimensi: 'Keimanan & Ketakwaan Terhadap Tuhan YME & Berakhlak Mulia',
    fokus: 'Penerapan nilai-nilai spiritual, integritas moral, kejujuran, dan empati dalam interaksi harian.',
    indikator: 'Menjalankan ibadah dengan kesadaran diri, bersikap santun kepada sesama, dan menjaga kelestarian lingkungan.',
    subDimensi: [
      {
        kode: 'D1-1',
        nama: 'Akhlak Pribadi (Integritas & Kejujuran)',
        deskripsi: 'Membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi nyata',
        narasiSB: 'sudah sangat cakap dan konsisten dalam membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi kehidupan nyata',
        narasiBSH: 'sudah cakap dalam membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata',
        narasiMB: 'mulai terbiasa menunjukkan sikap jujur dan tanggung jawab dengan bimbingan berkala',
        narasiBB: 'perlu pendampingan untuk membiasakan bersikap jujur dan bertanggung jawab dalam belajar',
      },
      {
        kode: 'D1-2',
        nama: 'Akhlak Beragama & Ibadah',
        deskripsi: 'Pelaksanaan ibadah teratur dan penghayatan ajaran kasih kepada sesama ciptaan Tuhan',
        narasiSB: 'sangat tekun beribadah dengan kesadaran murni serta menghayati ajaran kasih dalam tindakan nyata',
        narasiBSH: 'tertib menjalankan kewajiban ibadah serta menghormati sesama teman',
        narasiMB: 'mulai menunjukkan kebiasaan berdoa dan beribadah secara terarah',
        narasiBB: 'perlu motivasi dan pendampingan dalam pembiasaan doa dan ibadah',
      },
      {
        kode: 'D1-3',
        nama: 'Akhlak Kepada Alam & Lingkungan',
        deskripsi: 'Kepedulian terhadap kelestarian alam dan menjaga kebersihan lingkungan sekolah',
        narasiSB: 'sangat peduli terhadap kelestarian alam dan proaktif menginisiasi aksi kebersihan lingkungan',
        narasiBSH: 'peduli menjaga kebersihan serta merawat sarana dan tanaman di lingkungan sekolah',
        narasiMB: 'mulai menjaga kebersihan barang pribadi dan lingkungan sekitarnya',
        narasiBB: 'perlu dorongan konsisten untuk membuang sampah pada tempatnya dan merawat sarana',
      },
    ],
  },
  {
    kode: 'D2',
    namaDimensi: 'Kewargaan, Kebangsaan & Kebhinekaan Global',
    fokus: 'Penghayatan identitas bangsa, toleransi terhadap keberagaman budaya, dan kepedulian sosial kemasyarakatan.',
    indikator: 'Menghargai perbedaan pendapat, bangga menggunakan produk dalam negeri, dan aktif dalam aksi kebajikan bersama.',
    subDimensi: [
      {
        kode: 'D2-1',
        nama: 'Mengenal & Menghargai Budaya Nusantara',
        deskripsi: 'Menghargai keberagaman adat, suku, bahasa, dan bangga sebagai anak Indonesia',
        narasiSB: 'sangat bangga mengekspresikan identitas bangsa serta menghargai keanekaragaman budaya daerah',
        narasiBSH: 'mampu menghargai perbedaan budaya, suku, dan bahasa teman dengan sikap toleran',
        narasiMB: 'mulai mengenal ragam kebudayaan nusantara dan berteman tanpa membeda-bedakan',
        narasiBB: 'perlu pengenalan lebih lanjut mengenai kekayaan budaya dan nilai persatuan bangsa',
      },
      {
        kode: 'D2-2',
        nama: 'Komunikasi & Interaksi Antar Budaya',
        deskripsi: 'Memperhatikan perasaan orang lain dan menghindari prasangka dalam pergaulan',
        narasiSB: 'sangat luwes berinteraksi dengan latar belakang beragam tanpa prasangka',
        narasiBSH: 'bersikap ramah dan terbuka dalam bergaul dengan seluruh rekan di sekolah',
        narasiMB: 'mulai membuka diri dalam kelompok belajar yang majemuk',
        narasiBB: 'perlu dibimbing agar lebih percaya diri berbaur dengan teman dari berbagai latar belakang',
      },
    ],
  },
  {
    kode: 'D3',
    namaDimensi: 'Penalaran Kritis & Pemecahan Masalah',
    fokus: 'Kemampuan menganalisis informasi, mengevaluasi bukti, bernalar logis, dan memecahkan masalah kontekstual.',
    indikator: 'Mampu mengajukan pertanyaan reflektif, membedakan fakta dan opini, serta menyusun solusi sistematis.',
    subDimensi: [
      {
        kode: 'D3-1',
        nama: 'Mengajukan Pertanyaan & Mengolah Informasi',
        deskripsi: 'Menyampaikan argumen sederhana secara runtut disertai alasan yang logis',
        narasiSB: 'sangat mahir mengajukan pertanyaan kritis dan menyampaikan argumen runtut disertai alasan kuat',
        narasiBSH: 'sudah cakap dalam menyampaikan argumen sederhana secara runtut disertai alasan',
        narasiMB: 'mulai mampu mengemukakan pendapat sederhana saat berdiskusi',
        narasiBB: 'perlu pendampingan untuk berani bertanya dan menyusun alasan dalam berpendapat',
      },
      {
        kode: 'D3-2',
        nama: 'Analisis & Pemecahan Masalah Kontekstual',
        deskripsi: 'Mengidentifikasi akar permasalahan dan merumuskan langkah solusi yang masuk akal',
        narasiSB: 'sangat tajam dalam menganalisis masalah kontekstual serta mengusulkan solusi inovatif',
        narasiBSH: 'mampu memecahkan masalah belajar kontekstual melalui tahapan berpikir logis',
        narasiMB: 'mulai mencoba mencari cara penyelesaian masalah dengan arahan guru',
        narasiBB: 'perlu latihan bertahap dalam memecahkan soal berbasis pemecahan masalah nyata',
      },
    ],
  },
  {
    kode: 'D4',
    namaDimensi: 'Kreativitas, Inovasi & Eksplorasi',
    fokus: 'Menghasilkan gagasan orisinal, karya kreatif, dan fleksibilitas dalam berpikir untuk menemukan jalan baru.',
    indikator: 'Menunjukkan inisiatif dalam mencipta karya, berani mencoba metode alternatif, dan mengapresiasi kebaruan ide.',
    subDimensi: [
      {
        kode: 'D4-1',
        nama: 'Menghasilkan Gagasan & Karya Orisinal',
        deskripsi: 'Mencetuskan ide kreatif dan mengekspresikannya ke dalam karya nyata atau proyek',
        narasiSB: 'sangat kaya gagasan orisinal dan antusias menghasilkan karya proyek yang inspiratif',
        narasiBSH: 'mampu mengekspresikan ide kreatif ke dalam karya nyata sesuai minat dan bakatnya',
        narasiMB: 'mulai menunjukkan minat mencoba ide baru dalam berkarya',
        narasiBB: 'perlu pemantik dan dorongan agar tidak ragu memunculkan ide orisinal',
      },
      {
        kode: 'D4-2',
        nama: 'Keluwesan Berpikir & Adaptasi Solusi',
        deskripsi: 'Mencoba berbagai metode alternatif ketika menghadapi kebuntuan masalah',
        narasiSB: 'sangat luwes mencari pendekatan baru ketika menghadapi kendala dalam bereksplorasi',
        narasiBSH: 'terbuka mencoba cara alternatif dalam menyelesaikan tantangan tugas',
        narasiMB: 'mulai dapat menerima masukan untuk mengubah pendekatan kerja',
        narasiBB: 'perlu bimbingan agar tidak mudah menyerah saat menghadapi kendala teknis karya',
      },
    ],
  },
  {
    kode: 'D5',
    namaDimensi: 'Kolaborasi, Gotong Royong & Empati',
    fokus: 'Bekerja sama dalam tim, berbagi peran, kepedulian terhadap kebutuhan kelompok, dan komunikasi asertif.',
    indikator: 'Mampu berkoordinasi dengan rekan sekelompok, berbagi sumber daya secara adil, dan tanggap membantu teman.',
    subDimensi: [
      {
        kode: 'D5-1',
        nama: 'Kerjasama & Berbagi Peran Kelompok',
        deskripsi: 'Aktif berkolaborasi, mendengarkan rekan satu tim, dan berkontribusi adil',
        narasiSB: 'sangat proaktif memimpin kerja tim, mengayomi anggota, dan berbagi tugas secara adil',
        narasiBSH: 'mampu bekerja sama secara kompak dan menyelesaikan tugas kelompok dengan tanggung jawab',
        narasiMB: 'mulai terlibat dalam kegiatan kelompok meski masih perlu dorongan keaktifan',
        narasiBB: 'perlu bimbingan dalam membagi tugas dan menyelaraskan diri dalam kerja tim',
      },
      {
        kode: 'D5-2',
        nama: 'Kepedulian Sosial & Saling Membantu',
        deskripsi: 'Peka terhadap kesulitan teman dan sigap menawarkan bantuan tanpa pamrih',
        narasiSB: 'sangat tanggap dan penuh empati memberikan bantuan kepada teman yang membutuhkan',
        narasiBSH: 'menunjukkan kepedulian dan rela menolong rekan yang mengalami kesulitan belajar',
        narasiMB: 'bersedia membantu rekan jika diminta bantuan',
        narasiBB: 'perlu ditumbuhkan kepekaan sosial terhadap teman di lingkungan kelas',
      },
    ],
  },
  {
    kode: 'D6',
    namaDimensi: 'Kemandirian & Regulasi Diri',
    fokus: 'Tanggung jawab atas proses dan hasil belajar, pengelolaan emosi, waktu, serta komitmen target pribadi.',
    indikator: 'Menyelesaikan tugas secara mandiri tanpa bergantung berlebih, disiplin waktu, dan memiliki motivasi intrinsik.',
    subDimensi: [
      {
        kode: 'D6-1',
        nama: 'Regulasi Diri & Menetapkan Target Belajar',
        deskripsi: 'Sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya',
        narasiSB: 'sangat mandiri dan penuh komitmen dalam menetapkan serta menuntaskan target belajar pribadi',
        narasiBSH: 'sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya',
        narasiMB: 'mulai dapat mengatur jadwal dan waktu belajar mandiri di bawah arahan',
        narasiBB: 'perlu pendampingan intensif dalam mengelola waktu dan menuntaskan tugas mandiri',
      },
      {
        kode: 'D6-2',
        nama: 'Disiplin & Tanggung Jawab Belajar',
        deskripsi: 'Konsisten menyelesaikan tugas tanpa menunda-nunda dan bertanggung jawab atas hasil kerja',
        narasiSB: 'sangat disiplin, teliti, dan memiliki motivasi intrinsik tinggi dalam menyelesaikan tugas',
        narasiBSH: 'disiplin menuntaskan tugas tepat waktu dengan hasil yang memuaskan',
        narasiMB: 'mulai menunjukkan kedisiplinan menyelesaikan tugas harian',
        narasiBB: 'perlu pengawasan berkala agar tugas dapat diselesaikan tepat waktu',
      },
    ],
  },
  {
    kode: 'D7',
    namaDimensi: 'Komunikasi Efektif & Literasi Digital',
    fokus: 'Menyampaikan gagasan secara jelas, santun, terstruktur, serta memanfaatkan teknologi secara bijak.',
    indikator: 'Mampu mempresentasikan hasil belajar dengan percaya diri, menyimak secara aktif, dan etis bermedia digital.',
    subDimensi: [
      {
        kode: 'D7-1',
        nama: 'Presentasi & Komunikasi Lisan/Tulis',
        deskripsi: 'Menyampaikan gagasan secara percaya diri, santun, dan terstruktur di hadapan orang lain',
        narasiSB: 'sangat percaya diri dan artikulatif dalam mempresentasikan hasil karya di depan umum',
        narasiBSH: 'mampu menyampaikan ide secara runtut, santun, dan jelas dalam forum presentasi',
        narasiMB: 'mulai berani berbicara di depan kelompok dengan dorongan positif',
        narasiBB: 'perlu dilatih keberanian untuk berbicara dan mempresentasikan hasil tugas',
      },
      {
        kode: 'D7-2',
        nama: 'Etika Digital & Pemanfaatan Teknologi',
        deskripsi: 'Menggunakan teknologi informasi secara aman, etis, dan produktif untuk menunjang belajar',
        narasiSB: 'sangat bijak memanfaatkan teknologi digital untuk eksplorasi pengetahuan positif',
        narasiBSH: 'mematuhi etika berinternet dan terampil memanfaatkan gawai untuk kegiatan belajar',
        narasiMB: 'mulai memahami aturan penggunaan perangkat digital secara sehat',
        narasiBB: 'perlu pendampingan terkait batas waktu dan keamanan dalam pemanfaatan gawai',
      },
    ],
  },
  {
    kode: 'D8',
    namaDimensi: 'Kesehatan Fisik, Kebugaran & Karakter Tangguh',
    fokus: 'Pola hidup sehat, ketahanan mental, sportivitas, dan kegigihan (grit) dalam menghadapi tantangan.',
    indikator: 'Menjaga kebersihan dan kebugaran jasmani, menunjukkan daya juang saat menghadapi kesulitan belajar.',
    subDimensi: [
      {
        kode: 'D8-1',
        nama: 'Kebugaran Jasmani & Sportivitas',
        deskripsi: 'Menjaga vitalitas fisik, aktif berolahraga, dan menjunjung tinggi sportivitas',
        narasiSB: 'memiliki kebugaran prima, sportivitas tinggi, dan menjadi teladan hidup sehat',
        narasiBSH: 'bersemangat dalam aktivitas olahraga serta mempraktikkan sportivitas dalam bermain',
        narasiMB: 'mulai membiasakan diri aktif bergerak dan menjaga stamina tubuh',
        narasiBB: 'perlu dorongan untuk lebih antusias mengikuti aktivitas fisik dan olahraga',
      },
      {
        kode: 'D8-2',
        nama: 'Daya Juang (Grit) & Ketahanan Mental',
        deskripsi: 'Pantang menyerah saat menghadapi kesulitan belajar dan optimis mencari jalan keluar',
        narasiSB: 'memiliki daya juang luar biasa, tangguh, dan optimis saat menghadapi tantangan kompleks',
        narasiBSH: 'pantang menyerah dan terus berusaha ketika menemui materi belajar yang sulit',
        narasiMB: 'mulai mau mengulang latihan ketika mengalami kegagalan pertama',
        narasiBB: 'perlu motivasi berkelanjutan agar tidak cepat berkecil hati saat menemui kesulitan',
      },
    ],
  },
];

/**
 * Hitung rata-rata formatif dari TP yang terisi (>0)
 */
export function hitungRataFormatif(nilaiTp: number[]): number {
  if (!nilaiTp || nilaiTp.length === 0) return 0;
  const valid = nilaiTp.filter((val) => typeof val === 'number' && val > 0);
  if (valid.length === 0) return 0;
  const total = valid.reduce((acc, curr) => acc + curr, 0);
  return Math.round((total / valid.length) * 10) / 10;
}

/**
 * Hitung rata-rata sumatif (Lingkup Materi, STS, SAS)
 */
export function hitungRataSumatif(sumatifLm: number[], sts: number, sas: number): number {
  const validLm = (sumatifLm || []).filter((val) => typeof val === 'number' && val > 0);
  const rataLm = validLm.length > 0 ? validLm.reduce((a, b) => a + b, 0) / validLm.length : 0;
  
  const components: number[] = [];
  if (rataLm > 0) components.push(rataLm * 2); // Bobot Lingkup Materi x2
  if (sts > 0) components.push(sts);
  if (sas > 0) components.push(sas);

  if (components.length === 0) return 0;

  const pembagi = (rataLm > 0 ? 2 : 0) + (sts > 0 ? 1 : 0) + (sas > 0 ? 1 : 0);
  if (pembagi === 0) return 0;

  const sumTotal = components.reduce((a, b) => a + b, 0);
  return Math.round((sumTotal / pembagi) * 10) / 10;
}

/**
 * Hitung Nilai Akhir (NA) dari Rata Formatif dan Rata Sumatif
 */
export function hitungNilaiAkhir(rataFormatif: number, rataSumatif: number): number {
  if (rataFormatif > 0 && rataSumatif > 0) {
    return Math.round((rataFormatif + rataSumatif) / 2);
  }
  if (rataSumatif > 0) return Math.round(rataSumatif);
  if (rataFormatif > 0) return Math.round(rataFormatif);
  return 0;
}

/**
 * Seleksi Max TP dan Min TP untuk menghasilkan Auto-Deskripsi Mapel
 */
export function generateAutoDeskripsiMapel(
  nilaiTp: number[],
  tpNarasi: string[],
  namaMapel?: string,
  studentName?: string
): {
  deskripsi: string;
  deskripsiMax: string;
  deskripsiMin: string;
  maxIndex: number;
  maxNilai: number;
  minIndex: number;
  minNilai: number;
} {
  const scoredTps: { index: number; nilai: number; narasi: string }[] = [];
  const callName = studentName ? `Ananda ${studentName.toUpperCase()}` : 'Ananda';

  for (let i = 0; i < 25; i++) {
    const val = nilaiTp?.[i] || 0;
    const rawNarasi = tpNarasi?.[i] || `tujuan pembelajaran ke-${i + 1}`;
    if (val > 0) {
      scoredTps.push({ index: i, nilai: val, narasi: rawNarasi.trim() });
    }
  }

  if (scoredTps.length === 0) {
    return {
      deskripsi: callName,
      deskripsiMax: callName,
      deskripsiMin: callName,
      maxIndex: 0,
      maxNilai: 0,
      minIndex: 0,
      minNilai: 0,
    };
  }

  // Cari nilai tertinggi dan terendah
  let maxItem = scoredTps[0];
  let minItem = scoredTps[0];

  for (const item of scoredTps) {
    if (item.nilai > maxItem.nilai) maxItem = item;
    if (item.nilai < minItem.nilai) minItem = item;
  }

  // Format narasi edukasi
  const narasiMax = maxItem.narasi.charAt(0).toLowerCase() + maxItem.narasi.slice(1);
  const narasiMin = minItem.narasi.charAt(0).toLowerCase() + minItem.narasi.slice(1);

  const predikatMax =
    maxItem.nilai >= 85
      ? 'menunjukkan penguasaan yang sangat baik'
      : 'menunjukkan penguasaan yang baik';

  const predikatMin =
    minItem.nilai < 75
      ? 'perlu pendampingan dan bimbingan'
      : minItem.nilai < 82
      ? 'menunjukkan penguasaan yang cukup baik'
      : 'menunjukkan penguasaan yang baik';

  const deskripsiMax = `${callName} ${predikatMax} dalam ${narasiMax}.`;
  const deskripsiMin =
    maxItem.index === minItem.index
      ? `${callName} menunjukkan pemahaman yang konsisten dan baik dalam ${narasiMin}.`
      : `${callName} ${predikatMin} dalam ${narasiMin}.`;

  const kalimatCombined = `${deskripsiMax} ${deskripsiMin}`;

  return {
    deskripsi: kalimatCombined,
    deskripsiMax,
    deskripsiMin,
    maxIndex: maxItem.index,
    maxNilai: maxItem.nilai,
    minIndex: minItem.index,
    minNilai: minItem.nilai,
  };
}

/**
 * Auto-Deskripsi Ekstrakurikuler berdasarkan Predikat
 */
export function generateAutoDeskripsiEkstra(namaEkstra: string, predikat: PredikatEkstra): string {
  const cleanEkstra = namaEkstra ? namaEkstra.trim() : 'ekstrakurikuler';
  switch (predikat) {
    case 'Sangat Baik':
      return `Sangat aktif, berdedikasi tinggi, dan menunjukkan penguasaan teknik serta keterampilan yang unggul dalam kegiatan ${cleanEkstra}.`;
    case 'Baik':
      return `Aktif mengikuti rangkaian latihan, disiplin, dan terampil dalam menguasai materi kegiatan ${cleanEkstra}.`;
    case 'Cukup':
      return `Cukup aktif mengikuti kegiatan ${cleanEkstra}, diharapkan lebih konsisten meningkatkan kehadiran dan latihan mandiri.`;
    case 'Kurang':
      return `Perlu bimbingan serta motivasi untuk meningkatkan keaktifan dan komitmen dalam kegiatan ${cleanEkstra}.`;
    default:
      return `Aktif berpartisipasi dalam kegiatan ${cleanEkstra}.`;
  }
}

/**
 * Peringkat Terselubung dan Pembagian Persentil (Top 10%, Middle 60%, Bottom 30%)
 */
export function kalkulasiPeringkatTerselubung(
  daftarRataRata: { nis: string; rataRata: number }[]
): Map<string, { ranking: number; totalSiswa: number; persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%' }> {
  // Sort descending
  const sorted = [...daftarRataRata].sort((a, b) => b.rataRata - a.rataRata);
  const total = sorted.length;
  const resultMap = new Map<string, { ranking: number; totalSiswa: number; persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%' }>();

  sorted.forEach((item, idx) => {
    const rank = idx + 1;
    let persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%' = 'Middle 60%';

    const topCutoff = Math.max(1, Math.ceil(total * 0.1));
    const bottomCutoff = Math.max(topCutoff + 1, Math.floor(total * 0.7));

    if (rank <= topCutoff) {
      persentil = 'Top 10%';
    } else if (rank > bottomCutoff) {
      persentil = 'Bottom 30%';
    } else {
      persentil = 'Middle 60%';
    }

    resultMap.set(item.nis, {
      ranking: rank,
      totalSiswa: total,
      persentil,
    });
  });

  return resultMap;
}

/**
 * Catatan Wali Kelas Hybrid (Jika kosong, auto-generate dari persentil tanpa menyebut ranking)
 */
export function generateCatatanWaliKelas(
  persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%',
  customNote?: string
): string {
  if (customNote && customNote.trim().length > 0) {
    return customNote.trim();
  }

  switch (persentil) {
    case 'Top 10%':
      return 'Pertahankan prestasi gemilang, ketekunan belajar, dan keluhuran budi pekertimu. Tetaplah menjadi pribadi yang rendah hati, gemar berbagi kebaikan kepada sesama, serta terus asah potensi diri untuk meraih cita-cita mulia.';
    case 'Middle 60%':
      return 'Pencapaian belajar ananda sudah baik dan menunjukkan kemajuan yang membanggakan. Terus tingkatkan kedisiplinan, keberanian dalam bertanya, serta perluas wawasan dengan gemar membaca agar capaian berikutnya semakin unggul.';
    case 'Bottom 30%':
      return 'Tetap bersemangat dan jangan berkecil hati. Setiap tantangan adalah peluang untuk bertumbuh. Tingkatkan fokus saat pembelajaran, rutin mengulang materi di rumah, dan jangan ragu untuk berdiskusi dengan guru maupun teman.';
    default:
      return 'Tingkatkan terus semangat belajar dan kembangkan bakat serta karakter positif dalam setiap kesempatan.';
  }
}

/**
 * Label Predikat Kokurikuler
 */
export function getLabelPredikatKokurikuler(pred: PredikatKokurikuler): string {
  switch (pred) {
    case 'SB':
      return 'Sangat Berkembang (SB)';
    case 'BSH':
      return 'Berkembang Sesuai Harapan (BSH)';
    case 'MB':
      return 'Mulai Berkembang (MB)';
    case 'BB':
      return 'Belum Berkembang (BB)';
    default:
      return pred;
  }
}

/**
 * Sintesis Narasi Kokurikuler dari 2-4 Dimensi Terpilih untuk Kotak Rapor Cetak
 */
export function sintesisNarasiKokurikuler(
  dimensiList: ItemKokurikuler8Dimensi[],
  namaPanggilan?: string
): string {
  if (!dimensiList || dimensiList.length === 0) {
    return 'Ananda menunjukkan perkembangan karakter positif dalam kegiatan kokurikuler dan pembiasaan budaya sekolah.';
  }

  const clauses: string[] = [];

  dimensiList.forEach((item) => {
    // If user provided custom catatanPerkembangan
    if (item.catatanPerkembangan && item.catatanPerkembangan.trim().length > 0) {
      let text = item.catatanPerkembangan.trim();
      if (text.endsWith('.')) text = text.slice(0, -1);
      // normalize leading 'ananda'
      text = text.replace(/^ananda\s+/i, '');
      clauses.push(text);
      return;
    }

    // Lookup sub-dimension text
    const dimDef = DIMENSI_8_PROFIL_LULUSAN.find((d) => d.kode === item.kode);
    const subDef =
      dimDef?.subDimensi.find((s) => s.kode === item.kodeSubDimensi) || dimDef?.subDimensi[0];

    if (subDef) {
      const pred = item.predikat || 'BSH';
      const text =
        pred === 'SB'
          ? subDef.narasiSB
          : pred === 'BSH'
          ? subDef.narasiBSH
          : pred === 'MB'
          ? subDef.narasiMB
          : subDef.narasiBB;
      clauses.push(text);
    }
  });

  if (clauses.length === 0) {
    return 'Ananda sudah cakap dalam membiasakan bersikap jujur, adil, peduli, dan bertanggung jawab dalam interaksi dalam kehidupan nyata, sudah cakap dalam menyampaikan argumen sederhana secara runtut disertai alasan, sudah cakap dalam berlatih menetapkan tujuan pembelajaran untuk dirinya,';
  }

  // Join clauses with standard Indonesian style
  let result = 'Ananda ';
  if (clauses.length === 1) {
    result += clauses[0] + '.';
  } else {
    // Check if clauses already have 'sudah cakap' or similar
    const cleaned = clauses.map((c) => c.trim());
    result += cleaned.join(', ') + '.';
  }

  return result;
}

export const TINGKAT_KELAS_SD: {
  kode: TingkatKelasSD;
  angka: string;
  label: string;
  fase: FaseKurikulum;
  targetKenaikan: string;
}[] = [
  { kode: 'I', angka: '1', label: 'Kelas I (1)', fase: 'Fase A', targetKenaikan: 'Kelas II (Dua)' },
  { kode: 'II', angka: '2', label: 'Kelas II (2)', fase: 'Fase A', targetKenaikan: 'Kelas III (Tiga)' },
  { kode: 'III', angka: '3', label: 'Kelas III (3)', fase: 'Fase B', targetKenaikan: 'Kelas IV (Empat)' },
  { kode: 'IV', angka: '4', label: 'Kelas IV (4)', fase: 'Fase B', targetKenaikan: 'Kelas V (Lima)' },
  { kode: 'V', angka: '5', label: 'Kelas V (5)', fase: 'Fase C', targetKenaikan: 'Kelas VI (Enam)' },
  { kode: 'VI', angka: '6', label: 'Kelas VI (6)', fase: 'Fase C', targetKenaikan: 'Lulus SD' },
];

export function normalizeKelasCode(kelas?: string): TingkatKelasSD {
  const raw = (kelas || '').trim().toUpperCase().replace(/^KELAS\s+/i, '');
  if (raw === '1' || raw === 'I' || raw.startsWith('1 ')) return 'I';
  if (raw === '2' || raw === 'II' || raw.startsWith('2 ')) return 'II';
  if (raw === '3' || raw === 'III' || raw.startsWith('3 ')) return 'III';
  if (raw === '4' || raw === 'IV' || raw.startsWith('4 ')) return 'IV';
  if (raw === '6' || raw === 'VI' || raw.startsWith('6 ')) return 'VI';
  return 'V';
}

export function getKelasAngka(kelas?: string): string {
  const kode = normalizeKelasCode(kelas);
  return TINGKAT_KELAS_SD.find((t) => t.kode === kode)?.angka || '5';
}

export function getFaseFromKelas(kelas?: string): FaseKurikulum {
  const kode = normalizeKelasCode(kelas);
  if (kode === 'I' || kode === 'II') return 'Fase A';
  if (kode === 'III' || kode === 'IV') return 'Fase B';
  return 'Fase C';
}

export function getFaseDisplayForKelas(kelas?: string): string {
  const kode = normalizeKelasCode(kelas);
  const fase = getFaseFromKelas(kode);
  return `${fase} (Kelas ${kode})`;
}

export function getTargetKelasLanjutan(kelas?: string): string {
  const kode = normalizeKelasCode(kelas);
  return TINGKAT_KELAS_SD.find((t) => t.kode === kode)?.targetKenaikan || 'Kelas VI (Enam)';
}

export function getCpForFase(mapel: MasterKurikulumMapel, fase: FaseKurikulum): string {
  if (fase === 'Fase A') return mapel.cpFaseA || mapel.cp;
  if (fase === 'Fase B') return mapel.cpFaseB || mapel.cp;
  return mapel.cpFaseC || mapel.cp;
}

export function getAtpForFase(mapel: MasterKurikulumMapel, fase: FaseKurikulum): string {
  if (fase === 'Fase A') return mapel.atpFaseA || mapel.atp;
  if (fase === 'Fase B') return mapel.atpFaseB || mapel.atp;
  return mapel.atpFaseC || mapel.atp;
}

export function getTpNarasiForFase(mapel: MasterKurikulumMapel, fase: FaseKurikulum): string[] {
  if (fase === 'Fase A' && mapel.tpNarasiFaseA && mapel.tpNarasiFaseA.length > 0) {
    return mapel.tpNarasiFaseA;
  }
  if (fase === 'Fase B' && mapel.tpNarasiFaseB && mapel.tpNarasiFaseB.length > 0) {
    return mapel.tpNarasiFaseB;
  }
  if (fase === 'Fase C' && mapel.tpNarasiFaseC && mapel.tpNarasiFaseC.length > 0) {
    return mapel.tpNarasiFaseC;
  }
  return mapel.tpNarasi;
}

export function getWaliKelasForSiswa(
  sekolah: ProfilSekolah,
  kelas?: string
): { nama: string; nip: string } {
  const kode = normalizeKelasCode(kelas);
  const mapped = sekolah.waliKelasPerTingkat?.[kode];
  if (mapped && mapped.nama && mapped.nama.trim()) {
    return {
      nama: mapped.nama,
      nip: mapped.nip && mapped.nip.trim() ? mapped.nip : '-',
    };
  }
  return {
    nama: sekolah.namaWaliKelas || '-',
    nip: sekolah.nipWaliKelas || '-',
  };
}

