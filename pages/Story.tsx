import React from 'react';
import { useData } from '../context/DataContext';
import { Award, Mic, Headphones, Star, Disc } from 'lucide-react';

export const Story: React.FC = () => {
  const { storyContent, achievements } = useData();

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'award': return Award;
      case 'disc': return Disc;
      case 'star': return Star;
      case 'headphones': return Headphones;
      default: return Award;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-darkBg text-white">
      {/* Bio Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neonCyan to-neonPink rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={storyContent.imageUrl} 
              alt="Anny Portrait" 
              className="relative rounded-2xl w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-6">
              THE <span className="text-neonPink">STORY</span>
            </h1>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>{storyContent.bioParagraph1}</p>
              <p>{storyContent.bioParagraph2}</p>
              <p>{storyContent.bioParagraph3}</p>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center p-4 border border-white/10 rounded-xl bg-white/5">
                <Headphones className="mx-auto text-neonCyan mb-2" size={24} />
                <div className="font-bold text-2xl text-white">{storyContent.statsShows}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Live Shows</div>
              </div>
              <div className="text-center p-4 border border-white/10 rounded-xl bg-white/5">
                <Award className="mx-auto text-neonPurple mb-2" size={24} />
                <div className="font-bold text-2xl text-white">{storyContent.statsAwards}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Awards</div>
              </div>
              <div className="text-center p-4 border border-white/10 rounded-xl bg-white/5">
                <Mic className="mx-auto text-neonPink mb-2" size={24} />
                <div className="font-bold text-2xl text-white">{storyContent.statsReleases}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Releases</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="bg-cardBg py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-display font-bold mb-12 text-center">Achievements</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {achievements.map((item) => {
               const Icon = getIcon(item.icon);
               return (
                 <div key={item.id} className="bg-darkBg p-6 rounded-xl border border-white/5 hover:border-neonCyan transition-all duration-300">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl font-black text-white/10">{item.year}</span>
                      <Icon className="text-neonCyan" size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                   <p className="text-gray-400">{item.description}</p>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};