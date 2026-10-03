/**
 * SkyShield Trainer - Procedural Scenario Generator
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Uses seed-based deterministic pseudo-random number generator (Mulberry32)
 * to synthesize 100% reproducible tactical scenarios.
 */

import { SeedRNG } from './seedRNG';

const CALLSIGN_PREFIXES = ['VULTURE', 'SHADOW', 'TALON', 'GARUDA', 'SPECTER', 'VIPER', 'KESTREL', 'ORION', 'HAWK', 'RAVEN'];
const SECTORS = ['NORTH-WEST CORRIDOR', 'EAST APPROACH', 'SOUTHERN RIDGE', 'SOUTH-WEST FLANK', 'HIGH PERIMETER', 'LITTORAL SEA SECTOR', 'GLACIAL CANYON AXIS'];

const THEATRE_NAMES = {
  urban: ['National Capital Region Defense', 'Metro Airspace Corridor', 'Financial Core Zone'],
  rural: ['Western Frontier Plains', 'Desert Ridge Sector', 'Border Outpost Line'],
  coastal: ['Littoral Fleet Anchorage', 'Naval Pier Defense', 'Offshore Island Station'],
  outpost: ['Himalayan Ridge Line', 'High-Altitude Pass (4,200m)', 'Glacier Lookout Post']
};

export function generateProceduralScenario(options = {}) {
  const seedString = options.seed || `SKSH-${Math.floor(100000 + Math.random() * 900000)}`;
  const rng = new SeedRNG(seedString);

  const timeOfDay = options.timeOfDay || (rng.next() > 0.5 ? 'day' : 'night');
  const weathers = ['clear', 'fog', 'rain', 'sandstorm'];
  const weather = options.weather || weathers[rng.nextInt(0, weathers.length - 1)];
  const terrain = options.terrain || (rng.next() > 0.5 ? 'urban' : 'rural');
  const threatType = options.threatType || (rng.next() > 0.3 ? 'swarm' : 'single');
  
  let swarmSize = options.swarmSize;
  if (!swarmSize) {
    swarmSize = threatType === 'single' ? 1 : rng.nextInt(3, 8);
  }

  const sensorStates = ['full', 'degraded_radar', 'degraded_eoir', 'jammed'];
  const sensorState = options.sensorState || sensorStates[rng.nextInt(0, sensorStates.length - 1)];

  // Sensor state health values
  let radarHealth = 1.0;
  let eoirHealth = 1.0;
  let jammerActive = false;

  if (sensorState === 'degraded_radar') {
    radarHealth = 0.45;
  } else if (sensorState === 'degraded_eoir') {
    eoirHealth = 0.40;
  } else if (sensorState === 'jammed') {
    radarHealth = 0.25;
    eoirHealth = 0.50;
    jammerActive = true;
  }

  const contacts = [];
  const roles = ['scout', 'decoy', 'attacker'];

  // Base spawn radius (around base at [0,0,0])
  const baseRadius = 180 + rng.nextFloat(40, 100);

  for (let i = 0; i < swarmSize; i++) {
    const angle = rng.nextFloat(0, Math.PI * 2);
    const distance = baseRadius + rng.nextFloat(-30, 70);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const altitude = rng.nextFloat(25, 75);

    // Probability of threat types: 70% hostile, 15% friendly, 15% benign
    const typeRoll = rng.next();
    let type = 'hostile';
    let role = roles[rng.nextInt(0, roles.length - 1)];
    let behavior = 'recon';
    let modelType = 'delta_wing';

    if (typeRoll > 0.85) {
      type = 'friendly';
      role = 'transit';
      behavior = 'retreat';
      modelType = rng.next() > 0.5 ? 'tactical_male' : 'tethered_sentry';
    } else if (typeRoll > 0.70) {
      type = 'benign';
      role = 'decoy';
      behavior = 'loiter';
      modelType = rng.next() > 0.5 ? 'civilian_cargo' : 'recon_quad';
    } else {
      type = 'hostile';
      behavior = rng.next() > 0.4 ? 'attack' : 'recon';
      const hostileRoll = rng.next();
      if (hostileRoll > 0.65) {
        modelType = 'delta_wing';
      } else if (hostileRoll > 0.35) {
        modelType = 'fpv_kamikaze';
      } else if (hostileRoll > 0.15) {
        modelType = 'heavy_hexacopter';
      } else {
        modelType = 'swarm_decoy';
      }
    }

    const callsign = `${CALLSIGN_PREFIXES[rng.nextInt(0, CALLSIGN_PREFIXES.length - 1)]}-${rng.nextInt(10, 99)}`;
    const spawnTime = i * rng.nextFloat(1.5, 4.0); // Staggered arrival

    // Compute velocity vector aimed generally inward towards [0, 0, 0] with slight tangent
    const speed = rng.nextFloat(12, 23);
    const toCenterDist = Math.sqrt(x * x + z * z) || 1;
    const inwardVx = (-x / toCenterDist) * speed;
    const inwardVz = (-z / toCenterDist) * speed;
    const headingDeg = Math.round(((Math.atan2(-inwardVx, -inwardVz) * 180) / Math.PI + 360) % 360);

    contacts.push({
      id: `trk-${rng.nextInt(1000, 9999)}-${i + 1}`,
      callsign,
      type,
      role,
      behavior,
      modelType,
      spawnTime: Number(spawnTime.toFixed(1)),
      position: [Number(x.toFixed(1)), Number(altitude.toFixed(1)), Number(z.toFixed(1))],
      velocity: [Number(inwardVx.toFixed(2)), 0, Number(inwardVz.toFixed(2))],
      speed: Number(speed.toFixed(1)),
      altitude: Number(altitude.toFixed(1)),
      radarCrossSection: Number(rng.nextFloat(0.008, 0.065).toFixed(3)), // m^2
      thermalSignature: Number(rng.nextFloat(0.2, 0.95).toFixed(2)),
      rfFrequency: `${(2.4 + rng.nextFloat(0.05, 3.4)).toFixed(2)} GHz`,
      headingDeg,
    });
  }

  const theatreChoices = THEATRE_NAMES[terrain] || THEATRE_NAMES.rural;
  const location = theatreChoices[rng.nextInt(0, theatreChoices.length - 1)];
  const scenarioName = `PROCEDURAL SORTIE // ${seedString}`;
  const scenarioDescription = `Procedurally synthesized counter-UAS mission in ${terrain.toUpperCase()} sector (${weather.toUpperCase()}, ${timeOfDay.toUpperCase()}). Ingress vector detected via ${SECTORS[rng.nextInt(0, SECTORS.length - 1)]}. Sensor status: ${sensorState.replace('_', ' ').toUpperCase()}.`;

  const difficultyRating = swarmSize > 8 || sensorState === 'jammed'
    ? 'Level 5 (Extreme Overmatch)'
    : swarmSize >= 6
    ? 'Level 4 (Operational Stress)'
    : swarmSize >= 4
    ? 'Level 3 (Tactical)'
    : 'Level 2 (Intermediate)';

  return {
    id: `scn-${seedString.toLowerCase()}`,
    seed: seedString,
    name: scenarioName,
    difficulty: difficultyRating,
    tag: `PROCEDURAL ${threatType.toUpperCase()} INGRESS`,
    theatre: terrain,
    location,
    description: scenarioDescription,
    tacticalObjective: `Detect, classify and engage ${swarmSize} incoming aerial contacts before breach of the inner 140m defense envelope. Avoid fratricide on friendly/benign tracks.`,
    roeRules: [
      'Verify target classification before initiating hard-kill laser/kinetic countermeasures',
      'Electronic Warfare RF Jamming authorized on confirmed hostile frequencies',
      'Neutralize contacts that penetrate 140m boundary without IFF response'
    ],
    defendedSite: {
      name: `Defended Asset // Sector ${seedString.slice(-3)}`,
      type: terrain === 'urban' ? 'urban_citadel' : 'forward_base',
      killZoneRadius: 140,
      engagementRadius: 320,
      elevation: 120,
    },
    environment: {
      timeOfDay,
      weather,
      terrain,
    },
    sensorState: {
      mode: sensorState,
      radarHealth,
      eoirHealth,
      jammerActive,
      acousticHealth: weather === 'rain' ? 0.6 : 1.0,
    },
    threatType,
    swarmSize,
    durationSeconds: 90,
    contacts,
  };
}
