import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  isVisionSupportEnabled: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onVoiceCommand: () => void;
  isVoiceListening: boolean;
}

export const useKeyboardNavigation = ({
  isVisionSupportEnabled,
  activeSection,
  onSectionChange,
  onVoiceCommand,
  isVoiceListening
}: UseKeyboardNavigationProps) => {
  
  const speak = useCallback((text: string) => {
    if (!isVisionSupportEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [isVisionSupportEnabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isVisionSupportEnabled) return;

    // Prevent default behavior for our custom keys
    if (event.key === 'Tab' || event.key === ' ') {
      event.preventDefault();
    }

    switch (event.key) {
      case 'Tab':
        // Navigate between Events and Timeline only
        if (activeSection === 'events') {
          onSectionChange('timeline');
          speak("Navigating to Timeline page");
        } else if (activeSection === 'timeline') {
          onSectionChange('events');
          speak("Navigating to Events page");
        }
        break;

      case ' ': // Spacebar
        // Voice commands only work on Events page
        if (activeSection === 'events') {
          if (!isVoiceListening) {
            onVoiceCommand();
          }
        } else {
          speak("Voice commands are only available on the Events page");
        }
        break;

      case 'Escape':
        // Stop any ongoing speech
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        speak("Speech stopped");
        break;
    }
  }, [isVisionSupportEnabled, activeSection, onSectionChange, onVoiceCommand, isVoiceListening, speak]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Announce section changes
  useEffect(() => {
    if (isVisionSupportEnabled) {
      if (activeSection === 'events') {
        speak("Events page loaded. Press Tab to go to Timeline, or Spacebar for voice commands.");
      } else if (activeSection === 'timeline') {
        speak("Timeline page loaded. Press Tab to return to Events.");
      }
    }
  }, [activeSection, isVisionSupportEnabled, speak]);
};