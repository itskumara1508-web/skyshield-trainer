import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Crosshair, Shield, Eye, Info } from 'lucide-react';

/**
 * TacticalRadarMap
 * 2D Interactive Plan Position Indicator (PPI) Radar Scope for Tactical Ingress Visualization
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 */
export function TacticalRadarMap({ scenario, selectedContactId, onSelectContact }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animTime, setAnimTime] = useState(0); // 0 to 15 seconds
  const [hoveredContact, setHoveredContact] = useState(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const contacts = scenario?.contacts || scenario?.threats || [];
  const maxRadius = 320; // meters on map
  const svgSize = 360;
  const center = svgSize / 2;
  const scale = (svgSize / 2 - 24) / maxRadius; // scale factor to fit 320m in viewBox

  // Reset animation when scenario changes
  useEffect(() => {
    setIsPlaying(false);
    setAnimTime(0);
  }, [scenario?.id, scenario?.seed]);

  // Animation loop for simulating ingress
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTimeRef.current = Date.now();
    const tick = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setAnimTime((prev) => {
        const next = prev + dt * 1.5; // 1.5x simulation speed
        if (next >= 15) {
          setIsPlaying(false);
          return 15;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (animTime >= 15) {
      setAnimTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetAnim = () => {
    setIsPlaying(false);
    setAnimTime(0);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Radar Scope Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#FF1A1A] animate-pulse" />
          <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
            Tactical Ingress Radar PPI Scope
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121212] text-[#FF1A1A] border border-[#FF1A1A]/30">
            RANGE: 300m
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121212] text-gray-400 border border-white/10">
            {contacts.length} TRACKS
          </span>
        </div>
      </div>

      {/* SVG PPI Scope Display */}
      <div className="relative flex justify-center items-center py-2 select-none">
        <svg
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="w-full max-w-[340px] aspect-square rounded-full border border-[#FF1A1A]/20 bg-[#070b0e] shadow-[inset_0_0_30px_rgba(255,26,26,0.06)]"
        >
          {/* Concentric Range Rings */}
          {/* 300m Ring (Early Detection) */}
          <circle
            cx={center}
            cy={center}
            r={300 * scale}
            fill="none"
            stroke="rgba(34, 211, 238, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* 200m Ring (Engagement Zone) */}
          <circle
            cx={center}
            cy={center}
            r={200 * scale}
            fill="none"
            stroke="rgba(245, 158, 11, 0.25)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* 100m Ring (Inner Hard Kill Zone) */}
          <circle
            cx={center}
            cy={center}
            r={100 * scale}
            fill="rgba(239, 68, 68, 0.03)"
            stroke="rgba(239, 68, 68, 0.45)"
            strokeWidth="1.2"
          />

          {/* Azimuth Radial Crosshairs (000°, 090°, 180°, 270°) */}
          <line
            x1={center}
            y1={12}
            x2={center}
            y2={svgSize - 12}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
          <line
            x1={12}
            y1={center}
            x2={svgSize - 12}
            y2={center}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
          {/* Diagonal Azimuth 45° / 135° */}
          <line
            x1={center - 210 * scale}
            y1={center - 210 * scale}
            x2={center + 210 * scale}
            y2={center + 210 * scale}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <line
            x1={center - 210 * scale}
            y1={center + 210 * scale}
            x2={center + 210 * scale}
            y2={center - 210 * scale}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Compass Cardinals */}
          <text x={center} y={18} fill="#FF1A1A" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">000° N</text>
          <text x={svgSize - 14} y={center + 3} fill="#8FA0BA" fontSize="8" fontFamily="monospace" textAnchor="end">090° E</text>
          <text x={center} y={svgSize - 10} fill="#8FA0BA" fontSize="8" fontFamily="monospace" textAnchor="middle">180° S</text>
          <text x={14} y={center + 3} fill="#8FA0BA" fontSize="8" fontFamily="monospace" textAnchor="start">270° W</text>

          {/* Range Labels */}
          <text x={center + 100 * scale + 2} y={center - 4} fill="#EF4444" opacity="0.8" fontSize="7" fontFamily="monospace">100m KZ</text>
          <text x={center + 200 * scale + 2} y={center - 4} fill="#F59E0B" opacity="0.8" fontSize="7" fontFamily="monospace">200m EZ</text>
          <text x={center + 290 * scale - 4} y={center - 4} fill="#22D3EE" opacity="0.8" fontSize="7" fontFamily="monospace">300m</text>

          {/* Center Defended Asset Base Marker */}
          <circle cx={center} cy={center} r="6" fill="#B30000" stroke="#FF1A1A" strokeWidth="2" />
          <circle cx={center} cy={center} r="2" fill="#FFFFFF" />

          {/* Render Contacts on Radar */}
          {contacts.map((c, i) => {
            const rawPos = c.position || c.initialPosition || [100, 40, 100];
            const rawVel = c.velocity || [-10, 0, -10];
            const speed = c.speed || c.attackSpeed || 15;
            const type = (c.type || c.threatCategory || 'hostile').toLowerCase();

            // Calculate animated position along velocity vector
            // clamp movement so it doesn't cross through origin
            const distOrig = Math.hypot(rawPos[0], rawPos[2]);
            const travelDist = Math.min(speed * animTime, Math.max(0, distOrig - 15));
            const normX = rawPos[0] / distOrig;
            const normZ = rawPos[2] / distOrig;

            const currX = rawPos[0] - normX * travelDist;
            const currZ = rawPos[2] - normZ * travelDist;

            const cx = center + currX * scale;
            const cy = center + currZ * scale;

            // Ingress vector heading indicator (line pointing forward)
            const vecLen = 14;
            const vecDx = -(rawVel[0] / (Math.hypot(rawVel[0], rawVel[2]) || 1)) * vecLen;
            const vecDz = -(rawVel[2] / (Math.hypot(rawVel[0], rawVel[2]) || 1)) * vecLen;

            // Colors based on classification
            let color = '#EF4444'; // hostile red
            if (type === 'friendly') color = '#22C55E'; // green
            if (type === 'benign') color = '#38BDF8'; // cyan

            const isSelected = selectedContactId === c.id;
            const isHovered = hoveredContact?.id === c.id;

            return (
              <g
                key={c.id || i}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectContact && onSelectContact(c.id)}
                onMouseEnter={() => setHoveredContact(c)}
                onMouseLeave={() => setHoveredContact(null)}
              >
                {/* Projected Flight Path Line */}
                <line
                  x1={center + rawPos[0] * scale}
                  y1={center + rawPos[2] * scale}
                  x2={center}
                  y2={center}
                  stroke={color}
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity={isSelected || isHovered ? '0.7' : '0.25'}
                />

                {/* Velocity Arrow */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx - vecDx}
                  y2={cy - vecDz}
                  stroke={color}
                  strokeWidth="1.5"
                  opacity="0.9"
                />

                {/* Selection / Highlight Pulse Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="10"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    className="animate-spin"
                  />
                )}

                {/* Drone Point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '5' : '3.5'}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? '1.5' : '0.8'}
                />

                {/* Callsign Tag */}
                <text
                  x={cx + 7}
                  y={cy - 4}
                  fill={color}
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  opacity={isSelected || isHovered ? '1' : '0.85'}
                >
                  {c.callsign || `T-${i + 1}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip When Hovered */}
        {hoveredContact && (
          <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg bg-[#121212]/95 border border-[#FF1A1A]/40 backdrop-blur-md text-[10px] font-mono text-gray-300 shadow-xl flex items-center justify-between z-10">
            <div>
              <div className="text-white font-bold text-xs uppercase flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    backgroundColor:
                      hoveredContact.type === 'friendly'
                        ? '#22C55E'
                        : hoveredContact.type === 'benign'
                        ? '#38BDF8'
                        : '#EF4444',
                  }}
                />
                <span>{hoveredContact.callsign}</span>
                <span className="text-[9px] text-gray-400">({hoveredContact.role?.toUpperCase()})</span>
              </div>
              <div className="text-gray-400 mt-0.5">
                ALT: <span className="text-white">{hoveredContact.altitude || 40}m</span> | SPEED: <span className="text-white">{hoveredContact.speed || 16} m/s</span> | RCS: <span className="text-white">{hoveredContact.radarCrossSection || 0.02} m²</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-400 uppercase">EST. TIME TO IMPACT</div>
              <div className="text-[#FF1A1A] font-bold text-xs">
                {Math.max(
                  1,
                  Math.round(
                    Math.hypot(
                      hoveredContact.position?.[0] || 150,
                      hoveredContact.position?.[2] || 150
                    ) / (hoveredContact.speed || 16)
                  )
                )}s
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ingress Trajectory Playback Controls */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B30000]/20 hover:bg-[#B30000]/30 border border-[#FF1A1A]/40 text-[#FF1A1A] font-bold text-xs transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-[#FF1A1A]" />}
              <span>{isPlaying ? 'PAUSE INGRESS' : 'SIMULATE INGRESS'}</span>
            </button>
            <button
              onClick={handleResetAnim}
              className="p-1.5 rounded-lg bg-[#121212] border border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
              title="Reset Simulation Time"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">
            T + <span className="text-white font-bold">{animTime.toFixed(1)}s</span> / 15.0s
          </span>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={animTime}
          onChange={(e) => {
            setIsPlaying(false);
            setAnimTime(parseFloat(e.target.value));
          }}
          className="w-full accent-[#FF1A1A] h-1.5 bg-[#121212] rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
          <span>Staggered Spawns</span>
          <span>Red = Hostile | Cyan = Benign | Green = Friendly</span>
        </div>
      </div>
    </div>
  );
}
