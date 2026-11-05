import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CinematicSalonCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfaf6f0, 0.045); // Warm cream spatial fog

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.3, 6.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting for Cream Plaster Aesthetics
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaee, 3.4);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const softFillLight = new THREE.DirectionalLight(0xdce8ff, 1.8);
    softFillLight.position.set(-6, 3, -2);
    scene.add(softFillLight);

    const warmBounce = new THREE.PointLight(0xd4af37, 2.2, 14);
    warmBounce.position.set(0, -2, 2.5);
    scene.add(warmBounce);

    // 3. PBR Materials
    const mat24kGold = new THREE.MeshStandardMaterial({
      color: 0xdeb86b,
      metalness: 0.94,
      roughness: 0.16,
      envMapIntensity: 1.5
    });

    const matPaleGold = new THREE.MeshStandardMaterial({
      color: 0xf7e9c8,
      metalness: 0.88,
      roughness: 0.22
    });

    const matGlassFlacon = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.06,
      transmission: 0.92,
      thickness: 1.2,
      transparent: true,
      opacity: 0.88
    });

    const matAmberCore = new THREE.MeshPhysicalMaterial({
      color: 0xe69e38,
      emissive: 0x442200,
      metalness: 0.1,
      roughness: 0.18,
      transmission: 0.55,
      transparent: true,
      opacity: 0.9
    });

    const matCreamPlaster = new THREE.MeshStandardMaterial({
      color: 0xf7efe4,
      metalness: 0.05,
      roughness: 0.85
    });

    const matMarble = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.35
    });

    // 4. Architectural Salon Environment (Walls, Archway & Pedestal)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Architectural Arched Portal in background
    const archShape = new THREE.Shape();
    archShape.moveTo(-3.2, -4);
    archShape.lineTo(-3.2, 2);
    archShape.absarc(0, 2, 3.2, Math.PI, 0, true);
    archShape.lineTo(3.2, -4);
    archShape.lineTo(3.8, -4);
    archShape.lineTo(3.8, 2);
    archShape.absarc(0, 2, 3.8, 0, Math.PI, false);
    archShape.lineTo(-3.8, -4);
    archShape.closePath();

    const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const archGeo = new THREE.ExtrudeGeometry(archShape, extrudeSettings);
    const archMesh = new THREE.Mesh(archGeo, matCreamPlaster);
    archMesh.position.set(0, 0, -2.8);
    worldGroup.add(archMesh);

    // Warm Recessed LED Ring in Archway
    const haloRingGeo = new THREE.TorusGeometry(3.25, 0.04, 24, 64, Math.PI);
    const matGlowRing = new THREE.MeshStandardMaterial({
      color: 0xffecd0,
      emissive: 0xffd285,
      emissiveIntensity: 1.5,
      roughness: 0.2
    });
    const haloRing = new THREE.Mesh(haloRingGeo, matGlowRing);
    haloRing.position.set(0, 2, -2.55);
    worldGroup.add(haloRing);

    // Marble Showcase Pedestal
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.6, -0.5);
    worldGroup.add(pedestalGroup);

    const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.3, 48), matMarble);
    pedestalGroup.add(pedBase);

    const pedGoldCollar = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.035, 16, 64), mat24kGold);
    pedGoldCollar.rotateX(Math.PI / 2);
    pedGoldCollar.position.y = 0.14;
    pedestalGroup.add(pedGoldCollar);

    // 5. Featured 3D Object 1: Floating 24K Gold Salon Shears
    const shearsGroup = new THREE.Group();
    shearsGroup.position.set(1.5, 0.2, 0);
    shearsGroup.scale.set(0.68, 0.68, 0.68);
    worldGroup.add(shearsGroup);

    const bladeGeo = new THREE.BoxGeometry(0.12, 2.6, 0.04);
    const bPos = bladeGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      if (bPos.getY(i) > 0.4) {
        const factor = (bPos.getY(i) - 0.4) / 1.0;
        bPos.setX(i, bPos.getX(i) * (1 - factor * 0.75));
        bPos.setZ(i, bPos.getZ(i) * (1 - factor * 0.75));
      }
    }
    bladeGeo.computeVertexNormals();

    const blade1 = new THREE.Mesh(bladeGeo, mat24kGold);
    blade1.position.y = 0.6;
    blade1.rotation.z = 0.14;
    shearsGroup.add(blade1);

    const blade2 = new THREE.Mesh(bladeGeo, mat24kGold);
    blade2.position.y = 0.6;
    blade2.rotation.z = -0.14;
    shearsGroup.add(blade2);

    const pivotScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32), matPaleGold);
    pivotScrew.rotateX(Math.PI / 2);
    shearsGroup.add(pivotScrew);

    const loopGeo = new THREE.TorusGeometry(0.4, 0.07, 16, 40);
    const handleLoop1 = new THREE.Mesh(loopGeo, mat24kGold);
    handleLoop1.position.set(-0.55, -1.3, 0);
    handleLoop1.rotation.z = 0.4;
    shearsGroup.add(handleLoop1);

    const handleLoop2 = new THREE.Mesh(loopGeo, mat24kGold);
    handleLoop2.position.set(0.55, -1.3, 0);
    handleLoop2.rotation.z = -0.4;
    shearsGroup.add(handleLoop2);

    // 6. Featured 3D Object 2: Luxury Keratin Elixir Product Flacon (Fizzi-style)
    const productBottleGroup = new THREE.Group();
    productBottleGroup.position.set(-1.6, -0.3, 0.2);
    productBottleGroup.scale.set(0.8, 0.8, 0.8);
    worldGroup.add(productBottleGroup);

    // Faceted Glass Body
    const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.68, 2.0, 8), matGlassFlacon);
    productBottleGroup.add(bottleBody);

    // Amber Serum Core
    const liquidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.55, 1.6, 8), matAmberCore);
    liquidMesh.position.y = -0.15;
    productBottleGroup.add(liquidMesh);

    // Gold Neck Ring & Stopper
    const bottleCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.35, 32), mat24kGold);
    bottleCollar.position.y = 1.15;
    productBottleGroup.add(bottleCollar);

    const diamondStopper = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), matPaleGold);
    diamondStopper.position.y = 1.7;
    productBottleGroup.add(diamondStopper);

    // 7. Featured 3D Object 3: Signature Bridal Tiara
    const tiaraGroup = new THREE.Group();
    tiaraGroup.position.set(0, 0.6, -1.0);
    tiaraGroup.scale.set(0.7, 0.7, 0.7);
    worldGroup.add(tiaraGroup);

    const tiaraArchGeo = new THREE.TorusGeometry(1.2, 0.065, 16, 50, Math.PI * 1.1);
    tiaraArchGeo.rotateX(Math.PI / 2);
    tiaraArchGeo.rotateZ(-Math.PI * 0.05);
    tiaraGroup.add(new THREE.Mesh(tiaraArchGeo, mat24kGold));

    for (let i = 0; i < 7; i++) {
      const angle = (i / 6 - 0.5) * 1.4;
      const h = 0.75 + Math.cos(angle * 1.5) * 0.7;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.09, h, 6), mat24kGold);
      spire.position.set(Math.sin(angle) * 1.2, h / 2, Math.cos(angle) * 0.5);
      spire.rotation.z = -angle * 0.3;
      tiaraGroup.add(spire);

      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), matGlassFlacon);
      gem.position.set(spire.position.x, h + 0.08, spire.position.z);
      tiaraGroup.add(gem);
    }

    // 8. Spatial Atmosphere Dust Particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 14;
      pPos[i + 1] = (Math.random() - 0.5) * 12;
      pPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc59b4b,
      size: 0.045,
      transparent: true,
      opacity: 0.55
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 9. Mouse Parallax & Cinematic Scroll Integration
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 10. Animation Render Loop (Cinematic Camera Waypoint Transitions)
    let animId: number;
    const clock = new THREE.Clock();

    // Target Camera Transforms
    const targetCamPos = new THREE.Vector3(0, 0.3, 6.8);
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Mouse Parallax Easing
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Calculate Waypoints based on Scroll Progress (Fizzi 3D style)
      // 0.0 - 0.22: Hero Sanctuary Entrance
      // 0.22 - 0.50: Studios & Services (Focus on 3D Shears & Tiara)
      // 0.50 - 0.75: Products Section (Focus on 3D Keratin Flacon rotating 360)
      // 0.75 - 1.00: Showcase & Sanctuary Wide View
      if (scrollProgress < 0.22) {
        const p = scrollProgress / 0.22;
        targetCamPos.set(0.4 * p, 0.3 - 0.2 * p, 6.8 - 0.8 * p);
        targetLookAt.set(0, 0, 0);
      } else if (scrollProgress < 0.50) {
        const p = (scrollProgress - 0.22) / 0.28;
        targetCamPos.set(0.4 + 1.4 * p, 0.1 - 0.3 * p, 6.0 - 1.8 * p);
        targetLookAt.set(0.8 * p, 0.2 * p, 0);
      } else if (scrollProgress < 0.75) {
        const p = (scrollProgress - 0.50) / 0.25;
        targetCamPos.set(1.8 - 3.6 * p, -0.2 + 0.1 * p, 4.2 + 0.4 * p);
        targetLookAt.set(-1.2 * p, -0.2 * p, 0);
      } else {
        const p = (scrollProgress - 0.75) / 0.25;
        targetCamPos.set(-1.8 + 1.8 * p, -0.1 + 0.8 * p, 4.6 + 2.2 * p);
        targetLookAt.set(0, 0.2, 0);
      }

      // Smooth Camera Lerping
      camera.position.x += (targetCamPos.x + mouse.x * 0.35 - camera.position.x) * 0.06;
      camera.position.y += (targetCamPos.y + mouse.y * 0.25 - camera.position.y) * 0.06;
      camera.position.z += (targetCamPos.z - camera.position.z) * 0.06;
      camera.lookAt(targetLookAt);

      // Object Rotations & Physics:
      // Golden Shears float and breathe
      shearsGroup.rotation.y = elapsed * 0.4 + scrollProgress * Math.PI * 2;
      shearsGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.1 + mouse.y * 0.15;
      shearsGroup.position.y = 0.2 + Math.sin(elapsed * 1.5) * 0.1;

      // Product Bottle 360-degree rotation (Fizzi style)
      productBottleGroup.rotation.y = elapsed * 0.5 + scrollProgress * Math.PI * 3;
      productBottleGroup.rotation.x = Math.cos(elapsed * 1.1) * 0.12;
      productBottleGroup.position.y = -0.3 + Math.sin(elapsed * 1.3) * 0.08;

      // Bridal Tiara subtle regal tilt
      tiaraGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.3 + scrollProgress * Math.PI;
      tiaraGroup.position.y = 0.6 + Math.cos(elapsed * 1.4) * 0.06;

      // Ambient Bokeh Particle Motion
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.08;

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

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
