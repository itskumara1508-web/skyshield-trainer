import React, { useRef, useEffect } from 'react';

export function RadarSweepWidget({
  contacts = [],
  selectedContactId = null,
  onSelectContact = () => {},
  maxRange = 90,
  size = 200,
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let angle = 0;

    const center = size / 2;
    const radius = center - 8;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Deep Black Background
      ctx.fillStyle = '#0A0A0A';
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();

      // Range rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1.0].forEach(factor => {
        ctx.beginPath();
        ctx.arc(center, center, radius * factor, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs / Azimuth lines
      ctx.strokeStyle = 'rgba(255, 26, 26, 0.2)';
      ctx.beginPath();
      ctx.moveTo(center - radius, center);
      ctx.lineTo(center + radius, center);
      ctx.moveTo(center, center - radius);
      ctx.lineTo(center, center + radius);
      ctx.stroke();

      // Sweeping Red Laser Radar Beam Gradient
      angle += 0.035;
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle);

      const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      sweepGrad.addColorStop(0, 'rgba(255, 26, 26, 0.45)');
      sweepGrad.addColorStop(0.7, 'rgba(179, 0, 0, 0.18)');
      sweepGrad.addColorStop(1, 'rgba(179, 0, 0, 0.0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, Math.PI / 3.5);
      ctx.closePath();
      ctx.fill();

      // Sweep leading laser line
      ctx.strokeStyle = '#FF1A1A';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(Math.PI / 3.5) * radius, Math.sin(Math.PI / 3.5) * radius);
      ctx.stroke();
      ctx.restore();

      // Center Outpost Marker
      ctx.fillStyle = '#FF1A1A';
      ctx.beginPath();
      ctx.arc(center, center, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Plot contacts
      contacts.forEach(c => {
        if (c.isDropout) return;
        const pos = c.apparentPosition || c.actualPosition || [0, 0, 0];
        const cx = center + (pos[0] / maxRange) * radius;
        const cz = center + (pos[2] / maxRange) * radius;

        if (Math.hypot(cx - center, cz - center) > radius) return;

        const isSelected = c.id === selectedContactId;
        const category = c.userCategory || 'unknown';

        let color = '#F59E0B'; // unknown amber
        if (category === 'hostile') color = '#FF1A1A'; // crimson
        if (category === 'friendly') color = '#22C55E';
        if (category === 'benign') color = '#38BDF8';
        if (c.isGhost) color = '#888888';

        // Contact blip
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cz, isSelected ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();

        // Selection ring
        if (isSelected) {
          ctx.strokeStyle = '#FF1A1A';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cz, 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [contacts, selectedContactId, maxRange, size]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const center = size / 2;
    const radius = center - 8;

    let closest = null;
    let minDist = 18;

    contacts.forEach(c => {
      const pos = c.apparentPosition || c.actualPosition || [0, 0, 0];
      const cx = center + (pos[0] / maxRange) * radius;
      const cz = center + (pos[2] / maxRange) * radius;
      const d = Math.hypot(clickX - cx, clickY - cz);
      if (d < minDist) {
        minDist = d;
        closest = c.id;
      }
    });

    if (closest) {
      onSelectContact(closest);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onClick={handleCanvasClick}
        className="rounded-full border border-[#FF1A1A]/30 cursor-pointer shadow-red-glow-sm"
      />
      <div className="absolute bottom-1 right-2 text-[10px] font-mono text-gray-400">
        RNG: {maxRange}m
      </div>
    </div>
  );
}

