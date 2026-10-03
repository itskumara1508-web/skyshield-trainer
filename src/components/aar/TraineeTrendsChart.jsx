import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export function TraineeTrendsChart({ sessions = [] }) {
  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 font-mono text-sm">
        No past sessions recorded for trend analysis.
      </div>
    );
  }

  const chartData = [...sessions].reverse().map((s, idx) => ({
    name: `Drill ${idx + 1}`,
    score: s.overallScore,
    latency: s.avgDetectionLatency,
    accuracy: s.classificationAccuracy,
    roe: s.roeAdherence,
    date: new Date(s.timestamp).toLocaleDateString()
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-white/20 p-3 rounded-xl shadow-2xl font-mono text-xs">
          <div className="text-white font-bold mb-1">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value} {entry.unit || ''}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div>
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Trainee Performance Progression
          </h3>
          <p className="text-xs text-gray-400 font-sans">
            Historical scores, reaction times, and Rules of Engagement (ROE) trends
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#FF1A1A] px-2 py-0.5 rounded bg-[#B30000]/15 border border-[#FF1A1A]/30 font-bold">
          {sessions.length} SESSIONS RECORDED
        </span>
      </div>

      <div className="h-72 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.6} />
            <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888' }} />
            <YAxis stroke="#888888" tick={{ fill: '#888888' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="score"
              name="Overall Score"
              unit="%"
              stroke="#FF1A1A"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#FF1A1A' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Classification Accuracy"
              unit="%"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22C55E' }}
            />
            <Line
              type="monotone"
              dataKey="roe"
              name="ROE Adherence"
              unit="%"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 3, fill: '#F59E0B' }}
            />
            <Line
              type="monotone"
              dataKey="latency"
              name="Detection Latency"
              unit="s"
              stroke="#B30000"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

