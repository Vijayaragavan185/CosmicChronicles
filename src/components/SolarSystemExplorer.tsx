import React, { useState, useEffect, useRef } from 'react';
import { Orbit, Info, Zap, Thermometer, Clock, Ruler } from 'lucide-react';

interface Planet {
  id: string;
  name: string;
  radius: number;
  distance: number;
  color: string;
  rotationSpeed: number;
  orbitSpeed: number;
  info: {
    diameter: string;
    mass: string;
    temperature: string;
    dayLength: string;
    yearLength: string;
    moons: number;
    atmosphere: string;
    description: string;
    funFacts: string[];
  };
}

const planets: Planet[] = [
  {
    id: 'sun',
    name: 'Sun',
    radius: 30,
    distance: 0,
    color: '#FDB813',
    rotationSpeed: 0.1,
    orbitSpeed: 0,
    info: {
      diameter: '1,392,700 km',
      mass: '1.989 × 10³⁰ kg',
      temperature: '5,778 K (surface)',
      dayLength: '25 Earth days',
      yearLength: 'N/A',
      moons: 0,
      atmosphere: 'Hydrogen, Helium',
      description: 'The Sun is a G-type main-sequence star that contains 99.86% of the Solar System\'s mass.',
      funFacts: [
        'The Sun produces energy through nuclear fusion',
        'It takes 8 minutes for sunlight to reach Earth',
        'The Sun is 4.6 billion years old',
        'It could fit 1.3 million Earths inside it'
      ]
    }
  },
  {
    id: 'mercury',
    name: 'Mercury',
    radius: 4,
    distance: 80,
    color: '#8C7853',
    rotationSpeed: 0.02,
    orbitSpeed: 0.04,
    info: {
      diameter: '4,879 km',
      mass: '3.301 × 10²³ kg',
      temperature: '167°C (average)',
      dayLength: '59 Earth days',
      yearLength: '88 Earth days',
      moons: 0,
      atmosphere: 'Extremely thin',
      description: 'Mercury is the smallest planet and closest to the Sun, with extreme temperature variations.',
      funFacts: [
        'Has the most eccentric orbit of all planets',
        'Temperature ranges from -173°C to 427°C',
        'One day on Mercury is longer than its year',
        'Has a large iron core'
      ]
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 6,
    distance: 120,
    color: '#FFC649',
    rotationSpeed: -0.01,
    orbitSpeed: 0.03,
    info: {
      diameter: '12,104 km',
      mass: '4.867 × 10²⁴ kg',
      temperature: '464°C',
      dayLength: '243 Earth days',
      yearLength: '225 Earth days',
      moons: 0,
      atmosphere: '96% CO₂, thick clouds',
      description: 'Venus is the hottest planet due to its thick atmosphere and greenhouse effect.',
      funFacts: [
        'Rotates backwards (retrograde rotation)',
        'Hottest planet in the solar system',
        'Has surface pressure 90 times that of Earth',
        'Called Earth\'s "twin" due to similar size'
      ]
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    radius: 6,
    distance: 160,
    color: '#6B93D6',
    rotationSpeed: 0.05,
    orbitSpeed: 0.025,
    info: {
      diameter: '12,756 km',
      mass: '5.972 × 10²⁴ kg',
      temperature: '15°C (average)',
      dayLength: '24 hours',
      yearLength: '365.25 days',
      moons: 1,
      atmosphere: '78% N₂, 21% O₂',
      description: 'Earth is the only known planet with life, featuring liquid water and a protective atmosphere.',
      funFacts: [
        'Only planet known to support life',
        '71% of surface is covered by water',
        'Has a magnetic field that protects from radiation',
        'The Moon stabilizes Earth\'s axial tilt'
      ]
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 5,
    distance: 200,
    color: '#CD5C5C',
    rotationSpeed: 0.048,
    orbitSpeed: 0.02,
    info: {
      diameter: '6,792 km',
      mass: '6.39 × 10²³ kg',
      temperature: '-65°C (average)',
      dayLength: '24.6 hours',
      yearLength: '687 Earth days',
      moons: 2,
      atmosphere: '95% CO₂, very thin',
      description: 'Mars is known as the Red Planet due to iron oxide on its surface.',
      funFacts: [
        'Has the largest volcano in the solar system (Olympus Mons)',
        'Evidence of ancient water flows',
        'Has polar ice caps',
        'Day length is similar to Earth'
      ]
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 20,
    distance: 280,
    color: '#D8CA9D',
    rotationSpeed: 0.1,
    orbitSpeed: 0.015,
    info: {
      diameter: '142,984 km',
      mass: '1.898 × 10²⁷ kg',
      temperature: '-110°C (cloud tops)',
      dayLength: '9.9 hours',
      yearLength: '12 Earth years',
      moons: 95,
      atmosphere: 'Hydrogen, Helium',
      description: 'Jupiter is the largest planet, a gas giant with a Great Red Spot storm.',
      funFacts: [
        'Has more mass than all other planets combined',
        'The Great Red Spot is a storm larger than Earth',
        'Acts as a "cosmic vacuum cleaner" protecting inner planets',
        'Has a faint ring system'
      ]
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radius: 18,
    distance: 360,
    color: '#FAD5A5',
    rotationSpeed: 0.09,
    orbitSpeed: 0.012,
    info: {
      diameter: '120,536 km',
      mass: '5.683 × 10²⁶ kg',
      temperature: '-140°C (cloud tops)',
      dayLength: '10.7 hours',
      yearLength: '29 Earth years',
      moons: 146,
      atmosphere: 'Hydrogen, Helium',
      description: 'Saturn is famous for its prominent ring system and low density.',
      funFacts: [
        'Less dense than water - it would float!',
        'Has the most spectacular ring system',
        'Titan, its largest moon, has lakes of methane',
        'Has hexagonal storm at its north pole'
      ]
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 12,
    distance: 440,
    color: '#4FD0E7',
    rotationSpeed: 0.07,
    orbitSpeed: 0.008,
    info: {
      diameter: '51,118 km',
      mass: '8.681 × 10²⁵ kg',
      temperature: '-195°C',
      dayLength: '17.2 hours',
      yearLength: '84 Earth years',
      moons: 27,
      atmosphere: 'Hydrogen, Helium, Methane',
      description: 'Uranus is an ice giant that rotates on its side, likely due to an ancient collision.',
      funFacts: [
        'Rotates on its side (98° axial tilt)',
        'Has faint rings discovered in 1977',
        'Coldest planetary atmosphere in solar system',
        'Takes 84 Earth years to orbit the Sun'
      ]
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radius: 12,
    distance: 520,
    color: '#4B70DD',
    rotationSpeed: 0.065,
    orbitSpeed: 0.006,
    info: {
      diameter: '49,528 km',
      mass: '1.024 × 10²⁶ kg',
      temperature: '-200°C',
      dayLength: '16.1 hours',
      yearLength: '165 Earth years',
      moons: 16,
      atmosphere: 'Hydrogen, Helium, Methane',
      description: 'Neptune is the windiest planet with speeds up to 2,100 km/h.',
      funFacts: [
        'Has the fastest winds in the solar system',
        'Was discovered through mathematical predictions',
        'Has a Great Dark Spot (similar to Jupiter\'s Great Red Spot)',
        'Takes 165 Earth years to complete one orbit'
      ]
    }
  }
];

export const SolarSystemExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 200; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 3) * 0.2})`;
        ctx.fillRect(x, y, 1, 1);
      }

      planets.forEach((planet) => {
        if (planet.id === 'sun') {
          ctx.fillStyle = planet.color;
          ctx.beginPath();
          ctx.arc(centerX, centerY, planet.radius, 0, Math.PI * 2);
          ctx.fill();
          
          const gradient = ctx.createRadialGradient(centerX, centerY, planet.radius, centerX, centerY, planet.radius * 2);
          gradient.addColorStop(0, `${planet.color}40`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, planet.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const angle = time * planet.orbitSpeed * speed;
          const x = centerX + Math.cos(angle) * planet.distance;
          const y = centerY + Math.sin(angle) * planet.distance;

          if (showOrbits) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = planet.color;
          ctx.beginPath();
          ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
          ctx.fill();

          if (selectedPlanet?.id === planet.id) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, planet.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
          }

          if (planet.id === 'saturn') {
            ctx.strokeStyle = `${planet.color}80`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, planet.radius + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, planet.radius + 12, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      if (isPlaying) {
        setTime(prev => prev + 0.01);
      }
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [isPlaying, speed, showOrbits, time, selectedPlanet]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const sunDistance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
    if (sunDistance <= planets[0].radius) {
      setSelectedPlanet(planets[0]);
      return;
    }

    planets.slice(1).forEach((planet) => {
      const angle = time * planet.orbitSpeed * speed;
      const planetX = centerX + Math.cos(angle) * planet.distance;
      const planetY = centerY + Math.sin(angle) * planet.distance;
      const distance = Math.sqrt((clickX - planetX) ** 2 + (clickY - planetY) ** 2);
      
      if (distance <= planet.radius) {
        setSelectedPlanet(planet);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Orbit className="w-8 h-8 text-purple-400" />
          <span>3D Solar System Explorer</span>
          <Zap className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Click on planets to explore their fascinating details
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Solar System Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Solar System</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => setShowOrbits(!showOrbits)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showOrbits ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}
                >
                  Orbits
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Speed: {speed}x</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="w-full h-auto bg-gradient-to-b from-indigo-900/50 to-black/50 rounded-lg cursor-pointer border border-white/10"
            />
            
            <p className="text-gray-400 text-sm mt-2 text-center">
              Click on any celestial body to learn more about it
            </p>
          </div>
        </div>

        {/* Planet Information Panel */}
        <div className="space-y-6">
          {selectedPlanet ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: selectedPlanet.color }}
                />
                <h3 className="text-2xl font-bold text-white">{selectedPlanet.name}</h3>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {selectedPlanet.info.description}
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-gray-400">Diameter</div>
                      <div className="text-white font-medium">{selectedPlanet.info.diameter}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <div>
                      <div className="text-gray-400">Temperature</div>
                      <div className="text-white font-medium">{selectedPlanet.info.temperature}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-gray-400">Day Length</div>
                      <div className="text-white font-medium">{selectedPlanet.info.dayLength}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Orbit className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-gray-400">Year Length</div>
                      <div className="text-white font-medium">{selectedPlanet.info.yearLength}</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-2">Fun Facts</h4>
                  <ul className="space-y-2">
                    {selectedPlanet.info.funFacts.map((fact, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300 text-sm">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Planet</h3>
              <p className="text-gray-400">
                Click on any planet or the Sun in the solar system to learn fascinating details about it.
              </p>
            </div>
          )}
          
          {/* Quick Planet List */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
            <div className="space-y-2">
              {planets.map((planet) => (
                <button
                  key={planet.id}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    selectedPlanet?.id === planet.id
                      ? 'bg-purple-600/30 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span className="text-white font-medium">{planet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};