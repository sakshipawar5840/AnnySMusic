import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, ArrowRight, Music, Calendar } from 'lucide-react';
import { NeonButton } from '../components/NeonButton';
import { useData } from '../context/DataContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { gallery, heroSlides } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        {heroSlides.length > 0 ? (
          heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={slide.imageUrl} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/60 to-transparent" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-darkBg flex items-center justify-center">
             <div className="text-gray-500">No hero images set. Go to Admin Panel.</div>
          </div>
        )}

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-neonCyan shadow-[0_0_10px_#00f3ff]' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h2 className="text-neonPink font-display font-bold tracking-[0.2em] mb-4 animate-pulse-slow uppercase text-sm md:text-base">
            Electronic Dance Music Artist
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] break-words">
            ANNYSMUSIC
          </h1>
          <p className="text-gray-300 text-lg md:text-2xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the sonic revolution. Immersion in bass, neon, and infinite rhythms.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <NeonButton onClick={() => navigate('/music')}>
              Listen Now <PlayCircle className="inline-block ml-2 -mt-1" size={20} />
            </NeonButton>
            <NeonButton variant="outline" onClick={() => navigate('/events')}>
              Upcoming Shows <ArrowRight className="inline-block ml-2 -mt-1" size={20} />
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-darkBg relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonPurple/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonCyan/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-cardBg border border-white/5 p-8 rounded-2xl hover:border-neonPink/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/music')}>
              <div className="w-14 h-14 bg-neonPink/20 rounded-xl flex items-center justify-center mb-6 text-neonPink group-hover:scale-110 transition-transform">
                <Music size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">Latest Tracks</h3>
              <p className="text-gray-400 mb-6">Explore the newest albums and singles featuring the hit "Neon Nights".</p>
              <span className="text-neonPink font-bold uppercase text-sm tracking-wider flex items-center group-hover:translate-x-2 transition-transform">
                Stream Now <ArrowRight size={16} className="ml-2" />
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-cardBg border border-white/5 p-8 rounded-2xl hover:border-neonCyan/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/events')}>
               <div className="w-14 h-14 bg-neonCyan/20 rounded-xl flex items-center justify-center mb-6 text-neonCyan group-hover:scale-110 transition-transform">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">Tour Dates</h3>
              <p className="text-gray-400 mb-6">Catch AnnySMusic live at festivals and clubs around the world. Don't miss out.</p>
              <span className="text-neonCyan font-bold uppercase text-sm tracking-wider flex items-center group-hover:translate-x-2 transition-transform">
                View Schedule <ArrowRight size={16} className="ml-2" />
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-cardBg border border-white/5 p-8 rounded-2xl hover:border-neonPurple/50 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/contact')}>
               <div className="w-14 h-14 bg-neonPurple/20 rounded-xl flex items-center justify-center mb-6 text-neonPurple group-hover:scale-110 transition-transform">
                <PlayCircle size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">Bookings</h3>
              <p className="text-gray-400 mb-6">Want AnnySMusic at your event? Send a booking inquiry for availability.</p>
              <span className="text-neonPurple font-bold uppercase text-sm tracking-wider flex items-center group-hover:translate-x-2 transition-transform">
                Contact Management <ArrowRight size={16} className="ml-2" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Teaser Section */}
      <section className="py-20 bg-black/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-2">GALLERY</h2>
            <div className="w-20 h-1 bg-neonCyan mx-auto rounded-full mb-6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {gallery.slice(0, 4).map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-900">
                <img 
                  src={img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-bold font-display tracking-wide">{img.title}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <NeonButton variant="outline" onClick={() => navigate('/gallery')}>
              View Full Gallery
            </NeonButton>
          </div>
        </div>
      </section>
    </div>
  );
};