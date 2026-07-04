import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure Axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('/api/auth/profile');
      if (data.success) {
        setUser(data);
      }
    } catch (error) {
      console.error('Session expired or invalid token:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put('/api/auth/profile', profileData);
      if (data.success) {
        // Sync local auth user state
        setUser(prev => ({
          ...prev,
          name: data.name,
          email: data.email,
          role: data.role,
          cart: data.cart,
          wishlist: data.wishlist
        }));
        if (data.token) {
          localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }
        return data;
      }
    } catch (error) {
      throw error.response?.data?.message || 'Profile update failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
