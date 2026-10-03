/**
 * SkyShield Trainer - Tactical Action & Sensor Log Panel
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Real-time C2 telemetry log showing sensor detections, operator decisions,
 * electronic countermeasure firings, and mission milestones.
 */

import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Terminal, Shield, Activity, Crosshair, Filter } from 'lucide-react';

export default function ActionLogPanel() {
  const { actionLogs } = useSimulator();
  const [filter, setFilter] = useState('all');

  const filteredLogs = actionLogs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const getLevelStyle = (level) => {
    switch (level) {
      case 'danger':
        return 'text-laser bg-red-950/30 border-l-2 border-laser';
      case 'warning':
        return 'text-amber-400 bg-amber-950/30 border-l-2 border-amber-500';
      case 'success':
        return 'text-emerald-400 bg-emerald-950/30 border-l-2 border-emerald-500';
      case 'info':
      default:
        return 'text-zinc-300 bg-transparent border-l-2 border-white/20';
    }
  };

  return (
    <div className="bg-[#121212]/90 border border-white/10 rounded-lg backdrop-blur-md flex flex-col h-full overflow-hidden shadow-card-dark">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#161616] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-laser" />
          <span className="font-heading text-xs tracking-wider uppercase font-semibold text-white">
            Command & Control Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition-colors ${
              filter === 'all'
                ? 'bg-brand-red text-white'
                : 'bg-black/40 text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('radar')}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition-colors ${
              filter === 'radar'
                ? 'bg-brand-red text-white'
                : 'bg-black/40 text-zinc-400 hover:text-white'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setFilter('weapons')}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition-colors ${
              filter === 'weapons'
                ? 'bg-brand-red text-white'
                : 'bg-black/40 text-zinc-400 hover:text-white'
            }`}
          >
            Weapons
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-500 text-center py-6 italic text-[11px]">
            Awaiting combat telemetry events...
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`px-2.5 py-1.5 rounded-r transition-all duration-150 ${getLevelStyle(
                log.level
              )}`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5">
                <span className="text-zinc-400 font-bold">
                  [T+{log.timestamp.toFixed(1)}s]
                </span>
                <span className="uppercase text-[9px] px-1 py-0.2 bg-black/40 rounded">
                  {log.type}
                </span>
              </div>
              <div className="text-[11px] leading-tight break-words">{log.text}</div>
            </div>
          ))
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="px-3 py-1.5 bg-[#0D0D0D] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          MIL-STD-2525D BUFFER ACTIVE
        </span>
        <span>{filteredLogs.length} EVENTS RECORDED</span>
      </div>
    </div>
  );
}

