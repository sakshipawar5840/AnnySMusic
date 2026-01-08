import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Photo } from '../types';

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    setPhotos(StorageService.getPhotos());
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <h1 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
        Visuals
      </h1>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-7xl mx-auto space-y-4">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img 
              src={photo.url} 
              alt={photo.caption || "Artist Gallery"} 
              className="w-full h-auto rounded-lg border-2 border-transparent group-hover:border-cyan-400 transition-all duration-300 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm">View Fullscreen</span>
            </div>
          </div>
        ))}
      </div>
      
      {photos.length === 0 && (
         <div className="text-center text-gray-500 py-12">
            Gallery is empty.
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-pink-500 transition-colors"
          >
            <X size={40} />
          </button>
          <img 
            src={selectedPhoto.url} 
            alt="Fullscreen" 
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-[0_0_50px_rgba(236,72,153,0.3)] rounded-sm"
          />
          {selectedPhoto.caption && (
            <p className="absolute bottom-6 left-0 w-full text-center text-gray-300 bg-black/50 py-2">
                {selectedPhoto.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;