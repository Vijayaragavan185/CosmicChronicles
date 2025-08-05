import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { 
  Camera, Smartphone, RotateCcw, ZoomIn, ZoomOut, 
  Info, Play, Pause, Settings, Maximize, Eye, 
  Globe, Orbit, Ruler, Clock
} from 'lucide-react';

interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  color: number;
  rotationSpeed: number;
  orbitSpeed: number;
  moons: number;
  info: string;
}

export const ARSolarSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planetsRef = useRef<THREE.Mesh[]>([]);
  const orbitsRef = useRef<THREE.LineLoop[]>([]);
  const animationRef = useRef<number>(0);
  
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [arSupported, setArSupported] = useState(false);
  const [arActive, setArActive] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

  // ✅ BRIGHT Solar system data with enhanced colors
  const planetsData: PlanetData[] = [
    {
      name: 'Mercury',
      radius: 0.3,
      distance: 4,
      color: 0xc97e47, // Brighter orange-brown
      rotationSpeed: 0.02,
      orbitSpeed: 0.04,
      moons: 0,
      info: 'Closest planet to the Sun, extremely hot and cold extremes'
    },
    {
      name: 'Venus',
      radius: 0.4,
      distance: 6,
      color: 0xffdd44, // Bright yellow
      rotationSpeed: 0.015,
      orbitSpeed: 0.035,
      moons: 0,
      info: 'Hottest planet, thick atmosphere of carbon dioxide'
    },
    {
      name: 'Earth',
      radius: 0.45,
      distance: 8,
      color: 0x4488ff, // Bright blue
      rotationSpeed: 0.01,
      orbitSpeed: 0.03,
      moons: 1,
      info: 'Our home planet, the only known planet with life'
    },
    {
      name: 'Mars',
      radius: 0.35,
      distance: 10,
      color: 0xff4422, // Bright red
      rotationSpeed: 0.01,
      orbitSpeed: 0.025,
      moons: 2,
      info: 'The Red Planet, target for future human exploration'
    },
    {
      name: 'Jupiter',
      radius: 1.2,
      distance: 15,
      color: 0xffaa66, // Bright orange
      rotationSpeed: 0.005,
      orbitSpeed: 0.015,
      moons: 79,
      info: 'Largest planet, gas giant with Great Red Spot storm'
    },
    {
      name: 'Saturn',
      radius: 1.0,
      distance: 20,
      color: 0xffcc88, // Bright golden
      rotationSpeed: 0.005,
      orbitSpeed: 0.01,
      moons: 82,
      info: 'Famous for its spectacular ring system'
    },
    {
      name: 'Uranus',
      radius: 0.7,
      distance: 25,
      color: 0x66ccff, // Bright cyan
      rotationSpeed: 0.003,
      orbitSpeed: 0.008,
      moons: 27,
      info: 'Ice giant that rotates on its side'
    },
    {
      name: 'Neptune',
      radius: 0.7,
      distance: 30,
      color: 0x3366ff, // Bright blue
      rotationSpeed: 0.003,
      orbitSpeed: 0.005,
      moons: 14,
      info: 'Windiest planet with speeds up to 2,100 km/h'
    }
  ];

  // Check AR support
  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-ar')
        .then((supported: boolean) => setArSupported(supported))
        .catch(() => setArSupported(false));
    }
  }, []);

  // ✅ BRIGHT Scene initialization
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    // Clear previous scene
    if (sceneRef.current) {
      sceneRef.current.clear();
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    planetsRef.current = [];
    orbitsRef.current = [];

    // Scene with star background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001122); // Dark blue instead of black
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ✅ BRIGHT Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false // No transparency for better brightness
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = false; // Disable shadows for brighter appearance
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ✅ BRIGHT Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Much brighter ambient light
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffff99, 3, 200); // Brighter sun light
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Additional lights for better visibility
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 50, 0);
    scene.add(topLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 0.3);
    sideLight.position.set(50, 0, 50);
    scene.add(sideLight);

    // ✅ BRIGHT Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.2 // Brighter emission
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 2000; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // ✅ BRIGHT Planets with enhanced materials
    planetsData.forEach((planetData, index) => {
      // Planet with bright material
      const planetGeometry = new THREE.SphereGeometry(planetData.radius * scale, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({ 
        color: planetData.color,
        emissive: planetData.color,
        emissiveIntensity: 0.2, // Add slight glow
        shininess: 30,
        specular: 0x333333
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      
      planet.position.x = planetData.distance * scale;
      planet.userData = { ...planetData, index };
      
      scene.add(planet);
      planetsRef.current.push(planet);

      // ✅ BRIGHT Orbit rings
      if (showOrbits) {
        const orbitPoints = [];
        for (let i = 0; i <= 128; i++) {
          const angle = (i / 128) * Math.PI * 2;
          orbitPoints.push(new THREE.Vector3(
            Math.cos(angle) * planetData.distance * scale,
            0,
            Math.sin(angle) * planetData.distance * scale
          ));
        }
        
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0x888888,
          transparent: true,
          opacity: 0.6 // More visible orbits
        });
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        scene.add(orbit);
        orbitsRef.current.push(orbit);
      }

      // ✅ BRIGHT Planet labels
      if (showInfo) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 256;
        canvas.height = 64;
        
        // White background for better visibility
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#ffffff';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(planetData.name, 128, 25);
        context.font = '16px Arial';
        context.fillText(`Moons: ${planetData.moons}`, 128, 45);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(
          planetData.distance * scale,
          planetData.radius * scale + 2,
          0
        );
        sprite.scale.set(3, 0.75, 1);
        scene.add(sprite);
      }
    });

    // ✅ OrbitControls
    try {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 10;
      controls.maxDistance = 150;
      controls.maxPolarAngle = Math.PI;
      controlsRef.current = controls;
    } catch (error) {
      console.warn('OrbitControls initialization failed:', error);
    }

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current || !camera || !scene) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetsRef.current);

      if (intersects.length > 0) {
        const planet = intersects[0].object as THREE.Mesh;
        setSelectedPlanet(planet.userData.name);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [scale, showOrbits, showInfo, planetsData]);

  // ✅ SMOOTH Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Update controls
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Animate planets if playing
    if (isAnimating) {
      planetsRef.current.forEach((planet) => {
        const planetData = planet.userData as PlanetData;
        
        // Rotate planet on its axis
        planet.rotation.y += planetData.rotationSpeed * timeScale;
        
        // Orbit around sun
        const time = Date.now() * 0.001 * timeScale;
        const angle = time * planetData.orbitSpeed;
        planet.position.x = Math.cos(angle) * planetData.distance * scale;
        planet.position.z = Math.sin(angle) * planetData.distance * scale;
      });
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, [isAnimating, timeScale, scale]);

  // Initialize scene and start animation
  useEffect(() => {
    const cleanup = initScene();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (cleanup) cleanup();
    };
  }, [initScene, animate]);

  // Start AR session
  const startARSession = async () => {
    if (!arSupported) return;

    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['local'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      });
      
      setArActive(true);
      console.log('AR session started');
      
      session.addEventListener('end', () => {
        setArActive(false);
      });
    } catch (error) {
      console.error('Failed to start AR session:', error);
    }
  };

  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 15, 35);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black text-white relative">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            🚀 AR Solar System Explorer
          </h1>
          <p className="text-sm text-gray-300">Interactive 3D Solar System • Real-time Orbits • Bright Planets</p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="absolute top-20 left-4 z-10 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg max-w-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Settings className="mr-2" size={20} />
          Controls
        </h3>
        
        <div className="space-y-4">
          {/* AR Toggle */}
          {arSupported && (
            <button
              onClick={startARSession}
              disabled={arActive}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                arActive 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Camera className="mr-2" size={16} />
              {arActive ? 'AR Active' : 'Launch AR Mode'}
            </button>
          )}

          {/* Animation Toggle */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
              isAnimating 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAnimating ? <Pause className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
            {isAnimating ? 'Pause' : 'Play'} Animation
          </button>

          {/* Reset View */}
          <button
            onClick={resetView}
            className="flex items-center w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="mr-2" size={16} />
            Reset View
          </button>

          {/* Time Scale */}
          <div>
            <label className="block text-sm mb-2">
              Time Scale: {timeScale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={timeScale}
              onChange={(e) => setTimeScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Scale */}
          <div>
            <label className="block text-sm mb-2">
              System Scale: {scale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Toggle Options */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={(e) => setShowOrbits(e.target.checked)}
                className="mr-2"
              />
              Show Orbits
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showInfo}
                onChange={(e) => setShowInfo(e.target.checked)}
                className="mr-2"
              />
              Show Labels
            </label>
          </div>
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 z-10 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-blue-400 flex items-center">
              <Globe className="mr-2" size={20} />
              {selectedPlanet}
            </h3>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          
          {(() => {
            const planet = planetsData.find(p => p.name === selectedPlanet);
            if (!planet) return null;
            
            return (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">{planet.info}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-blue-400 ml-1">{planet.distance} AU</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Moons:</span>
                    <span className="text-blue-400 ml-1">{planet.moons}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Radius:</span>
                    <span className="text-blue-400 ml-1">{planet.radius} R⊕</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Orbit Speed:</span>
                    <span className="text-blue-400 ml-1">{planet.orbitSpeed.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <Eye className="mr-2 text-blue-400" size={16} />
            <span>Click planets for information</span>
          </div>
          <div className="flex items-center">
            <Orbit className="mr-2 text-purple-400" size={16} />
            <span>Drag to rotate • Scroll to zoom</span>
          </div>
          <div className="flex items-center">
            <Smartphone className="mr-2 text-green-400" size={16} />
            <span>Use AR on compatible devices</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 text-orange-400" size={16} />
            <span>Adjust time scale for faster orbits</span>
          </div>
        </div>
      </div>

      {/* Main 3D View */}
      <div 
        ref={mountRef} 
        className="w-full h-screen"
      />
    </div>
  );
};

export default ARSolarSystem;
