import React, { useState } from 'react';
import { Play, Pause, Heart, Share2, Download, ListPlus, Check } from 'lucide-react';
import { Track } from '../types';
import { useData } from '../context/DataContext';

interface MusicPlayerCardProps {
  track: Track;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ track }) => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack, addToPlaylist, playlist } = useData();
  const [isLiked, setIsLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;
  const isInPlaylist = playlist.some(t => t.id === track.id);

  const togglePlay = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    } else {
      playTrack(track);
    }
  };

  const handleAddToPlaylist = () => {
    addToPlaylist(track);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const toggleLike = () => setIsLiked(!isLiked);

  return (
    <div className="group relative bg-cardBg border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-neonCyan/50 hover:shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      
      {/* Cover Image & Overlay */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={track.coverUrl} 
          alt={track.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-neonCyan text-black flex items-center justify-center transform transition-transform duration-300 hover:scale-110 shadow-[0_0_20px_#00f3ff]"
          >
            {isTrackPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1" />}
          </button>
        </div>
        
        {/* Add to Playlist Overlay Button */}
        <button 
          onClick={handleAddToPlaylist}
          disabled={isInPlaylist}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isInPlaylist ? 'bg-neonCyan/20 text-neonCyan' : 'bg-black/50 text-white hover:bg-neonCyan hover:text-black opacity-0 group-hover:opacity-100'}`}
          title={isInPlaylist ? "In Playlist" : "Add to Playlist"}
        >
          {justAdded || isInPlaylist ? <Check size={16} /> : <ListPlus size={16} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={`text-white font-display font-bold text-lg leading-tight transition-colors ${isCurrentTrack ? 'text-neonCyan' : 'group-hover:text-neonCyan'}`}>
              {track.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{track.album} • {track.year}</p>
          </div>
          <button 
            onClick={toggleLike}
            className={`transition-colors duration-300 ${isLiked ? 'text-neonPink' : 'text-gray-500 hover:text-white'}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Progress Bar (Visual Mock for now, could be connected to audio timeupdate) */}
        <div className="w-full h-1 bg-white/10 rounded-full my-4 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-neonCyan to-neonPink transition-all duration-300 ${isTrackPlaying ? 'animate-pulse' : ''}`}
            style={{ width: isTrackPlaying ? '100%' : '0%' }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-mono">{isTrackPlaying ? 'Playing' : '0:00'}</span>
          <div className="flex space-x-3">
             <button className="hover:text-neonCyan transition-colors">
                <Share2 size={18} />
             </button>
             {track.audioUrl && (
               <a href={track.audioUrl} download className="hover:text-neonCyan transition-colors" target="_blank" rel="noreferrer">
                  <Download size={18} />
               </a>
             )}
          </div>
          <span className="text-xs font-mono">{track.duration}</span>
        </div>
      </div>
    </div>
  );
};