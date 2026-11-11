export type PredikatKokurikuler = 'BB' | 'MB' | 'BSH' | 'SB';
// BB: Belum Berkembang, MB: Mulai Berkembang, BSH: Berkembang Sesuai Harapan, SB: Sangat Berkembang

export type PredikatEkstra = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';

export interface DataSiswa {
  nis: string;
  nisn: string;
  nama: string;
  namaPanggilan?: string;
  kelas: string;
  fase: string; // e.g. "Fase B (Kelas IV)" or "Fase C (Kelas V)"
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  agama: string;
  alamat: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  alamatOrtuJalan: string;
  alamatOrtuKelurahan: string;
  alamatOrtuKecamatan: string;
  alamatOrtuKota: string;
  alamatOrtuProvinsi: string;
  namaWali?: string;
  pekerjaanWali?: string;
  alamatWali?: string;
  telepon?: string;
  fotoUrl?: string;
}

export interface MasterKurikulumMapel {
  kodeMapel: string;
  namaMapel: string;
  kelompok: 'A' | 'B' | 'Muatan Lokal';
  cp: string; // Capaian Pembelajaran
  atp: string; // Alur Tujuan Pembelajaran
  tpNarasi: string[]; // 25 Teks Narasi TP (index 0 = TP_1, index 24 = TP_25)
}

export interface NilaiFormatifSiswa {
  nis: string;
  kodeMapel: string;
  nilaiTp: number[]; // 25 values, 0 if not assessed/empty
}

export interface NilaiSumatifSiswa {
  nis: string;
  kodeMapel: string;
  sumatifLm: number[]; // e.g. 4 Lingkup Materi
  sts: number; // Sumatif Tengah Semester
  sas: number; // Sumatif Akhir Semester
}

export interface ItemKokurikuler8Dimensi {
  id?: string;
  kode: string;
  namaDimensi: string;
  kodeSubDimensi?: string;
  namaSubDimensi?: string;
  fokusPembelajaran: string;
  predikat: PredikatKokurikuler;
  catatanPerkembangan: string;
}

export interface KokurikulerSiswa {
  nis: string;
  semester: 1 | 2;
  dimensi: ItemKokurikuler8Dimensi[];
}

export interface ItemEkstrakurikuler {
  id: string;
  nama: string;
  predikat: PredikatEkstra;
  deskripsi: string;
}

export interface EkstrakurikulerSiswa {
  nis: string;
  semester: 1 | 2;
  daftarEkstra: ItemEkstrakurikuler[];
}

export interface AbsensiSiswa {
  nis: string;
  semester?: 1 | 2;
  sakit: number;
  izin: number;
  tanpaKeterangan: number;
}

export interface LegerNilaiSiswa {
  nis: string;
  nama: string;
  kelas: string;
  semester: 1 | 2;
  nilaiPerMapel?: Record<string, number>; // kodeMapel -> nilaiAkhir
  totalNilai: number;
  rataRata: number;
  peringkatTerselubung: number; // Hidden from printed report!
  persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%';
  catatanWaliKelasCustom: string;
  statusKenaikan: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan';
  targetKelasLanjutan?: string;
}

export interface ProfilSekolah {
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kelurahan: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaWaliKelas: string;
  nipWaliKelas: string;
  titimangsaTempat: string;
  titimangsaTanggal: string;
  tahunPelajaran: string;
  semesterAktif: 1 | 2;
}

export interface RaporMapelKalkulasi {
  kodeMapel: string;
  namaMapel: string;
  kelompok: string;
  rataFormatif: number;
  rataSumatif: number;
  nilaiAkhir: number;
  deskripsiCapaian: string;
  deskripsiMax: string;
  deskripsiMin: string;
  maxTpIndex: number;
  maxTpNilai: number;
  minTpIndex: number;
  minTpNilai: number;
}

export type UserRole = 'admin' | 'wali_kelas' | 'guru_mapel';

export interface UserAccount {
  id: string;
  nama: string;
  nip?: string;
  role: UserRole;
  kodeMapel?: string;
  namaMapel?: string;
  password: string;
  email?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  userId: string;
  role: UserRole;
  namaUser: string;
  kodeMapelAjar?: string;
  namaMapelAjar?: string;
}
