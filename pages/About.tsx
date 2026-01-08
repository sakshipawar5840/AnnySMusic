import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { StorageService } from '../services/storage';

const About: React.FC = () => {
  const profile = StorageService.getProfile();

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            About The Artist
          </h1>
          <div className="h-1 w-24 bg-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={profile.aboutImage}
              alt="Anny Profile"
              className="relative rounded-lg shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500 w-full object-cover h-[600px]"
            />
          </div>

          {/* Bio Text */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Star className="text-pink-500" /> Biography
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-pink-500 mb-4 flex items-center gap-2">
                <Trophy className="text-cyan-400" /> Achievements
              </h2>
              <ul className="space-y-3">
                {profile.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full mr-3"></span>
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;