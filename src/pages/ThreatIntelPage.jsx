/**
 * SkyShield Trainer - Threat Intel & Drone Recognition Library
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Interactive 3D technical catalog of asymmetric drone threats, radar cross-sections,
 * thermal infrared signatures, RF control spectra, and acoustic pitch profiles.
 */

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Billboard, Text } from '@react-three/drei';
import { DroneModel } from '../components/3d/DroneModel';
import { playSound } from '../components/common/SoundEffects';
import { speakTacticalAlert } from '../components/common/RadioComms';
import {
  Shield,
  Radio,
  Eye,
  Volume2,
  Zap,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Info,
  Search,
  Sliders,
  ChevronRight,
  Flame,
  Activity,
  Layers,
  Target,
} from 'lucide-react';
import { SentryQuizModal } from '../components/intel/SentryQuizModal';


export const THREAT_PROFILES = [
  {
    id: 'loitering-delta',
    name: 'Delta-Wing Loitering Munition (Shahed Archetype)',
    category: 'hostile',
    threatLevel: 'CRITICAL',
    role: 'Terminal Kamikaze Strike',
    speed: '185 km/h',
    range: '1,200 km',
    rcs: '0.028 m²',
    thermalSignature: 'High (Gas Engine Exhaust)',
    rfSpectrum: 'GNSS Assisted (Low RF Leakage)',
    acousticFreq: '110 Hz (Piston Engine Mower Buzz)',
    motorAudioPitch: 110,
    modelType: 'delta_wing',
    description: 'Long-range autonomous loitering drone designed for saturation strikes on infrastructure. Low radar cross-section with high thermal signature from rear exhaust.',
    vulnerabilities: [
      'Vulnerable to GNSS Spoofing & directional satellite link disruption',
      'High thermal signature makes it vulnerable to Infrared (IR) surface-to-air tracking',
      'Slow subsonic speed allows interception by high-energy laser within 250m'
    ],
    doctrineResponse: 'Verify absence of IFF transponder, illuminate with laser rangefinder, and authorize hard-kill kinetic/DEW intercept outside 150m.',
  },
  {
    id: 'commercial-quad',
    name: 'Commercial Quadcopter IED Dropper (Matrice / Heavy Quad)',
    category: 'hostile',
    threatLevel: 'HIGH',
    role: 'Drop-Munition / Target Spotting',
    speed: '75 km/h',
    range: '12 km',
    rcs: '0.015 m²',
    thermalSignature: 'Low (Brushless Electric Motors)',
    rfSpectrum: '2.4 GHz & 5.8 GHz ISM (OcuSync / Lightbridge)',
    acousticFreq: '480 Hz (High-Pitched Multi-Rotor Whine)',
    motorAudioPitch: 480,
    modelType: 'recon_quad',
    description: 'Commercial multi-rotor platform converted with release mechanism for mortar or grenade payloads. Highly agile with erratic low-altitude hovering capability.',
    vulnerabilities: [
      'Extreme vulnerability to 2.4/5.8 GHz directional RF jamming',
      'Triggering return-to-home (RTL) exposes operator launch coordinates',
      'Light structural plastic rotors easily destroyed by focused RF pulse or SkyNet capture'
    ],
    doctrineResponse: 'Deploy directional RF jammer immediately to sever video link, causing safe automated forced landing or GPS hover lockout.',
  },
  {
    id: 'fpv-suicide',
    name: 'High-Speed FPV Kamikaze Strike Drone (Racing Airframe)',
    category: 'hostile',
    threatLevel: 'CRITICAL',
    role: 'Direct Sentry Kinetic Impact',
    speed: '145 km/h',
    range: '6 km',
    rcs: '0.008 m² (Extremely Low)',
    thermalSignature: 'Minimal (Small LiPo Battery)',
    rfSpectrum: '5.8 GHz Analog Video + 868/915 MHz ELRS Link',
    acousticFreq: '850 Hz (Screaming High-RPM Whine)',
    motorAudioPitch: 850,
    modelType: 'delta_wing',
    description: 'Ultra-fast operator-piloted racing drone armed with PG-7V shaped charge. Flies extremely low between buildings and trees to evade traditional radar line-of-sight.',
    vulnerabilities: [
      'Analog video channel susceptible to noise distortion and desynchronization',
      'Very short battery endurance (< 7 minutes flight time)',
      'Fragile exposed wiring and carbon props'
    ],
    doctrineResponse: 'Barrage noise jamming across 900 MHz telemetry band, backed by high-speed counter-drone shotgun or microwave directed-energy pulse.',
  },
  {
    id: 'heavy-hexacopter',
    name: 'Tactical Heavy-Lift Hexacopter Bomber (Heavy Payload)',
    category: 'hostile',
    threatLevel: 'HIGH',
    role: 'Night Aerial Bombing / Anti-Armor Mines',
    speed: '60 km/h',
    range: '18 km',
    rcs: '0.080 m²',
    thermalSignature: 'Moderate-High (Thermal Battery Bank)',
    rfSpectrum: 'Starlink Uplink / Encrypted Mil-Band FHSS',
    acousticFreq: '160 Hz (Deep Pulsating Rotor Thrum)',
    motorAudioPitch: 160,
    modelType: 'recon_quad',
    description: 'Large hexacopter fitted with thermal night vision cameras, capable of deploying multiple anti-tank mines or heavy mortar projectiles under darkness.',
    vulnerabilities: [
      'Large radar reflection makes it detectable at long range (> 4 km)',
      'Heavy payload makes it sluggish and incapable of aggressive evasion',
      'High thermal heat output on battery connectors'
    ],
    doctrineResponse: 'Lock with thermal tracking optics and engage with vehicle-mounted 30mm airburst or high-energy tactical laser.',
  },
  {
    id: 'fixed-wing-recon',
    name: 'Long-Endurance Reconnaissance UAV (Tactical Sentry)',
    category: 'friendly',
    threatLevel: 'FRIENDLY',
    role: 'Friendly Aerial Perimeter Watch',
    speed: '120 km/h',
    range: '120 km',
    rcs: '0.045 m²',
    thermalSignature: 'Moderate (Internal Generator)',
    rfSpectrum: 'Encrypted Military Data Link (Mode-5 IFF)',
    acousticFreq: '240 Hz (Smooth Propeller Hum)',
    motorAudioPitch: 240,
    modelType: 'delta_wing',
    description: 'Own-forces tactical observation drone monitoring borders and forward listening posts. Emits authenticated Mode-5 encrypted military IFF transponder ping.',
    vulnerabilities: [
      'Registered on DSSC friendly airspace corridor',
      'Broadcasting encrypted friendly squawk code'
    ],
    doctrineResponse: 'Monitor passive transponder. DO NOT JAM OR ENGAGE. Maintain active coordinate corridor clearance.',
  },
  {
    id: 'civilian-medical',
    name: 'Civilian Medical / Emergency Transit Drone (Neutral Asset)',
    category: 'benign',
    threatLevel: 'NEUTRAL',
    role: 'Emergency Blood / Organ Transit',
    speed: '70 km/h',
    range: '35 km',
    rcs: '0.035 m²',
    thermalSignature: 'Low (Civilian Electric Battery)',
    rfSpectrum: 'Civilian ADS-B Out + 2.4 GHz WiFi Telemetry',
    acousticFreq: '320 Hz (Multi-Blade Low Harmonics)',
    motorAudioPitch: 320,
    modelType: 'civilian_cargo',
    description: 'Authorized civilian logistics UAV straying near restricted military airspace corridor. Emits civilian ADS-B telemetry and anti-collision navigation strobes.',
    vulnerabilities: [
      'Standard civil guard frequency receiver',
      'Unarmed and non-hostile flight path'
    ],
    doctrineResponse: 'Transmit emergency redirect broadcast on civil 121.5 MHz VHF guard frequency. DO NOT OPEN FIRE under any circumstances.',
  },
];

// Interactive 3D Model Inspection Canvas
function ThreatModelViewer({ profile, isThermalView }) {
  return (
    <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-[#070707] border border-white/10 shadow-2xl">
      <Canvas camera={{ position: [0, 8, 18], fov: 42 }}>
        <ambientLight intensity={isThermalView ? 0.2 : 0.6} />
        <directionalLight
          position={[20, 30, 20]}
          intensity={isThermalView ? 0.4 : 1.2}
          color={isThermalView ? '#FF4444' : '#FFFFFF'}
        />
        <pointLight
          position={[0, 5, 0]}
          intensity={2.0}
          color={
            isThermalView
              ? '#FF1A1A'
              : profile.category === 'hostile'
              ? '#FF1A1A'
              : profile.category === 'friendly'
              ? '#22C55E'
              : '#38BDF8'
          }
          distance={40}
        />

        {/* 3D Drone Model */}
        <group position={[0, 0, 0]}>
          <DroneModel
            modelType={profile.modelType}
            threatCategory={isThermalView ? 'hostile' : profile.category}
            role={profile.role}
            isSelected={true}
            scale={2.2}
          />
        </group>

        {/* Tactical Elevation & Azimuth Rings */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <ringGeometry args={[8, 8.2, 48]} />
          <meshBasicMaterial
            color={isThermalView ? '#FF1A1A' : '#444444'}
            transparent
            opacity={0.5}
          />
        </mesh>
        <gridHelper
          args={[24, 12, isThermalView ? '#FF1A1A' : '#333333', '#1A1A1A']}
          position={[0, -2.05, 0]}
        />

        <OrbitControls
          autoRotate
          autoRotateSpeed={1.0}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={8}
          maxDistance={30}
        />
      </Canvas>

      {/* Mode Overlay Badge */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
        <div
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
            isThermalView
              ? 'bg-red-950/80 border border-laser text-laser'
              : 'bg-black/80 border border-white/10 text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-laser animate-pulse" />
          <span>{isThermalView ? 'LWIR THERMAL HEATMAP' : 'OPTICAL SILHOUETTE'}</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none text-[10px] font-mono text-gray-500">
        DRAG TO ROTATE 360° • PINCH TO ZOOM
      </div>
    </div>
  );
}

export function ThreatIntelPage() {
  const [selectedProfileId, setSelectedProfileId] = useState(THREAT_PROFILES[0].id);
  const [isThermalView, setIsThermalView] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrillOpen, setIsDrillOpen] = useState(false);

  const activeProfile =
    THREAT_PROFILES.find((p) => p.id === selectedProfileId) || THREAT_PROFILES[0];

  // Procedural motor acoustic test sound
  const handlePlayAcoustic = (pitch) => {
    playSound('radar_ping');
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = pitch > 400 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(pitch, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(pitch * 1.05, ctx.currentTime + 0.4);
        osc.frequency.linearRampToValueAtTime(pitch, ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch {}

    speakTacticalAlert(`Acoustic rotor profile: ${activeProfile.acousticFreq}`);
  };

  const filteredProfiles = THREAT_PROFILES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rfSpectrum.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] mb-2 uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Counter-UAS Recognition & Signature Intelligence</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider">
            Threat Intel Library
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            DSSC doctrinal reference catalog covering optical silhouettes, thermal IR signatures, RF control frequencies, and acoustic acoustics.
          </p>
        </div>

        {/* Search, Filter & Sentry Drill Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsDrillOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-bold text-xs flex items-center gap-2 shadow-red-glow transition-all cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Rapid Sentry Drill</span>
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat platform..."
              className="px-3.5 py-1.5 pl-8 rounded-lg bg-[#121212] border border-white/15 focus:border-[#FF1A1A] text-white text-xs outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#121212] border border-white/15 text-white text-xs outline-none cursor-pointer"
          >
            <option value="all">All Targets</option>
            <option value="hostile">Hostile Drones</option>
            <option value="friendly">Friendly Assets</option>
            <option value="benign">Civilian UAVs</option>
          </select>
        </div>
      </div>


      {/* 2-COLUMN MAIN LAYOUT: PLATFORM INSPECTION & ROSTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 3D MODEL VIEWER & TECHNICAL PROFILE */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3D Model Viewer with Optics Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF1A1A]" />
                <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                  Interactive 3D Airframe Inspection
                </span>
              </div>

              {/* Thermal IR vs Optical Mode Switcher */}
              <div className="flex items-center bg-[#0A0A0A] border border-white/10 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setIsThermalView(false)}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                    !isThermalView
                      ? 'bg-[#161616] text-white border border-white/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Optical Day
                </button>
                <button
                  onClick={() => setIsThermalView(true)}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isThermalView
                      ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Thermal IR</span>
                </button>
              </div>
            </div>

            <ThreatModelViewer
              profile={activeProfile}
              isThermalView={isThermalView}
            />
          </div>

          {/* SENTRY SIGNATURE SPECIFICATION MATRIX */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-white uppercase">
                  {activeProfile.name}
                </h3>
                <span className="text-[11px] text-gray-400 font-sans">
                  Role: {activeProfile.role}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded font-bold text-xs uppercase border ${
                  activeProfile.category === 'hostile'
                    ? 'bg-red-950/60 text-laser border-laser/50'
                    : activeProfile.category === 'friendly'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                    : 'bg-sky-950/60 text-sky-400 border-sky-500/50'
                }`}
              >
                {activeProfile.threatLevel}
              </span>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              {activeProfile.description}
            </p>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <div className="text-[10px] text-gray-500 uppercase">Max Velocity</div>
                <div className="text-white font-bold mt-0.5">{activeProfile.speed}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <div className="text-[10px] text-gray-500 uppercase">Operational Range</div>
                <div className="text-white font-bold mt-0.5">{activeProfile.range}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <div className="text-[10px] text-gray-500 uppercase">Radar Cross Section</div>
                <div className="text-[#FF1A1A] font-bold mt-0.5">{activeProfile.rcs}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <div className="text-[10px] text-gray-500 uppercase">RF Control Band</div>
                <div className="text-white font-bold mt-0.5 truncate">{activeProfile.rfSpectrum}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10">
                <div className="text-[10px] text-gray-500 uppercase">Thermal Signature</div>
                <div className="text-amber-400 font-bold mt-0.5">{activeProfile.thermalSignature}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Acoustic Pitch</div>
                  <div className="text-sky-400 font-bold mt-0.5">{activeProfile.motorAudioPitch} Hz</div>
                </div>
                <button
                  onClick={() => handlePlayAcoustic(activeProfile.motorAudioPitch)}
                  title="Play synthesized acoustic motor sound"
                  className="p-2 rounded bg-zinc-800 hover:bg-[#FF1A1A] hover:text-black text-gray-300 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* DOCTRINE RECOMMENDATION & ROE ADVICE */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
              <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF1A1A]" />
                <span>DSSC Countermeasure Doctrine & ROE Guidelines</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                {activeProfile.doctrineResponse}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECOGNITION PLATFORMS CATALOG */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
              Threat Platforms ({filteredProfiles.length})
            </span>
            <span className="text-[10px] text-gray-400">Select to inspect 3D telemetry</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredProfiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#B30000]/15 border-[#FF1A1A] shadow-red-glow-sm'
                      : 'bg-[#121212] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4 className="font-heading text-xs font-bold text-white">
                      {p.name}
                    </h4>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                        p.category === 'hostile'
                          ? 'bg-red-950/60 text-laser border border-laser/40'
                          : p.category === 'friendly'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                          : 'bg-sky-950/60 text-sky-400 border border-sky-500/40'
                      }`}
                    >
                      {p.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-400 font-sans line-clamp-2 mt-1">
                    {p.description}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span>RCS: <strong className="text-white">{p.rcs}</strong></span>
                    <span>Speed: <strong className="text-white">{p.speed}</strong></span>
                    <span className="text-[#FF1A1A] font-bold flex items-center gap-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rapid Sentry Reaction Flashcard Drill Modal */}
      <SentryQuizModal isOpen={isDrillOpen} onClose={() => setIsDrillOpen(false)} />
    </div>
  );
}


export default ThreatIntelPage;
