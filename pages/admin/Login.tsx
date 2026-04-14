import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { NeonButton } from '../../components/NeonButton';
import { Lock, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAdmin } = useData();
  const navigate = useNavigate();

  // If already logged in, redirect immediately to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-darkBg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-cardBg border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-10"
            title="Back to Home"
        >
            <ArrowLeft size={24} />
        </button>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neonCyan to-neonPink"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-neonPink">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-2">Secure Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <NeonButton type="submit" className="w-full justify-center">
            Login
          </NeonButton>
        </form>
      </div>
    </div>
  );
};