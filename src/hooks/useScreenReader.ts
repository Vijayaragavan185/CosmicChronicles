import { useEffect, useRef, useCallback } from 'react';
import { AstronomicalEvent } from '../types/Event';

interface UseScreenReaderProps {
  isEnabled: boolean;
  events: AstronomicalEvent[];
  activeSection: string;
  onNavigationComplete: () => void;
  isLoading: boolean;
}

export const useScreenReader = ({ 
  isEnabled, 
  events, 
  activeSection,
  onNavigationComplete,
  isLoading
}: UseScreenReaderProps) => {
  const currentEventIndex = useRef(0);
  const isReading = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const hasStartedReading = useRef(false);
  const currentSection = useRef(activeSection);
  const isEnabledRef = useRef(isEnabled);

  // Keep track of the current enabled state
  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    // Always check current enabled state before speaking
    if (!isEnabledRef.current || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    if (onEnd) {
      utterance.onend = () => {
        // Check if still enabled before calling onEnd
        if (isEnabledRef.current) {
          onEnd();
        }
      };
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const readEvent = useCallback((event: AstronomicalEvent, index: number) => {
    // Check if Vision Support Mode is still enabled and we're on events section
    if (!isEnabledRef.current || currentSection.current !== 'events') {
      return;
    }

    const eventText = `Event ${index + 1} of ${events.length}. ${event.title}. From ${event.year}. ${event.description}`;
    
    speak(eventText, () => {
      // Double-check if Vision Support Mode is still enabled
      if (!isEnabledRef.current || currentSection.current !== 'events') {
        return;
      }

      // Move to next event after a short pause
      timeoutRef.current = setTimeout(() => {
        // Triple-check before continuing
        if (!isEnabledRef.current || currentSection.current !== 'events') {
          return;
        }

        if (currentEventIndex.current < events.length - 1) {
          currentEventIndex.current++;
          readEvent(events[currentEventIndex.current], currentEventIndex.current);
        } else {
          // All events read
          speak("This date has ended. Page complete.", () => {
            if (isEnabledRef.current && currentSection.current === 'events') {
              hasStartedReading.current = false;
              onNavigationComplete();
            }
          });
        }
      }, 1500);
    });
  }, [events, speak, onNavigationComplete]);

  const readTimeline = useCallback(() => {
    // Check if Vision Support Mode is still enabled and we're on timeline section
    if (!isEnabledRef.current || currentSection.current !== 'timeline') {
      return;
    }

    const timelineText = `Reading cosmic timeline. Starting from the Big Bang, 13.8 billion years ago, the universe began with the origin of space, time, matter, and energy. 
    13.6 billion years ago, the first stars formed, lighting up the early universe. 
    13.2 billion years ago, the first galaxies formed from clusters of stars and gas. 
    4.6 billion years ago, our Sun formed from a molecular cloud. 
    4.5 billion years ago, Earth was born as the third planet from the Sun. 
    4.4 billion years ago, the Moon formed, possibly from a collision with a Mars-sized body. 
    3.5 billion years ago, the earliest life appeared on Earth in ancient oceans. 
    In 1609, Galileo built the first telescope and observed the Moon and Jupiter's moons. 
    In 1687, Newton published Principia, introducing universal gravity. 
    In 1916, Einstein published General Relativity, revolutionizing our understanding of gravity. 
    In 1929, Hubble discovered the universe is expanding. 
    In 1969, Apollo 11 achieved the first human Moon landing. 
    In 1990, the Hubble Space Telescope launched, transforming astronomy. 
    In 2004, Cassini reached Saturn. 
    In 2015, LIGO detected gravitational waves. 
    In 2019, we captured the first image of a black hole. 
    In 2021, the James Webb Space Telescope launched. 
    Timeline complete. The journey through cosmic history continues.`;

    speak(timelineText, () => {
      if (isEnabledRef.current && currentSection.current === 'timeline') {
        hasStartedReading.current = false;
        onNavigationComplete();
      }
    });
  }, [speak, onNavigationComplete]);

  const startReading = useCallback(() => {
    if (!isEnabledRef.current || isReading.current || hasStartedReading.current) return;

    isReading.current = true;
    hasStartedReading.current = true;
    currentEventIndex.current = 0;

    if (activeSection === 'events' && events.length > 0) {
      speak("Starting to read astronomical events for this date.", () => {
        if (isEnabledRef.current && currentSection.current === 'events') {
          readEvent(events[0], 0);
        }
      });
    } else if (activeSection === 'timeline') {
      readTimeline();
    } else if (activeSection === 'events' && events.length === 0) {
      speak("No events found for this date.");
      hasStartedReading.current = false;
    }
  }, [activeSection, events, speak, readEvent, readTimeline]);

  const stopReading = useCallback(() => {
    // Immediately cancel all speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Force stop by calling cancel multiple times for better browser compatibility
      setTimeout(() => window.speechSynthesis.cancel(), 10);
      setTimeout(() => window.speechSynthesis.cancel(), 50);
      setTimeout(() => window.speechSynthesis.cancel(), 100);
    }
    
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    
    // Reset all reading states
    isReading.current = false;
    hasStartedReading.current = false;
    currentEventIndex.current = 0;
  }, []);

  // Update current section reference when activeSection changes
  useEffect(() => {
    // Stop reading when section changes
    if (currentSection.current !== activeSection) {
      stopReading();
    }
    
    currentSection.current = activeSection;
  }, [activeSection, stopReading]);

  // CRITICAL: Stop reading immediately when Vision Support Mode is disabled
  useEffect(() => {
    if (!isEnabled) {
      stopReading();
    }
  }, [isEnabled, stopReading]);

  // Auto-start reading when data loads and Vision Support Mode is enabled
  useEffect(() => {
    if (isEnabled && !isLoading && (activeSection === 'events' || activeSection === 'timeline')) {
      // Reset reading state when section changes or data changes
      hasStartedReading.current = false;
      
      // Start reading after a short delay to ensure content is rendered
      const timer = setTimeout(() => {
        // Double-check that Vision Support Mode is still enabled before starting
        if (isEnabledRef.current) {
          startReading();
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      stopReading();
    }
  }, [isEnabled, isLoading, activeSection, events.length, startReading, stopReading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopReading();
    };
  }, [stopReading]);

  return {
    startReading,
    stopReading,
    isReading: isReading.current
  };
};