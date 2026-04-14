import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, ListMusic, X, Trash2 } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying, pauseTrack, resumeTrack, nextTrack, prevTrack, playlist, removeFromPlaylist, playTrack } = useData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl || '';
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    }
  }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Playlist Drawer */}
      <div className={`fixed bottom-24 right-4 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-transform duration-300 z-40 transform ${showPlaylist ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`} style={{ maxHeight: '60vh' }}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center">
            <ListMusic size={18} className="mr-2 text-neonCyan" /> Playlist
          </h3>
          <button onClick={() => setShowPlaylist(false)} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-2" style={{ maxHeight: 'calc(60vh - 60px)' }}>
          {playlist.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-sm">
              Playlist is empty. Add tracks!
            </div>
          ) : (
            <ul className="space-y-1">
              {playlist.map((track, index) => (
                <li key={`${track.id}-${index}`} className={`flex items-center justify-between p-2 rounded hover:bg-white/5 group ${currentTrack.id === track.id ? 'bg-white/10' : ''}`}>
                  <div 
                    className="flex items-center flex-grow min-w-0 cursor-pointer"
                    onClick={() => playTrack(track)}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden mr-3 flex-shrink-0">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${currentTrack.id === track.id ? 'text-neonCyan font-bold' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-gray-500 truncate">{track.album}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromPlaylist(track.id); }}
                    className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${isExpanded ? 'h-24' : 'h-12'} bg-black/90 backdrop-blur-md border-t border-white/10 text-white`}>
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 group cursor-pointer">
          <div 
            className="h-full bg-neonCyan relative" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-opacity"></div>
          </div>
          <input 
            type="range" 
            min="0" 
            max={duration || 0} 
            value={currentTime} 
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Track Info */}
          <div className="flex items-center w-1/3 min-w-0">
            {isExpanded && (
              <div className="relative group mr-4 flex-shrink-0">
                 <img 
                   src={currentTrack.coverUrl} 
                   alt={currentTrack.title} 
                   className="w-16 h-16 object-cover rounded shadow-lg animate-spin-slow" 
                   style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                 />
                 <div className="absolute inset-0 bg-black/20 rounded"></div>
              </div>
            )}
            <div className="min-w-0 overflow-hidden">
              <h4 className="font-bold text-white truncate text-sm md:text-base">{currentTrack.title}</h4>
              <p className="text-gray-400 text-xs truncate">{currentTrack.album}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center justify-center w-1/3">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button 
                onClick={isPlaying ? pauseTrack : resumeTrack} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
              </button>
              <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
            </div>
            {isExpanded && (
               <div className="text-xs text-gray-500 mt-1 font-mono hidden md:block">
                 {formatTime(currentTime)} / {formatTime(duration)}
               </div>
            )}
          </div>

          {/* Volume & Expand */}
          <div className="flex items-center justify-end w-1/3 space-x-4">
            <div className="hidden md:flex items-center group">
              <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white mr-2">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-neonPink absolute left-0 top-0" 
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                ></div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={isMuted ? 0 : volume} 
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setShowPlaylist(!showPlaylist)} 
              className={`p-2 rounded-full transition-colors ${showPlaylist ? 'text-neonCyan bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title="Playlist"
            >
              <ListMusic size={18} />
            </button>

            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <audio 
          ref={audioRef} 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={nextTrack}
          onLoadedMetadata={handleTimeUpdate}
        />
      </div>
    </>
  );
};
