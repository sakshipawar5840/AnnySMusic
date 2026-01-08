import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Mail, MapPin, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage';
import { ArtistProfile, INITIAL_PROFILE, Event } from '../types';

const Home: React.FC = () => {
  const [profile, setProfile] = useState<ArtistProfile>(INITIAL_PROFILE);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    setProfile(StorageService.getProfile());
    const allEvents = StorageService.getEvents();
    // Filter upcoming, sort by date ascending, take top 3
    const nextEvents = allEvents
      .filter(e => e.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    setUpcomingEvents(nextEvents);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={profile.heroImage} 
            alt="AnnySMusic Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-fade-in-up">
            {profile.name.toUpperCase()}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-widest uppercase">
            {profile.tagline}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link to="/music" className="group relative px-8 py-3 bg-transparent border border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider overflow-hidden hover:text-black transition-colors duration-300">
              <span className="absolute inset-0 w-full h-full bg-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out -z-10"></span>
              <span className="flex items-center gap-2"><Play size={18} /> Listen Now</span>
            </Link>

            <Link to="/contact" className="group relative px-8 py-3 bg-transparent border border-pink-500 text-pink-500 font-bold uppercase tracking-wider overflow-hidden hover:text-white transition-colors duration-300">
               <span className="absolute inset-0 w-full h-full bg-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out -z-10"></span>
               <span className="flex items-center gap-2"><Mail size={18} /> Book Me</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="py-20 bg-neutral-900 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"><span className="text-pink-500">Upcoming</span> Events</h2>
                <div className="h-1 w-24 bg-cyan-500 mx-auto rounded-full"></div>
            </div>

            {upcomingEvents.length > 0 ? (
                <div className="grid gap-6">
                    {upcomingEvents.map((event) => (
                        <div key={event.id} className="bg-gray-800/50 border border-gray-700 hover:border-cyan-400/50 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between transition-all duration-300 group hover:bg-gray-800">
                            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                                <div className="bg-black/50 p-4 rounded-lg text-center min-w-[100px] border border-gray-700 group-hover:border-pink-500 transition-colors">
                                    <span className="block text-3xl font-bold text-white">{new Date(event.date).getDate()}</span>
                                    <span className="block text-sm text-pink-500 uppercase font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                    <div className="flex flex-col sm:flex-row gap-4 text-gray-400 text-sm justify-center md:justify-start">
                                        <span className="flex items-center gap-1"><MapPin size={16} className="text-cyan-400"/> {event.venue}, {event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-8 text-center">
                        <Link to="/events" className="inline-flex items-center gap-2 text-cyan-400 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold group">
                            View Full Tour Dates <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                    <p className="text-xl text-gray-500 mb-4">No upcoming events announced yet.</p>
                    <Link to="/contact" className="text-pink-500 hover:text-pink-400 underline">Contact for bookings</Link>
                </div>
            )}
          </div>
      </section>
    </div>
  );
};

export default Home;