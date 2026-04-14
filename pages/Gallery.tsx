import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Gallery: React.FC = () => {
  const { gallery } = useData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-darkBg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4">
            VISUAL DIARY
          </h1>
          <p className="text-neonCyan font-mono tracking-widest uppercase">
            Moments captured in time
          </p>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No images available in the gallery yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((img) => (
              <div 
                key={img.id} 
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-900 cursor-pointer border border-white/5 hover:border-neonCyan/50 transition-all duration-300"
                onClick={() => setSelectedImage(img.imageUrl)}
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <ZoomIn className="text-neonCyan mb-2" size={32} />
                  <span className="text-white font-bold font-display tracking-wide text-center">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-neonPink transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain rounded shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}
    </div>
  );
};