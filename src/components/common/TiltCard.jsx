import React, { useRef, useState } from 'react';

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glowColor = 'rgba(255, 26, 26, 0.35)',
  disabled = false,
  ...props
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
    setGlowPos({
      x: ((x / rect.width) * 100).toFixed(1),
      y: ((y / rect.height) * 100).toFixed(1),
    });
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: disabled ? 'none' : transform,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
      }}
      className={`relative rounded-xl border border-defense-border bg-defense-surface/90 overflow-hidden ${
        isHovered ? 'border-defense-redGlow/60 shadow-red-glow' : ''
      } ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Radial Glow */}
      {isHovered && !disabled && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

