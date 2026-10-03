/**
 * SkyShield Trainer - 3D AAR Mission Replay Viewer Canvas
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Renders reconstructed 3D drone flight paths, historical trajectories,
 * and interception coordinates driven by the timeline scrubber.
 */

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DroneModel } from './DroneModel';
import { DefendedBaseModel } from './DefendedBaseModel';
import { TacticalTerrain } from './TacticalTerrain';

// Helper to interpolate position along waypoint sequence
function getInterpolatedPosition(points, time) {
  if (!points || points.length === 0) return [0, 20, 0];
  if (time <= points[0].time) return points[0].position;
  if (time >= points[points.length - 1].time) return points[points.length - 1].position;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (time >= p1.time && time <= p2.time) {
      const alpha = (time - p1.time) / (p2.time - p1.time || 1);
      return [
        p1.position[0] + (p2.position[0] - p1.position[0]) * alpha,
        p1.position[1] + (p2.position[1] - p1.position[1]) * alpha,
        p1.position[2] + (p2.position[2] - p1.position[2]) * alpha,
      ];
    }
  }
  return points[points.length - 1].position;
}

// Single Replay Drone with glowing trail
function ReplayDrone({ drone, currentTime }) {
  const points = drone.points || [];
  const currentPos = useMemo(() => getInterpolatedPosition(points, currentTime), [points, currentTime]);

  const color = drone.type === 'hostile' ? '#FF1A1A' : drone.type === 'friendly' ? '#22C55E' : '#38BDF8';

  // Build trail points up to currentTime
  const trailPoints = useMemo(() => {
    if (points.length === 0) return [[0, 0, 0], [0, 0, 0]];
    const pts = [];
    for (let i = 0; i < points.length; i++) {
      if (points[i].time <= currentTime) {
        pts.push(new THREE.Vector3(...points[i].position));
      } else {
        break;
      }
    }
    pts.push(new THREE.Vector3(...currentPos));
    if (pts.length < 2) {
      pts.unshift(new THREE.Vector3(...points[0].position));
    }
    return pts;
  }, [points, currentTime, currentPos]);

  return (
    <group>
      {/* Flight Trail */}
      {trailPoints.length >= 2 && (
        <Line
          points={trailPoints}
          color={color}
          lineWidth={2.5}
          dashed={drone.type === 'benign'}
          transparent
          opacity={0.85}
        />
      )}

      {/* Drone Mesh */}
      <group position={currentPos}>
        <DroneModel
          type={drone.type}
          role={drone.role || 'attacker'}
          isTargetLocked={false}
          threatLevel={drone.type === 'hostile' ? 'critical' : 'none'}
        />

        {/* 3D Floating HUD Tag */}
        <Billboard position={[0, 6, 0]}>
          <Text
            fontSize={3}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.3}
            outlineColor="#000000"
          >
            {`${drone.callsign || 'UAV'} [${drone.type.toUpperCase()}]`}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

function ReplayScene({ flightData = [], currentTime = 0, terrain = 'urban', lowGraphics = false }) {
  return (
    <>
      <color attach="background" args={['#070707']} />
      <fog attach="fog" args={['#070707', 150, 450]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[100, 150, 50]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 30, 0]} intensity={1.5} color="#FF1A1A" distance={150} />

      {/* Defended Base Center */}
      <DefendedBaseModel position={[0, 0, 0]} health={100} />

      {/* Terrain Floor */}
      <TacticalTerrain
        terrainType={terrain}
        timeOfDay="night"
        weather="clear"
        lowGraphics={lowGraphics}
      />

      {/* Tactical Radar Rings */}
      <group position={[0, 0.5, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[99, 100, 64]} />
          <meshBasicMaterial color="#FF1A1A" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[199, 200, 64]} />
          <meshBasicMaterial color="#FF1A1A" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Replay Drones */}
      {flightData.map((drone, idx) => (
        <ReplayDrone key={drone.droneId || idx} drone={drone} currentTime={currentTime} />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={30}
        maxDistance={400}
      />
    </>
  );
}

export function ReplayViewerCanvas({
  flightData = [],
  currentTime = 0,
  terrain = 'urban',
  lowGraphics = false,
}) {
  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-white/15 bg-[#070707] shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 110, 220], fov: 48 }}
        gl={{ antialias: !lowGraphics, powerPreference: 'high-performance' }}
      >
        <ReplayScene
          flightData={flightData}
          currentTime={currentTime}
          terrain={terrain}
          lowGraphics={lowGraphics}
        />
      </Canvas>

      {/* Tactical Replay Overlay */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-[#0A0A0A]/85 border border-white/10 backdrop-blur font-mono text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-laser animate-ping" />
          <span className="text-gray-400">TELEMETRY PLAYBACK:</span>
          <span className="text-white font-bold">T+{currentTime.toFixed(1)}s</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0A0A]/85 border border-laser/40 text-laser">
          <span className="w-2 h-2 rounded-full bg-laser" />
          <span>HOSTILE PATH</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0A0A]/85 border border-emerald-500/40 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>FRIENDLY</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0A0A]/85 border border-sky-500/40 text-sky-400">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>BENIGN</span>
        </div>
      </div>

      <div className="absolute bottom-2 left-3 pointer-events-none font-mono text-[10px] text-gray-500">
        3D KINEMATIC REPLAY // DSSC TACTICAL TELEMETRY DEBRIEF
      </div>
    </div>
  );
}

export default ReplayViewerCanvas;

