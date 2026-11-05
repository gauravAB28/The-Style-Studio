import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScissorsScroll: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio Warm Lighting for Cream Aesthetics
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa5c4ff, 2.0);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const warmBounce = new THREE.PointLight(0xd4af37, 2.0, 15);
    warmBounce.position.set(0, -3, 3);
    scene.add(warmBounce);

    // 4. Luxury 24K Gold Materials
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xdeb86b,
      metalness: 0.94,
      roughness: 0.16
    });

    const matPaleGold = new THREE.MeshStandardMaterial({
      color: 0xf7e9c8,
      metalness: 0.88,
      roughness: 0.2
    });

    const matJewel = new THREE.MeshPhysicalMaterial({
      color: 0x2f54eb,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7,
      transparent: true,
      opacity: 0.9
    });

    // 5. Build 3D Scissors with Independent Articulated Blades
    const scissorsRoot = new THREE.Group();
    scene.add(scissorsRoot);

    // Pivot Center
    const pivotGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32);
    pivotGeo.rotateX(Math.PI / 2);
    const pivot = new THREE.Mesh(pivotGeo, matPaleGold);
    scissorsRoot.add(pivot);

    // Sapphire/Cobalt Jewel in center pivot
    const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 1), matJewel);
    jewel.position.z = 0.09;
    scissorsRoot.add(jewel);

    // Blade 1 Group (Rotates during snip)
    const blade1Group = new THREE.Group();
    scissorsRoot.add(blade1Group);

    const bladeGeo = new THREE.BoxGeometry(0.14, 3.2, 0.045);
    const bPos = bladeGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      if (bPos.getY(i) > 0.5) {
        const factor = (bPos.getY(i) - 0.5) / 1.1;
        bPos.setX(i, bPos.getX(i) * (1 - factor * 0.75));
        bPos.setZ(i, bPos.getZ(i) * (1 - factor * 0.75));
      }
    }
    bladeGeo.computeVertexNormals();

    const blade1Mesh = new THREE.Mesh(bladeGeo, matGold);
    blade1Mesh.position.y = 0.8;
    blade1Group.add(blade1Mesh);

    // Handle 1 (Oval loop + tang)
    const loopGeo = new THREE.TorusGeometry(0.48, 0.08, 16, 48);
    const loop1 = new THREE.Mesh(loopGeo, matGold);
    loop1.position.set(-0.65, -1.5, 0);
    loop1.rotation.z = 0.35;
    blade1Group.add(loop1);

    const tangGeo = new THREE.CylinderGeometry(0.05, 0.02, 0.55, 16);
    tangGeo.rotateZ(Math.PI / 3);
    const tang = new THREE.Mesh(tangGeo, matGold);
    tang.position.set(1.0, -1.8, 0);
    blade1Group.add(tang);

    // Blade 2 Group (Opposing rotation during snip)
    const blade2Group = new THREE.Group();
    scissorsRoot.add(blade2Group);

    const blade2Mesh = new THREE.Mesh(bladeGeo, matGold);
    blade2Mesh.position.y = 0.8;
    blade2Group.add(blade2Mesh);

    const loop2 = new THREE.Mesh(loopGeo, matGold);
    loop2.position.set(0.65, -1.5, 0);
    loop2.rotation.z = -0.35;
    blade2Group.add(loop2);

    // Initial scale and position
    scissorsRoot.scale.set(0.72, 0.72, 0.72);
    scissorsRoot.position.set(3.0, 0.8, 0);
    scissorsRoot.rotation.z = -0.3;

    // 6. Floating Sparkles / Golden Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 50;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 12;
      pPos[i + 1] = (Math.random() - 0.5) * 10;
      pPos[i + 2] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc59b4b,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 7. Scroll Tracking & Cutting Physics
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let targetX = 3.0;
    let targetY = 0.8;
    let targetRotZ = -0.3;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      scrollVelocity = Math.abs(delta) * 0.05;
      lastScrollY = currentY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, currentY / (maxScroll || 1)));

      // Path based on scroll:
      // Hero (progress < 0.25): positioned right
      // Studios (progress 0.25 - 0.5): glides towards left
      // Gallery (progress 0.5 - 0.75): glides center-right cutting across
      // Footer: bottom right
      if (progress < 0.25) {
        const p = progress / 0.25;
        targetX = 3.2 - p * 0.8;
        targetY = 0.6 - p * 0.4;
        targetRotZ = -0.3 + p * 0.2;
      } else if (progress < 0.55) {
        const p = (progress - 0.25) / 0.3;
        targetX = 2.4 - p * 4.8; // moves across to left
        targetY = 0.2 - p * 0.8;
        targetRotZ = -0.1 - p * 0.6;
      } else if (progress < 0.8) {
        const p = (progress - 0.55) / 0.25;
        targetX = -2.4 + p * 4.6; // cuts back across
        targetY = -0.6 - p * 0.4;
        targetRotZ = -0.7 + p * 0.8;
      } else {
        targetX = 2.2;
        targetY = -1.0;
        targetRotZ = 0.2;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 8. Animation Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Decay scroll velocity smoothly
      scrollVelocity *= 0.92;

      // Calculate Snip / Cutting angle based on scroll velocity and idle breathing
      // When user scrolls, blades open and close fast ("cutting")!
      const snipFrequency = 14;
      const snipAmplitude = Math.min(0.28, scrollVelocity * 0.6 + 0.05);
      const currentSnipAngle = Math.abs(Math.sin(elapsed * snipFrequency)) * snipAmplitude;

      blade1Group.rotation.z = currentSnipAngle;
      blade2Group.rotation.z = -currentSnipAngle;

      // Smooth position lerp
      scissorsRoot.position.x += (targetX + mouseX * 0.3 - scissorsRoot.position.x) * 0.08;
      scissorsRoot.position.y += (targetY + mouseY * 0.2 - scissorsRoot.position.y) * 0.08;
      scissorsRoot.rotation.z += (targetRotZ - scissorsRoot.rotation.z) * 0.08;

      // Subtle 3D tilt
      scissorsRoot.rotation.x = 0.2 + mouseY * 0.2;
      scissorsRoot.rotation.y = Math.sin(elapsed * 1.5) * 0.15 + mouseX * 0.2;

      // Slowly rotate dust particles
      particles.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="canvas-3d-fixed" />;
};
