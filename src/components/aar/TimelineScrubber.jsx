import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function TimelineScrubber({
  currentTime = 0,
  maxDuration = 60,
  isPlaying = false,
  onTogglePlay = () => {},
  onSeek = () => {},
  events = []
}) {
  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-4 shadow-xl">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between mb-3 font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSeek(0)}
            className="p-1.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white"
            title="Rewind to Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onTogglePlay}
            className="px-3.5 py-1.5 rounded-lg bg-[#B30000] hover:bg-[#FF1A1A] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-red-glow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Replay' : 'Play 3D Replay'}</span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400">REPLAY TIMESTAMP: </span>
          <span className="text-sm font-bold text-[#FF1A1A]">
            T+{currentTime.toFixed(1)}s <span className="text-gray-500 text-xs">/ {maxDuration}s</span>
          </span>
        </div>
      </div>

      {/* Main Scrubber Slider */}
      <div className="relative py-2">
        <input
          type="range"
          min="0"
          max={maxDuration}
          step="0.1"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-[#0A0A0A] rounded-lg appearance-none cursor-pointer accent-[#FF1A1A] border border-white/10"
        />

        {/* Tactical Event Markers */}
        <div className="relative w-full h-4 mt-1">
          {events.map((ev, i) => {
            const leftPct = Math.min(100, Math.max(0, (ev.time / (maxDuration || 1)) * 100));
            return (
              <div
                key={i}
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                style={{ left: `${leftPct}%` }}
                onClick={() => onSeek(ev.time)}
              >
                <div className={`w-2 h-2 rounded-full ${
                  ev.event?.includes('NEUTRALIZED') || ev.event?.includes('KINETIC') ? 'bg-[#FF1A1A] shadow-red-glow-sm' :
                  ev.event?.includes('DETECTED') ? 'bg-sky-400' : 'bg-amber-400'
                }`} />
                <div className="hidden group-hover:block absolute bottom-4 px-2 py-1 bg-[#050505] border border-white/20 text-[9px] font-mono text-white rounded whitespace-nowrap z-30 shadow-lg">
                  T+{ev.time}s: {ev.event?.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

