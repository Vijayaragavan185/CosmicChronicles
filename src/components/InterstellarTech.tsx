import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Target, Gauge, Orbit, AlertTriangle, Cpu, Radio } from 'lucide-react';

interface WormholeData {
  stability: number;
  timeDialation: number;
  gravitationalForce: number;
  radiationLevel: number;
}

interface BlackHoleData {
  mass: number;
  radius: number;
  hawkingRadiation: number;
  timeDialation: number;
  tidalForce: number;
}

export const InterstellarTech: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<string>('wormhole');
  const [wormholeData, setWormholeData] = useState<WormholeData>({
    stability: 85,
    timeDialation: 1.2,
    gravitationalForce: 9.8,
    radiationLevel: 15
  });
  const [blackHoleData, setBlackHoleData] = useState<BlackHoleData>({
    mass: 10,
    radius: 29.5,
    hawkingRadiation: 6.2e-9,
    timeDialation: 1.5,
    tidalForce: 1000
  });
  const [enduranceStatus, setEnduranceStatus] = useState({
    fuel: 78,
    oxygen: 92,
    power: 88,
    hull: 95,
    navigation: 'ONLINE',
    communication: 'ONLINE'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWormholeData(prev => ({
        ...prev,
        stability: Math.max(0, Math.min(100, prev.stability + (Math.random() - 0.5) * 5)),
        timeDialation: Math.max(1, prev.timeDialation + (Math.random() - 0.5) * 0.1),
        gravitationalForce: Math.max(0, prev.gravitationalForce + (Math.random() - 0.5) * 2),
        radiationLevel: Math.max(0, prev.radiationLevel + (Math.random() - 0.5) * 3)
      }));

      setEnduranceStatus(prev => ({
        ...prev,
        fuel: Math.max(0, prev.fuel - 0.1),
        oxygen: Math.max(0, prev.oxygen - 0.05),
        power: Math.max(0, prev.power + (Math.random() - 0.5) * 2)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeSystem !== 'wormhole') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 20; i++) {
        const radius = 20 + i * 15;
        const opacity = 1 - i * 0.05;
        const rotation = time * 0.02 + i * 0.1;

        ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const x = centerX + Math.cos(angle + rotation) * radius;
          const y = centerY + Math.sin(angle + rotation) * radius * 0.3;
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      for (let i = 0; i < 50; i++) {
        const angle = (time * 0.05 + i * 0.1) % (Math.PI * 2);
        const radius = 50 + (i % 10) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.3;

        ctx.fillStyle = `rgba(0, 255, 255, ${0.8 - (i % 10) * 0.08})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      setTime(prev => prev + 1);
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [activeSystem, time]);

  const getStatusColor = (value: number, threshold: number = 50) => {
    if (value > threshold) return 'text-green-400';
    if (value > threshold * 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const systems = [
    {
      id: 'wormhole',
      title: 'Wormhole Navigation',
      icon: <Target className="w-6 h-6" />,
      description: 'Traverse spacetime through Einstein-Rosen bridges'
    },
    {
      id: 'blackhole',
      title: 'Black Hole Analysis',
      icon: <Orbit className="w-6 h-6" />,
      description: 'Analyze gravitational anomalies and time dilation'
    },
    {
      id: 'endurance',
      title: 'Endurance Systems',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Monitor spacecraft systems and life support'
    },
    {
      id: 'tesseract',
      title: 'Tesseract Interface',
      icon: <Zap className="w-6 h-6" />,
      description: 'Fifth-dimensional communication system'
    }
  ];

  const renderSystem = () => {
    switch (activeSystem) {
      case 'wormhole':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="w-full h-auto bg-black rounded-lg border border-purple-500/30"
                />
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Wormhole Tunnel Visualization
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Stability</span>
                    <span className={`font-mono ${getStatusColor(wormholeData.stability, 70)}`}>
                      {wormholeData.stability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        wormholeData.stability > 70 ? 'bg-green-500' :
                        wormholeData.stability > 35 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${wormholeData.stability}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Time Dilation Factor</span>
                    <span className="font-mono text-blue-400">
                      {wormholeData.timeDialation.toFixed(2)}x
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Time passes {wormholeData.timeDialation.toFixed(2)} times slower relative to Earth
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Gravitational Force</span>
                    <span className="font-mono text-purple-400">
                      {wormholeData.gravitationalForce.toFixed(1)} G
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Radiation Level</span>
                    <span className={`font-mono ${getStatusColor(100 - wormholeData.radiationLevel, 70)}`}>
                      {wormholeData.radiationLevel.toFixed(1)} mSv/h
                    </span>
                  </div>
                  {wormholeData.radiationLevel > 20 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">Elevated radiation detected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'blackhole':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Black Hole Mass (Solar Masses)
                  </label>
                  <input
                    type="number"
                    value={blackHoleData.mass}
                    onChange={(e) => {
                      const mass = parseFloat(e.target.value) || 1;
                      const radius = 2.95 * mass; 
                      const hawking = 6.2e-8 / mass; 
                      const tidal = 1000 / (mass ** 0.5); 
                      
                      setBlackHoleData({
                        mass,
                        radius,
                        hawkingRadiation: hawking,
                        timeDialation: 1 + mass * 0.05,
                        tidalForce: tidal
                      });
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-black/50 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="text-white font-semibold mb-3">Gargantua Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Event Horizon:</span>
                      <span className="text-purple-400 font-mono">{blackHoleData.radius.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hawking Radiation:</span>
                      <span className="text-blue-400 font-mono">{blackHoleData.hawkingRadiation.toExponential(2)} K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Time Dilation:</span>
                      <span className="text-green-400 font-mono">{blackHoleData.timeDialation.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tidal Force:</span>
                      <span className="text-red-400 font-mono">{blackHoleData.tidalForce.toFixed(0)} G/m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-lg p-6 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/20 to-black"></div>
                <div className="relative z-10">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-black rounded-full border-4 border-purple-500 animate-pulse"></div>
                    <div className="absolute inset-2 bg-gradient-radial from-purple-600/50 to-transparent rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full"></div>
                  </div>
                  <p className="text-center text-gray-400 text-sm">
                    Gargantua - Supermassive Black Hole
                  </p>
                  <div className="mt-4 text-center">
                    <div className="text-yellow-400 text-xs">
                      ⚠ EXTREME GRAVITATIONAL FIELD
                    </div>
                    <div className="text-red-400 text-xs mt-1">
                      Time: 1 hour = 7 Earth years
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'endurance':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Gauge className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Fuel</span>
                </div>
                <div className="text-2xl font-mono text-blue-400 mb-2">
                  {enduranceStatus.fuel.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${enduranceStatus.fuel}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Radio className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Oxygen</span>
                </div>
                <div className="text-2xl font-mono text-green-400 mb-2">
                  {enduranceStatus.oxygen.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${enduranceStatus.oxygen}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Power</span>
                </div>
                <div className="text-2xl font-mono text-yellow-400 mb-2">
                  {enduranceStatus.power.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${enduranceStatus.power}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-4">System Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Navigation</span>
                    <span className="text-green-400 font-mono">{enduranceStatus.navigation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Communication</span>
                    <span className="text-green-400 font-mono">{enduranceStatus.communication}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hull Integrity</span>
                    <span className="text-green-400 font-mono">{enduranceStatus.hull}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Life Support</span>
                    <span className="text-green-400 font-mono">NOMINAL</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                <h4 className="text-white font-semibold mb-4">Mission Parameters</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Location:</span>
                    <span className="text-blue-400">Miller's Planet Orbit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Distance from Earth:</span>
                    <span className="text-purple-400">10 billion light-years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mission Time:</span>
                    <span className="text-green-400">2 years, 47 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Earth Time Elapsed:</span>
                    <span className="text-red-400">23 years, 4 months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tesseract':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-lg p-8 border border-purple-500/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Fifth Dimensional Interface</h3>
                <p className="text-gray-300">Communicate across time and space through gravitational manipulation</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-6 border border-cyan-500/30">
                    <h4 className="text-cyan-400 font-semibold mb-4">Temporal Coordinates</h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">X-Dimension:</span>
                        <span className="text-cyan-400">+∞</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Y-Dimension:</span>
                        <span className="text-cyan-400">+∞</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Z-Dimension:</span>
                        <span className="text-cyan-400">+∞</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Time:</span>
                        <span className="text-yellow-400">Variable</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bulk Space:</span>
                        <span className="text-purple-400">Accessible</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
                    <h4 className="text-purple-400 font-semibold mb-4">Gravitational Manipulation</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Quantum entanglement stable</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-400 text-sm">Gravitational waves detected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-yellow-400 text-sm">Temporal paradox avoided</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-6 border border-green-500/30">
                    <h4 className="text-green-400 font-semibold mb-4">Communication Log</h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-300">
                        <span className="text-cyan-400">[MURPH]</span> Dad, I know you're there...
                      </div>
                      <div className="text-gray-300">
                        <span className="text-purple-400">[COOPER]</span> I'm here, Murph. I'm here.
                      </div>
                      <div className="text-gray-300">
                        <span className="text-cyan-400">[MURPH]</span> The watch... the coordinates...
                      </div>
                      <div className="text-gray-300">
                        <span className="text-purple-400">[COOPER]</span> The equation, Murph. You have to solve it.
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-lg p-6 border border-yellow-500/30">
                    <h4 className="text-yellow-400 font-semibold mb-4">Quantum Data Transfer</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Data Integrity:</span>
                        <span className="text-green-400">100%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Transmission Rate:</span>
                        <span className="text-blue-400">∞ bits/sec</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Temporal Accuracy:</span>
                        <span className="text-purple-400">±0.001 seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 bg-black/50 rounded-full px-6 py-3 border border-white/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-mono">TESSERACT INTERFACE ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Zap className="w-8 h-8 text-purple-400" />
          <span>Interstellar Technology</span>
          <Clock className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Advanced space-time manipulation and exploration systems
        </p>
        <p className="text-gray-400 text-sm mt-2">
          "We are not meant to save the world. We are meant to leave it." - Cooper
        </p>
      </div>

      {/* System Selection */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {systems.map((system) => (
          <button
            key={system.id}
            onClick={() => setActiveSystem(system.id)}
            className={`p-6 rounded-xl transition-all duration-300 ${
              activeSystem === system.id
                ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50'
                : 'bg-white/10 hover:bg-white/20 border border-white/20'
            }`}
          >
            <div className={`p-3 rounded-lg mb-4 ${
              activeSystem === system.id ? 'bg-purple-500' : 'bg-white/20'
            }`}>
              {system.icon}
            </div>
            <h3 className="text-white font-semibold mb-2">{system.title}</h3>
            <p className="text-gray-400 text-sm">{system.description}</p>
          </button>
        ))}
      </div>

      {/* Active System Interface */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            {systems.find(s => s.id === activeSystem)?.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {systems.find(s => s.id === activeSystem)?.title}
            </h3>
            <p className="text-gray-400">
              {systems.find(s => s.id === activeSystem)?.description}
            </p>
          </div>
        </div>
        
        {renderSystem()}
      </div>

      {/* Scientific Information */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Scientific Foundation</h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h5 className="text-purple-400 font-medium mb-2">Einstein-Rosen Bridges (Wormholes)</h5>
            <p>Theoretical passages through spacetime that could create shortcuts for long journeys across the universe. Based on solutions to Einstein's field equations.</p>
          </div>
          <div>
            <h5 className="text-blue-400 font-medium mb-2">Gravitational Time Dilation</h5>
            <p>Time passes more slowly in stronger gravitational fields. Near massive objects like black holes, time can slow dramatically relative to distant observers.</p>
          </div>
          <div>
            <h5 className="text-green-400 font-medium mb-2">Higher Dimensions</h5>
            <p>String theory suggests our universe may have more than four dimensions. These extra dimensions could allow for phenomena like the tesseract interface.</p>
          </div>
          <div>
            <h5 className="text-yellow-400 font-medium mb-2">Quantum Entanglement</h5>
            <p>Particles can be connected across vast distances, with changes to one instantly affecting the other, potentially enabling faster-than-light communication.</p>
          </div>
        </div>
      </div>
    </div>
  );
};