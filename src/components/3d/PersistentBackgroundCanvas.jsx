import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function AmbientParticles({ count = 80 }) {
  const pointsRef = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 25 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      spd[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += speeds[i] * delta * 0.8;
      if (array[i * 3 + 1] > 22) {
        array[i * 3 + 1] = -5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#FF1A1A"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function BackgroundScene() {
  const gridRef = useRef();

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z = (gridRef.current.position.z + delta * 0.8) % 10;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <fog attach="fog" args={['#0A0A0A', 10, 50]} />
      <group ref={gridRef} position={[0, -6, 0]}>
        <gridHelper args={[100, 40, '#7A0000', '#181818']} />
      </group>
      <AmbientParticles count={70} />
    </>
  );
}

export function PersistentBackgroundCanvas({ lowGraphics = false }) {
  if (lowGraphics) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0A0A0A] tactical-grid-bg opacity-30" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-50">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  );
}

