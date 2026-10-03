/**
 * SkyShield Trainer - Officer Command & Operations Dashboard
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Premier entry point upon military authentication. Presents active officer readiness
 * metrics, active airspace threat advisory, recent sorties log, and direct gateways
 * into the simulator, scenario builder, AAR replay, and instructor evaluation.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useSimulator } from '../context/SimulatorContext';
import { dataLayer } from '../data/dataLayer';
import {
  Shield,
  Crosshair,
  Radio,
  BarChart3,
  Users,
  Settings,
  ArrowRight,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  User,
  LogOut,
  Target,
  Zap,
  BookOpen,
  Plane,
} from 'lucide-react';
import { SentryQuizModal } from '../components/intel/SentryQuizModal';


export function OfficerDashboardPage({ onNavigate }) {
  const { currentUser, logout, openLoginModal } = useAuth();
  const { adaptiveLevel } = useSettings();
  const { startMission } = useSimulator();

  const [recentSessions, setRecentSessions] = useState([]);
  const [unitStats, setUnitStats] = useState(null);
  const [isDrillOpen, setIsDrillOpen] = useState(false);


  useEffect(() => {
    async function loadData() {
      const allSessions = await dataLayer.getSessions();
      const analytics = await dataLayer.getUnitAnalytics();
      setRecentSessions(allSessions.slice(0, 4));
      setUnitStats(analytics);
    }
    loadData();
  }, []);

  const officer = currentUser || {
    name: 'Major Vikramaditya Rathore',
    rank: 'Major',
    serviceNo: 'IC-78921A',
    service: 'Indian Army',
    unit: '4 Para SF / C-UAS Tactical Cell',
    command: 'Northern Command',
    clearance: 'TOP SECRET // NOFORN',
    qualificationTier: 'Level 4 (DSSC Strike Lead)',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* OFFICER WELCOME & CLEARANCE STATUS BANNER */}
      <div className="relative rounded-2xl bg-[#121212] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Red Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B30000]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-[#FF1A1A]/60 flex items-center justify-center text-[#FF1A1A] shadow-red-glow">
              <Shield className="w-8 h-8 animate-pulse-slow" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 font-bold uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED ENTRY // ACTIVE DUTY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/30 font-bold uppercase">
                  {officer.clearance || 'TOP SECRET'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider">
                {officer.rank} {officer.name}
              </h1>

              <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3 mt-1">
                <span>SERVICE NO: <strong className="text-white">{officer.serviceNo}</strong></span>
                <span>•</span>
                <span>UNIT: <strong className="text-white">{officer.unit}</strong></span>
                <span>•</span>
                <span>TIER: <strong className="text-[#FF1A1A]">{officer.qualificationTier}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('simulator')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-red-glow cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>Launch Tactical Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              title="End active duty session"
              className="p-3 rounded-xl bg-[#0A0A0A] border border-laser/40 hover:bg-laser hover:text-black text-laser transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* READINESS TELEMETRY SCORECARD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-white/10 shadow-lg">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Air Defense Score</span>
            <Award className="w-3.5 h-3.5 text-[#FF1A1A]" />
          </div>
          <div className="text-2xl font-bold text-[#FF1A1A] glow-red-text">
            94%
          </div>
          <div className="text-[10px] text-emerald-400 font-sans mt-1">
            Grade S • Elite Operator
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-white/10 shadow-lg">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>IFF Identification</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            96%
          </div>
          <div className="text-[10px] text-gray-400 font-sans mt-1">
            Mode-5 Transponder Match
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-white/10 shadow-lg">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Reaction Latency</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            3.4s
          </div>
          <div className="text-[10px] text-gray-400 font-sans mt-1">
            Target Benchmark: &lt; 4.0s
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-white/10 shadow-lg">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Completed Sorties</span>
            <Zap className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            38
          </div>
          <div className="text-[10px] text-emerald-400 font-sans mt-1">
            Zero Fratricide Violations
          </div>
        </div>
      </div>

      {/* ACTIVE DEFENSE ADVISORY STRIP */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>AIRSPACE THREAT ADVISORY:</strong> Multi-axis hostile drone swarms and high-power radar stand-off jamming reported in Northern and Western command corridors.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('drone')}
            className="px-3 py-1 rounded bg-[#181818] hover:bg-[#222222] border border-white/20 text-white font-bold text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plane className="w-3 h-3 text-amber-400" />
            <span>Drone Arsenal</span>
          </button>
          <button
            onClick={() => setIsDrillOpen(true)}
            className="px-3 py-1 rounded bg-[#B30000] hover:bg-[#FF1A1A] text-white font-bold text-[10px] uppercase shadow-red-glow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Target className="w-3 h-3" />
            <span>Launch Sentry Drill</span>
          </button>
          <button
            onClick={() => onNavigate('intel')}
            className="px-3 py-1 rounded bg-amber-500 text-black font-bold text-[10px] uppercase hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Review Threat Intel
          </button>
        </div>
      </div>

      {/* CORE WEB ENTRY GATEWAYS (DIRECT ACCESS CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#FF1A1A]" />
            <span>Tactical Operations Gateways</span>
          </h3>
          <span className="text-xs text-gray-400">Select an operational module to enter</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* GATEWAY 1: 3D TACTICAL SIMULATOR */}
          <div
            onClick={() => onNavigate('simulator')}
            className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#FF1A1A] hover:bg-[#B30000]/10 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/30">
              SIMULATOR
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-[#FF1A1A] flex items-center justify-center text-[#FF1A1A] mb-3 shadow-md transition-colors">
                <Crosshair className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-[#FF1A1A] transition-colors">
                3D Simulator
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1.5 leading-relaxed">
                Live 3D defense sandbox with radar track tables, strobe jamming noise, and graduated ROE weapons.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF1A1A] group-hover:translate-x-1 transition-transform">
              <span>Enter Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* GATEWAY 2: SCENARIO BUILDER */}
          <div
            onClick={() => onNavigate('builder')}
            className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-sky-500 hover:bg-sky-950/15 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-sky-500 flex items-center justify-center text-sky-400 mb-3 shadow-md transition-colors">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-sky-400 transition-colors">
                Builder
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1.5 leading-relaxed">
                Load certified Staff College scenarios or generate randomized swarms from reproducible seeds.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Configure</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* GATEWAY 3: DRONE ARSENAL */}
          <div
            onClick={() => onNavigate('drone')}
            className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-amber-500 hover:bg-amber-950/15 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/30">
              3D ARSENAL
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-amber-500 flex items-center justify-center text-amber-400 mb-3 shadow-md transition-colors">
                <Plane className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-amber-400 transition-colors">
                Drone Arsenal
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1.5 leading-relaxed">
                All 8 drone platforms, 3D working mechanics, aerodynamics, remote range datalinks, and specs.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>View Systems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* GATEWAY 4: THREAT INTEL & SENTRY DRILL */}
          <div
            onClick={() => onNavigate('intel')}
            className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-purple-500 hover:bg-purple-950/15 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-500/30">
              INTEL
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-purple-500 flex items-center justify-center text-purple-400 mb-3 shadow-md transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-purple-400 transition-colors">
                Threat Intel
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1.5 leading-relaxed">
                3D threat recognition, thermal IR signatures, RF spectra, motor acoustics, and 60s flashcard drills.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Intel Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* GATEWAY 5: 3D AAR REPLAY & ANALYTICS */}
          <div
            onClick={() => onNavigate('aar')}
            className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-emerald-500 hover:bg-emerald-950/15 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
          >


            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 shadow-md transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">
                3D AAR Replay
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1.5 leading-relaxed">
                Scrubbable 3D flight trajectory replays, glowing kinematic trails, and unit performance benchmarks.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Review Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* GATEWAY 5: INSTRUCTOR EVALUATION PANEL */}
          <div
            onClick={() => onNavigate('instructor')}
            className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-amber-500 hover:bg-amber-950/15 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-amber-500 flex items-center justify-center text-amber-400 mb-3 shadow-md transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-amber-400 transition-colors">
                Instructor Directorate
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mt-1.5 leading-relaxed">
                Unit roster, scenario editor, certified defense dossier debrief PDF exports, and CSV logs.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Directorate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>


      {/* RECENT OPERATIONAL SORTIES LOG & CALIBRATION BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Sorties Table */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF1A1A]" />
              <span>Recent Mission Sorties & AAR History</span>
            </span>
            <button
              onClick={() => onNavigate('aar')}
              className="text-xs text-[#FF1A1A] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>View All Sorties</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No past mission records loaded. Launch a drill to log telemetry.
              </div>
            ) : (
              recentSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onNavigate('aar')}
                  className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center font-bold text-xs text-[#FF1A1A]">
                      {session.grade || 'A'}
                    </div>
                    <div>
                      <div className="font-heading text-xs font-bold text-white">
                        {session.scenarioName || 'Tactical Counter-UAS Drill'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {session.date} • Trainee: {session.traineeName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-bold text-white">
                        {session.overallScore || session.score}%
                      </div>
                      <div className="text-[9px] text-emerald-400 font-bold uppercase">
                        {session.badge || 'COMBAT READY'}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Station Calibration & Quick Settings Box */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#FF1A1A]" />
                <span>Station Calibration</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-between">
                <span className="text-gray-400">Adaptive AI Difficulty</span>
                <span className="px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] font-bold">
                  Tier {adaptiveLevel} of 5
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-between">
                <span className="text-gray-400">3D Graphics Shaders</span>
                <span className="text-white font-bold">High Precision</span>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-between">
                <span className="text-gray-400">Procedural Audio</span>
                <span className="text-emerald-400 font-bold">Synthesizer Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full py-2.5 rounded-xl bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-white hover:text-[#FF1A1A] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Open Complete Station Settings</span>
          </button>
        </div>
      </div>

      {/* Sentry Quick Reaction Flashcard Drill Modal */}
      <SentryQuizModal isOpen={isDrillOpen} onClose={() => setIsDrillOpen(false)} />
    </div>
  );
}


export default OfficerDashboardPage;
