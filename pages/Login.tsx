import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { StorageService } from '../services/storage';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await StorageService.login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage content</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;