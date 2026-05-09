import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path to your AuthContext

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for Firebase to figure out if the user is logged in
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. If no user is found, send them to login
  if (!currentUser) {
    // We save the 'location' so we can send them back where they were after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If they are logged in, let them through!
  return children;
};

export default ProtectedRoute;