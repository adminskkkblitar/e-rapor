import React, { useState } from 'react';
import { MasterKurikulumMapel } from '../types/rapor';
import { BookOpen, ChevronRight, Edit3, Plus, Sparkles } from 'lucide-react';

interface MasterKurikulumViewProps {
  kurikulum: MasterKurikulumMapel[];
  onUpdateMapel: (updatedMapel: MasterKurikulumMapel) => void;
}

export const MasterKurikulumView: React.FC<MasterKurikulumViewProps> = ({
  kurikulum,
  onUpdateMapel,
}) => {
  const [selectedKode, setSelectedKode] = useState<string>(kurikulum[0]?.kodeMapel || '');
  const activeMapel = kurikulum.find((m) => m.kodeMapel === selectedKode) || kurikulum[0];

  const handleTpChange = (index: number, newText: string) => {
    const updatedTp = [...activeMapel.tpNarasi];
    updatedTp[index] = newText;
    onUpdateMapel({
      ...activeMapel,
      tpNarasi: updatedTp,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Master Kurikulum Deep Learning (25 Tujuan Pembelajaran)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Setiap mata pelajaran mengikat CP (Capaian Pembelajaran), ATP (Alur Tujuan Pembelajaran), dan 25 teks narasi TP yang dijadikan basis penyusunan deskripsi capaian rapor secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Pilih Mapel:</span>
            <select
              value={selectedKode}
              onChange={(e) => setSelectedKode(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500"
            >
              {kurikulum.map((m) => (
                <option key={m.kodeMapel} value={m.kodeMapel}>
                  [{m.kodeMapel}] {m.namaMapel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CP & ATP Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Capaian Pembelajaran (CP)
            </h3>
            <textarea
              rows={5}
              value={activeMapel.cp}
              onChange={(e) => onUpdateMapel({ ...activeMapel, cp: e.target.value })}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-indigo-600" />
              Alur Tujuan Pembelajaran (ATP)
            </h3>
            <textarea
              rows={5}
              value={activeMapel.atp}
              onChange={(e) => onUpdateMapel({ ...activeMapel, atp: e.target.value })}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <p className="font-bold">Tips Formula Deskripsi:</p>
            <p className="text-[11px] leading-relaxed">
              Tulis narasi TP dengan kata kerja operasional atau esensi materi (contoh: <em>"memahami operasi hitung pecahan desimal"</em>), karena sistem akan merangkainya ke dalam pola kalimat: <strong>"Menunjukkan penguasaan sangat baik dalam [teks TP Max], namun perlu bimbingan dalam [teks TP Min]."</strong>
            </p>
          </div>
        </div>

        {/* 25 TPs Narrative List */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Daftar 25 Teks Narasi Tujuan Pembelajaran (TP_1 s.d. TP_25)
            </h3>
            <span className="text-xs bg-slate-100 font-semibold px-2.5 py-1 rounded-full text-slate-700">
              {activeMapel.namaMapel}
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {activeMapel.tpNarasi.map((tpText, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white transition"
              >
                <span className="w-10 h-7 rounded bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  TP_{idx + 1}
                </span>

                <div className="flex-1">
                  <input
                    type="text"
                    value={tpText}
                    onChange={(e) => handleTpChange(idx, e.target.value)}
                    placeholder={`Teks narasi tujuan pembelajaran ke-${idx + 1}...`}
                    className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
