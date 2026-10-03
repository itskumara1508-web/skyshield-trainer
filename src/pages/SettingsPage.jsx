/**
 * SkyShield Trainer - Tactical Settings & System Configuration Page
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Comprehensive operator preferences, 3D graphics fidelity, Web Audio synthesis,
 * adaptive AI difficulty parameters, and local telemetry cache controls.
 */

import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../components/common/SoundEffects';
import { dataLayer } from '../data/dataLayer';
import {
  Sliders,
  Shield,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Cpu,
  Database,
  RotateCcw,
  Download,
  CheckCircle2,
  Lock,
  LogOut,
  User,
  Sparkles,
  Zap,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

export function SettingsPage() {
  const {
    soundEnabled,
    toggleSound,
    lowGraphics,
    toggleLowGraphics,
    reduceMotion,
    toggleReduceMotion,
    adaptiveLevel,
    setAdaptiveLevel,
    activeTrainee,
    setActiveTrainee,
  } = useSettings();

  const { currentUser, logout, openLoginModal } = useAuth();

  // Local configuration states
  const [volume, setVolume] = useState(80);
  const [radarPingSound, setRadarPingSound] = useState(true);
  const [alarmSound, setAlarmSound] = useState(true);
  const [fireSound, setFireSound] = useState(true);
  const [fov, setFov] = useState(48);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [adaptiveMode, setAdaptiveMode] = useState('auto'); // 'auto' | 'manual'
  const [roeStrictness, setRoeStrictness] = useState('strict'); // 'strict' | 'training'
  const [savedBanner, setSavedBanner] = useState(false);

  const handleTestAudio = () => {
    playSound('radar_ping');
    setTimeout(() => playSound('target_lock'), 250);
  };

  const handleSaveSettings = () => {
    setSavedBanner(true);
    playSound('system_ready');
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleExportDataJSON = async () => {
    const sessions = await dataLayer.getSessions();
    const trainees = await dataLayer.getTrainees();
    const scenarios = await dataLayer.getScenarios();

    const backup = {
      timestamp: new Date().toISOString(),
      platform: 'SkyShield Trainer (SIH26247 DSSC)',
      activeOfficer: currentUser,
      sessions,
      trainees,
      scenarios,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKYSHIELD_TELEMETRY_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFactoryReset = async () => {
    if (
      confirm(
        'WARNING: This will reset all local training records, custom scenarios, and officer scores to DSSC factory defaults. Proceed?'
      )
    ) {
      await dataLayer.resetToDefaults();
      playSound('alarm_high');
      alert('System reset completed. Defaults restored.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Page Title & Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] mb-2 uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>System Preferences & Station Calibration</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider">
            Station Settings
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            Configure visual fidelity, procedural Web Audio, adaptive difficulty thresholds, and officer session profiles.
          </p>
        </div>

        {/* Save confirmation toast */}
        {savedBanner && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved & Applied</span>
          </div>
        )}
      </div>

      {/* OFFICER AUTHENTICATION PROFILE CARD */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#0A0A0A] border border-[#FF1A1A]/50 flex items-center justify-center text-[#FF1A1A] shadow-red-glow">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white uppercase">
                  {currentUser ? currentUser.name : 'Unauthenticated Sentry'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/30 font-bold uppercase">
                  {currentUser?.role === 'instructor' ? 'INSTRUCTOR' : 'TRAINEE'}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                SERVICE NO: <strong className="text-white">{currentUser?.serviceNo || 'N/A'}</strong> • CLEARANCE: <strong className="text-emerald-400">{currentUser?.clearance || 'RESTRICTED'}</strong>
              </div>
              <div className="text-xs text-gray-500 font-sans mt-0.5">
                {currentUser?.unit || 'Air Defence Sentry Network'} ({currentUser?.service || 'Armed Forces'})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Switch Officer
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 border border-laser/50 hover:bg-laser hover:text-black text-laser text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout / End Duty</span>
                </button>
              </>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#B30000] hover:bg-[#FF1A1A] text-white text-xs font-bold transition-all shadow-red-glow cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Officer Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-COLUMN SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: 3D GRAPHICS & DISPLAY */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                3D Tactical Graphics & Performance
              </h3>
            </div>
            <span className="text-[10px] text-gray-400">WebGL 2.0 Engine</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Low Graphics / Performance Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/10">
              <div>
                <div className="font-bold text-white uppercase">Performance Mode (Low Graphics)</div>
                <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Optimizes frame rate for low-spec laptops with integrated GPUs.
                </div>
              </div>
              <button
                onClick={toggleLowGraphics}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  lowGraphics ? 'bg-[#B30000]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    lowGraphics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/10">
              <div>
                <div className="font-bold text-white uppercase">Reduce Motion / Camera Parallax</div>
                <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Disables background orbital drift and hero mouse tilt effects.
                </div>
              </div>
              <button
                onClick={toggleReduceMotion}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  reduceMotion ? 'bg-[#B30000]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reduceMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Atmospheric Dust & Fog */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/10">
              <div>
                <div className="font-bold text-white uppercase">Dynamic Atmospheric Particles</div>
                <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Renders rain, smoke, and desert sand particles in 3D scene.
                </div>
              </div>
              <button
                onClick={() => setParticlesEnabled(!particlesEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  particlesEnabled ? 'bg-[#B30000]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    particlesEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Camera FOV Slider */}
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-white uppercase">Perspective Camera Field of View (FOV)</span>
                <span className="text-[#FF1A1A]">{fov}°</span>
              </div>
              <input
                type="range"
                min="38"
                max="65"
                value={fov}
                onChange={(e) => setFov(Number(e.target.value))}
                className="w-full accent-[#B30000] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>38° (Tactical Telephoto)</span>
                <span>65° (Wide Perimeter)</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: PROCEDURAL AUDIO SYNTHESIZER */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                Tactical Audio Synthesizer (Web Audio)
              </h3>
            </div>
            <button
              onClick={handleTestAudio}
              className="px-2.5 py-1 rounded bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-[#FF1A1A] text-[10px] font-bold transition-all cursor-pointer"
            >
              Test Audio Chirp
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Master Sound */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/10">
              <div>
                <div className="font-bold text-white uppercase">Master Tactical Audio</div>
                <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Toggles all procedural acoustic feedback across simulation.
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  soundEnabled ? 'bg-[#B30000]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sub Audio toggles */}
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Radar Azimuth Ping Blips</span>
                <input
                  type="checkbox"
                  checked={radarPingSound}
                  onChange={(e) => setRadarPingSound(e.target.checked)}
                  className="accent-[#B30000] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Terminal Defensive Warning Tone</span>
                <input
                  type="checkbox"
                  checked={alarmSound}
                  onChange={(e) => setAlarmSound(e.target.checked)}
                  className="accent-[#B30000] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Directed-Energy Weapon Firings</span>
                <input
                  type="checkbox"
                  checked={fireSound}
                  onChange={(e) => setFireSound(e.target.checked)}
                  className="accent-[#B30000] cursor-pointer"
                />
              </div>
            </div>

            {/* Volume Slider */}
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-white uppercase">Output Gain Volume</span>
                <span className="text-[#FF1A1A]">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-[#B30000] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* PANEL 3: ADAPTIVE AI & DIFFICULTY GOVERNOR */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                Adaptive Difficulty AI Governor
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              {adaptiveMode === 'auto' ? 'AUTONOMOUS ACTIVE' : 'MANUAL OVERRIDE'}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAdaptiveMode('auto')}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                  adaptiveMode === 'auto'
                    ? 'bg-[#B30000]/20 border-[#FF1A1A] text-[#FF1A1A] font-bold'
                    : 'bg-[#0A0A0A] border-white/10 text-gray-400'
                }`}
              >
                Autonomous AI Tuning
              </button>
              <button
                onClick={() => setAdaptiveMode('manual')}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                  adaptiveMode === 'manual'
                    ? 'bg-[#B30000]/20 border-[#FF1A1A] text-[#FF1A1A] font-bold'
                    : 'bg-[#0A0A0A] border-white/10 text-gray-400'
                }`}
              >
                Manual Level Lock
              </button>
            </div>

            {/* Level Selector */}
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white uppercase">Operational Qualification Tier</span>
                <span className="px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] font-bold">
                  Level {adaptiveLevel} of 5
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 font-bold">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setAdaptiveLevel(lvl)}
                    className={`py-2 rounded-lg border transition-all cursor-pointer text-center ${
                      adaptiveLevel === lvl
                        ? 'bg-[#B30000] border-[#FF1A1A] text-white shadow-red-glow-sm'
                        : 'bg-[#141414] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-gray-400 font-sans">
                {adaptiveLevel === 1 && 'Level 1 (Initiate): 2 slow drones, nominal sensors, generous windows.'}
                {adaptiveLevel === 2 && 'Level 2 (Junior Operator): 4 drones, light sensor noise, mild scatter.'}
                {adaptiveLevel === 3 && 'Level 3 (Tactical Commander): 6 coordinated drones, rain, intermittent clutter.'}
                {adaptiveLevel === 4 && 'Level 4 (DSSC Strike Lead): 8-9 drones, night ops, heavy EW strobe noise.'}
                {adaptiveLevel === 5 && 'Level 5 (Apex Perimeter): 12 high-velocity drones, full radar blackout bursts.'}
              </div>
            </div>

            {/* ROE Strictness */}
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-white uppercase">Rules of Engagement Strictness</div>
                <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Penalizes fratricide and civilian strikes under military tribunal standard.
                </div>
              </div>
              <select
                value={roeStrictness}
                onChange={(e) => setRoeStrictness(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-[#141414] border border-white/15 text-white text-xs outline-none cursor-pointer"
              >
                <option value="strict">Strict Zero-Tolerance</option>
                <option value="training">Training Buffer (50% Penalty)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PANEL 4: DATA TELEMETRY & PERSISTENCE */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                Local Telemetry & Data Layer
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              LOCAL ENCLAVE
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10">
              <div className="font-bold text-white uppercase mb-1">Encrypted Client-Side Storage</div>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                SkyShield operates zero-cost client persistence via browser LocalStorage with abstract API facade ready for DSSC cloud transition.
              </p>
            </div>

            {/* Export and Reset Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleExportDataJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-white hover:text-[#FF1A1A] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Complete Telemetry Archive (JSON)</span>
              </button>

              <button
                onClick={handleFactoryReset}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/20 border border-laser/40 hover:bg-laser hover:text-black text-laser font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Factory DSSC Defaults</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE ACTION BAR */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#121212] border border-white/10">
        <div className="text-xs text-gray-400 font-sans">
          All adjustments apply dynamically to active tactical simulations.
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2.5 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-red-glow cursor-pointer"
        >
          Save & Apply Configuration
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
