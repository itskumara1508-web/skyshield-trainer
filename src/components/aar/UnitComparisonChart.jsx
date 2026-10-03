import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export function UnitComparisonChart({ trainees = [] }) {
  if (trainees.length === 0) return null;

  const data = trainees.slice(0, 8).map(t => ({
    name: t.name.split(' ').slice(-1)[0],
    fullName: t.name,
    score: t.avgScore,
    accuracy: t.classificationAccuracy,
    roe: t.roeAdherence,
    latency: t.avgDetectionTime
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.name === label);
      return (
        <div className="bg-[#050505] border border-white/20 p-3 rounded-xl shadow-2xl font-mono text-xs">
          <div className="text-white font-bold mb-1">{item?.fullName || label}</div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}%</span>
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
            Unit-Level Trainee Benchmark
          </h3>
          <p className="text-xs text-gray-400 font-sans">
            Comparative performance across Staff Course and Operational Unit personnel
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#FF1A1A] px-2 py-0.5 rounded bg-[#B30000]/15 border border-[#FF1A1A]/30 font-bold">
          BENCHMARKING
        </span>
      </div>

      <div className="h-72 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.6} />
            <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888' }} />
            <YAxis stroke="#888888" tick={{ fill: '#888888' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="score" name="Average Score" fill="#FF1A1A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="accuracy" name="Classification %" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="roe" name="ROE Adherence %" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

