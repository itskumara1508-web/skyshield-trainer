import React from 'react';
import { AlertOctagon, ArrowRight } from 'lucide-react';

export function MistakeAnalysisList({ commonMistakes = [], onPracticeMistake = () => {} }) {
  const defaultMistakes = [
    {
      mistake: 'Premature Engagement on Civilian Drone',
      count: 4,
      severity: 'CRITICAL',
      doctrineFix: 'Enforce RF warning & optical confirmation prior to authorizing kinetic weapons in mixed airspace.'
    },
    {
      mistake: 'Hesitation on High-Speed Attack Dives',
      count: 3,
      severity: 'HIGH',
      doctrineFix: 'If closing rate exceeds 15 m/s inside 35m perimeter, transition immediately from RF jam to kinetic intercept.'
    },
    {
      mistake: 'Interceptor Ammunition Expended on Ghost Tracks',
      count: 3,
      severity: 'MEDIUM',
      doctrineFix: 'Cross-check EO/IR thermal channel: EW phantom tracks lack optical and thermal radiation signatures.'
    },
    {
      mistake: 'Delayed Airspace Pickup in Degraded Radar Conditions',
      count: 2,
      severity: 'MEDIUM',
      doctrineFix: 'Expand optical scan sectors when radar confidence falls below 60% due to rain or terrain clutter.'
    }
  ];

  const displayList = commonMistakes.length > 0 ? commonMistakes : defaultMistakes;

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-[#FF1A1A]" />
          <div>
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Diagnostic: Recurring Tactical Deficiencies
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Algorithmic pattern recognition of common operator errors and remediation steps
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#FF1A1A] px-2 py-0.5 rounded bg-[#B30000]/15 border border-[#FF1A1A]/40 font-bold uppercase">
          CORRECTIVE ACTIONS
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {displayList.map((item, idx) => {
          const isCritical = item.severity === 'CRITICAL' || item.count >= 4;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                isCritical
                  ? 'bg-[#B30000]/10 border-[#FF1A1A]/40'
                  : 'bg-[#0A0A0A] border-white/10'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isCritical
                      ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {item.severity || 'TACTICAL ERROR'}
                  </span>
                  <span className="font-bold text-white text-sm font-sans">{item.mistake}</span>
                  <span className="text-gray-400">({item.count} occurrences)</span>
                </div>
                <div className="text-xs text-gray-300 font-sans pl-1">
                  <strong className="text-[#FF1A1A] font-mono">Remediation: </strong>
                  {item.doctrineFix || 'Conduct targeted retraining scenarios under degraded sensor conditions.'}
                </div>
              </div>

              <button
                onClick={() => onPracticeMistake(item.mistake)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#FF1A1A]/40 hover:bg-[#B30000]/20 text-[#FF1A1A] font-mono text-xs font-bold transition-all shadow-red-glow-sm cursor-pointer"
              >
                <span>Drill This Weakness</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

