import React, { useState } from 'react';
import { Calculator, Ruler, Clock, Zap, Target, Globe, Telescope, Star } from 'lucide-react';

interface CalculatorResult {
  value: number;
  unit: string;
  explanation: string;
}

export const AstronomyCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>('distance');
  const [results, setResults] = useState<{ [key: string]: CalculatorResult | null }>({});

  const [parallax, setParallax] = useState<string>('');
  
  const [distance, setDistance] = useState<string>('');
  const [distanceUnit, setDistanceUnit] = useState<string>('ly');
  
  const [aperture, setAperture] = useState<string>('');
  const [focalLength, setFocalLength] = useState<string>('');
  
  const [mass, setMass] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  
  const [observedWavelength, setObservedWavelength] = useState<string>('');
  const [restWavelength, setRestWavelength] = useState<string>('');
  
  const [stellarMass, setStellarMass] = useState<string>('');
  const [stellarTemp, setStellarTemp] = useState<string>('');

  const calculateDistance = () => {
    const p = parseFloat(parallax);
    if (isNaN(p) || p <= 0) return;
    
    const distanceInParsecs = 1 / p;
    const distanceInLightYears = distanceInParsecs * 3.26;
    
    setResults({
      ...results,
      distance: {
        value: distanceInLightYears,
        unit: 'light-years',
        explanation: `Using parallax of ${p} arcseconds, the star is ${distanceInParsecs.toFixed(2)} parsecs or ${distanceInLightYears.toFixed(2)} light-years away.`
      }
    });
  };

  const calculateLightTravelTime = () => {
    const d = parseFloat(distance);
    if (isNaN(d) || d <= 0) return;
    
    let timeInYears: number;
    let explanation: string;
    
    if (distanceUnit === 'ly') {
      timeInYears = d;
      explanation = `Light from an object ${d} light-years away takes ${d} years to reach us.`;
    } else if (distanceUnit === 'km') {
      timeInYears = d / (9.461e12); 
      const timeInSeconds = d / 299792458; 
      if (timeInSeconds < 60) {
        explanation = `Light travels ${d} km in ${timeInSeconds.toFixed(2)} seconds.`;
      } else if (timeInSeconds < 3600) {
        explanation = `Light travels ${d} km in ${(timeInSeconds / 60).toFixed(2)} minutes.`;
      } else {
        explanation = `Light travels ${d} km in ${(timeInSeconds / 3600).toFixed(2)} hours.`;
      }
    } else { 
      timeInYears = d / 63241; 
      const timeInMinutes = d * 8.317; 
      explanation = `Light travels ${d} AU in ${timeInMinutes.toFixed(2)} minutes.`;
    }
    
    setResults({
      ...results,
      lightTime: {
        value: timeInYears,
        unit: 'years',
        explanation
      }
    });
  };

  const calculateTelescopeSpecs = () => {
    const a = parseFloat(aperture);
    const f = parseFloat(focalLength);
    if (isNaN(a) || isNaN(f) || a <= 0 || f <= 0) return;
    
    const fRatio = f / a;
    const lightGatheringPower = (a / 7) ** 2; 
    const resolutionArcsec = 116 / a; 
    
    setResults({
      ...results,
      telescope: {
        value: fRatio,
        unit: 'f-ratio',
        explanation: `F-ratio: f/${fRatio.toFixed(1)}, Light gathering: ${lightGatheringPower.toFixed(0)}x human eye, Resolution: ${resolutionArcsec.toFixed(2)} arcseconds`
      }
    });
  };

  const calculateEscapeVelocity = () => {
    const m = parseFloat(mass);
    const r = parseFloat(radius);
    if (isNaN(m) || isNaN(r) || m <= 0 || r <= 0) return;
    
    const G = 6.674e-11; 
    const massKg = m * 5.972e24; 
    const radiusM = r * 6.371e6; 
    
    const escapeVel = Math.sqrt(2 * G * massKg / radiusM) / 1000; 
    
    setResults({
      ...results,
      escape: {
        value: escapeVel,
        unit: 'km/s',
        explanation: `An object needs ${escapeVel.toFixed(2)} km/s to escape the gravitational pull of this celestial body.`
      }
    });
  };

  const calculateRedshift = () => {
    const observed = parseFloat(observedWavelength);
    const rest = parseFloat(restWavelength);
    if (isNaN(observed) || isNaN(rest) || observed <= 0 || rest <= 0) return;
    
    const z = (observed - rest) / rest;
    const velocity = z * 299792.458; 
    const distance = velocity / 70; 
    
    setResults({
      ...results,
      redshift: {
        value: z,
        unit: 'z',
        explanation: `Redshift z = ${z.toFixed(4)}, indicating recession velocity of ${velocity.toFixed(0)} km/s and distance of ~${distance.toFixed(0)} Mpc.`
      }
    });
  };

  const calculateHabitableZone = () => {
    const m = parseFloat(stellarMass);
    const t = parseFloat(stellarTemp);
    if (isNaN(m) || isNaN(t) || m <= 0 || t <= 0) return;
    
    const luminosity = m ** 3.5; 
    const innerEdge = Math.sqrt(luminosity / 1.1); 
    const outerEdge = Math.sqrt(luminosity / 0.53); 
    
    setResults({
      ...results,
      habitable: {
        value: (innerEdge + outerEdge) / 2,
        unit: 'AU (center)',
        explanation: `Habitable zone extends from ${innerEdge.toFixed(2)} to ${outerEdge.toFixed(2)} AU from the star.`
      }
    });
  };

  const calculators = [
    {
      id: 'distance',
      title: 'Stellar Distance',
      icon: <Ruler className="w-6 h-6" />,
      description: 'Calculate distance using parallax method'
    },
    {
      id: 'lightTime',
      title: 'Light Travel Time',
      icon: <Clock className="w-6 h-6" />,
      description: 'How long light takes to travel a distance'
    },
    {
      id: 'telescope',
      title: 'Telescope Specs',
      icon: <Telescope className="w-6 h-6" />,
      description: 'Calculate telescope performance metrics'
    },
    {
      id: 'escape',
      title: 'Escape Velocity',
      icon: <Zap className="w-6 h-6" />,
      description: 'Minimum velocity to escape gravity'
    },
    {
      id: 'redshift',
      title: 'Redshift & Distance',
      icon: <Target className="w-6 h-6" />,
      description: 'Calculate cosmic redshift and distance'
    },
    {
      id: 'habitable',
      title: 'Habitable Zone',
      icon: <Globe className="w-6 h-6" />,
      description: 'Find the habitable zone around a star'
    }
  ];

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'distance':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Parallax (arcseconds)
              </label>
              <input
                type="number"
                value={parallax}
                onChange={(e) => setParallax(e.target.value)}
                placeholder="0.1"
                step="0.001"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={calculateDistance}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Calculate Distance
            </button>
            {results.distance && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-300 font-semibold text-lg">
                  {results.distance.value.toFixed(2)} {results.distance.unit}
                </div>
                <p className="text-gray-300 text-sm mt-2">{results.distance.explanation}</p>
              </div>
            )}
          </div>
        );

      case 'lightTime':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Distance
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="4.37"
                  step="0.01"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ly">Light-years</option>
                  <option value="km">Kilometers</option>
                  <option value="au">AU</option>
                </select>
              </div>
            </div>
            <button
              onClick={calculateLightTravelTime}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Calculate Travel Time
            </button>
            {results.lightTime && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="text-blue-300 font-semibold text-lg">
                  {results.lightTime.value.toFixed(6)} {results.lightTime.unit}
                </div>
                <p className="text-gray-300 text-sm mt-2">{results.lightTime.explanation}</p>
              </div>
            )}
          </div>
        );

      case 'telescope':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Aperture (mm)
              </label>
              <input
                type="number"
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
                placeholder="200"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Focal Length (mm)
              </label>
              <input
                type="number"
                value={focalLength}
                onChange={(e) => setFocalLength(e.target.value)}
                placeholder="1000"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={calculateTelescopeSpecs}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Calculate Specs
            </button>
            {results.telescope && (
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-300 font-semibold text-lg">
                  {results.telescope.unit}: {results.telescope.value.toFixed(1)}
                </div>
                <p className="text-gray-300 text-sm mt-2">{results.telescope.explanation}</p>
              </div>
            )}
          </div>
        );

      case 'escape':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mass (Earth masses)
              </label>
              <input
                type="number"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="1"
                step="0.1"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Radius (Earth radii)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="1"
                step="0.1"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={calculateEscapeVelocity}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Calculate Escape Velocity
            </button>
            {results.escape && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="text-red-300 font-semibold text-lg">
                  {results.escape.value.toFixed(2)} {results.escape.unit}
                </div>
                <p className="text-gray-300 text-sm mt-2">{results.escape.explanation}</p>
              </div>
            )}
          </div>
        );

      case 'redshift':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Observed Wavelength (nm)
              </label>
              <input
                type="number"
                value={observedWavelength}
                onChange={(e) => setObservedWavelength(e.target.value)}
                placeholder="656.3"
                step="0.1"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Rest Wavelength (nm)
              </label>
              <input
                type="number"
                value={restWavelength}
                onChange={(e) => setRestWavelength(e.target.value)}
                placeholder="656.3"
                step="0.1"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={calculateRedshift}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Calculate Redshift
            </button>
            {results.redshift && (
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4">
                <div className="text-cyan-300 font-semibold text-lg">
                  z = {results.redshift.value.toFixed(4)}
                </div>
                <p className="text-gray-300 text-sm mt-2">{results.redshift.explanation}</p>
              </div>
            )}
          </div>
        );

      case 'habitable':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Stellar Mass (Solar masses)
              </label>
              <input
                type="number"
                value={stellarMass}
                onChange={(e) => setStellarMass(e.target.value)}
                placeholder="1"
                step="0.1"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Stellar Temperature (K)
              </label>
              <input
                type="number"
                value={stellarTemp}
                onChange={(e) => setStellarTemp(e.target.value)}
                placeholder="5778"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={calculateHabitableZone}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Calculate Habitable Zone
            </button>
            {results.habitable && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-300 font-semibold text-lg">
                  {results.habitable.value.toFixed(2)} {results.habitable.unit}
                </div>
                <p className="text-gray-300 text-sm mt-2">{results.habitable.explanation}</p>
              </div>
            )}
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
          <Calculator className="w-8 h-8 text-purple-400" />
          <span>Astronomy Calculator Tools</span>
          <Star className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Professional astronomical calculations at your fingertips
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Select Calculator</h3>
            <div className="space-y-3">
              {calculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => setActiveCalculator(calc.id)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                    activeCalculator === calc.id
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeCalculator === calc.id ? 'bg-purple-500' : 'bg-white/20'
                  }`}>
                    {calc.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium">{calc.title}</div>
                    <div className="text-gray-400 text-sm">{calc.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculator Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                {calculators.find(c => c.id === activeCalculator)?.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {calculators.find(c => c.id === activeCalculator)?.title}
                </h3>
                <p className="text-gray-400">
                  {calculators.find(c => c.id === activeCalculator)?.description}
                </p>
              </div>
            </div>
            
            {renderCalculator()}
          </div>
        </div>
      </div>

      {/* Educational Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">How These Calculations Work</h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>
              <strong className="text-purple-400">Parallax Distance:</strong> Uses the apparent shift of a star's position as Earth orbits the Sun to calculate distance.
            </div>
            <div>
              <strong className="text-blue-400">Light Travel Time:</strong> Based on the speed of light (299,792,458 m/s) to determine how long light takes to travel.
            </div>
            <div>
              <strong className="text-green-400">Telescope Performance:</strong> Calculates f-ratio, light gathering power, and theoretical resolution limits.
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Professional Applications</h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>
              <strong className="text-cyan-400">Research:</strong> These calculations are used by professional astronomers for mission planning and data analysis.
            </div>
            <div>
              <strong className="text-yellow-400">Education:</strong> Perfect for students learning astronomical concepts and relationships.
            </div>
            <div>
              <strong className="text-red-400">Amateur Astronomy:</strong> Help optimize telescope setups and plan observations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};