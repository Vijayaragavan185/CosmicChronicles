import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, Settings, Headphones, 
  Upload, RefreshCw, Sliders, AudioWaveform, Eye, Download
} from 'lucide-react';

interface SonificationSettings {
  minFreq: number;
  maxFreq: number;
  duration: number;
  brightness: number;
  scanSpeed: number;
  volume: number;
}

export const SonicCosmos: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [settings, setSettings] = useState<SonificationSettings>({
    minFreq: 200,
    maxFreq: 1000,
    duration: 0.5,
    brightness: 1.0,
    scanSpeed: 1.0,
    volume: 0.3
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [sonificationProgress, setSonificationProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // ✅ FIXED: Use CORS-friendly sample images
  const sampleImages = [
    '/api/placeholder/400/300', // Placeholder 1
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InN0YXJzIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3N0YXJzKSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNSIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iMyIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIwMCIgcj0iNCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==', // Star field SVG
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9Im5lYnVsYSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmMDA2NiIgc3RvcC1vcGFjaXR5PSIwLjgiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzY2MDA5OSIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI25lYnVsYSkiLz48L3N2Zz4=' // Nebula SVG
  ];

  // ✅ FIXED: Initialize Audio Context with user interaction
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume context if suspended (required by browsers)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        setAudioEnabled(true);
        console.log('Audio context initialized successfully');
      } catch (error) {
        console.error('Audio context initialization failed:', error);
        setAudioEnabled(false);
      }
    }
    return audioContextRef.current;
  }, []);

  // ✅ FIXED: Load and process image with CORS handling
  const loadImage = useCallback((imageSrc: string) => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // ✅ FIXED: Add CORS headers for external images
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true);
      console.log('Image loaded successfully');
    };
    
    img.onerror = (error) => {
      console.error('Image load error:', error);
      // ✅ FALLBACK: Create a test pattern if image fails
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = 400;
      canvas.height = 300;
      
      // Create a colorful test pattern
      for (let x = 0; x < canvas.width; x += 20) {
        for (let y = 0; y < canvas.height; y += 20) {
          const hue = (x + y) % 360;
          ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
          ctx.fillRect(x, y, 20, 20);
        }
      }
      setImageLoaded(true);
    };
    
    img.src = imageSrc;
    setCurrentImage(imageSrc);
  }, []);

  // ✅ FIXED: Convert image pixels to audio frequencies
  const sonifyImage = useCallback(async () => {
    const canvas = canvasRef.current;
    
    if (!canvas || !imageLoaded) {
      console.error('Canvas or image not ready');
      return;
    }

    // ✅ FIXED: Initialize audio context with user interaction
    const audioCtx = await initAudioContext();
    if (!audioCtx || !audioEnabled) {
      console.error('Audio context not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous oscillators
    oscillatorsRef.current.forEach(osc => {
      try { 
        osc.stop(); 
        osc.disconnect();
      } catch (e) {}
    });
    oscillatorsRef.current = [];

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // ✅ FIXED: Reduce sample rate for better performance
    const sampleRate = 50; // Every 50th pixel
    const totalSamples = Math.floor(pixels.length / (4 * sampleRate));
    
    console.log(`Sonifying ${totalSamples} pixels`);
    
    for (let i = 0; i < Math.min(totalSamples, 500); i++) { // Limit to 500 sounds
      const pixelIndex = i * sampleRate * 4;
      const r = pixels[pixelIndex] || 0;
      const g = pixels[pixelIndex + 1] || 0;
      const b = pixels[pixelIndex + 2] || 0;
      const brightness = (r + g + b) / 3;
      
      if (brightness < 20) continue; // Skip very dark pixels
      
      // ✅ FIXED: Improved frequency mapping
      const normalizedR = r / 255;
      const normalizedG = g / 255;  
      const normalizedB = b / 255;
      
      // Use RGB to create frequency
      const frequency = settings.minFreq + (normalizedR * (settings.maxFreq - settings.minFreq));
      const volume = Math.min((brightness / 255) * settings.brightness * settings.volume, 0.1);
      
      if (volume < 0.01) continue; // Skip very quiet sounds
      
      try {
        // Create oscillator for this pixel
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + settings.duration);
        
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const startTime = audioCtx.currentTime + (i / totalSamples) * settings.scanSpeed * 2;
        oscillator.start(startTime);
        oscillator.stop(startTime + settings.duration);
        
        oscillatorsRef.current.push(oscillator);
        
        // Update progress
        setSonificationProgress((i / Math.min(totalSamples, 500)) * 100);
      } catch (error) {
        console.error('Oscillator creation error:', error);
      }
    }
    
    // Reset progress after completion
    const totalDuration = (settings.scanSpeed * 2 + settings.duration) * 1000;
    setTimeout(() => {
      setSonificationProgress(0);
      setIsPlaying(false);
    }, totalDuration);
    
  }, [settings, imageLoaded, initAudioContext, audioEnabled]);

  // ✅ FIXED: Start/stop sonification with audio context handling
  const toggleSonification = useCallback(async () => {
    if (isPlaying) {
      // Stop all oscillators
      oscillatorsRef.current.forEach(osc => {
        try { 
          osc.stop(); 
          osc.disconnect();
        } catch (e) {}
      });
      oscillatorsRef.current = [];
      setIsPlaying(false);
      setSonificationProgress(0);
    } else {
      if (!audioEnabled) {
        await initAudioContext();
      }
      
      if (audioEnabled || audioContextRef.current) {
        setIsPlaying(true);
        await sonifyImage();
      } else {
        alert('Audio not available. Please check your browser settings.');
      }
    }
  }, [isPlaying, sonifyImage, audioEnabled, initAudioContext]);

  // ✅ FIXED: Load sample image on mount
  useEffect(() => {
    // Create a default colorful pattern
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;
    
    // Create rainbow pattern
    for (let x = 0; x < 400; x += 10) {
      for (let y = 0; y < 300; y += 10) {
        const hue = ((x + y) * 0.5) % 360;
        const sat = 70 + (x % 30);
        const light = 40 + (y % 40);
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
        ctx.fillRect(x, y, 10, 10);
      }
    }
    
    const dataUrl = canvas.toDataURL();
    loadImage(dataUrl);
  }, [loadImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      loadImage(url);
    }
  };

  // ✅ FIXED: Sample button click handlers
  const handleSampleClick = (index: number) => {
    console.log(`Loading sample ${index + 1}`);
    loadImage(sampleImages[index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            🎵 Sonic Cosmos - Space Sonification
          </h1>
          <p className="text-xl text-gray-300">
            Transform Astronomical Images into Immersive Audio Experiences
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Map image colors and brightness to sound frequencies • Enhanced accessibility • Artistic exploration
          </p>
          
          {/* Audio Status */}
          <div className="mt-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              audioEnabled ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
            }`}>
              {audioEnabled ? <Volume2 size={16} className="mr-1" /> : <VolumeX size={16} className="mr-1" />}
              Audio: {audioEnabled ? 'Ready' : 'Click play to enable'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Display & Canvas */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <Eye className="mr-2" />
                Astronomical Image
              </h3>
              
              {/* Image Controls */}
              <div className="flex flex-wrap gap-2 mb-4">
                <label className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
                  <Upload className="mr-2" size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                
                {sampleImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleClick(index)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    Sample {index + 1}
                  </button>
                ))}
              </div>

              {/* Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-md mx-auto border border-purple-500 rounded-lg bg-black"
                  style={{ maxHeight: '300px' }}
                />
                <img
                  ref={imageRef}
                  className="hidden"
                  alt="Source for sonification"
                />
                
                {/* Progress Overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <div className="bg-black/70 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AudioWaveform className="animate-pulse" size={20} />
                        <span>Sonifying... {sonificationProgress.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={toggleSonification}
                  disabled={!imageLoaded}
                  className={`flex items-center px-8 py-4 rounded-lg font-semibold transition-all ${
                    imageLoaded
                      ? isPlaying
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2" size={20} />
                      Stop Sonification
                    </>
                  ) : (
                    <>
                      <Play className="mr-2" size={20} />
                      Play Cosmic Sounds
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sonification Controls */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <Sliders className="mr-2" />
                Audio Mapping Controls
              </h3>

              <div className="space-y-6">
                {/* Frequency Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Frequency Range: {settings.minFreq}Hz - {settings.maxFreq}Hz
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400">Min Frequency</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={settings.minFreq}
                        onChange={(e) => setSettings(prev => ({ ...prev, minFreq: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Max Frequency</label>
                      <input
                        type="range"
                        min="500"
                        max="2000"
                        value={settings.maxFreq}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxFreq: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Master Volume: {(settings.volume * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={settings.volume}
                    onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* Brightness Sensitivity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brightness Sensitivity: {settings.brightness.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={settings.brightness}
                    onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* Note Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Note Duration: {settings.duration.toFixed(1)}s
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={settings.duration}
                    onChange={(e) => setSettings(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* Scan Speed */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Scan Speed: {settings.scanSpeed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={settings.scanSpeed}
                    onChange={(e) => setSettings(prev => ({ ...prev, scanSpeed: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-6">
              <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
                <Headphones className="mr-2" />
                How It Works
              </h4>
              <ul className="text-sm text-purple-200 space-y-2">
                <li>• **Color Mapping**: Red determines frequency pitch</li>
                <li>• **Brightness Mapping**: Brightness controls volume</li>
                <li>• **Progressive Scan**: Pixels play in sequence</li>
                <li>• **Accessibility**: Experience space images through sound</li>
                <li>• **Artistic Expression**: Discover hidden patterns in cosmic imagery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SonicCosmos;
