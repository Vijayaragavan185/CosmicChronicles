import React, { useState, useEffect, useCallback } from 'react';
import { Telescope, Sparkles, Globe, MessageCircle, Calendar as CalendarIcon, Gamepad2, Stars, Users, Rocket, Orbit, Calculator, Zap, Play, ShoppingCart } from 'lucide-react';
import { StarField } from './components/StarField';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { DateSelector } from './components/DateSelector';
import { Calendar } from './components/Calendar';
import { Horoscope } from './components/Horoscope';
import { Chatbot } from './components/Chatbot';
import { GameCenter } from './components/GameCenter';
import { SocialHub } from './components/SocialHub';
import { CosmicTimeline } from './components/CosmicTimeline';
import { SolarSystemExplorer } from './components/SolarSystemExplorer';
import { AstronomyCalculators } from './components/AstronomyCalculators';
import { InterstellarTech } from './components/InterstellarTech';
import { SpaceEducation } from './components/SpaceEducation';
import { SpaceFranchise } from './components/SpaceFranchise';
import SolarFlare from './components/SolarFlare';
import { CargoManagement } from './components/CargoManagement';
import { ExoplanetPredictor } from './components/ExoplanetPredictor';
import { SpaceShuttleIntro } from './components/SpaceShuttleIntro';
import { VisualAssist } from './components/VisualAssist';
import { VoiceRecognition } from './components/VoiceRecognition';
import { useScreenReader } from './hooks/useScreenReader';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { getEventsForDate } from './data/events';
import { AstronomicalEvent } from './types/Event';
import SonicCosmos from './components/SonicCosmos';
import ARSolarSystem from './components/ARSolarSystem';
import { Headphones, Smartphone } from 'lucide-react';

//type ActiveSection = 'events' | 'education' | 'timeline' | 'solar-system' | 'calculators' | 'games' | 'horoscope' | 'social' | 'solarflare' | 'cargo' | 'exoplanet' | 'interstellar';
type ActiveSection = 'events' | 'education' | 'timeline' | 'solar-system' | 'calculators' | 'games' | 'horoscope' | 'social' | 'solarflare' | 'cargo' | 'exoplanet' | 'interstellar' | 'sonic' | 'ar-solar';
function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AstronomicalEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('events');
  const [showIntro, setShowIntro] = useState(true);
  
  // Accessibility states
  const [visionSupportMode, setVisionSupportMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Apply theme and font size to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme classes
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }
    
    // Apply font size to root
    root.style.fontSize = `${fontSize}px`;
    
    // Store preferences in localStorage
    localStorage.setItem('cosmic-theme', theme);
    localStorage.setItem('cosmic-font-size', fontSize.toString());
  }, [theme, fontSize]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cosmic-theme') as 'light' | 'dark' | null;
    const savedFontSize = localStorage.getItem('cosmic-font-size');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      if (size >= 12 && size <= 24) {
        setFontSize(size);
      }
    }
  }, []);

  const loadEvents = useCallback(async (date: Date) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const eventsForDate = await getEventsForDate(date);
      setEvents(eventsForDate);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showIntro) {
      loadEvents(selectedDate);
    }
  }, [selectedDate, loadEvents, showIntro]);

  // Screen reader hook with loading state
  const { startReading, stopReading } = useScreenReader({
    isEnabled: visionSupportMode,
    events,
    activeSection,
    isLoading,
    onNavigationComplete: () => {
      if (activeSection === 'events') {
        setActiveSection('timeline');
      } else if (activeSection === 'timeline') {
        setActiveSection('events');
      }
    }
  });

  // Keyboard navigation hook
  useKeyboardNavigation({
    isVisionSupportEnabled: visionSupportMode,
    activeSection,
    onSectionChange: (section) => setActiveSection(section as ActiveSection),
    onVoiceCommand: () => setIsVoiceListening(true),
    isVoiceListening
  });

  const handleEventClick = (event: AstronomicalEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleVoiceDateRecognized = (date: Date) => {
    setSelectedDate(date);
    setIsVoiceListening(false);
  };

  const handleVisionSupportModeChange = (enabled: boolean) => {
    setVisionSupportMode(enabled);
    
    // Provide immediate feedback
    if (enabled) {
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Vision Support Mode enabled. Content will be read automatically.");
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 0.8;
          window.speechSynthesis.speak(utterance);
        }
      }, 500);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const formatDateForTitle = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const navigationItems = [
    { id: 'events', label: 'Events', icon: Telescope, color: 'from-purple-600 to-blue-600' },
    { id: 'timeline', label: 'Timeline', icon: Rocket, color: 'from-orange-600 to-red-600' },
    { id: 'solar-system', label: 'Solar System', icon: Orbit, color: 'from-yellow-600 to-orange-600' },
    { id: 'education', label: 'Education', icon: Play, color: 'from-red-600 to-pink-600' },
    { id: 'calculators', label: 'Calculators', icon: Calculator, color: 'from-teal-600 to-green-600' },
    { id: 'interstellar', label: 'Interstellar', icon: Zap, color: 'from-violet-600 to-purple-600' },
    { id: 'games', label: 'Games', icon: Gamepad2, color: 'from-green-600 to-emerald-600' },
    { id: 'horoscope', label: 'Horoscope', icon: Stars, color: 'from-indigo-600 to-purple-600' },
    { id: 'social', label: 'Social', icon: Users, color: 'from-blue-600 to-cyan-600' },
    { id: 'solarflare', label: 'Solar Flare', icon: Zap, color: 'from-orange-600 to-red-600' },
    { id: 'cargo', label: 'Cargo Management', icon: ShoppingCart, color: 'from-cyan-600 to-blue-600' },
    { id: 'sonic', label: 'Sonic Cosmos', icon: Headphones, color: 'from-purple-600 to-pink-600' },
    { id: 'ar-solar', label: 'AR Solar System', icon: Smartphone, color: 'from-blue-600 to-cyan-600' },
    { id: 'exoplanet', label: 'Exoplanet AI', icon: Globe, color: 'from-green-600 to-emerald-600' }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'education':
        return <SpaceEducation />;
      case 'timeline':
        return <CosmicTimeline />;
      case 'solar-system':
        return <SolarSystemExplorer />;
      case 'calculators':
        return <AstronomyCalculators />;
      case 'games':
        return <GameCenter />;
      case 'horoscope':
        return <Horoscope selectedDate={selectedDate} />;
      case 'social':
        return <SocialHub selectedDate={selectedDate} />;
      case 'solarflare':
        return <SolarFlare />;
      case 'cargo':
        return <CargoManagement />;
      case 'exoplanet':
        return <ExoplanetPredictor />;
      case 'interstellar':
        return <InterstellarTech />;
      case 'sonic':
        return <SonicCosmos />;
      case 'ar-solar':
        return <ARSolarSystem />;
      case 'events':
      default:
        return (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-content-secondary">Loading cosmic events...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-content-primary mb-4">
                    {events.length > 0 ? (
                      `Astronomical Events on ${formatDateForTitle(selectedDate)}`
                    ) : (
                      `No recorded events on ${formatDateForTitle(selectedDate)}`
                    )}
                  </h2>
                  {events.length > 0 ? (
                    <p className="text-content-secondary text-lg">
                      Discover {events.length} remarkable cosmic milestone{events.length !== 1 ? 's' : ''} from history
                    </p>
                  ) : (
                    <p className="text-content-secondary text-lg">
                      Here are some fascinating astronomical events from history
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <EventCard
                        event={event}
                        onClick={() => handleEventClick(event)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        );
    }
  };

  if (showIntro) {
    return <SpaceShuttleIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-app-background text-content-primary">
      <StarField />
      
      <div className="relative z-10 min-h-screen">
        {/* Header with Visual Assist */}
        <header className="relative pt-12 pb-8">
          <div className="container mx-auto px-6">
            {/* Visual Assist Button */}
            <div className="absolute top-6 right-6">
              <VisualAssist
                onVisionSupportModeChange={handleVisionSupportModeChange}
                onFontSizeChange={setFontSize}
                onThemeChange={setTheme}
                visionSupportMode={visionSupportMode}
                fontSize={fontSize}
                theme={theme}
              />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                  <Telescope className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Cosmic Chronicles
                </h1>
                <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-content-secondary mb-4 max-w-3xl mx-auto leading-relaxed">
                Discover the astronomical events, horoscopes, and cosmic games that connect us to the universe
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <Globe className="w-5 h-5" />
                <span className="text-lg">
                  Exploring the cosmos on {formatDateForTitle(selectedDate)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="container mx-auto px-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
            {navigationItems
              .filter(item => !visionSupportMode || ['events', 'timeline'].includes(item.id))
              .map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as ActiveSection)}
                    className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      activeSection === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary'
                    }`}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent className="w-6 h-6" />
                      <span className="text-xs font-medium text-center leading-tight">
                        {item.label}
                      </span>
                    </div>
                    
                    {activeSection === item.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                    
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}></div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Date Selector */}
        {(activeSection === 'events' || activeSection === 'horoscope') && (
          <div className="container mx-auto px-6">
            <DateSelector 
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onCalendarClick={() => setIsCalendarOpen(true)}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-6 pb-12">
          {renderActiveSection()}
        </main>

        {/* Footer */}
        <footer className="relative border-t border-border-primary bg-surface-secondary backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-content-secondary mb-2">
                Explore the cosmos through events, horoscopes, timeline, and interactive experiences
              </p>
              <p className="text-content-tertiary text-sm mb-3">
                Data compiled from NASA, ESA, and astronomical archives worldwide
              </p>
              <p className="text-content-tertiary text-xs">
                We do not own any copyrights for the images used in this website. All images are used for educational purposes only.
              </p>
              {visionSupportMode && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">
                    Vision Support Mode Active - Content will be read automatically. Use Tab to navigate, Spacebar for voice commands (Events page only)
                  </p>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* Voice Recognition */}
      <VoiceRecognition
        isListening={isVoiceListening}
        onStartListening={() => setIsVoiceListening(true)}
        onStopListening={() => setIsVoiceListening(false)}
        onDateRecognized={handleVoiceDateRecognized}
        isEnabled={visionSupportMode && activeSection === 'events'}
      />

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Calendar
        selectedDate={selectedDate}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateChange}
      />

      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}

export default App;
