import React from 'react';
import { Play } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Videos: React.FC = () => {
  const { videos } = useData();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-darkBg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4">
            VISUALS
          </h1>
          <p className="text-neonPink font-mono tracking-widest uppercase">
            Live Sets • Music Videos • BTS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <a 
              key={video.id} 
              href={video.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-cardBg rounded-xl overflow-hidden border border-white/5 hover:border-neonPurple transition-all duration-300 block"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-neonPurple/80 backdrop-blur-sm flex items-center justify-center text-white shadow-[0_0_20px_#bc13fe] transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                    <Play fill="white" size={24} className="ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-neonPurple transition-colors">
                  {video.title}
                </h3>
                <div className="flex justify-between text-sm text-gray-500 font-mono">
                  <span>{video.views} views</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};