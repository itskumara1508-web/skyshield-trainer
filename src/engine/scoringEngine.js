/**
 * SkyShield Trainer - Decision-Tree Scoring Engine
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Evaluates trainee performance across:
 * 1. Detection latency (reaction speed)
 * 2. Classification accuracy (IFF & ROE alignment)
 * 3. Tactical engagement decision (rules of engagement correctness)
 * 4. Collateral / Friendly-Fire / ROE Violations (heavy penalties)
 */

export const OPTIMAL_ACTIONS = {
  hostile: {
    close: 'engage',      // < 150m from base
    medium: 'escalate',   // 150m - 350m
    far: 'monitor',       // > 350m
  },
  friendly: 'monitor',
  benign: 'warn',
};

export function getDistanceToBase(pos) {
  if (!pos) return 500;
  const x = pos[0] || 0;
  const z = pos[2] || 0;
  return Math.sqrt(x * x + z * z);
}

export function getOptimalResponse(contact) {
  if (contact.type === 'friendly') {
    return {
      action: 'monitor',
      reason: 'Friendly platform on registered military flight corridor. Monitor passive transponder.',
    };
  }
  if (contact.type === 'benign') {
    return {
      action: 'warn',
      reason: 'Civilian / medical unmanned drone. Broadcast redirect warning without kinetic action.',
    };
  }
  // Hostile
  const dist = getDistanceToBase(contact.position);
  if (dist < 180) {
    return {
      action: 'engage',
      reason: 'Hostile loitering munition inside lethal defense perimeter (<180m). Neutralization authorized.',
    };
  } else if (dist < 320) {
    return {
      action: 'escalate',
      reason: 'Hostile contact probing outer perimeter (180-320m). Activate directional RF jamming.',
    };
  } else {
    return {
      action: 'monitor',
      reason: 'Hostile track at long distance. Maintain sensor lock and calculate intercept vector.',
    };
  }
}

export function evaluateSession(contacts = [], actions = [], sessionDuration = 90) {
  let totalPossiblePoints = contacts.length * 100;
  if (totalPossiblePoints === 0) totalPossiblePoints = 100;

  let earnedPoints = 0;
  let correctClassifications = 0;
  let totalLatency = 0;
  let detectedCount = 0;
  let roeViolations = 0;
  let civilianFratricideCount = 0;
  let lateResponses = 0;
  let adherentActions = 0;

  const contactEvaluations = contacts.map((contact) => {
    const contactActions = actions.filter((a) => a.trackId === contact.id);
    const classificationAction = contactActions.find((a) => a.type === 'classify');
    const responseAction = contactActions.find((a) => a.type === 'response');
    const firstAction = contactActions[0];

    const optimal = getOptimalResponse(contact);
    const trueType = contact.type || 'hostile';

    // 1. Detection Stage
    let detectionScore = 0;
    let latencySeconds = null;
    let detectStatus = 'warning';
    let detectActionText = 'Unacknowledged / Delayed';

    if (firstAction) {
      latencySeconds = Math.max(0, firstAction.timestamp - (contact.spawnTime || 0));
      totalLatency += latencySeconds;
      detectedCount++;

      if (latencySeconds <= 4.0) {
        detectionScore = 30;
        detectStatus = 'optimal';
        detectActionText = `Rapid Acquisition (${latencySeconds.toFixed(1)}s)`;
      } else if (latencySeconds <= 7.5) {
        detectionScore = 22;
        detectStatus = 'optimal';
        detectActionText = `Nominal Acquisition (${latencySeconds.toFixed(1)}s)`;
      } else {
        detectionScore = 12;
        detectStatus = 'warning';
        detectActionText = `Delayed Reaction (${latencySeconds.toFixed(1)}s)`;
        lateResponses++;
      }
    } else {
      detectStatus = 'critical_failure';
      detectActionText = 'Contact Missed on Radar';
    }

    // 2. Classification Stage
    let classScore = 0;
    let classifiedAs = classificationAction ? classificationAction.classification : 'unclassified';
    let classStatus = 'warning';
    let classActionText = `Unclassified (${classifiedAs})`;

    if (classifiedAs === trueType) {
      classScore = 35;
      classStatus = 'optimal';
      classActionText = `Accurate IFF (${trueType.toUpperCase()})`;
      correctClassifications++;
    } else if (classifiedAs === 'unclassified') {
      classScore = 0;
      classStatus = 'warning';
      classActionText = 'Left as UNKNOWN';
    } else {
      classScore = -15;
      classStatus = 'critical_failure';
      classActionText = `Misidentified as ${classifiedAs.toUpperCase()}`;
    }

    // 3. Response / ROE Stage
    let responseScore = 0;
    let chosenAction = responseAction ? responseAction.action : 'none';
    let roeStatus = 'optimal';
    let roeActionText = `${chosenAction.toUpperCase()}`;
    let feedback = '';

    if (chosenAction === optimal.action) {
      responseScore = 35;
      roeStatus = 'optimal';
      adherentActions++;
      feedback = `Optimal Doctrine: Executed ${chosenAction.toUpperCase()} adhering to counter-UAS rules of engagement.`;
    } else if (chosenAction === 'engage' && (trueType === 'benign' || trueType === 'friendly')) {
      responseScore = -60;
      roeViolations++;
      civilianFratricideCount++;
      roeStatus = 'critical_failure';
      roeActionText = `FRATRICIDE / ROE BREACH (${chosenAction.toUpperCase()})`;
      feedback = `CRITICAL FAILURE: Lethal fire opened against ${trueType.toUpperCase()} track! Severe military sanctions apply.`;
    } else if (chosenAction === 'none' && trueType === 'hostile') {
      responseScore = -25;
      roeStatus = 'critical_failure';
      roeActionText = 'NO ACTION TAKEN';
      feedback = 'Hostile contact permitted to breach critical defense bubble without interdiction.';
    } else {
      responseScore = 15;
      roeStatus = 'warning';
      roeActionText = `Suboptimal Order: ${chosenAction.toUpperCase()}`;
      feedback = `Trainee chose ${chosenAction.toUpperCase()}; operational doctrine recommends ${optimal.action.toUpperCase()}.`;
    }

    const contactTotalScore = Math.max(0, detectionScore + classScore + responseScore);
    earnedPoints += contactTotalScore;

    return {
      contactId: contact.id,
      callsign: contact.callsign || `TGT-${contact.id.slice(0, 4)}`,
      trueCategory: trueType,
      isGhost: false,
      traineeClass: classifiedAs,
      traineeResponse: chosenAction,
      totalPoints: contactTotalScore,
      traineeNodes: [
        {
          stage: 'Radar Detection',
          action: detectActionText,
          status: detectStatus,
          score: detectionScore,
        },
        {
          stage: 'IFF Classification',
          action: classActionText,
          status: classStatus,
          score: classScore,
        },
        {
          stage: 'ROE Engagement',
          action: roeActionText,
          status: roeStatus,
          score: responseScore,
        },
      ],
      optimalNodes: [
        {
          stage: 'Radar Detection',
          action: 'Rapid Acquisition (<4.0s)',
          doctrine: 'Standard Early-Warning Corridor protocol',
        },
        {
          stage: 'IFF Classification',
          action: `Accurate IFF: ${trueType.toUpperCase()}`,
          doctrine: 'Multi-Sensor Spectrum Cross-Check',
        },
        {
          stage: 'ROE Engagement',
          action: optimal.action.toUpperCase(),
          doctrine: optimal.reason,
        },
      ],
      feedback,
    };
  });

  const overallScore = Math.min(100, Math.max(0, Math.round((earnedPoints / totalPossiblePoints) * 100)));
  const avgDetectionLatency = detectedCount > 0 ? Number((totalLatency / detectedCount).toFixed(1)) : 0;
  const classificationAccuracy = contacts.length > 0 ? Math.round((correctClassifications / contacts.length) * 100) : 0;
  const roeAdherence = contacts.length > 0 ? Math.round((adherentActions / contacts.length) * 100) : 0;

  let grade = 'F';
  let badge = 'REMEDIAL REQUIRED';
  if (overallScore >= 92 && civilianFratricideCount === 0) {
    grade = 'S';
    badge = 'DSSC ELITE OPERATOR';
  } else if (overallScore >= 80 && civilianFratricideCount === 0) {
    grade = 'A';
    badge = 'COMBAT READY';
  } else if (overallScore >= 68 && civilianFratricideCount <= 1) {
    grade = 'B';
    badge = 'QUALIFIED WITH MARGIN';
  } else if (overallScore >= 50) {
    grade = 'C';
    badge = 'OPERATIONAL DRILLS REQUIRED';
  } else {
    grade = 'F';
    badge = 'DISQUALIFIED / CRITICAL BREACH';
  }

  return {
    overallScore,
    percentage: overallScore,
    grade,
    badge,
    ratingLabel: badge,
    avgDetectionLatency,
    avgLatency: avgDetectionLatency,
    classificationAccuracy,
    roeAdherence,
    roeViolations,
    civilianFratricideCount,
    lateResponses,
    contactEvaluations,
    totalContacts: contacts.length,
    detectedCount,
  };
}

