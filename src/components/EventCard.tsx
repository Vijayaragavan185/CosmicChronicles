import React from 'react';
import { Calendar, Clock, Star, Telescope, ExternalLink, ImageIcon } from 'lucide-react';
import { AstronomicalEvent } from '../types/Event';

interface EventCardProps {
  event: AstronomicalEvent;
  onClick: () => void;
  isHighlighted?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, isHighlighted }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'discovery':
        return <Telescope className="w-5 h-5" />;
      case 'mission':
        return <Star className="w-5 h-5" />;
      case 'celestial':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const isAPODEvent = event.id.startsWith('apod-');

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer transform transition-all duration-500 hover:scale-105
        ${isHighlighted ? 'scale-110 ring-2 ring-blue-400 ring-opacity-50' : ''}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`relative backdrop-blur-md border rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 ${
        isAPODEvent 
          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30' 
          : 'bg-white/10 border-white/20'
      }`}>
        {/* Image Section */}
        {event.image && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image overlay badges */}
            <div className="absolute top-4 left-4 flex space-x-2">
              {isAPODEvent && (
                <div className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-blue-100 rounded-full text-xs font-medium">
                  NASA APOD
                </div>
              )}
              <div className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center space-x-1">
                <ImageIcon className="w-3 h-3" />
                <span>Image</span>
              </div>
            </div>
            
            {event.source && (
              <div className="absolute top-4 right-4">
                <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-blue-400 transition-colors" />
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${
                isAPODEvent 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}>
                {getEventIcon(event.type)}
              </div>
              {isAPODEvent && !event.image && (
                <div className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                  NASA APOD
                </div>
              )}
            </div>
            {event.source && !event.image && (
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors mb-2">
            {event.title}
          </h3>
          
          <p className="text-purple-300 text-sm font-medium mb-3">
            {event.year} • {event.date}
          </p>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`
              px-3 py-1 text-xs font-medium rounded-full
              ${event.type === 'discovery' ? 'bg-green-500/20 text-green-300' :
                event.type === 'mission' ? 'bg-blue-500/20 text-blue-300' :
                event.type === 'celestial' ? 'bg-purple-500/20 text-purple-300' :
                'bg-gray-500/20 text-gray-300'}
            `}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            
            <div className="text-white/60 group-hover:text-white/80 transition-colors">
              <span className="text-xs">Click to explore →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};