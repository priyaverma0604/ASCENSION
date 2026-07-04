import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/api/auth/profile');
      if (data.success && data.role === 'admin') {
        setUser(data);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Session expired or invalid token:', error.message);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream-light">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="Ascension by Sonali" className="h-12 w-auto object-contain animate-pulse" />
          <p className="text-xs uppercase tracking-widest text-gold font-bold">Loading Admin Space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light">
      {user ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={(userData) => setUser(userData)} />
      )}
    </div>
  );
}

export default App;
