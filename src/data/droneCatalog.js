/**
 * SkyShield Trainer - Complete Military Drone Arsenal Catalog
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Exhaustive technical specifications, remote control range, propulsion mechanisms,
 * flight dynamics, and 3D visual parameters for all asymmetric drone platforms.
 */

export const DRONE_CATALOG = [
  {
    id: 'shahed_delta',
    name: 'Delta-Wing Kamikaze Loitering Munition (Shahed Archetype)',
    technicalDesignation: 'LM-Delta-136 / Asymmetric Kamikaze UAS',
    class: 'Fixed-Wing Loitering Munition',
    threatCategory: 'hostile',
    threatLevel: 'CRITICAL',
    role: 'Deep Standoff Saturation & Infrastructure Strike',
    modelType: 'delta_wing',
    status: 'ACTIVE BATTLEFIELD THREAT',
    origin: 'Military Asymmetric Manufacture',
    
    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '1,500 - 2,500 km',
      controlDatalinkRange: '250 km (SATCOM / Relay) / Autonomous Pre-programmed Waypoints',
      telemetryProtocol: 'Encrypted Digital MAVLink over UHF / Iridium Satellite Burst',
      controlBands: 'GNSS Satellite (GPS L1/L2, GLONASS, BeiDou, NavIC) + UHF 433 MHz Backup',
      lineOfSight: 'Beyond Line-of-Sight (BLOS) Autonomous Inertial / GNSS Guided',
      relayCapability: 'Can act as waypoint relay for following wave drones',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: 'Low-aspect-ratio delta wing generating high vortex lift at transonic angles. Integrated vertical winglet endplates eliminate tip stalls and stabilize high-speed terminal diving.',
      propulsion: 'MD-550 / Limbach L550E air-cooled 2-stroke 4-cylinder piston boxer engine (50 HP) spinning a rear wooden pusher propeller at 7,200 RPM.',
      guidance: 'Dual-tier guidance: Commercial-grade Multi-GNSS receiver with CRPA (Controlled Reception Pattern Antenna) anti-jamming filter backed by solid-state MEMS Inertial Navigation System (INS).',
      payload: '40 - 50 kg High-Explosive (HE) Pre-fragmented Shaped-Charge Warhead equipped with dual optical impact and inertial graze fuzes.',
      launchMethod: 'Rocket-Assisted Take-Off (RATO) containerized launcher mounted on civilian flatbed truck canisters.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '2.50 m',
      length: '3.50 m',
      maxTakeoffWeight: '200 kg',
      warheadWeight: '45 kg HE Frag',
      maxSpeed: '185 km/h (100 kts)',
      cruiseSpeed: '150 km/h (81 kts)',
      serviceCeiling: '4,000 m (13,100 ft) AGL',
      minimumAltitude: '40 m (Contour Terrain Hugging)',
      endurance: '10 - 12 Hours',
      rcs: '0.028 m² (Low X-Band Radar Cross Section)',
      thermalSignature: 'High (Piston engine cylinder exhaust reaches 240°C)',
      acousticFrequency: '110 Hz ("Lawnmower" two-stroke buzz, audible up to 4 km)',
      motorAudioPitch: 110,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Directional GNSS Spoofing (GPS L1/L2 phase inversion) to induce altitude drift. Directional high-power RF barrage jamming against satellite receivers.',
      hardKill: 'High-Energy Laser (DEW) target illumination on rear gas tank or engine block; 23mm/30mm airburst fragmentation auto-cannon outside 300m perimeter.',
      doctrineAdvice: 'Confirm lack of military Mode-5 transponder. Prioritize immediate engagement before descent below 80m radar horizon.',
    },

    // SCHEMATIC CALLOUTS FOR BLUEPRINT OVERLAY
    components: [
      { name: 'Shaped-Charge Warhead (45kg)', pos: [0, 0, 1.1], desc: 'High-density pre-fragmented steel casing with dual piezoelectric impact fuzes' },
      { name: 'CRPA Anti-Jam GNSS Array', pos: [0, 0.1, 0.4], desc: '4-element phased antenna array filtering out ground-based jammer strobes' },
      { name: 'Solid-State MEMS INS', pos: [0, -0.05, 0], desc: 'Dead-reckoning inertial platform operating during complete GNSS blackouts' },
      { name: 'Internal Fuel Bladder (60L)', pos: [0, 0, -0.5], desc: 'Reinforced kevlar fuel cell providing 1,800 km cruising endurance' },
      { name: '2-Stroke 50HP Gas Engine', pos: [0, 0.05, -1.05], desc: 'Air-cooled boxer engine producing high acoustic and thermal exhaust plume' },
      { name: 'Rear Pusher Propeller', pos: [0, 0.05, -1.25], desc: 'High-pitch composite propeller generating 185 km/h forward thrust' },
    ]
  },

  {
    id: 'matrice_quad',
    name: 'Commercial Quadcopter IED Dropper (Heavy Multi-Rotor)',
    technicalDesignation: 'MR-Quad-400 / Commercial-Off-The-Shelf Strike Platform',
    class: 'Rotary-Wing Quadcopter',
    threatCategory: 'hostile',
    threatLevel: 'HIGH',
    role: 'Perimeter Spotting, Artillery Correction & Grenade Drops',
    modelType: 'recon_quad',
    status: 'FREQUENT BORDER PROBE THREAT',
    origin: 'Commercial Dual-Use Modification',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '12 - 15 km (LOS)',
      controlDatalinkRange: '15 km with High-Gain Yagi Director / 8 km Standard',
      telemetryProtocol: 'OcuSync 3.0 Enterprise / Lightbridge Frequency Hopping',
      controlBands: '2.400 - 2.483 GHz & 5.725 - 5.850 GHz ISM Bands',
      lineOfSight: 'Line-of-Sight (LOS) with 1080p 60fps Low-Latency Video',
      relayCapability: 'Mesh repeating with tethered parent or secondary aerial relay',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: '4 symmetric counter-rotating rotor pairs generating vertical lift. Yaw achieved through reactive torque differentiation; pitch/roll achieved by differential RPM across diametric pairs.',
      propulsion: '4x High-Efficiency Brushless DC Outrunner Motors (180 KV) paired with 50A FOC (Field-Oriented Control) ESCs driving 21-inch carbon-fiber folding propellers.',
      guidance: 'Dual-RTK (Real-Time Kinematic) centimeter-precision GNSS positioning assisted by downward-facing stereoscopic optical flow cameras and dual IMUs.',
      payload: 'Improvised servo-actuated pin release mechanism carrying 2x 60mm mortar bombs or anti-personnel fragmentation grenades.',
      launchMethod: 'Instant vertical take-off and landing (VTOL) from concealed trench or vehicular roof.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '0.88 m Diagonal',
      length: '0.72 m',
      maxTakeoffWeight: '9.2 kg',
      warheadWeight: '2.8 kg Droppable Munitions',
      maxSpeed: '82 km/h (23 m/s)',
      cruiseSpeed: '54 km/h (15 m/s)',
      serviceCeiling: '3,000 m (9,840 ft) MSL / 500 m AGL',
      minimumAltitude: '1 m (Precision Hovering)',
      endurance: '42 - 55 Minutes',
      rcs: '0.015 m² (Ultra-Low Plastic & Carbon Fiber)',
      thermalSignature: 'Very Low (Warm brushless motor hubs ~45°C & battery pack)',
      acousticFrequency: '480 Hz (High-pitched multi-rotor hum audible within 300m)',
      motorAudioPitch: 480,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Directional RF Jammer tuned to 2.4 GHz and 5.8 GHz ISM channels triggers automatic Fail-Safe RTH (Return-To-Home) or forced landing. GNSS spoofing to spoof geo-fenced airport restricted zone.',
      hardKill: 'Kinetic net-gun interceptor; precision high-power laser focal burn on rotor arms; 12-gauge anti-drone shotgun rounds within 80m.',
      doctrineAdvice: 'Jam control channel immediately upon detection to sever live pilot video link, preventing accurate bomb release.',
    },

    components: [
      { name: '4K EO/Thermal Zoom Gimbal', pos: [0, -0.16, 0.32], desc: 'Triple-sensor daylight 30x optical zoom + 640x512 uncooled thermal LWIR sensor' },
      { name: 'Avionics & FOC ESC Hub', pos: [0, 0, 0], desc: 'Central flight controller running adaptive autonomous waypoint missions' },
      { name: 'Dual RTK GNSS Antenna Disc', pos: [0, 0.18, -0.12], desc: 'Provides sub-centimeter hover stability and heading alignment' },
      { name: 'Improvised Munition Dropper', pos: [0, -0.28, 0], desc: 'Electromagnetic release latch holding mortar bomblets' },
      { name: 'Brushless Rotor Assembly (x4)', pos: [0.62, 0.18, 0.62], desc: 'Counter-rotating carbon blades with high dynamic hover stability' },
      { name: 'High-Density LiPo Flight Pack', pos: [0, 0.05, -0.1], desc: '6S 22.8V 13,000mAh battery providing 45-minute operational loiter' },
    ]
  },

  {
    id: 'fpv_kamikaze',
    name: 'High-Speed FPV Kamikaze Racing Drone (Micro Point Striker)',
    technicalDesignation: 'FPV-Strike-7 / Terminal Kinetic Munition',
    class: 'Micro High-Speed Quadcopter',
    threatCategory: 'hostile',
    threatLevel: 'CRITICAL',
    role: 'Precision Bunkers, Armor & Radar Station Suicide Ramming',
    modelType: 'fpv_racer',
    status: 'EXTREME AGILITY COMBAT THREAT',
    origin: 'Modified High-Performance Racing UAS',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '5 - 8 km (Line of Sight)',
      controlDatalinkRange: '8 km with Ground-Based Directional Helical Antenna',
      telemetryProtocol: 'ExpressLRS (ELRS) 915 MHz / TBS Crossfire Ultra-Low Latency',
      controlBands: 'Control: 868 / 915 MHz FHSS | Video: 5.8 GHz Analog / Walksnail Digital',
      lineOfSight: 'Requires continuous line-of-sight; video degrades instantly below tree lines',
      relayCapability: 'Operates via airborne quadcopter relay to penetrate valley dead zones',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: 'Ultra-rigid 7-inch pure carbon fiber unibody designed for 10G extreme evasive maneuvers. High power-to-weight ratio (exceeding 8:1) enables terminal sprint dives at over 150 km/h.',
      propulsion: '4x 2807 1300KV Extreme-Torque Motors powered by a 6S (25.2V) High-C discharge LiPo battery turning 7x4x3 tri-blade polycarbonate props.',
      guidance: 'Direct First-Person-View (FPV) pilot piloting via VR video goggles. No GPS or compass on board—flown manually in acrobatic mode with zero reliance on satellite links.',
      payload: 'RPG-7 PG-7VL shaped charge or 1.5 kg plasticized PE4 explosive with copper contact wire impact fuze protruding from the nose.',
      launchMethod: 'Hand toss or rapid launch from hidden trench dugout.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '0.35 m Diagonal',
      length: '0.28 m',
      maxTakeoffWeight: '2.1 kg',
      warheadWeight: '1.2 kg Shaped Charge',
      maxSpeed: '165 km/h (46 m/s)',
      cruiseSpeed: '110 km/h (30 m/s)',
      serviceCeiling: '1,500 m (4,920 ft) MSL / Low-Altitude Nap-of-Earth',
      minimumAltitude: '0.5 m (Trench & Window Entry Capability)',
      endurance: '8 - 14 Minutes',
      rcs: '0.008 m² (Extremely difficult to acquire on conventional radar)',
      thermalSignature: 'Low-to-Medium (LiPo battery discharge heat ~60°C & hot motor bells)',
      acousticFrequency: '750 Hz (High-pitched screaming motor whine during dive)',
      motorAudioPitch: 750,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Target the analog 5.8 GHz video downlink with high-power jamming to blind the human pilot. Jamming the 915 MHz control link triggers failsafe disarm.',
      hardKill: 'Close-in directional shotgun volley, wire-mesh counter-drone perimeter netting, or DEW laser optics dazzling.',
      doctrineAdvice: 'Operator reaction window is under 4 seconds. GNSS jamming is completely ineffective as FPV operates without GPS.',
    },

    components: [
      { name: 'Copper Contact Impact Fuze', pos: [0, 0.05, 0.28], desc: 'Dual crossed copper wires that close firing circuit upon mechanical impact' },
      { name: 'Angled FPV Starlight Camera', pos: [0, 0.08, 0.22], desc: 'High-contrast low-light analog camera tilted 35° upward for high-speed dive flight' },
      { name: 'PG-7VL Shaped Charge Warhead', pos: [0, -0.15, 0.05], desc: 'Armor-piercing shaped charge capable of penetrating 500mm rolled steel armor' },
      { name: 'F405 Flight Controller & 60A ESC', pos: [0, 0, 0], desc: 'Fast-loop gyroscope processing pilot commands at 8 kHz refresh rate' },
      { name: 'High-C Discharge 6S LiPo Pack', pos: [0, 0.14, -0.05], desc: 'Exposed top-mounted battery providing 120A burst current' },
      { name: 'RHCP 5.8 GHz Cloverleaf Antenna', pos: [0, 0.28, -0.22], desc: 'Circularly polarized video transmission antenna broadcasting live pilot feed' },
    ]
  },

  {
    id: 'heavy_hexacopter',
    name: 'Heavy Payload Hexacopter Munition Carrier (Heavy Bomber)',
    technicalDesignation: 'HC-Hexa-800 / Aerial Bombardment Platform',
    class: 'Heavy Multi-Rotor Hexacopter',
    threatCategory: 'hostile',
    threatLevel: 'HIGH',
    role: 'Multi-Munition Night Bombing & Heavy Sentry Strike',
    modelType: 'heavy_hexacopter',
    status: 'ACTIVE NIGHT RAID THREAT',
    origin: 'Custom Military Industrial Multi-Rotor',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '18 - 25 km',
      controlDatalinkRange: '20 km Encrypted COFDM Microwave Link',
      telemetryProtocol: 'Encrypted Point-to-Point Industrial C2 with Anti-Jam Frequency Hopping',
      controlBands: '1.4 GHz / 2.4 GHz Military Industrial ISM Bands',
      lineOfSight: 'Line of Sight with high-altitude directional tracker base station',
      relayCapability: 'Operates as autonomous flight path drone with pre-stored target GPS coordinates',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: '6-rotor radial configuration offering motor-out redundancy (can safely fly and land with 1 failed motor). Oversized carbon arms dampen high-torque vibrations.',
      propulsion: '6x Industrial Heavy-Lift Brushless Motors (80 KV) driving 30-inch carbon-fiber props, powered by dual 14S (51.8V) 28,000mAh solid-state batteries.',
      guidance: 'Military-grade GNSS receiver with NavIC/GPS dual constellation, optical downward lidar altimeter, and cooled thermal night targeting gimbal.',
      payload: 'Underbelly revolving carousel or 4-tube pneumatic release rack carrying up to 4x 82mm mortar bombs or TM-62 anti-tank blast mines.',
      launchMethod: 'VTOL launch from rear echelon logistics vehicles.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '1.95 m Diagonal',
      length: '1.65 m',
      maxTakeoffWeight: '42.0 kg',
      warheadWeight: '16.0 kg Droppable Bomb Load',
      maxSpeed: '65 km/h (18 m/s)',
      cruiseSpeed: '45 km/h (12.5 m/s)',
      serviceCeiling: '4,500 m (14,760 ft) MSL / 800 m AGL',
      minimumAltitude: '50 m (Safe Bombing Release Altitude)',
      endurance: '35 - 48 Minutes',
      rcs: '0.085 m² (Moderate Radar Cross Section due to large motors & munitions)',
      thermalSignature: 'Medium (6 high-draw motors & dual battery packs)',
      acousticFrequency: '85 Hz (Deep rhythmic rotor thrum audible over 1.5 km)',
      motorAudioPitch: 85,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Long-range electronic RF denial on 1.4 GHz and 2.4 GHz channels; directional satellite denial.',
      hardKill: 'Heavy kinetic interceptors; laser directed-energy weapon thermal breach on exposed motor arms or munitions.',
      doctrineAdvice: 'Prioritize laser engagement before it reaches overhead dropping coordinates. Avoid shooting directly above friendly personnel to prevent secondary mine detonations.',
    },

    components: [
      { name: '4-Tube Mortar Bomb Carousel', pos: [0, -0.36, 0], desc: 'Electropneumatic rack capable of sequential or simultaneous heavy mortar drops' },
      { name: 'Dual 14S Solid-State Battery Bay', pos: [0, 0.24, 0], desc: 'High-density power cells delivering 1,500W sustained lifting power' },
      { name: 'Cooled Thermal Night Targeting Pod', pos: [0, -0.15, 0.45], desc: 'Provides laser rangefinding and computerized ballistic drop lead calculation' },
      { name: 'Heavy Industrial Motor Arms (x6)', pos: [0.95, 0.1, 0], desc: 'Reinforced 40mm carbon tubing with motor-failure redundancy firmware' },
    ]
  },

  {
    id: 'fixed_wing_recon',
    name: 'Medium-Altitude Fixed-Wing Reconnaissance UAV (Tactical Scout)',
    technicalDesignation: 'TUAV-Recon-200 / Battlefield Surveillance Asset',
    class: 'Fixed-Wing Long-Endurance UAV',
    threatCategory: 'hostile',
    threatLevel: 'MEDIUM',
    role: 'Airspace Surveillance, Electronic Intelligence (ELINT) & Targeting',
    modelType: 'fixed_wing_recon',
    status: 'ACTIVE THEATER SURVEILLANCE',
    origin: 'State Military Tactical Inventory',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '150 - 300 km',
      controlDatalinkRange: '150 km Direct Tactical Microwave LOS / 400 km via Ku-Band Satellite',
      telemetryProtocol: 'STANAG 4586 Interoperable Military Tactical Datalink',
      controlBands: 'C-Band (4.4 - 5.0 GHz) & Ku-Band SATCOM (12 - 18 GHz)',
      lineOfSight: 'Hybrid LOS/BLOS with automated failsafe return-to-base',
      relayCapability: 'Operates as airborne electronic relay node for forward drone swarms',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: 'High-aspect-ratio composite wing designed for low Reynolds number efficiency, offering high glide ratio (18:1) and extended endurance loitering over defended sectors.',
      propulsion: 'Quiet electronic pusher motor or EFI heavy-fuel piston engine driving a low-noise composite propeller.',
      guidance: 'Military INS coupled with GPS/GLONASS/Galileo constellation receivers, dual air-data computers, and optical landmark navigation.',
      payload: 'Stabilized electro-optical / infrared (EO/IR) sensor turret with continuous 360° pan, laser target designator, and RF signals intelligence scanner.',
      launchMethod: 'Pneumatic catapult rail launch; belly skid landing or parachute recovery.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '4.20 m',
      length: '2.60 m',
      maxTakeoffWeight: '55 kg',
      warheadWeight: '0 kg (Unarmed Reconnaissance / Spotter)',
      maxSpeed: '140 km/h (39 m/s)',
      cruiseSpeed: '95 km/h (26 m/s)',
      serviceCeiling: '5,000 m (16,400 ft) AGL',
      minimumAltitude: '400 m AGL',
      endurance: '8 - 12 Hours',
      rcs: '0.045 m² (Slender fuselage and composite skin)',
      thermalSignature: 'Low-to-Medium (Insulated exhaust shroud)',
      acousticFrequency: '160 Hz (Muffled pusher engine buzz)',
      motorAudioPitch: 160,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Broadband C-Band datalink jamming to disrupt live HD sensor feed; GNSS spoofing to divert flight path from border corridor.',
      hardKill: 'Surface-to-Air Missile (SAM) or high-altitude laser point defense.',
      doctrineAdvice: 'Target represents high-value spotter. Neutralizing it blinds the adversary artillery battery and swarm coordinating network.',
    },

    components: [
      { name: '360° Dual EO/IR Sensor Ball', pos: [0, -0.22, 0.4], desc: 'Cooled thermal camera and laser designator illuminating targets for strike drones' },
      { name: 'High-Aspect Composite Wing', pos: [0, 0.12, 0.15], desc: '4.2m wingspan generating maximum aerodynamic lift at cruising altitude' },
      { name: 'Ku-Band SATCOM Datalink Pod', pos: [0, 0.18, -0.3], desc: 'Direct satellite transceiver enabling beyond-horizon control' },
      { name: 'Inverted V-Tail Rudder Assembly', pos: [0.32, 0.28, -1.25], desc: 'Dual ruddervators providing pitch and yaw stability with minimal radar reflection' },
    ]
  },

  {
    id: 'tethered_sentry',
    name: 'Tethered Base Defense Sentry UAV (Continuous High-Altitude Mast)',
    technicalDesignation: 'TB-Sentry-100 / Tethered C-UAS Surveillance Mast',
    class: 'Tethered Multirotor UAV',
    threatCategory: 'friendly',
    threatLevel: 'FRIENDLY ASSET',
    role: 'Continuous 24/7 Airbase Perimeter Early-Warning & Radar Mast',
    modelType: 'tethered_sentry',
    status: 'ACTIVE AIRBASE DEFENSE SENTRY',
    origin: 'Indian Armed Forces / DSSC Certified Station',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '150 m Altitude (Fixed Ground Tether)',
      controlDatalinkRange: 'Hardwired Fiber-Optic Tether (Zero RF emissions, 100% Jam-Proof)',
      telemetryProtocol: 'Fiber-Optic Gigabit Ethernet via High-Tensile Micro-Tether Cable',
      controlBands: 'Hardwired Copper Power & Optical Fiber (Zero Wireless Vulnerability)',
      lineOfSight: 'Perpetual Station-Keeping directly above base citadel',
      relayCapability: 'Serves as master base C-UAS radar and communication relay',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: 'High-redundancy 8-rotor coaxial design engineered for heavy wind gusts (up to 45 knots). Maintains unwavering coordinate hold directly above ground winch.',
      propulsion: 'Continuous high-voltage AC electric power delivered from base generator through ultra-light Kevlar-reinforced tether cable.',
      guidance: 'Closed-loop cable tension sensors and dual optical flow sensors keeping exact azimuth and elevation over base citadel.',
      payload: 'AESA micro-radar scanner, 40x daylight camera, cooled MWIR thermal camera, and omni-directional RF sniffer.',
      launchMethod: 'Automated push-button winch deployment and spooling.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '1.20 m Diameter',
      length: '1.20 m',
      maxTakeoffWeight: '18.5 kg',
      warheadWeight: '0 kg (Friendly Surveillance Node)',
      maxSpeed: 'Stationary (0 km/h)',
      cruiseSpeed: 'Stationary Hover',
      serviceCeiling: '150 m (492 ft) AGL (Tether Limited)',
      minimumAltitude: '50 m AGL',
      endurance: 'Unlimited (Continuous Ground Power Supply)',
      rcs: '0.035 m²',
      thermalSignature: 'Low (Electric motors cooled by perpetual rotor wash)',
      acousticFrequency: '360 Hz (Consistent low-decibel perimeter hum)',
      motorAudioPitch: 360,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Immune to wireless RF jamming and GNSS spoofing due to hardwired fiber-optic command datalink.',
      hardKill: 'Protected inside airbase CIWS and laser defense umbrella.',
      doctrineAdvice: 'FRIENDLY ASSET. Do not engage. Use its elevated sensor feed to detect incoming low-flying terrain-hugging hostile drones.',
    },

    components: [
      { name: 'Fiber-Optic Micro-Tether Line', pos: [0, -2.5, 0], desc: 'Kevlar reinforced cable delivering 3,000W continuous electricity and gigabit data' },
      { name: 'AESA Micro-Radar Array', pos: [0, 0.35, 0], desc: 'Detects micro-UAV contacts down to 0.005 m² RCS out to 5 km perimeter' },
      { name: '40x Optical & Cooled MWIR Camera', pos: [0, -0.22, 0.25], desc: 'Provides positive IFF visual identification of incoming contacts day and night' },
    ]
  },

  {
    id: 'civilian_cargo',
    name: 'Authorized Civilian Logistics & Medical Courier UAV (Non-Combatant)',
    technicalDesignation: 'CIV-Courier-X / Authorized Commercial Drone',
    class: 'Civilian Cargo Multirotor',
    threatCategory: 'benign',
    threatLevel: 'NON-COMBATANT',
    role: 'Medical Supply & Civil Logistics Delivery',
    modelType: 'civilian_cargo',
    status: 'AUTHORIZED CIVIL AIR CORRIDOR',
    origin: 'DGCA Certified Civil Logistics Operator',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '25 km (Approved Civil Air Corridor)',
      controlDatalinkRange: '15 km via Commercial 4G/5G Cellular Network + 2.4 GHz ISM',
      telemetryProtocol: 'Open DroneID (ASTM F3411) & ADS-B Civil Squawk Broadcast',
      controlBands: 'Civil ADS-B 1090 MHz & 978 MHz UAT | 4G/5G LTE Core',
      lineOfSight: 'Beyond Visual Line of Sight (BVLOS) under DGCA DigitalSky flight clearance',
      relayCapability: 'None (Civil Standalone Delivery Asset)',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: 'High-lift aerodynamic multi-rotor with enclosed insulated cargo compartment. Programmed with mandatory civil geo-caging and emergency parachute deployment.',
      propulsion: '4x Low-noise quiet brushless electric motors powered by twin smart battery packs with real-time cell health reporting.',
      guidance: 'Commercial GNSS with autonomous flight path following published civil aviation airways.',
      payload: 'Insulated medical courier box (blood, vaccines, organs) marked with bright international safety orange and civil registration decals.',
      launchMethod: 'Commercial hospital/hub launchpad.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '1.15 m Diameter',
      length: '1.05 m',
      maxTakeoffWeight: '14.0 kg',
      warheadWeight: '0 kg (Medical & Civil Supplies)',
      maxSpeed: '95 km/h (26 m/s)',
      cruiseSpeed: '65 km/h (18 m/s)',
      serviceCeiling: '120 m (400 ft) AGL (Civil Regulation Maximum)',
      minimumAltitude: '30 m AGL',
      endurance: '35 Minutes',
      rcs: '0.045 m²',
      thermalSignature: 'Low (Insulated electronics, no explosive warheads)',
      acousticFrequency: '320 Hz (Quiet commercial hum conforming to civil noise limits)',
      motorAudioPitch: 320,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Transmit directional redirect order over Civil Aviation Guard frequency 121.5 MHz or issue ADS-B route amendment.',
      hardKill: 'STRICTLY PROHIBITED. Firing upon this asset constitutes a catastrophic civilian fratricide Rules of Engagement violation.',
      doctrineAdvice: 'Verify ADS-B registration squawk and maintain passive monitoring. Hold fire under all circumstances.',
    },

    components: [
      { name: 'Insulated Medical Cargo Box', pos: [0, -0.32, 0], desc: 'Holds life-saving emergency medical supplies, blood bags, or pharmaceuticals' },
      { name: 'ADS-B / Remote ID Beacon', pos: [0, 0.15, 0], desc: 'Broadcasts civil registration number, pilot location, and approved flight plan' },
      { name: 'Civil Navigation Strobes', pos: [0.7, 0.08, 0.7], desc: 'Green starboard and red port anti-collision lights required by civil aviation law' },
    ]
  },

  {
    id: 'swarm_decoy',
    name: 'Autonomous Swarm Decoy / Radar Saturator (Boids Distractor)',
    technicalDesignation: 'SW-Decoy-Alpha / Saturation Boids Drone',
    class: 'Autonomous Swarm Drone',
    threatCategory: 'unknown',
    threatLevel: 'HIGH (FORCE MULTIPLIER)',
    role: 'Perimeter Radar Saturation, False Target Injection & Decoy',
    modelType: 'swarm_decoy',
    status: 'ACTIVE SWARM FORCE MULTIPLIER',
    origin: 'Autonomous Swarm Cell Munition',

    // REMOTE RANGE & DATALINK
    remoteRange: {
      maxOperationalRange: '35 - 50 km',
      controlDatalinkRange: 'Inter-Drone Mesh Datalink (Decentralized Ad-Hoc 802.11ah Sub-1GHz)',
      telemetryProtocol: 'Decentralized Craig Reynolds Boids Protocol (Peer-to-Peer Consensus)',
      controlBands: '868 MHz / 915 MHz Mesh Swarm Frequency',
      lineOfSight: 'No single controller required; swarm follows decentralized leaderless flocking logic',
      relayCapability: 'Dynamic packet hopping across all swarm members',
    },

    // WORKING PRINCIPLE & MECHANICS
    workingPrinciple: {
      aerodynamics: 'Compact low-drag spherical or polygonal aerodynamic body optimized for rapid formation changes in gusty winds.',
      propulsion: '3-rotor high-speed tri-copter configuration delivering high maneuverability and rapid angular acceleration.',
      guidance: 'Decentralized distributed computing node executing Boids flocking rules (Separation, Alignment, Cohesion).',
      payload: 'Luneberg radar reflector lens that amplifies the micro-drone radar reflection to simulate a large fighter jet or heavy cruise missile on defense radar screens.',
      launchMethod: 'Multi-barrel canister pneumatic swarm dispenser.',
    },

    // TECHNICAL TELEMETRY SPECIFICATIONS
    specifications: {
      wingspan: '0.45 m Diameter',
      length: '0.40 m',
      maxTakeoffWeight: '1.8 kg',
      warheadWeight: '0 kg (Electronic / Radar Decoy Reflector)',
      maxSpeed: '120 km/h (33 m/s)',
      cruiseSpeed: '90 km/h (25 m/s)',
      serviceCeiling: '2,500 m (8,200 ft) AGL',
      minimumAltitude: '20 m AGL',
      endurance: '22 - 30 Minutes',
      rcs: '1.50 m² (Artificially inflated by Luneberg lens to mimic a jet)',
      thermalSignature: 'Very Low (Small electric motors)',
      acousticFrequency: '520 Hz (High-pitched multi-drone buzz)',
      motorAudioPitch: 520,
    },

    // DEFENCE COUNTERMEASURE & DOCTRINE
    countermeasures: {
      softKill: 'Target the inter-drone mesh frequency (868/915 MHz) with wideband jamming to break swarm cohesion, causing individual units to disperse.',
      hardKill: 'Do not waste expensive high-energy lasers or surface-to-air missiles on decoys; verify optical silhouette before weapon release.',
      doctrineAdvice: 'Correlate radar RCS with optical camera. High radar RCS combined with small optical silhouette signifies a radar decoy designed to waste ammunition.',
    },

    components: [
      { name: 'Luneberg Radar Reflector Lens', pos: [0, 0, 0], desc: 'Artificially magnifies micro radar reflection up to 100x to mislead tracking radars' },
      { name: 'Ad-Hoc Mesh Swarm Transceiver', pos: [0, 0.35, 0], desc: 'Peer-to-peer radio maintaining millimeter synchronization across 20+ swarm drones' },
      { name: 'High-RPM Tri-Rotor Powerplants', pos: [0.52, 0.12, 0], desc: 'Enables erratic sudden direction shifts to divert air defense attention from true attackers' },
    ]
  }
];

export default DRONE_CATALOG;
