/**
 * SkyShield Trainer - Complete Drone Arsenal & Technical Systems Page
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Interactive 3D technical encyclopedia covering all asymmetric drone platforms,
 * working mechanisms, remote range datalinks, aerodynamics, and C-UAS countermeasures.
 */

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Center } from '@react-three/drei';
import { DroneModel } from '../components/3d/DroneModel';
import { DRONE_CATALOG } from '../data/droneCatalog';
import { playSound, playDroneAcousticPitch } from '../components/common/SoundEffects';
import { speakTacticalAlert } from '../components/common/RadioComms';
import {
  Shield,
  Radio,
  Eye,
  Volume2,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sliders,
  ChevronRight,
  Flame,
  Activity,
  Layers,
  Target,
  Compass,
  ArrowUpRight,
  Zap,
  Info,
  Maximize2,
  RotateCw,
  GitCompare,
  Download,
  ExternalLink,
  Cpu,
  Navigation,
  Wind,
  BatteryCharging,
  Wifi,
  RadioTower,
  Camera,
  X,
} from 'lucide-react';

export function DronePage({ onLaunchSimulation }) {
  const [selectedDroneId, setSelectedDroneId] = useState(DRONE_CATALOG[0].id);
  const [filterClass, setFilterClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('optical'); // 'optical' | 'thermal' | 'wireframe'
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('isometric'); // 'isometric' | 'top' | 'front' | 'side'
  const [activeComponent, setActiveComponent] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareDroneId, setCompareDroneId] = useState(DRONE_CATALOG[1].id);

  const controlsRef = useRef();

  const currentDrone =
    DRONE_CATALOG.find((d) => d.id === selectedDroneId) || DRONE_CATALOG[0];

  const compareDrone =
    DRONE_CATALOG.find((d) => d.id === compareDroneId) || DRONE_CATALOG[1];

  // Filtered drones
  const filteredDrones = DRONE_CATALOG.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.remoteRange.controlBands.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || d.class.includes(filterClass);
    return matchesSearch && matchesClass;
  });

  // Camera presets
  const handleSetCamera = (preset) => {
    setCameraPreset(preset);
    if (!controlsRef.current) return;
    setAutoRotate(false);

    if (preset === 'top') {
      controlsRef.current.object.position.set(0, 15, 0.01);
    } else if (preset === 'front') {
      controlsRef.current.object.position.set(0, 0, 14);
    } else if (preset === 'side') {
      controlsRef.current.object.position.set(14, 0, 0);
    } else {
      controlsRef.current.object.position.set(10, 8, 12);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // Play acoustic sound
  const handlePlayAcoustic = () => {
    playDroneAcousticPitch(currentDrone.specifications.motorAudioPitch, 2.0);
    speakTacticalAlert(`Acoustic spectrum: ${currentDrone.specifications.acousticFrequency}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-white">
      {/* PAGE HEADER & TOP ACCENTS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] mb-2 uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Ministry of Defence • Technical Air Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
            DRONE ARSENAL // UAS INTELLIGENCE
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1 max-w-3xl">
            Technical blueprint and doctrinal analysis of asymmetric unmanned aerial systems (UAS),
            remote datalink control ranges, flight aerodynamics, and countermeasure guidelines.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/15 hover:border-[#FF1A1A] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <GitCompare className="w-4 h-4 text-[#FF1A1A]" />
            <span>Compare 2 Drones</span>
          </button>

          {onLaunchSimulation && (
            <button
              onClick={onLaunchSimulation}
              className="px-4 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-bold text-xs flex items-center gap-2 shadow-red-glow transition-all cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>Launch Simulator Drill</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#121212] border border-white/10 shadow-lg">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by drone model, frequency, or payload..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg bg-[#0A0A0A] border border-white/15 focus:border-[#FF1A1A] text-white text-xs outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Class Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Drones' },
            { id: 'Fixed-Wing', label: 'Fixed-Wing' },
            { id: 'Rotary-Wing', label: 'Multirotor' },
            { id: 'Micro', label: 'Micro FPV' },
            { id: 'Swarm', label: 'Swarm Decoys' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterClass(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterClass === cat.id
                  ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                  : 'bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN 2-COLUMN VIEWPORT: 3D STUDIO & COMPREHENSIVE INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 7 COLS: INTERACTIVE 3D VIEWER + BLUEPRINT OVERLAY + WORKING MECHANISMS */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3D VISUALIZATION CANVAS */}
          <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-[#070707] border border-white/15 shadow-2xl">
            <Canvas>
              <PerspectiveCamera makeDefault position={[10, 8, 12]} fov={42} />
              <ambientLight intensity={viewMode === 'thermal' ? 0.2 : 0.65} />
              <directionalLight
                position={[15, 25, 15]}
                intensity={viewMode === 'thermal' ? 0.3 : 1.3}
                color={viewMode === 'thermal' ? '#FF3300' : '#FFFFFF'}
              />
              <pointLight
                position={[0, 4, 0]}
                intensity={1.8}
                color={viewMode === 'thermal' ? '#FF1A1A' : '#444444'}
              />

              <Center>
                <DroneModel
                  modelType={currentDrone.modelType}
                  threatCategory={currentDrone.threatCategory}
                  isThermal={viewMode === 'thermal'}
                  isWireframe={viewMode === 'wireframe'}
                  scale={1.4}
                />
              </Center>

              {/* Elevation Ground Grid & Elevation Rings */}
              <gridHelper
                args={[28, 14, viewMode === 'thermal' ? '#FF1A1A' : '#333333', '#141414']}
                position={[0, -2.1, 0]}
              />

              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.08, 0]}>
                <ringGeometry args={[8.5, 8.7, 48]} />
                <meshBasicMaterial
                  color={viewMode === 'thermal' ? '#FF1A1A' : '#444444'}
                  transparent
                  opacity={0.4}
                />
              </mesh>

              <OrbitControls
                ref={controlsRef}
                autoRotate={autoRotate}
                autoRotateSpeed={1.2}
                enableZoom={true}
                maxPolarAngle={Math.PI / 2.05}
                minDistance={6}
                maxDistance={35}
              />
            </Canvas>

            {/* TOP OVERLAY BADGES */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  currentDrone.threatCategory === 'hostile'
                    ? 'bg-red-950/80 text-[#FF1A1A] border border-[#FF1A1A]/40'
                    : currentDrone.threatCategory === 'friendly'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                    : 'bg-sky-950/80 text-sky-400 border border-sky-500/40'
                }`}
              >
                {currentDrone.threatLevel}
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-xs text-gray-300">
                {currentDrone.class}
              </span>
            </div>

            {/* VIEW MODE TOGGLES (Optical, LWIR Thermal, Wireframe) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('optical')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  viewMode === 'optical'
                    ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Optical
              </button>

              <button
                onClick={() => setViewMode('thermal')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'thermal'
                    ? 'bg-red-900 text-[#FF1A1A] border border-[#FF1A1A]'
                    : 'text-gray-400 hover:text-[#FF1A1A]'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>LWIR Thermal</span>
              </button>

              <button
                onClick={() => setViewMode('wireframe')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  viewMode === 'wireframe'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Wireframe
              </button>
            </div>

            {/* CAMERA PRESET CONTROLS & AUTO-ROTATE */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-xs">
              <span className="text-[10px] text-gray-400 px-1 font-bold">ANGLE:</span>
              {['isometric', 'top', 'front', 'side'].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSetCamera(p)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    cameraPreset === p
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}

              <div className="h-3 w-px bg-white/15 mx-1" />

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  autoRotate ? 'text-[#FF1A1A]' : 'text-gray-400'
                }`}
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>Rotate</span>
              </button>
            </div>

            {/* ACOUSTIC MOTOR SIGNATURE BUTTON */}
            <div className="absolute bottom-3 right-3">
              <button
                onClick={handlePlayAcoustic}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Hear Motor Audio</span>
              </button>
            </div>
          </div>

          {/* COMPONENT BLUEPRINT CALLOUTS */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#FF1A1A]" />
                <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                  Airframe Subsystems & Component Anatomy
                </span>
              </div>
              <span className="text-[10px] text-gray-400">Click a component to inspect details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentDrone.components?.map((comp, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveComponent(comp)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    activeComponent?.name === comp.name
                      ? 'bg-[#B30000]/20 border-[#FF1A1A] text-white shadow-red-glow-sm'
                      : 'bg-[#0A0A0A] border-white/5 hover:border-white/20 text-gray-300'
                  }`}
                >
                  <div className="font-heading font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A]" />
                    <span>{comp.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-sans mt-1">
                    {comp.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPREHENSIVE WORKING OF THIS DRONE */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Wind className="w-5 h-5 text-[#FF1A1A]" />
              <div>
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Working Principles & Operational Mechanisms
                </h3>
                <p className="text-[11px] text-gray-400">
                  How this drone achieves lift, autonomy, guidance, and weapons deployment
                </p>
              </div>
            </div>

            {/* Aerodynamics */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#FF1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>1. Aerodynamics & Airframe Design</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed pl-5">
                {currentDrone.workingPrinciple.aerodynamics}
              </p>
            </div>

            {/* Propulsion */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>2. Propulsion & Powerplant Architecture</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed pl-5">
                {currentDrone.workingPrinciple.propulsion}
              </p>
            </div>

            {/* Guidance & Autonomy */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>3. Guidance, Navigation & Flight Controller Autonomy</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed pl-5">
                {currentDrone.workingPrinciple.guidance}
              </p>
            </div>

            {/* Payload & Weaponization */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>4. Payload & Tactical Weaponization</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed pl-5">
                {currentDrone.workingPrinciple.payload}
              </p>
            </div>

            {/* Launch & Deployment */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>5. Launch & Deployment Profile</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed pl-5">
                {currentDrone.workingPrinciple.launchMethod}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: REMOTE RANGE, SPECIFICATIONS SCORECARD, COUNTERMEASURES & ROSTER */}
        <div className="lg:col-span-5 space-y-6">
          {/* DRONE IDENTITY HEADER CARD */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B30000]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="text-xs text-gray-400 font-mono">
              DESIGNATION: <strong className="text-white">{currentDrone.technicalDesignation}</strong>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-black text-white uppercase leading-snug">
              {currentDrone.name}
            </h2>

            <div className="text-xs text-[#FF1A1A] font-bold">
              ROLE: {currentDrone.role}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400">
              <span>STATUS: <strong className="text-emerald-400">{currentDrone.status}</strong></span>
              <span>ORIGIN: <strong className="text-white">{currentDrone.origin}</strong></span>
            </div>
          </div>

          {/* REMOTE RANGE & DATALINK SPECIFICATIONS BOX */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <RadioTower className="w-4 h-4 text-[#FF1A1A]" />
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                Remote Control Range & Telemetry Datalink
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">MAX FLIGHT RANGE:</span>
                <span className="text-sm font-bold text-amber-400">
                  {currentDrone.remoteRange.maxOperationalRange}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">DATALINK CONTROL RANGE:</span>
                <span className="text-sm font-bold text-white">
                  {currentDrone.remoteRange.controlDatalinkRange}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/5 space-y-1">
                <div className="text-gray-400 text-[10px] uppercase">RF CONTROL FREQUENCIES:</div>
                <div className="text-emerald-400 font-bold">
                  {currentDrone.remoteRange.controlBands}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/5 space-y-1">
                <div className="text-gray-400 text-[10px] uppercase">TELEMETRY & PROTOCOL:</div>
                <div className="text-sky-300 font-sans text-xs">
                  {currentDrone.remoteRange.telemetryProtocol}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/5 space-y-1">
                <div className="text-gray-400 text-[10px] uppercase">LINE OF SIGHT (LOS / BLOS):</div>
                <div className="text-gray-200 font-sans text-xs">
                  {currentDrone.remoteRange.lineOfSight}
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY & FLIGHT PERFORMANCE SCORECARD */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Activity className="w-4 h-4 text-[#FF1A1A]" />
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                Kinematics & Telemetry Specifications
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                <div className="text-[10px] text-gray-400">MAX SPEED</div>
                <div className="text-sm font-bold text-amber-400">{currentDrone.specifications.maxSpeed}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                <div className="text-[10px] text-gray-400">CRUISE SPEED</div>
                <div className="text-sm font-bold text-white">{currentDrone.specifications.cruiseSpeed}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                <div className="text-[10px] text-gray-400">SERVICE CEILING</div>
                <div className="text-sm font-bold text-sky-400">{currentDrone.specifications.serviceCeiling}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                <div className="text-[10px] text-gray-400">FLIGHT ENDURANCE</div>
                <div className="text-sm font-bold text-emerald-400">{currentDrone.specifications.endurance}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                <div className="text-[10px] text-gray-400">RADAR CROSS (RCS)</div>
                <div className="text-sm font-bold text-[#FF1A1A]">{currentDrone.specifications.rcs}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5">
                <div className="text-[10px] text-gray-400">WARHEAD / LOAD</div>
                <div className="text-sm font-bold text-white">{currentDrone.specifications.warheadWeight}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5 col-span-2">
                <div className="text-[10px] text-gray-400">ACOUSTIC FREQUENCY</div>
                <div className="text-xs font-bold text-amber-300">{currentDrone.specifications.acousticFrequency}</div>
              </div>
            </div>
          </div>

          {/* COUNTERMEASURES & DSSC DOCTRINE RECOMMENDATION */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                DSSC Counter-UAS Defence Doctrine
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/5 space-y-1">
                <strong className="text-amber-400 font-mono block text-[11px] uppercase">
                  OPTIMAL SOFT-KILL (ELECTRONIC WARFARE):
                </strong>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {currentDrone.countermeasures.softKill}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-white/5 space-y-1">
                <strong className="text-[#FF1A1A] font-mono block text-[11px] uppercase">
                  OPTIMAL HARD-KILL (DIRECTED ENERGY / KINETIC):
                </strong>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {currentDrone.countermeasures.hardKill}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#B30000]/10 border border-[#FF1A1A]/30 space-y-1">
                <strong className="text-white font-mono block text-[11px] uppercase">
                  COMMAND ROE ADVICE:
                </strong>
                <p className="text-gray-200 text-xs leading-relaxed">
                  {currentDrone.countermeasures.doctrineAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* DRONE ROSTER SELECTOR LIST */}
          <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#FF1A1A]" />
                <span>Select Drone to Inspect ({filteredDrones.length})</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">DSSC Arsenal</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredDrones.map((drone) => {
                const isSelected = drone.id === selectedDroneId;
                return (
                  <div
                    key={drone.id}
                    onClick={() => {
                      setSelectedDroneId(drone.id);
                      playSound('radar_ping');
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#B30000]/20 border-[#FF1A1A] shadow-red-glow-sm'
                        : 'bg-[#0A0A0A] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading text-xs font-bold text-white">
                        {drone.name}
                      </h4>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                          drone.threatCategory === 'hostile'
                            ? 'bg-red-950/60 text-[#FF1A1A] border border-[#FF1A1A]/40'
                            : drone.threatCategory === 'friendly'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : 'bg-sky-950/60 text-sky-400 border border-sky-500/40'
                        }`}
                      >
                        {drone.threatCategory}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 font-sans mt-1 line-clamp-1">
                      {drone.role}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Range: <strong className="text-amber-400">{drone.remoteRange.maxOperationalRange.split(' ')[0]} km</strong></span>
                      <span>Speed: <strong className="text-white">{drone.specifications.maxSpeed.split(' ')[0]} km/h</strong></span>
                      <span className="text-[#FF1A1A] font-bold flex items-center gap-0.5">
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
      </div>

      {/* SIDE-BY-SIDE DRONE COMPARISON MODAL */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0F0F0F] border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#141414] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitCompare className="w-5 h-5 text-[#FF1A1A]" />
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Technical Side-by-Side Drone Comparison
                </h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* SELECTORS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    PRIMARY DRONE PLATFORM
                  </label>
                  <select
                    value={selectedDroneId}
                    onChange={(e) => setSelectedDroneId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#141414] border border-white/15 text-white font-bold outline-none cursor-pointer"
                  >
                    {DRONE_CATALOG.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    COMPARISON DRONE PLATFORM
                  </label>
                  <select
                    value={compareDroneId}
                    onChange={(e) => setCompareDroneId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#141414] border border-white/15 text-white font-bold outline-none cursor-pointer"
                  >
                    {DRONE_CATALOG.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COMPARISON SPEC TABLE */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left font-mono">
                  <thead className="bg-[#181818] border-b border-white/10 text-[11px] text-gray-400">
                    <tr>
                      <th className="p-3">Specification Parameter</th>
                      <th className="p-3 text-white">{currentDrone.name}</th>
                      <th className="p-3 text-amber-400">{compareDrone.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Threat Class</td>
                      <td className="p-3 font-bold text-white">{currentDrone.class}</td>
                      <td className="p-3 font-bold text-amber-300">{compareDrone.class}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Remote Operational Range</td>
                      <td className="p-3 font-bold text-emerald-400">{currentDrone.remoteRange.maxOperationalRange}</td>
                      <td className="p-3 font-bold text-emerald-400">{compareDrone.remoteRange.maxOperationalRange}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Control Datalink Range</td>
                      <td className="p-3">{currentDrone.remoteRange.controlDatalinkRange}</td>
                      <td className="p-3">{compareDrone.remoteRange.controlDatalinkRange}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">RF Control Frequency Bands</td>
                      <td className="p-3 text-sky-400 font-mono text-[11px]">{currentDrone.remoteRange.controlBands}</td>
                      <td className="p-3 text-sky-400 font-mono text-[11px]">{compareDrone.remoteRange.controlBands}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Max Flight Speed</td>
                      <td className="p-3 font-bold">{currentDrone.specifications.maxSpeed}</td>
                      <td className="p-3 font-bold">{compareDrone.specifications.maxSpeed}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Service Ceiling</td>
                      <td className="p-3">{currentDrone.specifications.serviceCeiling}</td>
                      <td className="p-3">{compareDrone.specifications.serviceCeiling}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Flight Endurance</td>
                      <td className="p-3 text-amber-400 font-bold">{currentDrone.specifications.endurance}</td>
                      <td className="p-3 text-amber-400 font-bold">{compareDrone.specifications.endurance}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Radar Cross Section (RCS)</td>
                      <td className="p-3 text-[#FF1A1A] font-bold">{currentDrone.specifications.rcs}</td>
                      <td className="p-3 text-[#FF1A1A] font-bold">{compareDrone.specifications.rcs}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Warhead / Drop Load</td>
                      <td className="p-3">{currentDrone.specifications.warheadWeight}</td>
                      <td className="p-3">{compareDrone.specifications.warheadWeight}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gray-400">Optimal Defence Soft-Kill</td>
                      <td className="p-3 text-gray-300 text-xs">{currentDrone.countermeasures.softKill}</td>
                      <td className="p-3 text-gray-300 text-xs">{compareDrone.countermeasures.softKill}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DronePage;
