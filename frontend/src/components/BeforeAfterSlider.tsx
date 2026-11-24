import React, { useState, useRef, useCallback } from 'react';
import { assetPath } from '../utils/assetPath';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
  subtitle: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before Treatment',
  afterLabel = 'After Salon Styling',
  title,
  subtitle
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="cream-card rounded-3xl p-5 sm:p-8 border border-[#b89a73]/25 shadow-xl bg-white max-w-4xl mx-auto my-8 sm:my-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#2f54eb] font-semibold">
            Real Client Results
          </span>
          <h3 className="font-serif-luxury text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[#1a1614] mt-1 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-[#5e5650] mt-1 font-light">
            {subtitle}
          </p>
        </div>
        <div className="text-xs font-mono text-[#8c827a] bg-[#faf6f0] px-3 py-1.5 rounded-full border border-[#b89a73]/20 flex-shrink-0">
          ↔ Drag slider to compare
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize touch-pan-y bg-[#eadecc] border border-[#b89a73]/30 shadow-inner"
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after transformation comparison slider"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setSliderPosition((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setSliderPosition((p) => Math.min(100, p + 5));
        }}
      >
        {/* After Image (Background) */}
        <img
          src={assetPath(afterImage)}
          alt="After salon transformation"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        />
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border border-white/20">
          {afterLabel}
        </div>

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none select-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={assetPath(beforeImage)}
            alt="Before salon treatment"
            loading="lazy"
            className="absolute top-0 left-0 max-w-none w-full h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[#1a1614] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border border-[#b89a73]/30 shadow-sm">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Divider Bar with Accessible 44x44px Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-ew-resize pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-[#2f54eb] shadow-2xl flex items-center justify-center text-sm text-[#2f54eb] font-bold pointer-events-auto">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
};
