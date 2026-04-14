import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock toggle theme state (visual only for this frontend demo)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Music', path: '/music' },
    { name: 'Videos', path: '/videos' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Story', path: '/story' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    closeMenu();
    window.scrollTo(0,0);
  }

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled 
          ? 'bg-darkBg/80 backdrop-blur-md border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group" 
            onClick={() => handleNav('/')}
          >
            <span className="font-display text-3xl font-bold tracking-tighter text-white group-hover:text-neonCyan transition-colors duration-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              ANNYSMUSIC
              <span className="text-neonPink text-4xl">.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.path)}
                className={`font-display text-sm font-semibold tracking-wide uppercase hover:text-neonCyan transition-all duration-200 ${
                  location.pathname === link.path ? 'text-neonCyan drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' : 'text-gray-300'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            <button 
              onClick={toggleTheme} 
              className="ml-4 p-2 rounded-full text-gray-300 hover:text-neonPink transition-colors bg-white/5 hover:bg-white/10"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <button 
              onClick={toggleTheme} 
              className="mr-4 p-2 rounded-full text-gray-300 hover:text-neonPink transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none transition-transform active:scale-95"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out transform origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNav(link.path)}
              className={`block w-full text-center px-3 py-3 rounded-md text-lg font-display font-medium tracking-wider ${
                location.pathname === link.path 
                  ? 'text-neonCyan bg-white/5 border border-neonCyan/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};