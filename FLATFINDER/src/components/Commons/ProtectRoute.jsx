// Importaciones necesarias de React y react-router-dom
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Importación del hook personalizado de autenticación
import { useAuth } from '../../contexts/authContext';
// Importaciones de componentes de Material-UI
import { Box, CircularProgress, Typography } from '@mui/material';

// Componente para mostrar un spinner de carga
const LoadingSpinner = () => (
  <Box 
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff8ec', // Usa el mismo color de fondo que la Navbar
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ color: '#114C5F' }} /> {/* Color consistente con el tema */}
    <Typography variant="h6" sx={{ mt: 2, color: '#114C5F' }}>
      Cargando...
    </Typography>
  </Box>
);

// Componente principal ProtectedRoute
const ProtectedRoute = () => {
  // Obtiene el usuario y el estado de carga del contexto de autenticación
  const { user, loading } = useAuth();
  console.log("ProtectedRoute - user:", user, "loading:", loading);

  // Si está cargando, muestra el spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // Si no hay usuario autenticado, redirige a la página de login
  if (!user) {
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, renderiza el componente hijo (Outlet)
  console.log("Usuario autenticado, renderizando Outlet");
  return <Outlet />;
};

export default ProtectedRoute;