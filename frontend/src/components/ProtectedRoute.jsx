import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Compass } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Compass className="w-10 h-10 text-gold animate-spin" />
          <span className="font-serif text-sm tracking-widest text-sage uppercase animate-pulse">
            Connecting...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
