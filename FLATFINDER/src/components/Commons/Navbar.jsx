// Importación de hooks y componentes necesarios de React
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Link,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { Home, Add, Favorite, Apartment } from "@mui/icons-material";
import { storage } from '../../config/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/authContext';
import { allowedEmails } from '../../utils/allowedEmails';
import NotificationMessages from "../Messages/NotificationMessages";

function Navbar() {
  // Estado para manejar el menú del usuario
  const [anchorEl, setAnchorEl] = useState(null);
  // Estado para almacenar la URL del avatar del usuario
  const [userAvatar, setUserAvatar] = useState(null);
  // Estado para controlar si el avatar está cargando
  const [avatarLoading, setAvatarLoading] = useState(true);
  // Hook para la navegación programática
  const navigate = useNavigate();
  // Hook personalizado para el contexto de autenticación
  const { user, logout } = useAuth();

  // Hook de efecto para obtener el avatar del usuario
  useEffect(() => {
    const fetchAvatar = async () => {
      console.log("Obteniendo avatar para el usuario:", user);
      setAvatarLoading(true);
      if (user && user.imageUid) {
        console.log("URL de la foto del usuario:", user.imageUid);
        if (user.imageUid.startsWith('http')) {
          // Si imageUid ya es una URL, usarla directamente
          console.log("Estableciendo URL directa como avatar");
          setUserAvatar(user.imageUid);
        } else {
          try {
            // Si no, intentar obtener la URL de descarga de Firebase Storage
            console.log("Intentando obtener URL de descarga de Firebase Storage");
            const url = await getDownloadURL(ref(storage, user.imageUid));
            console.log("URL de descarga obtenida:", url);
            setUserAvatar(url);
          } catch (error) {
            console.error("Error al obtener la URL del avatar:", error);
            setUserAvatar(null);
          }
        }
      } else {
        console.log("No se encontró photoURL, estableciendo avatar como null");
        setUserAvatar(null);
      }
      setAvatarLoading(false);
    };

    fetchAvatar();
  }, [user]);

  // Manejador para el clic en el avatar (abre el menú)
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Manejador para cerrar el menú
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Manejadores de navegación
  const handleNewFlatClick = () => {
    navigate("/new-flat");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleFavoriteFlatsClick = () => {
    navigate("/favorite-flats");
  };

  const handleMyFlatsClick = () => {
    navigate("/my-flats");
  };

  const handleAppIconClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleAllUsersClick = () => {
    navigate("/all-users");
    handleMenuClose();
  };

  // Manejador de cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    handleMenuClose();
  };

  // Si no hay usuario, no renderizar la barra de navegación
  if (!user) {
    console.log("No se encontró usuario, no se renderiza Navbar");
    return null;
  }

  console.log("Renderizando Navbar para el usuario:", user.email);

  // Renderizar la barra de navegación
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff8ec", color: "#114C5F" }}>
      <Toolbar>
        {/* Icono de la aplicación */}
        <IconButton
          edge="start"
          sx={{ color: "#114C5F" }}
          aria-label="apartment"
          onClick={handleAppIconClick}
        >
          <Apartment />
        </IconButton>
        {/* Título de la aplicación */}
        <Typography variant="h6" component="h6" sx={{ flexGrow: 1, fontFamily: "" }}>
          <Link to="/" style={{ color: "#114C5F", textDecoration: "none" }} onClick={handleHomeClick}>
            FLATFINDER
          </Link>
        </Typography>
        {/* Botones de navegación */}
        <Button
          color="inherit"
          startIcon={<Add />}
          sx={{ marginRight: 2, color: "#114C5F" }}
          onClick={handleNewFlatClick}
        >
          Nuevo Piso
        </Button>
        <Button
          color="inherit"
          startIcon={<Favorite />}
          sx={{ marginRight: 2, color: "#114C5F" }}
          onClick={handleFavoriteFlatsClick}
        >
          Pisos Favoritos
        </Button>
        <Button
          color="inherit"
          startIcon={<Home />}
          sx={{ marginRight: 2, color: "#114C5F" }}
          onClick={handleMyFlatsClick}
        >
          Mis Pisos
        </Button>
        <NotificationMessages></NotificationMessages>
        {/* Saludo al usuario y avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Hola, {user.firstName} {user.lastName}
          </Typography>
          <IconButton
            edge="end"
            sx={{ color: "#114C5F" }}
            onClick={handleAvatarClick}
          >
            {avatarLoading ? (
              <CircularProgress size={40} />
            ) : (
              <Avatar
                alt="Avatar del Usuario"
                src={userAvatar}
              />
            )}
          </IconButton>
        </Box>
        {/* Menú del usuario */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Perfil</MenuItem>
          {allowedEmails.includes(user.email) && (
            <MenuItem onClick={handleAllUsersClick}>Todos los Usuarios</MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;