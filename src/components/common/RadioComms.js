/**
 * SkyShield Trainer - Procedural Military Tactical Voice Comms
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Uses browser's native Web Speech API to synthesize tactical C2 voice alerts
 * (Early Warning, Target Lock, ROE Warnings) with zero external network or API dependency.
 */

let speechSynth = null;
let voiceEnabled = true;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynth = window.speechSynthesis;
}

export function setVoiceCommsEnabled(enabled) {
  voiceEnabled = enabled;
  if (!enabled && speechSynth) {
    speechSynth.cancel();
  }
}

export function isVoiceCommsEnabled() {
  return voiceEnabled;
}

export function speakTacticalAlert(phrase, priority = 'normal') {
  if (!voiceEnabled || !speechSynth) return;

  try {
    // If high priority alert, cancel ongoing speech
    if (priority === 'high') {
      speechSynth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.05; // Crisps military cadence
    utterance.pitch = 0.95; // Authoritative tone
    utterance.volume = 0.85;

    // Pick English military-sounding voice if available
    const voices = speechSynth.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes('David') || v.name.includes('Rishi') || v.name.includes('George') || v.name.includes('Natural') || v.lang === 'en-IN' || v.lang === 'en-GB')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynth.speak(utterance);
  } catch (err) {
    // Graceful fallback
  }
}

export const TACTICAL_CALLOUTS = {
  MISSION_START: 'Air defense grid active. Early warning radar tracking sector Alpha.',
  SWARM_DETECTED: 'Warning: Coordinated drone swarm detected on radar approach azimuth.',
  TRACK_LOCKED: 'Radar track confirmed. Awaiting IFF classification.',
  HOSTILE_LOCKED: 'Target acquired. Hostile drone confirmed on lethal approach.',
  HOSTILE_CONFIRMED: 'Track designated hostile. Standing by for graduated ROE response.',
  FRIENDLY_CONFIRMED: 'Mode-5 transponder verified. Track designated friendly.',
  BENIGN_CONFIRMED: 'Civilian air corridor verified. Hold fire.',
  FRIENDLY_CORRIDOR: 'Attention sentry: Mode-5 transponder verified. Friendly transit corridor clear.',
  CIVILIAN_WARNING: 'Civilian unmanned track detected. Issue directional redirect warning.',
  FIRING_AUTHORIZED: 'Weapons free. High energy directed laser engaging target.',
  TARGET_SPLASH: 'Splash one. Hostile drone neutralized.',
  JAMMING_ENGAGED: 'Electronic warfare pulse active. Severing target telemetry link.',
  ROE_VIOLATION: 'Cease fire! Cease fire! Critical rules of engagement breach on non-hostile track.',
  MISSION_ACCOMPLISHED: 'Perimeter secure. All aerial threats neutralized or redirected.',
  ALL_CLEAR: 'Sector secure. Debriefing telemetry logged to After Action Review.',
};

