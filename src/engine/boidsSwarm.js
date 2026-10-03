export const SWARM_ROLES = {
  SCOUT: 'SCOUT',
  DECOY: 'DECOY',
  ATTACKER: 'ATTACKER'
};

export class BoidSwarmManager {
  constructor(boids = []) {
    this.boids = boids;
    this.maxSpeed = 16;
    this.minSpeed = 5;
    this.maxForce = 12;
    this.separationDist = 6;
    this.neighborDist = 18;
    this.attackTriggerTime = 20;
    this.elapsed = 0;
  }

  update(delta, simTime) {
    this.elapsed += delta;
    const forces = [];

    for (let i = 0; i < this.boids.length; i++) {
      const boid = this.boids[i];
      if (boid.neutralized) {
        forces.push([0, 0, 0]);
        continue;
      }

      let sep = [0, 0, 0];
      let ali = [0, 0, 0];
      let coh = [0, 0, 0];
      let sepCount = 0;
      let neighborCount = 0;

      for (let j = 0; j < this.boids.length; j++) {
        if (i === j) continue;
        const other = this.boids[j];
        if (other.neutralized) continue;

        const dx = boid.position[0] - other.position[0];
        const dy = boid.position[1] - other.position[1];
        const dz = boid.position[2] - other.position[2];
        const d = Math.hypot(dx, dy, dz);

        if (d > 0 && d < this.separationDist) {
          sep[0] += (dx / d) / d;
          sep[1] += (dy / d) / d;
          sep[2] += (dz / d) / d;
          sepCount++;
        }

        if (d > 0 && d < this.neighborDist) {
          ali[0] += other.velocity[0];
          ali[1] += other.velocity[1];
          ali[2] += other.velocity[2];

          coh[0] += other.position[0];
          coh[1] += other.position[1];
          coh[2] += other.position[2];
          neighborCount++;
        }
      }

      if (sepCount > 0) {
        sep[0] /= sepCount;
        sep[1] /= sepCount;
        sep[2] /= sepCount;
      }

      if (neighborCount > 0) {
        ali[0] /= neighborCount;
        ali[1] /= neighborCount;
        ali[2] /= neighborCount;

        coh[0] = (coh[0] / neighborCount) - boid.position[0];
        coh[1] = (coh[1] / neighborCount) - boid.position[1];
        coh[2] = (coh[2] / neighborCount) - boid.position[2];
      }

      let goalForce = [0, 0, 0];
      if (boid.role === SWARM_ROLES.SCOUT) {
        const scoutTargetAngle = simTime * 0.8 + (i * 1.5);
        const scoutTargetRadius = 38;
        const targetX = Math.cos(scoutTargetAngle) * scoutTargetRadius;
        const targetZ = Math.sin(scoutTargetAngle) * scoutTargetRadius;
        const targetY = 22 + Math.sin(simTime * 2 + i) * 3;

        goalForce[0] = (targetX - boid.position[0]) * 0.4;
        goalForce[1] = (targetY - boid.position[1]) * 0.4;
        goalForce[2] = (targetZ - boid.position[2]) * 0.4;
      } else if (boid.role === SWARM_ROLES.DECOY) {
        const weaveAngle = simTime * 1.2 + (i * 2.2);
        const decoyRadius = 45 + Math.sin(simTime * 3) * 12;
        const targetX = Math.cos(weaveAngle) * decoyRadius;
        const targetZ = Math.sin(weaveAngle) * decoyRadius;
        const targetY = 16 + Math.cos(simTime * 4 + i) * 6;

        goalForce[0] = (targetX - boid.position[0]) * 0.35;
        goalForce[1] = (targetY - boid.position[1]) * 0.35;
        goalForce[2] = (targetZ - boid.position[2]) * 0.35;
      } else {
        if (this.elapsed < this.attackTriggerTime) {
          const angle = (i * 0.5) + (simTime * 0.3);
          const radius = 55;
          const targetX = Math.cos(angle) * radius;
          const targetZ = Math.sin(angle) * radius;
          const targetY = 24;

          goalForce[0] = (targetX - boid.position[0]) * 0.3;
          goalForce[1] = (targetY - boid.position[1]) * 0.3;
          goalForce[2] = (targetZ - boid.position[2]) * 0.3;
        } else {
          const dirX = -boid.position[0];
          const dirY = 1.0 - boid.position[1];
          const dirZ = -boid.position[2];
          const len = Math.hypot(dirX, dirY, dirZ) || 1;

          goalForce[0] = (dirX / len) * 18;
          goalForce[1] = (dirY / len) * 18;
          goalForce[2] = (dirZ / len) * 18;
        }
      }

      if (boid.jammedLevel > 0.5) {
        goalForce[0] = boid.position[0] * 0.8;
        goalForce[1] = 6;
        goalForce[2] = boid.position[2] * 0.8;
      }

      const totalForce = [
        sep[0] * 3.5 + ali[0] * 1.0 + coh[0] * 0.8 + goalForce[0],
        sep[1] * 2.0 + ali[1] * 0.8 + coh[1] * 0.5 + goalForce[1],
        sep[2] * 3.5 + ali[2] * 1.0 + coh[2] * 0.8 + goalForce[2],
      ];

      forces.push(totalForce);
    }

    for (let i = 0; i < this.boids.length; i++) {
      const boid = this.boids[i];
      if (boid.neutralized) {
        if (boid.position[1] > 0.2) {
          boid.position[1] = Math.max(0, boid.position[1] - delta * 14);
          boid.rotation[0] += delta * 5;
        }
        continue;
      }

      const force = forces[i];
      boid.velocity[0] += force[0] * delta;
      boid.velocity[1] += force[1] * delta;
      boid.velocity[2] += force[2] * delta;

      const speed = Math.hypot(boid.velocity[0], boid.velocity[1], boid.velocity[2]);
      const maxSpd = boid.role === SWARM_ROLES.ATTACKER && this.elapsed >= this.attackTriggerTime ? 18 : this.maxSpeed;
      if (speed > maxSpd) {
        boid.velocity[0] = (boid.velocity[0] / speed) * maxSpd;
        boid.velocity[1] = (boid.velocity[1] / speed) * maxSpd;
        boid.velocity[2] = (boid.velocity[2] / speed) * maxSpd;
      } else if (speed < this.minSpeed && speed > 0.001) {
        boid.velocity[0] = (boid.velocity[0] / speed) * this.minSpeed;
        boid.velocity[1] = (boid.velocity[1] / speed) * this.minSpeed;
        boid.velocity[2] = (boid.velocity[2] / speed) * this.minSpeed;
      }

      boid.position[0] += boid.velocity[0] * delta;
      boid.position[1] = Math.max(2, boid.position[1] + boid.velocity[1] * delta);
      boid.position[2] += boid.velocity[2] * delta;

      boid.rotation[1] = Math.atan2(boid.velocity[0], boid.velocity[2]);
      boid.rotation[0] = Math.atan2(-boid.velocity[1], Math.hypot(boid.velocity[0], boid.velocity[2]));
    }
  }
}

/**
 * Functional update helper for real-time flocking
 */
export function updateBoidsFlock(boids = [], target = [0, 0, 0], delta = 0.05) {
  if (!boids || boids.length === 0) return [];
  const boidObjects = boids.map((b) => ({
    id: b.id,
    role: b.role?.toUpperCase() || SWARM_ROLES.ATTACKER,
    position: [...(b.position || [0, 0, 0])],
    velocity: [...(b.velocity || [1, 0, 1])],
    rotation: [0, 0, 0],
    neutralized: !!b.neutralized,
    jammedLevel: b.jammedLevel || 0,
  }));

  const manager = new BoidSwarmManager(boidObjects);
  manager.update(delta, 0);

  return manager.boids.map((b) => ({
    ...b,
    position: b.position,
    velocity: b.velocity,
  }));
}

