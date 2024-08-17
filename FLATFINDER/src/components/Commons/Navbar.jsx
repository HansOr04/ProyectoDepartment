import React, { useState } from "react";
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
} from "@mui/material";
import { Home, Add, Favorite, Apartment } from "@mui/icons-material";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

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
  };

  const handleAllUsersClick = () => {
    navigate("/all-users");
  };

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
          <Avatar
            alt="User Avatar"
            src="https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-o-perfil-humano_23-2150671122.jpg"
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleAllUsersClick}>All Users</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;