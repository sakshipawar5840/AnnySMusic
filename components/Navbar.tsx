import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music, Lock } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Music', path: '/music' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'Contact', path: '/contact' },
  ];

  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled 
      ? 'bg-black/90 backdrop-blur-md border-b border-pink-500/20 py-2' 
      : 'bg-transparent py-4'
  }`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Music className="h-8 w-8 text-cyan-400 animate-pulse" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 tracking-wider group-hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-all">
              AnnySMusic
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium uppercase tracking-widest hover:text-cyan-400 transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" className="text-gray-600 hover:text-pink-500 transition-colors">
              <Lock size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-pink-500/30 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-4 rounded-md text-base font-bold uppercase ${
                location.pathname === link.path ? 'text-pink-500 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="block px-3 py-4 text-gray-500 text-sm">Admin Access</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
