import React from 'react';
import { Sun, Moon, Pause, Play, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export function TacticalHUD({ onFinishMission }) {
  const { scenario, missionState, simTime, isNight, setIsNight, pauseMission, contacts } = useSimulator();

  const totalThreats = scenario?.threats?.length || 0;
  const neutralizedCount = contacts.filter(c => c.neutralized).length;
  const duration = scenario?.duration || 60;

  return (
    <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
      {/* Scenario & Defended Asset Info */}
      <div className="pointer-events-auto bg-[#0A0A0A]/90 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-2xl flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#121212] border border-[#FF1A1A]/50 flex items-center justify-center text-[#FF1A1A] shadow-red-glow-sm">
          <ShieldAlert className="w-5 h-5 text-[#FF1A1A] animate-pulse-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-bold text-white uppercase">{scenario?.name || 'Tactical Drill'}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/40 font-bold">
              SEED: {scenario?.seed}
            </span>
          </div>
          <div className="text-xs text-gray-400 font-sans">
            Defended Asset: <span className="text-white font-medium">{scenario?.defendedSite?.name}</span>
          </div>
        </div>
      </div>

      {/* Mission Clock & Controls */}
      <div className="pointer-events-auto bg-[#0A0A0A]/90 border border-white/15 rounded-xl px-4 py-2 backdrop-blur-md shadow-2xl flex items-center gap-4">
        {/* Clock */}
        <div className="text-center font-mono">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Elapsed / Limit</div>
          <div className="text-base font-bold text-[#FF1A1A]">
            T+{simTime.toFixed(1)}s <span className="text-gray-500 text-xs">/ {duration}s</span>
          </div>
        </div>

        {/* Threat Counters */}
        <div className="hidden sm:block border-l border-white/10 pl-4 text-center font-mono">
          <div className="text-[10px] text-gray-400 uppercase">Neutralized</div>
          <div className="text-sm font-bold text-emerald-400">
            {neutralizedCount} / {totalThreats}
          </div>
        </div>

        {/* Day / Night Toggle */}
        <button
          onClick={() => setIsNight(!isNight)}
          title={isNight ? 'Switch to Daytime EO' : 'Switch to Night Thermal IR'}
          className="p-2 rounded-lg bg-[#121212] border border-white/10 text-gray-400 hover:text-[#FF1A1A] transition-colors"
        >
          {isNight ? <Moon className="w-4 h-4 text-[#FF1A1A]" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Pause / Resume */}
        <button
          onClick={pauseMission}
          className="p-2 rounded-lg bg-[#121212] border border-white/10 text-gray-400 hover:text-white transition-colors"
        >
          {missionState === 'PAUSED' ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Complete Mission & Score */}
        <button
          onClick={onFinishMission}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#B30000] hover:bg-[#FF1A1A] border border-[#FF1A1A]/50 text-white text-xs font-heading font-bold uppercase transition-all shadow-red-glow-sm"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Complete Drill</span>
        </button>
      </div>
    </div>
  );
}

