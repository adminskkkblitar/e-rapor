import { ElemenCapaian, FaseKurikulum, FileAtpLampiran } from '../types/rapor';

export interface DetailKurikulumMapelFase {
  kodeMapel: string;
  namaMapel: string;
  kelompok: 'A' | 'B' | 'Muatan Lokal';
  cpFaseA: string;
  cpFaseB: string;
  cpFaseC: string;
  atpFaseA: string;
  atpFaseB: string;
  atpFaseC: string;
  elemenCapaian: ElemenCapaian[];
  fileAtpLampiran: FileAtpLampiran[];
}

export const DATA_CP_BKPDM_2026: Record<string, DetailKurikulumMapelFase> = {
  'PAK-01': {
    kodeMapel: 'PAK-01',
    namaMapel: 'Pendidikan Agama Kristen & Budi Pekerti',
    kelompok: 'A',
    cpFaseA: 'Peserta didik memahami kasih Allah yang menciptakan dirinya secara istimewa dalam keluarga dan lingkungan sekolah, mensyukuri pemeliharaan Allah, serta mempraktikkan kasih, kejujuran, dan hidup rukun bersama sesama teman.',
    cpFaseB: 'Peserta didik memahami kemahakuasaan Allah dalam memelihara manusia dan alam sekitar, mengenal karya penyelamatan Allah melalui Yesus Kristus, serta menerapkan nilai kasih, pengampunan, kerendahan hati, dan tanggung jawab kristiani.',
    cpFaseC: 'Peserta didik memahami karya penyelamatan Allah yang berpuncak pada Yesus Kristus dan kuasa Roh Kudus yang membarui hidup; meneladani karakter Kristus dalam melayani sesama, menjunjung keadilan, aktif dalam persekutuan gereja serta menjaga keutuhan alam ciptaan-Nya.',
    atpFaseA: 'Mensyukuri tubuh sebagai anugerah Allah, menghormati orang tua dan guru, bersikap jujur dan pemaaf, serta memelihara kebersihan lingkungan.',
    atpFaseB: 'Mengidentifikasi mukjizat dan teladan Yesus, menghafal doa Bapa Kami dan menerapkannya, mempraktikkan toleransi antarteman, serta merawat tanaman dan hewan ciptaan Allah.',
    atpFaseC: 'Menganalisis makna pengorbanan Kristus di kayu salib, mempraktikkan buah-buah Roh dalam mengatasi perundungan, berpartisipasi dalam aksi pelayanan kasih, dan merancang proyek pelestarian lingkungan hidup.',
    elemenCapaian: [
      {
        elemen: 'Allah Berkarya',
        subElemen: 'Allah Pencipta & Allah Pemelihara',
        deskripsiFaseA: 'Memahami Allah menciptakan dirinya, keluarga, teman, dan alam sekitar; mensyukuri pemeliharaan Allah dalam pertumbuhan jasmani dan rohani sehari-hari.',
        deskripsiFaseB: 'Memahami pemeliharaan Allah yang sempurna atas seluruh ciptaan; mengenal karya penyelamatan melalui Yesus Kristus yang hadir menebus dosa manusia.',
        deskripsiFaseC: 'Memahami karya penyelamatan Allah yang paripurna melalui kematian dan kebangkitan Yesus Kristus; mengimani karya Roh Kudus yang memimpin dan membarui hidup orang percaya.',
      },
      {
        elemen: 'Manusia dan Nilai-nilai Kristiani',
        subElemen: 'Hakikat Manusia & Nilai Kristiani',
        deskripsiFaseA: 'Menerima keunikan diri sebagai citra Allah, membiasakan berkata jujur, saling tolong, mengucapkan terima kasih, dan meminta maaf.',
        deskripsiFaseB: 'Menerapkan nilai kejujuran, kerendahan hati, disiplin, dan pengampunan dalam hubungan antarteman dan keluarga tanpa membeda-bedakan.',
        deskripsiFaseC: 'Meneladani pola hidup Yesus Kristus dalam integritas moral, menolak kekerasan dan diskriminasi, serta memperjuangkan kasih dan keadilan bagi sesama.',
      },
      {
        elemen: 'Gereja dan Masyarakat Majemuk',
        subElemen: 'Tugas Panggilan Gereja & Kerukunan',
        deskripsiFaseA: 'Mensyukuri persekutuan ibadah bersama keluarga dan gereja; menunjukkan sikap ramah dan santun kepada teman dari berbagai latar belakang.',
        deskripsiFaseB: 'Memahami arti persekutuan jemaat yang saling menguatkan, mempraktikkan gotong royong dan toleransi di lingkungan tempat tinggal yang majemuk.',
        deskripsiFaseC: 'Mengambil bagian dalam tugas panggilan gereja (koinonia, marturia, diakonia), serta memprakarsai dialog dan hidup rukun antarumat beragama di Indonesia.',
      },
      {
        elemen: 'Alam dan Lingkungan Hidup',
        subElemen: 'Tanggung Jawab Pemeliharaan Alam',
        deskripsiFaseA: 'Mensyukuri indahnya alam ciptaan Allah, membuang sampah pada tempatnya, dan merawat tanaman di sekitar rumah dan sekolah.',
        deskripsiFaseB: 'Menjelaskan mandat Allah kepada manusia untuk mengelola bumi secara bertanggung jawab; menghindari pemborosan air, listrik, dan makanan.',
        deskripsiFaseC: 'Merancang dan melaksanakan aksi nyata pemeliharaan kelestarian bumi (penghijauan, daur ulang limbah) sebagai bentuk ibadah sejati kepada Sang Pencipta.',
      },
    ],
    fileAtpLampiran: [
      {
        id: 'atp-pak-doc',
        fileName: 'ATP_Pendidikan_Agama_Kristen_FaseC_2025_2026.pdf',
        fileType: 'application/pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2025-07-15 08:30',
        uploadedBy: 'Petrus Apriprasetyo, S.Pd (Wali Kelas V)',
        catatan: 'Dokumen ATP & Alur Pembelajaran Kurikulum Deep Learning Kelas V SD Kristen Kalam Kudus Blitar semester 1 & 2.',
      },
    ],
  },

  'PP-02': {
    kodeMapel: 'PP-02',
    namaMapel: 'Pendidikan Pancasila',
    kelompok: 'A',
    cpFaseA: 'Peserta didik mengenal lambang negara Garuda Pancasila dan simbol-simbol sila Pancasila, mengenal aturan di rumah dan sekolah, menghargai identitas diri dan teman, serta mencintai lingkungan sekitarnya.',
    cpFaseB: 'Peserta didik memahami hubungan antarsila Pancasila, mengidentifikasi dan mematuhi norma, aturan, hak dan kewajiban di sekolah dan masyarakat, serta menghargai keragaman budaya di tingkat kabupaten/kota.',
    cpFaseC: 'Peserta didik memahami dan mengamalkan nilai-nilai Pancasila dalam kehidupan sehari-hari, menelaah norma, hukum, hak dan kewajiban warga negara, merumuskan kesepakatan bersama melalui musyawarah, serta menjaga keutuhan NKRI.',
    atpFaseA: 'Menyebutkan sila-sila Pancasila, menaati tata tertib kelas, mengenal pakaian adat sederhana, dan bergotong royong membersihkan kelas.',
    atpFaseB: 'Mempraktikkan musyawarah sederhana pemilihan ketua kelas, membedakan hak dan kewajiban anak, dan menampilkan pertunjukan seni budaya daerah.',
    atpFaseC: 'Menganalisis pengamalan sila ke-1 sampai ke-5 dalam isu nyata, menyusun norma kesepakatan kelas, menyajikan peta keragaman suku nusantara, dan mempraktikkan bela negara sederhana.',
    elemenCapaian: [
      {
        elemen: 'Pancasila',
        subElemen: 'Nilai dan Pengamalan Sila',
        deskripsiFaseA: 'Mengenal simbol-simbol sila Pancasila dan lambang Garuda Pancasila serta menceritakan contoh sikap tolong-menolong di sekolah.',
        deskripsiFaseB: 'Menjelaskan makna sila-sila Pancasila dan keterhubungannya; mempraktikkan musyawarah mufakat untuk mencapai kesepakatan bersama.',
        deskripsiFaseC: 'Menganalisis implementasi nilai-nilai luhur Pancasila dalam menghadapi tantangan era digital, memupuk empati sosial, dan menentang intoleransi.',
      },
      {
        elemen: 'Undang-Undang Dasar NRI 1945',
        subElemen: 'Norma, Hak, dan Kewajiban',
        deskripsiFaseA: 'Mengenal dan menaati aturan di rumah dan di sekolah; menceritakan hak menerima kasih sayang dan kewajiban belajar.',
        deskripsiFaseB: 'Mengidentifikasi dan membedakan norma kesopanan, kesusilaan, agama, dan hukum di lingkungan tempat tinggal; melaksanakan kewajiban sebelum menuntut hak.',
        deskripsiFaseC: 'Menganalisis konsekuensi pelanggaran norma dan hukum; merancang piagam kesepakatan kelas serta menyelesaikan konflik secara adil dan damai.',
      },
      {
        elemen: 'Bhinneka Tunggal Ika',
        subElemen: 'Penghargaan Keberagaman',
        deskripsiFaseA: 'Mengenal perbedaan jenis kelamin, hobi, dan suku antarteman; menggunakan bahasa Indonesia sebagai bahasa persatuan.',
        deskripsiFaseB: 'Mengidentifikasi keragaman budaya, bahasa daerah, pakaian adat, dan rumah adat di wilayah provinsi Jawa Timur dan Indonesia.',
        deskripsiFaseC: 'Menelaah kearifan lokal nusantara, mempromosikan sikap inklusif, dan mencegah prasangka atau diskriminasi antarkelompok masyarakat.',
      },
      {
        elemen: 'Negara Kesatuan Republik Indonesia',
        subElemen: 'Kedaulatan & Cinta Tanah Air',
        deskripsiFaseA: 'Mengenal lingkungan rumah dan sekolah sebagai bagian dari desa/kelurahan; menunjukkan rasa cinta pada lagu kebangsaan Indonesia Raya.',
        deskripsiFaseB: 'Menjelaskan batas-batas wilayah kabupaten/kota; menyanyikan lagu-lagu wajib nasional dengan penuh penghormatan.',
        deskripsiFaseC: 'Menjaga persatuan dan kesatuan bangsa dalam bingkai NKRI, mengapresiasi peran pahlawan kemerdekaan, dan mempraktikkan sikap bela negara di era modern.',
      },
    ],
    fileAtpLampiran: [],
  },

  'BI-03': {
    kodeMapel: 'BI-03',
    namaMapel: 'Bahasa Indonesia',
    kelompok: 'A',
    cpFaseA: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi santun, menyimak instruksi sederhana, membaca kata-kata baru dengan fasih, serta menulis kalimat sederhana dengan tulisan rapi.',
    cpFaseB: 'Peserta didik mampu memahami pesan dan ide pokok teks narasi dan eksplanasi aural/visual, membaca teks baru dengan intonasi tepat, dan menulis paragraf padu dengan kosakata baku.',
    cpFaseC: 'Peserta didik memiliki kompetensi berbahasa untuk bernalar kritis, menganalisis akurasi ide pokok dan informasi tersirat teks narasi, eksposisi, dan fiksi; mempresentasikan argumen secara persuasif; serta menulis karangan terstruktur dengan kaidah EYD.',
    atpFaseA: 'Menyimak dongeng anak, melafalkan bunyi huruf vokal dan konsonan, membaca kata bergambar, dan menulis biodata diri singkat.',
    atpFaseB: 'Menemukan informasi 5W1H dari teks bacaan, menceritakan kembali pengalaman liburan secara lisan, dan menulis laporan kegiatan berkemah.',
    atpFaseC: 'Menyimak teks pidato informatif, membaca kritis teks laporan hasil pengamatan, menulis teks eksplanasi ilmiah populer, dan menyusun surat dinas.',
    elemenCapaian: [
      {
        elemen: 'Menyimak',
        deskripsiFaseA: 'Bersikap sebagai pendengar yang baik; menyimak instruksi lisan sederhana, cerita fabel, dan menirukan lafal dengan intonasi wajar.',
        deskripsiFaseB: 'Menyimak teks narasi dan informatif dengan saksama; mencatat ide pokok, tokoh, dan alur peristiwa teks yang dibacakan.',
        deskripsiFaseC: 'Menganalisis ide pokok, argumen tersurat dan tersirat, serta fakta vs opini dari teks aural/audio visual yang kompleks secara kritis.',
      },
      {
        elemen: 'Membaca dan Memirsa',
        deskripsiFaseA: 'Mengeja suku kata dan membaca kata-kata baru dengan lancar; memahami isi gambar denah atau petunjuk visual kelas.',
        deskripsiFaseB: 'Membaca teks narasi dan nonsastra dengan kefasihan dan intonasi tepat; memaknai kosakata baru menggunakan bantuan kamus (KBBI).',
        deskripsiFaseC: 'Membaca cepat dengan pemahaman mendalam teks eksplanasi, ulasan buku, dan sastra; mengidentifikasi majas, gaya bahasa, dan sudut pandang penulis.',
      },
      {
        elemen: 'Berbicara dan Mempresentasikan',
        deskripsiFaseA: 'Menyampaikan salam, ungkapan terima kasih, dan permintaan tolong secara sopan; menceritakan diri di depan kelas dengan percaya diri.',
        deskripsiFaseB: 'Menyampaikan pendapat secara runtut dalam diskusi kelompok; berbicara dengan intonasi menarik saat mendongeng atau berpuisi.',
        deskripsiFaseC: 'Berbicara secara persuasif dengan argumen logis dan data pendukung; memimpin musyawarah kelas dan melakukan wawancara narasumber secara santun.',
      },
      {
        elemen: 'Menulis',
        deskripsiFaseA: 'Menulis huruf kapital dan tanda titik pada kalimat pendek; menyalin kalimat dengan tulisan tegak bersambung yang rapi.',
        deskripsiFaseB: 'Menulis karangan narasi dan deskripsi minimal 3 paragraf dengan struktur kohesif; menerapkan huruf kapital dan tanda baca secara benar.',
        deskripsiFaseC: 'Menyusun teks eksplanasi, eksposisi, ulasan karya, dan surat resmi dengan variasi kalimat efektif, koherensi paragraf, dan kosakata baku.',
      },
    ],
    fileAtpLampiran: [],
  },

  'MTK-04': {
    kodeMapel: 'MTK-04',
    namaMapel: 'Matematika',
    kelompok: 'A',
    cpFaseA: 'Peserta didik memahami bilangan cacah sampai 100, melakukan operasi penjumlahan dan pengurangan dasar, mengenal pola bangun datar dan bangun ruang sederhana, serta membandingkan panjang dan waktu.',
    cpFaseB: 'Peserta didik memahami bilangan cacah sampai 10.000, operasi perkalian dan pembagian, pecahan biasa dan desimal, menghitung keliling dan luas bangun datar, serta menyajikan data dalam diagram batang.',
    cpFaseC: 'Peserta didik mahir menyelesaikan operasi pecahan campuran, desimal, dan persen; memahami konsep FPB, KPK, rasio, proporsi; menghitung luas permukaan dan volume bangun ruang; serta menganalisis mean, median, modus dan peluang empirik.',
    atpFaseA: 'Membilang lompat 2 dan 5, menyelesaikan soal cerita penjumlahan uang saku, mengenal bentuk segitiga dan lingkaran di lingkungan sekitar.',
    atpFaseB: 'Menghafal perkalian 1 sampai 10, menghitung luas ruang kelas persegi panjang, dan membuat diagram batang kegemaran teman sekelas.',
    atpFaseC: 'Menjumlahkan pecahan beda penyebut, menghitung volume kolam kubus dan balok, mengonstruksi jaring-jaring prisma, dan menghitung rata-rata nilai rapor.',
    elemenCapaian: [
      {
        elemen: 'Bilangan',
        deskripsiFaseA: 'Membilang, menuliskan lambang, dan membandingkan bilangan cacah sampai 100; menguasai fakta dasar penjumlahan dan pengurangan.',
        deskripsiFaseB: 'Menguasai nilai tempat sampai 10.000; menyelesaikan operasi hitung perkalian dan pembagian; memahami pecahan senilai dan pecahan desimal persepuluhan.',
        deskripsiFaseC: 'Mengoperasikan berbagai bentuk pecahan (biasa, campuran, desimal, persen); menyelesaikan masalah FPB, KPK, serta perbandingan senilai dan berbalik nilai.',
      },
      {
        elemen: 'Aljabar',
        deskripsiFaseA: 'Mengidentifikasi dan meniru pola gambar atau bunyi sederhana; menyusun barisan bilangan lompat teratur.',
        deskripsiFaseB: 'Menentukan suku yang hilang pada pola bilangan; menyelesaikan persamaan kalimat matematika dengan lambang kotak atau segitiga.',
        deskripsiFaseC: 'Menyelesaikan kalimat matematika satu variabel linear; merumuskan relasi matematis dan memecahkan soal cerita berbasis logika aljabar.',
      },
      {
        elemen: 'Pengukuran',
        deskripsiFaseA: 'Membandingkan panjang (panjang/pendek), berat (berat/ringan), dan durasi waktu (lama/sebentar) dengan satuan tidak baku (jengkal, langkah).',
        deskripsiFaseB: 'Mengukur panjang (cm, m), berat (gram, kg), volume (liter), dan waktu (jam, menit) menggunakan satuan baku; menghitung keliling dan luas bangun datar.',
        deskripsiFaseC: 'Menentukan dan menghitung keliling lingkaran, luas permukaan gabungan, serta volume kubus, balok, prisma segitiga, dan tabung.',
      },
      {
        elemen: 'Geometri',
        deskripsiFaseA: 'Mengenal bentuk segitiga, segi empat, lingkaran, kubus, dan bola; mengelompokkan benda-benda berdasarkan bentuk geometrisnya.',
        deskripsiFaseB: 'Menjelaskan ciri-ciri dan sifat sisi serta sudut pada segi banyak beraturan; mengidentifikasi garis sejajar dan garis berpotongan.',
        deskripsiFaseC: 'Mengonstruksi dan menggambar jaring-jaring bangun ruang; memahami sudut refleks, simetri putar/lipat, dan koordinat Cartesius pada kuadran I.',
      },
      {
        elemen: 'Analisis Data & Peluang',
        deskripsiFaseA: 'Mengurutkan, menyortir, dan mengelompokkan objek konkret berdasarkan ciri warna, bentuk, atau ukuran.',
        deskripsiFaseB: 'Mengumpulkan data melalui pencacahan (turus); menyajikan dan menafsirkan data ke dalam tabel frekuensi dan diagram batang.',
        deskripsiFaseC: 'Membaca dan membuat diagram lingkaran dan diagram garis; menghitung ukuran pemusatan data (rata-rata/mean, median, modus); menentukan peluang empirik.',
      },
    ],
    fileAtpLampiran: [],
  },

  'IPAS-05': {
    kodeMapel: 'IPAS-05',
    namaMapel: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    kelompok: 'A',
    cpFaseA: 'Peserta didik mengenal anggota tubuh, panca indra, siklus siang-malam, cuaca, lingkungan rumah dan sekolah yang sehat (terintegrasi dalam mapel dasar).',
    cpFaseB: 'Peserta didik memahami wujud zat dan perubahannya, bentuk dan transformasi energi, daur hidup hewan, bagian tubuh tumbuhan, serta interaksi sosial, peninggalan sejarah lokal, dan potensi ekonomi kabupaten/kota.',
    cpFaseC: 'Peserta didik memahami sistem organ tubuh manusia (pernapasan, pencernaan, peredaran darah), perpindahan kalor, sifat cahaya dan bunyi, ekosistem dan jaring-jaring makanan, dinamika geografis Indonesia, serta sejarah kemerdekaan bangsa.',
    atpFaseA: 'Merawat panca indra, mengamati hewan peliharaan, dan menjaga kebersihan lingkungan rumah.',
    atpFaseB: 'Membuat percobaan es mencair dan air mendidih, merakit kincir angin sederhana, dan mewawancarai pengrajin lokal daerah.',
    atpFaseC: 'Menganalisis skema paru-paru dan jantung manusia, membuat rangkaian listrik seri/paralel, memetakan rantai makanan sawah, dan meneliti rute perdagangan nusantara.',
    elemenCapaian: [
      {
        elemen: 'Pemahaman IPAS (Sains & Sosial)',
        deskripsiFaseA: 'Mengenal kebutuhan hidup makhluk hidup, merawat panca indra, dan mengamati pergantian cuaca di sekitar rumah.',
        deskripsiFaseB: 'Menjelaskan fenomena perubahan wujud zat (mencair, membeku, menguap); memahami fungsi akar, batang, daun; mengenal profesi dan pasar tradisional daerah.',
        deskripsiFaseC: 'Menjelaskan mekanisme kerja organ pernapasan, pencernaan, dan sirkulasi darah manusia; menganalisis jaring makanan dan ketahanan ekosistem; menelaah letak astronomis dan kekayaan maritim nusantara.',
      },
      {
        elemen: 'Keterampilan Proses',
        deskripsiFaseA: 'Mengamati dengan panca indra, bertanya rasa ingin tahu sederhana, dan mengomunikasikan hasil amatan secara lisan.',
        deskripsiFaseB: 'Merumuskan hipotesis sederhana, melakukan penyelidikan terbimbing, mencatat data percobaan tabel, dan menyimpulkan hasil pengamatan.',
        deskripsiFaseC: 'Merancang eksperimen mandiri, mengontrol variabel sains, menyajikan grafik data digital, mengevaluasi validitas kesimpulan, serta menyusun solusi isu lingkungan.',
      },
    ],
    fileAtpLampiran: [],
  },

  'SB-06': {
    kodeMapel: 'SB-06',
    namaMapel: 'Seni Musik',
    kelompok: 'B',
    cpFaseA: 'Peserta didik mengeksplorasi bunyi, tempo, dan dinamika suara alam/hewan, bernyanyi lagu anak-anak dengan gembira, serta memainkan alat perkusi tubuh.',
    cpFaseB: 'Peserta didik mengenali unsur-unsur nada, birama (2/4, 3/4, 4/4), melodi, dan warna suara instrumen melodis/ritmis, serta menyanyikan lagu wajib daerah dengan artikulasi jelas.',
    cpFaseC: 'Peserta didik mampu mengapresiasi dan memainkan pola ritme nusantara, mengaransir melodi sederhana dengan alat musik pianika/rekorder, bernyanyi dua suara (*kanon*), serta mengekspresikan musikalitas berkarakter luhur.',
    atpFaseA: 'Bertepuk tangan mengikuti birama lagu bintang kecil, menirukan suara burung, dan bernyanyi bersama.',
    atpFaseB: 'Membaca not angka sederhana solmisasi, meniup rekorder nada do-sol, dan menyanyikan lagu daerah Gundul-Gundul Pacul.',
    atpFaseC: 'Memainkan ansambel musik campuran (pianika, rebana, kastanyet), menyanyikan lagu nasional kanon, dan mengidentifikasi ragam tangga nada mayor/minor.',
    elemenCapaian: [
      {
        elemen: 'Mengalami (Experiencing)',
        deskripsiFaseA: 'Mendengarkan dan merespons berbagai ragam bunyi di sekitar dengan gerakan tubuh yang riang.',
        deskripsiFaseB: 'Mengenal simbol notasi angka, tanda birama, dan timbre instrumen musik tradisional.',
        deskripsiFaseC: 'Menganalisis struktur bentuk lagu, perubahan dinamika, dan tempo pada karya musik klasik maupun tradisional nusantara.',
      },
      {
        elemen: 'Menciptakan (Creating)',
        deskripsiFaseA: 'Menghasilkan bunyi ritmis menggunakan tepukan tangan, hentakan kaki, dan perkusi sederhana.',
        deskripsiFaseB: 'Menggubah lirik lagu sederhana atau memodifikasi pola irama tepuk birama 4/4.',
        deskripsiFaseC: 'Menciptakan pola melodi pendek dan mengaransir iringan perkusi ritmis untuk mengiringi lagu perjuangan.',
      },
      {
        elemen: 'Merefleksikan (Reflecting)',
        deskripsiFaseA: 'Menceritakan perasaan gembira setelah bernyanyi bersama teman sekelas.',
        deskripsiFaseB: 'Memberikan komentar positif terhadap penampilan musikal teman dan menyadari pentingnya kekompakan kelompok.',
        deskripsiFaseC: 'Mengevaluasi keharmonisan nada, pitch intonasi, dan keselarasan tempo pada penampilan ansambel musik kelas.',
      },
    ],
    fileAtpLampiran: [],
  },

  'PJOK-07': {
    kodeMapel: 'PJOK-07',
    namaMapel: 'Pendidikan Jasmani dan Olahraga',
    kelompok: 'B',
    cpFaseA: 'Peserta didik mempraktikkan gerak dasar lokomotor (jalan, lari, lompat), non-lokomotor (menekuk, memutar), dan manipulatif (melempar, menangkap) melalui permainan tradisional dan pembiasaan hidup bersih.',
    cpFaseB: 'Peserta didik mengombinasikan pola gerak dasar pada olahraga atletik dan permainan bola besar/kecil (kasti, sepak bola), senam lantai ketangkasan, aktivitas renang/air, serta menjaga kebugaran jasmani.',
    cpFaseC: 'Peserta didik menyempurnakan dan menerapkan keterampilan variasi serta kombinasi pola gerak dasar secara taktis dalam olahraga beregu, senam irama, pertolongan pertama sederhana (P3K), dan pemeliharaan organ reproduksi.',
    atpFaseA: 'Lari estafet sederhana, senam peregangan pagi, dan mencuci tangan dengan sabun setelah berolahraga.',
    atpFaseB: 'Passing bola voli bawah berpasangan, memukul bola kasti, guling depan senam lantai dengan matras aman.',
    atpFaseC: 'Mempraktikkan formasi operan sepak bola mini, lari jarak pendek 50 meter dengan start jongkok, dan latihan sirkuit kebugaran kardio.',
    elemenCapaian: [
      {
        elemen: 'Keterampilan Gerak',
        deskripsiFaseA: 'Mempraktikkan gerak jalan, lari, melompat, dan menggelinding tanpa kehilangan keseimbangan.',
        deskripsiFaseB: 'Mengombinasikan gerak lokomotor dan manipulatif menendang serta menghentikan bola berpasangan.',
        deskripsiFaseC: 'Menguasai variasi gerak spesifik passing bola basket, servis bawah bola voli, dan rangkaian senam ketangkasan artistik.',
      },
      {
        elemen: 'Pengetahuan Gerak & Kebugaran',
        deskripsiFaseA: 'Menjelaskan manfaat bergerak aktif bagi kesehatan tubuh dan istirahat tidur yang cukup.',
        deskripsiFaseB: 'Menjelaskan konsep daya tahan otot dan kelenturan; menghitung denyut nadi setelah berolahraga.',
        deskripsiFaseC: 'Menganalisis prinsip biomekanika sederhana olahraga lari cepat; menyusun rencana latihan kebugaran jasmani pribadi.',
      },
      {
        elemen: 'Pengembangan Karakter & Gaya Hidup',
        deskripsiFaseA: 'Bermain jujur, mau berbagi alat olahraga, dan antre dengan tertib.',
        deskripsiFaseB: 'Menunjukkan sportivitas, menghargai kemenangan tim lain, dan menolong teman yang terjatuh.',
        deskripsiFaseC: 'Memimpin regu secara adil, menjunjung tinggi *fair play*, serta mengedukasi pencegahan cedera dan bahaya narkoba.',
      },
    ],
    fileAtpLampiran: [],
  },

  'BING-08': {
    kodeMapel: 'BING-08',
    namaMapel: 'Bahasa Inggris',
    kelompok: 'B',
    cpFaseA: 'Peserta didik merespons sapaan (*greetings*), instruksi kelas (*sit down, stand up*), menyebutkan warna, angka 1-20, dan anggota keluarga dengan ucapan jelas.',
    cpFaseB: 'Peserta didik berinteraksi dalam bahasa Inggris sederhana mengenai aktivitas harian (*daily routines*), kegemaran (*hobbies*), makanan favorit, serta mendeskripsikan benda dan hewan peliharaan secara visual.',
    cpFaseC: 'Peserta didik mampu berkomunikasi lisan dan tulisan dalam kalimat utuh (*Simple Present & Past Tense*), memahami teks deskripsi dan narasi bergambar, serta mempresentasikan perkenalan diri dan rencana kegiatan (*future plans*).',
    atpFaseA: 'Singing the Alphabet Song, counting objects 1-20, saying good morning and goodbye.',
    atpFaseB: 'Using "I like..." and "I don\'t like...", describing pet features ("It has fur"), asking for time ("What time is it?").',
    atpFaseC: 'Writing a short paragraph about "My Last Holiday", conducting role-play at a grocery store, presenting favorite idol/inventor.',
    elemenCapaian: [
      {
        elemen: 'Menyimak - Berbicara (Listening - Speaking)',
        deskripsiFaseA: 'Menyimak instruksi guru di kelas dan menirukan sapaan sopan dengan pelafalan yang benar.',
        deskripsiFaseB: 'Mengajukan dan menjawab pertanyaan sederhana tentang barang-barang di kelas dan anggota keluarga.',
        deskripsiFaseC: 'Berbicara lancar dalam percakapan dua arah tentang rutinitas sekolah, petunjuk arah, dan hobi menggunakan kosa kata yang variatif.',
      },
      {
        elemen: 'Membaca - Memirsa (Reading - Viewing)',
        deskripsiFaseA: 'Mencocokkan kata bahasa Inggris sederhana dengan kartu gambar benda yang sesuai.',
        deskripsiFaseB: 'Membaca kalimat pendek berilustrasi dan menemukan informasi spesifik (nama orang, tempat, warna).',
        deskripsiFaseC: 'Membaca teks cerita pendek berbahasa Inggris dan menjawab pertanyaan pemahaman konteks tersirat secara akurat.',
      },
      {
        elemen: 'Menulis - Mempresentasikan (Writing - Presenting)',
        deskripsiFaseA: 'Menyalin kata dan frasa pendek bahasa Inggris dengan ejaan huruf yang tepat.',
        deskripsiFaseB: 'Menulis kalimat deklaratif sederhana dengan bantuan pola kalimat terstruktur (*Subject + Verb + Object*).',
        deskripsiFaseC: 'Menulis teks deskriptif pendek 4-6 kalimat tentang hewan langka atau tempat wisata dengan ejaan dan tanda baca baku.',
      },
    ],
    fileAtpLampiran: [],
  },

  'BJ-09': {
    kodeMapel: 'BJ-09',
    namaMapel: 'Bahasa Jawa',
    kelompok: 'Muatan Lokal',
    cpFaseA: 'Peserta didik memahami tembang dolanan anak Jawa, menyapa dengan basa ngoko dan krama lugu sederhana, serta mengenal nama-nama punakawan.',
    cpFaseB: 'Peserta didik memahami cerita wayang / dongeng rakyat Jawa (folklore), unggah-ungguh basa saat bercakap-cakap dengan orang tua/guru, dan membaca aksara Jawa legena (10 huruf pertama).',
    cpFaseC: 'Peserta didik mahir menerapkan unggah-ungguh basa Jawa (krama alus), menganalisis pitutur luhur pada tembang macapat (Pocung, Gambuh), membaca serta menulis aksara Jawa nglegena dan sandhangan swara.',
    atpFaseA: 'Nembang dolanan "Gundhul-Gundhul Pacul", ngucapake matur nuwun lan nyuwun pangapunten.',
    atpFaseB: 'Ngrungokake crita kancil lan baya, nyritakake wayang Pandhawa lima, nulis aksara ha, na, ca, ra, ka.',
    atpFaseC: 'Pacelathon unggah-ungguh basa krama alus kaliyan bapak/ibu guru, nembang macapat Pocung kanthi laras pelog, nulis ukara mawa aksara Jawa lan sandhangan wulu, suku, taling.',
    elemenCapaian: [
      {
        elemen: 'Nyemak (Menyimak)',
        deskripsiFaseA: 'Nyemak tembang dolanan lan parikan prasaja kanthi gemati.',
        deskripsiFaseB: 'Nyemak crita dongeng rakyat Jawa lan mangerteni watak paraga utama.',
        deskripsiFaseC: 'Nyemak tembang macapat lan pacelathon unggah-ungguh, nyimpulake amanat lan piwulang luhur ing jerone.',
      },
      {
        elemen: 'Maca (Membaca)',
        deskripsiFaseA: 'Maca tembung-tembung basa Jawa kanthi lafal lan intonasi cetha.',
        deskripsiFaseB: 'Maca crita legenda daerah kanthi lancar lan maca aksara Jawa nglegena 10 aksara.',
        deskripsiFaseC: 'Maca lancar wacana narasi basa Jawa lan maca ukara mawa aksara Jawa komplit karo sandhangan swara.',
      },
      {
        elemen: 'Micara (Berbicara)',
        deskripsiFaseA: 'Uluk salam lan matur nuwun nganggo basa Jawa sing santun.',
        deskripsiFaseB: 'Nindakake pacelathon (dialog) karo kanca nggunakake basa ngoko lan krama lugu.',
        deskripsiFaseC: 'Pentas pacelathon drama nganggo basa krama alus, micara kanthi subasita lan tata krama Jawa kang adiluhung.',
      },
      {
        elemen: 'Nulis (Menulis)',
        deskripsiFaseA: 'Nyalin tembung basa Jawa kanthi bener.',
        deskripsiFaseB: 'Nulis crita pengalaman sedina-dina nganggo basa ngoko alus minimal 2 paragraf.',
        deskripsiFaseC: 'Nulis teks laporan kagiyatan mawa basa Jawa santun lan nulis ukara nganggo aksara Jawa kanthi bener.',
      },
    ],
    fileAtpLampiran: [],
  },

  'KOMP-10': {
    kodeMapel: 'KOMP-10',
    namaMapel: 'Komputer',
    kelompok: 'Muatan Lokal',
    cpFaseA: 'Peserta didik mengenal perangkat input (mouse, keyboard) dan output (layar, printer), menyalakan/mematikan komputer dengan tertib, serta menggambar di Paint.',
    cpFaseB: 'Peserta didik mengoperasikan pengolah kata (MS Word / Google Docs) untuk mengetik dokumen terformat, menyimpan file di folder rapi, mengenal internet sehat, dan belajar logika blok visual dasar.',
    cpFaseC: 'Peserta didik mahir menyusun dokumen terstruktur dengan tabel dan gambar, mengolah data angka dan grafik sederhana pada spreadsheet, mempraktikkan etika keamanan siber (password aman, anti-hoaks), serta memprogram animasi cerita dengan Scratch visual coding.',
    atpFaseA: 'Menggerakkan kursor mouse, mengetik nama sendiri di WordPad, dan menggambar rumah di Paint.',
    atpFaseB: 'Memformat teks bold/italic, menyisipkan clip-art di pengolah kata, dan menjalankan coding blok Scratch Jr.',
    atpFaseC: 'Membuat dokumen kliping tugas sekolah, mengolah tabel daftar nilai di spreadsheet dengan formula SUM/AVERAGE, dan memprogram kuis interaktif sederhana di Scratch.',
    elemenCapaian: [
      {
        elemen: 'Perangkat Keras & Lunak (Hardware & Software)',
        deskripsiFaseA: 'Mengenal CPU, monitor, keyboard, dan mouse serta cara memperlakukannya dengan hati-hati.',
        deskripsiFaseB: 'Mengenal media penyimpanan flashdisk, hard disk, dan mengelola folder dokumen secara sistematis.',
        deskripsiFaseC: 'Mengidentifikasi spesifikasi komputer dasar, jaringan internet kabel/Wi-Fi, dan instalasi aplikasi produktivitas sekolah.',
      },
      {
        elemen: 'Literasi Digital & Internet Sehat',
        deskripsiFaseA: 'Memahami batas waktu menatap layar (*screen time*) dan menjaga jarak pandang mata.',
        deskripsiFaseB: 'Mencari informasi materi pelajaran menggunakan mesin pencari anak yang aman dan tidak membagikan data pribadi di internet.',
        deskripsiFaseC: 'Menerapkan etika berkomunikasi digital, memverifikasi kebenaran informasi (anti-hoaks), melindungi privasi akun, dan hak cipta karya digital.',
      },
      {
        elemen: 'Berpikir Komputasional & Coding Dasar',
        deskripsiFaseA: 'Mengikuti urutan langkah logis (*algoritma sederhana*) saat menyelesaikan teka-teki labirin.',
        deskripsiFaseB: 'Menyusun urutan instruksi perintah blok visual untuk menggerakkan karakter animasi ke tujuan.',
        deskripsiFaseC: 'Merancang program animasi atau game interaktif sederhana di Scratch yang menerapkan logika percabangan (*if-then*) dan perulangan (*loop*).',
      },
    ],
    fileAtpLampiran: [],
  },
};
