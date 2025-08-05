import React from 'react';
import { X, ExternalLink, Calendar, MapPin, Telescope, Globe, ImageIcon, Download, Copyright } from 'lucide-react';
import { AstronomicalEvent } from '../types/Event';

interface EventModalProps {
  event: AstronomicalEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const isAPODEvent = event.id.startsWith('apod-');

  const handleImageDownload = () => {
    if (event.image) {
      const link = document.createElement('a');
      link.href = event.image;
      link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Fixed Title Bar with proper z-index and no transparency */}
        <div className={`sticky top-0 z-10 p-6 border-b border-white/10 bg-slate-900 backdrop-blur-xl ${
          isAPODEvent 
            ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30' 
            : 'bg-gradient-to-r from-purple-600/30 to-blue-600/30'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                {isAPODEvent && (
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                    NASA APOD
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-purple-300">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}, {event.year}</span>
                </span>
                {event.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </span>
                )}
                {isAPODEvent && (
                  <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>NASA Archive</span>
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70 hover:text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Image Section */}
          {event.image && (
            <div className="mb-8">
              <div className="relative rounded-xl overflow-hidden bg-black/20">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full max-h-96 object-contain"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleImageDownload}
                    className="p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white rounded-lg transition-colors flex items-center space-x-2"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {event.source && (
                    <a
                      href={event.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white rounded-lg transition-colors"
                      title="View original source"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">NASA APOD Image</span>
                  </div>
                </div>
              </div>
              
              {/* Copyright Information */}
              {(event.copyright || event.copyrightHtml) && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Copyright className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-amber-400 font-semibold mb-2">Image Credit & Copyright</h4>
                      {event.copyrightHtml ? (
                        <div 
                          className="text-gray-300 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: event.copyrightHtml }}
                        />
                      ) : (
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {event.copyright}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              {event.description}
            </p>
            
            {event.details && (
              <div className={`rounded-lg p-4 mb-6 ${
                isAPODEvent 
                  ? 'bg-blue-500/10 border border-blue-500/20' 
                  : 'bg-white/5'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Telescope className="w-5 h-5" />
                  <span>Additional Details</span>
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {event.details}
                </p>
              </div>
            )}
            
            {event.significance && (
              <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Historical Significance
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {event.significance}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className={`
                px-4 py-2 text-sm font-medium rounded-full
                ${event.type === 'discovery' ? 'bg-green-500/20 text-green-300' :
                  event.type === 'mission' ? 'bg-blue-500/20 text-blue-300' :
                  event.type === 'celestial' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-gray-500/20 text-gray-300'}
              `}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event
              </span>
              
              {event.source && (
                <a
                  href={event.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>View Original</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            
            {isAPODEvent && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>About NASA APOD:</strong> The Astronomy Picture of the Day is a website provided by NASA and Michigan Technological University. Each day, it features a different image or photograph of our universe, along with a brief explanation written by a professional astronomer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};