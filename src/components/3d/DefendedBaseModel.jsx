import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function DefendedBaseModel({ targetPosition = null, isJamming = false, isEngaging = false }) {
  const radarDishRef = useRef();
  const turretRef = useRef();
  const pulseRingRef = useRef();

  useFrame((_, delta) => {
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += delta * 1.8;
    }

    if (turretRef.current && targetPosition) {
      const angle = Math.atan2(targetPosition[0], targetPosition[2]);
      turretRef.current.rotation.y += (angle - turretRef.current.rotation.y) * 0.1;
    }

    if (pulseRingRef.current && isJamming) {
      pulseRingRef.current.scale.x += delta * 4;
      pulseRingRef.current.scale.y += delta * 4;
      if (pulseRingRef.current.scale.x > 8) {
        pulseRingRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base Perimeter Security Foundation */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[14, 15, 0.5, 32]} />
        <meshStandardMaterial color="#121212" roughness={0.9} />
      </mesh>

      {/* Outer Tactical Perimeter Ring */}
      <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.8, 14.2, 48]} />
        <meshBasicMaterial color="#FF1A1A" side={2} />
      </mesh>

      {/* Central Command Bunker Hub */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[5, 6, 1.8, 8]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Geodesic Radar Dome */}
      <mesh position={[-3, 2.4, -2]}>
        <sphereGeometry args={[1.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#DCDCDC" roughness={0.5} wireframe={false} />
      </mesh>

      {/* Early Warning Radar Tower */}
      <group position={[3.2, 2.0, -2.5]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <group ref={radarDishRef} position={[0, 3.1, 0]}>
          <mesh rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[1.3, 0.4, 0.3, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#FF1A1A" wireframe side={2} />
          </mesh>
        </group>
      </group>

      {/* Counter-UAS Laser / Turret */}
      <group ref={turretRef} position={[0, 2.3, 2.5]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.4, 0.6, 1.4]} />
          <meshStandardMaterial color="#7A0000" metalness={0.7} />
        </mesh>
        <mesh position={[0.35, 0.7, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.9} />
        </mesh>
        <mesh position={[-0.35, 0.7, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.9} />
        </mesh>
      </group>

      {/* High-Power EW Jammer Mast */}
      <group position={[0, 2.0, -3.5]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.08, 0.2, 4, 8]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[0, 4.1, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#FF1A1A" emissive="#FF1A1A" emissiveIntensity={isJamming ? 3.0 : 0.8} />
        </mesh>
        {isJamming && (
          <mesh ref={pulseRingRef} position={[0, 4.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.0, 32]} />
            <meshBasicMaterial color="#FF1A1A" transparent opacity={0.7} side={2} />
          </mesh>
        )}
      </group>

      {/* Saffron-White-Green Tricolor Banner */}
      <group position={[0, 1.3, 5.05]}>
        <mesh position={[0, 0.2, 0]}>
          <planeGeometry args={[2.5, 0.12]} />
          <meshBasicMaterial color="#FF9933" />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <planeGeometry args={[2.5, 0.12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <planeGeometry args={[2.5, 0.12]} />
          <meshBasicMaterial color="#138808" />
        </mesh>
      </group>

      {/* Inner Red Defense Zone Warning Ring */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[20, 20.3, 48]} />
        <meshBasicMaterial color="#FF1A1A" transparent opacity={0.5} side={2} />
      </mesh>
    </group>
  );
}

