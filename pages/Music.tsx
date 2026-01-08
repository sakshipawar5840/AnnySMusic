import React, { useState, useEffect } from 'react';
import { Play, Disc } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Track } from '../types';

const Music: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    setTracks(StorageService.getTracks());
  }, []);

  // Group tracks by album (simple logic)
  const albums = Array.from(new Set(tracks.map(t => t.album)));

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
          Discography
        </h1>

        {/* Albums Display */}
        {albums.map((albumName) => (
          <div key={albumName} className="mb-16">
            <h2 className="text-3xl font-bold text-pink-500 mb-8 border-b border-gray-800 pb-2 flex items-center gap-3">
              <Disc /> {albumName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.filter(t => t.album === albumName).map((track) => (
                <div key={track.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {track.platformLinks.spotify && track.platformLinks.spotify !== '#' && (
                        <a href={track.platformLinks.spotify} target="_blank" rel="noreferrer" className="p-3 bg-green-500 rounded-full hover:scale-110 transition-transform text-white" title="Spotify">
                          <Play fill="currentColor" size={20} />
                        </a>
                      )}
                       {track.platformLinks.youtube && track.platformLinks.youtube !== '#' && (
                        <a href={track.platformLinks.youtube} target="_blank" rel="noreferrer" className="p-3 bg-red-600 rounded-full hover:scale-110 transition-transform text-white" title="YouTube">
                          <Play fill="currentColor" size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{track.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{track.year}</p>
                    
                    {/* Fake Audio Player UI */}
                    <div className="bg-black/50 rounded-lg p-2 flex items-center gap-3 border border-gray-800">
                        <button className="text-cyan-400 hover:text-white">
                            <Play size={20} fill="currentColor" />
                        </button>
                        <div className="h-1 bg-gray-700 flex-1 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 w-1/3"></div>
                        </div>
                        <span className="text-xs text-gray-500">Preview</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {tracks.length === 0 && (
            <div className="text-center text-gray-500 py-12">
                No music tracks added yet. Check back soon!
            </div>
        )}
      </div>
    </div>
  );
};

export default Music;