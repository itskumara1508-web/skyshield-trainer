import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, Download, ArrowRight } from 'lucide-react';
import { dataLayer } from '../data/dataLayer';
import { DecisionTreeVisualizer } from '../components/scoring/DecisionTreeVisualizer';
import { exportSessionReportPDF } from '../components/instructor/ReportExporter';
import { useSettings } from '../context/SettingsContext';

export function ScoringPage({ onGoToAAR, onRetryScenario }) {
  const { activeTrainee } = useSettings();
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadLatestResult() {
      let data = dataLayer.getLatestResult();
      if (!data) {
        const sessions = await dataLayer.getSessions();
        if (sessions.length > 0) {
          data = sessions[0];
        }
      }
      setResult(data);

      if (data && data.overallScore >= 80) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF1A1A', '#B30000', '#FFFFFF', '#F59E0B']
          });
        } catch {}
      }
    }
    loadLatestResult();
  }, []);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono space-y-4">
        <h2 className="text-xl font-bold text-white">No Session Results Available</h2>
        <p className="text-gray-400 text-xs">Run a tactical drill in the simulator to generate scored AAR data.</p>
      </div>
    );
  }

  const isPassing = result.overallScore >= 70;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Status Banner */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B30000]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF1A1A]" />
              <span className="font-heading text-xs text-[#FF1A1A] uppercase tracking-wider font-bold">
                Mission Scoring & Decision-Tree Debrief
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase">
              Tactical Evaluation: {result.scenarioName || 'Air Defense Drill'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
              <span>SEED: <strong className="text-white">{result.seed}</strong></span>
              <span>•</span>
              <span>TRAINEE: <strong className="text-white">{activeTrainee?.name || 'Staff Officer'}</strong></span>
              <span>•</span>
              <span>DURATION: <strong className="text-[#FF1A1A]">{result.duration}s</strong></span>
            </div>
          </div>

          {/* Grade & Score Pill */}
          <div className="flex items-center gap-5 bg-[#0A0A0A] border border-white/15 p-4 rounded-xl shadow-lg">
            <div className="text-center font-mono">
              <div className="text-[10px] text-gray-400 uppercase">Grade</div>
              <div className={`text-4xl font-extrabold ${isPassing ? 'text-emerald-400' : 'text-[#FF1A1A]'}`}>
                {result.grade}
              </div>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="text-center font-mono">
              <div className="text-[10px] text-gray-400 uppercase">Score</div>
              <div className={`text-4xl font-extrabold ${result.overallScore >= 80 ? 'text-[#FF1A1A] glow-red-text' : result.overallScore >= 60 ? 'text-amber-400' : 'text-red-500'}`}>
                {result.overallScore}%
              </div>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Qualification</div>
              <div className="font-heading text-xs font-bold text-white mt-0.5 uppercase tracking-wide">{result.badge}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Score Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        {/* Detection Latency */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-xs text-gray-400 uppercase mb-1">Detection Latency</div>
          <div className="text-2xl font-bold text-[#FF1A1A]">
            {result.avgDetectionLatency ? `${result.avgDetectionLatency}s` : '--'}
          </div>
          <p className="text-[11px] text-gray-400 font-sans mt-2">
            Target benchmark: &lt; 4.0s. Trainee reaction time from radar appearance to acquisition.
          </p>
        </div>

        {/* Classification Accuracy */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-xs text-gray-400 uppercase mb-1">Classification Accuracy</div>
          <div className="text-2xl font-bold text-emerald-400">
            {result.classificationAccuracy}%
          </div>
          <p className="text-[11px] text-gray-400 font-sans mt-2">
            Mode-5 IFF identification and hostile vs benign civilian discrimination.
          </p>
        </div>

        {/* ROE Adherence */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-xs text-gray-400 uppercase mb-1">ROE Adherence</div>
          <div className="text-2xl font-bold text-amber-400">
            {result.roeAdherence}%
          </div>
          <p className="text-[11px] text-gray-400 font-sans mt-2">
            Graduated escalation adherence (Monitor &rarr; Warn &rarr; Jam &rarr; Kinetic Engage).
          </p>
        </div>

        {/* Penalties */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10">
          <div className="text-xs text-gray-400 uppercase mb-1">ROE Penalties</div>
          <div className={`text-2xl font-bold ${result.civilianFratricideCount > 0 ? 'text-[#FF1A1A]' : 'text-emerald-400'}`}>
            {result.civilianFratricideCount > 0 ? `-${result.civilianFratricideCount * 60} PTS` : 'ZERO PENALTY'}
          </div>
          <p className="text-[11px] text-gray-400 font-sans mt-2">
            {result.civilianFratricideCount > 0
              ? 'Critical violation: civilian or friendly drone engaged with kinetic weapons.'
              : 'Flawless trigger discipline: no civilian or friendly collateral damage.'}
          </p>
        </div>
      </div>

      {/* Decision-Tree Visualizer */}
      <DecisionTreeVisualizer contactEvaluations={result.contactEvaluations} />

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-[#121212] border border-white/10 font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportSessionReportPDF(result, activeTrainee)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/15 hover:border-[#FF1A1A] text-[#FF1A1A] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Certified PDF Dossier</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetryScenario}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/15 hover:border-white text-white text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay This Drill</span>
          </button>

          <button
            onClick={onGoToAAR}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#B30000] hover:bg-[#FF1A1A] text-white text-xs font-bold transition-all shadow-red-glow cursor-pointer"
          >
            <span>Proceed to 3D AAR Replay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

