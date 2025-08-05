import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Globe, Brain, Search, Star, Thermometer, Weight, Ruler, 
  Activity, BarChart3, Target, Zap, RefreshCw, CheckCircle,
  AlertTriangle, Eye, Database, Filter, Calendar, MapPin,
  Telescope, Atom, Droplets, Wind, Sun, Moon
} from 'lucide-react';

// Exoplanet Data Structures
interface ExoplanetData {
  id: string;
  name: string;
  hostStar: string;
  discoveryMethod: string;
  discoveryYear: number;
  mass: number; // Earth masses
  radius: number; // Earth radii
  orbitalPeriod: number; // days
  semiMajorAxis: number; // AU
  eccentricity: number;
  equilibriumTemp: number; // Kelvin
  stellarMass: number; // Solar masses
  stellarRadius: number; // Solar radii
  stellarTemp: number; // Kelvin
  distance: number; // parsecs
  atmosphereComposition?: string[];
  surfacePressure?: number; // Earth atmospheres
  hasWater?: boolean;
  hasMagneticField?: boolean;
  tidally_locked?: boolean;
}

interface HabitabilityScore {
  overall: number; // 0-100
  temperature: number;
  atmosphere: number;
  water: number;
  size: number;
  orbit: number;
  star: number;
  confidence: number;
  classification: 'UNINHABITABLE' | 'MARGINALLY_HABITABLE' | 'POTENTIALLY_HABITABLE' | 'HIGHLY_HABITABLE';
  reasons: string[];
  risks: string[];
}

interface MLPrediction {
  habitabilityScore: HabitabilityScore;
  similarEarth: number; // 0-1 similarity to Earth
  biosignaturePotential: number; // 0-1 likelihood of detectable life
  estimatedLifeTypes: string[];
  timeToInvestigate: number; // years with current technology
  missionFeasibility: 'IMPOSSIBLE' | 'VERY_DIFFICULT' | 'CHALLENGING' | 'FEASIBLE';
}

export const ExoplanetPredictor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discovery' | 'predictor' | 'comparison' | 'timeline'>('discovery');
  const [exoplanets, setExoplanets] = useState<ExoplanetData[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetData | null>(null);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [sortBy, setSortBy] = useState('habitability');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Initialize with NASA exoplanet data (demo)
  useEffect(() => {
    loadExoplanetData();
  }, []);

  const loadExoplanetData = async () => {
    setIsLoadingData(true);
    
    // Simulate loading real NASA data - in production, this would fetch from NASA Exoplanet Archive
    setTimeout(() => {
      const demoExoplanets: ExoplanetData[] = [
        {
          id: 'kepler-452b',
          name: 'Kepler-452b',
          hostStar: 'Kepler-452',
          discoveryMethod: 'Transit',
          discoveryYear: 2015,
          mass: 1.9,
          radius: 1.63,
          orbitalPeriod: 384.8,
          semiMajorAxis: 1.05,
          eccentricity: 0.1,
          equilibriumTemp: 265,
          stellarMass: 1.04,
          stellarRadius: 1.11,
          stellarTemp: 5757,
          distance: 1400,
          atmosphereComposition: ['Unknown'],
          hasWater: undefined,
          hasMagneticField: undefined,
          tidally_locked: false
        },
        {
          id: 'proxima-centauri-b',
          name: 'Proxima Centauri b',
          hostStar: 'Proxima Centauri',
          discoveryMethod: 'Radial Velocity',
          discoveryYear: 2016,
          mass: 1.17,
          radius: 1.1,
          orbitalPeriod: 11.2,
          semiMajorAxis: 0.05,
          eccentricity: 0.11,
          equilibriumTemp: 234,
          stellarMass: 0.12,
          stellarRadius: 0.14,
          stellarTemp: 3042,
          distance: 1.3,
          atmosphereComposition: ['Potentially Rocky'],
          hasWater: undefined,
          hasMagneticField: false,
          tidally_locked: true
        },
        {
          id: 'trappist-1e',
          name: 'TRAPPIST-1e',
          hostStar: 'TRAPPIST-1',
          discoveryMethod: 'Transit',
          discoveryYear: 2017,
          mass: 0.77,
          radius: 0.92,
          orbitalPeriod: 6.1,
          semiMajorAxis: 0.03,
          eccentricity: 0.01,
          equilibriumTemp: 251,
          stellarMass: 0.09,
          stellarRadius: 0.12,
          stellarTemp: 2511,
          distance: 12.1,
          atmosphereComposition: ['Potentially Earth-like'],
          hasWater: true,
          hasMagneticField: undefined,
          tidally_locked: true
        },
        {
          id: 'k2-18b',
          name: 'K2-18b',
          hostStar: 'K2-18',
          discoveryMethod: 'Transit',
          discoveryYear: 2015,
          mass: 8.6,
          radius: 2.3,
          orbitalPeriod: 33.0,
          semiMajorAxis: 0.14,
          eccentricity: 0.0,
          equilibriumTemp: 279,
          stellarMass: 0.36,
          stellarRadius: 0.41,
          stellarTemp: 3457,
          distance: 34,
          atmosphereComposition: ['H2O detected', 'H2', 'He'],
          hasWater: true,
          hasMagneticField: undefined,
          tidally_locked: false
        },
        {
          id: 'gliese-667cc',
          name: 'Gliese 667Cc',
          hostStar: 'Gliese 667C',
          discoveryMethod: 'Radial Velocity',
          discoveryYear: 2011,
          mass: 3.8,
          radius: 1.5,
          orbitalPeriod: 28.1,
          semiMajorAxis: 0.12,
          eccentricity: 0.02,
          equilibriumTemp: 277,
          stellarMass: 0.31,
          stellarRadius: 0.42,
          stellarTemp: 3700,
          distance: 6.8,
          atmosphereComposition: ['Unknown'],
          hasWater: undefined,
          hasMagneticField: undefined,
          tidally_locked: false
        }
      ];

      setExoplanets(demoExoplanets);
      setIsLoadingData(false);
    }, 1500);
  };

  // Advanced ML-inspired Habitability Prediction Algorithm
  const predictHabitability = useCallback((planet: ExoplanetData): MLPrediction => {
    const scores = {
      temperature: 0,
      atmosphere: 0,
      water: 0,
      size: 0,
      orbit: 0,
      star: 0
    };

    const reasons: string[] = [];
    const risks: string[] = [];

    // Temperature Score (0-100)
    const earthTemp = 288; // Kelvin
    const tempDiff = Math.abs(planet.equilibriumTemp - earthTemp);
    
    if (tempDiff < 50) {
      scores.temperature = 100 - (tempDiff * 1.5);
      reasons.push('Temperature similar to Earth');
    } else if (tempDiff < 100) {
      scores.temperature = 70 - (tempDiff * 0.5);
      reasons.push('Temperature moderately different from Earth');
    } else {
      scores.temperature = Math.max(0, 50 - (tempDiff * 0.3));
      risks.push('Extreme temperature conditions');
    }

    // Size Score (mass and radius)
    const massScore = Math.max(0, 100 - Math.abs(planet.mass - 1) * 30);
    const radiusScore = Math.max(0, 100 - Math.abs(planet.radius - 1) * 40);
    scores.size = (massScore + radiusScore) / 2;
    
    if (planet.mass > 1.5) {
      risks.push('High mass may retain thick atmosphere');
    } else if (planet.mass < 0.5) {
      risks.push('Low mass may not retain atmosphere');
    } else {
      reasons.push('Size compatible with surface conditions');
    }

    // Orbital Score
    const habitableZoneMin = 0.7 * Math.sqrt(planet.stellarMass);
    const habitableZoneMax = 1.5 * Math.sqrt(planet.stellarMass);
    
    if (planet.semiMajorAxis >= habitableZoneMin && planet.semiMajorAxis <= habitableZoneMax) {
      scores.orbit = 100;
      reasons.push('Located in habitable zone');
    } else {
      const distFromZone = Math.min(
        Math.abs(planet.semiMajorAxis - habitableZoneMin),
        Math.abs(planet.semiMajorAxis - habitableZoneMax)
      );
      scores.orbit = Math.max(0, 80 - (distFromZone * 100));
      risks.push('Outside optimal habitable zone');
    }

    // Stellar Score
    if (planet.stellarTemp >= 3500 && planet.stellarTemp <= 6500) {
      scores.star = 100;
      reasons.push('Host star suitable for life');
    } else {
      scores.star = Math.max(0, 100 - Math.abs(planet.stellarTemp - 5778) / 100);
      if (planet.stellarTemp < 3500) {
        risks.push('Red dwarf host - potential tidal locking');
      } else {
        risks.push('Very hot host star');
      }
    }

    // Water Score
    if (planet.hasWater === true) {
      scores.water = 100;
      reasons.push('Water detected in atmosphere');
    } else if (planet.atmosphereComposition?.some(comp => comp.includes('H2O'))) {
      scores.water = 90;
      reasons.push('Water vapor signatures detected');
    } else if (scores.temperature > 50 && scores.orbit > 50) {
      scores.water = 60;
      reasons.push('Conditions may allow liquid water');
    } else {
      scores.water = 20;
      risks.push('No evidence of water');
    }

    // Atmosphere Score
    if (planet.atmosphereComposition?.includes('Earth-like')) {
      scores.atmosphere = 100;
      reasons.push('Potentially Earth-like atmosphere');
    } else if (planet.atmosphereComposition?.some(comp => comp.includes('H2O'))) {
      scores.atmosphere = 80;
      reasons.push('Complex atmospheric composition');
    } else if (planet.surfacePressure !== undefined) {
      scores.atmosphere = 70;
    } else {
      scores.atmosphere = 30;
      risks.push('Atmospheric composition unknown');
    }

    // Tidal locking penalty
    if (planet.tidally_locked) {
      scores.temperature *= 0.7;
      scores.atmosphere *= 0.8;
      risks.push('Tidally locked - extreme temperature differences');
    }

    // Calculate overall score
    const weights = {
      temperature: 0.25,
      water: 0.20,
      atmosphere: 0.20,
      size: 0.15,
      orbit: 0.15,
      star: 0.05
    };

    const overall = Object.entries(scores).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);

    // Classification
    let classification: HabitabilityScore['classification'];
    if (overall >= 80) classification = 'HIGHLY_HABITABLE';
    else if (overall >= 60) classification = 'POTENTIALLY_HABITABLE';
    else if (overall >= 40) classification = 'MARGINALLY_HABITABLE';
    else classification = 'UNINHABITABLE';

    // Earth similarity
    const earthSimilarity = Math.min(1, overall / 100);

    // Biosignature potential
    const biosignaturePotential = Math.min(1, (scores.water + scores.atmosphere + scores.temperature) / 300);

    // Estimated life types
    const estimatedLifeTypes: string[] = [];
    if (scores.water > 60) estimatedLifeTypes.push('Aquatic microorganisms');
    if (scores.atmosphere > 70) estimatedLifeTypes.push('Atmospheric bacteria');
    if (overall > 70) estimatedLifeTypes.push('Complex multicellular life');
    if (overall > 85) estimatedLifeTypes.push('Potentially intelligent life');

    // Mission feasibility
    let missionFeasibility: MLPrediction['missionFeasibility'];
    if (planet.distance < 10) missionFeasibility = 'CHALLENGING';
    else if (planet.distance < 50) missionFeasibility = 'VERY_DIFFICULT';
    else missionFeasibility = 'IMPOSSIBLE';

    const confidence = Math.min(100, 
      (planet.hasWater !== undefined ? 20 : 0) +
      (planet.atmosphereComposition ? 30 : 0) +
      (planet.hasMagneticField !== undefined ? 15 : 0) +
      35 // Base confidence from orbital mechanics
    );

    return {
      habitabilityScore: {
        overall: Math.round(overall),
        temperature: Math.round(scores.temperature),
        atmosphere: Math.round(scores.atmosphere),
        water: Math.round(scores.water),
        size: Math.round(scores.size),
        orbit: Math.round(scores.orbit),
        star: Math.round(scores.star),
        confidence,
        classification,
        reasons,
        risks
      },
      similarEarth: Math.round(earthSimilarity * 100) / 100,
      biosignaturePotential: Math.round(biosignaturePotential * 100) / 100,
      estimatedLifeTypes,
      timeToInvestigate: Math.round(planet.distance * 2.5), // Very rough estimate
      missionFeasibility
    };
  }, []);

  // Filter and sort exoplanets
  const filteredPlanets = useMemo(() => {
    let filtered = exoplanets.filter(planet => {
      const matchesSearch = planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           planet.hostStar.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMethod = filterMethod === 'ALL' || planet.discoveryMethod === filterMethod;
      return matchesSearch && matchesMethod;
    });

    // Sort by habitability (requires calculation)
    if (sortBy === 'habitability') {
      filtered = filtered.sort((a, b) => {
        const scoreA = predictHabitability(a).habitabilityScore.overall;
        const scoreB = predictHabitability(b).habitabilityScore.overall;
        return scoreB - scoreA;
      });
    } else if (sortBy === 'distance') {
      filtered = filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'discovery') {
      filtered = filtered.sort((a, b) => b.discoveryYear - a.discoveryYear);
    }

    return filtered;
  }, [exoplanets, searchQuery, filterMethod, sortBy, predictHabitability]);

  const handlePlanetSelect = (planet: ExoplanetData) => {
    setSelectedPlanet(planet);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const prediction = predictHabitability(planet);
      setPrediction(prediction);
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderDiscovery = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search exoplanets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Methods</option>
            <option value="Transit">Transit</option>
            <option value="Radial Velocity">Radial Velocity</option>
            <option value="Direct Imaging">Direct Imaging</option>
            <option value="Gravitational Microlensing">Microlensing</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="habitability">Sort by Habitability</option>
            <option value="distance">Sort by Distance</option>
            <option value="discovery">Sort by Discovery Year</option>
          </select>

          <button
            onClick={loadExoplanetData}
            disabled={isLoadingData}
            className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {isLoadingData ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Database size={16} />
            )}
            <span className="ml-2">{isLoadingData ? 'Loading...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* Exoplanet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlanets.map((planet) => {
          const habitScore = predictHabitability(planet).habitabilityScore.overall;
          
          return (
            <div 
              key={planet.id} 
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors cursor-pointer"
              onClick={() => handlePlanetSelect(planet)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{planet.name}</h3>
                  <p className="text-sm text-gray-400">Host: {planet.hostStar}</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    habitScore >= 80 ? 'text-green-400' :
                    habitScore >= 60 ? 'text-yellow-400' :
                    habitScore >= 40 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {habitScore}
                  </div>
                  <div className="text-xs text-gray-400">Habitability</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Mass:</span>
                  <span className="text-green-400 ml-2">{planet.mass.toFixed(2)} M⊕</span>
                </div>
                <div>
                  <span className="text-gray-400">Radius:</span>
                  <span className="text-green-400 ml-2">{planet.radius.toFixed(2)} R⊕</span>
                </div>
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-green-400 ml-2">{planet.distance} pc</span>
                </div>
                <div>
                  <span className="text-gray-400">Discovered:</span>
                  <span className="text-green-400 ml-2">{planet.discoveryYear}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="text-orange-400" size={16} />
                  <span className="text-sm text-gray-300">{planet.equilibriumTemp}K</span>
                </div>
                
                {planet.hasWater && (
                  <div className="flex items-center space-x-2">
                    <Droplets className="text-blue-400" size={16} />
                    <span className="text-sm text-blue-300">Water detected</span>
                  </div>
                )}
              </div>

              <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    habitScore >= 80 ? 'bg-green-500' :
                    habitScore >= 60 ? 'bg-yellow-500' :
                    habitScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${habitScore}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPredictor = () => (
    <div className="space-y-6">
      {!selectedPlanet ? (
        <div className="bg-gray-800/50 rounded-lg p-12 text-center">
          <Globe className="mx-auto mb-4 text-green-400" size={64} />
          <h3 className="text-xl font-bold text-white mb-2">Select an Exoplanet</h3>
          <p className="text-gray-400">Choose an exoplanet from the Discovery tab to see detailed habitability analysis</p>
        </div>
      ) : (
        <>
          {/* Planet Overview */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedPlanet.name}</h2>
                <p className="text-gray-400">Orbiting {selectedPlanet.hostStar}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Discovery Method</div>
                <div className="text-green-400 font-semibold">{selectedPlanet.discoveryMethod}</div>
              </div>
            </div>

            {/* Physical Properties */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-900/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Weight className="text-blue-400 mr-2" size={20} />
                  <span className="text-sm text-gray-300">Mass</span>
                </div>
                <span className="text-xl font-bold text-blue-400">{selectedPlanet.mass.toFixed(2)} M⊕</span>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Ruler className="text-purple-400 mr-2" size={20} />
                  <span className="text-sm text-gray-300">Radius</span>
                </div>
                <span className="text-xl font-bold text-purple-400">{selectedPlanet.radius.toFixed(2)} R⊕</span>
              </div>

              <div className="bg-orange-900/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Thermometer className="text-orange-400 mr-2" size={20} />
                  <span className="text-sm text-gray-300">Temperature</span>
                </div>
                <span className="text-xl font-bold text-orange-400">{selectedPlanet.equilibriumTemp}K</span>
              </div>

              <div className="bg-green-900/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="text-green-400 mr-2" size={20} />
                  <span className="text-sm text-gray-300">Distance</span>
                </div>
                <span className="text-xl font-bold text-green-400">{selectedPlanet.distance} pc</span>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {isAnalyzing ? (
            <div className="bg-gray-800/50 rounded-lg p-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                <h3 className="text-xl font-bold text-green-400">AI Analysis in Progress</h3>
                <p className="text-gray-300 text-center">
                  Running machine learning models to assess habitability potential...
                </p>
                <div className="text-sm text-gray-400">
                  Analyzing orbital mechanics, atmospheric composition, and stellar radiation
                </div>
              </div>
            </div>
          ) : prediction && (
            <>
              {/* Habitability Score */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center">
                  <Brain className="mr-2" />
                  AI Habitability Assessment
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Score */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${
                        prediction.habitabilityScore.overall >= 80 ? 'text-green-400' :
                        prediction.habitabilityScore.overall >= 60 ? 'text-yellow-400' :
                        prediction.habitabilityScore.overall >= 40 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {prediction.habitabilityScore.overall}
                      </div>
                      <div className="text-lg text-gray-300 mb-2">Habitability Score</div>
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        prediction.habitabilityScore.classification === 'HIGHLY_HABITABLE' ? 'bg-green-600 text-white' :
                        prediction.habitabilityScore.classification === 'POTENTIALLY_HABITABLE' ? 'bg-yellow-600 text-black' :
                        prediction.habitabilityScore.classification === 'MARGINALLY_HABITABLE' ? 'bg-orange-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {prediction.habitabilityScore.classification.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-300">Earth Similarity:</span>
                        <span className="text-green-400 font-bold ml-2">{(prediction.similarEarth * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Biosignature Potential:</span>
                        <span className="text-blue-400 font-bold ml-2">{(prediction.biosignaturePotential * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-300">AI Confidence:</span>
                        <span className="text-purple-400 font-bold ml-2">{prediction.habitabilityScore.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="space-y-3">
                    {Object.entries({
                      Temperature: prediction.habitabilityScore.temperature,
                      Water: prediction.habitabilityScore.water,
                      Atmosphere: prediction.habitabilityScore.atmosphere,
                      Size: prediction.habitabilityScore.size,
                      Orbit: prediction.habitabilityScore.orbit,
                      Star: prediction.habitabilityScore.star
                    }).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">{category}:</span>
                          <span className="text-green-400 font-bold">{score}/100</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              score >= 80 ? 'bg-green-500' :
                              score >= 60 ? 'bg-yellow-500' :
                              score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Positive Factors & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
                  <h4 className="text-green-400 font-bold mb-4 flex items-center">
                    <CheckCircle className="mr-2" size={20} />
                    Positive Factors
                  </h4>
                  <ul className="space-y-2">
                    {prediction.habitabilityScore.reasons.map((reason, index) => (
                      <li key={index} className="text-green-300 text-sm">• {reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
                  <h4 className="text-red-400 font-bold mb-4 flex items-center">
                    <AlertTriangle className="mr-2" size={20} />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {prediction.habitabilityScore.risks.map((risk, index) => (
                      <li key={index} className="text-red-300 text-sm">• {risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Life Potential & Mission Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
                  <h4 className="text-blue-400 font-bold mb-4 flex items-center">
                    <Atom className="mr-2" size={20} />
                    Potential Life Forms
                  </h4>
                  {prediction.estimatedLifeTypes.length > 0 ? (
                    <ul className="space-y-2">
                      {prediction.estimatedLifeTypes.map((lifeType, index) => (
                        <li key={index} className="text-blue-300 text-sm">• {lifeType}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">No life forms predicted with current conditions</p>
                  )}
                </div>

                <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-6">
                  <h4 className="text-purple-400 font-bold mb-4 flex items-center">
                    <Telescope className="mr-2" size={20} />
                    Mission Feasibility
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-300">Feasibility:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                        prediction.missionFeasibility === 'FEASIBLE' ? 'bg-green-600 text-white' :
                        prediction.missionFeasibility === 'CHALLENGING' ? 'bg-yellow-600 text-black' :
                        prediction.missionFeasibility === 'VERY_DIFFICULT' ? 'bg-orange-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {prediction.missionFeasibility.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-300">Study Time:</span>
                      <span className="text-purple-400 font-bold ml-2">{prediction.timeToInvestigate} years</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-400 mb-6">Exoplanet Comparison Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-300">Planet</th>
                <th className="text-center py-3 px-4 text-gray-300">Habitability</th>
                <th className="text-center py-3 px-4 text-gray-300">Earth Similarity</th>
                <th className="text-center py-3 px-4 text-gray-300">Distance (pc)</th>
                <th className="text-center py-3 px-4 text-gray-300">Mass (M⊕)</th>
                <th className="text-center py-3 px-4 text-gray-300">Temperature</th>
                <th className="text-center py-3 px-4 text-gray-300">Water</th>
              </tr>
            </thead>
            <tbody>
              {exoplanets.map((planet) => {
                const prediction = predictHabitability(planet);
                return (
                  <tr key={planet.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{planet.name}</div>
                      <div className="text-xs text-gray-400">{planet.hostStar}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className={`text-lg font-bold ${
                        prediction.habitabilityScore.overall >= 80 ? 'text-green-400' :
                        prediction.habitabilityScore.overall >= 60 ? 'text-yellow-400' :
                        prediction.habitabilityScore.overall >= 40 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {prediction.habitabilityScore.overall}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-blue-400 font-semibold">
                      {(prediction.similarEarth * 100).toFixed(1)}%
                    </td>
                    <td className="text-center py-3 px-4 text-gray-300">
                      {planet.distance}
                    </td>
                    <td className="text-center py-3 px-4 text-gray-300">
                      {planet.mass.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={
                        Math.abs(planet.equilibriumTemp - 288) < 50 ? 'text-green-400' :
                        Math.abs(planet.equilibriumTemp - 288) < 100 ? 'text-yellow-400' : 'text-red-400'
                      }>
                        {planet.equilibriumTemp}K
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      {planet.hasWater ? (
                        <CheckCircle className="text-green-400 mx-auto" size={16} />
                      ) : planet.hasWater === false ? (
                        <AlertTriangle className="text-red-400 mx-auto" size={16} />
                      ) : (
                        <div className="text-gray-400 mx-auto">?</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-400 mb-6">Exoplanet Discovery Timeline</h3>
        
        <div className="space-y-4">
          {exoplanets
            .sort((a, b) => a.discoveryYear - b.discoveryYear)
            .map((planet, index) => {
              const prediction = predictHabitability(planet);
              return (
                <div key={planet.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-lg font-bold text-green-400">{planet.discoveryYear}</div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white">{planet.name}</h4>
                      <div className={`text-sm font-bold ${
                        prediction.habitabilityScore.overall >= 80 ? 'text-green-400' :
                        prediction.habitabilityScore.overall >= 60 ? 'text-yellow-400' :
                        prediction.habitabilityScore.overall >= 40 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        Habitability: {prediction.habitabilityScore.overall}/100
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">Host Star:</span>
                        <span className="ml-2 text-green-400">{planet.hostStar}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Method:</span>
                        <span className="ml-2 text-blue-400">{planet.discoveryMethod}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Distance:</span>
                        <span className="ml-2 text-purple-400">{planet.distance} parsecs</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
            Exoplanet Habitability Predictor
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Analysis of Potentially Habitable Worlds
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Using NASA Kepler & TESS mission data • Machine Learning Classification • Biosignature Detection
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 space-x-1">
          {[
            { key: 'discovery', label: 'Planet Discovery', icon: Telescope },
            { key: 'predictor', label: 'AI Predictor', icon: Brain },
            { key: 'comparison', label: 'Comparison', icon: BarChart3 },
            { key: 'timeline', label: 'Timeline', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors m-1 ${
                activeTab === key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="mr-2" size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-opacity duration-300">
          {activeTab === 'discovery' && renderDiscovery()}
          {activeTab === 'predictor' && renderPredictor()}
          {activeTab === 'comparison' && renderComparison()}
          {activeTab === 'timeline' && renderTimeline()}
        </div>
      </div>
    </div>
  );
};

export default ExoplanetPredictor;
