import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Si no hay usuario autenticado, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay un usuario autenticado, renderiza el child route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;