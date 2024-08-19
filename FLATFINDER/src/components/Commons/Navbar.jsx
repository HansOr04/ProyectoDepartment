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
} from "@mui/material";
import { Home, Add, Favorite, Apartment } from "@mui/icons-material";
import { storage } from '../../config/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/authContext';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchAvatar = async () => {
      console.log("Fetching avatar for user:", user);
      setAvatarLoading(true);
      if (user && user.photoURL) {
        console.log("User photoURL:", user.photoURL);
        if (user.photoURL.startsWith('http')) {
          console.log("Setting direct URL as avatar");
          setUserAvatar(user.photoURL);
        } else {
          try {
            console.log("Attempting to get download URL from Firebase Storage");
            const url = await getDownloadURL(ref(storage, user.photoURL));
            console.log("Download URL obtained:", url);
            setUserAvatar(url);
          } catch (error) {
            console.error("Error getting avatar URL:", error);
            setUserAvatar(null);
          }
        }
      } else {
        console.log("No photoURL found, setting avatar to null");
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
      console.error("Error signing out:", error);
    }
    handleMenuClose();
  };

  if (!user) {
    console.log("No user found, not rendering Navbar");
    return null;
  }

  console.log("Rendering Navbar for user:", user.email);

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
          New Flat
        </Button>
        <Button
          color="inherit"
          startIcon={<Favorite />}
          sx={{ marginRight: 2, color: "#114C5F" }}
          onClick={handleFavoriteFlatsClick}
        >
          Favorite Flats
        </Button>
        <Button
          color="inherit"
          startIcon={<Home />}
          sx={{ marginRight: 2, color: "#114C5F" }}
          onClick={handleMyFlatsClick}
        >
          My Flats
        </Button>
        <IconButton
          edge="end"
          sx={{ color: "#114C5F" }}
          onClick={handleAvatarClick}
        >
          {avatarLoading ? (
            <CircularProgress size={40} />
          ) : (
            <Avatar
              alt="User Avatar"
              src={userAvatar || "https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-o-perfil-humano_23-2150671122.jpg"}
            />
          )}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleAllUsersClick}>All Users</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;