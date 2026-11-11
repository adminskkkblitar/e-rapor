import React from 'react';
import { MasterKurikulumMapel } from '../types/rapor';
import { generateCatatanWaliKelas } from '../utils/raporCalculations';
import { Award, CheckCircle, Download, EyeOff, Printer, Sparkles } from 'lucide-react';

export interface LegerRowData {
  nis: string;
  nama: string;
  kelas: string;
  nilaiPerMapel?: Record<string, number>; // kodeMapel -> Nilai Akhir
  totalNilai: number;
  rataRata: number;
  ranking: number;
  persentil: 'Top 10%' | 'Middle 60%' | 'Bottom 30%';
  customCatatan: string;
  statusKenaikan: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan';
  targetKelas?: string;
}

interface LegerTableProps {
  rows: LegerRowData[];
  semester: 1 | 2;
  kurikulum?: MasterKurikulumMapel[];
  onUpdateCustomCatatan: (nis: string, text: string) => void;
  onUpdateStatusKenaikan: (
    nis: string,
    status: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Belum Ditentukan',
    targetKelas?: string
  ) => void;
}

export const LegerTable: React.FC<LegerTableProps> = ({
  rows,
  semester,
  kurikulum = [],
  onUpdateCustomCatatan,
  onUpdateStatusKenaikan,
}) => {
  // Hitung rata-rata kelas per mapel
  const mapelAverages = React.useMemo(() => {
    const avgs: Record<string, { total: number; count: number; avg: number }> = {};
    kurikulum.forEach((m) => {
      avgs[m.kodeMapel] = { total: 0, count: 0, avg: 0 };
    });

    rows.forEach((r) => {
      if (r.nilaiPerMapel) {
        Object.entries(r.nilaiPerMapel).forEach(([kode, val]) => {
          if (avgs[kode] && val > 0) {
            avgs[kode].total += val;
            avgs[kode].count += 1;
          }
        });
      }
    });

    Object.keys(avgs).forEach((k) => {
      avgs[k].avg =
        avgs[k].count > 0 ? Math.round((avgs[k].total / avgs[k].count) * 10) / 10 : 0;
    });

    return avgs;
  }, [rows, kurikulum]);

  // Export Leger to CSV
  const handleExportCsv = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      'Kelas',
      ...kurikulum.map((m) => `NA_${m.namaMapel}`),
      'Total Nilai',
      'Rata-rata',
      'Peringkat Terselubung',
      'Kategori Persentil',
      'Catatan Wali Kelas',
      'Keputusan Kenaikan',
      'Target Kelas',
    ];

    const csvRows = rows.map((r, idx) => {
      const mapelScores = kurikulum.map((m) => r.nilaiPerMapel?.[m.kodeMapel] || 0);
      return [
        idx + 1,
        `"${r.nis}"`,
        `"${r.nama}"`,
        `"${r.kelas}"`,
        ...mapelScores,
        r.totalNilai,
        r.rataRata,
        r.ranking,
        `"${r.persentil}"`,
        `"${r.customCatatan || generateCatatanWaliKelas(r.persentil, '')}"`,
        `"${r.statusKenaikan}"`,
        `"${r.targetKelas || '-'}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leger_Nilai_Semester_${semester}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner on Hidden Ranking */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <EyeOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold uppercase tracking-wider block mb-1">
              Prinsip Peringkat Terselubung & Leger Terbuka (Kurikulum Deep Learning)
            </span>
            Leger ini memuat seluruh <strong>Nilai Akhir (NA) dari 10 Mata Pelajaran</strong>, total nilai, dan rata-rata kelas.{' '}
            Peringkat kelas <em>(Juara #1 s/d #{rows.length})</em> <strong>hanya tersimpan di Leger</strong> sebagai rujukan pembimbingan dan penentuan catatan wali kelas.{' '}
            <strong>Dilarang keras memunculkan angka peringkat ini di lembar cetak rapor fisik siswa!</strong>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Header Bar with Action Buttons */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Leger Nilai Lengkap (Seluruh Nilai Akhir Mapel) • Semester {semester}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan rincian nilai akhir tiap mata pelajaran, total, rata-rata, peringkat terselubung, dan keputusan kenaikan.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              title="Unduh seluruh data Leger ke file Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV Leger</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              title="Cetak Leger Nilai"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Leger</span>
            </button>
          </div>
        </div>

        {/* The Complete Leger Table with Every Subject Column */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-[11px] border-b border-slate-300">
              <tr>
                <th rowSpan={2} className="py-2.5 px-2.5 text-center w-10 border-r border-slate-200">
                  No
                </th>
                <th rowSpan={2} className="py-2.5 px-3 min-w-[170px] border-r border-slate-200">
                  Nama Siswa & NIS
                </th>
                {/* Header Group: Nilai Akhir Mata Pelajaran */}
                <th
                  colSpan={kurikulum.length}
                  className="py-1.5 px-2 text-center bg-indigo-50 border-r border-slate-200 text-indigo-950 font-bold"
                >
                  Nilai Akhir (NA) Mata Pelajaran
                </th>
                <th rowSpan={2} className="py-2.5 px-2 text-center w-16 bg-slate-50 border-r border-slate-200">
                  Total
                </th>
                <th rowSpan={2} className="py-2.5 px-2 text-center w-16 bg-slate-50 border-r border-slate-200 font-extrabold text-indigo-700">
                  Rata-rata
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-2.5 text-center w-28 bg-amber-50 border-r border-amber-200 text-amber-950"
                  title="Peringkat tersembunyi untuk catatan wali kelas"
                >
                  <span className="flex items-center justify-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Peringkat
                  </span>
                </th>
                <th rowSpan={2} className="py-2.5 px-3 min-w-[240px] border-r border-slate-200">
                  Catatan Wali Kelas (Hybrid)
                </th>
                {semester === 2 && (
                  <th rowSpan={2} className="py-2.5 px-3 w-40 text-center bg-emerald-50 text-emerald-950">
                    Keputusan Kenaikan
                  </th>
                )}
              </tr>
              {/* Sub-header for each Mapel */}
              <tr className="bg-slate-100 text-[10px] text-slate-700 border-b border-slate-300">
                {kurikulum.map((m, mIdx) => (
                  <th
                    key={m.kodeMapel}
                    className={`py-1.5 px-1.5 text-center min-w-[50px] border-r border-slate-200 ${
                      m.kelompok === 'Muatan Lokal' ? 'bg-amber-50/50' : 'bg-indigo-50/30'
                    }`}
                    title={`${m.kodeMapel}: ${m.namaMapel} (${m.kelompok})`}
                  >
                    <span className="truncate block max-w-[55px]">
                      {m.namaMapel.length > 8 ? m.namaMapel.slice(0, 7) + '.' : m.namaMapel}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row, idx) => {
                const autoNote = generateCatatanWaliKelas(row.persentil, '');
                const hasCustom = row.customCatatan && row.customCatatan.trim().length > 0;

                return (
                  <tr key={row.nis} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-2 text-center font-semibold text-slate-500 border-r border-slate-200">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900 leading-tight">{row.nama}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        NIS: {row.nis} • Kelas {row.kelas}
                      </div>
                    </td>

                    {/* All Subject Nilai Akhir Columns */}
                    {kurikulum.map((m) => {
                      const score = row.nilaiPerMapel?.[m.kodeMapel] ?? 0;
                      return (
                        <td
                          key={m.kodeMapel}
                          className={`py-2.5 px-1.5 text-center font-semibold text-xs border-r border-slate-200 ${
                            score >= 85
                              ? 'text-emerald-700 bg-emerald-50/20'
                              : score >= 75
                              ? 'text-slate-900'
                              : score > 0
                              ? 'text-amber-700 bg-amber-50/30'
                              : 'text-slate-300'
                          }`}
                        >
                          {score > 0 ? score : '-'}
                        </td>
                      );
                    })}

                    {/* Total Nilai */}
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                      {row.totalNilai}
                    </td>

                    {/* Rata-Rata */}
                    <td className="py-2.5 px-2 text-center border-r border-slate-200">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-50 font-extrabold text-indigo-700 text-xs">
                        {row.rataRata}
                      </span>
                    </td>

                    {/* Peringkat Terselubung */}
                    <td className="py-2.5 px-2 text-center bg-amber-50/30 border-r border-amber-100">
                      <div className="font-extrabold text-amber-950 text-xs">
                        #{row.ranking}
                      </div>
                      <span
                        className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded mt-0.5 ${
                          row.persentil === 'Top 10%'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.persentil === 'Bottom 30%'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {row.persentil}
                      </span>
                    </td>

                    {/* Catatan Wali Kelas Hybrid */}
                    <td className="py-2.5 px-3 space-y-1 border-r border-slate-200">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-600">
                          {hasCustom ? (
                            <span className="text-indigo-600 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Manual
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Otomatis ({row.persentil})
                            </span>
                          )}
                        </span>
                        {hasCustom && (
                          <button
                            type="button"
                            onClick={() => onUpdateCustomCatatan(row.nis, '')}
                            className="text-[10px] text-rose-500 hover:underline"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={1}
                        value={row.customCatatan}
                        placeholder={`Otomatis: "${autoNote}"`}
                        onChange={(e) => onUpdateCustomCatatan(row.nis, e.target.value)}
                        className="w-full text-[11px] text-slate-800 bg-slate-50 border border-slate-200 rounded p-1.5 focus:ring-2 focus:ring-indigo-500 leading-tight"
                      />
                    </td>

                    {/* Status Kenaikan (Semester 2) */}
                    {semester === 2 && (
                      <td className="py-2.5 px-2 text-center space-y-1 bg-emerald-50/10">
                        <select
                          value={row.statusKenaikan}
                          onChange={(e) =>
                            onUpdateStatusKenaikan(
                              row.nis,
                              e.target.value as any,
                              row.targetKelas
                            )
                          }
                          className={`w-full font-bold text-[11px] rounded px-1.5 py-1 border ${
                            row.statusKenaikan === 'Naik Kelas'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : row.statusKenaikan === 'Tinggal Kelas'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-white text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="Naik Kelas">Naik Kelas</option>
                          <option value="Tinggal Kelas">Tinggal Kelas</option>
                          <option value="Lulus">Lulus</option>
                          <option value="Belum Ditentukan">Belum Ditentukan</option>
                        </select>

                        {row.statusKenaikan === 'Naik Kelas' && (
                          <input
                            type="text"
                            value={row.targetKelas || 'Kelas VI (Enam)'}
                            onChange={(e) =>
                              onUpdateStatusKenaikan(row.nis, row.statusKenaikan, e.target.value)
                            }
                            placeholder="Target Kelas"
                            className="w-full text-[10px] text-center font-medium bg-white border border-slate-300 rounded px-1 py-0.5"
                          />
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>

            {/* Bottom Row: Class Averages Per Subject */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900 text-[11px]">
              <tr>
                <td colSpan={2} className="py-2 px-3 text-right uppercase border-r border-slate-200">
                  Rata-Rata Kelas:
                </td>
                {kurikulum.map((m) => {
                  const avg = mapelAverages[m.kodeMapel]?.avg || 0;
                  return (
                    <td
                      key={m.kodeMapel}
                      className="py-2 px-1 text-center border-r border-slate-200 text-indigo-900 font-extrabold"
                    >
                      {avg > 0 ? avg : '-'}
                    </td>
                  );
                })}
                <td className="py-2 px-2 text-center border-r border-slate-200 text-slate-900">
                  {Math.round(
                    rows.reduce((acc, r) => acc + r.totalNilai, 0) / Math.max(1, rows.length)
                  )}
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-200 text-indigo-700">
                  {Math.round(
                    (rows.reduce((acc, r) => acc + r.rataRata, 0) / Math.max(1, rows.length)) * 10
                  ) / 10}
                </td>
                <td colSpan={semester === 2 ? 3 : 2} className="py-2 px-3 text-slate-500 italic text-[10px]">
                  * Dihitung otomatis dari seluruh data nilai siswa aktif
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
