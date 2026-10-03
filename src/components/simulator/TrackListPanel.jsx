import React from 'react';
import { Target, Flag, AlertTriangle, ShieldCheck, UserCheck, HelpCircle, Eye } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { Badge } from '../common/Badge';

export function TrackListPanel() {
  const { contacts, selectedContactId, setSelectedContactId, flagDetected, classifyContact } = useSimulator();

  return (
    <div className="flex flex-col h-full bg-[#121212]/95 border border-white/10 rounded-xl p-3.5 backdrop-blur-md overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#FF1A1A]" />
          <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
            Airspace Tracks ({contacts.length})
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          HOTKEYS: [1-4] Classify | [Tab] Cycle
        </span>
      </div>

      {/* Tracks Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            No contacts currently acquired by radar perimeter.
          </div>
        ) : (
          contacts.map(c => {
            const isSelected = c.id === selectedContactId;
            const isDropout = c.isDropout;
            const isNeutralized = c.neutralized;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedContactId(c.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#B30000]/15 border-[#FF1A1A] shadow-red-glow-sm'
                    : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
                } ${isDropout ? 'opacity-40 animate-pulse' : ''} ${
                  isNeutralized ? 'border-red-900/40 bg-red-950/10 opacity-60' : ''
                }`}
              >
                {/* Track Title Row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{c.callsign}</span>
                    {c.isGhost && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-800 text-gray-400 border border-neutral-700">
                        GHOST TRACK
                      </span>
                    )}
                    {isNeutralized && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/40 font-bold">
                        NEUTRALIZED
                      </span>
                    )}
                  </div>
                  <Badge category={c.userCategory || 'unknown'} size="sm" />
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-gray-400 mb-2.5">
                  <div>
                    <span className="text-[9px] block text-gray-500">RANGE</span>
                    <span className="text-white font-semibold">{c.distance ? `${Math.round(c.distance)}m` : '--'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] block text-gray-500">ALTITUDE</span>
                    <span className="text-white font-semibold">{c.altitude ? `${Math.round(c.altitude)}m` : '--'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] block text-gray-500">RDR CONF</span>
                    <span className={`font-semibold ${c.radarConfidence > 70 ? 'text-[#FF1A1A]' : c.radarConfidence > 40 ? 'text-amber-400' : 'text-red-500'}`}>
                      {c.radarConfidence || 0}%
                    </span>
                  </div>
                </div>

                {/* Dropout Warning */}
                {isDropout && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 mb-2">
                    <AlertTriangle className="w-3 h-3" />
                    <span>RADAR DROPOUT / TRACK LOSS</span>
                  </div>
                )}

                {/* Detection Flag Button */}
                {!c.detected && !isNeutralized && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      flagDetected(c.id);
                    }}
                    className="w-full mb-2 py-1 px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Flag Contact as Detected (Key: D)</span>
                  </button>
                )}

                {/* Trainee Classification Buttons */}
                {!isNeutralized && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        classifyContact(c.id, 'hostile');
                      }}
                      className={`py-1 px-1 rounded text-[10px] font-mono font-bold transition-all border ${
                        c.userCategory === 'hostile'
                          ? 'bg-[#B30000] text-white border-[#FF1A1A] shadow-red-glow-sm'
                          : 'bg-[#0A0A0A] text-[#FF1A1A] border-[#B30000]/40 hover:bg-[#B30000]/20'
                      }`}
                    >
                      Hostile [1]
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        classifyContact(c.id, 'friendly');
                      }}
                      className={`py-1 px-1 rounded text-[10px] font-mono font-bold transition-all border ${
                        c.userCategory === 'friendly'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-[#0A0A0A] text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
                      }`}
                    >
                      Friendly [2]
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        classifyContact(c.id, 'benign');
                      }}
                      className={`py-1 px-1 rounded text-[10px] font-mono font-bold transition-all border ${
                        c.userCategory === 'benign'
                          ? 'bg-sky-600 text-white border-sky-400'
                          : 'bg-[#0A0A0A] text-sky-400 border-sky-500/40 hover:bg-sky-500/20'
                      }`}
                    >
                      Benign [3]
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

