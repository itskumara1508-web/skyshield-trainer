import React, { useState } from 'react';
import { GitBranch, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Eye } from 'lucide-react';
import { Badge } from '../common/Badge';

export function DecisionTreeVisualizer({ contactEvaluations = [] }) {
  const [selectedContactIdx, setSelectedContactIdx] = useState(0);

  if (contactEvaluations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 font-mono text-sm">
        No contact decision trees recorded for this session.
      </div>
    );
  }

  const activeEval = contactEvaluations[selectedContactIdx] || contactEvaluations[0];

  const getStatusIcon = (status) => {
    if (status === 'optimal') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === 'critical_failure') return <XCircle className="w-4 h-4 text-[#FF1A1A]" />;
    return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  };

  const getStatusBg = (status) => {
    if (status === 'optimal') return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
    if (status === 'critical_failure') return 'bg-[#B30000]/20 border-[#FF1A1A]/50 text-[#FF1A1A]';
    return 'bg-amber-500/10 border-amber-500/40 text-amber-400';
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <GitBranch className="w-5 h-5 text-[#FF1A1A]" />
          <div>
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Decision Path vs Optimal Doctrine
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Step-by-step decision tree comparison across Detection, Classification & ROE
            </p>
          </div>
        </div>

        {/* Contact Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 font-mono">
          {contactEvaluations.map((c, idx) => (
            <button
              key={c.contactId}
              onClick={() => setSelectedContactIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedContactIdx === idx
                  ? 'bg-[#B30000]/20 border-[#FF1A1A] text-[#FF1A1A] shadow-red-glow-sm font-bold'
                  : 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {c.callsign || c.contactId}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Contact Summary Card */}
      <div className="mb-6 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#121212] flex items-center justify-center font-mono font-bold text-[#FF1A1A] border border-white/10">
            #{selectedContactIdx + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">{activeEval.callsign}</span>
              <Badge category={activeEval.trueCategory} label={`ACTUAL: ${activeEval.trueCategory}`} size="sm" />
              {activeEval.isGhost && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-gray-300">
                  RADAR CLUTTER GHOST
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">
              Trainee classified as: <span className="text-white font-bold uppercase">{activeEval.traineeClass}</span> | Action taken: <span className="text-[#FF1A1A] font-bold uppercase">{activeEval.traineeResponse.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Contact Score Scoreboard */}
        <div className="text-right font-mono">
          <div className="text-xs text-gray-400">Decision Tree Points</div>
          <div className={`text-xl font-bold ${activeEval.totalPoints >= 80 ? 'text-emerald-400' : activeEval.totalPoints >= 50 ? 'text-amber-400' : 'text-[#FF1A1A]'}`}>
            {activeEval.totalPoints} <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Decision Tree Nodes: Trainee Path vs Optimal Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainee Path */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-heading text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" /> Trainee Decision Path
            </span>
            <span className="text-[10px] font-mono text-gray-500">Actual Actions Logged</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {activeEval.traineeNodes.map((node, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${getStatusBg(node.status)} flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-2.5">
                  {getStatusIcon(node.status)}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">{node.stage}</div>
                    <div className="font-semibold text-white">{node.action}</div>
                  </div>
                </div>
                <div className="font-bold shrink-0">
                  {node.score > 0 ? `+${node.score}` : node.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimal Path */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-heading text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Optimal MoD Doctrine Path
            </span>
            <span className="text-[10px] font-mono text-gray-500">Standard Operating Procedure</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {activeEval.optimalNodes.map((node, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/40 text-emerald-400 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">{node.stage}</div>
                    <div className="font-semibold text-white">{node.action}</div>
                  </div>
                </div>
                <div className="font-bold shrink-0">
                  +{node.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tactical Feedback Note */}
      <div className="mt-5 p-4 rounded-xl bg-[#0A0A0A] border border-[#FF1A1A]/30 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#B30000]/20 flex items-center justify-center text-[#FF1A1A] shrink-0">
          <CheckCircle2 className="w-4 h-4 text-[#FF1A1A]" />
        </div>
        <div>
          <div className="font-heading text-xs font-bold text-[#FF1A1A] uppercase tracking-wide">
            Tactical Doctrine Assessment
          </div>
          <p className="text-xs text-gray-300 mt-0.5 leading-relaxed font-sans">
            {activeEval.feedbackNote}
          </p>
        </div>
      </div>
    </div>
  );
}

