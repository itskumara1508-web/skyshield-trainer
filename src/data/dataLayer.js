/**
 * SkyShield Trainer - Client Data Layer Facade
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Abstracted repository layer backed by LocalStorage with fallback defaults.
 * Can be swapped for a secure REST/GraphQL backend in production.
 */

import { SCRIPTED_SCENARIOS } from './scriptedScenarios';
import { SAMPLE_TRAINEES } from './sampleTrainees';
import { SAMPLE_SESSIONS } from './sampleSessions';

const STORAGE_KEYS = {
  SCENARIOS: 'skyshield_scenarios_v2',
  TRAINEES: 'skyshield_trainees_v2',
  SESSIONS: 'skyshield_sessions_v2',
  ACTIVE_TRAINEE: 'skyshield_active_trainee_v2',
  LATEST_RESULT: 'skyshield_latest_result_v2',
};

function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SCENARIOS)) {
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(SCRIPTED_SCENARIOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRAINEES)) {
    localStorage.setItem(STORAGE_KEYS.TRAINEES, JSON.stringify(SAMPLE_TRAINEES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    // Populate sessions with format compatible with Replay and Charts
    const formattedSessions = SAMPLE_SESSIONS.map((s) => ({
      ...s,
      timestamp: s.timestamp || Date.now() - 3600000,
      overallScore: s.overallScore || s.score || 88,
      avgDetectionLatency: s.avgDetectionLatency || s.avgLatency || 4.2,
      civilianFratricideCount: s.civilianFratricideCount || s.roeViolations || 0,
      roeAdherence: s.roeAdherence || 88,
      badge: s.badge || s.ratingLabel || 'Combat Ready',
      replayFlightData: s.replayFlightData || [
        {
          droneId: 'trk-01',
          callsign: 'VIPER-LEAD',
          type: 'hostile',
          points: [
            { time: 0, position: [-180, 50, -150] },
            { time: 10, position: [-130, 45, -100] },
            { time: 20, position: [-80, 40, -50] },
            { time: 30, position: [-30, 30, -20] },
            { time: 40, position: [0, 20, 0], event: 'Terminal Intercept' },
          ],
        },
        {
          droneId: 'trk-02',
          callsign: 'SHADOW-WING',
          type: 'hostile',
          points: [
            { time: 0, position: [170, 60, 140] },
            { time: 10, position: [120, 55, 95] },
            { time: 20, position: [75, 45, 55] },
            { time: 30, position: [30, 35, 20] },
          ],
        },
        {
          droneId: 'trk-03',
          callsign: 'CIV-ESCORT',
          type: 'benign',
          points: [
            { time: 0, position: [0, 80, 200] },
            { time: 15, position: [0, 75, 120] },
            { time: 30, position: [0, 70, 40], event: 'Civilian Corridor Clear' },
          ],
        },
      ],
    }));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(formattedSessions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_TRAINEE)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRAINEE, JSON.stringify(SAMPLE_TRAINEES[0]));
  }
}

initializeStorage();

export const DataLayer = {
  // Scenarios
  async getScenarios() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(SCRIPTED_SCENARIOS));
        return SCRIPTED_SCENARIOS;
      }
      const parsed = JSON.parse(data);
      const merged = [...parsed];
      for (const official of SCRIPTED_SCENARIOS) {
        const idx = merged.findIndex((s) => s.id === official.id);
        if (idx === -1) {
          merged.push(official);
        } else {
          merged[idx] = { ...official, ...merged[idx] };
        }
      }
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(merged));
      return merged;
    } catch {
      return SCRIPTED_SCENARIOS;
    }
  },

  async getScenarioById(id) {
    const list = await this.getScenarios();
    return list.find((s) => s.id === id) || SCRIPTED_SCENARIOS[0];
  },

  async saveScenario(newScenario) {
    const list = await this.getScenarios();
    const existingIndex = list.findIndex((s) => s.id === newScenario.id);
    if (existingIndex >= 0) {
      list[existingIndex] = newScenario;
    } else {
      list.unshift(newScenario);
    }
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(list));
    return newScenario;
  },

  async deleteScenario(id) {
    let list = await this.getScenarios();
    list = list.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(list));
    return list;
  },

  // Trainees
  async getTrainees() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAINEES);
      const trainees = data ? JSON.parse(data) : SAMPLE_TRAINEES;
      return trainees.map((t) => ({
        ...t,
        service: t.service || (t.rank.includes('Sqn') || t.rank.includes('Flt') ? 'Air Force' : t.rank.includes('Cdr') ? 'Navy' : 'Army'),
      }));
    } catch {
      return SAMPLE_TRAINEES;
    }
  },

  async getTraineeById(id) {
    const list = await this.getTrainees();
    return list.find((t) => t.id === id) || SAMPLE_TRAINEES[0];
  },

  getActiveTrainee() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRAINEE);
      return data ? JSON.parse(data) : SAMPLE_TRAINEES[0];
    } catch {
      return SAMPLE_TRAINEES[0];
    }
  },

  setActiveTrainee(trainee) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRAINEE, JSON.stringify(trainee));
  },

  async saveTrainee(newTrainee) {
    const list = await this.getTrainees();
    const idx = list.findIndex((t) => t.id === newTrainee.id);
    if (idx >= 0) {
      list[idx] = newTrainee;
    } else {
      list.push(newTrainee);
    }
    localStorage.setItem(STORAGE_KEYS.TRAINEES, JSON.stringify(list));
    return newTrainee;
  },

  // Sessions
  async getSessions(traineeId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const list = data ? JSON.parse(data) : SAMPLE_SESSIONS;
      if (traineeId) {
        return list.filter((s) => s.traineeId === traineeId);
      }
      return list;
    } catch {
      return SAMPLE_SESSIONS;
    }
  },

  async getSessionById(sessionId) {
    const list = await this.getSessions();
    return list.find((s) => s.id === sessionId) || SAMPLE_SESSIONS[0];
  },

  getLatestResult() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LATEST_RESULT);
      if (data) return JSON.parse(data);
      const sessions = this.getSessionsSync();
      return sessions.length > 0 ? sessions[0] : null;
    } catch {
      return null;
    }
  },

  getSessionsSync() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : SAMPLE_SESSIONS;
    } catch {
      return SAMPLE_SESSIONS;
    }
  },

  saveSession(sessionData) {
    const list = this.getSessionsSync();
    const newSession = {
      ...sessionData,
      id: sessionData.id || `ses-${Date.now()}`,
      timestamp: Date.now(),
      date: sessionData.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
      overallScore: sessionData.overallScore ?? sessionData.score ?? 85,
      avgDetectionLatency: sessionData.avgDetectionLatency ?? sessionData.avgLatency ?? 4.0,
      classificationAccuracy: sessionData.classificationAccuracy ?? 88,
      roeAdherence: sessionData.roeAdherence ?? 90,
      civilianFratricideCount: sessionData.civilianFratricideCount ?? sessionData.roeViolations ?? 0,
      replayFlightData: sessionData.replayFlightData || [
        {
          droneId: 'trk-lead',
          callsign: 'HOSTILE-LEAD',
          type: 'hostile',
          points: [
            { time: 0, position: [-190, 52, 110] },
            { time: 10, position: [-140, 46, 80] },
            { time: 20, position: [-90, 40, 50] },
            { time: 30, position: [-40, 32, 20], event: 'Intercept Fired' },
          ],
        },
      ],
    };

    list.unshift(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEYS.LATEST_RESULT, JSON.stringify(newSession));

    return newSession;
  },

  async getUnitAnalytics() {
    const sessions = await this.getSessions();
    const trainees = await this.getTrainees();

    const avgScore = Math.round(
      sessions.reduce((acc, s) => acc + (s.overallScore || s.score || 0), 0) / (sessions.length || 1)
    );
    const avgLatency = Number(
      (sessions.reduce((acc, s) => acc + (s.avgDetectionLatency || s.avgLatency || 4), 0) / (sessions.length || 1)).toFixed(1)
    );
    const avgAccuracy = Math.round(
      sessions.reduce((acc, s) => acc + (s.classificationAccuracy || 0), 0) / (sessions.length || 1)
    );

    const commonMistakes = [
      {
        id: 'FRATRICIDE_HAZARD',
        severity: 'critical',
        frequency: '18% of trainees',
        title: 'Premature Engagement on Ambiguous Civilian Tracks',
        description: 'Trainees under time pressure authorize kinetic fire before verifying frequency hopping or transponder replies.',
        remedy: 'Enforce strict 2-step verification: EO/IR visual zoom + RF spectrum interrogate before weapon arming.',
      },
      {
        id: 'DECOY_FIXATION',
        severity: 'high',
        frequency: '34% of sorties',
        title: 'Fixation on High-RCS Decoys',
        description: 'High-altitude reflector decoys distracted operators while low-altitude suicide loiterers breached terminal envelope.',
        remedy: 'Instruct trainees to cross-reference velocity vectors heading directly to base coordinates [0,0,0].',
      },
      {
        id: 'JAMMER_BLIND_SPOT',
        severity: 'medium',
        frequency: '42% of sorties',
        title: 'Hesitation During Electronic Warfare Jams',
        description: 'When radar strobe noise occurred, operators delayed switching to EO/IR thermal cameras by over 6.5 seconds.',
        remedy: 'Practice hotkey [2] or instant optical slave slew on strobe detection.',
      },
    ];

    return {
      avgScore,
      avgLatency,
      avgAccuracy,
      totalSorties: sessions.length,
      qualifiedOfficers: trainees.filter((t) => (t.avgScore || 0) >= 80).length,
      commonMistakes,
    };
  },

  async resetToDefaults() {
    this.resetDefaults();
  },

  resetDefaults() {
    localStorage.removeItem(STORAGE_KEYS.SCENARIOS);
    localStorage.removeItem(STORAGE_KEYS.TRAINEES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TRAINEE);
    localStorage.removeItem(STORAGE_KEYS.LATEST_RESULT);
    initializeStorage();
  },
};

export const dataLayer = DataLayer;
export default DataLayer;

