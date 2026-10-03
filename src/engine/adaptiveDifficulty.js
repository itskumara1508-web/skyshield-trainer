/**
 * SkyShield Trainer - Adaptive Difficulty Engine
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Dynamically adjusts swarm size, sensor degradation, false track generation,
 * and intercept time windows based on trainee performance metrics.
 */

export const DIFFICULTY_PRESETS = {
  1: {
    level: 1,
    name: 'Initiate / Cadet',
    description: 'Single targets, clear day, zero EW noise, generous decision windows.',
    swarmSize: 2,
    sensorNoise: 0.05,
    falseTrackProbability: 0.02,
    jammingChance: 0.0,
    timeLimitSeconds: 120,
    speedMultiplier: 0.75,
  },
  2: {
    level: 2,
    name: 'Operator / Junior Officer',
    description: 'Small elements (3-4 drones), mild atmospheric scatter, light sensor drops.',
    swarmSize: 4,
    sensorNoise: 0.15,
    falseTrackProbability: 0.08,
    jammingChance: 0.1,
    timeLimitSeconds: 90,
    speedMultiplier: 1.0,
  },
  3: {
    level: 3,
    name: 'Tactical Commander',
    description: 'Coordinated swarms (6-7 drones), dusk/rain, intermittent radar ghosting.',
    swarmSize: 6,
    sensorNoise: 0.28,
    falseTrackProbability: 0.16,
    jammingChance: 0.25,
    timeLimitSeconds: 75,
    speedMultiplier: 1.25,
  },
  4: {
    level: 4,
    name: 'DSSC Strike Lead',
    description: 'Synchronized multi-angle attack (8-10 drones), heavy EW jamming, night ops.',
    swarmSize: 9,
    sensorNoise: 0.40,
    falseTrackProbability: 0.25,
    jammingChance: 0.4,
    timeLimitSeconds: 60,
    speedMultiplier: 1.5,
  },
  5: {
    level: 5,
    name: 'Apex Perimeter Overmatch',
    description: 'Dense autonomous swarm (12+ drones), full sensor blackout bursts, high velocity.',
    swarmSize: 12,
    sensorNoise: 0.55,
    falseTrackProbability: 0.35,
    jammingChance: 0.6,
    timeLimitSeconds: 45,
    speedMultiplier: 1.8,
  },
};

/**
 * Evaluates trainee's recent sessions and calculates the appropriate difficulty parameters
 * 
 * @param {Array} sessionHistory - Array of past session evaluations for the trainee
 * @param {Object} currentConfig - Current simulation configuration
 * @returns {Object} Adjusted difficulty recommendation and metrics
 */
export function calculateNextDifficulty(sessionHistory = [], currentConfig = {}) {
  const currentLevel = currentConfig.difficultyLevel || 2;
  const preset = DIFFICULTY_PRESETS[currentLevel] || DIFFICULTY_PRESETS[2];

  if (!sessionHistory || sessionHistory.length === 0) {
    return {
      recommendedLevel: currentLevel,
      trend: 'baseline',
      reason: 'Initial baseline evaluation. Operating under standard DSSC qualification profile.',
      parameters: preset,
    };
  }

  // Look at last 3 sessions
  const recentSessions = sessionHistory.slice(-3);
  const avgScore = recentSessions.reduce((acc, s) => acc + (s.score || s.percentage || 0), 0) / recentSessions.length;
  const recentViolations = recentSessions.reduce((acc, s) => acc + (s.roeViolations || 0), 0);
  const avgLatency = recentSessions.reduce((acc, s) => acc + (s.avgLatency || 5), 0) / recentSessions.length;

  let recommendedLevel = currentLevel;
  let trend = 'stable';
  let reason = '';

  if (avgScore >= 85 && recentViolations === 0 && avgLatency < 5.5) {
    if (currentLevel < 5) {
      recommendedLevel = currentLevel + 1;
      trend = 'increase';
      reason = `Exemplary performance across last ${recentSessions.length} sorties (Avg ${Math.round(avgScore)}%, Zero ROE infractions). Elevating to Level ${recommendedLevel}: increasing swarm dispersion and sensor noise.`;
    } else {
      trend = 'max';
      reason = 'Trainee operating at maximum qualification tier (Level 5). Maintaining extreme stress parameters.';
    }
  } else if (avgScore < 60 || recentViolations >= 2 || avgLatency > 9.5) {
    if (currentLevel > 1) {
      recommendedLevel = currentLevel - 1;
      trend = 'decrease';
      reason = `Critical friction detected (Avg ${Math.round(avgScore)}%, ${recentViolations} ROE violations). Scaling back to Level ${recommendedLevel} to stabilize core IFF identification protocols.`;
    } else {
      trend = 'min';
      reason = 'Trainee requires remedial practice on Level 1 fundamentals before progressing to coordinated swarms.';
    }
  } else {
    trend = 'stable';
    reason = `Consistent operational performance (Avg ${Math.round(avgScore)}%). Maintaining Level ${currentLevel} to reinforce target prioritization reflexes.`;
  }

  const adjustedPreset = DIFFICULTY_PRESETS[recommendedLevel];

  return {
    recommendedLevel,
    trend,
    reason,
    avgRecentScore: Math.round(avgScore),
    parameters: {
      ...adjustedPreset,
      swarmSize: adjustedPreset.swarmSize,
      sensorNoise: adjustedPreset.sensorNoise,
      timeLimitSeconds: adjustedPreset.timeLimitSeconds,
      falseTrackProbability: adjustedPreset.falseTrackProbability,
    },
  };
}

