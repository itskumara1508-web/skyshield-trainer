/**
 * SkyShield Trainer - Core 3D Tactical Simulator Page
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Integrated mission command center featuring 3D tactical airspace visualization,
 * multi-sensor track correlation, graduated counter-UAS ROE controls, and hotkeys.
 */

import React, { useEffect } from 'react';
import { useSimulator } from '../context/SimulatorContext';
import { useSettings } from '../context/SettingsContext';
import { TacticalSimulatorCanvas } from '../components/3d/TacticalSimulatorCanvas';
import { TacticalHUD } from '../components/simulator/TacticalHUD';
import { TrackListPanel } from '../components/simulator/TrackListPanel';
import { SensorStatusPanel } from '../components/simulator/SensorStatusPanel';
import { ResponseControlPanel } from '../components/simulator/ResponseControlPanel';
import ActionLogPanel from '../components/simulator/ActionLogPanel';

export function SimulatorPage({ onFinishToScoring }) {
  const {
    scenario,
    missionState,
    isNight,
    contacts,
    selectedContactId,
    setSelectedContactId,
    flagDetected,
    classifyContact,
    executeResponse,
    finishMission,
    pauseMission,
    setIsNight,
    isJamming,
    isEngaging,
    activeTargetPos,
    neutralizedDrones,
  } = useSimulator();

  const { lowGraphics } = useSettings();

  // Watch for mission completion
  useEffect(() => {
    if (missionState === 'completed') {
      const timer = setTimeout(() => {
        onFinishToScoring();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [missionState, onFinishToScoring]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();

      // Cycle contacts with Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        if (contacts.length > 0) {
          const currentIdx = contacts.findIndex((c) => c.id === selectedContactId);
          const nextIdx = (currentIdx + 1) % contacts.length;
          setSelectedContactId(contacts[nextIdx].id);
        }
        return;
      }

      // Pause toggle with P
      if (key === 'P') {
        pauseMission();
        return;
      }

      // Night toggle with N
      if (key === 'N') {
        setIsNight(!isNight);
        return;
      }

      // Contact-specific actions
      if (!selectedContactId) return;

      // Flag / Acquire with Space
      if (e.code === 'Space') {
        e.preventDefault();
        flagDetected(selectedContactId);
        return;
      }

      // Classification hotkeys: 1 (Hostile), 2 (Friendly), 3 (Benign), 4 (Unknown)
      if (key === '1' || key === 'H') {
        classifyContact(selectedContactId, 'hostile');
      } else if (key === '2' || key === 'F') {
        classifyContact(selectedContactId, 'friendly');
      } else if (key === '3' || key === 'B') {
        classifyContact(selectedContactId, 'benign');
      } else if (key === '4' || key === 'U') {
        classifyContact(selectedContactId, 'unknown');
      }

      // Response hotkeys: M (Monitor), W (Warn), J/S (Jam/Escalate), E/K (Kinetic Engage)
      if (key === 'M') {
        executeResponse(selectedContactId, 'monitor');
      } else if (key === 'W') {
        executeResponse(selectedContactId, 'warn');
      } else if (key === 'J' || key === 'S') {
        executeResponse(selectedContactId, 'escalate');
      } else if (key === 'E' || key === 'K') {
        executeResponse(selectedContactId, 'kinetic_strike');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    contacts,
    selectedContactId,
    setSelectedContactId,
    flagDetected,
    classifyContact,
    executeResponse,
    pauseMission,
    isNight,
    setIsNight,
  ]);

  const handleManualAbortOrFinish = () => {
    finishMission();
    onFinishToScoring();
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#0A0A0A] overflow-hidden flex flex-col">
      {/* HUD Bar at Top */}
      <TacticalHUD onFinishMission={handleManualAbortOrFinish} />

      {/* Main Tactical Grid Layout */}
      <div className="flex-1 w-full grid grid-cols-12 gap-3 p-3 pt-18 overflow-hidden">
        {/* Left Column: Airspace Track List */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden flex flex-col gap-3">
          <TrackListPanel />
        </div>

        {/* Center Column: 3D Tactical Air Defense Sandbox */}
        <div className="col-span-12 lg:col-span-6 h-full relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#050505]">
          <TacticalSimulatorCanvas
            drones={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
            isNight={isNight}
            terrain={scenario?.environment?.terrain || 'urban'}
            weather={scenario?.environment?.weather || 'clear'}
            isJamming={isJamming}
            isEngaging={isEngaging}
            activeTargetPos={activeTargetPos}
            neutralizedDrones={neutralizedDrones}
          />

          {/* Crosshair Overlay Center */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-laser/60" />
            </div>
          </div>

          {/* Quick Hotkeys Legend Strip at Base of Canvas */}
          <div className="absolute bottom-2 left-2 right-2 pointer-events-none flex flex-wrap items-center justify-between px-3 py-1.5 rounded-lg bg-[#0A0A0A]/85 border border-white/10 font-mono text-[10px] text-gray-400 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span><strong className="text-white">[SPACE]</strong> FLAG</span>
              <span><strong className="text-laser">[1/H]</strong> HOSTILE</span>
              <span><strong className="text-emerald-400">[2/F]</strong> FRIENDLY</span>
              <span><strong className="text-sky-400">[3/B]</strong> BENIGN</span>
            </div>
            <div className="flex items-center gap-3">
              <span><strong className="text-amber-400">[W]</strong> WARN</span>
              <span><strong className="text-amber-500">[J]</strong> JAM</span>
              <span><strong className="text-laser font-bold">[E]</strong> FIRE</span>
              <span><strong className="text-white">[TAB]</strong> CYCLE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sensor Health, ROE Weapons Controls & C2 Log */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden flex flex-col gap-3">
          <div className="shrink-0">
            <SensorStatusPanel />
          </div>

          <div className="shrink-0">
            <ResponseControlPanel />
          </div>

          <div className="flex-1 min-h-[160px] overflow-hidden">
            <ActionLogPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulatorPage;

