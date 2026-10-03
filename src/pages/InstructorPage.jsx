import React, { useState, useEffect } from 'react';
import { Users, Plus, Radio, RefreshCw, Trash2, Edit } from 'lucide-react';
import { dataLayer } from '../data/dataLayer';
import { TraineeRosterTable } from '../components/instructor/TraineeRosterTable';
import { ScenarioEditorModal } from '../components/instructor/ScenarioEditorModal';
import { Badge } from '../components/common/Badge';

export function InstructorPage() {
  const [trainees, setTrainees] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);

  const loadAll = async () => {
    const t = await dataLayer.getTrainees();
    const s = await dataLayer.getScenarios();
    const a = await dataLayer.getUnitAnalytics();
    setTrainees(t);
    setScenarios(s);
    setAnalytics(a);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveScenario = async (scenario) => {
    await dataLayer.saveScenario(scenario);
    await loadAll();
  };

  const handleDeleteScenario = async (id) => {
    if (confirm('Are you sure you want to delete this certified scenario?')) {
      await dataLayer.deleteScenario(id);
      await loadAll();
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset all scenarios, trainees, and session telemetry to DSSC factory defaults?')) {
      await dataLayer.resetToDefaults();
      await loadAll();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] mb-2 uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Chief Instructor Control Interface</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider">
            DSSC Air Defence Instructor Portal
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            Author scripted tactical scenarios, supervise student officers, and issue certified qualification reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white text-xs font-mono"
            title="Reset data to default sample set"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => {
              setEditingScenario(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase transition-all shadow-red-glow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Author New Scenario</span>
          </button>
        </div>
      </div>

      {/* UNIT READINESS METRICS BANNER */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#121212] border border-white/10 font-mono">
            <span className="text-[10px] text-gray-400 uppercase block">Active Course Personnel</span>
            <span className="text-2xl font-bold text-white">{analytics.totalTrainees} Officers</span>
            <span className="text-[10px] text-[#FF1A1A] block mt-1 font-bold">100% Tracked</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-white/10 font-mono">
            <span className="text-[10px] text-gray-400 uppercase block">Combat Ready Rate</span>
            <span className="text-2xl font-bold text-emerald-400">{analytics.readinessRate}%</span>
            <span className="text-[10px] text-emerald-400 block mt-1">{analytics.combatReadyCount} Certified Operators</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-white/10 font-mono">
            <span className="text-[10px] text-gray-400 uppercase block">Avg Unit Score</span>
            <span className="text-2xl font-bold text-[#FF1A1A]">{analytics.avgUnitScore}%</span>
            <span className="text-[10px] text-gray-400 block mt-1">Passing threshold: 70%</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-white/10 font-mono">
            <span className="text-[10px] text-gray-400 uppercase block">Avg Reaction Latency</span>
            <span className="text-2xl font-bold text-amber-400">{analytics.avgDetection}s</span>
            <span className="text-[10px] text-gray-400 block mt-1">Target: &lt; 4.0s</span>
          </div>
        </div>
      )}

      {/* SCRIPTED SCENARIOS MANAGEMENT */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#FF1A1A]" />
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Instructor Scripted Scenarios ({scenarios.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Shared JSON Schema format across procedural & scripted drills
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map(sc => (
            <div key={sc.id} className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading text-sm font-bold text-white uppercase">{sc.name}</span>
                  <Badge category={sc.threatType === 'swarm' ? 'hostile' : 'unknown'} label={`${sc.swarmSize} UAV(s)`} size="sm" />
                </div>
                <div className="text-[11px] font-mono text-[#FF1A1A] mb-2">{sc.location}</div>
                <p className="text-xs text-gray-400 font-sans line-clamp-2 mb-3">{sc.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 text-[10px]">SEED: {sc.seed}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingScenario(sc);
                      setIsEditorOpen(true);
                    }}
                    className="p-1 rounded hover:bg-white/10 text-[#FF1A1A]"
                    title="Edit Scenario"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteScenario(sc.id)}
                    className="p-1 rounded hover:bg-white/10 text-red-500"
                    title="Delete Scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRAINEE ROSTER TABLE */}
      <TraineeRosterTable
        trainees={trainees}
        onSelectTrainee={(t) => {
          alert(`Viewing officer record: ${t.rank} ${t.name} (${t.unit}). Average score: ${t.avgScore}%, Qualification: ${t.qualificationStatus}`);
        }}
      />

      {/* SCENARIO EDITOR MODAL */}
      {isEditorOpen && (
        <ScenarioEditorModal
          initialScenario={editingScenario}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveScenario}
        />
      )}
    </div>
  );
}

