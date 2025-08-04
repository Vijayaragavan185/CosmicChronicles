import React, { useState, useEffect, useRef } from 'react';
import { Settings, Sun, Moon, Plus, Minus, Eye, Volume2 } from 'lucide-react';

interface VisualAssistProps {
  onVisionSupportModeChange: (enabled: boolean) => void;
  onFontSizeChange: (size: number) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  visionSupportMode: boolean;
  fontSize: number;
  theme: 'light' | 'dark';
}

export const VisualAssist: React.FC<VisualAssistProps> = ({
  onVisionSupportModeChange,
  onFontSizeChange,
  onThemeChange,
  visionSupportMode,
  fontSize,
  theme
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    onFontSizeChange(newSize);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVisionSupport = () => {
    const newMode = !visionSupportMode;
    onVisionSupportModeChange(newMode);
    
    if (newMode) {
      speak("Vision Support Mode enabled. The page content will be read aloud automatically.");
    } else {
      speak("Vision Support Mode disabled.");
      window.speechSynthesis.cancel();
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    onThemeChange(newTheme);
    speak(`Switched to ${newTheme} theme`);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Visual Assist Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-surface-primary hover:bg-surface-secondary backdrop-blur-md border border-border-primary rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Open Visual Assist settings"
        title="Visual Assist Settings"
      >
        <Settings className="w-6 h-6 text-content-primary" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface-primary backdrop-blur-xl border border-border-primary rounded-xl p-6 shadow-2xl z-50">
          <h3 className="text-lg font-semibold text-content-primary mb-6 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-400" />
            <span>Visual Assist</span>
          </h3>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div>
              <label className="block text-content-primary text-sm font-medium mb-3">
                Theme Preference
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                      : 'bg-surface-secondary text-content-secondary hover:bg-surface-tertiary'
                  }`}
                  aria-label="Switch to light theme"
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                      : 'bg-surface-secondary text-content-secondary hover:bg-surface-tertiary'
                  }`}
                  aria-label="Switch to dark theme"
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark</span>
                </button>
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div>
              <label className="block text-content-primary text-sm font-medium mb-3">
                Font Size: {fontSize}px
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleFontSizeChange(-2)}
                  className="p-3 bg-surface-secondary hover:bg-surface-tertiary text-content-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease font size"
                  disabled={fontSize <= 12}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 bg-surface-secondary rounded-lg p-3 text-center">
                  <span className="text-content-primary text-sm" style={{ fontSize: `${Math.min(fontSize, 18)}px` }}>
                    Sample Text
                  </span>
                </div>
                <button
                  onClick={() => handleFontSizeChange(2)}
                  className="p-3 bg-surface-secondary hover:bg-surface-tertiary text-content-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase font size"
                  disabled={fontSize >= 24}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between text-xs text-content-tertiary mt-2">
                <span>Min: 12px</span>
                <span>Max: 24px</span>
              </div>
            </div>

            {/* Vision Support Mode */}
            <div>
              <label className="block text-content-primary text-sm font-medium mb-3">
                Vision Support Mode
              </label>
              <button
                onClick={toggleVisionSupport}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                  visionSupportMode
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : 'bg-surface-secondary text-content-secondary hover:bg-surface-tertiary'
                }`}
                aria-label={`${visionSupportMode ? 'Disable' : 'Enable'} Vision Support Mode`}
              >
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">
                      {visionSupportMode ? 'Enabled' : 'Disabled'}
                    </div>
                    <div className="text-xs opacity-70">
                      Auto-read page content
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  visionSupportMode ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 mt-0.5 ${
                    visionSupportMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-surface-secondary rounded-lg p-4">
              <h4 className="text-content-primary font-medium mb-2 text-sm">Keyboard Navigation</h4>
              <div className="space-y-1 text-xs text-content-secondary">
                <div><kbd className="bg-surface-tertiary px-1 rounded">Tab</kbd> - Navigate between sections</div>
                <div><kbd className="bg-surface-tertiary px-1 rounded">Space</kbd> - Voice commands (Events page)</div>
                <div><kbd className="bg-surface-tertiary px-1 rounded">Esc</kbd> - Close panels</div>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <h4 className="text-purple-300 font-medium mb-2 text-sm">Current Settings</h4>
              <div className="space-y-1 text-xs text-content-secondary">
                <div>Theme: <span className="text-content-primary capitalize">{theme}</span></div>
                <div>Font Size: <span className="text-content-primary">{fontSize}px</span></div>
                <div>Vision Support: <span className={visionSupportMode ? 'text-green-400' : 'text-red-400'}>
                  {visionSupportMode ? 'Active' : 'Inactive'}
                </span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};