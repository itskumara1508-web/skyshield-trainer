import React, { useState } from 'react';
import { X, Copy, Check, FileText, Shield, AlertTriangle, Radio } from 'lucide-react';

/**
 * OpordBriefingModal
 * Official DSSC Operational Order (OPORD) Military Briefing Sheet
 * SIH26247 DSSC / MoD Counter-Drone Simulation Platform
 */
export function OpordBriefingModal({ scenario, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!scenario) return null;

  const contacts = scenario.contacts || scenario.threats || [];
  const hostileCount = contacts.filter((c) => (c.type || c.threatCategory) === 'hostile').length;
  const friendlyCount = contacts.filter((c) => (c.type || c.threatCategory) === 'friendly').length;
  const benignCount = contacts.filter((c) => (c.type || c.threatCategory) === 'benign').length;

  const opordText = `
================================================================================
DEFENCE SERVICES STAFF COLLEGE (DSSC) - WELLINGTON
AIR DEFENCE & COUNTER-UAS DIVISION // FORMAL OPERATIONAL ORDER (OPORD)
REF NO: DSSC/CUAS/2026/OP-${scenario.seed || 'STD'}
SECURITY CLASSIFICATION: SECRET // FOR TRAINING PURPOSES ONLY
================================================================================

1. SITUATION
   a. Strategic Area: ${scenario.location || 'Forward Defence Sector'}
   b. Terrain: ${scenario.environment?.terrain?.toUpperCase() || 'URBAN'}
   c. Atmospheric Conditions: ${scenario.environment?.weather?.toUpperCase() || 'CLEAR'} | ${scenario.environment?.timeOfDay?.toUpperCase() || 'DAY'}
   d. Tactical Sensor Health:
      - Sensor Mode: ${scenario.sensorState?.mode?.toUpperCase() || 'NOMINAL'}
      - Radar Health Index: ${Math.round((scenario.sensorState?.radarHealth || 1) * 100)}%
      - Electro-Optical / IR Health: ${Math.round((scenario.sensorState?.eoirHealth || 1) * 100)}%
      - Stand-Off EW Strobe: ${scenario.sensorState?.jammerActive ? 'ACTIVE JAMMING DETECTED' : 'CLEAR SPECTRUM'}
   e. Threat Assessment (Enemy Order of Battle):
      - Total Aerial Tracks: ${contacts.length}
      - Confirmed Hostile Swarm Elements: ${hostileCount}
      - Identified Friendly Air Units: ${friendlyCount}
      - Neutral / Civilian Transits: ${benignCount}

2. MISSION STATEMENT
   ${scenario.tacticalObjective || `Defend ${scenario.defendedSite?.name || 'Assigned Site'} against unauthorized UAV penetration. Positively identify and engage hostile loitering munitions prior to 140m perimeter breach while preventing fratricide.`}

3. EXECUTION
   a. Commander's Intent:
      Deny enemy intelligence exploitation and kinetic breach of ${scenario.defendedSite?.name || 'the base'}. Operators must act with calculated aggression while enforcing strict Rules of Engagement (ROE).
   b. Rules of Engagement (ROE):
${(scenario.roeRules || [
  'Positive classification required prior to kinetic escalation',
  'Civilian and friendly units must be cleared and monitored',
  'Hostiles inside 150m Inner Kill Zone authorized for immediate destruction'
]).map((r, i) => `      [ROE-${i + 1}] ${r}`).join('\n')}
   c. Countermeasure Allocation:
      - Soft-Kill: RF Barrage Jamming (0.4 - 6.0 GHz)
      - Hard-Kill: Directed Energy Laser / 30mm Airburst Interceptor

4. SERVICE & SUPPORT
   - Defended Asset: ${scenario.defendedSite?.name || 'Sector Base'}
   - Inner Kill Zone Radius: ${scenario.defendedSite?.killZoneRadius || 140}m
   - Engagement Zone Radius: ${scenario.defendedSite?.engagementRadius || 300}m
   - Mission Sortie Duration: ${scenario.durationSeconds || scenario.duration || 90} Seconds

5. COMMAND & SIGNAL
   - Operational Seed: ${scenario.seed}
   - IFF Protocol: Mode-S Encrypted Military Transponder
   - Radio Silence Threshold: Condition Orange
================================================================================
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(opordText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-[#FF1A1A]/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B30000]/20 border border-[#FF1A1A]/40 flex items-center justify-center text-[#FF1A1A]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#FF1A1A] uppercase tracking-wider block font-bold">
                MILITARY OPERATION ORDER (OPORD)
              </span>
              <h3 className="font-heading text-sm font-bold text-white uppercase">
                {scenario.name} // {scenario.seed}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121212] border border-white/10 hover:border-[#FF1A1A] text-xs font-mono text-gray-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY OPORD'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable OPORD Text */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-gray-300 space-y-6 leading-relaxed bg-[#070b0e]">
          {/* Top Banner */}
          <div className="p-3 rounded-lg bg-[#B30000]/10 border border-[#FF1A1A]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF1A1A]" />
              <span className="font-bold text-white uppercase">DSSC AIR DEFENCE SORTIE DIRECTIVE</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#0A0A0A] text-[#FF1A1A] font-bold border border-[#FF1A1A]/40 text-[10px]">
              RESTRICTED // SIH26247
            </span>
          </div>

          {/* Section 1 */}
          <div className="space-y-2 border-l-2 border-[#FF1A1A] pl-3">
            <h4 className="text-white font-bold uppercase text-xs">1. SITUATION & AIRSPACE TELEMETRY</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
              <div>Theater: <span className="text-white font-semibold">{scenario.location || 'Undisclosed'}</span></div>
              <div>Terrain / Weather: <span className="text-white font-semibold">{scenario.environment?.terrain} / {scenario.environment?.weather}</span></div>
              <div>Time of Engagement: <span className="text-white font-semibold">{scenario.environment?.timeOfDay}</span></div>
              <div>Sensor Readiness: <span className="text-amber-400 font-semibold">{scenario.sensorState?.mode}</span></div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2 border-l-2 border-amber-500 pl-3">
            <h4 className="text-white font-bold uppercase text-xs">2. MISSION STATEMENT & COMMANDER'S INTENT</h4>
            <p className="text-gray-300 text-xs font-sans">
              {scenario.tacticalObjective || scenario.description}
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2 border-l-2 border-emerald-500 pl-3">
            <h4 className="text-white font-bold uppercase text-xs">3. RULES OF ENGAGEMENT (ROE) DIRECTIVES</h4>
            <ul className="space-y-1.5 list-disc list-inside text-gray-300 text-[11px]">
              {(scenario.roeRules || [
                'Positive optical/RF identification required before hard-kill escalation',
                'Do not engage civilian transits or friendly assets',
                'Hostiles penetrating inner boundary declared weapons-free'
              ]).map((rule, idx) => (
                <li key={idx} className="text-gray-300">
                  <span className="text-white font-semibold">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Target Manifest */}
          <div className="space-y-2 border-l-2 border-cyan-500 pl-3">
            <h4 className="text-white font-bold uppercase text-xs">4. AIRSPACE CONTACT MANIFEST ({contacts.length} TOTAL)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {contacts.map((c, i) => (
                <div key={i} className="p-2 rounded bg-[#121212] border border-white/10 text-[10px]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">{c.callsign}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                        c.type === 'friendly'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : c.type === 'benign'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    Spawn: T+{c.spawnTime}s | Spd: {c.speed}m/s | Alt: {c.altitude}m | Role: {c.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">DSSC Combat System Software Suite // MoD</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-bold uppercase transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
