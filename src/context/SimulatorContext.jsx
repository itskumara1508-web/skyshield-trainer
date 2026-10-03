/**
 * SkyShield Trainer - Core Tactical Simulator Context
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Provides unified state for 3D physics, real-time sensor processing,
 * operator decision trees, and counter-UAS engagements.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SCRIPTED_SCENARIOS } from '../data/scriptedScenarios';
import { processSensorDegradation } from '../engine/sensorDegradation';
import { evaluateSession } from '../engine/scoringEngine';
import { updateDroneBehavior } from '../engine/behaviorTree';
import { updateBoidsFlock } from '../engine/boidsSwarm';
import { playSound } from '../components/common/SoundEffects';
import { speakTacticalAlert, TACTICAL_CALLOUTS } from '../components/common/RadioComms';
import { DataLayer } from '../data/dataLayer';

const SimulatorContext = createContext(null);

export function SimulatorProvider({ children }) {
  const [scenario, setScenario] = useState(() => SCRIPTED_SCENARIOS[0]);
  const [missionState, setMissionState] = useState('running');
  const [simTime, setSimTime] = useState(0);
  const [isNight, setIsNight] = useState(true);
  const swarmAlertTriggeredRef = useRef(false);

  // Contacts: rich representation with kinematics and classification state
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);

  // Weapon / ECM Active States for 3D Laser & Explosions
  const [isJamming, setIsJamming] = useState(false);
  const [isEngaging, setIsEngaging] = useState(false);
  const [activeTargetPos, setActiveTargetPos] = useState(null);
  const [neutralizedDrones, setNeutralizedDrones] = useState([]);

  // Trainee actions audit trail
  const [actionsLog, setActionsLog] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const lastTickRef = useRef(Date.now());

  // Converts scenario raw contacts into simulator interactive contact models
  const initializeContactsFromScenario = useCallback((scen) => {
    const rawList = scen.contacts || scen.threats || [];
    return rawList.map((c, i) => {
      const pos = c.position || c.initialPosition || [100, 40, 100];
      const speed = c.speed || c.attackSpeed || 15;
      let vel = c.velocity;
      if (!vel || !Array.isArray(vel)) {
        const dist = Math.hypot(pos[0], pos[2]) || 1;
        vel = [(-pos[0] / dist) * speed, 0, (-pos[2] / dist) * speed];
      }
      const type = (c.type || c.threatCategory || 'hostile').toLowerCase();
      const role = (c.role || 'attacker').toLowerCase();
      const behavior = (c.behavior || 'recon').toLowerCase();
      const modelType = c.modelType || (type === 'hostile' ? (role === 'attacker' ? 'delta_wing' : 'recon_quad') : 'civilian_cargo');

      return {
        id: c.id || `trk-${i + 1}`,
        callsign: c.callsign || `CONTACT-${i + 1}`,
        type,
        trueCategory: type,
        userCategory: 'unknown',
        modelType,
        role,
        behavior,
        spawnTime: c.spawnTime ?? c.attackTriggerTime ?? 0,
        position: [...pos],
        apparentPosition: [...pos],
        velocity: [...vel],
        speed,
        altitude: c.altitude || pos[1] || 40,
        distance: Math.hypot(pos[0] || 0, pos[2] || 0),
        flagged: false,
        flaggedTime: null,
        neutralized: false,
        isDropout: false,
        jammedLevel: 0,
        userResponse: null,
        radarCrossSection: c.radarCrossSection || 0.02,
        thermalSignature: c.thermalSignature || 0.8,
        rfFrequency: c.rfFrequency || '2.4 GHz',
      };
    });
  }, []);

  // Start / Load Mission
  const startMission = useCallback((newScenario) => {
    const targetScenario = newScenario || SCRIPTED_SCENARIOS[0];
    setScenario(targetScenario);
    setSimTime(0);
    setMissionState('running');
    setIsNight(targetScenario.environment?.timeOfDay === 'night');
    setIsJamming(false);
    setIsEngaging(false);
    setActiveTargetPos(null);
    setNeutralizedDrones([]);
    setActionHistory([]);
    setEvaluationResult(null);

    const initContacts = initializeContactsFromScenario(targetScenario);
    setContacts(initContacts);
    setSelectedContactId(initContacts[0]?.id || null);

    setActionsLog([
      {
        id: `log-${Date.now()}-init`,
        timestamp: 0.0,
        text: `AIR DEFENSE DRILL COMMENCED // SEED: ${targetScenario.seed}`,
        type: 'system',
        level: 'info',
      },
    ]);

    swarmAlertTriggeredRef.current = false;
    playSound('system_ready');
    speakTacticalAlert(TACTICAL_CALLOUTS.MISSION_START);
  }, [initializeContactsFromScenario]);

  // Initial load
  useEffect(() => {
    startMission(SCRIPTED_SCENARIOS[0]);
  }, [startMission]);

  // Flag Contact (Detect Stage)
  const flagDetected = useCallback((contactId) => {
    playSound('radar_ping');
    speakTacticalAlert(TACTICAL_CALLOUTS.TRACK_LOCKED);
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId && !c.flagged) {
          return { ...c, flagged: true, flaggedTime: simTime };
        }
        return c;
      })
    );

    setActionHistory((prev) => [
      ...prev,
      {
        type: 'detect',
        trackId: contactId,
        timestamp: Number(simTime.toFixed(2)),
      },
    ]);

    setActionsLog((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: Number(simTime.toFixed(1)),
        text: `Target manually flagged on C2 radar: [${contactId}]`,
        type: 'radar',
        level: 'info',
      },
      ...prev.slice(0, 49),
    ]);
  }, [simTime]);

  // Classify Contact (IFF Stage: hostile, friendly, benign)
  const classifyContact = useCallback((contactId, category) => {
    playSound('target_lock');
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return { ...c, userCategory: category };
        }
        return c;
      })
    );

    setActionHistory((prev) => [
      ...prev,
      {
        type: 'classify',
        trackId: contactId,
        classification: category,
        timestamp: Number(simTime.toFixed(2)),
      },
    ]);

    const level = category === 'hostile' ? 'danger' : category === 'friendly' ? 'success' : 'warning';
    
    // Procedural voice alert for IFF classification
    if (category === 'hostile') {
      speakTacticalAlert(TACTICAL_CALLOUTS.HOSTILE_CONFIRMED);
    } else if (category === 'friendly') {
      speakTacticalAlert(TACTICAL_CALLOUTS.FRIENDLY_CONFIRMED);
    } else if (category === 'benign') {
      speakTacticalAlert(TACTICAL_CALLOUTS.BENIGN_CONFIRMED);
    }

    setActionsLog((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: Number(simTime.toFixed(1)),
        text: `Track [${contactId}] designated as ${category.toUpperCase()}`,
        type: 'c2',
        level,
      },
      ...prev.slice(0, 49),
    ]);
  }, [simTime]);

  // Execute Response (ROE Stage: monitor, warn, rf_jam/escalate, kinetic_strike/engage)
  const executeResponse = useCallback((contactId, responseType) => {
    const normAction =
      responseType === 'kinetic_strike' || responseType === 'engage' || responseType === 'ENGAGE_KINETIC'
        ? 'engage'
        : responseType === 'rf_jam' || responseType === 'escalate' || responseType === 'ESCALATE_JAM'
        ? 'escalate'
        : responseType === 'warn' || responseType === 'WARN'
        ? 'warn'
        : 'monitor';


    const targetContact = contacts.find((c) => c.id === contactId);

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const isDead = normAction === 'engage';
          return {
            ...c,
            userResponse: normAction,
            neutralized: isDead ? true : c.neutralized,
            jammedLevel: normAction === 'escalate' ? 0.8 : c.jammedLevel,
          };
        }
        return c;
      })
    );

    setActionHistory((prev) => [
      ...prev,
      {
        type: 'response',
        trackId: contactId,
        action: normAction,
        timestamp: Number(simTime.toFixed(2)),
      },
    ]);

    if (normAction === 'engage') {
      playSound('firing');
      if (targetContact) {
        setActiveTargetPos([...targetContact.position]);
        setIsEngaging(true);
        setTimeout(() => setIsEngaging(false), 900);

        setNeutralizedDrones((prev) => [
          ...prev,
          { id: contactId, position: [...targetContact.position] },
        ]);

        // Voice callout: check if fratricide / ROE violation
        if (targetContact.trueCategory !== 'hostile') {
          speakTacticalAlert(TACTICAL_CALLOUTS.ROE_VIOLATION, 'high');
        } else {
          speakTacticalAlert(TACTICAL_CALLOUTS.FIRING_AUTHORIZED);
          setTimeout(() => {
            speakTacticalAlert(TACTICAL_CALLOUTS.TARGET_SPLASH);
          }, 1100);
        }
      }

      setActionsLog((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: Number(simTime.toFixed(1)),
          text: `FIRE ORDER AUTHORIZED: High-energy laser engaged [${contactId}]!`,
          type: 'weapons',
          level: 'danger',
        },
        ...prev.slice(0, 49),
      ]);
    } else if (normAction === 'escalate') {
      playSound('alarm_high');
      speakTacticalAlert(TACTICAL_CALLOUTS.JAMMING_ENGAGED);
      setIsJamming(true);
      setTimeout(() => setIsJamming(false), 2000);

      setActionsLog((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: Number(simTime.toFixed(1)),
          text: `RF Jamming pulse directed onto target sector [${contactId}]`,
          type: 'weapons',
          level: 'warning',
        },
        ...prev.slice(0, 49),
      ]);
    } else if (normAction === 'warn') {
      playSound('radar_ping');
      speakTacticalAlert(TACTICAL_CALLOUTS.CIVILIAN_WARNING);
      setActionsLog((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: Number(simTime.toFixed(1)),
          text: `Aviation guard frequency warning broadcast to [${contactId}]`,
          type: 'c2',
          level: 'info',
        },
        ...prev.slice(0, 49),
      ]);
    } else {
      setActionsLog((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: Number(simTime.toFixed(1)),
          text: `Continuous track and passive illumination held on [${contactId}]`,
          type: 'c2',
          level: 'info',
        },
        ...prev.slice(0, 49),
      ]);
    }
  }, [contacts, simTime]);

  // Finish / Complete Mission
  const finishMission = useCallback(() => {
    setMissionState('completed');
    speakTacticalAlert(TACTICAL_CALLOUTS.ALL_CLEAR);


    const activeOfficer = DataLayer.getActiveTrainee();
    const evaluation = evaluateSession(contacts, actionHistory, simTime);

    // Save session in dataLayer
    const saved = DataLayer.saveSession({
      traineeId: activeOfficer.id,
      traineeName: activeOfficer.name,
      serviceNo: activeOfficer.serviceNo,
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      seed: scenario.seed || 'STD-01',
      duration: Math.round(simTime),
      overallScore: evaluation.overallScore,
      score: evaluation.overallScore,
      grade: evaluation.grade,
      badge: evaluation.badge,
      ratingLabel: evaluation.badge,
      avgDetectionLatency: evaluation.avgDetectionLatency,
      avgLatency: evaluation.avgDetectionLatency,
      classificationAccuracy: evaluation.classificationAccuracy,
      roeAdherence: evaluation.roeAdherence,
      civilianFratricideCount: evaluation.civilianFratricideCount,
      roeViolations: evaluation.civilianFratricideCount,
      contactsCount: contacts.length,
      interceptsCount: contacts.filter((c) => c.neutralized).length,
      contactEvaluations: evaluation.contactEvaluations,
      events: actionHistory.map((a) => ({
        time: a.timestamp,
        type: a.type,
        trackId: a.trackId,
        label: `${a.type.toUpperCase()}: ${a.action || a.classification || 'Flagged'} on ${a.trackId}`,
      })),
      replayFlightData: contacts.map((c) => ({
        droneId: c.id,
        callsign: c.callsign,
        type: c.trueCategory,
        points: [
          { time: 0, position: [...c.position] },
          { time: 15, position: [c.position[0] * 0.7, c.position[1], c.position[2] * 0.7] },
          { time: 30, position: [c.position[0] * 0.4, c.position[1], c.position[2] * 0.4] },
          { time: 45, position: [c.position[0] * 0.1, c.position[1] - 10, c.position[2] * 0.1], event: c.neutralized ? 'Neutralized' : 'Overfly' },
        ],
      })),
    });

    setEvaluationResult({
      ...evaluation,
      sessionId: saved.id,
      officer: activeOfficer,
      seed: scenario.seed,
      scenarioName: scenario.name,
      duration: Math.round(simTime),
    });

    return saved;
  }, [contacts, actionHistory, simTime, scenario]);

  // Pause / Resume
  const pauseMission = useCallback(() => {
    setMissionState((prev) => (prev === 'paused' ? 'running' : 'paused'));
  }, []);

  // Main simulation kinematics loop
  useEffect(() => {
    if (missionState !== 'running') return;

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      setSimTime((t) => {
        const next = t + dt;
        const maxDuration = scenario?.durationSeconds || scenario?.duration || 90;
        if (next >= maxDuration) {
          clearInterval(interval);
          finishMission();
          return maxDuration;
        }
        return next;
      });

      // Update positions
      setContacts((prevList) => {
        const spawnedHostiles = prevList.filter(
          (c) => c.spawnTime <= simTime && !c.neutralized && c.type === 'hostile'
        );

        let flockUpdated = [];
        if (scenario.threatType === 'swarm' && spawnedHostiles.length > 1) {
          flockUpdated = updateBoidsFlock(spawnedHostiles, [0, 0, 0], dt);
          if (!swarmAlertTriggeredRef.current && spawnedHostiles.length >= 2) {
            swarmAlertTriggeredRef.current = true;
            speakTacticalAlert(TACTICAL_CALLOUTS.SWARM_DETECTED, 'high');
          }
        }


        return prevList.map((contact) => {
          if (contact.spawnTime > simTime || contact.neutralized) {
            return contact;
          }

          let newPos = [...contact.position];
          let newVel = [...contact.velocity];

          const flockMatch = flockUpdated.find((f) => f.id === contact.id);
          if (flockMatch) {
            newPos = flockMatch.position;
            newVel = flockMatch.velocity;
          } else {
            const updated = updateDroneBehavior(contact, [0, 0, 0], dt);
            newPos = updated.currentPosition || updated.position;
            newVel = updated.velocity;
          }

          // Degraded apparent position with jitter
          const jitter = (scenario.sensorState?.radarHealth || 1) < 0.5 ? (Math.random() - 0.5) * 3 : 0;
          const apparent = [newPos[0] + jitter, newPos[1], newPos[2] + jitter];
          const dist = Math.hypot(newPos[0], newPos[2]);

          return {
            ...contact,
            position: newPos,
            apparentPosition: apparent,
            velocity: newVel,
            distance: dist,
          };
        });
      });
    }, 80);

    return () => clearInterval(interval);
  }, [missionState, simTime, scenario, finishMission]);

  return (
    <SimulatorContext.Provider
      value={{
        scenario,
        missionState,
        simTime,
        missionTime: simTime,
        isNight,
        setIsNight,
        contacts,
        selectedContactId,
        setSelectedContactId,
        flagDetected,
        flagTrack: flagDetected,
        classifyContact,
        classifyTrack: classifyContact,
        executeResponse,
        pauseMission,
        startMission,
        loadScenario: startMission,
        finishMission,
        completeMission: finishMission,
        isJamming,
        isEngaging,
        activeTargetPos,
        neutralizedDrones,
        actionLogs: actionsLog,
        evaluationResult,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}

export default SimulatorContext;

