import React, { useState } from 'react';
import { DataSiswa, ProfilSekolah } from '../types/rapor';
import { Edit3, UserCheck, Users, Check, X, Sparkles } from 'lucide-react';

interface PrintCoverProps {
  siswa: DataSiswa;
  sekolah: ProfilSekolah;
  allSiswa?: DataSiswa[];
  onSelectSiswa?: (nis: string) => void;
  onUpdateSiswa?: (updatedSiswa: DataSiswa) => void;
}

export const PrintCover: React.FC<PrintCoverProps> = ({
  siswa,
  sekolah,
  allSiswa = [],
  onSelectSiswa,
  onUpdateSiswa,
}) => {
  const [activeCoverPage, setActiveCoverPage] = useState<'all' | '1' | '2' | '3'>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<DataSiswa>(siswa);

  // Sync editForm when selected student changes
  React.useEffect(() => {
    setEditForm(siswa);
  }, [siswa]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSiswa) {
      onUpdateSiswa(editForm);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Cover Page Selector & Dynamic Student Tools (Hidden on print) */}
      <div className="no-print bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Halaman:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveCoverPage('all')}
                className={`px-3 py-1 rounded-md transition ${
                  activeCoverPage === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua (3 Hal)
              </button>
              <button
                type="button"
                onClick={() => setActiveCoverPage('1')}
                className={`px-3 py-1 rounded-md transition ${
                  activeCoverPage === '1'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hal 1: Depan
              </button>
              <button
                type="button"
                onClick={() => setActiveCoverPage('2')}
                className={`px-3 py-1 rounded-md transition ${
                  activeCoverPage === '2'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hal 2: Sekolah
              </button>
              <button
                type="button"
                onClick={() => setActiveCoverPage('3')}
                className={`px-3 py-1 rounded-md transition ${
                  activeCoverPage === '3'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hal 3: Siswa
              </button>
            </div>
          </div>

          {/* Quick Student Switcher for Cover */}
          {allSiswa.length > 0 && onSelectSiswa && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-600">Pilih Siswa:</span>
              <select
                value={siswa.nis}
                onChange={(e) => onSelectSiswa(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {allSiswa.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nisn})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onUpdateSiswa && (
            <button
              type="button"
              onClick={() => {
                setEditForm(siswa);
                setIsEditModalOpen(true);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Edit Data Siswa, Orang Tua, dan Alamat untuk Sampul"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Biodata Siswa Ini</span>
            </button>
          )}

          <span className="text-[11px] text-slate-500 italic hidden xl:inline">
            Isian dinamis 100% tersambung database siswa
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HALAMAN 1: SAMPUL DEPAN (Sesuai image_0838c2c6.png)                      */}
      {/* ========================================================================= */}
      {(activeCoverPage === 'all' || activeCoverPage === '1') && (
        <div className="print-container bg-white text-slate-900 mx-auto max-w-[210mm] min-h-[297mm] p-6 md:p-10 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 font-serif page-break-after">
          {/* Thin rectangular outer border exactly as in image_0838c2c6.png */}
          <div className="border border-black min-h-[275mm] p-8 md:p-12 flex flex-col justify-between items-center text-center">
            {/* Top Logo & Title */}
            <div className="w-full flex flex-col items-center pt-4">
              {/* Tut Wuri Handayani Official Vector High-Res Logo */}
              <div className="w-32 h-32 mb-6 flex items-center justify-center">
                <img
                  src="/assets/aistudio/image_b00cfbb0.png"
                  alt="Logo Tut Wuri Handayani"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title Section (Exact spacing and typography from image_0838c2c6.png) */}
              <h1 className="text-xl md:text-2xl font-bold tracking-[0.35em] text-black mb-1 uppercase">
                R A P O R
              </h1>
              <h2 className="text-base md:text-lg font-bold tracking-wider text-black mb-1 uppercase">
                PESERTA DIDIK
              </h2>
              <h2 className="text-base md:text-lg font-bold tracking-wider text-black mb-1 uppercase">
                SEKOLAH DASAR
              </h2>
              <h3 className="text-base md:text-lg font-bold tracking-wider text-black uppercase">
                (SD)
              </h3>
            </div>

            {/* Middle Section: Box Nama & Box NISN (Exact matches to image_0838c2c6.png) */}
            <div className="w-full max-w-lg my-12 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-black">Nama Peserta Didik :</p>
                <div className="border-2 border-black py-2.5 px-4 bg-white">
                  <p className="text-base md:text-lg font-bold tracking-wider uppercase text-black">
                    {siswa.nama}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-black">NISN</p>
                <div className="border-2 border-black py-2 px-4 bg-white">
                  <p className="text-base md:text-lg font-bold tracking-[0.2em] text-black font-mono">
                    {siswa.nisn || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Kementerian Pendidikan dan Kebudayaan Republik Indonesia */}
            <div className="w-full pb-6 text-center space-y-1">
              <p className="text-xs md:text-sm font-bold tracking-wider uppercase text-black">
                KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN
              </p>
              <p className="text-xs md:text-sm font-bold tracking-wider uppercase text-black">
                REPUBLIK INDONESIA
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 2: IDENTITAS SEKOLAH (Sesuai image_a4f2202f.png)                  */}
      {/* ========================================================================= */}
      {(activeCoverPage === 'all' || activeCoverPage === '2') && (
        <div className="print-container bg-white text-slate-900 mx-auto max-w-[210mm] min-h-[297mm] p-6 md:p-10 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 font-serif page-break-after">
          <div className="border border-black min-h-[275mm] p-10 md:p-14 flex flex-col justify-between">
            {/* Top Title */}
            <div className="text-center pt-8 space-y-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-[0.35em] text-black uppercase">
                R A P O R
              </h1>
              <h2 className="text-base md:text-lg font-bold tracking-wider text-black uppercase">
                PESERTA DIDIK
              </h2>
              <h2 className="text-base md:text-lg font-bold tracking-wider text-black uppercase">
                SEKOLAH DASAR ( SD )
              </h2>
            </div>

            {/* School Details List exactly aligned as in image_a4f2202f.png */}
            <div className="my-12 max-w-xl mx-auto w-full text-xs md:text-sm leading-relaxed space-y-2.5">
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Nama Sekolah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold uppercase text-black">{sekolah.namaSekolah}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">NPSN</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.npsn && sekolah.npsn !== '-' ? sekolah.npsn : '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Alamat Sekolah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.alamatSekolah || '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Kode Pos</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.kodePos && sekolah.kodePos !== '-' ? sekolah.kodePos : '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Desa / Kelurahan</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.kelurahan || '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Kecamatan</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.kecamatan || '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Kabupaten / Kota</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.kotaKabupaten || '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Provinsi</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.provinsi || '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Website</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.website && sekolah.website !== '-' ? sekolah.website : '-'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">E-mail</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{sekolah.email && sekolah.email !== '-' ? sekolah.email : '-'}</span>
              </div>
            </div>

            {/* Bottom empty spacing to match original page proportion */}
            <div className="pb-12"></div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 3: IDENTITAS PESERTA DIDIK (Sesuai image_ccdca5b7.png)           */}
      {/* ========================================================================= */}
      {(activeCoverPage === 'all' || activeCoverPage === '3') && (
        <div className="print-container bg-white text-slate-900 mx-auto max-w-[210mm] min-h-[297mm] p-6 md:p-10 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 font-serif page-break-after">
          <div className="border border-black min-h-[275mm] p-8 md:p-12 flex flex-col justify-between">
            {/* Header */}
            <div className="text-center pt-2">
              <h1 className="text-base md:text-lg font-bold tracking-wider text-black uppercase">
                IDENTITAS PESERTA DIDIK
              </h1>
            </div>

            {/* Student Biodata Table matching image_ccdca5b7.png */}
            <div className="my-6 max-w-xl mx-auto w-full text-xs md:text-sm leading-relaxed space-y-1.5">
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Nama Peserta Didik</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold uppercase text-black">{siswa.nama}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">NISN / NIS</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black font-medium">
                  {siswa.nisn} {siswa.nis ? `/ ${siswa.nis}` : ''}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Tempat, Tanggal Lahir</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">
                  {siswa.tempatLahir}, {siswa.tanggalLahir}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Jenis Kelamin</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{siswa.jenisKelamin}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Agama</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.agama}</span>
              </div>

              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 text-black">Alamat Peserta Didik</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.alamat}</span>
              </div>

              {/* Nama Orang Tua */}
              <div className="pt-2 font-medium text-black">Nama Orang Tua</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Ayah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.namaAyah}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Ibu</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.namaIbu}</span>
              </div>

              {/* Pekerjaan Orang Tua */}
              <div className="pt-2 font-medium text-black">Pekerjaan Orang Tua</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Ayah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.pekerjaanAyah}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Ibu</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.pekerjaanIbu}</span>
              </div>

              {/* Alamat Orang Tua */}
              <div className="pt-2 font-medium text-black">Alamat Orang Tua</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Jalan</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.alamatOrtuJalan}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Kelurahan/Desa</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.alamatOrtuKelurahan}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Kecamatan</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.alamatOrtuKecamatan}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Kabupaten / Kota</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.alamatOrtuKota}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Provinsi</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 uppercase text-black">{siswa.alamatOrtuProvinsi}</span>
              </div>

              {/* Wali Peserta Didik */}
              <div className="pt-2 font-medium text-black">Wali Peserta Didik</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Nama</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{siswa.namaWali || '-'}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Pekerjaan</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{siswa.pekerjaanWali || '-'}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4 text-black">Alamat</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-black">{siswa.alamatWali || '-'}</span>
              </div>
            </div>

            {/* Bottom Section: Photo Box & Kepala Sekolah Signature (Exactly as in image_ccdca5b7.png) */}
            <div className="pt-4 pb-4 flex items-end justify-between max-w-xl mx-auto w-full text-xs md:text-sm">
              {/* Photo Box Placeholder 3 x 4 cm */}
              <div className="w-24 h-32 border border-black flex flex-col items-center justify-center text-center p-2 text-[10px] text-slate-500 bg-slate-50/50">
                <span>Foto</span>
                <span>3 x 4 cm</span>
              </div>

              {/* Signature Kepala Sekolah */}
              <div className="text-left w-56 space-y-12">
                <div>
                  <p className="text-black">Kepala Sekolah,</p>
                </div>
                <div>
                  <p className="font-bold underline text-black">
                    {sekolah.namaKepalaSekolah}
                  </p>
                  <p className="text-[11px] text-black">
                    NIP. {sekolah.nipKepalaSekolah !== '-' ? sekolah.nipKepalaSekolah : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT BIODATA SISWA DINAMIS (Untuk Sampul & Rapor)                  */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Biodata Peserta Didik (Isian Sampul & Rapor Dinamis)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Perubahan data akan otomatis mengupdate Sampul Hal 1, 2, 3 dan Rapor Inti
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Preset Buttons for Quick Testing */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Preset Contoh Lampiran:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm((prev) => ({
                        ...prev,
                        nama: 'ADRY GRACIO SURYAJAYA',
                        namaPanggilan: 'Adry',
                        nisn: '0158352348',
                        nis: '230101',
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
                      }));
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium"
                  >
                    Contoh 1: ADRY GRACIO
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm((prev) => ({
                        ...prev,
                        nama: 'AUREL AFCELLA SINURAT',
                        namaPanggilan: 'Aurel',
                        nisn: '0152573944',
                        nis: '230107',
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
                      }));
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium"
                  >
                    Contoh 2: AUREL SINURAT
                  </button>
                </div>
              </div>

              {/* 1. Identitas Utama */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                  1. Identitas Peserta Didik
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Lengkap Peserta Didik:
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nama}
                      onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold uppercase"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Panggilan (untuk Narasi):
                    </label>
                    <input
                      type="text"
                      value={editForm.namaPanggilan || ''}
                      onChange={(e) => setEditForm({ ...editForm, namaPanggilan: e.target.value })}
                      placeholder="e.g. Adry atau Aurel"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NISN:</label>
                    <input
                      type="text"
                      required
                      value={editForm.nisn}
                      onChange={(e) => setEditForm({ ...editForm, nisn: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIS:</label>
                    <input
                      type="text"
                      required
                      value={editForm.nis}
                      onChange={(e) => setEditForm({ ...editForm, nis: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kelas:</label>
                    <input
                      type="text"
                      value={editForm.kelas}
                      onChange={(e) => setEditForm({ ...editForm, kelas: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fase:</label>
                    <input
                      type="text"
                      value={editForm.fase}
                      onChange={(e) => setEditForm({ ...editForm, fase: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir:</label>
                    <input
                      type="text"
                      value={editForm.tempatLahir}
                      onChange={(e) => setEditForm({ ...editForm, tempatLahir: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir:</label>
                    <input
                      type="text"
                      value={editForm.tanggalLahir}
                      onChange={(e) => setEditForm({ ...editForm, tanggalLahir: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin:</label>
                    <select
                      value={editForm.jenisKelamin}
                      onChange={(e) =>
                        setEditForm({ ...editForm, jenisKelamin: e.target.value as 'L' | 'P' })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    >
                      <option value="L">L (Laki-laki)</option>
                      <option value="P">P (Perempuan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Agama:</label>
                    <input
                      type="text"
                      value={editForm.agama}
                      onChange={(e) => setEditForm({ ...editForm, agama: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Peserta Didik:</label>
                  <input
                    type="text"
                    value={editForm.alamat}
                    onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              {/* 2. Orang Tua & Pekerjaan */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                  2. Orang Tua & Pekerjaan
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Ayah:</label>
                    <input
                      type="text"
                      value={editForm.namaAyah}
                      onChange={(e) => setEditForm({ ...editForm, namaAyah: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Ibu:</label>
                    <input
                      type="text"
                      value={editForm.namaIbu}
                      onChange={(e) => setEditForm({ ...editForm, namaIbu: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Ayah:</label>
                    <input
                      type="text"
                      value={editForm.pekerjaanAyah}
                      onChange={(e) => setEditForm({ ...editForm, pekerjaanAyah: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Ibu:</label>
                    <input
                      type="text"
                      value={editForm.pekerjaanIbu}
                      onChange={(e) => setEditForm({ ...editForm, pekerjaanIbu: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Alamat Orang Tua */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                  3. Alamat Orang Tua Lengkap
                </h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jalan / Dusun / RT / RW:</label>
                  <input
                    type="text"
                    value={editForm.alamatOrtuJalan}
                    onChange={(e) => setEditForm({ ...editForm, alamatOrtuJalan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kelurahan / Desa:</label>
                    <input
                      type="text"
                      value={editForm.alamatOrtuKelurahan}
                      onChange={(e) =>
                        setEditForm({ ...editForm, alamatOrtuKelurahan: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kecamatan:</label>
                    <input
                      type="text"
                      value={editForm.alamatOrtuKecamatan}
                      onChange={(e) =>
                        setEditForm({ ...editForm, alamatOrtuKecamatan: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota:</label>
                    <input
                      type="text"
                      value={editForm.alamatOrtuKota}
                      onChange={(e) => setEditForm({ ...editForm, alamatOrtuKota: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Provinsi:</label>
                    <input
                      type="text"
                      value={editForm.alamatOrtuProvinsi}
                      onChange={(e) =>
                        setEditForm({ ...editForm, alamatOrtuProvinsi: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Wali Peserta Didik */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                  4. Wali Peserta Didik (Opsional)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Wali:</label>
                    <input
                      type="text"
                      value={editForm.namaWali || ''}
                      onChange={(e) => setEditForm({ ...editForm, namaWali: e.target.value })}
                      placeholder="-"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Wali:</label>
                    <input
                      type="text"
                      value={editForm.pekerjaanWali || ''}
                      onChange={(e) => setEditForm({ ...editForm, pekerjaanWali: e.target.value })}
                      placeholder="-"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Wali:</label>
                    <input
                      type="text"
                      value={editForm.alamatWali || ''}
                      onChange={(e) => setEditForm({ ...editForm, alamatWali: e.target.value })}
                      placeholder="-"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Terapkan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
