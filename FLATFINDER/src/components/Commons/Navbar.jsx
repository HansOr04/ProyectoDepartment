// Importaciones (se mantienen igual)
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
import NotificationMessages from "../Messages/NotificationMessages";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchAvatar = async () => {
      console.log("Obteniendo avatar para el usuario:", user);
      setAvatarLoading(true);
      if (user && user.imageUid) {
        console.log("URL de la foto del usuario:", user.imageUid);
        if (user.imageUid.startsWith('http')) {
          console.log("Estableciendo URL directa como avatar");
          setUserAvatar(user.imageUid);
        } else {
          try {
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

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    handleMenuClose();
  };

  if (!user) {
    console.log("No se encontró usuario, no se renderiza Navbar");
    return null;
  }

  console.log("Renderizando Navbar para el usuario:", user.email);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff8ec", color: "#114C5F" }}>
      <Toolbar>
        <IconButton
          edge="start"
          sx={{ color: "#114C5F" }}
          aria-label="apartment"
          onClick={handleAppIconClick}
        >
          <Apartment />
        </IconButton>
        <Typography variant="h6" component="h6" sx={{ flexGrow: 1, fontFamily: "" }}>
          <Link to="/" style={{ color: "#114C5F", textDecoration: "none" }} onClick={handleHomeClick}>
            FLATFINDER
          </Link>
        </Typography>
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
        <NotificationMessages />
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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Perfil</MenuItem>
          {user.rol === 'admin' && (
            <MenuItem onClick={handleAllUsersClick}>Todos los Usuarios</MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;