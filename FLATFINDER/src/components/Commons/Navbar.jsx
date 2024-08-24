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
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Home, Add, Favorite, Apartment, Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { storage } from '../../config/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/authContext';
import NotificationMessages from "../Messages/NotificationMessages";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchAvatar = async () => {
      setAvatarLoading(true);
      if (user && user.imageUid) {
        if (user.imageUid.startsWith('http')) {
          setUserAvatar(user.imageUid);
        } else {
          try {
            const url = await getDownloadURL(ref(storage, user.imageUid));
            setUserAvatar(url);
          } catch (error) {
            console.error("Error al obtener la URL del avatar:", error);
            setUserAvatar(null);
          }
        }
      } else {
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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    handleMenuClose();
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    { text: 'Nuevo Piso', icon: <Add />, onClick: () => handleNavigation("/new-flat") },
    { text: 'Pisos Favoritos', icon: <Favorite />, onClick: () => handleNavigation("/favorite-flats") },
    { text: 'Mis Pisos', icon: <Home />, onClick: () => handleNavigation("/my-flats") },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff8ec", color: "#114C5F" }}>
      <Toolbar>
        <IconButton
          edge="start"
          sx={{ color: "#114C5F", marginRight: 2 }}
          aria-label="apartment"
          onClick={() => handleNavigation("/")}
        >
          <Apartment />
        </IconButton>
        <Typography variant="h6" component="h6" sx={{ flexGrow: 1, fontFamily: "" }}>
          <Link to="/" style={{ color: "#114C5F", textDecoration: "none" }} onClick={() => handleNavigation("/")}>
            FLATFINDER
          </Link>
        </Typography>
        
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                color="inherit"
                startIcon={item.icon}
                sx={{ marginRight: 2, color: "#114C5F" }}
                onClick={item.onClick}
              >
                {item.text}
              </Button>
            ))}
          </>
        )}

        <NotificationMessages />
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
          {!isMobile && (
            <Typography variant="body2" sx={{ marginRight: 1 }}>
              Hola, {user.firstName}
            </Typography>
          )}
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
          <MenuItem onClick={() => { handleNavigation("/profile"); handleMenuClose(); }}>Perfil</MenuItem>
          {user.rol === 'admin' && (
            <MenuItem onClick={() => { handleNavigation("/all-users"); handleMenuClose(); }}>Todos los Usuarios</MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;