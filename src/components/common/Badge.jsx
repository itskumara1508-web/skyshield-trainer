/**
 * SkyShield Trainer - Standardized Tactical Badge
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Supports both:
 * <Badge variant="hostile">HOSTILE</Badge>
 * and
 * <Badge category="hostile" label="ACTUAL: HOSTILE" size="sm" />
 */

import React from 'react';

export function Badge({
  children,
  label,
  category,
  variant,
  size = 'md',
  className = '',
  dot = false,
}) {
  const activeType = (category || variant || 'default').toLowerCase();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 tracking-widest font-semibold',
  };

  const variantClasses = {
    hostile: 'bg-red-950/60 text-laser border border-laser/50 shadow-sm shadow-laser/20',
    friendly: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-500/20',
    benign: 'bg-sky-950/60 text-sky-400 border border-sky-500/50 shadow-sm shadow-sky-500/20',
    unknown: 'bg-amber-950/60 text-amber-400 border border-amber-500/50 shadow-sm shadow-amber-500/20',
    laser: 'bg-brand-red/20 text-laser border border-laser/60 shadow-laser-glow',
    military: 'bg-zinc-900 text-zinc-300 border border-white/10',
    default: 'bg-[#161616] text-zinc-300 border border-white/10',
  };

  const dotColors = {
    hostile: 'bg-laser shadow-sm shadow-laser animate-pulse',
    friendly: 'bg-emerald-400 shadow-sm shadow-emerald-400',
    benign: 'bg-sky-400 shadow-sm shadow-sky-400',
    unknown: 'bg-amber-400 shadow-sm shadow-amber-400 animate-ping',
    laser: 'bg-laser shadow-laser-glow',
    military: 'bg-zinc-400',
    default: 'bg-zinc-400',
  };

  const content = label || children || activeType;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded uppercase font-mono transition-colors duration-150 ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[activeType] || variantClasses.default} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColors[activeType] || dotColors.default
          }`}
        />
      )}
      {content}
    </span>
  );
}

export default Badge;

