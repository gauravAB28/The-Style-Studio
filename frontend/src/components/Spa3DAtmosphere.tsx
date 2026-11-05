import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Spa3DAtmosphereProps {
  className?: string;
  variant?: 'hero' | 'ambient';
}

/**
 * High-performance, luxury Three.js ambient atmosphere.
 * Renders floating champagne gold light particles and soft depth-of-field orbs
 * that gently sway with an organic breathing cadence and react smoothly to mouse movement.
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

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (variant === 'hero' ? window.innerHeight : 600);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 24;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. Shimmering Gold Particle Cloud
    const particleCount = variant === 'hero' ? 65 : 35;
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
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 235, 180, 1)');
      grad.addColorStop(0.3, 'rgba(212, 175, 95, 0.6)');
      grad.addColorStop(0.7, 'rgba(197, 155, 75, 0.15)');
      grad.addColorStop(1, 'rgba(197, 155, 75, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.4,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Soft Ambient Golden Light Rings (Floating Zen Rings)
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af5f,
      transparent: true,
      opacity: 0.22,
      wireframe: false,
    });

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI * 0.35;
    ring1.position.set(-6, 2, -4);
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.025, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0xecd08c,
        transparent: true,
        opacity: 0.16,
      })
    );
    ring2.rotation.x = Math.PI * 0.25;
    ring2.rotation.y = Math.PI * 0.15;
    ring2.position.set(7, -3, -6);
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

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Particle organic flow
      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Slow vertical float
        posArray[i * 3 + 1] += Math.sin(elapsedTime * 0.4 + i) * 0.006;
        posArray[i * 3] += Math.cos(elapsedTime * 0.3 + i) * 0.004;

        // Wrap boundaries
        if (posArray[i * 3 + 1] > 12) posArray[i * 3 + 1] = -12;
        if (posArray[i * 3 + 1] < -12) posArray[i * 3 + 1] = 12;
      }
      posAttr.needsUpdate = true;

      // Rotate Zen rings slowly
      ring1.rotation.z = elapsedTime * 0.08;
      ring2.rotation.z = -elapsedTime * 0.06;
      ringGroup.rotation.y = currentMouseX * 0.25;
      ringGroup.rotation.x = -currentMouseY * 0.2;

      // Camera gentle reaction to mouse
      camera.position.x = currentMouseX * 1.5;
      camera.position.y = -currentMouseY * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || (variant === 'hero' ? window.innerHeight : 600);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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

