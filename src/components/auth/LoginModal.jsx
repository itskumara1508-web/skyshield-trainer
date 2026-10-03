/**
 * SkyShield Trainer - Tactical Officer Authentication Modal
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Military clearance authentication gateway featuring fast officer profile
 * selection and secure Service Number / Security PIN verification.
 */

import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { Shield, ShieldAlert, KeyRound, CheckCircle2, X, Lock, UserCheck, AlertTriangle } from 'lucide-react';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'manual'
  const [serviceNo, setServiceNo] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!serviceNo.trim()) {
      setErrorMsg('Please input a valid Armed Forces Service Number.');
      return;
    }

    // Match against known demo credentials or synthesize officer session
    const matched = DEMO_CREDENTIALS.find(
      (c) => c.serviceNo.toUpperCase() === serviceNo.trim().toUpperCase()
    );

    if (matched) {
      if (matched.pin && pin !== matched.pin) {
        setErrorMsg(`Invalid Tactical Security PIN for ${matched.serviceNo}. (Hint: ${matched.pin})`);
        return;
      }
      login(matched);
    } else {
      // Allow custom authenticated session
      login({
        id: `usr-${Date.now()}`,
        serviceNo: serviceNo.trim().toUpperCase(),
        name: `Officer ${serviceNo.trim().toUpperCase()}`,
        rank: 'Captain',
        role: 'trainee',
        clearance: 'SECRET // UNIT DRILL',
        unit: 'Counter-UAS Unit Command',
        command: 'Air Defence Corps',
        service: 'Indian Armed Forces',
        qualificationTier: 'Level 2 (Junior Operator)',
      });
    }
  };

  const handleSelectPreset = (officer) => {
    login(officer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0F0F0F] border border-white/15 shadow-2xl overflow-hidden font-mono">
        {/* Tricolor Stripe */}
        <div className="tricolor-stripe" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0A0A0A] border border-[#FF1A1A]/50 flex items-center justify-center text-[#FF1A1A] shadow-red-glow-sm">
              <Shield className="w-5 h-5 text-[#FF1A1A]" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                Officer Authentication Gateway
              </h3>
              <p className="text-[10px] text-gray-400 font-sans">
                DSSC Air Defence Simulation Access • Restricted Network
              </p>
            </div>
          </div>

          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 border-b border-white/10 bg-[#0A0A0A] text-xs">
          <button
            onClick={() => {
              setActiveTab('roster');
              setErrorMsg('');
            }}
            className={`py-3 px-4 font-heading font-bold text-center transition-all ${
              activeTab === 'roster'
                ? 'bg-[#141414] text-[#FF1A1A] border-b-2 border-[#FF1A1A]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Certified Officers Roster
          </button>
          <button
            onClick={() => {
              setActiveTab('manual');
              setErrorMsg('');
            }}
            className={`py-3 px-4 font-heading font-bold text-center transition-all ${
              activeTab === 'manual'
                ? 'bg-[#141414] text-[#FF1A1A] border-b-2 border-[#FF1A1A]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Service ID & Security PIN
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-laser/50 text-laser text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'roster' ? (
            <div className="space-y-3">
              <div className="text-xs text-gray-400 mb-2 font-sans">
                Select a certified military profile to authenticate this workstation:
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {DEMO_CREDENTIALS.map((officer) => (
                  <div
                    key={officer.id}
                    onClick={() => handleSelectPreset(officer)}
                    className="p-3.5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#FF1A1A] hover:bg-[#B30000]/10 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0A0A0A] border border-white/10 group-hover:border-[#FF1A1A] flex items-center justify-center font-bold text-xs text-gray-300 group-hover:text-[#FF1A1A]">
                        {officer.rank.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-heading text-xs font-bold text-white group-hover:text-[#FF1A1A] transition-colors">
                          {officer.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {officer.serviceNo} • {officer.unit}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-black/60 border border-white/10 text-emerald-400 font-bold uppercase">
                        {officer.role === 'instructor' ? 'INSTRUCTOR' : 'TRAINEE'}
                      </span>
                      <div className="text-[9px] text-gray-500 mt-0.5">Click to Authorize</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualLogin} className="space-y-4">
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/15 focus:border-[#FF1A1A] text-white text-xs outline-none transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Demo Service Nos: <strong className="text-gray-300">IC-78921A</strong> (Army) | <strong className="text-gray-300">IAF-29831</strong> (Air Force) | <strong className="text-gray-300">DSSC-DIR-88</strong> (Instructor)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Security PIN / Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (e.g. 7892 or 2983)"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/15 focus:border-[#FF1A1A] text-white text-xs outline-none tracking-widest transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-red-glow cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verify Identity & Enter Platform</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0A0A0A] border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
          <span>CLEARANCE PROTOCOL: MIL-STD-810H</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SECURE LINK ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
