import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './landingPage/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import SimulationPage from './pages/SimulationPage';
import AdminPage from './pages/AdminPage';
import Login from './login/Login';
import wsService from './services/websocket';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';

function Navigation() {
  const location = useLocation();
  const token = useStore(state => state.token);
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);

  // Hide Navbar completely on the landing page and login page
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
        <Link to="/dashboard">SmartCity Twin</Link>
      </div>
      <div className="space-x-6 text-sm font-medium flex items-center">
        <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
        <Link to="/complaints" className="hover:text-blue-400 transition">Complaints</Link>
        <Link to="/simulation" className="hover:text-blue-400 transition">Simulation</Link>
        {user?.role === 'ADMIN' && (
           <Link to="/admin" className="text-amber-500 hover:text-amber-400 transition">Admin Panel</Link>
        )}
        
        {token ? (
           <button onClick={() => { logout(); window.location.href = '/login'; }} className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-200 rounded-lg transition ml-4 border border-red-800">
             Logout
           </button>
        ) : (
           <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition ml-4">
             Admin Login
           </Link>
        )}
      </div>
    </nav>
  );
}

function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <Navigation />
      <main className={`flex-1 overflow-x-hidden overflow-y-auto ${location.pathname === '/' ? 'p-0' : 'p-6'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
