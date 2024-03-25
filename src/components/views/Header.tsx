import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../graphics/Get-Together.png"; // Importing the image
import "../../styles/views/Header.scss";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
  }

  const handleLogout = async () => {
    // Removed the type declaration to fit standard JS syntax
    // No need to call useNavigate here, use the navigate function directly
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // await api.put("/auth/logout", { token });

        localStorage.removeItem("token");
        handleClose();
        navigate("/login");
      } catch (error) {
        console.error(error);
        handleError(error);
      }
    } else {
      console.error("No token found in local storage.");
    }
  };

  return (
    <div className="header cont">
      <div className="logo">
        <img src={logo} alt="Get-Together" />
      </div>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        className="menu-icon"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
      </Menu>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
