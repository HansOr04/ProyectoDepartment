import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => (
  <Box 
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff8ec', // Usar el mismo color de fondo que tu Navbar
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ color: '#114C5F' }} /> {/* Color consistente con tu tema */}
    <Typography variant="h6" sx={{ mt: 2, color: '#114C5F' }}>
      Cargando...
    </Typography>
  </Box>
);

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute - user:", user, "loading:", loading);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated, rendering Outlet");
  return <Outlet />;
};

export default ProtectedRoute;