import React from 'react';
import { ArrowRight, ShieldAlert, Cpu, Award, Radio, BarChart3, Users, Zap, CheckCircle2, ShieldCheck, Target, Plane } from 'lucide-react';
import { HeroDroneCanvas } from '../components/3d/HeroDroneCanvas';
import { SwarmDemoCanvas } from '../components/3d/SwarmDemoCanvas';
import { TiltCard } from '../components/common/TiltCard';

export function LandingPage({ onStartTraining, onViewDashboard, onGoToLogin, onExploreDrones, lowGraphics = false }) {

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-8 bg-[radial-gradient(circle_at_50%_30%,rgba(179,0,0,0.18)_0%,rgba(10,10,10,0.98)_75%)] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* MoD & SIH Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-ping" />
              <span>SIH 2026 Problem ID: SIH26247</span>
              <span className="text-gray-500">|</span>
              <span className="text-white">Ministry of Defence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-wider text-white leading-tight uppercase">
              AI-Enabled Drone & Counter-Drone <span className="text-[#FF1A1A] glow-red-text">Threat Simulation</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans max-w-xl">
              Equip air defense sentries and Staff College officers to recognize, classify, and neutralize single-drone and coordinated swarm incursions under degraded sensors, electronic warfare, and zero specialized hardware constraints.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartTraining}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-sm transition-all shadow-red-glow group cursor-pointer"
              >
                <span>Start Training</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewDashboard}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#121212] hover:bg-[#1A1A1A] border border-white/15 hover:border-[#FF1A1A]/50 text-white font-heading font-bold text-sm transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-[#FF1A1A]" />
                <span>View Dashboard</span>
              </button>

              {onGoToLogin && (
                <button
                  onClick={onGoToLogin}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#141414] border border-white/15 hover:border-[#FF1A1A] text-white font-heading font-bold text-sm transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#FF1A1A]" />
                  <span>Officer Login</span>
                </button>
              )}

              {onExploreDrones && (
                <button
                  onClick={onExploreDrones}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#141414] border border-white/15 hover:border-amber-500/60 text-white font-heading font-bold text-sm transition-all cursor-pointer"
                >
                  <Plane className="w-4 h-4 text-amber-400" />
                  <span>Drone Arsenal</span>
                </button>
              )}
            </div>


            {/* Hardware-Free Specs Banner */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-gray-400 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Zero GPU / Laptop Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>60 FPS Three.js Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>DSSC Staff Tested</span>
              </div>
            </div>
          </div>

          {/* Right 3D Hero Drone with Red Laser Sweep */}
          <div className="lg:col-span-6 h-[460px] sm:h-[520px] relative">
            <HeroDroneCanvas lowGraphics={lowGraphics} />
          </div>
        </div>
      </section>

      {/* THE PROBLEM vs OUR SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-heading text-[#FF1A1A] uppercase tracking-widest mb-2 font-bold">Tactical Imperative</div>
          <h2 className="text-3xl font-heading font-black text-white sm:text-4xl uppercase tracking-wide">
            Why Modern Drone Threat Training Must Change
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3 font-sans">
            Asymmetric drone warfare has shifted from solitary reconnaissance to saturated boids-flocking swarms. Traditional methods fail to prepare personnel for high-cognitive-load decision making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Pain Points */}
          <TiltCard className="p-8 border-[#B30000]/30 bg-[#121212]/90">
            <div className="w-12 h-12 rounded-xl bg-[#B30000]/15 border border-[#FF1A1A]/40 flex items-center justify-center text-[#FF1A1A] mb-6">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-4 uppercase">The Training Bottleneck</h3>
            <ul className="space-y-4 text-sm text-gray-300 font-sans">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] mt-2 shrink-0" />
                <span><strong className="text-white">High-Cost Live Drills:</strong> Firing live countermeasures and deploying physical drone swarms costs lakhs per hour and depends entirely on clear weather.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] mt-2 shrink-0" />
                <span><strong className="text-white">Classroom Doctrine Gaps:</strong> Slides cannot replicate the panic of split-second Rules of Engagement (ROE) decisions under active electronic warfare jamming.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] mt-2 shrink-0" />
                <span><strong className="text-white">Non-Scalable Equipment:</strong> Unit-level field bases in forward sectors lack specialized multi-million dollar military simulation rigs.</span>
              </li>
            </ul>
          </TiltCard>

          {/* Our Solution */}
          <TiltCard className="p-8 border-[#FF1A1A]/30 bg-[#121212]/90">
            <div className="w-12 h-12 rounded-xl bg-[#B30000]/20 border border-[#FF1A1A]/50 flex items-center justify-center text-[#FF1A1A] mb-6 shadow-red-glow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-4 uppercase">The SkyShield Solution</h3>
            <ul className="space-y-4 text-sm text-gray-300 font-sans">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] mt-2 shrink-0" />
                <span><strong className="text-white">Unit-Level Web Accessibility:</strong> Runs smoothly on standard issue laptops without plugins, installations, or cloud fees.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] mt-2 shrink-0" />
                <span><strong className="text-white">Realistic Sensor Physics:</strong> Radar dropouts, range jitter, thermal obscuration, and EW ghost tracks train sentries to avoid costly mistakes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] mt-2 shrink-0" />
                <span><strong className="text-white">Cognitive Decision-Tree Scoring:</strong> Penalizes civilian fratricide and late reaction times, enforcing strict Indian Armed Forces ROE standards.</span>
              </li>
            </ul>
          </TiltCard>
        </div>
      </section>

      {/* CORE CAPABILITIES & ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-heading text-[#FF1A1A] uppercase tracking-widest mb-2 font-bold">Integrated Platform</div>
          <h2 className="text-3xl font-heading font-black text-white sm:text-4xl uppercase tracking-wide">
            Four Pillars of Tactical Counter-UAS Readiness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Scenarios */}
          <TiltCard className="p-6 bg-[#121212]">
            <div className="w-10 h-10 rounded-lg bg-[#B30000]/15 border border-[#FF1A1A]/30 flex items-center justify-center text-[#FF1A1A] mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-base font-bold text-white mb-2 uppercase">Dynamic Scenarios</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Scripted and procedurally seeded scenarios across urban canyons, coastal batteries, and desert listening posts with day/night thermal optics.
            </p>
          </TiltCard>

          {/* Card 2: Decision Tree Scoring */}
          <TiltCard className="p-6 bg-[#121212]">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-base font-bold text-white mb-2 uppercase">Decision-Tree Scoring</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Step-by-step scoring of detection latency, Mode-5 IFF identification, and graduated escalation: Monitor &rarr; Warn &rarr; Jam &rarr; Kinetic Engage.
            </p>
          </TiltCard>

          {/* Card 3: 3D Replay & AAR */}
          <TiltCard className="p-6 bg-[#121212]">
            <div className="w-10 h-10 rounded-lg bg-[#B30000]/15 border border-[#FF1A1A]/30 flex items-center justify-center text-[#FF1A1A] mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-base font-bold text-white mb-2 uppercase">3D AAR & Analytics</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Interactive 3D flight trajectory replays with timeline scrubbing, unit benchmarks, and automated recurring error diagnosis.
            </p>
          </TiltCard>

          {/* Card 4: Adaptive Difficulty */}
          <TiltCard className="p-6 bg-[#121212]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-base font-bold text-white mb-2 uppercase">Adaptive AI Progression</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Engine autonomously raises swarm count, introduces EW radar spoofing, and tightens response windows as trainee scores improve.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* 3D BOIDS SWARM LIVE DEMO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading text-[#FF1A1A] font-bold uppercase">
                <Cpu className="w-3.5 h-3.5" />
                <span>Autonomous Boids Swarm Engine</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase">
                Real-Time Tactical Swarm Role Assignment
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                Modern adversarial swarms don't fly in straight lines. SkyShield utilizes Craig Reynolds' separation, alignment, and cohesion boids algorithms enhanced with military doctrine roles:
              </p>
              <div className="space-y-2.5 font-mono text-xs text-gray-200">
                <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#38BDF8] shrink-0" />
                  <div><strong>Scouts:</strong> Probe radar boundaries and test air defense detection azimuths.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <div><strong>Decoys:</strong> Execute erratic maneuvers and emit RF noise to distract operators.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF1A1A] shrink-0" />
                  <div><strong>Attackers:</strong> Hold disciplined echelon formation then execute diving kamikaze runs.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <SwarmDemoCanvas lowGraphics={lowGraphics} />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-2xl bg-[#121212] border border-[#FF1A1A]/40 shadow-red-glow relative overflow-hidden">
          <div className="absolute inset-0 tactical-grid-bg opacity-20" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-heading font-black text-white uppercase">
              Ready to Test Your Counter-UAS Reflexes?
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base font-sans">
              Launch a pre-configured DSSC staff scenario or generate a randomized procedural seed now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onStartTraining}
                className="px-8 py-3.5 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-sm transition-all shadow-red-glow cursor-pointer"
              >
                Launch Scenario Builder
              </button>
              <button
                onClick={onViewDashboard}
                className="px-8 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-white font-heading font-bold text-sm transition-all cursor-pointer"
              >
                Inspect Unit AAR Records
              </button>
              {onGoToLogin && (
                <button
                  onClick={onGoToLogin}
                  className="px-8 py-3.5 rounded-xl bg-[#141414] border border-white/15 hover:border-[#FF1A1A] text-white font-heading font-bold text-sm transition-all cursor-pointer"
                >
                  Officer Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

