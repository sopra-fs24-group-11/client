import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../graphics/Get-Together.png"; // Importing the image
import trainImage from "../../graphics/train2.png";
import signalImage from "../../graphics/signal.png";
import rails from "../../graphics/rails.png";
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

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToFriends = () => {
    navigate("/friends");
  }

  const handleLogout = async () => {

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
      <div
        className="logo"
        onClick={goToDashboard}
        style={{ cursor: "pointer" }}
      >
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
        <MenuItem onClick={goToDashboard}>Dashboard</MenuItem>
        <MenuItem onClick={goToProfile}>Profile</MenuItem>
        <MenuItem onClick={goToFriends}>Your Friends</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <div className="train-container">
        <img src={trainImage} alt="Animated Train" className="train" />
        <div className="rails"></div>
      </div>
      <img src={signalImage} alt="Signal" className="signal" />
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
