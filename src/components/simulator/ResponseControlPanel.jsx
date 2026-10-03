import React from 'react';
import { Eye, ShieldAlert, RadioTower, Flame, Crosshair } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export function ResponseControlPanel() {
  const { contacts, selectedContactId, executeResponse } = useSimulator();

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const isNeutralized = selectedContact?.neutralized;

  return (
    <div className="bg-[#121212]/95 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#FF1A1A]" />
          <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
            Counter-UAS Response & ROE
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          TARGET: {selectedContact ? selectedContact.callsign : 'NONE SELECTED'}
        </span>
      </div>

      {!selectedContact ? (
        <div className="p-4 text-center text-xs font-mono text-gray-400 bg-[#0A0A0A] rounded-lg border border-dashed border-white/10">
          Click any 3D drone or radar track in the track list to unlock countermeasure response controls.
        </div>
      ) : isNeutralized ? (
        <div className="p-3 text-center text-xs font-mono text-[#FF1A1A] bg-[#B30000]/10 rounded-lg border border-[#FF1A1A]/30 font-bold">
          Target {selectedContact.callsign} is NEUTRALIZED. Weapon safeties engaged.
        </div>
      ) : (
        <div className="space-y-2">
          {/* Active Target Banner */}
          <div className="flex items-center justify-between p-2 rounded bg-[#0A0A0A] border border-[#FF1A1A]/30 text-xs font-mono">
            <span className="text-white font-bold">{selectedContact.callsign}</span>
            <span className="text-[#FF1A1A]">
              Dist: {selectedContact.distance ? `${Math.round(selectedContact.distance)}m` : '--'}
            </span>
            <span className="uppercase text-amber-400">
              {selectedContact.userResponse ? `Current: ${selectedContact.userResponse.replace('_', ' ')}` : 'Awaiting ROE'}
            </span>
          </div>

          {/* 4 Standard Tactical Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            {/* Monitor */}
            <button
              onClick={() => executeResponse(selectedContact.id, 'monitor')}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                selectedContact.userResponse === 'monitor' || selectedContact.userResponse === 'MONITOR'
                  ? 'bg-white/10 border-white text-white font-bold'
                  : 'bg-[#0A0A0A] border-white/10 hover:border-white/30 text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 mb-1 text-gray-300" />
              <span className="text-xs font-bold">MONITOR [M]</span>
              <span className="text-[9px] text-gray-500">Passive track</span>
            </button>

            {/* Warn / IFF */}
            <button
              onClick={() => executeResponse(selectedContact.id, 'warn')}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                selectedContact.userResponse === 'warn' || selectedContact.userResponse === 'WARN'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-amber-glow font-bold'
                  : 'bg-[#0A0A0A] border-white/10 hover:border-amber-500/50 text-gray-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mb-1 text-amber-400" />
              <span className="text-xs font-bold">WARN [W]</span>
              <span className="text-[9px] text-gray-500">RF IFF challenge</span>
            </button>

            {/* Escalate / Jam (Soft-kill) */}
            <button
              onClick={() => executeResponse(selectedContact.id, 'escalate')}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                selectedContact.userResponse === 'escalate' || selectedContact.userResponse === 'ESCALATE_JAM'
                  ? 'bg-[#B30000]/30 border-[#FF1A1A] text-[#FF1A1A] shadow-red-glow-sm font-bold'
                  : 'bg-[#0A0A0A] border-white/10 hover:border-[#FF1A1A]/50 text-gray-400 hover:text-white'
              }`}
            >
              <RadioTower className="w-4 h-4 mb-1 text-[#FF1A1A]" />
              <span className="text-xs font-bold">JAM / EW [J]</span>
              <span className="text-[9px] text-gray-500">Soft-kill C2</span>
            </button>

            {/* Engage Kinetic / Hard-kill */}
            <button
              onClick={() => executeResponse(selectedContact.id, 'engage')}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                selectedContact.userResponse === 'engage' || selectedContact.userResponse === 'ENGAGE_KINETIC'
                  ? 'bg-[#B30000] text-white border-[#FF1A1A] shadow-red-glow font-bold'
                  : 'bg-[#B30000]/15 border-[#B30000]/40 text-[#FF1A1A] hover:bg-[#B30000]/30'
              }`}
            >
              <Flame className="w-4 h-4 mb-1 text-[#FF1A1A]" />
              <span className="text-xs font-bold">ENGAGE [E]</span>
              <span className="text-[9px] text-gray-400">Laser intercept</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

