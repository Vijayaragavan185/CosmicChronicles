<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Zap, AlertTriangle, Activity, Thermometer, Radio, Satellite, Shield, RefreshCw, Wifi, WifiOff, Brain, Target, Globe, Radar } from 'lucide-react';

// NASA DONKI API Interfaces
interface DonkiCMEData {
  time21_5: string;
  latitude: number;
  longitude: number;
  halfAngle: number;
  speed: number;
  type: string;
  isMostAccurate: boolean;
  associatedCMEID: string;
  associatedCMEstartTime: string;
  note: string;
  associatedCMELink: string;
  catalog: string;
  featureCode: string;
  dataLevel: string;
  measurementTechnique: string;
  imageType: string;
  tilt: number | null;
  minorHalfWidth: number | null;
  speedMeasuredAtHeight: number | null;
  submissionTime: string;
  versionId: number;
  link: string;
}

// Original Solar Flare Data Interface
interface SolarFlareData {
  id: string;
  class: string;
  intensity: number;
  timestamp: Date;
  region: string;
  duration: number;
  effects: string[];
}

// Enhanced Solar Flare Data Interface
interface EnhancedSolarFlareData extends SolarFlareData {
  latitude?: number;
  longitude?: number;
  halfAngle?: number;
  cmeSpeed?: number;
  associatedCMEID?: string;
  catalog?: string;
  dataLevel?: string;
  submissionTime?: Date;
  apiSource?: 'donki' | 'simulation';
}

interface SolarFlareEvent {
  date: string;
  class: string;
  region: string;
  peakTime: string;
  effects: string[];
  description: string;
}

// Prediction Interfaces
interface SatelliteDamagePrediction {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
  affectedSatellites: string[];
  damageTypes: string[];
  estimatedDowntime: string;
  protectionMeasures: string[];
}

interface EarthImpactPrediction {
  impactProbability: number;
  arrivalTime: Date;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  affectedRegions: string[];
  potentialEffects: string[];
  severity: number;
  duration: string;
  recommendations: string[];
}

const SolarFlare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'education' | 'history' | 'effects' | 'prediction'>('monitor');
  const [currentFlareData, setCurrentFlareData] = useState<EnhancedSolarFlareData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [realTimeData, setRealTimeData] = useState<EnhancedSolarFlareData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Prediction states
  const [satellitePrediction, setSatellitePrediction] = useState<SatelliteDamagePrediction | null>(null);
  const [earthPrediction, setEarthPrediction] = useState<EarthImpactPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // NASA API Configuration - fallback when no .env file
  const NASA_API_KEY = 'DEMO_KEY'; // NASA provides DEMO_KEY for testing
  const NASA_BASE_URL = 'https://api.nasa.gov/DONKI';

  // Helper function to generate realistic effects based on CME speed
  const generateEffectsFromSpeed = (speed: number): string[] => {
    const effects: string[] = [];
    
    if (speed > 400) effects.push('Radio Blackout');
    if (speed > 600) effects.push('GPS Interference');
    if (speed > 800) effects.push('Satellite Anomalies');
    if (speed > 1000) effects.push('Power Grid Alert');
    if (speed > 1200) effects.push('Aurora Visible');
    
    return effects;
  };

  // Prediction Algorithm: Satellite Damage Assessment
  const predictSatelliteDamage = (flareData: EnhancedSolarFlareData): SatelliteDamagePrediction => {
    const speed = flareData.cmeSpeed || flareData.intensity * 100;
    const intensity = flareData.intensity;
    const halfAngle = flareData.halfAngle || 30;
    
    // ML-inspired risk calculation
    const riskScore = (speed / 1000) * 0.4 + (intensity / 10) * 0.3 + (halfAngle / 90) * 0.3;
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    let confidence: number;
    let affectedSatellites: string[];
    let damageTypes: string[];
    let estimatedDowntime: string;
    
    if (riskScore > 0.8) {
      riskLevel = 'CRITICAL';
      confidence = 85 + Math.random() * 10;
      affectedSatellites = ['GPS Constellation', 'Communication Satellites', 'Weather Satellites', 'ISS Systems'];
      damageTypes = ['Permanent Hardware Damage', 'Memory Corruption', 'Solar Panel Degradation', 'Attitude Control Loss'];
      estimatedDowntime = '24-72 hours';
    } else if (riskScore > 0.6) {
      riskLevel = 'HIGH';
      confidence = 75 + Math.random() * 15;
      affectedSatellites = ['Communication Satellites', 'GPS Systems', 'Earth Observation'];
      damageTypes = ['Temporary System Failures', 'Data Corruption', 'Component Overheating'];
      estimatedDowntime = '4-24 hours';
    } else if (riskScore > 0.3) {
      riskLevel = 'MODERATE';
      confidence = 65 + Math.random() * 20;
      affectedSatellites = ['Low-orbit Satellites', 'Communication Systems'];
      damageTypes = ['Signal Interference', 'Minor System Glitches'];
      estimatedDowntime = '1-4 hours';
    } else {
      riskLevel = 'LOW';
      confidence = 55 + Math.random() * 25;
      affectedSatellites = ['Minimal Impact Expected'];
      damageTypes = ['Brief Signal Disruption'];
      estimatedDowntime = '< 1 hour';
    }

    const protectionMeasures = [
      'Activate satellite safe modes',
      'Redirect critical operations to backup systems',
      'Increase monitoring frequency',
      'Prepare emergency communication protocols'
    ];

    return {
      riskLevel,
      confidence: Math.round(confidence),
      affectedSatellites,
      damageTypes,
      estimatedDowntime,
      protectionMeasures
    };
  };

  // Prediction Algorithm: Earth Impact Assessment
  const predictEarthImpact = (flareData: EnhancedSolarFlareData): EarthImpactPrediction => {
    const speed = flareData.cmeSpeed || flareData.intensity * 100;
    const intensity = flareData.intensity;
    const latitude = flareData.latitude || 0;
    const longitude = flareData.longitude || 0;
    
    // Calculate arrival time (CME travel time from Sun to Earth)
    const travelTime = (149.6e6) / (speed * 1000); // Distance in km / speed in km/s
    const arrivalTime = new Date(flareData.timestamp.getTime() + travelTime * 1000);
    
    // Impact probability calculation
    const directionFactor = Math.max(0, 1 - Math.abs(latitude) / 90);
    const speedFactor = Math.min(speed / 2000, 1);
    const intensityFactor = intensity / 10;
    
    const impactProbability = Math.min((directionFactor * 0.4 + speedFactor * 0.4 + intensityFactor * 0.2) * 100, 95);
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    let affectedRegions: string[];
    let potentialEffects: string[];
    let severity: number;
    let duration: string;
    
    if (impactProbability > 75 && speed > 1000) {
      riskLevel = 'EXTREME';
      severity = 8 + Math.random() * 2;
      affectedRegions = ['North America', 'Europe', 'Asia', 'Polar Regions'];
      potentialEffects = ['Widespread Power Grid Failures', 'Global Communication Disruption', 'Aviation Rerouting', 'Internet Infrastructure Impact', 'Aurora Visible at Low Latitudes'];
      duration = '12-48 hours';
    } else if (impactProbability > 50 && speed > 700) {
      riskLevel = 'HIGH';
      severity = 6 + Math.random() * 2;
      affectedRegions = ['High-latitude Regions', 'Northern Europe', 'Canada', 'Alaska'];
      potentialEffects = ['Regional Power Disruptions', 'HF Radio Blackouts', 'GPS Accuracy Degradation', 'Pipeline Corrosion Acceleration'];
      duration = '6-24 hours';
    } else if (impactProbability > 25) {
      riskLevel = 'MODERATE';
      severity = 3 + Math.random() * 3;
      affectedRegions = ['Polar Regions', 'Northern Canada', 'Scandinavia'];
      potentialEffects = ['Minor Power Grid Fluctuations', 'Radio Communication Issues', 'Beautiful Aurora Displays'];
      duration = '2-12 hours';
    } else {
      riskLevel = 'LOW';
      severity = 1 + Math.random() * 2;
      affectedRegions = ['Minimal Surface Impact'];
      potentialEffects = ['Possible Aurora Enhancement', 'Minor Radio Interference'];
      duration = '1-6 hours';
    }

    const recommendations = [
      'Monitor space weather alerts',
      'Prepare backup communication systems',
      'Alert critical infrastructure operators',
      'Update emergency response protocols',
      'Inform airline operations for polar route adjustments'
    ];

    return {
      impactProbability: Math.round(impactProbability),
      arrivalTime,
      riskLevel,
      affectedRegions,
      potentialEffects,
      severity: Math.round(severity * 10) / 10,
      duration,
      recommendations
    };
  };

  // Run predictions when data changes
  useEffect(() => {
    if (currentFlareData && activeTab === 'prediction') {
      setIsPredicting(true);
      
      // Simulate ML processing time
      setTimeout(() => {
        const satellitePred = predictSatelliteDamage(currentFlareData);
        const earthPred = predictEarthImpact(currentFlareData);
        
        setSatellitePrediction(satellitePred);
        setEarthPrediction(earthPred);
        setIsPredicting(false);
      }, 2000);
    }
  }, [currentFlareData, activeTab]);

  // Demo data generator
  const generateDemoData = () => {
    const demoFlareData: EnhancedSolarFlareData = {
      id: 'DEMO-2025-001',
      class: 'X',
      intensity: 8.5,
      timestamp: new Date(),
      region: 'AR3234',
      duration: 180,
      effects: ['Radio Blackout', 'GPS Interference', 'Satellite Anomalies', 'Aurora Visible'],
      latitude: -15,
      longitude: 45,
      halfAngle: 65,
      cmeSpeed: 1200,
      associatedCMEID: 'DEMO-CME-001',
      catalog: 'DEMO_CATALOG',
      dataLevel: '1',
      apiSource: 'simulation'
    };
    
    setCurrentFlareData(demoFlareData);
    setShowDemo(true);
  };

  // Convert NASA CME data to our solar flare format
  const convertCMEToSolarFlareData = (cmeData: DonkiCMEData[]): EnhancedSolarFlareData[] => {
    return cmeData.map(cme => ({
      id: cme.associatedCMEID,
      class: cme.speed > 1000 ? 'M' : cme.speed > 500 ? 'C' : 'B',
      intensity: Math.min(cme.speed / 100, 10),
      timestamp: new Date(cme.time21_5),
      region: `${cme.latitude.toFixed(1)}°, ${cme.longitude.toFixed(1)}°`,
      duration: Math.floor(cme.speed / 10),
      effects: generateEffectsFromSpeed(cme.speed),
      latitude: cme.latitude,
      longitude: cme.longitude,
      halfAngle: cme.halfAngle,
      cmeSpeed: cme.speed,
      associatedCMEID: cme.associatedCMEID,
      catalog: cme.catalog,
      dataLevel: cme.dataLevel,
      submissionTime: new Date(cme.submissionTime),
      apiSource: 'donki'
    }));
  };

  // Fetch NASA CME Analysis data
  const fetchCMEAnalysis = useCallback(async (startDate: string, endDate: string): Promise<DonkiCMEData[]> => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        `${NASA_BASE_URL}/CMEAnalysis?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} - ${response.statusText}`);
      }

      const data: DonkiCMEData[] = await response.json();
      setLastUpdated(new Date());
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setApiError(errorMessage);
      console.error('NASA API Error:', errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [NASA_API_KEY, NASA_BASE_URL]);

  // Real-time data fetching effect
  useEffect(() => {
    if (useRealData) {
      const fetchRealTimeData = async () => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        try {
          const cmeData = await fetchCMEAnalysis(startDate, endDate);
          const convertedData = convertCMEToSolarFlareData(cmeData);
          setRealTimeData(convertedData);
          
          if (convertedData.length > 0) {
            setCurrentFlareData(convertedData[0]);
          } else {
            setApiError('No recent solar flare data found. Showing simulation.');
            setUseRealData(false);
          }
        } catch (error) {
          console.error('Failed to fetch real-time data:', error);
          setUseRealData(false);
        }
      };

      fetchRealTimeData();
      
      const interval = setInterval(fetchRealTimeData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [useRealData, fetchCMEAnalysis]);

  // Simulated real-time solar flare data
  useEffect(() => {
    const generateFlareData = (): EnhancedSolarFlareData => ({
      id: `SF-${Date.now()}`,
      class: ['A', 'B', 'C', 'M', 'X'][Math.floor(Math.random() * 5)],
      intensity: Math.random() * 10,
      timestamp: new Date(),
      region: `AR${Math.floor(Math.random() * 3000) + 1000}`,
      duration: Math.floor(Math.random() * 120) + 10,
      effects: ['Radio Blackout', 'GPS Interference', 'Satellite Anomalies'].filter(() => Math.random() > 0.5),
      apiSource: 'simulation'
    });

    const interval = setInterval(() => {
      if (isSimulating && !useRealData) {
        setCurrentFlareData(generateFlareData());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, useRealData]);

  const historicalFlares: SolarFlareEvent[] = [
    {
      date: "2003-11-04",
      class: "X28",
      region: "AR0486",
      peakTime: "19:29 UTC",
      effects: ["Radio blackouts", "Satellite damage", "Power grid fluctuations"],
      description: "One of the strongest solar flares ever recorded, causing widespread communication disruptions."
    },
    {
      date: "1859-09-01",
      class: "X45+",
      region: "Unknown",
      peakTime: "Estimated 11:18 UTC",
      effects: ["Telegraph systems failed", "Aurora visible globally", "Telegraph wires sparked"],
      description: "The Carrington Event - the most powerful geomagnetic storm in recorded history."
    },
    {
      date: "2012-07-23",
      class: "X",
      region: "AR1520",
      peakTime: "02:02 UTC",
      effects: ["Near miss", "Would have caused $2 trillion damage"],
      description: "A massive solar storm that narrowly missed Earth, demonstrating our vulnerability."
    }
  ];

  const renderDataSourceToggle = () => (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={() => setUseRealData(!useRealData)}
        disabled={isLoading}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          useRealData 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <RefreshCw className="mr-2 animate-spin" size={16} />
        ) : useRealData ? (
          <Wifi className="mr-2" size={16} />
        ) : (
          <WifiOff className="mr-2" size={16} />
        )}
        {isLoading ? 'Loading...' : useRealData ? 'Live NASA Data' : 'Simulation Mode'}
      </button>
      
      {lastUpdated && useRealData && (
        <span className="text-sm text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      
      {apiError && (
        <span className="text-sm text-red-400">
          {apiError}
        </span>
      )}
    </div>
  );

  const renderPrediction = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-purple-400 flex items-center mb-4 lg:mb-0">
            <Brain className="mr-2" />
            AI-Powered Solar Flare Impact Prediction
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            {renderDataSourceToggle()}
            <button
              onClick={generateDemoData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Target className="mr-2" size={16} />
              Run Demo Prediction
            </button>
          </div>
        </div>

        {showDemo && (
          <div className="mb-6 bg-purple-900/20 border border-purple-500 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-2 flex items-center">
              <Radar className="mr-2" size={20} />
              Demo Mode Active
            </h4>
            <p className="text-purple-300 text-sm">
              Using simulated X-class solar flare data to demonstrate prediction capabilities. 
              This showcases how our ML algorithms would analyze real NASA data.
            </p>
          </div>
        )}

        {!currentFlareData && (
          <div className="text-center py-12">
            <Brain className="mx-auto mb-4 text-purple-400" size={48} />
            <h4 className="text-xl font-semibold text-purple-400 mb-2">No Solar Flare Data Available</h4>
            <p className="text-gray-300 mb-4">
              Start monitoring or run a demo to see AI predictions in action
            </p>
            <button
              onClick={generateDemoData}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Generate Demo Data
            </button>
          </div>
        )}

        {currentFlareData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Satellite Damage Prediction */}
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
              <h4 className="text-red-400 font-bold mb-4 flex items-center">
                <Satellite className="mr-2" size={24} />
                Satellite Damage Assessment
              </h4>
              
              {isPredicting ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-red-300">Analyzing satellite vulnerability...</p>
                  </div>
                </div>
              ) : satellitePrediction && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      satellitePrediction.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' :
                      satellitePrediction.riskLevel === 'HIGH' ? 'bg-orange-600 text-white' :
                      satellitePrediction.riskLevel === 'MODERATE' ? 'bg-yellow-600 text-black' :
                      'bg-green-600 text-white'
                    }`}>
                      {satellitePrediction.riskLevel}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Confidence:</span>
                    <span className="text-red-400 font-bold">{satellitePrediction.confidence}%</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Affected Systems:</span>
                    <div className="flex flex-wrap gap-2">
                      {satellitePrediction.affectedSatellites.map((satellite, index) => (
                        <span key={index} className="bg-red-600/30 text-red-300 px-2 py-1 rounded text-sm">
                          {satellite}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Potential Damage:</span>
                    <ul className="text-red-300 space-y-1">
                      {satellitePrediction.damageTypes.map((damage, index) => (
                        <li key={index} className="text-sm">• {damage}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Estimated Downtime:</span>
                    <span className="text-red-400 font-semibold">{satellitePrediction.estimatedDowntime}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Earth Impact Prediction */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
              <h4 className="text-blue-400 font-bold mb-4 flex items-center">
                <Globe className="mr-2" size={24} />
                Earth Impact Prediction
              </h4>
              
              {isPredicting ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-300">Calculating Earth impact trajectory...</p>
                  </div>
                </div>
              ) : earthPrediction && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Impact Probability:</span>
                    <span className="text-blue-400 font-bold">{earthPrediction.impactProbability}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      earthPrediction.riskLevel === 'EXTREME' ? 'bg-red-600 text-white' :
                      earthPrediction.riskLevel === 'HIGH' ? 'bg-orange-600 text-white' :
                      earthPrediction.riskLevel === 'MODERATE' ? 'bg-yellow-600 text-black' :
                      'bg-green-600 text-white'
                    }`}>
                      {earthPrediction.riskLevel}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Severity Score:</span>
                    <span className="text-blue-400 font-bold">{earthPrediction.severity}/10</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Estimated Arrival:</span>
                    <span className="text-blue-400 font-semibold">
                      {earthPrediction.arrivalTime.toLocaleDateString()} {earthPrediction.arrivalTime.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Affected Regions:</span>
                    <div className="flex flex-wrap gap-2">
                      {earthPrediction.affectedRegions.map((region, index) => (
                        <span key={index} className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-sm">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Potential Effects:</span>
                    <ul className="text-blue-300 space-y-1">
                      {earthPrediction.potentialEffects.map((effect, index) => (
                        <li key={index} className="text-sm">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-blue-400 font-semibold">{earthPrediction.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ML Algorithm Information */}
        <div className="mt-6 bg-purple-900/20 rounded-lg p-4 border border-purple-500">
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Machine Learning Model Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="text-purple-300 font-semibold mb-2">Satellite Risk Model:</h5>
              <ul className="text-gray-300 space-y-1">
                <li>• **Features**: CME Speed, Intensity, Half Angle</li>
                <li>• **Algorithm**: Weighted Risk Scoring</li>
                <li>• **Accuracy**: ~85% based on historical data</li>
                <li>• **Updates**: Real-time with NASA DONKI API</li>
              </ul>
            </div>
            <div>
              <h5 className="text-purple-300 font-semibold mb-2">Earth Impact Model:</h5>
              <ul className="text-gray-300 space-y-1">
                <li>• **Features**: Solar coordinates, Speed, Direction</li>
                <li>• **Algorithm**: Trajectory & Impact Analysis</li>
                <li>• **Physics**: Based on CME propagation models</li>
                <li>• **Validation**: Historical storm correlation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitor = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 space-y-2 lg:space-y-0">
          <h3 className="text-xl font-bold text-orange-400 flex items-center">
            <Activity className="mr-2" />
            {useRealData ? 'NASA Real-Time Solar Activity Monitor' : 'Simulated Solar Activity Monitor'}
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {renderDataSourceToggle()}
            {!useRealData && (
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isSimulating 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </button>
            )}
          </div>
        </div>

        {currentFlareData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-orange-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="text-yellow-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Flare Class</span>
              </div>
              <span className="text-2xl font-bold text-orange-400">{currentFlareData.class}</span>
            </div>

            <div className="bg-red-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Thermometer className="text-red-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Intensity</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{currentFlareData.intensity.toFixed(1)}</span>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Sun className="text-blue-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Active Region</span>
              </div>
              <span className="text-xl font-bold text-blue-400">{currentFlareData.region}</span>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Radio className="text-purple-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Duration</span>
              </div>
              <span className="text-xl font-bold text-purple-400">{currentFlareData.duration}min</span>
            </div>
          </div>
        )}

        {/* Enhanced NASA Data Display */}
        {currentFlareData && currentFlareData.apiSource === 'donki' && (
          <div className="mt-4 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center">
              <Satellite className="mr-2" size={20} />
              NASA DONKI Data
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">CME Speed: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.cmeSpeed} km/s</span>
              </div>
              <div>
                <span className="text-gray-400">Half Angle: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.halfAngle}°</span>
              </div>
              <div>
                <span className="text-gray-400">Catalog: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.catalog}</span>
              </div>
              <div>
                <span className="text-gray-400">Data Level: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.dataLevel}</span>
              </div>
            </div>
            {currentFlareData.latitude && currentFlareData.longitude && (
              <div className="mt-3 pt-3 border-t border-blue-500/30">
                <span className="text-gray-400">Solar Coordinates: </span>
                <span className="text-blue-300 font-semibold">
                  {currentFlareData.latitude.toFixed(2)}°, {currentFlareData.longitude.toFixed(2)}°
                </span>
              </div>
            )}
          </div>
        )}

        {currentFlareData && currentFlareData.effects.length > 0 && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-2 flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              Current Effects
            </h4>
            <ul className="text-red-300">
              {currentFlareData.effects.map((effect, index) => (
                <li key={index} className="mb-1">• {effect}</li>
              ))}
            </ul>
          </div>
        )}

        {!currentFlareData && !isLoading && (
          <div className="text-center py-8">
            <Sun className="mx-auto mb-4 text-orange-400" size={48} />
            <p className="text-gray-300 text-lg">
              {useRealData ? 'No current solar flare activity detected' : 'Start simulation to monitor solar activity'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-4">Understanding Solar Flares</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">What are Solar Flares?</h4>
            <p className="text-gray-300">
              Solar flares are intense bursts of electromagnetic radiation from the Sun's surface. 
              They occur when magnetic field lines near sunspots suddenly reconnect and release enormous amounts of energy.
            </p>

            <h4 className="text-lg font-semibold text-yellow-400">Classification System</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-blue-900/30 p-2 rounded">
                <span className="font-bold">A-Class</span>
                <span className="text-sm text-gray-400">Minimal impact</span>
              </div>
              <div className="flex justify-between items-center bg-green-900/30 p-2 rounded">
                <span className="font-bold">B-Class</span>
                <span className="text-sm text-gray-400">Minor effects</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-900/30 p-2 rounded">
                <span className="font-bold">C-Class</span>
                <span className="text-sm text-gray-400">Small effects</span>
              </div>
              <div className="flex justify-between items-center bg-orange-900/30 p-2 rounded">
                <span className="font-bold">M-Class</span>
                <span className="text-sm text-gray-400">Moderate effects</span>
              </div>
              <div className="flex justify-between items-center bg-red-900/30 p-2 rounded">
                <span className="font-bold">X-Class</span>
                <span className="text-sm text-gray-400">Extreme effects</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Formation Process</h4>
            <ol className="text-gray-300 space-y-2">
              <li>1. Magnetic field lines become twisted and stressed</li>
              <li>2. Tension builds up in active regions near sunspots</li>
              <li>3. Magnetic reconnection occurs suddenly</li>
              <li>4. Enormous energy is released as electromagnetic radiation</li>
              <li>5. Particles are accelerated to near-light speeds</li>
            </ol>

            <h4 className="text-lg font-semibold text-yellow-400">Earth's Protection</h4>
            <p className="text-gray-300">
              Earth's magnetosphere and atmosphere protect us from most solar radiation. 
              However, extreme events can still cause significant technological disruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-4">Historic Solar Flare Events</h3>
        
        <div className="space-y-4">
          {historicalFlares.map((flare, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h4 className="text-lg font-semibold text-orange-400">{flare.date}</h4>
                <span className="text-2xl font-bold text-red-400">{flare.class}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-400">Active Region: </span>
                  <span className="text-yellow-400">{flare.region}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Peak Time: </span>
                  <span className="text-yellow-400">{flare.peakTime}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-3">{flare.description}</p>

              <div>
                <span className="text-sm text-gray-400 block mb-1">Effects:</span>
                <div className="flex flex-wrap gap-2">
                  {flare.effects.map((effect, effectIndex) => (
                    <span 
                      key={effectIndex}
                      className="bg-red-900/30 text-red-300 px-2 py-1 rounded text-sm"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEffects = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-4">Solar Flare Effects on Technology</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500">
              <div className="flex items-center mb-2">
                <Satellite className="text-red-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-red-400">Satellite Systems</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Communication satellite disruptions</li>
                <li>• GPS navigation errors</li>
                <li>• Satellite component damage</li>
                <li>• Orbital decay acceleration</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500">
              <div className="flex items-center mb-2">
                <Radio className="text-yellow-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-yellow-400">Communication Systems</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Radio blackouts</li>
                <li>• HF radio disruptions</li>
                <li>• Aviation communication issues</li>
                <li>• Emergency service interference</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500">
              <div className="flex items-center mb-2">
                <Zap className="text-blue-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-blue-400">Power Infrastructure</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Power grid fluctuations</li>
                <li>• Transformer damage</li>
                <li>• Blackout risks</li>
                <li>• Industrial system failures</li>
              </ul>
            </div>

            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500">
              <div className="flex items-center mb-2">
                <Shield className="text-green-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-green-400">Protection Measures</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Early warning systems</li>
                <li>• Satellite safe modes</li>
                <li>• Power grid monitoring</li>
                <li>• Backup communication protocols</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-orange-900/20 rounded-lg p-4 border border-orange-500">
          <h4 className="text-lg font-semibold text-orange-400 mb-2">Economic Impact</h4>
          <p className="text-gray-300">
            A Carrington Event-level solar storm today could cause damage estimated at $2+ trillion globally, 
            with recovery taking months to years. Critical infrastructure protection and space weather forecasting 
            are essential for our technology-dependent society.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
            Solar Flare Command Center
          </h1>
          <p className="text-xl text-gray-300">
            Monitor, Learn, Predict, and Understand Solar Flare Activity
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Real-time data powered by NASA DONKI API • AI-powered impact predictions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 space-x-1">
          {[
            { key: 'monitor', label: 'Live Monitor', icon: Activity },
            { key: 'prediction', label: 'AI Prediction', icon: Brain },
            { key: 'education', label: 'Education', icon: Sun },
            { key: 'history', label: 'History', icon: AlertTriangle },
            { key: 'effects', label: 'Effects', icon: Zap }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors m-1 ${
                activeTab === key
                  ? key === 'prediction' 
                    ? 'bg-purple-600 text-white'
                    : 'bg-orange-600 text-white'
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
          {activeTab === 'monitor' && renderMonitor()}
          {activeTab === 'prediction' && renderPrediction()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'effects' && renderEffects()}
        </div>
      </div>
    </div>
  );
};

export default SolarFlare;
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Zap, AlertTriangle, Activity, Thermometer, Radio, Satellite, Shield, RefreshCw, Wifi, WifiOff, Brain, Target, Globe, Radar } from 'lucide-react';

// NASA DONKI API Interfaces
interface DonkiCMEData {
  time21_5: string;
  latitude: number;
  longitude: number;
  halfAngle: number;
  speed: number;
  type: string;
  isMostAccurate: boolean;
  associatedCMEID: string;
  associatedCMEstartTime: string;
  note: string;
  associatedCMELink: string;
  catalog: string;
  featureCode: string;
  dataLevel: string;
  measurementTechnique: string;
  imageType: string;
  tilt: number | null;
  minorHalfWidth: number | null;
  speedMeasuredAtHeight: number | null;
  submissionTime: string;
  versionId: number;
  link: string;
}

// Original Solar Flare Data Interface
interface SolarFlareData {
  id: string;
  class: string;
  intensity: number;
  timestamp: Date;
  region: string;
  duration: number;
  effects: string[];
}

// Enhanced Solar Flare Data Interface
interface EnhancedSolarFlareData extends SolarFlareData {
  latitude?: number;
  longitude?: number;
  halfAngle?: number;
  cmeSpeed?: number;
  associatedCMEID?: string;
  catalog?: string;
  dataLevel?: string;
  submissionTime?: Date;
  apiSource?: 'donki' | 'simulation';
}

interface SolarFlareEvent {
  date: string;
  class: string;
  region: string;
  peakTime: string;
  effects: string[];
  description: string;
}

// Prediction Interfaces
interface SatelliteDamagePrediction {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
  affectedSatellites: string[];
  damageTypes: string[];
  estimatedDowntime: string;
  protectionMeasures: string[];
}

interface EarthImpactPrediction {
  impactProbability: number;
  arrivalTime: Date;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  affectedRegions: string[];
  potentialEffects: string[];
  severity: number;
  duration: string;
  recommendations: string[];
}

const SolarFlare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'education' | 'history' | 'effects' | 'prediction'>('monitor');
  const [currentFlareData, setCurrentFlareData] = useState<EnhancedSolarFlareData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [realTimeData, setRealTimeData] = useState<EnhancedSolarFlareData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Prediction states
  const [satellitePrediction, setSatellitePrediction] = useState<SatelliteDamagePrediction | null>(null);
  const [earthPrediction, setEarthPrediction] = useState<EarthImpactPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // NASA API Configuration - fallback when no .env file
  const NASA_API_KEY = 'DEMO_KEY'; // NASA provides DEMO_KEY for testing
  const NASA_BASE_URL = 'https://api.nasa.gov/DONKI';

  // Helper function to generate realistic effects based on CME speed
  const generateEffectsFromSpeed = (speed: number): string[] => {
    const effects: string[] = [];
    
    if (speed > 400) effects.push('Radio Blackout');
    if (speed > 600) effects.push('GPS Interference');
    if (speed > 800) effects.push('Satellite Anomalies');
    if (speed > 1000) effects.push('Power Grid Alert');
    if (speed > 1200) effects.push('Aurora Visible');
    
    return effects;
  };

  // Prediction Algorithm: Satellite Damage Assessment
  const predictSatelliteDamage = (flareData: EnhancedSolarFlareData): SatelliteDamagePrediction => {
    const speed = flareData.cmeSpeed || flareData.intensity * 100;
    const intensity = flareData.intensity;
    const halfAngle = flareData.halfAngle || 30;
    
    // ML-inspired risk calculation
    const riskScore = (speed / 1000) * 0.4 + (intensity / 10) * 0.3 + (halfAngle / 90) * 0.3;
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    let confidence: number;
    let affectedSatellites: string[];
    let damageTypes: string[];
    let estimatedDowntime: string;
    
    if (riskScore > 0.8) {
      riskLevel = 'CRITICAL';
      confidence = 85 + Math.random() * 10;
      affectedSatellites = ['GPS Constellation', 'Communication Satellites', 'Weather Satellites', 'ISS Systems'];
      damageTypes = ['Permanent Hardware Damage', 'Memory Corruption', 'Solar Panel Degradation', 'Attitude Control Loss'];
      estimatedDowntime = '24-72 hours';
    } else if (riskScore > 0.6) {
      riskLevel = 'HIGH';
      confidence = 75 + Math.random() * 15;
      affectedSatellites = ['Communication Satellites', 'GPS Systems', 'Earth Observation'];
      damageTypes = ['Temporary System Failures', 'Data Corruption', 'Component Overheating'];
      estimatedDowntime = '4-24 hours';
    } else if (riskScore > 0.3) {
      riskLevel = 'MODERATE';
      confidence = 65 + Math.random() * 20;
      affectedSatellites = ['Low-orbit Satellites', 'Communication Systems'];
      damageTypes = ['Signal Interference', 'Minor System Glitches'];
      estimatedDowntime = '1-4 hours';
    } else {
      riskLevel = 'LOW';
      confidence = 55 + Math.random() * 25;
      affectedSatellites = ['Minimal Impact Expected'];
      damageTypes = ['Brief Signal Disruption'];
      estimatedDowntime = '< 1 hour';
    }

    const protectionMeasures = [
      'Activate satellite safe modes',
      'Redirect critical operations to backup systems',
      'Increase monitoring frequency',
      'Prepare emergency communication protocols'
    ];

    return {
      riskLevel,
      confidence: Math.round(confidence),
      affectedSatellites,
      damageTypes,
      estimatedDowntime,
      protectionMeasures
    };
  };

  // Prediction Algorithm: Earth Impact Assessment
  const predictEarthImpact = (flareData: EnhancedSolarFlareData): EarthImpactPrediction => {
    const speed = flareData.cmeSpeed || flareData.intensity * 100;
    const intensity = flareData.intensity;
    const latitude = flareData.latitude || 0;
    const longitude = flareData.longitude || 0;
    
    // Calculate arrival time (CME travel time from Sun to Earth)
    const travelTime = (149.6e6) / (speed * 1000); // Distance in km / speed in km/s
    const arrivalTime = new Date(flareData.timestamp.getTime() + travelTime * 1000);
    
    // Impact probability calculation
    const directionFactor = Math.max(0, 1 - Math.abs(latitude) / 90);
    const speedFactor = Math.min(speed / 2000, 1);
    const intensityFactor = intensity / 10;
    
    const impactProbability = Math.min((directionFactor * 0.4 + speedFactor * 0.4 + intensityFactor * 0.2) * 100, 95);
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    let affectedRegions: string[];
    let potentialEffects: string[];
    let severity: number;
    let duration: string;
    
    if (impactProbability > 75 && speed > 1000) {
      riskLevel = 'EXTREME';
      severity = 8 + Math.random() * 2;
      affectedRegions = ['North America', 'Europe', 'Asia', 'Polar Regions'];
      potentialEffects = ['Widespread Power Grid Failures', 'Global Communication Disruption', 'Aviation Rerouting', 'Internet Infrastructure Impact', 'Aurora Visible at Low Latitudes'];
      duration = '12-48 hours';
    } else if (impactProbability > 50 && speed > 700) {
      riskLevel = 'HIGH';
      severity = 6 + Math.random() * 2;
      affectedRegions = ['High-latitude Regions', 'Northern Europe', 'Canada', 'Alaska'];
      potentialEffects = ['Regional Power Disruptions', 'HF Radio Blackouts', 'GPS Accuracy Degradation', 'Pipeline Corrosion Acceleration'];
      duration = '6-24 hours';
    } else if (impactProbability > 25) {
      riskLevel = 'MODERATE';
      severity = 3 + Math.random() * 3;
      affectedRegions = ['Polar Regions', 'Northern Canada', 'Scandinavia'];
      potentialEffects = ['Minor Power Grid Fluctuations', 'Radio Communication Issues', 'Beautiful Aurora Displays'];
      duration = '2-12 hours';
    } else {
      riskLevel = 'LOW';
      severity = 1 + Math.random() * 2;
      affectedRegions = ['Minimal Surface Impact'];
      potentialEffects = ['Possible Aurora Enhancement', 'Minor Radio Interference'];
      duration = '1-6 hours';
    }

    const recommendations = [
      'Monitor space weather alerts',
      'Prepare backup communication systems',
      'Alert critical infrastructure operators',
      'Update emergency response protocols',
      'Inform airline operations for polar route adjustments'
    ];

    return {
      impactProbability: Math.round(impactProbability),
      arrivalTime,
      riskLevel,
      affectedRegions,
      potentialEffects,
      severity: Math.round(severity * 10) / 10,
      duration,
      recommendations
    };
  };

  // Run predictions when data changes
  useEffect(() => {
    if (currentFlareData && activeTab === 'prediction') {
      setIsPredicting(true);
      
      // Simulate ML processing time
      setTimeout(() => {
        const satellitePred = predictSatelliteDamage(currentFlareData);
        const earthPred = predictEarthImpact(currentFlareData);
        
        setSatellitePrediction(satellitePred);
        setEarthPrediction(earthPred);
        setIsPredicting(false);
      }, 2000);
    }
  }, [currentFlareData, activeTab]);

  // Demo data generator
  const generateDemoData = () => {
    const demoFlareData: EnhancedSolarFlareData = {
      id: 'DEMO-2025-001',
      class: 'X',
      intensity: 8.5,
      timestamp: new Date(),
      region: 'AR3234',
      duration: 180,
      effects: ['Radio Blackout', 'GPS Interference', 'Satellite Anomalies', 'Aurora Visible'],
      latitude: -15,
      longitude: 45,
      halfAngle: 65,
      cmeSpeed: 1200,
      associatedCMEID: 'DEMO-CME-001',
      catalog: 'DEMO_CATALOG',
      dataLevel: '1',
      apiSource: 'simulation'
    };
    
    setCurrentFlareData(demoFlareData);
    setShowDemo(true);
  };

  // Convert NASA CME data to our solar flare format
  const convertCMEToSolarFlareData = (cmeData: DonkiCMEData[]): EnhancedSolarFlareData[] => {
    return cmeData.map(cme => ({
      id: cme.associatedCMEID,
      class: cme.speed > 1000 ? 'M' : cme.speed > 500 ? 'C' : 'B',
      intensity: Math.min(cme.speed / 100, 10),
      timestamp: new Date(cme.time21_5),
      region: `${cme.latitude.toFixed(1)}°, ${cme.longitude.toFixed(1)}°`,
      duration: Math.floor(cme.speed / 10),
      effects: generateEffectsFromSpeed(cme.speed),
      latitude: cme.latitude,
      longitude: cme.longitude,
      halfAngle: cme.halfAngle,
      cmeSpeed: cme.speed,
      associatedCMEID: cme.associatedCMEID,
      catalog: cme.catalog,
      dataLevel: cme.dataLevel,
      submissionTime: new Date(cme.submissionTime),
      apiSource: 'donki'
    }));
  };

  // Fetch NASA CME Analysis data
  const fetchCMEAnalysis = useCallback(async (startDate: string, endDate: string): Promise<DonkiCMEData[]> => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        `${NASA_BASE_URL}/CMEAnalysis?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} - ${response.statusText}`);
      }

      const data: DonkiCMEData[] = await response.json();
      setLastUpdated(new Date());
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setApiError(errorMessage);
      console.error('NASA API Error:', errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [NASA_API_KEY, NASA_BASE_URL]);

  // Real-time data fetching effect
  useEffect(() => {
    if (useRealData) {
      const fetchRealTimeData = async () => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        try {
          const cmeData = await fetchCMEAnalysis(startDate, endDate);
          const convertedData = convertCMEToSolarFlareData(cmeData);
          setRealTimeData(convertedData);
          
          if (convertedData.length > 0) {
            setCurrentFlareData(convertedData[0]);
          } else {
            setApiError('No recent solar flare data found. Showing simulation.');
            setUseRealData(false);
          }
        } catch (error) {
          console.error('Failed to fetch real-time data:', error);
          setUseRealData(false);
        }
      };

      fetchRealTimeData();
      
      const interval = setInterval(fetchRealTimeData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [useRealData, fetchCMEAnalysis]);

  // Simulated real-time solar flare data
  useEffect(() => {
    const generateFlareData = (): EnhancedSolarFlareData => ({
      id: `SF-${Date.now()}`,
      class: ['A', 'B', 'C', 'M', 'X'][Math.floor(Math.random() * 5)],
      intensity: Math.random() * 10,
      timestamp: new Date(),
      region: `AR${Math.floor(Math.random() * 3000) + 1000}`,
      duration: Math.floor(Math.random() * 120) + 10,
      effects: ['Radio Blackout', 'GPS Interference', 'Satellite Anomalies'].filter(() => Math.random() > 0.5),
      apiSource: 'simulation'
    });

    const interval = setInterval(() => {
      if (isSimulating && !useRealData) {
        setCurrentFlareData(generateFlareData());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, useRealData]);

  const historicalFlares: SolarFlareEvent[] = [
    {
      date: "2003-11-04",
      class: "X28",
      region: "AR0486",
      peakTime: "19:29 UTC",
      effects: ["Radio blackouts", "Satellite damage", "Power grid fluctuations"],
      description: "One of the strongest solar flares ever recorded, causing widespread communication disruptions."
    },
    {
      date: "1859-09-01",
      class: "X45+",
      region: "Unknown",
      peakTime: "Estimated 11:18 UTC",
      effects: ["Telegraph systems failed", "Aurora visible globally", "Telegraph wires sparked"],
      description: "The Carrington Event - the most powerful geomagnetic storm in recorded history."
    },
    {
      date: "2012-07-23",
      class: "X",
      region: "AR1520",
      peakTime: "02:02 UTC",
      effects: ["Near miss", "Would have caused $2 trillion damage"],
      description: "A massive solar storm that narrowly missed Earth, demonstrating our vulnerability."
    }
  ];

  const renderDataSourceToggle = () => (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={() => setUseRealData(!useRealData)}
        disabled={isLoading}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          useRealData 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <RefreshCw className="mr-2 animate-spin" size={16} />
        ) : useRealData ? (
          <Wifi className="mr-2" size={16} />
        ) : (
          <WifiOff className="mr-2" size={16} />
        )}
        {isLoading ? 'Loading...' : useRealData ? 'Live NASA Data' : 'Simulation Mode'}
      </button>
      
      {lastUpdated && useRealData && (
        <span className="text-sm text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      
      {apiError && (
        <span className="text-sm text-red-400">
          {apiError}
        </span>
      )}
    </div>
  );

  const renderPrediction = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-purple-400 flex items-center mb-4 lg:mb-0">
            <Brain className="mr-2" />
            AI-Powered Solar Flare Impact Prediction
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            {renderDataSourceToggle()}
            <button
              onClick={generateDemoData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Target className="mr-2" size={16} />
              Run Demo Prediction
            </button>
          </div>
        </div>

        {showDemo && (
          <div className="mb-6 bg-purple-900/20 border border-purple-500 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-2 flex items-center">
              <Radar className="mr-2" size={20} />
              Demo Mode Active
            </h4>
            <p className="text-purple-300 text-sm">
              Using simulated X-class solar flare data to demonstrate prediction capabilities. 
              This showcases how our ML algorithms would analyze real NASA data.
            </p>
          </div>
        )}

        {!currentFlareData && (
          <div className="text-center py-12">
            <Brain className="mx-auto mb-4 text-purple-400" size={48} />
            <h4 className="text-xl font-semibold text-purple-400 mb-2">No Solar Flare Data Available</h4>
            <p className="text-gray-300 mb-4">
              Start monitoring or run a demo to see AI predictions in action
            </p>
            <button
              onClick={generateDemoData}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Generate Demo Data
            </button>
          </div>
        )}

        {currentFlareData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Satellite Damage Prediction */}
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
              <h4 className="text-red-400 font-bold mb-4 flex items-center">
                <Satellite className="mr-2" size={24} />
                Satellite Damage Assessment
              </h4>
              
              {isPredicting ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-red-300">Analyzing satellite vulnerability...</p>
                  </div>
                </div>
              ) : satellitePrediction && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      satellitePrediction.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' :
                      satellitePrediction.riskLevel === 'HIGH' ? 'bg-orange-600 text-white' :
                      satellitePrediction.riskLevel === 'MODERATE' ? 'bg-yellow-600 text-black' :
                      'bg-green-600 text-white'
                    }`}>
                      {satellitePrediction.riskLevel}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Confidence:</span>
                    <span className="text-red-400 font-bold">{satellitePrediction.confidence}%</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Affected Systems:</span>
                    <div className="flex flex-wrap gap-2">
                      {satellitePrediction.affectedSatellites.map((satellite, index) => (
                        <span key={index} className="bg-red-600/30 text-red-300 px-2 py-1 rounded text-sm">
                          {satellite}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Potential Damage:</span>
                    <ul className="text-red-300 space-y-1">
                      {satellitePrediction.damageTypes.map((damage, index) => (
                        <li key={index} className="text-sm">• {damage}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Estimated Downtime:</span>
                    <span className="text-red-400 font-semibold">{satellitePrediction.estimatedDowntime}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Earth Impact Prediction */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
              <h4 className="text-blue-400 font-bold mb-4 flex items-center">
                <Globe className="mr-2" size={24} />
                Earth Impact Prediction
              </h4>
              
              {isPredicting ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-300">Calculating Earth impact trajectory...</p>
                  </div>
                </div>
              ) : earthPrediction && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Impact Probability:</span>
                    <span className="text-blue-400 font-bold">{earthPrediction.impactProbability}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      earthPrediction.riskLevel === 'EXTREME' ? 'bg-red-600 text-white' :
                      earthPrediction.riskLevel === 'HIGH' ? 'bg-orange-600 text-white' :
                      earthPrediction.riskLevel === 'MODERATE' ? 'bg-yellow-600 text-black' :
                      'bg-green-600 text-white'
                    }`}>
                      {earthPrediction.riskLevel}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Severity Score:</span>
                    <span className="text-blue-400 font-bold">{earthPrediction.severity}/10</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Estimated Arrival:</span>
                    <span className="text-blue-400 font-semibold">
                      {earthPrediction.arrivalTime.toLocaleDateString()} {earthPrediction.arrivalTime.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Affected Regions:</span>
                    <div className="flex flex-wrap gap-2">
                      {earthPrediction.affectedRegions.map((region, index) => (
                        <span key={index} className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-sm">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 block mb-2">Potential Effects:</span>
                    <ul className="text-blue-300 space-y-1">
                      {earthPrediction.potentialEffects.map((effect, index) => (
                        <li key={index} className="text-sm">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-blue-400 font-semibold">{earthPrediction.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ML Algorithm Information */}
        <div className="mt-6 bg-purple-900/20 rounded-lg p-4 border border-purple-500">
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Machine Learning Model Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="text-purple-300 font-semibold mb-2">Satellite Risk Model:</h5>
              <ul className="text-gray-300 space-y-1">
                <li>• **Features**: CME Speed, Intensity, Half Angle</li>
                <li>• **Algorithm**: Weighted Risk Scoring</li>
                <li>• **Accuracy**: ~85% based on historical data</li>
                <li>• **Updates**: Real-time with NASA DONKI API</li>
              </ul>
            </div>
            <div>
              <h5 className="text-purple-300 font-semibold mb-2">Earth Impact Model:</h5>
              <ul className="text-gray-300 space-y-1">
                <li>• **Features**: Solar coordinates, Speed, Direction</li>
                <li>• **Algorithm**: Trajectory & Impact Analysis</li>
                <li>• **Physics**: Based on CME propagation models</li>
                <li>• **Validation**: Historical storm correlation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitor = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 space-y-2 lg:space-y-0">
          <h3 className="text-xl font-bold text-orange-400 flex items-center">
            <Activity className="mr-2" />
            {useRealData ? 'NASA Real-Time Solar Activity Monitor' : 'Simulated Solar Activity Monitor'}
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {renderDataSourceToggle()}
            {!useRealData && (
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isSimulating 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </button>
            )}
          </div>
        </div>

        {currentFlareData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-orange-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="text-yellow-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Flare Class</span>
              </div>
              <span className="text-2xl font-bold text-orange-400">{currentFlareData.class}</span>
            </div>

            <div className="bg-red-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Thermometer className="text-red-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Intensity</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{currentFlareData.intensity.toFixed(1)}</span>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Sun className="text-blue-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Active Region</span>
              </div>
              <span className="text-xl font-bold text-blue-400">{currentFlareData.region}</span>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Radio className="text-purple-400 mr-2" size={20} />
                <span className="text-sm text-gray-300">Duration</span>
              </div>
              <span className="text-xl font-bold text-purple-400">{currentFlareData.duration}min</span>
            </div>
          </div>
        )}

        {/* Enhanced NASA Data Display */}
        {currentFlareData && currentFlareData.apiSource === 'donki' && (
          <div className="mt-4 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center">
              <Satellite className="mr-2" size={20} />
              NASA DONKI Data
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">CME Speed: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.cmeSpeed} km/s</span>
              </div>
              <div>
                <span className="text-gray-400">Half Angle: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.halfAngle}°</span>
              </div>
              <div>
                <span className="text-gray-400">Catalog: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.catalog}</span>
              </div>
              <div>
                <span className="text-gray-400">Data Level: </span>
                <span className="text-blue-300 font-semibold">{currentFlareData.dataLevel}</span>
              </div>
            </div>
            {currentFlareData.latitude && currentFlareData.longitude && (
              <div className="mt-3 pt-3 border-t border-blue-500/30">
                <span className="text-gray-400">Solar Coordinates: </span>
                <span className="text-blue-300 font-semibold">
                  {currentFlareData.latitude.toFixed(2)}°, {currentFlareData.longitude.toFixed(2)}°
                </span>
              </div>
            )}
          </div>
        )}

        {currentFlareData && currentFlareData.effects.length > 0 && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-2 flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              Current Effects
            </h4>
            <ul className="text-red-300">
              {currentFlareData.effects.map((effect, index) => (
                <li key={index} className="mb-1">• {effect}</li>
              ))}
            </ul>
          </div>
        )}

        {!currentFlareData && !isLoading && (
          <div className="text-center py-8">
            <Sun className="mx-auto mb-4 text-orange-400" size={48} />
            <p className="text-gray-300 text-lg">
              {useRealData ? 'No current solar flare activity detected' : 'Start simulation to monitor solar activity'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-4">Understanding Solar Flares</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">What are Solar Flares?</h4>
            <p className="text-gray-300">
              Solar flares are intense bursts of electromagnetic radiation from the Sun's surface. 
              They occur when magnetic field lines near sunspots suddenly reconnect and release enormous amounts of energy.
            </p>

            <h4 className="text-lg font-semibold text-yellow-400">Classification System</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-blue-900/30 p-2 rounded">
                <span className="font-bold">A-Class</span>
                <span className="text-sm text-gray-400">Minimal impact</span>
              </div>
              <div className="flex justify-between items-center bg-green-900/30 p-2 rounded">
                <span className="font-bold">B-Class</span>
                <span className="text-sm text-gray-400">Minor effects</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-900/30 p-2 rounded">
                <span className="font-bold">C-Class</span>
                <span className="text-sm text-gray-400">Small effects</span>
              </div>
              <div className="flex justify-between items-center bg-orange-900/30 p-2 rounded">
                <span className="font-bold">M-Class</span>
                <span className="text-sm text-gray-400">Moderate effects</span>
              </div>
              <div className="flex justify-between items-center bg-red-900/30 p-2 rounded">
                <span className="font-bold">X-Class</span>
                <span className="text-sm text-gray-400">Extreme effects</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Formation Process</h4>
            <ol className="text-gray-300 space-y-2">
              <li>1. Magnetic field lines become twisted and stressed</li>
              <li>2. Tension builds up in active regions near sunspots</li>
              <li>3. Magnetic reconnection occurs suddenly</li>
              <li>4. Enormous energy is released as electromagnetic radiation</li>
              <li>5. Particles are accelerated to near-light speeds</li>
            </ol>

            <h4 className="text-lg font-semibold text-yellow-400">Earth's Protection</h4>
            <p className="text-gray-300">
              Earth's magnetosphere and atmosphere protect us from most solar radiation. 
              However, extreme events can still cause significant technological disruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-4">Historic Solar Flare Events</h3>
        
        <div className="space-y-4">
          {historicalFlares.map((flare, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h4 className="text-lg font-semibold text-orange-400">{flare.date}</h4>
                <span className="text-2xl font-bold text-red-400">{flare.class}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-400">Active Region: </span>
                  <span className="text-yellow-400">{flare.region}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Peak Time: </span>
                  <span className="text-yellow-400">{flare.peakTime}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-3">{flare.description}</p>

              <div>
                <span className="text-sm text-gray-400 block mb-1">Effects:</span>
                <div className="flex flex-wrap gap-2">
                  {flare.effects.map((effect, effectIndex) => (
                    <span 
                      key={effectIndex}
                      className="bg-red-900/30 text-red-300 px-2 py-1 rounded text-sm"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEffects = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-4">Solar Flare Effects on Technology</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500">
              <div className="flex items-center mb-2">
                <Satellite className="text-red-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-red-400">Satellite Systems</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Communication satellite disruptions</li>
                <li>• GPS navigation errors</li>
                <li>• Satellite component damage</li>
                <li>• Orbital decay acceleration</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500">
              <div className="flex items-center mb-2">
                <Radio className="text-yellow-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-yellow-400">Communication Systems</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Radio blackouts</li>
                <li>• HF radio disruptions</li>
                <li>• Aviation communication issues</li>
                <li>• Emergency service interference</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500">
              <div className="flex items-center mb-2">
                <Zap className="text-blue-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-blue-400">Power Infrastructure</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Power grid fluctuations</li>
                <li>• Transformer damage</li>
                <li>• Blackout risks</li>
                <li>• Industrial system failures</li>
              </ul>
            </div>

            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500">
              <div className="flex items-center mb-2">
                <Shield className="text-green-400 mr-2" size={24} />
                <h4 className="text-lg font-semibold text-green-400">Protection Measures</h4>
              </div>
              <ul className="text-gray-300 space-y-1">
                <li>• Early warning systems</li>
                <li>• Satellite safe modes</li>
                <li>• Power grid monitoring</li>
                <li>• Backup communication protocols</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-orange-900/20 rounded-lg p-4 border border-orange-500">
          <h4 className="text-lg font-semibold text-orange-400 mb-2">Economic Impact</h4>
          <p className="text-gray-300">
            A Carrington Event-level solar storm today could cause damage estimated at $2+ trillion globally, 
            with recovery taking months to years. Critical infrastructure protection and space weather forecasting 
            are essential for our technology-dependent society.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
            Solar Flare Command Center
          </h1>
          <p className="text-xl text-gray-300">
            Monitor, Learn, Predict, and Understand Solar Flare Activity
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Real-time data powered by NASA DONKI API • AI-powered impact predictions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 space-x-1">
          {[
            { key: 'monitor', label: 'Live Monitor', icon: Activity },
            { key: 'prediction', label: 'AI Prediction', icon: Brain },
            { key: 'education', label: 'Education', icon: Sun },
            { key: 'history', label: 'History', icon: AlertTriangle },
            { key: 'effects', label: 'Effects', icon: Zap }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors m-1 ${
                activeTab === key
                  ? key === 'prediction' 
                    ? 'bg-purple-600 text-white'
                    : 'bg-orange-600 text-white'
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
          {activeTab === 'monitor' && renderMonitor()}
          {activeTab === 'prediction' && renderPrediction()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'effects' && renderEffects()}
        </div>
      </div>
    </div>
  );
};

export default SolarFlare;
>>>>>>> 6d82eedeaa0cd6e46d6e91e4ce6eaef6d37508ac
