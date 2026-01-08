import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Event } from '../types';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(StorageService.getEvents());
  }, []);

  const upcoming = events.filter(e => e.status === 'upcoming');
  const past = events.filter(e => e.status === 'past');

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          Tour Dates
        </h1>

        {/* Upcoming */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider border-l-4 border-cyan-400 pl-4">
            Upcoming Shows
          </h2>
          <div className="grid gap-6">
            {upcoming.length > 0 ? upcoming.map(event => (
              <div key={event.id} className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between hover:border-pink-500/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg text-center min-w-[100px] border border-gray-700 group-hover:border-cyan-400 transition-colors">
                    <span className="block text-2xl font-bold text-white">{new Date(event.date).getDate()}</span>
                    <span className="block text-sm text-pink-500 uppercase font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1"><MapPin size={16} className="text-cyan-400"/> {event.venue}, {event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">No upcoming events scheduled.</p>
            )}
          </div>
        </div>

        {/* Past */}
        <div>
          <h2 className="text-xl font-bold text-gray-500 mb-6 uppercase tracking-wider border-l-4 border-gray-700 pl-4">
            Past Shows
          </h2>
          <div className="grid gap-4 opacity-60">
             {past.map(event => (
              <div key={event.id} className="bg-gray-900/30 border border-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-300">{event.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                </div>
                <span className="text-xs uppercase px-2 py-1 bg-gray-800 rounded text-gray-400">Archived</span>
              </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;