import React from 'react';
import { MusicPlayerCard } from '../components/MusicPlayerCard';
import { useData } from '../context/DataContext';
import { Disc } from 'lucide-react';

export const Music: React.FC = () => {
  const { tracks } = useData();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-darkBg relative">
       {/* Background accent */}
       <div className="fixed top-1/4 left-0 w-full h-96 bg-neonCyan/5 -skew-y-6 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4 inline-flex items-center gap-4">
            DISCOGRAPHY <Disc className="text-neonPink animate-spin-slow" size={48} />
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A collection of sonic experiments and dancefloor anthems.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-white mb-8 border-l-4 border-neonCyan pl-4">
            Latest Releases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tracks.map((track) => (
              <MusicPlayerCard key={track.id} track={track} />
            ))}
          </div>
        </div>

        {/* Streaming Services Strip */}
        <div className="bg-cardBg/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <span className="text-2xl font-bold text-white">Listen on:</span>
          {['Spotify', 'Apple Music', 'SoundCloud', 'YouTube Music'].map((platform) => (
             <button key={platform} className="text-xl font-display font-bold text-gray-400 hover:text-neonCyan transition-colors">
                {platform}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};