export const SENSOR_STATES = {
  NOMINAL: 'nominal',
  DEGRADED_RADAR: 'degraded_radar',
  DEGRADED_EOIR: 'degraded_eoir',
  JAMMED: 'jammed'
};

export class SensorSimulation {
  constructor(state = SENSOR_STATES.NOMINAL, weather = 'clear') {
    this.state = state;
    this.weather = weather;
    this.ghostTracks = [];
    this.lastDropoutCheck = 0;
  }

  setState(state) {
    this.state = state;
  }

  setWeather(weather) {
    this.weather = weather;
  }

  processTrack(trueDrone, simTime) {
    if (trueDrone.neutralized) {
      return {
        ...trueDrone,
        trackLost: true,
        noise: [0, 0, 0]
      };
    }

    let noiseMag = 0.2;
    let isDropout = false;
    let visualRangeLimit = 120;

    switch (this.state) {
      case SENSOR_STATES.NOMINAL:
        noiseMag = 0.3;
        break;
      case SENSOR_STATES.DEGRADED_RADAR:
        noiseMag = 4.5;
        if (Math.sin(simTime * 0.7 + trueDrone.id.charCodeAt(0)) > 0.75) {
          isDropout = true;
        }
        break;
      case SENSOR_STATES.DEGRADED_EOIR:
        noiseMag = 1.2;
        visualRangeLimit = this.weather === 'fog' ? 30 : 50;
        break;
      case SENSOR_STATES.JAMMED:
        noiseMag = 9.0;
        if (Math.sin(simTime * 1.5 + trueDrone.id.charCodeAt(0)) > 0.4) {
          isDropout = true;
        }
        break;
    }

    if (this.weather === 'fog' || this.weather === 'sandstorm') {
      noiseMag *= 1.8;
      visualRangeLimit *= 0.6;
    }

    const t = simTime * 3;
    const nx = Math.sin(t + trueDrone.position[0]) * noiseMag;
    const ny = Math.cos(t * 0.8 + trueDrone.position[1]) * (noiseMag * 0.4);
    const nz = Math.sin(t * 1.2 + trueDrone.position[2]) * noiseMag;

    const apparentPos = [
      trueDrone.position[0] + nx,
      Math.max(1, trueDrone.position[1] + ny),
      trueDrone.position[2] + nz
    ];

    const distToBase = Math.hypot(apparentPos[0], apparentPos[2]);

    return {
      id: trueDrone.id,
      trueId: trueDrone.id,
      callsign: trueDrone.callsign,
      role: trueDrone.role,
      apparentPosition: apparentPos,
      actualPosition: trueDrone.position,
      apparentVelocity: trueDrone.velocity || [0, 0, 0],
      altitude: apparentPos[1],
      distance: distToBase,
      azimuth: (Math.atan2(apparentPos[0], apparentPos[2]) * (180 / Math.PI) + 360) % 360,
      isDropout,
      visibleEOIR: distToBase <= visualRangeLimit,
      radarConfidence: isDropout ? 0 : Math.max(15, Math.min(99, Math.round(100 - noiseMag * 8))),
      isGhost: false,
      trueCategory: trueDrone.threatCategory
    };
  }

  generateGhostTracks(simTime, count = 2) {
    if (this.state !== SENSOR_STATES.DEGRADED_RADAR && this.state !== SENSOR_STATES.JAMMED) {
      return [];
    }

    const ghosts = [];
    const numGhosts = this.state === SENSOR_STATES.JAMMED ? count + 2 : count;

    for (let i = 0; i < numGhosts; i++) {
      const angle = (simTime * 0.2 + i * (Math.PI / 2)) % (Math.PI * 2);
      const rad = 40 + Math.sin(simTime * 0.5 + i) * 15;
      ghosts.push({
        id: `GHOST-0${i + 1}`,
        callsign: `ECHO-${800 + i}`,
        apparentPosition: [
          Math.cos(angle) * rad,
          10 + Math.sin(simTime * 2 + i) * 4,
          Math.sin(angle) * rad
        ],
        apparentVelocity: [Math.sin(angle) * 3, 0, Math.cos(angle) * 3],
        distance: rad,
        altitude: 10 + Math.sin(simTime * 2 + i) * 4,
        azimuth: (angle * (180 / Math.PI) + 360) % 360,
        isDropout: Math.sin(simTime * 2 + i) > 0.6,
        visibleEOIR: false,
        radarConfidence: Math.floor(25 + Math.sin(simTime + i) * 20),
        isGhost: true,
        trueCategory: 'ghost'
      });
    }

    return ghosts;
  }
}

/**
 * Functional helper for processing sensor degradation on contact list
 */
export function processSensorDegradation(contacts = [], sensorState = {}, weather = 'clear', simTime = 0) {
  const mode = typeof sensorState === 'string' ? sensorState : sensorState.mode || SENSOR_STATES.NOMINAL;
  const sim = new SensorSimulation(mode, weather);
  const processed = contacts.map((c) => sim.processTrack(c, simTime));
  const ghosts = sim.generateGhostTracks(simTime);
  return [...processed, ...ghosts];
}

