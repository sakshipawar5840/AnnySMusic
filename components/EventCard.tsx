import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isPast = event.status === 'past';

  return (
    <div className={`relative flex flex-col md:flex-row items-center bg-cardBg border border-white/5 rounded-2xl p-6 md:p-8 transition-all duration-300 ${isPast ? 'opacity-60 grayscale' : 'hover:border-neonPurple/50 hover:shadow-[0_0_30px_rgba(188,19,254,0.15)]'}`}>
      
      {/* Date Block */}
      <div className="flex-shrink-0 w-full md:w-32 h-32 bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 mb-6 md:mb-0 md:mr-8 group-hover:border-neonPurple/50 transition-colors">
        <span className="text-neonPink font-bold text-xl uppercase tracking-wider">
          {event.date.split(' ')[0]}
        </span>
        <span className="text-white font-display font-black text-4xl my-1">
          {event.date.split(' ')[1].replace(',', '')}
        </span>
        <span className="text-gray-400 text-sm">
          {event.date.split(' ')[2]}
        </span>
      </div>

      {/* Details */}
      <div className="flex-grow text-center md:text-left mb-6 md:mb-0">
        <h3 className="text-2xl font-display font-bold text-white mb-2">{event.title}</h3>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400 text-sm">
          <div className="flex items-center justify-center md:justify-start">
            <MapPin size={16} className="mr-2 text-neonCyan" />
            {event.venue}, {event.location}
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <Clock size={16} className="mr-2 text-neonCyan" />
            {event.time}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        {isPast && (
          <span className="px-6 py-2 border border-gray-700 rounded text-gray-500 font-mono text-sm uppercase">
            Event Ended
          </span>
        )}
      </div>
    </div>
  );
};