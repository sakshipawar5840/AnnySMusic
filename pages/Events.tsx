import React from 'react';
import { EventCard } from '../components/EventCard';
import { useData } from '../context/DataContext';

export const Events: React.FC = () => {
  const { events } = useData();
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'past');

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-darkBg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4">
            TOUR DATES
          </h1>
          <p className="text-gray-400 text-lg">
            Join the movement. Experience the energy live.
          </p>
        </div>

        <div className="space-y-6 mb-20">
          <div className="flex items-center mb-8">
             <div className="h-px bg-white/10 flex-grow"></div>
             <span className="px-4 text-neonCyan font-bold tracking-widest uppercase">Upcoming Shows</span>
             <div className="h-px bg-white/10 flex-grow"></div>
          </div>
          
          {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          )) : (
            <p className="text-center text-gray-500">No upcoming events scheduled.</p>
          )}
        </div>

        <div className="space-y-6">
           <div className="flex items-center mb-8">
             <div className="h-px bg-white/10 flex-grow"></div>
             <span className="px-4 text-gray-500 font-bold tracking-widest uppercase">Past Events</span>
             <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};