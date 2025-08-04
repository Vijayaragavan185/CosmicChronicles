import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Volume2, VolumeX } from 'lucide-react';

interface SpaceShuttleIntroProps {
  onComplete: () => void;
}

export const SpaceShuttleIntro: React.FC<SpaceShuttleIntroProps> = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showRocket, setShowRocket] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stars, setStars] = useState<Array<{x: number, y: number, z: number, speed: number, brightness: number}>>([]);
  const [countdownBlink, setCountdownBlink] = useState(false);
  const [hudData, setHudData] = useState({
    velocity: 0,
    altitude: 0,
    fuel: 100,
    oxygen: 100,
    thrust: 0,
    temperature: 22,
    pressure: 14.7
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const messages = [
    "Welcome, Stargazer.",
    "Journey through time and space.",
    "Discover cosmic events.",
    "Prepare for launch..."
  ];

  const speakText = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1.1;
    utterance.volume = 0.7;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.includes('en-US')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const starField = [];
    for (let i = 0; i < 250; i++) { 
      starField.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000,
        speed: Math.random() * 0.6 + 0.2, 
        brightness: Math.random() * 0.5 + 0.3
      });
    }
    setStars(starField);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHudData(prev => ({
        velocity: isLaunching ? Math.min(prev.velocity + 15, 28000) : Math.max(prev.velocity - 2, 0),
        altitude: isLaunching ? Math.min(prev.altitude + 0.5, 408) : prev.altitude,
        fuel: isLaunching ? Math.max(prev.fuel - 0.3, 85) : prev.fuel,
        oxygen: Math.max(prev.oxygen - 0.05, 98),
        thrust: isLaunching ? Math.min(prev.thrust + 5, 100) : Math.max(prev.thrust - 3, 0),
        temperature: isLaunching ? Math.min(prev.temperature + 0.2, 28) : prev.temperature,
        pressure: isLaunching ? Math.max(prev.pressure - 0.1, 0) : prev.pressure
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isLaunching]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        const speedMultiplier = isLaunching ? 2 : 1;
        star.z -= star.speed * speedMultiplier;
        
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.brightness = Math.random() * 0.5 + 0.3;
        }

        const perspective = 500;
        const x = (star.x / star.z) * perspective + centerX;
        const y = (star.y / star.z) * perspective + centerY;

        const distance = star.z / 1000;
        const size = Math.max(0.2, (1 - distance) * 1.5);
        const opacity = Math.min(0.7, (1 - distance) * star.brightness * 0.6);

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height && opacity > 0.1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(240, 248, 255, ${opacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, isLaunching]);

  useEffect(() => {
    if (currentIndex < messages.length) {
      const message = messages[currentIndex];
      let charIndex = 0;
      
      if (charIndex === 0) {
        speakText(message);
      }
      
      const typeInterval = setInterval(() => {
        if (charIndex <= message.length) {
          setCurrentText(prev => {
            const previousMessages = messages.slice(0, currentIndex).join(' ');
            const currentTyping = message.slice(0, charIndex);
            return previousMessages + (previousMessages ? ' ' : '') + currentTyping;
          });
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            if (currentIndex < messages.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              setShowCountdown(true);
              setShowRocket(true);
              speakText("Launch sequence initiated. 3, 2, 1");
            }
          }, 800);
        }
      }, 25); 

      return () => clearInterval(typeInterval);
    }
  }, [currentIndex, audioEnabled]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          const newCount = prev - 1;
          
          setCountdownBlink(true);
          setTimeout(() => setCountdownBlink(false), 200);
          
          if (newCount > 0) {
            speakText(newCount.toString());
          } else {
            speakText("Liftoff! Welcome to Cosmic Chronicles!");
            setIsLaunching(true);
          }
          return newCount;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else if (showCountdown && countdown === 0) {
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  }, [showCountdown, countdown, onComplete, audioEnabled]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Star field canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: isLaunching 
            ? 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 80%)'
            : 'radial-gradient(ellipse at center, #050510 0%, #000000 100%)'
        }}
      />

      {/* Realistic Space Shuttle HUD */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cockpit frame */}
        <div className="absolute inset-0 border-2 border-gray-800/30 rounded-3xl" 
             style={{ 
               boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)' 
             }} 
        />
        
        {/* Top Left HUD - Flight Data */}
        <div className="absolute top-6 left-6 space-y-3 font-mono text-xs">
          <div className="bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-lg p-3 min-w-[200px]">
            <div className="text-green-400 font-semibold mb-2 text-center">FLIGHT DATA</div>
            <div className="space-y-1 text-green-300">
              <div className="flex justify-between">
                <span>VELOCITY:</span>
                <span className="text-cyan-400">{hudData.velocity.toFixed(0)} km/h</span>
              </div>
              <div className="flex justify-between">
                <span>ALTITUDE:</span>
                <span className="text-cyan-400">{hudData.altitude.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span>THRUST:</span>
                <span className="text-orange-400">{hudData.thrust.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right HUD - System Status */}
        <div className="absolute top-6 right-6 space-y-3 font-mono text-xs">
          <div className="bg-black/40 backdrop-blur-sm border border-blue-400/30 rounded-lg p-3 min-w-[200px]">
            <div className="text-blue-400 font-semibold mb-2 text-center">LIFE SUPPORT</div>
            <div className="space-y-1 text-blue-300">
              <div className="flex justify-between">
                <span>FUEL:</span>
                <span className={hudData.fuel > 90 ? "text-green-400" : "text-yellow-400"}>{hudData.fuel.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>OXYGEN:</span>
                <span className="text-green-400">{hudData.oxygen.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>TEMP:</span>
                <span className="text-cyan-400">{hudData.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span>PRESSURE:</span>
                <span className="text-cyan-400">{hudData.pressure.toFixed(1)} psi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left HUD - Mission Status */}
        <div className="absolute bottom-6 left-6 space-y-3 font-mono text-xs">
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-3 min-w-[200px]">
            <div className="text-purple-400 font-semibold mb-2 text-center">MISSION STATUS</div>
            <div className="space-y-1 text-purple-300">
              <div className="flex justify-between">
                <span>PHASE:</span>
                <span className="text-yellow-400">
                  {!showCountdown ? 'PRE-FLIGHT' : 
                   countdown > 0 ? 'COUNTDOWN' : 
                   'LAUNCH'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SYSTEMS:</span>
                <span className="text-green-400">NOMINAL</span>
              </div>
              <div className="flex justify-between">
                <span>CREW:</span>
                <span className="text-green-400">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right HUD - Navigation */}
        <div className="absolute bottom-6 right-6 space-y-3 font-mono text-xs">
          <div className="bg-black/40 backdrop-blur-sm border border-orange-400/30 rounded-lg p-3 min-w-[200px]">
            <div className="text-orange-400 font-semibold mb-2 text-center">NAVIGATION</div>
            <div className="space-y-1 text-orange-300">
              <div className="flex justify-between">
                <span>TARGET:</span>
                <span className="text-cyan-400">COSMOS</span>
              </div>
              <div className="flex justify-between">
                <span>BEARING:</span>
                <span className="text-cyan-400">000°</span>
              </div>
              <div className="flex justify-between">
                <span>DISTANCE:</span>
                <span className="text-cyan-400">∞ km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="w-6 h-0.5 bg-green-400"></div>
          <div className="w-0.5 h-6 bg-green-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          <div className="w-3 h-3 border border-green-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Rocket */}
          {showRocket && (
            <div className={`mb-12 transition-all duration-2000 ${
              countdown === 0 ? 'transform -translate-y-96 scale-150 opacity-0' : ''
            }`}>
            </div>
          )}

          {/* Premium continuous text display */}
          <div className="space-y-8 mb-12">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-relaxed"
                 style={{ 
                   fontFamily: "'Inter', system-ui, sans-serif",
                   letterSpacing: '0.02em',
                   fontWeight: '300',
                   lineHeight: '1.4'
                 }}>
              {currentText}
              {currentIndex < messages.length && (
                <span className="animate-pulse text-green-400/70 ml-1">|</span>
              )}
            </div>
          </div>

          {/* Countdown with single blink */}
          {showCountdown && countdown > 0 && (
            <div className="text-center">
              <div className={`text-6xl md:text-7xl font-light bg-gradient-to-r from-orange-400/90 via-red-400/90 to-yellow-400/90 bg-clip-text text-transparent transition-all duration-200 ${
                countdownBlink ? 'scale-110 brightness-150' : 'scale-100'
              }`} style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: '200' }}>
                {countdown}
              </div>
              <div className="text-base text-gray-400/70 mt-6 font-light">
                {countdown === 3 && "Engine start sequence"}
                {countdown === 2 && "All systems go"}
                {countdown === 1 && "Prepare for liftoff"}
              </div>
            </div>
          )}

          {/* Launch text */}
          {showCountdown && countdown === 0 && (
            <div className="text-center animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-light bg-gradient-to-r from-green-400/90 via-blue-400/90 to-purple-400/90 bg-clip-text text-transparent"
                   style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: '200' }}>
                LIFTOFF
              </div>
              <div className="text-lg text-white/80 mt-6 font-light">
                Welcome to Cosmic Chronicles
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed control buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-20" style={{ marginRight: '220px' }}>
        {/* Audio toggle */}
        <button
          onClick={() => {
            setAudioEnabled(!audioEnabled);
            if (!audioEnabled) {
              speakText("Audio enabled");
            } else {
              window.speechSynthesis.cancel();
            }
          }}
          className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg text-white/70 transition-all duration-300 hover:scale-105"
          title={audioEnabled ? "Disable Audio" : "Enable Audio"}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Skip button */}
        <button
          onClick={() => {
            window.speechSynthesis.cancel();
            onComplete();
          }}
          className="px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg text-white/70 font-light text-sm transition-all duration-300 hover:scale-105"
        >
          Skip
        </button>
      </div>
    </div>
  );
};