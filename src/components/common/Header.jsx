/**
 * SkyShield Trainer - Top Command & Control Header
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Features national tri-colour stripe, live military clock, officer authentication
 * status, simulation state indicators, and settings navigation.
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Radio,
  Crosshair,
  Award,
  BarChart3,
  Users,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Activity,
  ChevronDown,
  Settings,
  LogIn,
  LogOut,
  User,
  Sliders,
  LayoutDashboard,
  BookOpen,
  Plane,
} from 'lucide-react';


import { useSettings } from '../../context/SettingsContext';
import { useSimulator } from '../../context/SimulatorContext';
import { useAuth } from '../../context/AuthContext';
import { dataLayer } from '../../data/dataLayer';

export function Header({ activeTab, onTabChange }) {
  const { lowGraphics, toggleLowGraphics, soundEnabled, toggleSound } = useSettings();
  const { missionState, simTime } = useSimulator();
  const { currentUser, isAuthenticated, logout, openLoginModal } = useAuth();

  const [trainees, setTrainees] = useState([]);
  const [showOfficerDropdown, setShowOfficerDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    async function fetchTrainees() {
      const list = await dataLayer.getTrainees();
      setTrainees(list);
    }
    fetchTrainees();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-IN', {
        hour12: false,
        timeZone: 'Asia/Kolkata',
      });
      setCurrentTime(`${istString} IST`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Shield },
    ...(isAuthenticated ? [{ id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard }] : []),
    { id: 'builder', label: 'Scenario Builder', icon: Radio },
    {
      id: 'simulator',
      label: 'Tactical Simulator',
      icon: Crosshair,
      badge: missionState === 'running' ? 'LIVE' : null,
    },
    { id: 'scoring', label: 'Scoring & ROE', icon: Award },
    { id: 'aar', label: 'AAR Dashboard', icon: BarChart3 },
    { id: 'instructor', label: 'Instructor Panel', icon: Users },
    { id: 'intel', label: 'Threat Intel', icon: BookOpen },
    { id: 'drone', label: 'Drones', icon: Plane },
    { id: 'settings', label: 'Settings', icon: Settings },
    ...(!isAuthenticated ? [{ id: 'login', label: 'Officer Login', icon: LogIn }] : []),
  ];





  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 font-mono">
      {/* MoD Saffron-White-Green Tricolor Stripe */}
      <div className="tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & MoD / DSSC Header Info */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onTabChange('landing')}
          >
            <div className="w-10 h-10 rounded-lg bg-[#050505] border border-[#FF1A1A]/50 flex items-center justify-center text-[#FF1A1A] shadow-red-glow-sm">
              <Shield className="w-5 h-5 text-[#FF1A1A] animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base font-extrabold tracking-wider text-white">
                  SKYSHIELD
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/40 font-bold">
                  TRAINER
                </span>
                <span className="hidden sm:inline-block text-[10px] text-gray-400 border border-white/10 px-1.5 py-0.5 rounded bg-[#0A0A0A]">
                  SIH26247
                </span>
              </div>
              <div className="text-[11px] text-gray-400 tracking-tight hidden sm:block font-subheading">
                Ministry of Defence | Defence Services Staff College (DSSC)
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/50 shadow-red-glow-sm font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#FF1A1A]' : 'text-gray-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1A1A] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1A1A]" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Clock, Sound, Settings, Login/Logout Profile */}
          <div className="flex items-center gap-2">
            {/* Mission Clock if Running */}
            {missionState === 'running' && (
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#050505] border border-[#FF1A1A]/50 text-[#FF1A1A] text-xs font-bold animate-pulse shadow-red-glow-sm">
                <Activity className="w-3.5 h-3.5" />
                <span>T+{simTime.toFixed(1)}s</span>
              </div>
            )}

            {/* Military IST Clock */}
            <div className="hidden xl:block text-xs text-gray-400 px-2 py-1 bg-[#0A0A0A] rounded border border-white/10">
              {currentTime}
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Disable Tactical Audio' : 'Enable Tactical Audio'}
              className="p-2 rounded-lg bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-[#FF1A1A] hover:border-[#FF1A1A]/50 transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#FF1A1A]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Low Graphics / Motion Toggle */}
            <button
              onClick={toggleLowGraphics}
              title={
                lowGraphics
                  ? 'Switch to High 3D Graphics'
                  : 'Switch to Low Graphics / Reduce Motion'
              }
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                lowGraphics
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                  : 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:text-[#FF1A1A]'
              }`}
            >
              {lowGraphics ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            {/* Settings Quick Link Button */}
            <button
              onClick={() => onTabChange('settings')}
              title="Station Settings"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#B30000]/20 text-[#FF1A1A] border-[#FF1A1A]/60'
                  : 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* OFFICER AUTHENTICATION / LOGIN / LOGOUT PROFILE */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowOfficerDropdown(!showOfficerDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/15 hover:border-[#FF1A1A] text-xs transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white font-bold truncate max-w-[120px]">
                    {currentUser.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {showOfficerDropdown && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#141414] border border-white/20 shadow-2xl p-3 z-50 backdrop-blur-xl animate-fade-in text-xs">
                    <div className="pb-2.5 mb-2.5 border-b border-white/10">
                      <div className="font-heading font-bold text-white text-sm">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {currentUser.serviceNo} • {currentUser.unit}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/30 font-bold uppercase">
                          {currentUser.role === 'instructor' ? 'INSTRUCTOR' : 'TRAINEE'}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold">
                          {currentUser.clearance || 'AUTHORIZED'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onTabChange('dashboard');
                          setShowOfficerDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#B30000]/20 text-[#FF1A1A] font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Command Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          onTabChange('settings');
                          setShowOfficerDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#FF1A1A]" />
                        <span>Station Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowOfficerDropdown(false);
                          openLoginModal();
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-sky-400" />
                        <span>Switch Officer Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowOfficerDropdown(false);
                          logout();
                          onTabChange('login');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-red-950/40 text-laser hover:text-white flex items-center gap-2 transition-colors cursor-pointer border-t border-white/10 mt-1 pt-2 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout / End Duty</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onTabChange('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B30000] hover:bg-[#FF1A1A] text-white text-xs font-bold transition-all shadow-red-glow cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Officer Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="lg:hidden flex items-center justify-around border-t border-white/10 px-2 py-1 bg-[#0A0A0A]/95 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-mono cursor-pointer ${
                isActive ? 'text-[#FF1A1A] font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

export default Header;
