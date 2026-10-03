/**
 * SkyShield Trainer - Sentry Rapid Drone Recognition & IFF Flashcard Drill
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Timed rapid target acquisition drill for air sentries at forward operating bases.
 * Tests visual silhouette, acoustic pitch recognition, and rules of engagement (ROE).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Volume2,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  X,
  Zap,
  Target,
  ChevronRight,
  Flame,
  Radio,
  FileCheck,
} from 'lucide-react';
import { playSound, playDroneAcousticPitch } from '../common/SoundEffects';
import { speakTacticalAlert, TACTICAL_CALLOUTS } from '../common/RadioComms';
import { dataLayer } from '../../data/dataLayer';
import { useAuth } from '../../context/AuthContext';

const DRILL_QUESTIONS = [
  {
    id: 'q1',
    name: 'Shahed-Style Delta-Wing Munition',
    speed: '185 km/h',
    altitude: '65m AGL',
    rcs: '0.028 m²',
    rfSpectrum: 'GNSS Satellite Assisted (Minimal RF Leakage)',
    acousticPitch: 110,
    acousticLabel: '110 Hz Heavy Piston Engine Buzz ("Lawnmower")',
    silhouette: 'Delta triangular flying wing, rear pusher propeller, high thermal exhaust plume.',
    thermalMode: true,
    correctAnswer: 'hostile_delta',
    options: [
      { id: 'hostile_delta', label: 'Hostile Loitering Kamikaze (Shahed Archetype)', isCorrect: true },
      { id: 'civilian_cargo', label: 'Civilian Medical Courier Drone', isCorrect: false },
      { id: 'friendly_quad', label: 'Friendly Military Surveillance Quad', isCorrect: false },
      { id: 'fpv_kamikaze', label: 'FPV Micro Racing Drone', isCorrect: false },
    ],
    doctrineNote: 'Shahed archetypes carry high-explosive warheads with high rear thermal exhaust. Immediate laser engagement authorized.',
  },
  {
    id: 'q2',
    name: 'Commercial Quadcopter with Release Pin',
    speed: '65 km/h',
    altitude: '35m AGL (Hovering)',
    rcs: '0.015 m²',
    rfSpectrum: '2.4 GHz / 5.8 GHz ISM Jump Telemetry',
    acousticPitch: 480,
    acousticLabel: '480 Hz High-Pitched Quad-Rotor Buzz',
    silhouette: 'X-frame carbon quadcopter hovering over ammunition depot with suspended cylinder underbelly.',
    thermalMode: false,
    correctAnswer: 'hostile_ied_quad',
    options: [
      { id: 'friendly_quad', label: 'Friendly Airbase Security Drone', isCorrect: false },
      { id: 'hostile_ied_quad', label: 'Hostile Commercial IED Dropper', isCorrect: true },
      { id: 'civilian_cargo', label: 'Civilian Survey Drone', isCorrect: false },
      { id: 'fixed_wing_recon', label: 'High-Altitude Fixed-Wing Recon', isCorrect: false },
    ],
    doctrineNote: 'Suspended cylinder indicates improvised release mechanism. Engage with directional RF jammer to trigger fail-safe landing.',
  },
  {
    id: 'q3',
    name: 'Authorized Civilian Cargo Delivery UAV',
    speed: '95 km/h',
    altitude: '120m AGL',
    rcs: '0.045 m²',
    rfSpectrum: 'ADS-B Civil Transponder 1090 MHz Active',
    acousticPitch: 320,
    acousticLabel: '320 Hz Constant Electric Propeller Hum',
    silhouette: 'Heavy hexacopter with green civil navigation strobes and visible orange logistics payload container.',
    thermalMode: false,
    correctAnswer: 'civilian_cargo',
    options: [
      { id: 'hostile_delta', label: 'Hostile Loitering Munition', isCorrect: false },
      { id: 'hostile_ied_quad', label: 'Hostile Swarm Drone', isCorrect: false },
      { id: 'civilian_cargo', label: 'Civilian Logistics Courier (HOLD FIRE)', isCorrect: true },
      { id: 'fpv_kamikaze', label: 'FPV Suicide Interceptor', isCorrect: false },
    ],
    doctrineNote: 'Emits civil ADS-B transponder and navigation lights. Engaging causes critical civilian fratricide code violation.',
  },
  {
    id: 'q4',
    name: 'High-Speed FPV Kamikaze Striker',
    speed: '145 km/h',
    altitude: '15m AGL (Contour Flight)',
    rcs: '0.008 m² (Ultra-Low)',
    rfSpectrum: '915 MHz ELRS Control / 5.8 GHz Analog Video',
    acousticPitch: 750,
    acousticLabel: '750 Hz Ultra-High Screaming Motor Whine',
    silhouette: 'Compact 7-inch quadcopter executing high-g aggressive evasive dive directly toward radar station.',
    thermalMode: true,
    correctAnswer: 'fpv_kamikaze',
    options: [
      { id: 'fpv_kamikaze', label: 'High-Speed FPV Suicide Drone', isCorrect: true },
      { id: 'friendly_quad', label: 'Friendly Scouting Quadcopter', isCorrect: false },
      { id: 'civilian_cargo', label: 'Civilian Agricultural Drone', isCorrect: false },
      { id: 'hostile_delta', label: 'Fixed Wing Recon Plane', isCorrect: false },
    ],
    doctrineNote: 'Extreme speed and low RCS leaves < 4 seconds reaction window. Jam analog video band or fire point-blank kinetic countermeasure.',
  },
  {
    id: 'q5',
    name: 'Friendly Military Surveillance Micro-UAV',
    speed: '40 km/h',
    altitude: '80m AGL',
    rcs: '0.012 m²',
    rfSpectrum: 'Encrypted NATO/Mil-Std Mode-5 Transponder Match',
    acousticPitch: 420,
    acousticLabel: '420 Hz Quiet Electric Whir',
    silhouette: 'Tri-rotor military drone with encrypted secure datalink emitting friendly IFF interrogation squawk.',
    thermalMode: false,
    correctAnswer: 'friendly_quad',
    options: [
      { id: 'hostile_ied_quad', label: 'Hostile Spotter Drone', isCorrect: false },
      { id: 'friendly_quad', label: 'Friendly Military Drone (IFF CONFIRMED)', isCorrect: true },
      { id: 'hostile_delta', label: 'Kamikaze Dive-Bomber', isCorrect: false },
      { id: 'fpv_kamikaze', label: 'FPV Munition', isCorrect: false },
    ],
    doctrineNote: 'Encrypted military IFF confirmed by central C2 grid. Maintain friendly corridor; do not engage.',
  },
];

export function SentryQuizModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [isFinished, setIsFinished] = useState(false);
  const [drillLog, setDrillLog] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const timerRef = useRef(null);

  // Reset drill when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setCorrectCount(0);
      setTimeLeft(12);
      setIsFinished(false);
      setDrillLog([]);
      setSavedSuccess(false);
      playSound('system_ready');
    }
  }, [isOpen]);

  // Countdown timer for each question
  useEffect(() => {
    if (!isOpen || isFinished || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isOpen, isFinished, isAnswered, currentIdx]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(null);
    playSound('alarm_high');
    speakTacticalAlert('Time expired! Air sentry reaction window breached.');
    
    setDrillLog((prev) => [
      ...prev,
      {
        questionId: DRILL_QUESTIONS[currentIdx].id,
        targetName: DRILL_QUESTIONS[currentIdx].name,
        userAnswer: 'TIMED OUT',
        isCorrect: false,
        timeTaken: 12,
        points: -50,
      },
    ]);
  };

  const handleSelectAnswer = (option) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option.id);
    clearInterval(timerRef.current);

    const timeSpent = 12 - timeLeft;
    const isCorrect = option.isCorrect;

    let pointsAwarded = 0;
    if (isCorrect) {
      // Speed bonus: answering faster gives more points
      const speedBonus = Math.max(0, timeLeft * 8);
      pointsAwarded = 100 + speedBonus;
      setScore((s) => s + pointsAwarded);
      setCorrectCount((c) => c + 1);
      playSound('target_lock');
      speakTacticalAlert('Target correctly identified. Good work sentry.');
    } else {
      // Fratricide or misidentification penalty
      pointsAwarded = option.id === 'civilian_cargo' || option.id === 'friendly_quad' ? -150 : -80;
      setScore((s) => Math.max(0, s + pointsAwarded));
      playSound('alarm_high');
      speakTacticalAlert(TACTICAL_CALLOUTS.ROE_VIOLATION);
    }

    setDrillLog((prev) => [
      ...prev,
      {
        questionId: DRILL_QUESTIONS[currentIdx].id,
        targetName: DRILL_QUESTIONS[currentIdx].name,
        userAnswer: option.label,
        isCorrect,
        timeTaken: timeSpent,
        points: pointsAwarded,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < DRILL_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(12);
    } else {
      setIsFinished(true);
      playSound('system_ready');
      speakTacticalAlert(TACTICAL_CALLOUTS.ALL_CLEAR);
    }
  };

  const handlePlayAcousticPitch = () => {
    const q = DRILL_QUESTIONS[currentIdx];
    playDroneAcousticPitch(q.acousticPitch, 1.8);
  };

  const handleSaveDossier = () => {
    const avgTime = (drillLog.reduce((acc, l) => acc + l.timeTaken, 0) / drillLog.length).toFixed(1);
    const accuracy = Math.round((correctCount / DRILL_QUESTIONS.length) * 100);

    dataLayer.saveSession({
      traineeId: currentUser?.serviceNo || 'SENTRY-01',
      traineeName: currentUser?.name || 'Air Sentry Candidate',
      serviceNo: currentUser?.serviceNo || 'IC-SENTRY',
      scenarioId: 'sentry-rapid-drill',
      scenarioName: 'Rapid Sentry 60s Drone ID Drill',
      seed: 'SENTRY-DRILL-ALPHA',
      duration: Math.round(drillLog.reduce((acc, l) => acc + l.timeTaken, 0)),
      overallScore: score,
      score,
      grade: accuracy >= 80 ? 'DISTINCTION' : accuracy >= 60 ? 'QUALIFIED' : 'REMEDIAL',
      badge: accuracy >= 80 ? 'Master Air Sentry' : 'Qualified Sentry',
      ratingLabel: accuracy >= 80 ? 'Master Air Sentry' : 'Qualified Sentry',
      avgDetectionLatency: Number(avgTime),
      avgLatency: Number(avgTime),
      classificationAccuracy: accuracy,
      roeAdherence: accuracy >= 80 ? 100 : 75,
      civilianFratricideCount: 0,
      roeViolations: 0,
      contactsCount: DRILL_QUESTIONS.length,
      interceptsCount: correctCount,
      events: drillLog.map((d, i) => ({
        time: i * 12,
        type: 'classify',
        trackId: d.questionId,
        label: `${d.targetName}: ${d.isCorrect ? 'CORRECT' : 'INCORRECT'} (${d.points} pts)`,
      })),
    });

    setSavedSuccess(true);
    playSound('system_ready');
  };

  if (!isOpen) return null;

  const currentQ = DRILL_QUESTIONS[currentIdx];
  const accuracyPct = Math.round((correctCount / DRILL_QUESTIONS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0F0F0F] border border-[#FF1A1A]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* TOP STATUS BAR */}
        <div className="px-6 py-4 bg-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0A0A0A] border border-[#FF1A1A] flex items-center justify-center text-[#FF1A1A] shadow-red-glow-sm">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span>SENTRY COMBAT REACTION DRILL</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/40">
                  DSSC PROTOCOL
                </span>
              </div>
              <div className="text-[11px] text-gray-400">
                Rapid Target Acquisition & IFF Discrimination Under Time Pressure
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isFinished ? (
            <>
              {/* PROGRESS & COUNTDOWN HEADER */}
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="font-bold text-white text-sm">TARGET {currentIdx + 1}</span>
                  <span>OF {DRILL_QUESTIONS.length}</span>
                </div>

                {/* Animated Countdown Timer */}
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${timeLeft <= 3 ? 'text-[#FF1A1A] animate-ping' : 'text-amber-400'}`} />
                  <span
                    className={`text-lg font-bold ${
                      timeLeft <= 3 ? 'text-[#FF1A1A] font-black scale-110' : 'text-amber-400'
                    } transition-all`}
                  >
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </span>
                  <span className="text-[10px] text-gray-400">WINDOW</span>
                </div>

                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                  SCORE: {score} PTS
                </div>
              </div>

              {/* TIME REMAINING PROGRESS BAR */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 3 ? 'bg-[#FF1A1A]' : timeLeft <= 6 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(timeLeft / 12) * 100}%` }}
                />
              </div>

              {/* TARGET RECONNAISSANCE CARD */}
              <div className="rounded-xl bg-[#141414] border border-white/10 p-5 space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF1A1A] animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      INCOMING RADAR CONTACT // AZIMUTH 035°
                    </span>
                  </div>

                  {/* Mode Badge */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      currentQ.thermalMode
                        ? 'bg-red-950/60 text-[#FF1A1A] border border-[#FF1A1A]/40 flex items-center gap-1'
                        : 'bg-sky-950/60 text-sky-400 border border-sky-500/40'
                    }`}
                  >
                    {currentQ.thermalMode && <Flame className="w-3 h-3" />}
                    {currentQ.thermalMode ? 'LWIR THERMAL HEAT' : 'OPTICAL SILHOUETTE'}
                  </span>
                </div>

                {/* Visual Silhouette Description */}
                <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-white/5 text-xs text-gray-300 leading-relaxed font-sans">
                  <strong className="text-white font-mono block mb-1 uppercase tracking-wide">
                    SENTRY VISUAL & SENSOR OBSERVATION:
                  </strong>
                  {currentQ.silhouette}
                </div>

                {/* Telemetry Sensor Readout Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                    <div className="text-[10px] text-gray-400">GROUND SPEED</div>
                    <div className="text-sm font-bold text-amber-400">{currentQ.speed}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                    <div className="text-[10px] text-gray-400">RADAR CROSS (RCS)</div>
                    <div className="text-sm font-bold text-sky-400">{currentQ.rcs}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                    <div className="text-[10px] text-gray-400">ALTITUDE AGL</div>
                    <div className="text-sm font-bold text-white">{currentQ.altitude}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                    <div className="text-[10px] text-gray-400">RF CONTROL LINK</div>
                    <div className="text-[11px] font-bold text-emerald-400 truncate">{currentQ.rfSpectrum}</div>
                  </div>
                </div>

                {/* ACOUSTIC MOTOR PITCH SYNTHESIZER BUTTON */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">ACOUSTIC MOTOR SIGNATURE</div>
                      <div className="text-[10px] text-gray-400">{currentQ.acousticLabel}</div>
                    </div>
                  </div>
                  <button
                    onClick={handlePlayAcousticPitch}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Motor Pitch</span>
                  </button>
                </div>
              </div>

              {/* CLASSIFICATION MULTIPLE CHOICE OPTIONS */}
              <div className="space-y-2.5">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  SELECT SENTRY CLASSIFICATION & ACTION:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let style = 'bg-[#141414] border-white/10 text-gray-300 hover:border-[#FF1A1A] hover:bg-white/5';

                    if (isAnswered) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-red-950/40 border-[#FF1A1A] text-[#FF1A1A] font-bold';
                      } else {
                        style = 'bg-[#141414]/50 border-white/5 text-gray-600 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`p-4 rounded-xl border text-left text-xs font-sans font-medium transition-all flex items-center justify-between cursor-pointer ${style}`}
                      >
                        <span>{opt.label}</span>
                        {isAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-[#FF1A1A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* POST-ANSWER FEEDBACK & DOCTRINE EXPLANATION */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-[#141414] border border-white/15 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    {selectedOption && currentQ.options.find((o) => o.id === selectedOption)?.isCorrect ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        CORRECT IDENTIFICATION // +100 PTS + SPEED BONUS
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#FF1A1A] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#FF1A1A]" />
                        INCORRECT CLASSIFICATION // RULES OF ENGAGEMENT BREACH
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    <strong>DSSC Doctrine:</strong> {currentQ.doctrineNote}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-bold text-xs flex items-center gap-2 shadow-red-glow transition-all cursor-pointer"
                    >
                      <span>{currentIdx + 1 < DRILL_QUESTIONS.length ? 'Next Target' : 'View Final Scorecard'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* FINAL SCORECARD & QUALIFICATION REPORT */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-[#FF1A1A] mx-auto flex items-center justify-center text-[#FF1A1A] shadow-red-glow">
                <Award className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
                  SENTRY COMBAT DRILL COMPLETE
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Defence Services Staff College • Counter-UAS Unit Readiness Evaluation
                </p>
              </div>

              {/* SCORE BANNER */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase">FINAL SCORE</div>
                  <div className="text-2xl font-bold text-white mt-1">{score} PTS</div>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase">ACCURACY</div>
                  <div className={`text-2xl font-bold mt-1 ${accuracyPct >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {accuracyPct}% ({correctCount}/{DRILL_QUESTIONS.length})
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase">SENTRY STATUS</div>
                  <div className="text-sm font-bold text-[#FF1A1A] mt-1">
                    {accuracyPct >= 80 ? 'TIER-1 MASTER' : accuracyPct >= 60 ? 'QUALIFIED' : 'NEEDS DRILL'}
                  </div>
                </div>
              </div>

              {/* RECAP TABLE */}
              <div className="rounded-xl bg-[#141414] border border-white/10 p-4 text-left max-w-xl mx-auto space-y-2">
                <div className="text-xs font-bold text-white uppercase border-b border-white/10 pb-2">
                  Target Identification Breakdown
                </div>
                <div className="space-y-1.5 text-xs font-sans">
                  {drillLog.map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2">
                        {log.isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-[#FF1A1A]" />
                        )}
                        <span className="text-gray-200">{log.targetName}</span>
                      </div>
                      <div className="font-mono text-xs">
                        <span className="text-gray-400 mr-2">{log.timeTaken}s</span>
                        <span className={log.points > 0 ? 'text-emerald-400 font-bold' : 'text-[#FF1A1A] font-bold'}>
                          {log.points > 0 ? `+${log.points}` : log.points}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentIdx(0);
                    setSelectedOption(null);
                    setIsAnswered(false);
                    setScore(0);
                    setCorrectCount(0);
                    setTimeLeft(12);
                    setIsFinished(false);
                    setDrillLog([]);
                    setSavedSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Drill</span>
                </button>

                <button
                  disabled={savedSuccess}
                  onClick={handleSaveDossier}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#B30000] hover:bg-[#FF1A1A] text-white shadow-red-glow'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{savedSuccess ? 'Saved to Service Dossier!' : 'Log Drill to Officer Dossier'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
