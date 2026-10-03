import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DroneModel } from './DroneModel';
import { DefendedBaseModel } from './DefendedBaseModel';
import { TacticalTerrain } from './TacticalTerrain';

function LaserBeam({ start = [0, 2.5, 0], end }) {
  if (!end) return null;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const len = Math.hypot(dx, dy, dz);
  const mid = [start[0] + dx / 2, start[1] + dy / 2, start[2] + dz / 2];

  return (
    <group position={mid}>
      <mesh
        rotation={[
          Math.atan2(Math.hypot(dx, dz), dy) - Math.PI / 2,
          Math.atan2(dx, dz),
          0
        ]}
      >
        <cylinderGeometry args={[0.08, 0.08, len, 8]} />
        <meshBasicMaterial color="#FF1A1A" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function ExplosionEffect({ position }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.x += delta * 12;
      meshRef.current.scale.y += delta * 12;
      meshRef.current.scale.z += delta * 12;
      meshRef.current.material.opacity -= delta * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#FF1A1A" transparent opacity={0.9} wireframe />
    </mesh>
  );
}

function RFJammingShockwave({ isJamming }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current && isJamming) {
      const t = clock.getElapsedTime() * 3.5;
      const phase = (t % 2) / 2;
      const scale = 2 + phase * 45;
      meshRef.current.scale.set(scale, scale * 0.4, scale);
      meshRef.current.material.opacity = Math.max(0, 0.75 * (1 - phase));
    }
  });

  if (!isJamming) return null;

  return (
    <mesh ref={meshRef} position={[0, 4, 0]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshBasicMaterial color="#FF9933" transparent opacity={0.7} wireframe />
    </mesh>
  );
}

function TacticalScene({

  drones = [],
  selectedContactId = null,
  onSelectContact = () => {},
  isNight = false,
  terrain = 'urban',
  weather = 'clear',
  isJamming = false,
  isEngaging = false,
  activeTargetPos = null,
  neutralizedDrones = []
}) {
  const controlsRef = useRef();

  const sunIntensity = isNight ? 0.2 : 1.2;

  return (
    <>
      <PerspectiveCamera makeDefault position={[-55, 38, 55]} fov={45} />
      <OrbitControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={10}
        maxDistance={180}
        dampingFactor={0.08}
        enableDamping
      />

      <fog
        attach="fog"
        args={[
          '#0A0A0A',
          weather === 'fog' ? 25 : weather === 'sandstorm' ? 35 : 55,
          weather === 'fog' ? 120 : weather === 'sandstorm' ? 140 : 220
        ]}
      />

      <ambientLight intensity={isNight ? 0.35 : 0.65} />
      <directionalLight
        position={[40, 70, 40]}
        intensity={sunIntensity}
        color={isNight ? '#FF4444' : '#FFFFFF'}
        castShadow
      />
      <pointLight position={[0, 15, 0]} intensity={isNight ? 2.0 : 1.2} color="#FF1A1A" />

      <TacticalTerrain terrain={terrain} weather={weather} />

      <DefendedBaseModel
        targetPosition={activeTargetPos}
        isJamming={isJamming}
        isEngaging={isEngaging}
      />

      <RFJammingShockwave isJamming={isJamming} />

      {isEngaging && activeTargetPos && (
        <LaserBeam start={[0, 2.5, 2.5]} end={activeTargetPos} />
      )}


      {neutralizedDrones.map(d => (
        <ExplosionEffect key={d.id} position={d.position} />
      ))}

      {drones.map(drone => {
        if (drone.isDropout) return null;

        const isSelected = drone.id === selectedContactId;
        const pos = drone.apparentPosition || drone.position || [0, 0, 0];

        return (
          <group
            key={drone.id}
            position={[pos[0], pos[1], pos[2]]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectContact(drone.id);
            }}
          >
            <DroneModel
              modelType={drone.modelType || 'recon_quad'}
              threatCategory={drone.userCategory || 'unknown'}
              role={drone.role}
              isSelected={isSelected}
              isNeutralized={drone.neutralized}
              jammedLevel={drone.jammedLevel || 0}
              scale={1.2}
            />

            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, 0, -pos[1], 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={isSelected ? '#FF1A1A' : '#333333'}
                transparent
                opacity={0.6}
              />
            </line>
          </group>
        );
      })}
    </>
  );
}

export function TacticalSimulatorCanvas({
  drones = [],
  selectedContactId = null,
  onSelectContact = () => {},
  isNight = false,
  terrain = 'urban',
  weather = 'clear',
  isJamming = false,
  isEngaging = false,
  activeTargetPos = null,
  neutralizedDrones = [],
  lowGraphics = false
}) {
  if (lowGraphics) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
        <div className="text-[#FF1A1A] font-mono text-lg font-bold mb-2">2D TACTICAL RADAR FALLBACK ACTIVE</div>
        <p className="text-gray-400 text-sm max-w-md">
          Low graphics mode enabled. Contacts are tracked on the 2D Tactical Display and Track List below.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-crosshair bg-[#050505]">
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => onSelectContact(null)}
      >
        <TacticalScene
          drones={drones}
          selectedContactId={selectedContactId}
          onSelectContact={onSelectContact}
          isNight={isNight}
          terrain={terrain}
          weather={weather}
          isJamming={isJamming}
          isEngaging={isEngaging}
          activeTargetPos={activeTargetPos}
          neutralizedDrones={neutralizedDrones}
        />
      </Canvas>
    </div>
  );
}

