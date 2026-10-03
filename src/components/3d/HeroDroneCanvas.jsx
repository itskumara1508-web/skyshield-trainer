import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DroneModel } from './DroneModel';

function Scene({ mousePos }) {
  const droneGroupRef = useRef();
  const sweepRef = useRef();

  useFrame((_, delta) => {
    if (droneGroupRef.current) {
      droneGroupRef.current.rotation.y += delta * 0.45;
      droneGroupRef.current.position.y = 1.6 + Math.sin(Date.now() * 0.002) * 0.25;

      const targetRotX = mousePos.y * 0.35;
      const targetRotZ = -mousePos.x * 0.35;
      droneGroupRef.current.rotation.x += (targetRotX - droneGroupRef.current.rotation.x) * 0.06;
      droneGroupRef.current.rotation.z += (targetRotZ - droneGroupRef.current.rotation.z) * 0.06;
    }

    if (sweepRef.current) {
      sweepRef.current.rotation.z -= delta * 1.5;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 9]} fov={45} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 15]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[-10, 5, -5]} intensity={2.0} color="#FF1A1A" />
      <pointLight position={[5, -2, 5]} intensity={1.0} color="#B30000" />

      {/* Wireframe Tactical Grid Floor */}
      <gridHelper args={[60, 40, '#FF1A1A', '#222222']} position={[0, -2, 0]} />

      {/* Concentric Crimson Radar Sweep Rings */}
      <group position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[3, 6, 9].map((rad) => (
          <mesh key={rad}>
            <ringGeometry args={[rad - 0.05, rad + 0.05, 64]} />
            <meshBasicMaterial color="#FF1A1A" transparent opacity={0.35} side={2} />
          </mesh>
        ))}

        {/* Sweeping Radar Wedge */}
        <group ref={sweepRef}>
          <mesh>
            <ringGeometry args={[0.2, 9, 32, 1, 0, Math.PI / 3]} />
            <meshBasicMaterial color="#FF1A1A" transparent opacity={0.25} side={2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 3]}>
            <planeGeometry args={[0.08, 9]} />
            <meshBasicMaterial color="#FF1A1A" transparent opacity={0.9} />
          </mesh>
        </group>
      </group>

      {/* Floating Rotating Drone with Parallax */}
      <group ref={droneGroupRef} position={[0, 1.6, 0]}>
        <DroneModel
          modelType="recon_quad"
          threatCategory="hostile"
          role="SCOUT"
          isSelected={true}
          scale={1.8}
        />
      </group>
    </>
  );
}

export function HeroDroneCanvas({ lowGraphics = false }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (lowGraphics || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-[#121212]/80 border border-white/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 tactical-grid-bg opacity-30" />
        <div className="w-48 h-48 rounded-full border border-[#FF1A1A]/40 flex items-center justify-center relative animate-pulse-slow">
          <div className="absolute inset-0 rounded-full border border-dashed border-[#FF1A1A]/30 animate-radar-sweep" />
          <div className="w-24 h-24 rounded-full bg-[#B30000]/15 flex items-center justify-center">
            <span className="font-mono text-xs text-[#FF1A1A] font-bold uppercase tracking-widest">DRONE MODEL 3D</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[420px] relative">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        onError={() => setHasError(true)}
      >
        <Scene mousePos={mousePos} />
      </Canvas>
    </div>
  );
}

