import React, { useRef, useState } from 'react';

interface Spa3DTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const Spa3DTiltCard: React.FC<Spa3DTiltCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(197, 155, 75, 0.25)'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative group ${className}`}
    >
      {/* Dynamic Cursor Light Glare Sheen */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-30"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, ${glowColor}, transparent 70%)`
        }}
      />
      {children}
    </div>
  );
};

