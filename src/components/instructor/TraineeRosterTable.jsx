import React, { useState } from 'react';
import { Search, Download, ChevronRight } from 'lucide-react';
import { exportTraineeRosterCSV } from './ReportExporter';

export function TraineeRosterTable({ trainees = [], onSelectTrainee = () => {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('ALL');

  const filtered = trainees.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = filterUnit === 'ALL' || t.service.toLowerCase().includes(filterUnit.toLowerCase());
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div>
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Unit Trainee Roster ({trainees.length} Personnel)
          </h3>
          <p className="text-xs text-gray-400 font-sans">
            Officer and air defense sentry readiness logs across army and air force commands
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTraineeRosterCSV(trainees)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-[#FF1A1A] text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by rank, name, or unit..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1A1A] font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'Army', 'Air Force', 'Navy'].map(unit => (
            <button
              key={unit}
              onClick={() => setFilterUnit(unit)}
              className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                filterUnit === unit
                  ? 'bg-[#B30000]/25 border-[#FF1A1A] text-[#FF1A1A] font-bold shadow-red-glow-sm'
                  : 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase">
              <th className="pb-3 px-3">Trainee / Rank</th>
              <th className="pb-3 px-3">Service & Unit</th>
              <th className="pb-3 px-3 text-center">Sessions</th>
              <th className="pb-3 px-3 text-center">Avg Score</th>
              <th className="pb-3 px-3 text-center">Avg Latency</th>
              <th className="pb-3 px-3 text-center">Classification</th>
              <th className="pb-3 px-3 text-center">Status</th>
              <th className="pb-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-semibold text-white font-sans text-sm">{t.name}</div>
                  <div className="text-[10px] text-gray-500">{t.rank} • {t.id}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-gray-300">{t.unit}</div>
                  <div className="text-[10px] text-gray-500">{t.service}</div>
                </td>
                <td className="py-3 px-3 text-center text-[#FF1A1A] font-bold">
                  {t.completedSessions}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`font-bold ${
                    t.avgScore >= 90 ? 'text-emerald-400' :
                    t.avgScore >= 75 ? 'text-[#FF1A1A]' :
                    t.avgScore >= 60 ? 'text-amber-400' : 'text-red-500'
                  }`}>
                    {t.avgScore}%
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-gray-300">
                  {t.avgDetectionTime}s
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-semibold">
                  {t.classificationAccuracy}%
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                    t.qualificationStatus === 'INSTRUCTOR_CERTIFIED' ? 'bg-purple-950/40 text-purple-400 border-purple-500/40' :
                    t.qualificationStatus === 'QUALIFIED_COMBAT_READY' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' :
                    'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  }`}>
                    {t.qualificationStatus === 'QUALIFIED_COMBAT_READY' ? 'COMBAT READY' :
                     t.qualificationStatus === 'INSTRUCTOR_CERTIFIED' ? 'INSTRUCTOR' : 'PROVISIONAL'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectTrainee(t)}
                    className="p-1.5 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-[#FF1A1A] transition-colors"
                    title="View Trainee Dossier"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

