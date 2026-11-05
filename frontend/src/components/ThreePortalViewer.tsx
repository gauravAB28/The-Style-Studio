import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreePortalViewerProps {
  activeModel: 'shears' | 'tiara' | 'elixir' | 'pedestal';
  className?: string;
}

export const ThreePortalViewer: React.FC<ThreePortalViewerProps> = ({ activeModel, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelsGroupRef = useRef<THREE.Group | null>(null);
  const modelsMapRef = useRef<{ [key: string]: THREE.Group }>({});
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, 4.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting (Warm Studio Architectural Lighting)
    const ambientLight = new THREE.AmbientLight(0xfff5ee, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const softFillLight = new THREE.DirectionalLight(0xdbeafe, 1.6);
    softFillLight.position.set(-4, 2, -2);
    scene.add(softFillLight);

    const bottomBounce = new THREE.PointLight(0xe8d0b5, 1.2, 10);
    bottomBounce.position.set(0, -2, 2);
    scene.add(bottomBounce);

    // Materials Library
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xdeb86b,
      metalness: 0.92,
      roughness: 0.18
    });

    const matPaleGold = new THREE.MeshStandardMaterial({
      color: 0xf5e7c4,
      metalness: 0.85,
      roughness: 0.22
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.9,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85
    });

    const matLiquid = new THREE.MeshPhysicalMaterial({
      color: 0xe09848,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.6,
      transparent: true,
      opacity: 0.88
    });

    const matAlabaster = new THREE.MeshStandardMaterial({
      color: 0x222a3a,
      metalness: 0.6,
      roughness: 0.35
    });

    // Models Container
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    modelsGroupRef.current = mainGroup;

    // 1. Shears (Scissors)
    const shearsGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.12, 2.3, 0.04);
    const bPos = bladeGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      if (bPos.getY(i) > 0.4) {
        const factor = (bPos.getY(i) - 0.4) / 0.8;
        bPos.setX(i, bPos.getX(i) * (1 - factor * 0.7));
        bPos.setZ(i, bPos.getZ(i) * (1 - factor * 0.7));
      }
    }
    bladeGeo.computeVertexNormals();

    const blade1 = new THREE.Mesh(bladeGeo, matGold);
    blade1.position.y = 0.5;
    blade1.rotation.z = 0.16;
    shearsGroup.add(blade1);

    const blade2 = new THREE.Mesh(bladeGeo, matGold);
    blade2.position.y = 0.5;
    blade2.rotation.z = -0.16;
    shearsGroup.add(blade2);

    const pivotGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32);
    pivotGeo.rotateX(Math.PI / 2);
    shearsGroup.add(new THREE.Mesh(pivotGeo, matPaleGold));

    const loopGeo = new THREE.TorusGeometry(0.36, 0.065, 16, 40);
    const loop1 = new THREE.Mesh(loopGeo, matGold);
    loop1.position.set(-0.55, -1.15, 0);
    loop1.rotation.z = 0.4;
    shearsGroup.add(loop1);

    const loop2 = new THREE.Mesh(loopGeo, matGold);
    loop2.position.set(0.55, -1.15, 0);
    loop2.rotation.z = -0.4;
    shearsGroup.add(loop2);

    shearsGroup.position.set(0, 0, 0);
    mainGroup.add(shearsGroup);
    modelsMapRef.current.shears = shearsGroup;

    // 2. Bridal Tiara
    const tiaraGroup = new THREE.Group();
    const archGeo = new THREE.TorusGeometry(1.2, 0.07, 16, 50, Math.PI * 1.1);
    archGeo.rotateX(Math.PI / 2);
    archGeo.rotateZ(-Math.PI * 0.05);
    tiaraGroup.add(new THREE.Mesh(archGeo, matGold));

    for (let i = 0; i < 7; i++) {
      const angle = (i / 6 - 0.5) * 1.4;
      const h = 0.7 + Math.cos(angle * 1.5) * 0.7;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.1, h, 6), matGold);
      spire.position.set(Math.sin(angle) * 1.2, h / 2, Math.cos(angle) * 0.5);
      spire.rotation.z = -angle * 0.3;
      tiaraGroup.add(spire);

      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), matGlass);
      gem.position.set(spire.position.x, h + 0.08, spire.position.z);
      tiaraGroup.add(gem);
    }
    tiaraGroup.visible = false;
    mainGroup.add(tiaraGroup);
    modelsMapRef.current.tiara = tiaraGroup;

    // 3. Elixir Flacon
    const elixirGroup = new THREE.Group();
    const bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.7, 1.9, 8), matGlass);
    elixirGroup.add(bodyMesh);

    const liquidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.58, 1.5, 8), matLiquid);
    liquidMesh.position.y = -0.15;
    elixirGroup.add(liquidMesh);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.3, 32), matGold);
    collar.position.y = 1.1;
    elixirGroup.add(collar);

    const stopper = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), matPaleGold);
    stopper.position.y = 1.6;
    elixirGroup.add(stopper);

    elixirGroup.visible = false;
    mainGroup.add(elixirGroup);
    modelsMapRef.current.elixir = elixirGroup;

    // 4. Pedestal & Mirror
    const pedestalGroup = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.25, 48), matAlabaster);
    base.position.y = -1.0;
    pedestalGroup.add(base);

    const goldRing = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.035, 16, 64), matGold);
    goldRing.rotateX(Math.PI / 2);
    goldRing.position.y = -0.88;
    pedestalGroup.add(goldRing);

    const glowRingMat = new THREE.MeshStandardMaterial({
      color: 0xffecd0,
      emissive: 0xffd285,
      emissiveIntensity: 1.4
    });
    const mirrorRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.05, 24, 64), glowRingMat);
    mirrorRing.position.set(0, 0.4, -0.2);
    pedestalGroup.add(mirrorRing);

    pedestalGroup.visible = false;
    mainGroup.add(pedestalGroup);
    modelsMapRef.current.pedestal = pedestalGroup;

    // Dust particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 70;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 6;
      pPos[i + 1] = (Math.random() - 0.5) * 5;
      pPos[i + 2] = (Math.random() - 0.5) * 5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.04,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleDragMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !mainGroup) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !mainGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;
      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleDragMove);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (!isDraggingRef.current) {
        mainGroup.rotation.y += 0.006;
        mainGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.1;
        camera.position.x = mouseRef.current.x * 0.3;
        camera.position.y = 0.4 + mouseRef.current.y * 0.2;
        camera.lookAt(0, 0, 0);
      }

      particles.rotation.y = elapsedTime * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleDragMove);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Switch model smoothly
  useEffect(() => {
    const map = modelsMapRef.current;
    if (!map) return;

    Object.keys(map).forEach((key) => {
      if (map[key]) map[key].visible = key === activeModel;
    });

    if (modelsGroupRef.current) {
      modelsGroupRef.current.rotation.set(0, 0, 0);
      modelsGroupRef.current.scale.set(0.85, 0.85, 0.85);
      let s = 0.85;
      const interval = setInterval(() => {
        s += 0.03;
        if (s >= 1) {
          modelsGroupRef.current?.scale.set(1, 1, 1);
          clearInterval(interval);
        } else {
          modelsGroupRef.current?.scale.set(s, s, s);
        }
      }, 16);
    }
  }, [activeModel]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to rotate in 3D"
    />
  );
};
