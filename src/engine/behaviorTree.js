export const BEHAVIOR_STATES = {
  RECON: 'RECON',
  LOITER: 'LOITER',
  ATTACK_RUN: 'ATTACK_RUN',
  RETREAT: 'RETREAT',
  NEUTRALIZED: 'NEUTRALIZED'
};

export class DroneBehaviorTree {
  constructor(config = {}) {
    this.initialState = config.initialState || BEHAVIOR_STATES.RECON;
    this.state = this.initialState;
    this.target = config.target || [0, 0, 0];
    this.loiterRadius = config.loiterRadius || 45;
    this.loiterAltitude = config.loiterAltitude || 18;
    this.loiterAngle = config.initialAngle || Math.random() * Math.PI * 2;
    this.loiterSpeed = config.loiterSpeed || 0.4;
    this.attackSpeed = config.attackSpeed || 14;
    this.cruiseSpeed = config.cruiseSpeed || 7;
    this.retreatSpeed = config.retreatSpeed || 18;
    this.attackTriggerTime = config.attackTriggerTime || 25;
    this.isHostile = config.isHostile !== undefined ? config.isHostile : true;
    this.isBenign = config.isBenign || false;
    this.isFriendly = config.isFriendly || false;
    this.elapsed = 0;
    this.jammedLevel = 0;
  }

  tick(drone, delta, simTime) {
    this.elapsed += delta;

    if (this.state === BEHAVIOR_STATES.NEUTRALIZED) {
      if (drone.position[1] > 0.2) {
        drone.position[1] = Math.max(0, drone.position[1] - delta * 12);
        drone.rotation[0] += delta * 4;
        drone.rotation[2] += delta * 3;
      }
      return this.state;
    }

    if (this.jammedLevel > 0.6) {
      if (this.state !== BEHAVIOR_STATES.RETREAT) {
        this.state = BEHAVIOR_STATES.RETREAT;
      }
    }

    const distToBase = Math.hypot(drone.position[0], drone.position[2]);

    switch (this.state) {
      case BEHAVIOR_STATES.RECON: {
        const targetRadius = this.loiterRadius + 15;
        const dirX = -drone.position[0];
        const dirZ = -drone.position[2];
        const dirLen = Math.hypot(dirX, dirZ) || 1;

        if (distToBase > targetRadius) {
          drone.position[0] += (dirX / dirLen) * this.cruiseSpeed * delta;
          drone.position[2] += (dirZ / dirLen) * this.cruiseSpeed * delta;
          drone.position[1] += (this.loiterAltitude - drone.position[1]) * 0.5 * delta;
        } else {
          this.state = BEHAVIOR_STATES.LOITER;
          this.loiterAngle = Math.atan2(drone.position[2], drone.position[0]);
        }
        break;
      }

      case BEHAVIOR_STATES.LOITER: {
        this.loiterAngle += (this.loiterSpeed / (this.loiterRadius * 0.1)) * delta;
        const targetX = Math.cos(this.loiterAngle) * this.loiterRadius;
        const targetZ = Math.sin(this.loiterAngle) * this.loiterRadius;

        drone.position[0] += (targetX - drone.position[0]) * 1.5 * delta;
        drone.position[2] += (targetZ - drone.position[2]) * 1.5 * delta;
        drone.position[1] += (this.loiterAltitude - drone.position[1]) * delta;

        if (this.isHostile && this.elapsed >= this.attackTriggerTime) {
          this.state = BEHAVIOR_STATES.ATTACK_RUN;
        }
        break;
      }

      case BEHAVIOR_STATES.ATTACK_RUN: {
        const targetX = this.target[0];
        const targetY = 1.0;
        const targetZ = this.target[2];

        const dx = targetX - drone.position[0];
        const dy = targetY - drone.position[1];
        const dz = targetZ - drone.position[2];
        const len = Math.hypot(dx, dy, dz) || 1;

        drone.position[0] += (dx / len) * this.attackSpeed * delta;
        drone.position[1] += (dy / len) * this.attackSpeed * delta;
        drone.position[2] += (dz / len) * this.attackSpeed * delta;

        drone.rotation[1] = Math.atan2(dx, dz);
        drone.rotation[0] = Math.atan2(-dy, Math.hypot(dx, dz));
        break;
      }

      case BEHAVIOR_STATES.RETREAT: {
        const dirX = drone.position[0] || 1;
        const dirZ = drone.position[2] || 0.5;
        const len = Math.hypot(dirX, dirZ) || 1;

        drone.position[0] += (dirX / len) * this.retreatSpeed * delta;
        drone.position[2] += (dirZ / len) * this.retreatSpeed * delta;
        drone.position[1] += 4 * delta;
        drone.rotation[1] = Math.atan2(dirX, dirZ);
        break;
      }
    }

    return this.state;
  }
}

/**
 * Functional helper for individual drone behavior updates
 */
export function updateDroneBehavior(contact, target = [0, 0, 0], delta = 0.05) {
  if (!contact) return contact;
  const pos = [...(contact.position || [0, 20, 0])];
  const rot = [0, 0, 0];
  const dummyDrone = { position: pos, rotation: rot };

  const tree = new DroneBehaviorTree({
    initialState: contact.behavior?.toUpperCase() || BEHAVIOR_STATES.RECON,
    target,
    isHostile: contact.type === 'hostile',
    isBenign: contact.type === 'benign',
    isFriendly: contact.type === 'friendly',
  });

  tree.tick(dummyDrone, delta, 0);

  const dx = dummyDrone.position[0] - contact.position[0];
  const dz = dummyDrone.position[2] - contact.position[2];

  return {
    ...contact,
    position: dummyDrone.position,
    currentPosition: dummyDrone.position,
    velocity: [dx / (delta || 0.05), 0, dz / (delta || 0.05)],
  };
}

