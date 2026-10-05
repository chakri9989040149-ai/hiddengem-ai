'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GlobeProps {
  onSelectDestination?: (slug: string) => void;
}

export function TravelGlobe({ onSelectDestination }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activePin, setActivePin] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for entire globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Globe Base Sphere (Emerald/Forest tone wireframe & inner glow)
    const sphereRadius = 1.0;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0f2b1d,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Subtle inner sphere
    const innerGeo = new THREE.SphereGeometry(sphereRadius * 0.98, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x143527,
      transparent: true,
      opacity: 0.45,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 2. Atmosphere Outer Glow
    const atmosGeo = new THREE.SphereGeometry(sphereRadius * 1.12, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: false,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    // 3. Floating Particles Around Globe
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = sphereRadius * (1.1 + Math.random() * 0.4);
      const sinPhi = Math.sin(phi);
      particlePositions[i] = r * sinPhi * Math.cos(theta);
      particlePositions[i + 1] = r * sinPhi * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.024,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particleSystem);

    // 4. Coordinates to 3D Sphere conversion
    const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Target demo destinations
    const destinations = [
      { name: 'Tirupati', slug: 'tirupati', lat: 13.6288, lng: 79.4192, color: 0x10b981 },
      { name: 'Hampi', slug: 'hampi', lat: 15.335, lng: 76.46, color: 0xf59e0b },
      { name: 'Munnar', slug: 'munnar', lat: 10.0889, lng: 77.0595, color: 0x38bdf8 },
    ];

    const pinMeshes: THREE.Mesh[] = [];
    const pinPositions: THREE.Vector3[] = [];

    destinations.forEach((dest) => {
      const pos = latLngToVector3(dest.lat, dest.lng, sphereRadius * 1.01);
      pinPositions.push(pos);

      // Glowing Pin Dot
      const pinGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: dest.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { slug: dest.slug, name: dest.name };
      globeGroup.add(pinMesh);
      pinMeshes.push(pinMesh);

      // Small beacon ring
      const ringGeo = new THREE.RingGeometry(0.05, 0.075, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: dest.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);
    });

    // 5. Animated Great-Circle Route Arcs between destinations
    const createArcCurve = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const distance = p1.distanceTo(p2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const midLength = mid.length();
      mid.normalize();
      mid.multiplyScalar(midLength + distance * 0.35); // elevate arc curve

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x6ee7b7,
        transparent: true,
        opacity: 0.65,
        linewidth: 2,
      });
      return new THREE.Line(arcGeo, arcMat);
    };

    if (pinPositions.length >= 3) {
      const arc1 = createArcCurve(pinPositions[0], pinPositions[1]);
      const arc2 = createArcCurve(pinPositions[1], pinPositions[2]);
      const arc3 = createArcCurve(pinPositions[2], pinPositions[0]);
      globeGroup.add(arc1);
      globeGroup.add(arc2);
      globeGroup.add(arc3);
    }

    // Orient globe so India is facing the camera nicely
    globeGroup.rotation.y = -Math.PI / 1.7;
    globeGroup.rotation.x = 0.3;

    // Raycasting for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0) {
        const destName = intersects[0].object.userData.name;
        setActivePin(destName);
        container.style.cursor = 'pointer';
      } else {
        setActivePin(null);
        container.style.cursor = 'default';
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0 && onSelectDestination) {
        const slug = intersects[0].object.userData.slug;
        onSelectDestination(slug);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow majestic rotation
      globeGroup.rotation.y += 0.0022;

      // Particle subtle pulsation
      particleSystem.rotation.y -= 0.001;
      particleSystem.rotation.x = Math.sin(elapsed * 0.5) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectDestination]);

  if (!hasWebGL) {
    // Graceful 2D Fallback
    return (
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-emerald-800/30 bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-40 h-40 rounded-full border-2 border-emerald-400/40 flex items-center justify-center mb-4 relative shadow-2xl shadow-emerald-500/20">
          <span className="text-6xl animate-pulse">🌍</span>
          <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-stone-950">
            Tirupati • Hampi • Munnar
          </div>
        </div>
        <h4 className="font-bold text-base text-emerald-300">Intelligent Tourism Discovery</h4>
        <p className="text-xs text-stone-400 mt-1 max-w-xs">
          Interactive GIS coordinates ready across 18+ uncrowded hidden gems.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Overlay Tooltip when hovering over a pin */}
      {activePin && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-stone-900/90 text-emerald-400 border border-emerald-500/50 text-xs font-semibold backdrop-blur-md shadow-lg pointer-events-none flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{activePin} — Click to Explore Gems</span>
        </div>
      )}

      {/* Floating Info Badges */}
      <div className="absolute bottom-3 left-4 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800 text-[11px] text-stone-300 backdrop-blur-sm hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D GIS Coordinates • Live Orbital Sync</span>
      </div>
    </div>
  );
}
