import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Download } from 'lucide-react';

import { ReplayViewerCanvas } from '../components/3d/ReplayViewerCanvas';
import { TimelineScrubber } from '../components/aar/TimelineScrubber';
import { TraineeTrendsChart } from '../components/aar/TraineeTrendsChart';
import { UnitComparisonChart } from '../components/aar/UnitComparisonChart';
import { MistakeAnalysisList } from '../components/aar/MistakeAnalysisList';
import { exportSessionReportPDF } from '../components/instructor/ReportExporter';
import { dataLayer } from '../data/dataLayer';
import { useSettings } from '../context/SettingsContext';


export function AARPage({ onLaunchRemediationDrill }) {
  const { activeTrainee, lowGraphics } = useSettings();
  const [sessions, setSessions] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [unitAnalytics, setUnitAnalytics] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function loadData() {
      const allSessions = await dataLayer.getSessions();
      const allTrainees = await dataLayer.getTrainees();
      const analytics = await dataLayer.getUnitAnalytics();

      setSessions(allSessions);
      setTrainees(allTrainees);
      setUnitAnalytics(analytics);

      if (allSessions.length > 0) {
        setSelectedSession(allSessions[0]);
      }
    }
    loadData();
  }, [activeTrainee]);

  useEffect(() => {
    let anim;
    if (isPlaying && selectedSession) {
      const maxDur = selectedSession.duration || 60;
      anim = setInterval(() => {
        setCurrentTime(t => {
          if (t >= maxDur) {
            setIsPlaying(false);
            return 0;
          }
          return t + 0.5;
        });
      }, 500);
    }
    return () => clearInterval(anim);
  }, [isPlaying, selectedSession]);

  const replayEvents = [];
  (selectedSession?.replayFlightData || []).forEach(drone => {
    (drone.points || []).forEach(pt => {
      if (pt.event) {
        replayEvents.push({ time: pt.time, event: `${drone.callsign}: ${pt.event}` });
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B30000]/15 border border-[#FF1A1A]/30 text-xs font-heading font-bold text-[#FF1A1A] mb-2 uppercase">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>After-Action Review & Telemetry Analytics</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider">
            Tactical AAR Dashboard
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            Reconstruct engagement geometries, review unit qualification trends, and diagnose recurring tactical errors.
          </p>
        </div>

        {/* Selected Session Pill & Export Button */}
        {selectedSession && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121212] border border-white/10 font-mono text-xs">
              <span className="text-gray-400">REPLAYING:</span>
              <span className="text-white font-bold">{selectedSession.scenarioName}</span>
              <span className="text-[#FF1A1A]">[{selectedSession.seed}]</span>
              <span className="px-2 py-0.5 rounded bg-[#B30000]/20 text-[#FF1A1A] border border-[#FF1A1A]/30 font-bold">
                {selectedSession.overallScore}%
              </span>
            </div>

            <button
              onClick={() => exportSessionReportPDF(selectedSession, activeTrainee)}
              className="px-4 py-2 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-mono text-xs font-bold flex items-center gap-2 shadow-red-glow transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Dossier</span>
            </button>
          </div>
        )}
      </div>


      {/* 3D FLIGHT PATH REPLAY SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-heading text-sm font-bold text-white uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#FF1A1A]" />
            <span>3D Mission Trajectory Replay</span>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Drag to rotate 3D engagement cone • Scrubber syncs drone kinematics
          </span>
        </div>

        {/* 3D Replay Canvas */}
        <ReplayViewerCanvas
          flightData={selectedSession?.replayFlightData || []}
          currentTime={currentTime}
          terrain="urban"
          lowGraphics={lowGraphics}
        />

        {/* Timeline Scrubber */}
        <TimelineScrubber
          currentTime={currentTime}
          maxDuration={selectedSession?.duration || 60}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSeek={(t) => setCurrentTime(t)}
          events={replayEvents}
        />
      </div>

      {/* HISTORICAL SESSIONS RAIL */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
            Archived Training Missions ({sessions.length})
          </span>
          <span className="text-xs font-mono text-gray-400">
            Click to load session into 3D Replayer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sessions.slice(0, 6).map(s => {
            const isSelected = selectedSession?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSession(s);
                  setCurrentTime(0);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#B30000]/15 border-[#FF1A1A] shadow-red-glow-sm'
                    : 'bg-[#0A0A0A] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white truncate max-w-[170px]">
                    {s.scenarioName || 'Tactical Drill'}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FF1A1A]">
                    {s.overallScore}%
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
                  <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                  <span>Trainee: {s.traineeName || 'Officer'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRENDS & UNIT COMPARISON CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TraineeTrendsChart sessions={sessions} />
        <UnitComparisonChart trainees={trainees} />
      </div>

      {/* MISTAKE DIAGNOSTICS */}
      <MistakeAnalysisList
        commonMistakes={unitAnalytics?.commonMistakes}
        onPracticeMistake={onLaunchRemediationDrill}
      />
    </div>
  );
}

