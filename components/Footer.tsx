import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook, Music, CloudLightning, Mic2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { socialLinks } = useData();
  const currentYear = new Date().getFullYear();

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'Twitter': return Twitter;
      case 'Youtube': return Youtube;
      case 'Facebook': return Facebook;
      case 'Spotify': return Music;
      case 'SoundCloud': return CloudLightning;
      case 'AppleMusic': return Mic2;
      default: return Music;
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0 text-center md:text-left">
             <span className="font-display text-2xl font-bold tracking-tighter text-white">
              ANNYSMUSIC
              <span className="text-neonPink">.</span>
            </span>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              Redefining the electronic soundscape with cyberpunk rhythms and neon souls.
            </p>
          </div>

          <div className="flex space-x-6">
            {socialLinks.map((link) => {
              const Icon = getIcon(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neonCyan transform hover:scale-110 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] rounded-full p-2 bg-white/5 border border-white/5 hover:border-neonCyan"
                  title={link.platform}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} AnnySMusic. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};