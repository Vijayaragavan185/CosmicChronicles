import { useState, useEffect, useCallback } from 'react';
import { DonkiCMEData, EnhancedSolarFlareData } from '../types/solarflare';

interface UseNASAAPIConfig {
  apiKey?: string;
  baseUrl?: string;
  enableRealTimeUpdates?: boolean;
}

export const useNASAAPI = (config: UseNASAAPIConfig = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const {
    apiKey = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY',
    baseUrl = 'https://api.nasa.gov/DONKI',
    enableRealTimeUpdates = true
  } = config;

  const fetchCMEAnalysis = useCallback(async (
    startDate: string, 
    endDate: string
  ): Promise<DonkiCMEData[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/CMEAnalysis?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status}`);
      }

      const data: DonkiCMEData[] = await response.json();
      setLastUpdated(new Date());
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('NASA API Error:', errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, baseUrl]);

  const fetchSolarFlares = useCallback(async (
    startDate: string, 
    endDate: string
  ): Promise<any[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status}`);
      }

      const data = await response.json();
      setLastUpdated(new Date());
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('NASA API Error:', errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, baseUrl]);

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

  return {
    fetchCMEAnalysis,
    fetchSolarFlares,
    convertCMEToSolarFlareData,
    isLoading,
    error,
    lastUpdated
  };
};

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
