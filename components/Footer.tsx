import React from 'react';
import { Instagram, Youtube, Facebook, Music, CloudLightning } from 'lucide-react';
import { StorageService } from '../services/storage';

const Footer: React.FC = () => {
  const profile = StorageService.getProfile();

  return (
    <footer className="bg-black border-t border-gray-900 py-12 relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-widest uppercase">Follow Me</h2>
        
        <div className="flex justify-center space-x-8 mb-8">
          <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transform hover:scale-110 transition-all duration-300">
            <Instagram size={28} />
          </a>
          <a href={profile.socials.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-300">
            <Youtube size={28} />
          </a>
          <a href={profile.socials.spotify} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transform hover:scale-110 transition-all duration-300">
            <Music size={28} />
          </a>
          <a href={profile.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
            <Facebook size={28} />
          </a>
          <a href={profile.socials.apple} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-100 transform hover:scale-110 transition-all duration-300">
             <CloudLightning size={28} />
          </a>
        </div>

        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} AnnySMusic. All rights reserved.
        </p>
        <p className="text-gray-700 text-xs mt-2">
            Designed for the future.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
