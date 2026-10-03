/**
 * SkyShield Trainer - Authentication Context
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Manages military sentry credentials, security clearance levels,
 * active session tokens, and login/logout state.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataLayer } from '../data/dataLayer';
import { playSound } from '../components/common/SoundEffects';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'skyshield_auth_session_v2';

export const DEMO_CREDENTIALS = [
  {
    id: 'tr-001',
    serviceNo: 'IC-78921A',
    name: 'Maj. Vikramaditya Rathore',
    rank: 'Major',
    role: 'trainee',
    clearance: 'TOP SECRET // NOFORN',
    unit: '4 Para SF / C-UAS Tactical Cell',
    command: 'Northern Command',
    service: 'Indian Army',
    qualificationTier: 'Level 4 (DSSC Strike Lead)',
    pin: '7892',
  },
  {
    id: 'tr-002',
    serviceNo: 'IAF-29831',
    name: 'Sqn Ldr Ananya Sharma',
    rank: 'Squadron Leader',
    role: 'trainee',
    clearance: 'TOP SECRET // MIL-EYES',
    unit: 'ADGES / Western Air Command',
    command: 'Western Air Command',
    service: 'Indian Air Force',
    qualificationTier: 'Level 5 (Apex Perimeter)',
    pin: '2983',
  },
  {
    id: 'inst-001',
    serviceNo: 'DSSC-DIR-88',
    name: 'Col. Devendra Rana, VSM',
    rank: 'Colonel',
    role: 'instructor',
    clearance: 'DSSC COMMAND CLEARANCE',
    unit: 'Faculty of Air Defence & Drone Warfare, DSSC',
    command: 'DSSC Wellington',
    service: 'Army Air Defence',
    qualificationTier: 'Master Evaluator / Instructor',
    pin: '8800',
  },
  {
    id: 'tr-003',
    serviceNo: 'IC-82104M',
    name: 'Capt. Rohan Deshmukh',
    rank: 'Captain',
    role: 'trainee',
    clearance: 'SECRET // TACTICAL',
    unit: '15 Corps Forward Air Defence',
    command: 'Chinar Corps',
    service: 'Indian Army',
    qualificationTier: 'Level 3 (Tactical Commander)',
    pin: '8210',
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      // Default to premier officer
      return DEMO_CREDENTIALS[0];
    } catch {
      return DEMO_CREDENTIALS[0];
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isAuthenticated = !!currentUser;

  const login = (officerData) => {
    setCurrentUser(officerData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(officerData));
      // Sync with dataLayer active trainee if role is trainee
      if (officerData.id) {
        DataLayer.setActiveTrainee(officerData);
      }
    } catch (err) {
      console.error('Failed to save session:', err);
    }
    playSound('target_lock');
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
    playSound('alarm_high');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
