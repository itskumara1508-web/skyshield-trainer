/**
 * SkyShield Trainer - Dedicated Military Officer Login Page
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Official authentication gateway for defense personnel, sentries, and DSSC evaluators.
 * Supports Military Service Number / PIN credentials, 1-Click Officer Roster, and Cadet Express Access.
 */

import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { playSound } from '../components/common/SoundEffects';
import {
  Shield,
  Lock,
  KeyRound,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  LogOut,
  Radio,
} from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { currentUser, isAuthenticated, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'roster' | 'express'
  const [serviceNo, setServiceNo] = useState('');
  const [pin, setPin] = useState('');
  const [branch, setBranch] = useState('Indian Army');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!serviceNo.trim()) {
      setErrorMsg('Please input a valid Armed Forces Service Number.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matched = DEMO_CREDENTIALS.find(
        (c) => c.serviceNo.toUpperCase() === serviceNo.trim().toUpperCase()
      );

      if (matched) {
        if (matched.pin && pin && pin !== matched.pin) {
          setErrorMsg(`Invalid Tactical Security PIN for ${matched.serviceNo}. (Test PIN: ${matched.pin})`);
          return;
        }
        login(matched);
      } else {
        // Authenticate custom officer
        login({
          id: `usr-${Date.now()}`,
          serviceNo: serviceNo.trim().toUpperCase(),
          name: `Officer ${serviceNo.trim().toUpperCase()}`,
          rank: 'Captain',
          role: 'trainee',
          clearance: 'SECRET // UNIT DRILL',
          unit: 'Counter-UAS Unit Command',
          command: branch,
          service: branch,
          qualificationTier: 'Level 2 (Junior Operator)',
        });
      }

      if (onLoginSuccess) {
        onLoginSuccess('dashboard');
      }
    }, 400);
  };

  const handleSelectOfficer = (officer) => {
    login(officer);
    if (onLoginSuccess) {
      onLoginSuccess('dashboard');
    }
  };

  const handleExpressCadetLogin = () => {
    login({
      id: `cadet-${Date.now()}`,
      serviceNo: 'CADET-EXP-2026',
      name: 'Cadet Trainee (Express)',
      rank: 'Officer Cadet',
      role: 'trainee',
      clearance: 'TRAINING ACCESS // RESTRICTED',
      unit: 'DSSC Sentry Simulation Cell',
      command: 'Southern Command',
      service: 'Indian Armed Forces',
      qualificationTier: 'Level 1 (Initiate)',
    });
    if (onLoginSuccess) {
      onLoginSuccess('dashboard');
    }
  };


  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative font-mono">
      {/* Background Ambience Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(179,0,0,0.14)_0%,rgba(10,10,10,0.98)_75%)]" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#121212]/95 border border-white/15 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* National Tri-Colour Stripe */}
        <div className="tricolor-stripe" />

        {/* Card Header */}
        <div className="p-6 sm:p-8 bg-[#161616] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#FF1A1A]/60 flex items-center justify-center text-[#FF1A1A] shadow-red-glow">
              <Shield className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-black text-white uppercase tracking-wider">
                  SkyShield Sentry Access
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/40 font-bold">
                  MIL-STD-2525D
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Defence Services Staff College • Integrated Counter-UAS Sentry Terminal
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase">Clearance Protocol</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              RESTRICTED ENCLAVE
            </div>
          </div>
        </div>

        {/* IF ALREADY LOGGED IN: Show Active Duty Status with Actions */}
        {isAuthenticated && currentUser ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-5 rounded-xl bg-[#0A0A0A] border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Active Military Clearance Verified
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-gray-300 font-bold uppercase">
                  {currentUser.role === 'instructor' ? 'CHIEF INSTRUCTOR' : 'ACTIVE TRAINEE'}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center font-bold text-white text-base">
                  {currentUser.rank?.slice(0, 3) || 'OFF'}
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-white uppercase">
                    {currentUser.name}
                  </h4>
                  <div className="text-xs text-gray-400">
                    SERVICE NO: <strong className="text-white">{currentUser.serviceNo}</strong> • CLEARANCE: <strong className="text-emerald-400">{currentUser.clearance}</strong>
                  </div>
                  <div className="text-xs text-gray-500 font-sans mt-0.5">
                    {currentUser.unit} ({currentUser.service || 'Armed Forces'})
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0A] border border-laser/50 hover:bg-laser hover:text-black text-laser text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out / Terminate Duty</span>
              </button>

              <button
                onClick={() => onLoginSuccess && onLoginSuccess('dashboard')}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-red-glow cursor-pointer"
              >
                <span>Enter Command Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN MODES: Credentials, 1-Click Roster, Express */
          <div>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-[#0A0A0A] text-xs">
              <button
                onClick={() => {
                  setActiveTab('credentials');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 sm:px-4 font-heading font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-[#141414] text-[#FF1A1A] border-b-2 border-[#FF1A1A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Service ID & PIN
              </button>
              <button
                onClick={() => {
                  setActiveTab('roster');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 sm:px-4 font-heading font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'roster'
                    ? 'bg-[#141414] text-[#FF1A1A] border-b-2 border-[#FF1A1A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                1-Click Officer Roster
              </button>
              <button
                onClick={() => {
                  setActiveTab('express');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 sm:px-4 font-heading font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'express'
                    ? 'bg-[#141414] text-[#FF1A1A] border-b-2 border-[#FF1A1A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Cadet Express
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {errorMsg && (
                <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-laser/50 text-laser text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: SERVICE NO & PIN FORM */}
              {activeTab === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Armed Forces Branch
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Indian Army', 'Indian Air Force', 'Indian Navy'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBranch(b)}
                          className={`py-2 px-2 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                            branch === b
                              ? 'bg-[#B30000]/20 border-[#FF1A1A] text-[#FF1A1A] font-bold'
                              : 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Officer Service Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={serviceNo}
                        onChange={(e) => setServiceNo(e.target.value)}
                        placeholder="e.g. IC-78921A or IAF-29831"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/15 focus:border-[#FF1A1A] text-white text-xs outline-none transition-colors"
                      />
                      <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
                      <span>Quick autofill:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceNo('IC-78921A');
                          setPin('7892');
                          setBranch('Indian Army');
                        }}
                        className="underline hover:text-[#FF1A1A] cursor-pointer"
                      >
                        IC-78921A (Army)
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceNo('IAF-29831');
                          setPin('2983');
                          setBranch('Indian Air Force');
                        }}
                        className="underline hover:text-[#FF1A1A] cursor-pointer"
                      >
                        IAF-29831 (Air Force)
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceNo('DSSC-DIR-88');
                          setPin('8800');
                          setBranch('Indian Army');
                        }}
                        className="underline hover:text-[#FF1A1A] cursor-pointer"
                      >
                        DSSC-DIR-88 (Instructor)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                      Tactical Security PIN / Passcode
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter 4-digit PIN (e.g. 7892)"
                        maxLength={6}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/15 focus:border-[#FF1A1A] text-white text-xs outline-none tracking-widest transition-colors"
                      />
                      <KeyRound className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-red-glow cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span>Validating Cryptographic Token...</span>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Authorize Sentry Duty & Enter Simulator</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: 1-CLICK ROSTER CARDS */}
              {activeTab === 'roster' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 mb-2 font-sans">
                    Select a certified defence officer to immediately adopt their tactical profile:
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                    {DEMO_CREDENTIALS.map((officer) => (
                      <div
                        key={officer.id}
                        onClick={() => handleSelectOfficer(officer)}
                        className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] hover:bg-[#B30000]/10 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#141414] border border-white/10 group-hover:border-[#FF1A1A] flex items-center justify-center font-bold text-xs text-gray-300 group-hover:text-[#FF1A1A]">
                            {officer.rank.slice(0, 3)}
                          </div>
                          <div>
                            <div className="font-heading text-xs font-bold text-white group-hover:text-[#FF1A1A] transition-colors">
                              {officer.name}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {officer.serviceNo} • {officer.unit}
                            </div>
                            <div className="text-[9px] text-emerald-400 mt-0.5">
                              {officer.clearance}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-black/80 border border-white/10 text-white font-bold uppercase">
                            {officer.qualificationTier.split('(')[0]}
                          </span>
                          <div className="text-[10px] text-[#FF1A1A] font-bold mt-1 group-hover:underline flex items-center justify-end gap-1">
                            <span>Sign In</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CADET EXPRESS ACCESS */}
              {activeTab === 'express' && (
                <div className="p-6 rounded-xl bg-[#0A0A0A] border border-dashed border-white/15 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/40 flex items-center justify-center text-[#FF1A1A] mx-auto shadow-red-glow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-white uppercase">
                      One-Click Cadet Express Duty
                    </h4>
                    <p className="text-xs text-gray-400 font-sans max-w-md mx-auto mt-1">
                      Bypass credential entry to immediately test autonomous threat recognition drills, procedural swarm generation, and decision-tree scoring.
                    </p>
                  </div>

                  <button
                    onClick={handleExpressCadetLogin}
                    className="px-8 py-3 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-red-glow cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Launch Express Simulation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Footer Security Classification */}
        <div className="px-6 py-3 bg-[#0A0A0A] border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>TERMINAL: DSSC-C2-NET</span>
          </div>
          <span>OFFICIAL USE ONLY • CLASSIFIED TRAINING FACILITY</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
