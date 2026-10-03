/**
 * SkyShield Trainer - Interactive 3D Boids Swarm Demo Canvas
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Demonstrates real-time decentralized flocking physics with military
 * tactical roles (Scouts, Decoys, Attackers) and trail effects.
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { updateBoidsFlock } from '../../engine/boidsSwarm';

// Single Drone Geometry in Swarm
function SwarmBoid({ role, position, velocity }) {
  const meshRef = useRef();

  const color =
    role === 'scout'
      ? '#38BDF8'
      : role === 'decoy'
      ? '#F59E0B'
      : '#FF1A1A';

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Orient towards velocity
      if (velocity && (velocity[0] !== 0 || velocity[2] !== 0)) {
        const angle = Math.atan2(velocity[0], velocity[2]);
        meshRef.current.rotation.y = angle;
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Central Drone Fuselage */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.4, 1.8]} />
        <meshStandardMaterial
          color="#161616"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Cross Rotor Arms */}
      <mesh>
        <boxGeometry args={[3.2, 0.1, 0.25]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh>
        <boxGeometry args={[0.25, 0.1, 3.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Role Indicator LED Dome */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Point Light on Lead Attackers */}
      {role === 'attacker' && (
        <pointLight color="#FF1A1A" intensity={1.5} distance={12} />
      )}
    </group>
  );
}

// Boids Simulation Loop within Canvas
function SwarmScene({ lowGraphics = false }) {
  // Initialize 10 swarm agents
  const boidsState = useRef(
    Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const r = 25 + (i % 3) * 8;
      const role = i < 3 ? 'scout' : i < 6 ? 'decoy' : 'attacker';
      return {
        id: `demo-drone-${i}`,
        position: [Math.cos(angle) * r, 12 + (i % 4) * 4, Math.sin(angle) * r],
        velocity: [-Math.sin(angle) * 10, 0, Math.cos(angle) * 10],
        role,
        speed: 12 + (i % 3) * 2,
      };
    })
  );

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    // Orbit target point around origin
    const time = Date.now() * 0.0006;
    const targetPoint = [Math.sin(time) * 15, 14, Math.cos(time) * 15];

    boidsState.current = updateBoidsFlock(boidsState.current, targetPoint, dt);
    forceUpdate();
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[30, 50, 30]} intensity={0.9} color="#ffffff" />
      <pointLight position={[0, 10, 0]} intensity={2.0} color="#FF1A1A" distance={80} />

      {/* Defense Center Target Cylinder */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[4, 4.5, 1, 32]} />
        <meshStandardMaterial color="#161616" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4.0, 32]} />
        <meshBasicMaterial color="#FF1A1A" />
      </mesh>

      {/* Grid Floor */}
      <gridHelper args={[80, 20, '#FF1A1A', '#262626']} position={[0, 0, 0]} />

      {/* Render Boid Drones */}
      {boidsState.current.map((boid) => (
        <SwarmBoid
          key={boid.id}
          role={boid.role}
          position={boid.position}
          velocity={boid.velocity}
        />
      ))}

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.8}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={20}
        maxDistance={120}
      />
    </>
  );
}

export function SwarmDemoCanvas({ lowGraphics = false }) {
  return (
    <div className="relative w-full h-[380px] rounded-xl overflow-hidden border border-white/15 bg-[#070707] shadow-2xl">
      <Canvas
        camera={{ position: [0, 38, 55], fov: 45 }}
        gl={{ antialias: !lowGraphics, powerPreference: 'high-performance' }}
      >
        <SwarmScene lowGraphics={lowGraphics} />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[11px] bg-[#0A0A0A]/85 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-laser animate-pulse" />
        <span className="text-gray-400">BOIDS ENGINE:</span>
        <span className="text-white font-bold">10 DRONES ACTIVE</span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none font-mono text-[10px] text-gray-500">
        DRAG TO ORBIT • SCROLL TO ZOOM
      </div>
    </div>
  );
}

export default SwarmDemoCanvas;

