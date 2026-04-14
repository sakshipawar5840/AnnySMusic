import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Music } from './pages/Music';
import { Videos } from './pages/Videos';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Story } from './pages/Story';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useData();
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

import { MusicPlayer } from './components/MusicPlayer';

const AppContent = () => {
  const { isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-darkBg text-white">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-neonCyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold">Loading AnnySMusic...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-darkBg text-white">
      <Navbar />
      <main className="flex-grow pb-24"> {/* Added padding-bottom for player */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/story" element={<Story />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <MusicPlayer />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  );
};

export default App;