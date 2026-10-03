import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * SkyShield Trainer - Procedural 3D Drone Airframe Generator
 * Supports 8 distinct military & commercial UAS platforms:
 * 1. delta_wing / fixed_wing_loiter (Shahed kamikaze archetype)
 * 2. recon_quad (DJI Matrice / commercial quad archetype)
 * 3. fpv_racer (high-speed suicide micro-drone)
 * 4. heavy_hexacopter (6-rotor heavy munition bomber)
 * 5. fixed_wing_recon (long-endurance surveillance UAV)
 * 6. tethered_sentry (continuous high-altitude perimeter mast)
 * 7. civilian_cargo (non-combatant logistics courier)
 * 8. swarm_decoy (micro boids radar reflector drone)
 */
export function DroneModel({
  modelType = 'recon_quad',
  threatCategory = 'hostile',
  role = 'ATTACKER',
  isSelected = false,
  isNeutralized = false,
  isThermal = false,
  isWireframe = false,
  jammedLevel = 0,
  scale = 1.0,
  ...props
}) {
  const groupRef = useRef();
  const rotorRefs = useRef([]);

  const colorMap = {
    hostile: '#FF1A1A',
    unknown: '#F59E0B',
    friendly: '#22C55E',
    benign: '#38BDF8',
    ghost: '#888888',
  };

  const threatColor = colorMap[threatCategory] || '#FF1A1A';
  const bodyColor = isThermal
    ? '#4A0E0E'
    : threatCategory === 'friendly'
    ? '#181818'
    : threatCategory === 'benign'
    ? '#1A2A38'
    : '#0F0F0F';

  const accentColor = isThermal ? '#FF3300' : threatColor;
  const engineHeatColor = isThermal ? '#FFAA00' : '#333333';

  useFrame((_, delta) => {
    if (!isNeutralized) {
      const rotorSpeed = 28 * (1 - jammedLevel * 0.6);
      rotorRefs.current.forEach((rotor, idx) => {
        if (rotor) {
          rotor.rotation.y += delta * rotorSpeed * (idx % 2 === 0 ? 1 : -1);
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} {...props}>
      {/* Tactical Selection Ring */}
      {isSelected && (
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.95, 32]} />
          <meshBasicMaterial color="#FF1A1A" transparent opacity={0.85} side={2} wireframe={isWireframe} />
        </mesh>
      )}

      {/* Role / Elevation Indicator Marker */}
      <mesh position={[0, 1.0, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color={accentColor} wireframe={isWireframe} />
      </mesh>

      {/* ============================================================== */}
      {/* 1. DELTA-WING LOITERING MUNITION (Shahed / Harpy Archetype) */}
      {/* ============================================================== */}
      {(modelType === 'delta_wing' || modelType === 'fixed_wing_loiter') && (
        <group>
          {/* Main Fuselage */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.32, 2.2, 8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.8} wireframe={isWireframe} />
          </mesh>
          {/* Warhead Nose Cone */}
          <mesh position={[0, 0, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 0.45, 12]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isThermal ? 0.9 : 0.4}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Large Swept Delta Wings */}
          <mesh position={[0, 0.02, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.85]} />
            <meshStandardMaterial color={bodyColor} side={2} metalness={0.7} wireframe={isWireframe} />
          </mesh>
          {/* Winglet End Plates */}
          <mesh position={[1.55, 0.3, 0.1]}>
            <boxGeometry args={[0.04, 0.55, 0.45]} />
            <meshStandardMaterial color={accentColor} wireframe={isWireframe} />
          </mesh>
          <mesh position={[-1.55, 0.3, 0.1]}>
            <boxGeometry args={[0.04, 0.55, 0.45]} />
            <meshStandardMaterial color={accentColor} wireframe={isWireframe} />
          </mesh>
          {/* Rear Gas Engine & Heat Exhaust */}
          <mesh position={[0, 0.05, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
            <meshStandardMaterial
              color={engineHeatColor}
              emissive={isThermal ? '#FF2200' : '#000000'}
              emissiveIntensity={isThermal ? 1.5 : 0}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Rear Pusher Propeller */}
          <group ref={(el) => (rotorRefs.current[0] = el)} position={[0, 0.05, -1.22]}>
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.85, 0.06, 0.02]} />
              <meshBasicMaterial color={isThermal ? '#FFAA00' : '#CBD5E1'} wireframe={isWireframe} />
            </mesh>
          </group>
        </group>
      )}

      {/* ============================================================== */}
      {/* 2. COMMERCIAL QUADCOPTER & IED DROPPER (Matrice / Heavy Quad) */}
      {/* ============================================================== */}
      {modelType === 'recon_quad' && (
        <group>
          {/* Central Avionics Fuselage Pod */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.24, 0.7]} />
            <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.85} wireframe={isWireframe} />
          </mesh>
          {/* GPS Dome Puck */}
          <mesh position={[0, 0.18, -0.12]}>
            <cylinderGeometry args={[0.11, 0.11, 0.09, 12]} />
            <meshStandardMaterial color="#262626" wireframe={isWireframe} />
          </mesh>
          {/* High-Resolution Gimbal Camera */}
          <mesh position={[0, -0.16, 0.32]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial
              color={threatColor}
              emissive={threatColor}
              emissiveIntensity={0.6}
              roughness={0.1}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Suspended Improvised Munition Dropper Cylinder */}
          <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 8]} />
            <meshStandardMaterial color="#B30000" metalness={0.8} wireframe={isWireframe} />
          </mesh>
          {/* Landing Skids */}
          <mesh position={[0.3, -0.22, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.65]} />
            <meshStandardMaterial color="#333333" wireframe={isWireframe} />
          </mesh>
          <mesh position={[-0.3, -0.22, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.65]} />
            <meshStandardMaterial color="#333333" wireframe={isWireframe} />
          </mesh>
          {/* 4 Carbon Arms & Spinning Rotors */}
          {[
            { x: 0.62, z: 0.62, idx: 0 },
            { x: -0.62, z: 0.62, idx: 1 },
            { x: -0.62, z: -0.62, idx: 2 },
            { x: 0.62, z: -0.62, idx: 3 },
          ].map(({ x, z, idx }) => (
            <group key={idx}>
              <mesh position={[x / 2, 0, z / 2]} rotation={[0, Math.atan2(x, z), 0]}>
                <cylinderGeometry args={[0.035, 0.035, Math.hypot(x, z), 6]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#333333" metalness={0.9} wireframe={isWireframe} />
              </mesh>
              <mesh position={[x, 0.09, z]}>
                <cylinderGeometry args={[0.11, 0.11, 0.13, 10]} />
                <meshStandardMaterial color={engineHeatColor} metalness={0.9} wireframe={isWireframe} />
              </mesh>
              <group ref={(el) => (rotorRefs.current[idx] = el)} position={[x, 0.18, z]}>
                <mesh rotation={[0, 0, 0]}>
                  <boxGeometry args={[0.9, 0.02, 0.09]} />
                  <meshStandardMaterial color="#666666" transparent opacity={0.8} wireframe={isWireframe} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.1, 0.45, 16]} />
                  <meshBasicMaterial color={threatColor} transparent opacity={0.25} side={2} wireframe={isWireframe} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      )}

      {/* ============================================================== */}
      {/* 3. HIGH-SPEED FPV KAMIKAZE RACING DRONE (Micro Point Striker) */}
      {/* ============================================================== */}
      {modelType === 'fpv_racer' && (
        <group>
          {/* Low-Profile X Carbon Frame */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.12, 0.42]} />
            <meshStandardMaterial color="#0A0A0A" roughness={0.2} metalness={0.9} wireframe={isWireframe} />
          </mesh>
          {/* Exposed Top LiPo Battery Pack */}
          <mesh position={[0, 0.14, -0.05]}>
            <boxGeometry args={[0.22, 0.16, 0.35]} />
            <meshStandardMaterial
              color={isThermal ? '#FF4400' : '#FFD700'}
              emissive={isThermal ? '#FF2200' : '#000000'}
              emissiveIntensity={isThermal ? 1.0 : 0}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Forward Angled FPV Starlight Camera (35° Up-tilt) */}
          <mesh position={[0, 0.08, 0.22]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.15]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} wireframe={isWireframe} />
          </mesh>
          {/* Point-Blank RPG-7 Shaped Warhead / C4 Pack underbelly */}
          <mesh position={[0, -0.15, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.35, 8]} />
            <meshStandardMaterial color="#B30000" metalness={0.8} wireframe={isWireframe} />
          </mesh>
          {/* High-KV Brushless Motors & 3-Blade Racing Props */}
          {[
            { x: 0.48, z: 0.48, idx: 0 },
            { x: -0.48, z: 0.48, idx: 1 },
            { x: -0.48, z: -0.48, idx: 2 },
            { x: 0.48, z: -0.48, idx: 3 },
          ].map(({ x, z, idx }) => (
            <group key={idx}>
              <mesh position={[x / 2, 0, z / 2]} rotation={[0, Math.atan2(x, z), 0]}>
                <cylinderGeometry args={[0.025, 0.025, Math.hypot(x, z), 6]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#222222" wireframe={isWireframe} />
              </mesh>
              <mesh position={[x, 0.07, z]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
                <meshStandardMaterial color={isThermal ? '#FFAA00' : '#FF1A1A'} metalness={0.9} wireframe={isWireframe} />
              </mesh>
              <group ref={(el) => (rotorRefs.current[idx] = el)} position={[x, 0.14, z]}>
                <mesh rotation={[0, 0, 0]}>
                  <boxGeometry args={[0.65, 0.02, 0.06]} />
                  <meshStandardMaterial color="#FF1A1A" transparent opacity={0.7} wireframe={isWireframe} />
                </mesh>
                <mesh rotation={[0, Math.PI / 3, 0]}>
                  <boxGeometry args={[0.65, 0.02, 0.06]} />
                  <meshStandardMaterial color="#FF1A1A" transparent opacity={0.7} wireframe={isWireframe} />
                </mesh>
              </group>
            </group>
          ))}
          {/* Rear 5.8 GHz Mushroom Antenna */}
          <mesh position={[0, 0.28, -0.22]}>
            <cylinderGeometry args={[0.04, 0.02, 0.2, 8]} />
            <meshStandardMaterial color="#B30000" wireframe={isWireframe} />
          </mesh>
        </group>
      )}

      {/* ============================================================== */}
      {/* 4. HEAVY HEXACOPTER MUNITION BOMBER (6-Arm Heavy Carrier) */}
      {/* ============================================================== */}
      {modelType === 'heavy_hexacopter' && (
        <group>
          {/* Large Hexagonal Core Pod */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.35, 6]} />
            <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.8} wireframe={isWireframe} />
          </mesh>
          {/* Dual High-Capacity Battery Enclosures */}
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.45, 0.18, 0.45]} />
            <meshStandardMaterial color="#1E1E1E" wireframe={isWireframe} />
          </mesh>
          {/* Heavy Mortar Bomb Carousel Drop Rack (4 tubes) */}
          {[
            { x: 0.16, z: 0.16 },
            { x: -0.16, z: 0.16 },
            { x: -0.16, z: -0.16 },
            { x: 0.16, z: -0.16 },
          ].map(({ x, z }, i) => (
            <mesh key={i} position={[x, -0.36, z]} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.48, 8]} />
              <meshStandardMaterial color="#B30000" metalness={0.9} wireframe={isWireframe} />
            </mesh>
          ))}
          {/* Heavy Dual A-Frame Landing Legs */}
          <mesh position={[0.45, -0.32, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} rotation={[0, 0, -0.2]} />
            <meshStandardMaterial color="#444444" wireframe={isWireframe} />
          </mesh>
          <mesh position={[-0.45, -0.32, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} rotation={[0, 0, 0.2]} />
            <meshStandardMaterial color="#444444" wireframe={isWireframe} />
          </mesh>
          {/* 6 Radial Arms (60° intervals) */}
          {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const r = 0.95;
            const x = Math.cos(rad) * r;
            const z = Math.sin(rad) * r;

            return (
              <group key={idx}>
                <mesh position={[x / 2, 0, z / 2]} rotation={[0, -rad + Math.PI / 2, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, r, 6]} rotation={[Math.PI / 2, 0, 0]} />
                  <meshStandardMaterial color="#333333" wireframe={isWireframe} />
                </mesh>
                <mesh position={[x, 0.1, z]}>
                  <cylinderGeometry args={[0.13, 0.13, 0.15, 10]} />
                  <meshStandardMaterial color={engineHeatColor} metalness={0.9} wireframe={isWireframe} />
                </mesh>
                <group ref={(el) => (rotorRefs.current[idx] = el)} position={[x, 0.22, z]}>
                  <mesh rotation={[0, 0, 0]}>
                    <boxGeometry args={[1.05, 0.03, 0.11]} />
                    <meshStandardMaterial color="#555555" transparent opacity={0.8} wireframe={isWireframe} />
                  </mesh>
                  <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.1, 0.52, 16]} />
                    <meshBasicMaterial color={threatColor} transparent opacity={0.2} side={2} wireframe={isWireframe} />
                  </mesh>
                </group>
              </group>
            );
          })}
        </group>
      )}

      {/* ============================================================== */}
      {/* 5. FIXED-WING LONG-RANGE RECONNAISSANCE UAV (MALE Archetype) */}
      {/* ============================================================== */}
      {modelType === 'fixed_wing_recon' && (
        <group>
          {/* Streamlined Aerodynamic Fuselage */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.2, 2.6, 12]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} wireframe={isWireframe} />
          </mesh>
          {/* Belly Mounted 360° EO/IR Turret Dome */}
          <mesh position={[0, -0.22, 0.4]}>
            <sphereGeometry args={[0.2, 14, 14]} />
            <meshStandardMaterial
              color="#B30000"
              emissive={accentColor}
              emissiveIntensity={0.6}
              roughness={0.1}
              wireframe={isWireframe}
            />
          </mesh>
          {/* High-Aspect-Ratio Glider Wings */}
          <mesh position={[0, 0.12, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.2, 0.6]} />
            <meshStandardMaterial color={bodyColor} side={2} metalness={0.7} wireframe={isWireframe} />
          </mesh>
          {/* Inverted V-Tail Empennage */}
          <mesh position={[0.32, 0.28, -1.25]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.04, 0.65, 0.3]} />
            <meshStandardMaterial color={accentColor} wireframe={isWireframe} />
          </mesh>
          <mesh position={[-0.32, 0.28, -1.25]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.04, 0.65, 0.3]} />
            <meshStandardMaterial color={accentColor} wireframe={isWireframe} />
          </mesh>
          {/* Rear Pusher Prop */}
          <group ref={(el) => (rotorRefs.current[0] = el)} position={[0, 0.05, -1.35]}>
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.75, 0.05, 0.02]} />
              <meshBasicMaterial color={engineHeatColor} wireframe={isWireframe} />
            </mesh>
          </group>
        </group>
      )}

      {/* ============================================================== */}
      {/* 6. TETHERED DEFENSE PERIMETER SENTRY DRONE */}
      {/* ============================================================== */}
      {modelType === 'tethered_sentry' && (
        <group>
          {/* Ruggedized Military Sentry Core */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.8]} />
            <meshStandardMaterial color="#1C1C1C" roughness={0.3} metalness={0.9} wireframe={isWireframe} />
          </mesh>
          {/* Top High-Gain Directional C2 Patch Antenna Mast */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
            <meshStandardMaterial color="#B30000" wireframe={isWireframe} />
          </mesh>
          {/* High-Definition 40x Optical & Cooled LWIR Sensor Ball */}
          <mesh position={[0, -0.22, 0.25]}>
            <sphereGeometry args={[0.22, 14, 14]} />
            <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.6} wireframe={isWireframe} />
          </mesh>
          {/* High-Voltage Micro-Tether Cable Extending Downward */}
          <mesh position={[0, -2.5, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 4.5, 6]} />
            <meshBasicMaterial color="#FF9933" wireframe={isWireframe} />
          </mesh>
          {/* 4 Heavy-Duty Arm Rotors with Prop Guards */}
          {[
            { x: 0.65, z: 0.65, idx: 0 },
            { x: -0.65, z: 0.65, idx: 1 },
            { x: -0.65, z: -0.65, idx: 2 },
            { x: 0.65, z: -0.65, idx: 3 },
          ].map(({ x, z, idx }) => (
            <group key={idx}>
              <mesh position={[x, 0.1, z]}>
                <cylinderGeometry args={[0.12, 0.12, 0.14, 8]} />
                <meshStandardMaterial color="#333333" wireframe={isWireframe} />
              </mesh>
              <group ref={(el) => (rotorRefs.current[idx] = el)} position={[x, 0.2, z]}>
                <mesh rotation={[0, 0, 0]}>
                  <boxGeometry args={[0.95, 0.02, 0.1]} />
                  <meshStandardMaterial color="#777777" transparent opacity={0.8} wireframe={isWireframe} />
                </mesh>
              </group>
              <mesh position={[x, 0.2, z]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.48, 0.54, 24]} />
                <meshBasicMaterial color="#555555" side={2} wireframe={isWireframe} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ============================================================== */}
      {/* 7. AUTHORIZED CIVILIAN / MEDICAL CARGO UAV */}
      {/* ============================================================== */}
      {modelType === 'civilian_cargo' && (
        <group>
          {/* Main Airframe in Civil White & Safety Orange */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.85, 0.28, 0.85]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.3} wireframe={isWireframe} />
          </mesh>
          {/* Orange Insulated Medical Logistics Cargo Container */}
          <mesh position={[0, -0.32, 0]}>
            <boxGeometry args={[0.55, 0.35, 0.65]} />
            <meshStandardMaterial color="#FF6600" roughness={0.4} wireframe={isWireframe} />
          </mesh>
          {/* Civilian Red Cross / Hazard Decal Decal */}
          <mesh position={[0.29, -0.32, 0]}>
            <boxGeometry args={[0.02, 0.16, 0.16]} />
            <meshBasicMaterial color="#FFFFFF" wireframe={isWireframe} />
          </mesh>
          {/* Civil ADS-B Navigation Strobes */}
          <mesh position={[0.7, 0.08, 0.7]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#22C55E" />
          </mesh>
          <mesh position={[-0.7, 0.08, 0.7]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#FF1A1A" />
          </mesh>
          {/* 4 Rotors with White Blades */}
          {[
            { x: 0.68, z: 0.68, idx: 0 },
            { x: -0.68, z: 0.68, idx: 1 },
            { x: -0.68, z: -0.68, idx: 2 },
            { x: 0.68, z: -0.68, idx: 3 },
          ].map(({ x, z, idx }) => (
            <group key={idx}>
              <mesh position={[x, 0.1, z]}>
                <cylinderGeometry args={[0.1, 0.1, 0.12, 10]} />
                <meshStandardMaterial color="#333333" wireframe={isWireframe} />
              </mesh>
              <group ref={(el) => (rotorRefs.current[idx] = el)} position={[x, 0.18, z]}>
                <mesh rotation={[0, 0, 0]}>
                  <boxGeometry args={[0.9, 0.02, 0.08]} />
                  <meshStandardMaterial color="#E2E8F0" transparent opacity={0.85} wireframe={isWireframe} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      )}

      {/* ============================================================== */}
      {/* 8. AUTONOMOUS SWARM DECOY / BOIDS SATURATOR */}
      {/* ============================================================== */}
      {modelType === 'swarm_decoy' && (
        <group>
          {/* Spherical Luneberg Radar Reflector Pod */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 14, 14]} />
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.95}
              roughness={0.1}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Dual High-Frequency Jamming Dipole Whips */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 6]} />
            <meshBasicMaterial color="#F59E0B" wireframe={isWireframe} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 6]} />
            <meshBasicMaterial color="#F59E0B" wireframe={isWireframe} />
          </mesh>
          {/* 3 High-RPM Compact Rotors (Tri-rotor config) */}
          {[0, 120, 240].map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const r = 0.52;
            const x = Math.cos(rad) * r;
            const z = Math.sin(rad) * r;
            return (
              <group key={idx}>
                <mesh position={[x, 0.05, z]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
                  <meshStandardMaterial color="#222222" wireframe={isWireframe} />
                </mesh>
                <group ref={(el) => (rotorRefs.current[idx] = el)} position={[x, 0.12, z]}>
                  <mesh rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.55, 0.02, 0.05]} />
                    <meshStandardMaterial color="#F59E0B" transparent opacity={0.7} wireframe={isWireframe} />
                  </mesh>
                </group>
              </group>
            );
          })}
        </group>
      )}

      {/* Ground Projection Shadow */}
      <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

export default DroneModel;
