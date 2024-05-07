import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
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

const Header = ({alertUser}) => {
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
  };

  const goToHistory = () => {
    navigate("/history");
  };

  const goToFeedback = () => {
    navigate("/feedback");
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        localStorage.removeItem("token");
        await api.put("/users/logout", {},{
          headers: { Authorization: token },
        });
        handleClose();
        alertUser("success", "Logout successful.");
      } catch (error) {
        alertUser("error", "Something went wrong.", error)
      }
    }
    navigate("/registernew")
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
        <MenuItem onClick={goToProfile}>Your Profile</MenuItem>
        <MenuItem onClick={goToFriends}>Your Friends</MenuItem>
        <MenuItem onClick={goToHistory}>Trip History</MenuItem>
        <MenuItem onClick={goToFeedback}>Feedback</MenuItem>
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
  alertUser: PropTypes.func,
};

export default Header;
