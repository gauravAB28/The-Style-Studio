import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Spa3DAtmosphereProps {
  className?: string;
  variant?: 'hero' | 'ambient';
}

/**
 * High-performance, luxury Three.js ambient atmosphere.
 * Capped devicePixelRatio, paused when offscreen or tab hidden,
 * and adaptive particle counts for smooth 60fps on mobile.
 */
export const Spa3DAtmosphere: React.FC<Spa3DAtmosphereProps> = ({
  className = '',
  variant = 'hero'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || (variant === 'hero' ? window.innerHeight : 600);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 24;

    // Renderer with strict DPR cap (max 1.5 on mobile, max 2 on desktop)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Shimmering Gold Particle Cloud (reduced on mobile for performance)
    const particleCount = isMobile ? (variant === 'hero' ? 32 : 18) : (variant === 'hero' ? 65 : 35);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      scales[i] = Math.random() * 0.8 + 0.4;
      opacities[i] = Math.random() * 0.6 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom circle texture for soft glowing bokeh particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(230, 195, 120, 1)');
      gradient.addColorStop(0.3, 'rgba(197, 155, 75, 0.6)');
      gradient.addColorStop(0.7, 'rgba(197, 155, 75, 0.15)');
      gradient.addColorStop(1, 'rgba(197, 155, 75, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.7 : 0.9,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle Zen Energy Rings
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(5, 5.08, isMobile ? 32 : 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc59b4b,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2 = ring1.clone();
    ring2.scale.set(1.4, 1.4, 1.4);
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.07;
    ringGroup.add(ring2);
    scene.add(ringGroup);

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Performance: Pause when tab is inactive or element is off-screen
    let isVisibleOnScreen = true;
    let isTabVisible = !document.hidden;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisibleOnScreen || !isTabVisible) {
        return; // Skip rendering when paused offscreen
      }

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Particle organic float
      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(elapsedTime * 0.4 + i) * 0.005;
        posArray[i * 3] += Math.cos(elapsedTime * 0.3 + i) * 0.003;

        if (posArray[i * 3 + 1] > 12) posArray[i * 3 + 1] = -12;
        if (posArray[i * 3 + 1] < -12) posArray[i * 3 + 1] = 12;
      }
      posAttr.needsUpdate = true;

      // Rotate Zen rings slowly
      ring1.rotation.z = elapsedTime * 0.07;
      ring2.rotation.z = -elapsedTime * 0.05;
      ringGroup.rotation.y = currentMouseX * 0.2;
      ringGroup.rotation.x = -currentMouseY * 0.15;

      camera.position.x = currentMouseX * 1.2;
      camera.position.y = -currentMouseY * 1.0;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || (variant === 'hero' ? window.innerHeight : 600);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      texture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
