# SkyShield Trainer
### AI-Enabled Drone & Counter-Drone Threat Simulation Platform
**Smart India Hackathon 2026** | **Problem Statement ID: SIH26247**  
**Organization:** Ministry of Defence (MoD), Defence Services Staff College (DSSC)  
**Category:** Software | **Theme:** Robotics and Drones

---

## 1. Executive Summary & Purpose

Modern low-altitude air defense perimeters face asymmetric challenges from commercially derived micro-UAVs, loitering munitions, and coordinated drone swarms. Conventional military air defense instruction depends on rigid classroom doctrine and prohibitively expensive, weather-dependent live-fire range drills that do not scale.

**SkyShield Trainer** solves this gap by delivering an interactive, browser-based tactical counter-UAS training simulator engineered to run smoothly at 60 FPS on standard issue laptops without specialized gaming GPUs or proprietary defense hardware. Sentries and Staff College officers are trained to acquire, classify, and neutralize asymmetric aerial threats across diverse operational environments (day/night, degraded optical sensors, heavy electronic warfare jamming, and dense urban/mountain terrain).

---

## 2. Key Architecture & Features

### 🎮 1. Real-Time 3D Tactical Airspace Simulator
- **Procedural 3D Geometry:** All interceptors, loitering munitions, hexacopters, radar domes, and command citadels are procedurally generated using Three.js primitives—eliminating asset loading failures, network lag, and heavy `.gltf` memory footprints.
- **Dynamic Terrains & Optics:** Seamless toggle between daytime electro-optical (EO) surveillance and nighttime long-wave thermal infrared (LWIR) imaging with atmospheric haze, rain scatter, and desert sandstorms.
- **Defended Asset Envelope:** Interactive base perimeter with real-time base armor telemetry, radar ring azimuth sweeps, and laser directed-energy intercept effects.

### 🧠 2. Dual-Engine Autonomous Threat Kinematics
- **Single-Drone Hierarchical Behavior Trees:** Independent autonomous profiles executing Reconnaissance, Perimeter Loiter, Terminal Attack Dives, and Evasive Retreat maneuvers based on base proximity.
- **Craig Reynolds' Decentralized Boids Flocking:** Multi-drone swarm simulation incorporating separation, cohesion, and alignment forces augmented with tactical military roles:
  - **Scouts (Cyan):** Probe perimeter radar coverage to map blind zones.
  - **Decoys (Amber):** Emit high-RCS radar reflectors and erratic flight paths to distract operators.
  - **Attackers (Laser Red):** Maintain echelon formation before initiating synchronized multi-vector terminal strike runs.

### 📡 3. Sensor Degradation & Electronic Warfare (EW) Simulator
- Simulates radar clutter, false track ghost generation, optical dropouts, thermal inversion wash, and stand-off noise jamming.
- Operators must triage between degraded radar strobes and secondary electro-optical/acoustic sensors to establish target tracks.

### 🌲 4. Decision-Tree Scoring & Rules of Engagement (ROE) Audit
- Evaluates every trainee decision across a 3-stage decision tree:
  1. **Acquisition Speed:** Benchmark `< 4.0s` from radar emergence to operator flagging.
  2. **Mode-5 IFF Classification:** Discriminating hostile strike munitions from friendly transit corridors and benign civilian delivery drones.
  3. **Graduated ROE Ladder:** Adherence to standard operating procedures: `Monitor` &rarr; `Warn` &rarr; `RF Jam (Escalate)` &rarr; `Kinetic Intercept (Engage)`.
- **Fratricide & Civilian Penalties:** Severe point deductions and disqualification triggers for firing on benign or friendly tracks.

### 📊 5. 3D After-Action Review (AAR) & Unit Telemetry
- **3D Trajectory Replay:** Interactive scrubbable 3D timeline showing actual flight paths with color-coded glowing flight trails (Hostile: Red, Friendly: Green, Benign: Cyan).
- **Unit Comparison & Trend Charts:** Recharts analytics comparing detection latency, IFF accuracy, and qualification progression across officers and armed service commands.
- **Automated Mistake Diagnosis:** Pattern detection identifying recurring weaknesses (e.g. decoy fixation, jammer hesitation, premature engagement).

### 📈 6. Adaptive Difficulty AI Progression
- Evaluates rolling performance over the last 3 sorties:
  - Automatically elevates parameters (Level 1 Initiate to Level 5 Apex Perimeter) by increasing swarm size, velocity vectors, electronic noise, and reducing intercept time windows.

### 📜 7. Official MoD Dossier & Data Export
- One-click certified PDF After-Action Dossier generator (`jsPDF`) with military metadata, decision-tree audit trails, and official seal.
- Comprehensive CSV exporter for integration into ADGES / command databases.

### 🪪 8. Military Authentication & Officer Command Dashboard
- **Dedicated Login Gateway:** Service Number & Tactical PIN verification, 1-Click Officer Roster (*Maj. Vikramaditya Rathore*, *Sqn Ldr Ananya Sharma*, *Col. Devendra Rana*), or Cadet Express Access.
- **Officer Mission Command Dashboard:** Immediate post-login central entry screen displaying:
  - Active military clearance & duty status (`TOP SECRET // NOFORN`)
  - Real-time readiness metrics (Air Defense Score: 94%, IFF Accuracy: 96%, Latency: 3.4s, Sorties: 38)
  - Active airspace threat advisory warnings
  - Direct 5-gateway portals into **3D Tactical Simulator**, **Scenario Builder**, **Threat Intel Library**, **3D AAR Analytics**, and **Instructor Directorate**
  - Recent operational sorties feed with past drill scores and AAR links
- **Session Management:** Local storage enclave with dynamic duty status, switch-operator capability, and one-click duty logout.

### 📚 9. Threat Intel & Drone Recognition Library
- **Interactive 3D Technical Airframe Inspection:** 360° inspection of major asymmetric aerial threat platforms (Shahed-style Delta-Wing Loitering Munitions, Commercial Quadcopter IED Droppers, High-Speed FPV Kamikaze Strikers, Heavy Hexacopter Munition Carriers, Fixed-Wing Surveillance UAVs, and Authorized Civilian Courier Drones).
- **Multi-Sensor Signatures:** Real-time toggling between Optical Daylight Silhouettes and Long-Wave Infrared (LWIR) Thermal Exhaust Heatmaps.
- **Acoustic Motor Synthesizer:** Procedural Web Audio playback of authentic motor/engine pitch profiles (e.g. 110 Hz 2-stroke lawnmower gas engine, 480 Hz multi-rotor electric whine, 750 Hz scream).
- **RF Spectrum & Vulnerability Matrix:** Detailed breakdown of ISM bands, GNSS satellite dependencies, radar cross-sections (RCS in m²), and DSSC doctrinal countermeasure recommendations.

### 🎯 10. Sentry Rapid Drone Recognition & IFF Flashcard Drill
- **Timed 60-Second Reaction Drill:** Simulates the critical 5-10 second decision window experienced by sentries at forward operating bases and border checkpoints.
- **Dynamic Target Scenarios:** Rapid visual observation cards with live telemetry (speed, altitude, RCS, control frequencies, and acoustic motor audio playback).
- **Graduated Scoring & ROE Penalties:** Instant feedback awarding speed bonuses for sub-3-second hostile acquisitions while severely penalizing fratricide errors on civilian or friendly assets.
- **Qualification Dossier Logging:** Saves certified qualification status (e.g. *Tier-1 Master Air Sentry*) directly into the officer's permanent service record in `dataLayer`.

### 🎙️ 11. Procedural Military Tactical Voice Comms
- **Zero-Network Voice Alerts:** Integrated via the native Web Speech API to provide authoritative tactical radio announcements with zero external API calls or network latency.
- **Tactical Audio Callouts:** Automated voice announcements for radar grid initialization, hostile swarm ingress detection, target acquisition locks, laser fire authorization, splash confirmations, civilian ROE breach alerts, and sector secure status.

### ⚡ 12. Electronic Warfare (EW) & RF Jamming Shockwave Suite
- **Directional RF Jammer:** Disables 2.4 GHz & 5.8 GHz ISM telemetry links, causing multi-rotor drones to enter failsafe descent.
- **Animated 3D Shockwave Pulse:** Procedural expanding electromagnetic wave rings radiating across the 3D battlefield upon ECM activation.
- **Acoustic RF Static Synthesizer:** Multi-band procedural white noise and electronic warble feedback.

### ⚙️ 13. Comprehensive Station Settings & Calibration
- **Fidelity Controls:** Low Graphics / Performance mode, reduce motion toggle, camera FOV adjustment (38° to 65°), dynamic particles.
- **Audio Synthesizer Controls:** Master audio toggle, volume slider, individual mute switches for radar blips, alarms, and weapon firings with audio test chirp.
- **Adaptive Difficulty AI Governor:** Autonomous vs Manual level lock (Levels 1 to 5) with ROE strictness configuration.
### 🛠️ 14. Tactical Threat Scenario Builder & Mission Architect
- **8 Official Certified DSSC Scenarios:** Covering diverse operational theatres (Himalayan LAC 4,500m, Urban Citadels, Western Desert Frontiers, Littoral Naval Ports, Refineries, Airbase Runways, and Mobile Highway Convoys).
- **Interactive 2D PPI Radar Scope:** Plan Position Indicator with 100m Kill Zone, 200m Engagement Zone, and 300m Search rings, animated ingress trajectory preview, and contact inspection.
- **Deterministic Seed Engine:** Mulberry32 PRNG ensuring 100% reproducible tactical sorties for multi-laptop competitive drills.
- **Custom Fleet Architect:** Granular drone-by-drone spawner allowing custom bearing angles, altitudes, speeds, delay intervals, and RF bands.
- **Military OPORD Briefing Sheet:** Authentic 5-paragraph operational orders format with commander's intent and rules of engagement (ROE).
- **Interoperable JSON Exchange:** Direct scenario export and drag-and-drop JSON import.

---


## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Build** | React 18, Vite 5, Tailwind CSS |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Data Analytics** | Recharts (Responsive Line, Bar, and Radar charts) |
| **Audio Synthesizer** | Web Audio API (procedural radar pings, firing audio, alarms) |
| **Report Generation** | jsPDF (official vector PDF dossiers), CSV Blob streaming |
| **Persistence** | Zero-backend LocalStorage / IndexedDB repository facade |
| **Icons & Typography** | Lucide React, Orbitron, Rajdhani, JetBrains Mono, Inter |

---

## 4. Color Palette & Visual Identity

Engineered strictly according to military command-and-control specifications:
- **Deep Black Background:** `#0A0A0A` / `#050505`
- **Dark Tactical Surfaces:** `#121212` / `#161616` / `#1C1C1C`
- **Primary Brand Red:** `#B30000`
- **Neon Laser Glow / Accent:** `#FF1A1A` (`shadow-laser-glow`, `glow-red-text`)
- **IFF Threat Categories:**
  - Hostile: `#FF1A1A` / `#B30000`
  - Unknown: `#F59E0B` (Amber)
  - Friendly: `#22C55E` (Emerald)
  - Benign: `#38BDF8` (Sky Blue)
- **Indian National Tri-Colour:** Saffron `#FF9933`, White `#FFFFFF`, Green `#138808`

---

## 5. Keyboard Shortcuts (Simulator Mode)

| Hotkey | Tactical Action |
|---|---|
| `[Space]` | **Flag / Acquire** current selected contact |
| `[1]` / `[H]` | Classify selected track as **HOSTILE** |
| `[2]` / `[F]` | Classify selected track as **FRIENDLY** |
| `[3]` / `[B]` | Classify selected track as **BENIGN** |
| `[4]` / `[U]` | Reset track to **UNKNOWN** |
| `[M]` | Order **MONITOR** (Passive Surveillance) |
| `[W]` | Issue **WARN** (Civilian Guard Frequency Broadcast) |
| `[J]` / `[S]` | Order **JAM / ESCALATE** (Directional RF Jammer) |
| `[E]` / `[K]` | Authorize **FIRE / ENGAGE** (Directed-Energy Laser Intercept) |
| `[Tab]` | Cycle between active airspace tracks |
| `[N]` | Toggle Day Optical vs Night Thermal IR |
| `[P]` | Pause / Resume Mission Clock |

---

## 6. Installation & Quick Start

### Prerequisites
- Node.js 18.x or 20.x
- Modern web browser with WebGL 2.0 support (Chrome, Edge, Firefox, Safari)

### Run Locally
```bash
# 1. Clone repository and navigate to folder
cd "SIH 2.O"

# 2. Install dependencies
npm install

# 3. Start high-performance Vite dev server
npm run dev

# 4. Open browser at
# http://localhost:5173
```

### Production Build
```bash
# Build optimized static production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Operational Safety Notice
*SkyShield Trainer is an abstract procedural educational simulator developed exclusively for tactical training and research evaluation under Smart India Hackathon 2026. All threat kinematics, radar cross-sections, RF bands, and engagement algorithms are synthetic and do not disclose real-world classified weapon specifications or targeting data.*

