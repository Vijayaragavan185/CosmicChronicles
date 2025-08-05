import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecognitionProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onDateRecognized: (date: Date) => void;
  isEnabled: boolean;
}

export const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  isListening,
  onStartListening,
  onStopListening,
  onDateRecognized,
  isEnabled
}) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [browserInfo, setBrowserInfo] = useState('');
  const animationRef = useRef<number>();

  useEffect(() => {
    // Detect browser
    const userAgent = navigator.userAgent.toLowerCase();
    const isFirefox = userAgent.includes('firefox');
    const isChrome = userAgent.includes('chrome');
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
    const isEdge = userAgent.includes('edge');

    setBrowserInfo(
      isFirefox ? 'Firefox' :
      isChrome ? 'Chrome' :
      isSafari ? 'Safari' :
      isEdge ? 'Edge' : 'Unknown'
    );

    // Check if speech recognition is supported with better Firefox detection
    const SpeechRecognition = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition || 
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      try {
        const recognitionInstance = new SpeechRecognition();
        
        // Firefox-specific settings
        if (isFirefox) {
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false; // Firefox works better without interim results
        } else {
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = true;
        }
        
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onstart = () => {
          console.log('Voice recognition started on', browserInfo);
        };

        recognitionInstance.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // For Firefox, use any result since interim results are disabled
          const currentTranscript = finalTranscript || interimTranscript;
          setTranscript(currentTranscript);

          if (finalTranscript || (isFirefox && currentTranscript)) {
            processVoiceCommand(finalTranscript || currentTranscript);
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error, 'Browser:', browserInfo);
          
          // Provide user-friendly error messages
          let errorMessage = 'Voice recognition error. ';
          switch (event.error) {
            case 'not-allowed':
              errorMessage += 'Please allow microphone access in your browser settings.';
              break;
            case 'no-speech':
              errorMessage += 'No speech detected. Please try again.';
              break;
            case 'network':
              errorMessage += 'Network error. Please check your internet connection.';
              break;
            case 'service-not-allowed':
              errorMessage += 'Speech service not available. Try refreshing the page.';
              break;
            default:
              errorMessage += `Error: ${event.error}. Please try again.`;
          }
          
          speak(errorMessage);
          onStopListening();
        };

        recognitionInstance.onend = () => {
          console.log('Voice recognition ended');
          onStopListening();
        };

        setRecognition(recognitionInstance);
      } catch (error) {
        console.error('Failed to create speech recognition instance:', error);
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
      console.log('Speech recognition not supported in', browserInfo);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    console.log('Processing voice command:', lowerCommand);
    
    // Enhanced date patterns with more variations
    const datePatterns = [
      // Month + day patterns
      /(?:january|jan)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:february|feb)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:march|mar)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:april|apr)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:may)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:june|jun)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:july|jul)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:august|aug)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:september|sep)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:october|oct)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:november|nov)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      /(?:december|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
      
      // Alternative patterns
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:january|jan)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:february|feb)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:march|mar)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:april|apr)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:may)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:june|jun)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:july|jul)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:august|aug)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:september|sep)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:october|oct)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:november|nov)/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:december|dec)/i
    ];

    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];

    // Try first set of patterns (month first)
    for (let i = 0; i < 12; i++) {
      const match = lowerCommand.match(datePatterns[i]);
      if (match) {
        const day = parseInt(match[1]);
        if (day >= 1 && day <= 31) {
          const date = new Date();
          date.setMonth(i);
          date.setDate(day);
          
          const monthName = months[i];
          speak(`Navigating to ${monthName} ${day}`);
          
          onDateRecognized(date);
          return;
        }
      }
    }

    // Try second set of patterns (day first)
    for (let i = 12; i < datePatterns.length; i++) {
      const match = lowerCommand.match(datePatterns[i]);
      if (match) {
        const day = parseInt(match[1]);
        const monthIndex = i - 12; // Adjust index for second set
        if (day >= 1 && day <= 31) {
          const date = new Date();
          date.setMonth(monthIndex);
          date.setDate(day);
          
          const monthName = months[monthIndex];
          speak(`Navigating to ${monthName} ${day}`);
          
          onDateRecognized(date);
          return;
        }
      }
    }

    // Special commands
    if (lowerCommand.includes('today')) {
      const today = new Date();
      speak('Navigating to today');
      onDateRecognized(today);
      return;
    }

    if (lowerCommand.includes('christmas')) {
      const christmas = new Date();
      christmas.setMonth(11); // December
      christmas.setDate(25);
      speak('Navigating to Christmas Day');
      onDateRecognized(christmas);
      return;
    }

    if (lowerCommand.includes('new year')) {
      const newYear = new Date();
      newYear.setMonth(0); // January
      newYear.setDate(1);
      speak('Navigating to New Year\'s Day');
      onDateRecognized(newYear);
      return;
    }

    // If no date pattern matched, provide helpful feedback
    console.log('No date pattern matched for:', lowerCommand);
    speak("I didn't understand that date. Please try saying a month and day, like 'September 5' or 'December 25'");
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a more compatible voice for Firefox
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a good English voice
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService
        ) || voices[0];
        utterance.voice = englishVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && isSupported && isEnabled) {
      try {
        setTranscript('');
        recognition.start();
        onStartListening();
        
        // Different instructions for different browsers
        const instructions = browserInfo === 'Firefox' 
          ? "Listening for date command. Speak clearly and say a month and day, like 'September 5'"
          : "Listening for date command. Say a month and day, like 'September 5'";
        
        speak(instructions);
      } catch (error) {
        console.error('Error starting recognition:', error);
        speak('Unable to start voice recognition. Please try again.');
        onStopListening();
      }
    } else if (!isSupported) {
      speak(`Voice recognition is not supported in ${browserInfo}. Please try using Chrome or Edge.`);
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    onStopListening();
  };

  // Request microphone permissions on first render
  useEffect(() => {
    if (isSupported && isEnabled) {
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone permission granted');
        })
        .catch((error) => {
          console.warn('Microphone permission denied:', error);
        });
    }
  }, [isSupported, isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {/* Browser compatibility notice */}
      {!isSupported && (
        <div className="mb-4 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4 max-w-md">
          <div className="text-center">
            <div className="text-yellow-300 text-sm mb-2">Voice Recognition Not Available</div>
            <div className="text-yellow-200 text-xs">
              {browserInfo === 'Firefox' 
                ? 'Firefox has limited speech recognition support. Please try Chrome or Edge for the best experience.'
                : `Voice recognition is not supported in ${browserInfo}. Please use Chrome, Edge, or Safari.`
              }
            </div>
          </div>
        </div>
      )}

      {isListening && (
        <div className="mb-4 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-md">
          <div className="text-center">
            <div className="text-white text-sm mb-2">
              Listening... ({browserInfo})
            </div>
            {transcript && (
              <div className="text-blue-300 text-sm italic mb-2">
                "{transcript}"
              </div>
            )}
            <div className="text-gray-400 text-xs">
              Say a date like "September 5" or "December 25"
            </div>
            {browserInfo === 'Firefox' && (
              <div className="text-yellow-300 text-xs mt-1">
                Speak clearly and wait for the microphone to stop
              </div>
            )}
          </div>
        </div>
      )}

      {isSupported && (
        <button
          onClick={isListening ? stopListening : startListening}
          className={`relative p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          }`}
          aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
          title={`Voice Recognition (${browserInfo})`}
        >
          {/* Siri-like animation rings */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
              <div className="absolute inset-2 rounded-full bg-red-300 animate-ping opacity-40 animation-delay-200"></div>
              <div className="absolute inset-4 rounded-full bg-red-200 animate-ping opacity-50 animation-delay-400"></div>
            </>
          )}
          
          {isListening ? (
            <MicOff className="w-6 h-6 text-white relative z-10" />
          ) : (
            <Mic className="w-6 h-6 text-white relative z-10" />
          )}
        </button>
      )}
    </div>
  );
};