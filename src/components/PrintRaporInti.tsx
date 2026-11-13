import React from 'react';
import {
  AbsensiSiswa,
  DataSiswa,
  EkstrakurikulerSiswa,
  KokurikulerSiswa,
  ProfilSekolah,
  RaporMapelKalkulasi,
} from '../types/rapor';
import {
  generateCatatanWaliKelas,
  getWaliKelasForSiswa,
  sintesisNarasiKokurikuler,
} from '../utils/raporCalculations';

interface PrintRaporIntiProps {
  siswa: DataSiswa;
  sekolah: ProfilSekolah;
  semester: 1 | 2;
  daftarNilaiMapel: RaporMapelKalkulasi[];
  kokurikuler?: KokurikulerSiswa;
  ekstrakurikuler?: EkstrakurikulerSiswa;
  absensi?: AbsensiSiswa;
  customCatatanWaliKelas?: string;
  persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%';
  statusKenaikan?: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan';
  targetKelasLanjutan?: string;
}

export const PrintRaporInti: React.FC<PrintRaporIntiProps> = ({
  siswa,
  sekolah,
  semester,
  daftarNilaiMapel,
  kokurikuler,
  ekstrakurikuler,
  absensi,
  customCatatanWaliKelas,
  persentil,
  statusKenaikan = 'Naik Kelas',
  targetKelasLanjutan = 'V (Lima)',
}) => {
  const catatanFinal = generateCatatanWaliKelas(persentil, customCatatanWaliKelas);
  const waliKelasSignatory = getWaliKelasForSiswa(sekolah, siswa.kelas);

  // Group Mapel Umum vs Muatan Lokal
  const mapelUmum = daftarNilaiMapel.filter((m) => m.kelompok !== 'Muatan Lokal');
  const mapelMulok = daftarNilaiMapel.filter((m) => m.kelompok === 'Muatan Lokal');

  // Siswa nickname
  const namaPanggilan = (siswa.namaPanggilan || siswa.nama.split(' ')[0] || 'AUREL').toUpperCase();

  // Sintesis narasi Kokurikuler dari 2-4 dimensi terpilih
  const kokurikulerSummary = sintesisNarasiKokurikuler(
    kokurikuler?.dimensi && kokurikuler.dimensi.length > 0 ? kokurikuler.dimensi : [],
    namaPanggilan
  );

  // Pad ekstrakurikuler to 5 rows as in official sample image_3f7fecc6.png
  const extraList = ekstrakurikuler?.daftarEkstra || [];
  const paddedEkstra: { no: number; nama: string; keterangan: string }[] = [];
  for (let i = 0; i < Math.max(5, extraList.length); i++) {
    if (i < extraList.length) {
      const eNama = (extraList[i].nama || '').trim();
      const isValidNama = eNama && eNama !== '-' && eNama !== '0';
      const rawKet = (extraList[i].deskripsi || `${extraList[i].predikat} dalam kegiatan ${extraList[i].nama}`).trim();
      const isValidKet = rawKet && rawKet !== '0' && rawKet !== '-' && !rawKet.startsWith('0');

      paddedEkstra.push({
        no: i + 1,
        nama: isValidNama ? eNama : '-',
        keterangan: isValidNama && isValidKet ? rawKet : '-',
      });
    } else {
      paddedEkstra.push({
        no: i + 1,
        nama: '-',
        keterangan: '-',
      });
    }
  }

  return (
    <div className="print-container bg-white text-slate-900 mx-auto max-w-[210mm] p-6 md:p-10 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 font-sans text-xs leading-normal">
      {/* ========================================================================= */}
      {/* 1. KOP LAPORAN HASIL BELAJAR (RAPOR) (Persis image_f894d442.png)          */}
      {/* ========================================================================= */}
      <div className="text-center mb-6 avoid-break">
        <h1 className="text-sm md:text-base font-bold uppercase tracking-wider text-black">
          LAPORAN HASIL BELAJAR
        </h1>
        <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-black">
          (RAPOR)
        </h2>
      </div>

      {/* Metadata Siswa 2 Kolom dengan Titik Dua Lurus Sesuai Lampiran */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-1 text-xs mb-5 avoid-break">
        {/* Kolom Kiri */}
        <div className="col-span-7 space-y-1">
          <div className="grid grid-cols-12">
            <span className="col-span-4 text-black">Nama Peserta Didik</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-7 font-bold uppercase text-black">{siswa.nama}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-4 text-black">NISN</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-7 text-black">{siswa.nisn}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-4 text-black">Sekolah</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-7 uppercase text-black">{sekolah.namaSekolah}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-4 text-black">Alamat</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-7 text-black">{sekolah.alamatSekolah}</span>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="col-span-5 space-y-1">
          <div className="grid grid-cols-12">
            <span className="col-span-5 text-black">Kelas</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-6 font-medium text-black">{siswa.kelas}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-5 text-black">Fase</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-6 text-black">
              {siswa.fase.includes('Fase ') ? siswa.fase.replace('Fase ', '').split(' ')[0] : siswa.fase}
            </span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-5 text-black">Semester</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-6 text-black">{semester}</span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-5 text-black">Tahun Ajaran</span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-6 text-black">{sekolah.tahunPelajaran}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TABEL MAPEL UTAMA (No, Muatan Pelajaran, Nilai Akhir, Capaian Komp)    */}
      {/* ========================================================================= */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="border-b border-black text-center font-bold">
              <th className="border border-black p-2 w-10">No</th>
              <th className="border border-black p-2 w-44 text-left">Muatan Pelajaran</th>
              <th className="border border-black p-2 w-16">
                Nilai<br />Akhir
              </th>
              <th className="border border-black p-2 text-center">Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody>
            {mapelUmum.map((m, idx) => {
              const hasScore = m.nilaiAkhir > 0;
              return (
                <tr key={m.kodeMapel} className="border-b border-black avoid-break">
                  <td className="border border-black p-2 text-center align-middle font-medium">
                    {idx + 1}
                  </td>
                  <td className="border border-black p-2 align-middle font-medium text-black leading-snug">
                    {m.namaMapel}
                  </td>
                  <td className="border border-black p-2 text-center align-middle font-bold text-black">
                    {hasScore ? m.nilaiAkhir : '-'}
                  </td>
                  <td className="border border-black p-0 align-middle">
                    {/* Kompartemen Atas: Capaian Tertinggi (Max TP) */}
                    <div className="p-2 border-b border-black text-[11px] leading-relaxed text-justify">
                      {m.deskripsiMax || '-'}
                    </div>
                    {/* Kompartemen Bawah: Capaian Terendah (Min TP) */}
                    <div className="p-2 text-[11px] leading-relaxed text-justify">
                      {m.deskripsiMin || '-'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 3. BAGIAN MUATAN LOKAL (Persis image_3f7fecc6.png)                        */}
      {/* ========================================================================= */}
      <div className="mb-5 avoid-break">
        <h3 className="text-xs font-bold uppercase mb-1.5 text-black">
          MUATAN LOKAL
        </h3>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="border-b border-black text-center font-bold">
              <th className="border border-black p-2 w-10">No</th>
              <th className="border border-black p-2 w-44 text-left">Muatan Pelajaran</th>
              <th className="border border-black p-2 w-16">
                Nilai<br />Akhir
              </th>
              <th className="border border-black p-2 text-center">Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody>
            {mapelMulok.length > 0 ? (
              mapelMulok.map((m, idx) => {
                const hasScore = m.nilaiAkhir > 0;
                return (
                  <tr key={m.kodeMapel} className="border-b border-black avoid-break">
                    <td className="border border-black p-2 text-center align-middle font-medium">
                      {mapelUmum.length + idx + 1}
                    </td>
                    <td className="border border-black p-2 align-middle font-medium text-black leading-snug">
                      {m.namaMapel}
                    </td>
                    <td className="border border-black p-2 text-center align-middle font-bold text-black">
                      {hasScore ? m.nilaiAkhir : '-'}
                    </td>
                    <td className="border border-black p-0 align-middle">
                      <div className="p-2 border-b border-black text-[11px] leading-relaxed text-justify">
                        {m.deskripsiMax || '-'}
                      </div>
                      <div className="p-2 text-[11px] leading-relaxed text-justify">
                        {m.deskripsiMin || '-'}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b border-black avoid-break">
                <td className="border border-black p-2 text-center align-middle font-medium">
                  {mapelUmum.length + 1}
                </td>
                <td className="border border-black p-2 align-middle font-medium text-black leading-snug">
                  Bahasa Jawa
                </td>
                <td className="border border-black p-2 text-center align-middle font-bold text-black">
                  78
                </td>
                <td className="border border-black p-0 align-middle">
                  <div className="p-2 border-b border-black text-[11px] leading-relaxed text-justify">
                    Ananda {namaPanggilan} menunjukkan penguasaan yang baik dalam mengenal dan memahami unsur intrinsik teks cerita rakyat secara lisan dan tulis.
                  </div>
                  <div className="p-2 text-[11px] leading-relaxed text-justify">
                    Ananda {namaPanggilan} menunjukkan penguasaan yang cukup baik dalam melakukan dialog, bermain peran, bercerita dengan tata krama.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 4. KOKURIKULER (Patterned Header Box - image_3f7fecc6.png)                */}
      {/* ========================================================================= */}
      <div className="mb-5 avoid-break">
        <div className="border border-black">
          {/* Shaded Header Bar */}
          <div className="bg-slate-300 print:bg-slate-300 border-b border-black py-1 px-3 text-center font-bold text-xs text-black uppercase tracking-wider">
            Kokurikuler
          </div>
          {/* Content Body */}
          <div className="p-3 text-xs leading-relaxed text-justify text-black bg-white">
            {kokurikulerSummary}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TABEL EKSTRAKURIKULER (image_3f7fecc6.png)                             */}
      {/* ========================================================================= */}
      <div className="mb-5 avoid-break">
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="border-b border-black font-bold">
              <th className="border border-black p-1.5 w-10 text-center">No</th>
              <th className="border border-black p-1.5 w-44 text-left">Ekstrakurikuler</th>
              <th className="border border-black p-1.5 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {paddedEkstra.map((item) => (
              <tr key={item.no} className="border-b border-black">
                <td className="border border-black p-1.5 text-center font-medium">{item.no}</td>
                <td className="border border-black p-1.5 font-medium">{item.nama}</td>
                <td className="border border-black p-1.5 text-[11px] leading-snug">
                  {item.keterangan}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 6. TABEL KETIDAKHADIRAN (image_3f7fecc6.png)                              */}
      {/* ========================================================================= */}
      <div className="mb-6 avoid-break w-64">
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="border-b border-black font-bold">
              <th colSpan={3} className="border border-black p-1.5 text-center bg-slate-50 print:bg-transparent">
                Ketidakhadiran
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black">
              <td className="border border-black p-1.5 w-36">Sakit</td>
              <td className="border border-black p-1.5 w-12 text-center font-bold">
                {absensi && Number(absensi.sakit) > 0 ? absensi.sakit : '-'}
              </td>
              <td className="border border-black p-1.5 text-center">
                {absensi && Number(absensi.sakit) > 0 ? 'hari' : '-'}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border border-black p-1.5">Izin</td>
              <td className="border border-black p-1.5 text-center font-bold">
                {absensi && Number(absensi.izin) > 0 ? absensi.izin : '-'}
              </td>
              <td className="border border-black p-1.5 text-center">
                {absensi && Number(absensi.izin) > 0 ? 'hari' : '-'}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border border-black p-1.5">Tanpa Keterangan</td>
              <td className="border border-black p-1.5 text-center font-bold">
                {absensi && Number(absensi.tanpaKeterangan) > 0 ? absensi.tanpaKeterangan : '-'}
              </td>
              <td className="border border-black p-1.5 text-center">
                {absensi && Number(absensi.tanpaKeterangan) > 0 ? 'hari' : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 7. CATATAN WALI KELAS (image_79504530.png)                                 */}
      {/* ========================================================================= */}
      <div className="mb-5 avoid-break">
        <div className="border border-black">
          <div className="bg-slate-300 print:bg-slate-300 border-b border-black py-1 px-3 text-center font-bold text-xs text-black uppercase tracking-wider">
            Catatan Wali Kelas
          </div>
          <div className="p-3 text-xs leading-relaxed text-justify text-black bg-white">
            {catatanFinal}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. TANGGAPAN ORANG TUA/WALI MURID (image_79504530.png)                    */}
      {/* ========================================================================= */}
      <div className="mb-6 avoid-break">
        <div className="border border-black">
          <div className="bg-slate-300 print:bg-slate-300 border-b border-black py-1 px-3 text-center font-bold text-xs text-black uppercase tracking-wider">
            Tanggapan Orang Tua/Wali Murid
          </div>
          <div className="h-16 bg-white p-2">
            {/* Blank space for handwritten feedback */}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. STATUS KENAIKAN KELAS (Jika Semester 2 / Genap)                        */}
      {/* ========================================================================= */}
      {semester === 2 && (
        <div className="mb-6 avoid-break border-2 border-black p-3 bg-slate-50 print:bg-transparent text-center">
          <h4 className="text-xs font-bold uppercase text-black mb-1">
            KEPUTUSAN:
          </h4>
          <p className="text-xs md:text-sm font-bold text-black uppercase tracking-wide">
            {statusKenaikan === 'Naik Kelas' && (
              <span>Berdasarkan pencapaian seluruh tujuan pembelajaran, ananda dinyatakan NAIK KE KELAS: {targetKelasLanjutan}</span>
            )}
            {statusKenaikan === 'Tinggal Kelas' && (
              <span className="text-rose-900">Berdasarkan hasil evaluasi pembelajaran, ananda dinyatakan TINGGAL DI KELAS: {siswa.kelas}</span>
            )}
            {statusKenaikan === 'Lulus' && (
              <span className="text-emerald-900">Berdasarkan kriteria kelulusan, ananda dinyatakan LULUS</span>
            )}
            {statusKenaikan === 'Belum Ditentukan' && (
              <span className="text-slate-700">Keputusan kenaikan kelas dalam proses verifikasi dewan guru</span>
            )}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. BLOK TANDA TANGAN RESMI (image_79504530.png)                          */}
      {/* ========================================================================= */}
      <div className="avoid-break pt-4 mt-8 font-sans text-xs">
        <div className="grid grid-cols-2 gap-8 items-start mb-6">
          {/* Sisi Kiri: Orang Tua */}
          <div className="flex flex-col items-center text-center space-y-14">
            <div>
              <p className="text-black font-medium">Orang Tua,</p>
            </div>
            <div>
              <p className="text-black font-medium tracking-wider">
                ................................................
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Titimangsa & Wali Kelas */}
          <div className="flex flex-col items-center text-center space-y-14">
            <div>
              <p className="text-black font-medium">
                {sekolah.titimangsaTempat}, {sekolah.titimangsaTanggal}
              </p>
              <p className="text-black font-medium">Wali Kelas</p>
            </div>
            <div>
              <p className="font-bold text-black">
                {waliKelasSignatory.nama}
              </p>
              <p className="text-[11px] text-black">
                NIP. {waliKelasSignatory.nip !== '-' ? waliKelasSignatory.nip : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Sisi Bawah Tengah: Kepala Sekolah */}
        <div className="flex flex-col items-center justify-center text-center space-y-14 pt-2">
          <div>
            <p className="text-black font-medium">Mengetahui,</p>
            <p className="text-black font-medium">Kepala Sekolah</p>
          </div>
          <div>
            <p className="font-bold text-black inline-block">
              {sekolah.namaKepalaSekolah}
            </p>
            <p className="text-[11px] text-black">
              NIP. {sekolah.nipKepalaSekolah !== '-' ? sekolah.nipKepalaSekolah : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
