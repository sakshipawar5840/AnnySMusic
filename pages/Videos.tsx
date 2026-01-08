import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Video } from '../types';

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    setVideos(StorageService.getVideos());
  }, []);

  // Extract ID for Embedding
  const getEmbedUrl = (idOrUrl: string) => {
    if (!idOrUrl) return '';
    const cleanId = idOrUrl.trim();
    // Regex for standard YouTube URLs to extract ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanId.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : cleanId;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  };

  // Construct Link for "Watch on YouTube" button
  const getYoutubeLink = (idOrUrl: string) => {
     if (!idOrUrl) return '#';
     const cleanId = idOrUrl.trim();
     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
     const match = cleanId.match(regExp);
     const id = (match && match[2].length === 11) ? match[2] : cleanId;
     return `https://www.youtube.com/watch?v=${id}`;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          Videos
        </h1>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-300 flex flex-col">
                <div className="relative pb-[56.25%] h-0 bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={getEmbedUrl(video.youtubeId)}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="text-xl font-bold text-white leading-tight">{video.title}</h3>
                  <div className="mt-auto pt-2">
                      <a 
                        href={getYoutubeLink(video.youtubeId)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-pink-500 transition-colors border border-gray-700 hover:border-pink-500 px-4 py-2 rounded-full"
                      >
                        <ExternalLink size={16} /> Watch on YouTube
                      </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
             <div className="text-center text-gray-500 py-12">
                No videos available at the moment.
            </div>
        )}
      </div>
    </div>
  );
};

export default Videos;