import React, { useMemo } from 'react';

export function TacticalTerrain({ terrain = 'urban', weather = 'clear' }) {
  const urbanBuildings = useMemo(() => {
    if (terrain !== 'urban') return [];
    const buildings = [];
    for (let x = -80; x <= 80; x += 18) {
      for (let z = -80; z <= 80; z += 18) {
        if (Math.hypot(x, z) < 22) continue;
        const h = 4 + Math.abs(Math.sin(x * 12.9898 + z * 78.233)) * 14;
        const w = 7 + (Math.cos(x + z) * 2);
        const d = 7 + (Math.sin(x - z) * 2);
        buildings.push({ x, z, h, w, d });
      }
    }
    return buildings;
  }, [terrain]);

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Tactical Ground Grid */}
      <gridHelper
        args={[200, 50, '#FF1A1A', '#222222']}
        position={[0, 0.01, 0]}
      />

      {/* Ground Substrate Plane */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial
          color={terrain === 'coastal' ? '#060B12' : '#0A0A0A'}
          roughness={0.95}
        />
      </mesh>

      {/* Distance Rings (25m, 50m, 75m, 100m) in Red Laser */}
      {[25, 50, 75, 100].map((radius) => (
        <mesh key={radius} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.15, radius + 0.15, 64]} />
          <meshBasicMaterial
            color="#FF1A1A"
            transparent
            opacity={radius === 50 ? 0.35 : 0.15}
            side={2}
          />
        </mesh>
      ))}

      {/* Urban Terrain: Low-Poly City Blocks in Carbon Dark */}
      {terrain === 'urban' && (
        <group>
          {urbanBuildings.map((b, i) => (
            <group key={i} position={[b.x, b.h / 2, b.z]}>
              <mesh>
                <boxGeometry args={[b.w, b.h, b.d]} />
                <meshStandardMaterial
                  color="#141414"
                  metalness={0.3}
                  roughness={0.8}
                />
              </mesh>
              {/* Roof wireframe accent */}
              <mesh position={[0, b.h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[b.w, b.d]} />
                <meshBasicMaterial color="rgba(255, 26, 26, 0.2)" wireframe />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Coastal Terrain: Sea Surface */}
      {terrain === 'coastal' && (
        <group position={[70, 0.1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[90, 240]} />
            <meshStandardMaterial
              color="#0A1828"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

