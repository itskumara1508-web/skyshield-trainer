import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Sparkles,
  Copy,
  Check,
  Radio,
  Shield,
  Cloud,
  Sun,
  MapPin,
  Sliders,
  RefreshCw,
  AlertCircle,
  Plus,
  Trash2,
  FileText,
  FileCode,
  Download,
  Upload,
  Compass,
  Crosshair,
  Target,
  AlertTriangle,
  Wind,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Eye
} from 'lucide-react';
import { SCRIPTED_SCENARIOS } from '../data/scriptedScenarios';
import { generateProceduralScenario } from '../engine/proceduralGenerator';
import { generateSeedString } from '../engine/seedRNG';
import { useSimulator } from '../context/SimulatorContext';
import { useSettings } from '../context/SettingsContext';
import { dataLayer } from '../data/dataLayer';
import { Badge } from '../components/common/Badge';
import { TacticalRadarMap } from '../components/scenario/TacticalRadarMap';
import { OpordBriefingModal } from '../components/scenario/OpordBriefingModal';
import { ScenarioJsonModal } from '../components/scenario/ScenarioJsonModal';
import { CustomFleetEditor } from '../components/scenario/CustomFleetEditor';

/**
 * ScenarioBuilderPage
 * Rebuilt Mission Architect & Scenario Builder for Counter-Drone Operations
 * SIH26247 DSSC / MoD Air Defence Simulation Platform
 */
export function ScenarioBuilderPage({ onLaunchSimulation }) {
  const { startMission } = useSimulator();
  const { adaptiveLevel, difficultyConfig } = useSettings();

  // Mode: 'scripted' | 'procedural' | 'architect' | 'saved'
  const [activeTab, setActiveTab] = useState('scripted');

  // Certified Scenarios State & Filter
  const [scriptedList, setScriptedList] = useState(SCRIPTED_SCENARIOS);
  const [theatreFilter, setTheatreFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScripted, setSelectedScripted] = useState(SCRIPTED_SCENARIOS[0]);

  // Procedural Generator State
  const [seed, setSeed] = useState(generateSeedString());
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [weather, setWeather] = useState('clear');
  const [terrain, setTerrain] = useState('urban');
  const [sensorState, setSensorState] = useState('nominal');
  const [threatType, setThreatType] = useState('swarm');
  const [swarmSize, setSwarmSize] = useState(6);
  const [ingressPattern, setIngressPattern] = useState('pincer');

  // Custom Mission Architect State
  const [customMission, setCustomMission] = useState({
    id: `scn-custom-${Date.now()}`,
    seed: generateSeedString(),
    name: 'Sector Base Alpha Defense',
    difficulty: 'Level 3 (Tactical)',
    theatre: 'urban',
    location: 'Forward Strategic Command Perimeter',
    description: 'Custom officer mission simulating synchronized multi-vector drone incursions.',
    tacticalObjective: 'Neutralize unauthorized aerial tracks before 140m defense barrier breach. Enforce strict ROE against friendly and civilian corridors.',
    roeRules: [
      'Positive optical/RF identification required before kinetic escalation',
      'Electronic Warfare RF Jamming authorized on confirmed hostile frequencies',
      'Hold fire on civilian and friendly transponders'
    ],
    defendedSite: {
      name: 'Forward Defense Node 01',
      type: 'forward_base',
      killZoneRadius: 140,
      engagementRadius: 300,
      elevation: 210,
    },
    environment: {
      timeOfDay: 'dusk',
      weather: 'clear',
      terrain: 'urban',
    },
    sensorState: {
      mode: 'degraded_radar',
      radarHealth: 0.75,
      eoirHealth: 0.85,
      jammerActive: false,
      acousticHealth: 0.90,
    },
    threatType: 'swarm',
    swarmSize: 4,
    durationSeconds: 90,
    contacts: [
      {
        id: 'trk-cust-01',
        callsign: 'VIPER-01',
        type: 'hostile',
        role: 'attacker',
        behavior: 'attack',
        modelType: 'delta_wing',
        spawnTime: 1.0,
        position: [-180, 45, 120],
        velocity: [15, 0, -10],
        speed: 18.0,
        altitude: 45,
        headingDeg: 75,
        distance: 215,
        radarCrossSection: 0.022,
        thermalSignature: 0.82,
        rfFrequency: '2.44 GHz',
      },
      {
        id: 'trk-cust-02',
        callsign: 'VIPER-02',
        type: 'hostile',
        role: 'attacker',
        behavior: 'attack',
        modelType: 'fpv_kamikaze',
        spawnTime: 3.5,
        position: [-200, 35, 140],
        velocity: [18, 0, -12],
        speed: 22.0,
        altitude: 35,
        headingDeg: 78,
        distance: 244,
        radarCrossSection: 0.012,
        thermalSignature: 0.88,
        rfFrequency: '5.8 GHz',
      },
      {
        id: 'trk-cust-03',
        callsign: 'GHOST-JAMMER',
        type: 'hostile',
        role: 'decoy',
        behavior: 'loiter',
        modelType: 'swarm_decoy',
        spawnTime: 6.0,
        position: [-160, 75, -170],
        velocity: [11, 0, 11],
        speed: 15.0,
        altitude: 75,
        headingDeg: 45,
        distance: 233,
        radarCrossSection: 0.080,
        thermalSignature: 0.90,
        rfFrequency: 'Standoff Jammer',
      },
      {
        id: 'trk-cust-04',
        callsign: 'CIV-ESCORT',
        type: 'benign',
        role: 'transit',
        behavior: 'loiter',
        modelType: 'civilian_cargo',
        spawnTime: 9.0,
        position: [190, 80, 150],
        velocity: [-7, 0, -6],
        speed: 9.5,
        altitude: 80,
        headingDeg: 230,
        distance: 242,
        radarCrossSection: 0.038,
        thermalSignature: 0.42,
        rfFrequency: '2.41 GHz WiFi',
      },
    ],
  });

  // Saved Custom Scenarios from LocalStorage
  const [savedScenarios, setSavedScenarios] = useState([]);

  // Active Scenario Preview
  const [previewScenario, setPreviewScenario] = useState(SCRIPTED_SCENARIOS[0]);
  const [selectedRadarContactId, setSelectedRadarContactId] = useState(null);

  // Modals
  const [isOpordOpen, setIsOpordOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Load scenarios from dataLayer on mount
  useEffect(() => {
    const loadFromStore = async () => {
      const allScenarios = await dataLayer.getScenarios();
      const customOnly = allScenarios.filter((s) => !SCRIPTED_SCENARIOS.some((sc) => sc.id === s.id));
      setSavedScenarios(customOnly);
    };
    loadFromStore();
  }, []);

  // Update preview scenario when parameters or tabs change
  useEffect(() => {
    if (activeTab === 'scripted') {
      setPreviewScenario(selectedScripted);
    } else if (activeTab === 'procedural') {
      const generated = generateProceduralScenario({
        seed,
        timeOfDay,
        weather,
        terrain,
        sensorState,
        threatType,
        swarmSize,
      });
      setPreviewScenario(generated);
    } else if (activeTab === 'architect') {
      setPreviewScenario(customMission);
    }
  }, [
    activeTab,
    selectedScripted,
    seed,
    timeOfDay,
    weather,
    terrain,
    sensorState,
    threatType,
    swarmSize,
    customMission,
  ]);

  // Filtered Certified Scenarios
  const filteredScripted = useMemo(() => {
    return SCRIPTED_SCENARIOS.filter((sc) => {
      const matchesTheatre = theatreFilter === 'all' || sc.theatre === theatreFilter;
      const matchesSearch =
        !searchQuery ||
        sc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.seed?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTheatre && matchesSearch;
    });
  }, [theatreFilter, searchQuery]);

  // Derived Threat Intelligence Analytics for current preview scenario
  const threatAnalytics = useMemo(() => {
    const contacts = previewScenario?.contacts || previewScenario?.threats || [];
    const hostile = contacts.filter((c) => (c.type || c.threatCategory) === 'hostile');
    const benign = contacts.filter((c) => (c.type || c.threatCategory) === 'benign');
    const friendly = contacts.filter((c) => (c.type || c.threatCategory) === 'friendly');

    // Calculate minimum Time to Perimeter (TTP)
    let minTtp = 999;
    contacts.forEach((c) => {
      const pos = c.position || [150, 40, 150];
      const dist = Math.hypot(pos[0], pos[2]);
      const spd = c.speed || 15;
      const ttp = (dist - 140) / spd; // time to 140m kill zone
      if (ttp < minTtp) minTtp = Math.max(1, ttp);
    });

    const isJamming = previewScenario?.sensorState?.mode === 'jammed' || previewScenario?.sensorState?.jammerActive;
    const hasCivilians = benign.length > 0;

    return {
      total: contacts.length,
      hostileCount: hostile.length,
      benignCount: benign.length,
      friendlyCount: friendly.length,
      minTtp: minTtp === 999 ? 12 : Math.round(minTtp),
      isJamming,
      hasCivilians,
      roeComplexity: hasCivilians && hostile.length > 3 ? 'High' : hasCivilians ? 'Medium' : 'Low',
      geometry:
        hostile.length > 5
          ? 'Omnidirectional Flocking'
          : hostile.length >= 3
          ? 'Multi-Vector Pincer Ingress'
          : 'Linear Standoff Vector',
    };
  }, [previewScenario]);

  const handleCopySeed = () => {
    if (!previewScenario?.seed) return;
    navigator.clipboard.writeText(previewScenario.seed);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleApplyAdaptive = () => {
    setActiveTab('procedural');
    setSensorState(difficultyConfig.sensorState || 'nominal');
    setWeather(difficultyConfig.weather || 'clear');
    setSwarmSize(difficultyConfig.swarmSize || 6);
    setThreatType(difficultyConfig.swarmSize > 1 ? 'swarm' : 'single');
    setSeed(generateSeedString());
  };

  const handleCloneToArchitect = (sourceScenario) => {
    const cloned = {
      ...sourceScenario,
      id: `scn-custom-${Date.now()}`,
      seed: generateSeedString(),
      name: `Custom Copy: ${sourceScenario.name}`,
      contacts: (sourceScenario.contacts || sourceScenario.threats || []).map((c, i) => ({
        ...c,
        id: `trk-clone-${Date.now()}-${i + 1}`,
      })),
    };
    setCustomMission(cloned);
    setActiveTab('architect');
  };

  const handleSaveCustomMission = async () => {
    const toSave = {
      ...customMission,
      swarmSize: customMission.contacts.length,
      threatType: customMission.contacts.length > 1 ? 'swarm' : 'single',
    };
    await dataLayer.saveScenario(toSave);
    const all = await dataLayer.getScenarios();
    const customOnly = all.filter((s) => !SCRIPTED_SCENARIOS.some((sc) => sc.id === s.id));
    setSavedScenarios(customOnly);
    setSaveSuccessMsg('Scenario saved to DSSC custom library!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDeleteSavedScenario = async (id) => {
    if (confirm('Delete this custom scenario from local library?')) {
      await dataLayer.deleteScenario(id);
      const all = await dataLayer.getScenarios();
      const customOnly = all.filter((s) => !SCRIPTED_SCENARIOS.some((sc) => sc.id === s.id));
      setSavedScenarios(customOnly);
      if (previewScenario.id === id) {
        setPreviewScenario(SCRIPTED_SCENARIOS[0]);
      }
    }
  };

  const handleImportScenario = (imported) => {
    setCustomMission(imported);
    setActiveTab('architect');
    setSaveSuccessMsg('Imported scenario loaded into Custom Architect!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLaunch = () => {
    startMission(previewScenario);
    onLaunchSimulation();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Title & 4-Way Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] mb-2 uppercase">
            <Radio className="w-3.5 h-3.5" />
            <span>Mission Scenario Configuration // SIH26247 DSSC</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider">
            Tactical Threat Scenario Builder
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-sans">
            Author certified Staff College doctrine sorties, synthesize reproducible seed-based swarms, or engineer custom tactical missions.
          </p>
        </div>

        {/* 4 Mode Buttons */}
        <div className="flex flex-wrap items-center bg-[#121212] border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('scripted')}
            className={`px-3.5 py-2 rounded-lg font-heading text-xs font-bold transition-all uppercase ${
              activeTab === 'scripted'
                ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Certified Doctrines ({SCRIPTED_SCENARIOS.length})
          </button>
          <button
            onClick={() => setActiveTab('procedural')}
            className={`px-3.5 py-2 rounded-lg font-heading text-xs font-bold transition-all flex items-center gap-1.5 uppercase ${
              activeTab === 'procedural'
                ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Procedural Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('architect')}
            className={`px-3.5 py-2 rounded-lg font-heading text-xs font-bold transition-all flex items-center gap-1.5 uppercase ${
              activeTab === 'architect'
                ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Architect</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-2 rounded-lg font-heading text-xs font-bold transition-all flex items-center gap-1.5 uppercase ${
              activeTab === 'saved'
                ? 'bg-[#B30000] text-white shadow-red-glow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Missions ({savedScenarios.length})</span>
          </button>
        </div>
      </div>

      {/* Adaptive Difficulty Recommendation Notice */}
      <div className="p-4 rounded-xl bg-[#121212] border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-500 font-mono font-bold">
            L{adaptiveLevel}
          </div>
          <div>
            <div className="font-heading text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <span>Adaptive Training Recommendation: {difficultyConfig.title}</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono">
                AUTONOMOUS CURRICULUM
              </span>
            </div>
            <div className="text-xs text-gray-400 font-sans mt-0.5">
              {difficultyConfig.description} | Target Swarm Density: <span className="text-white font-mono">{difficultyConfig.swarmSize} UAVs</span> | Sensor Profile: <span className="text-amber-400 font-mono">{difficultyConfig.sensorState}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleApplyAdaptive}
          className="px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-mono text-xs font-bold transition-colors uppercase cursor-pointer"
        >
          Apply Adaptive Preset
        </button>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Grid: Parameters / Editor (Left) & Radar & Briefing Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: CERTIFIED SCRIPTED DOCTRINES */}
          {activeTab === 'scripted' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF1A1A]" />
                  <span>Select Certified DSSC Scenario</span>
                </h3>

                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search theatre, seed, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF1A1A] w-56"
                />
              </div>

              {/* Theatre Quick Filters */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                {[
                  { id: 'all', label: 'All Theatres' },
                  { id: 'high_altitude', label: 'Himalayan LAC' },
                  { id: 'urban', label: 'Urban Citadel' },
                  { id: 'desert', label: 'Western Desert' },
                  { id: 'littoral', label: 'Naval Littoral' },
                  { id: 'critical_infra', label: 'Refinery Infra' },
                  { id: 'airbase', label: 'Airbase Runway' },
                  { id: 'convoy', label: 'Mobile Convoy' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheatreFilter(th.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      theatreFilter === th.id
                        ? 'bg-[#B30000] text-white font-bold'
                        : 'bg-[#121212] text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>

              {/* List of Scenarios */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredScripted.map((sc) => {
                  const isSelected = selectedScripted.id === sc.id;
                  const hostiles = (sc.contacts || []).filter((c) => c.type === 'hostile').length;
                  const nonHostiles = (sc.contacts || []).length - hostiles;

                  return (
                    <div
                      key={sc.id}
                      onClick={() => setSelectedScripted(sc)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#B30000]/15 border-[#FF1A1A] shadow-red-glow-sm'
                          : 'bg-[#121212] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-white uppercase">{sc.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0A] text-[#FF1A1A] border border-[#FF1A1A]/30">
                            {sc.tag || 'DOCTRINE SORTIE'}
                          </span>
                        </div>
                        <Badge
                          category={sc.difficulty?.includes('Extreme') ? 'hostile' : sc.difficulty?.includes('Tactical') ? 'unknown' : 'friendly'}
                          label={sc.difficulty}
                          size="sm"
                        />
                      </div>

                      <div className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#FF1A1A]" />
                        <span>{sc.location}</span>
                      </div>

                      <p className="text-xs text-gray-300 font-sans leading-relaxed mb-3">
                        {sc.description}
                      </p>

                      <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-gray-400 pt-2 border-t border-white/10">
                        <div>
                          HOSTILES: <span className="text-red-400 font-bold">{hostiles}</span>
                          {nonHostiles > 0 && <span className="text-cyan-400 ml-1">+{nonHostiles} Civ</span>}
                        </div>
                        <div>TERRAIN: <span className="text-white uppercase">{sc.environment?.terrain}</span></div>
                        <div>WEATHER: <span className="text-white uppercase">{sc.environment?.weather}</span></div>
                        <div>SENSORS: <span className="text-amber-400 uppercase">{sc.sensorState?.mode?.replace('_', ' ')}</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono text-gray-400">
                          SEED: <span className="text-white font-bold">{sc.seed}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloneToArchitect(sc);
                            }}
                            className="px-2 py-1 rounded bg-[#0A0A0A] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white"
                          >
                            Clone to Custom
                          </button>
                          <span className="text-[10px] font-heading font-bold text-[#FF1A1A] uppercase flex items-center gap-1">
                            {isSelected ? 'ACTIVE SELECTION' : 'CLICK TO LOAD'}
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredScripted.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-gray-400 font-mono text-xs">
                    No certified scenarios matching current theatre filter or search query.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROCEDURAL DETERMINISTIC GENERATOR */}
          {activeTab === 'procedural' && (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF1A1A]" />
                    <span>Deterministic Seed Engine</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">
                    Mulberry32 PRNG ensures 100% mathematical reproducibility across any unit-level laptop.
                  </p>
                </div>
                <button
                  onClick={() => setSeed(generateSeedString())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-[#FF1A1A] text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Randomize Seed</span>
                </button>
              </div>

              {/* Seed Display & Copy */}
              <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#FF1A1A]/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Deterministic Seed String</div>
                  <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value.toUpperCase())}
                    className="font-mono font-bold text-[#FF1A1A] bg-transparent border-none focus:outline-none text-base tracking-wider uppercase"
                  />
                </div>
                <button
                  onClick={handleCopySeed}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#121212] border border-white/10 text-xs font-mono text-gray-400 hover:text-white"
                >
                  {copiedSeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSeed ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Terrain & Weather */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase font-bold">Terrain Model</label>
                  <select
                    value={terrain}
                    onChange={(e) => setTerrain(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF1A1A]"
                  >
                    <option value="urban">Urban (Metro Cityscape & High-Rises)</option>
                    <option value="rural">Rural (Rolling Hills & Mountain Corridor)</option>
                    <option value="coastal">Coastal (Sea Littoral & Marine Clutter)</option>
                    <option value="outpost">High-Altitude (Sub-Zero Ridge Post)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase font-bold">Atmospheric Weather</label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF1A1A]"
                  >
                    <option value="clear">Clear Visibility (Nominal Optics)</option>
                    <option value="fog">Dense Fog (Severe EO/IR Degradation)</option>
                    <option value="rain">Monsoon Rain (Radar Clutter & Scatter)</option>
                    <option value="sandstorm">Desert Sandstorm / Blizzard</option>
                  </select>
                </div>
              </div>

              {/* Time of Day & Sensor State */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase font-bold">Time of Day</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF1A1A]"
                  >
                    <option value="day">Daylight (Visual Optics Active)</option>
                    <option value="dusk">Dusk / Twilight (Low Light Transitions)</option>
                    <option value="night">Night (Thermal EO/IR Primary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase font-bold">Tactical Sensor Health</label>
                  <select
                    value={sensorState}
                    onChange={(e) => setSensorState(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF1A1A]"
                  >
                    <option value="nominal">Nominal Full Operational Capability</option>
                    <option value="degraded_radar">Degraded Radar (Jitter & Dropouts)</option>
                    <option value="degraded_eoir">Degraded EO/IR (Optics Inversion)</option>
                    <option value="jammed">Active EW Jamming (Heavy Clutter & Ghosts)</option>
                  </select>
                </div>
              </div>

              {/* Swarm Size Slider */}
              <div className="font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-400 uppercase font-bold">Threat Swarm Density</label>
                  <span className="text-[#FF1A1A] font-bold text-sm">{swarmSize} Drone(s)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={swarmSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSwarmSize(val);
                    setThreatType(val === 1 ? 'single' : 'swarm');
                  }}
                  className="w-full accent-[#FF1A1A] h-2 bg-[#0A0A0A] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>1 (Single Infiltrator)</span>
                  <span>4 (Squadron Pincer)</span>
                  <span>8 (Saturation Attack)</span>
                  <span>16 (Maximum Overmatch)</span>
                </div>
              </div>

              {/* Ingress Symmetry Option */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2 border-t border-white/10">
                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase font-bold">Ingress Vector Profile</label>
                  <select
                    value={ingressPattern}
                    onChange={(e) => setIngressPattern(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#FF1A1A]"
                  >
                    <option value="pincer">Dual Pincer Ingress</option>
                    <option value="omnidirectional">360° Omnidirectional Saturation</option>
                    <option value="chokepoint">Narrow Valley Corridor Chokepoint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase font-bold">Tactical Classification</label>
                  <div className="p-2 rounded-lg bg-[#0A0A0A] text-gray-300 text-xs border border-white/10">
                    70% Hostile | 15% Benign Cargo | 15% Friendly
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM MISSION ARCHITECT */}
          {activeTab === 'architect' && (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#FF1A1A]" />
                    <span>Interactive Tactical Mission Architect</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">
                    Design custom counter-drone sorties with granular kinematic parameters and fleet composition.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCustomMission}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase transition-all shadow-red-glow cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Save to My Missions</span>
                </button>
              </div>

              {/* Form Section 1: Mission Name & Theatre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Scenario Name</label>
                  <input
                    type="text"
                    value={customMission.name}
                    onChange={(e) => setCustomMission({ ...customMission, name: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-[#FF1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Location / Operational Sector</label>
                  <input
                    type="text"
                    value={customMission.location}
                    onChange={(e) => setCustomMission({ ...customMission, location: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF1A1A]"
                  />
                </div>
              </div>

              {/* Form Section 2: Defended Asset & Base Radii */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Defended Asset Name</label>
                  <input
                    type="text"
                    value={customMission.defendedSite?.name || 'Sector Base Alpha'}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        defendedSite: { ...customMission.defendedSite, name: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Inner Kill Zone (M)</label>
                  <input
                    type="number"
                    value={customMission.defendedSite?.killZoneRadius || 140}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        defendedSite: { ...customMission.defendedSite, killZoneRadius: parseInt(e.target.value) },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Engagement Zone (M)</label>
                  <input
                    type="number"
                    value={customMission.defendedSite?.engagementRadius || 300}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        defendedSite: { ...customMission.defendedSite, engagementRadius: parseInt(e.target.value) },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Form Section 3: Environment & Sensor Preset */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Terrain</label>
                  <select
                    value={customMission.environment?.terrain || 'urban'}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        environment: { ...customMission.environment, terrain: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="urban">Urban</option>
                    <option value="rural">Rural</option>
                    <option value="coastal">Coastal</option>
                    <option value="outpost">High-Altitude</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Weather</label>
                  <select
                    value={customMission.environment?.weather || 'clear'}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        environment: { ...customMission.environment, weather: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="clear">Clear</option>
                    <option value="fog">Fog</option>
                    <option value="rain">Rain</option>
                    <option value="sandstorm">Sandstorm / Blizzard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Time</label>
                  <select
                    value={customMission.environment?.timeOfDay || 'day'}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        environment: { ...customMission.environment, timeOfDay: e.target.value },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="day">Daylight</option>
                    <option value="dusk">Dusk</option>
                    <option value="night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase font-bold">Sensors</label>
                  <select
                    value={customMission.sensorState?.mode || 'nominal'}
                    onChange={(e) =>
                      setCustomMission({
                        ...customMission,
                        sensorState: {
                          ...customMission.sensorState,
                          mode: e.target.value,
                          jammerActive: e.target.value === 'jammed',
                        },
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="nominal">Nominal</option>
                    <option value="degraded_radar">Degraded Radar</option>
                    <option value="degraded_eoir">Degraded EO/IR</option>
                    <option value="jammed">EW Jammed</option>
                  </select>
                </div>
              </div>

              {/* Form Section 4: Tactical Fleet Composition Table */}
              <div className="pt-4 border-t border-white/10">
                <CustomFleetEditor
                  contacts={customMission.contacts || []}
                  onChangeContacts={(updatedContacts) =>
                    setCustomMission({
                      ...customMission,
                      contacts: updatedContacts,
                      swarmSize: updatedContacts.length,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 4: SAVED CUSTOM MISSIONS LIBRARY */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF1A1A]" />
                  <span>My Custom Missions Library</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-xs font-mono text-gray-300 hover:text-white"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#FF1A1A]" />
                  <span>Import / Export JSON</span>
                </button>
              </div>

              {savedScenarios.length > 0 ? (
                <div className="space-y-3">
                  {savedScenarios.map((sc) => {
                    const isSelected = previewScenario.id === sc.id;
                    return (
                      <div
                        key={sc.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#B30000]/15 border-[#FF1A1A]'
                            : 'bg-[#121212] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-heading text-sm font-bold text-white uppercase">{sc.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0A] text-gray-400">
                              {(sc.contacts || []).length} Contacts
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomMission(sc);
                                setActiveTab('architect');
                              }}
                              className="px-2 py-1 rounded bg-[#0A0A0A] border border-white/10 text-xs font-mono text-gray-300 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedScenario(sc.id)}
                              className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 font-sans mb-3">{sc.description}</p>

                        <div className="flex items-center justify-between text-xs font-mono border-t border-white/10 pt-2">
                          <span className="text-gray-400">SEED: <span className="text-[#FF1A1A] font-bold">{sc.seed}</span></span>
                          <button
                            type="button"
                            onClick={() => setPreviewScenario(sc)}
                            className="text-[#FF1A1A] font-bold hover:underline"
                          >
                            Load Into Radar Preview &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl bg-[#121212] text-gray-400 font-mono text-xs space-y-3">
                  <Layers className="w-8 h-8 text-gray-600 mx-auto" />
                  <p>No custom missions saved in this browser yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('architect')}
                    className="px-4 py-2 rounded-xl bg-[#B30000] text-white font-bold text-xs uppercase"
                  >
                    Launch Custom Architect Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Radar Scope & Mission Launch Card (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive 2D PPI Radar Scope Display */}
          <TacticalRadarMap
            scenario={previewScenario}
            selectedContactId={selectedRadarContactId}
            onSelectContact={(id) => setSelectedRadarContactId(id)}
          />

          {/* Mission Briefing Card */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-heading text-xs font-bold text-[#FF1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Tactical Sortie Briefing</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsOpordOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-[10px] font-mono text-gray-300 hover:text-white transition-colors"
                >
                  <FileText className="w-3 h-3 text-[#FF1A1A]" />
                  <span>OPORD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-[10px] font-mono text-gray-300 hover:text-white transition-colors"
                >
                  <FileCode className="w-3 h-3 text-[#FF1A1A]" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* Scenario Title & Details */}
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide">
                {previewScenario.name}
              </h3>
              <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF1A1A]" />
                <span>{previewScenario.location || 'Tactical Defense Zone'}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              {previewScenario.description}
            </p>

            {/* Derived Threat Intelligence Matrix */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">THREAT DENSITY</span>
                <span className="text-[#FF1A1A] font-bold text-sm">
                  {threatAnalytics.hostileCount} Hostiles
                  {threatAnalytics.benignCount > 0 && <span className="text-cyan-400 text-xs font-normal ml-1">+{threatAnalytics.benignCount} Civ</span>}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">CRITICAL REACTION WINDOW</span>
                <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{threatAnalytics.minTtp}s to Boundary</span>
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">INGRESS GEOMETRY</span>
                <span className="text-white font-semibold text-[11px] truncate block">
                  {threatAnalytics.geometry}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">ROE COMPLEXITY</span>
                <span
                  className="font-bold text-xs uppercase"
                  style={{
                    color:
                      threatAnalytics.roeComplexity === 'High'
                        ? '#EF4444'
                        : threatAnalytics.roeComplexity === 'Medium'
                        ? '#F59E0B'
                        : '#22C55E',
                  }}
                >
                  {threatAnalytics.roeComplexity} Risk
                </span>
              </div>
            </div>

            {/* Seed & Copy */}
            <div className="p-3 rounded-lg bg-[#B30000]/10 border border-[#FF1A1A]/30 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">EXACT REPRODUCIBILITY SEED</span>
                <span className="text-[#FF1A1A] font-bold">{previewScenario.seed}</span>
              </div>
              <button
                type="button"
                onClick={handleCopySeed}
                className="p-1.5 rounded bg-[#121212] border border-white/10 hover:border-[#FF1A1A] text-[#FF1A1A]"
                title="Copy Seed String"
              >
                {copiedSeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Launch Simulator Button */}
            <button
              type="button"
              onClick={handleLaunch}
              className="w-full py-4 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-red-glow cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ENGAGE SIMULATOR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Military OPORD Modal */}
      {isOpordOpen && (
        <OpordBriefingModal
          scenario={previewScenario}
          onClose={() => setIsOpordOpen(false)}
        />
      )}

      {/* JSON Import/Export Modal */}
      {isJsonModalOpen && (
        <ScenarioJsonModal
          scenario={previewScenario}
          onImportScenario={handleImportScenario}
          onClose={() => setIsJsonModalOpen(false)}
        />
      )}
    </div>
  );
}
