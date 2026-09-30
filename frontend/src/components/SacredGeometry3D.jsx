import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Compass, Eye, RotateCw, Volume2, VolumeX } from 'lucide-react';

const FREQUENCY_MODES = [
  {
    id: '528hz',
    label: '528 Hz • Miracles & Light',
    shortLabel: '528 Hz Golden',
    primaryColor: '#D4AF37', // Sacred Gold
    secondaryColor: '#FFDF78', // Luminous Gold
    particleColor: '#FFEAA7',
    glowColor: '#D4A017',
    desc: 'Transformation, love frequency, and DNA repair.'
  },
  {
    id: '432hz',
    label: '432 Hz • Heart & Harmony',
    shortLabel: '432 Hz Sage',
    primaryColor: '#8A9A86', // Sage green
    secondaryColor: '#A7F3D0', // Emerald glow
    particleColor: '#D1FAE5',
    glowColor: '#52796F',
    desc: 'Cosmic resonance, emotional peace, and deep tranquility.'
  },
  {
    id: '741hz',
    label: '741 Hz • Spiritual Awakening',
    shortLabel: '741 Hz Amethyst',
    primaryColor: '#9D4EDD', // Amethyst violet
    secondaryColor: '#E0AAFF', // Celestial purple
    particleColor: '#F3E8FF',
    glowColor: '#7B2CBF',
    desc: 'Intuition awakening, auric cleansing, and higher consciousness.'
  }
];

const SacredGeometry3D = ({ className = '', showControls = true }) => {
  const mountRef = useRef(null);
  const [activeFrequency, setActiveFrequency] = useState(FREQUENCY_MODES[0]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for Three.js state
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const coreMeshRef = useRef(null);
  const outerWireRef = useRef(null);
  const ringGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const lightsRef = useRef([]);
  const materialsRef = useRef({});

  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 });
  const rotationOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(new THREE.Color(activeFrequency.primaryColor), 3.5, 50);
    pointLight1.position.set(5, 6, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(new THREE.Color(activeFrequency.secondaryColor), 2.5, 50);
    pointLight2.position.set(-5, -6, -4);
    scene.add(pointLight2);

    const topGlowLight = new THREE.PointLight(new THREE.Color(activeFrequency.glowColor), 3.0, 30);
    topGlowLight.position.set(0, 4, 2);
    scene.add(topGlowLight);

    lightsRef.current = [pointLight1, pointLight2, topGlowLight];

    // 5. Sacred Geometries

    // A. Sacred Crystal Core (Faceted Diamond/Merkaba Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(1.6, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeFrequency.primaryColor),
      emissive: new THREE.Color(activeFrequency.glowColor),
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.15,
      transmission: 0.45,
      thickness: 1.2,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // B. Inner Sacred Star (Inverted Dual Octahedron / Merkaba Star effect)
    const starGeo = new THREE.OctahedronGeometry(1.2, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeFrequency.secondaryColor),
      wireframe: true,
      wireframeLinewidth: 2,
      transparent: true,
      opacity: 0.75
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.rotation.y = Math.PI / 4;
    starMesh.rotation.z = Math.PI / 4;
    coreMesh.add(starMesh);

    // C. Outer Sacred Wireframe Cage (Icosahedron Sacred Geometry)
    const outerGeo = new THREE.IcosahedronGeometry(2.35, 0);
    const outerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeFrequency.primaryColor),
      wireframe: true,
      wireframeLinewidth: 1.5,
      transparent: true,
      opacity: 0.65,
      metalness: 0.9,
      roughness: 0.2
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);
    outerWireRef.current = outerMesh;

    // Add luminous vertex points on the outer sacred cage
    const vertexPointsGeo = new THREE.IcosahedronGeometry(2.35, 0);
    const vertexPointsMat = new THREE.PointsMaterial({
      color: new THREE.Color(activeFrequency.secondaryColor),
      size: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const vertexPoints = new THREE.Points(vertexPointsGeo, vertexPointsMat);
    outerMesh.add(vertexPoints);

    // D. Sacred Orbital Rings (Concentric Sri Yantra / Harmonic Rings)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    ringGroupRef.current = ringGroup;

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeFrequency.primaryColor),
      metalness: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeFrequency.secondaryColor),
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });

    // Ring 1 (Equatorial Sri Yantra Ring)
    const ringGeo1 = new THREE.TorusGeometry(3.1, 0.025, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringGroup.add(ring1);

    // Ring 2 (Tilted Astrological Ring)
    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    ringGroup.add(ring2);

    // Ring 3 (Harmonic Vertical Ring)
    const ringGeo3 = new THREE.TorusGeometry(3.35, 0.018, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat1);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 4;
    ringGroup.add(ring3);

    // E. Swirling Celestial Aura Particles (Cosmic Stardust Field)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalDistances = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution with randomized aura radius
      const radius = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = Math.random() * 0.08 + 0.03;
      originalDistances[i] = radius;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(activeFrequency.particleColor),
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // Store materials for dynamic frequency theme transitions
    materialsRef.current = {
      core: coreMat,
      star: starMat,
      outer: outerMat,
      vertex: vertexPointsMat,
      ring1: ringMat1,
      ring2: ringMat2,
      particle: particleMat
    };

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base auto-rotation + interactive user drag/tilt
      if (coreMeshRef.current) {
        if (autoRotate) {
          coreMeshRef.current.rotation.y = elapsedTime * 0.35 + rotationOffsetRef.current.x + mouseRef.current.x * 0.8;
          coreMeshRef.current.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2 + rotationOffsetRef.current.y + mouseRef.current.y * 0.8;
          coreMeshRef.current.rotation.z = Math.cos(elapsedTime * 0.2) * 0.15;
        } else {
          coreMeshRef.current.rotation.y = rotationOffsetRef.current.x + mouseRef.current.x * 0.8;
          coreMeshRef.current.rotation.x = rotationOffsetRef.current.y + mouseRef.current.y * 0.8;
        }

        // Meditative breathing pulse (4-second cycle)
        const breathe = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
        coreMeshRef.current.scale.set(breathe, breathe, breathe);
      }

      if (outerWireRef.current) {
        outerWireRef.current.rotation.y = -elapsedTime * 0.25 + rotationOffsetRef.current.x * 0.8;
        outerWireRef.current.rotation.x = elapsedTime * 0.18 + rotationOffsetRef.current.y * 0.8;
        outerWireRef.current.rotation.z = Math.sin(elapsedTime * 0.3) * 0.2;
      }

      if (ringGroupRef.current) {
        ringGroupRef.current.rotation.y = elapsedTime * 0.15 + mouseRef.current.x * 0.4;
        ringGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15 + mouseRef.current.y * 0.4;
        ringGroupRef.current.children.forEach((r, idx) => {
          r.rotation.z += (idx % 2 === 0 ? 0.003 : -0.004);
        });
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.08 + mouseRef.current.x * 0.3;
        particlesRef.current.rotation.x = -elapsedTime * 0.05 + mouseRef.current.y * 0.3;

        // Pulsate particle field
        const pScale = 1 + Math.sin(elapsedTime * 1.2) * 0.06;
        particlesRef.current.scale.set(pScale, pScale, pScale);
      }

      // Orbit dynamic light for specular shimmer
      if (lightsRef.current[0]) {
        lightsRef.current[0].position.x = Math.cos(elapsedTime * 0.8) * 6;
        lightsRef.current[0].position.z = Math.sin(elapsedTime * 0.8) * 6;
        lightsRef.current[0].position.y = Math.sin(elapsedTime * 0.5) * 3 + 4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Event Listeners for Interaction
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.prevX;
        const deltaY = e.clientY - mouseRef.current.prevY;
        rotationOffsetRef.current.x += deltaX * 0.008;
        rotationOffsetRef.current.y += deltaY * 0.008;
        mouseRef.current.prevX = e.clientX;
        mouseRef.current.prevY = e.clientY;
      }
    };

    const handlePointerDown = (e) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
      setIsInteracting(true);
    };

    const handlePointerUp = () => {
      mouseRef.current.isDragging = false;
      setIsInteracting(false);
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isDragging = false;
      setIsInteracting(false);
    };

    // Touch Support for Mobile
    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouseRef.current.targetX = x;
        mouseRef.current.targetY = y;

        if (mouseRef.current.isDragging) {
          const deltaX = touch.clientX - mouseRef.current.prevX;
          const deltaY = touch.clientY - mouseRef.current.prevY;
          rotationOffsetRef.current.x += deltaX * 0.008;
          rotationOffsetRef.current.y += deltaY * 0.008;
          mouseRef.current.prevX = touch.clientX;
          mouseRef.current.prevY = touch.clientY;
        }
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        mouseRef.current.isDragging = true;
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
        setIsInteracting(true);
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isDragging = false;
      setIsInteracting(false);
    };

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;

      // Adjust camera distance based on screen width
      if (newWidth < 640) {
        cameraRef.current.position.z = 8.5; // pull back slightly on small mobile screens
      } else if (newWidth < 1024) {
        cameraRef.current.position.z = 7.8;
      } else {
        cameraRef.current.position.z = 7.2;
      }

      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    handleResize();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries and materials
      coreGeo.dispose();
      starGeo.dispose();
      outerGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringGeo3.dispose();
      particleGeo.dispose();

      Object.values(materialsRef.current).forEach((mat) => mat?.dispose?.());
      renderer.dispose();
    };
  }, []);

  // Update theme colors when user switches frequency mode
  useEffect(() => {
    if (!materialsRef.current.core) return;

    const { primaryColor, secondaryColor, particleColor, glowColor } = activeFrequency;

    // Smooth material color transitions
    const primary = new THREE.Color(primaryColor);
    const secondary = new THREE.Color(secondaryColor);
    const particle = new THREE.Color(particleColor);
    const glow = new THREE.Color(glowColor);

    if (materialsRef.current.core) {
      materialsRef.current.core.color.set(primary);
      materialsRef.current.core.emissive.set(glow);
    }
    if (materialsRef.current.star) {
      materialsRef.current.star.color.set(secondary);
    }
    if (materialsRef.current.outer) {
      materialsRef.current.outer.color.set(primary);
    }
    if (materialsRef.current.vertex) {
      materialsRef.current.vertex.color.set(secondary);
    }
    if (materialsRef.current.ring1) {
      materialsRef.current.ring1.color.set(primary);
    }
    if (materialsRef.current.ring2) {
      materialsRef.current.ring2.color.set(secondary);
    }
    if (materialsRef.current.particle) {
      materialsRef.current.particle.color.set(particle);
    }

    // Update dynamic lights
    if (lightsRef.current[0]) lightsRef.current[0].color.set(primary);
    if (lightsRef.current[1]) lightsRef.current[1].color.set(secondary);
    if (lightsRef.current[2]) lightsRef.current[2].color.set(glow);
  }, [activeFrequency]);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[480px] xl:h-[520px] cursor-grab active:cursor-grabbing relative z-10 touch-none flex items-center justify-center transition-all duration-500"
        title="Click and drag to rotate the Sacred 3D Merkaba Crystal"
      />

      {/* Interactive Micro Controls & Frequency Selector */}
      {showControls && (
        <div className="relative z-20 flex flex-col items-center gap-2.5 mt-[-15px] sm:mt-[-25px] w-full max-w-lg px-3">
          
          {/* Frequency Mode Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-cream-dark/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {FREQUENCY_MODES.map((mode) => {
              const isSelected = activeFrequency.id === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveFrequency(mode)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-charcoal-dark text-gold shadow-md scale-[1.03] border border-gold/40'
                      : 'text-charcoal-light hover:text-charcoal-dark hover:bg-cream-light/60'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: mode.primaryColor }}
                  />
                  <span>{mode.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Subtitle / Interaction Badge */}
          <div className="flex items-center justify-between w-full max-w-md px-3 text-[10px] sm:text-[11px] text-charcoal-light font-medium">
            <div className="flex items-center gap-1.5 text-charcoal-dark font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              <span>{activeFrequency.label}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-charcoal-light/80 italic">
                {isInteracting ? '✨ Aligning energy...' : '🖱️ Drag to rotate 3D crystal'}
              </span>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1 rounded-lg border transition-colors ${
                  autoRotate
                    ? 'bg-gold/15 text-gold-darker border-gold/30'
                    : 'bg-white text-charcoal-light border-cream-dark'
                }`}
                title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default SacredGeometry3D;
