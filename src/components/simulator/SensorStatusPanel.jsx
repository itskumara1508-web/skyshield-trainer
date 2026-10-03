import React from 'react';
import { Radio, Wifi, Zap, AlertOctagon } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { RadarSweepWidget } from '../common/RadarSweepWidget';

export function SensorStatusPanel() {
  const { scenario, contacts, selectedContactId, setSelectedContactId } = useSimulator();

  const sensorState = scenario?.sensorState || 'nominal';
  const weather = scenario?.weather || 'clear';

  const getRadarHealth = () => {
    if (sensorState === 'jammed') return { status: 'HEAVILY JAMMED', pct: 28, color: 'text-[#FF1A1A]' };
    if (sensorState === 'degraded_radar') return { status: 'DEGRADED', pct: 60, color: 'text-amber-400' };
    return { status: 'NOMINAL', pct: 98, color: 'text-emerald-400' };
  };

  const getEOIRHealth = () => {
    if (weather === 'sandstorm' || weather === 'fog') return { status: 'THERMAL OBSCURED', pct: 35, color: 'text-amber-400' };
    if (sensorState === 'degraded_eoir') return { status: 'DEGRADED EO', pct: 50, color: 'text-amber-400' };
    return { status: 'CLEAR OPTICAL', pct: 95, color: 'text-emerald-400' };
  };

  const radarHealth = getRadarHealth();
  const eoirHealth = getEOIRHealth();

  return (
    <div className="flex flex-col bg-[#121212]/95 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
      {/* Sensor Section Title */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#FF1A1A]" />
          <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
            Sensors & Tactical Radar
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0A0A] text-[#FF1A1A] border border-[#FF1A1A]/30">
          FMC C2 NET
        </span>
      </div>

      {/* 2D Circular Radar Display */}
      <div className="flex justify-center mb-3">
        <RadarSweepWidget
          contacts={contacts}
          selectedContactId={selectedContactId}
          onSelectContact={setSelectedContactId}
          size={180}
        />
      </div>

      {/* Sensor Telemetry Meters */}
      <div className="space-y-2.5 font-mono text-xs">
        {/* Radar Telemetry */}
        <div className="p-2 rounded bg-[#0A0A0A] border border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-[#FF1A1A]" /> 3D Surveillance Radar
            </span>
            <span className={`font-bold ${radarHealth.color}`}>{radarHealth.status}</span>
          </div>
          <div className="w-full bg-[#1E1E1E] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                radarHealth.pct > 70 ? 'bg-[#FF1A1A]' : radarHealth.pct > 40 ? 'bg-amber-500' : 'bg-red-700'
              }`}
              style={{ width: `${radarHealth.pct}%` }}
            />
          </div>
        </div>

        {/* EO/IR Sensor */}
        <div className="p-2 rounded bg-[#0A0A0A] border border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> EO/IR Thermal Imager
            </span>
            <span className={`font-bold ${eoirHealth.color}`}>{eoirHealth.status}</span>
          </div>
          <div className="w-full bg-[#1E1E1E] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                eoirHealth.pct > 70 ? 'bg-[#FF1A1A]' : eoirHealth.pct > 40 ? 'bg-amber-500' : 'bg-red-700'
              }`}
              style={{ width: `${eoirHealth.pct}%` }}
            />
          </div>
        </div>

        {/* EW Jammer Alert */}
        {sensorState === 'jammed' && (
          <div className="p-2 rounded bg-[#B30000]/15 border border-[#FF1A1A]/40 text-[#FF1A1A] flex items-center gap-2 animate-pulse text-[11px]">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>ACTIVE EW JAMMING DETECTED. Cross-check thermal imaging!</span>
          </div>
        )}
      </div>
    </div>
  );
}

