import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute - user:", user, "loading:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated, rendering Outlet");
  return <Outlet />;
};

export default ProtectedRoute;