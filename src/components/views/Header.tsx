import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../graphics/Get-Together.png";
import logonew from "../../graphics/Get-Together-new.png";
import trainImage from "../../graphics/train2.png";
import signalImage from "../../graphics/signal.png";
import stationImage from "../../graphics/station.png";
import rails from "../../graphics/rails.png";
import "../../styles/views/Header.scss";
import { useWindowSize } from 'react-use';
import ConfettiComponent from "components/ui/Confetti";


const Header = ({ alertUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const { width, height } = useWindowSize();
  const [clickCount, setClickCount] = useState(0);
  
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);

  const handleTrainClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    if (clickCount >= 5) {
      setIsConfettiActive(true);
      setRunConfetti(true);
      setClickCount(0);
      setTimeout(() => {
        setIsConfettiActive(false);
      }, 5000);
    }
  }, [clickCount])

  useEffect(() => {
    if (isConfettiActive) {
      setTimeout(() => {
        setRunConfetti(false);
      }, 3000);
    }
  }, [isConfettiActive]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        localStorage.removeItem("token");
        await api.put(
          "/users/logout",
          {},
          {
            headers: { Authorization: token },
          }
        );
        alertUser("success", "Abmeldung erfolgreich.");
      } catch (error) {
        alertUser("error", "Etwas ging schief.", error);
      }
    }
    handleClose();
    navigate("/registernew");
  };

  return (
    <div className="header cont">
      <div
        className="logo"
        onClick={() => {
          navigate("/dashboard");
          window.location.reload();
        }}
        style={{ cursor: "pointer" }}
      >
        <img src={logonew} alt="Get-Together" />
      </div>
      {localStorage.getItem("token") && <><IconButton
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
        <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
        <MenuItem onClick={() => navigate("/profile")}>Profil</MenuItem>
        <MenuItem onClick={() => navigate("/friends")}>Freunde</MenuItem>
        <MenuItem onClick={() => navigate("/history")}>Vergangene Reisen</MenuItem>
        <MenuItem onClick={() => navigate("/template")}>List Template</MenuItem>
        <MenuItem onClick={() => navigate("/feedback")}>Feedback</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu></>}

      <div className="train-container" >
        <img src={trainImage} alt="Animierter Zug" className="train" onClick={handleTrainClick} />
        {
          // <div className="rails"></div>
        }
      </div>
      {isConfettiActive && <ConfettiComponent width={width} height={height} run={runConfetti} />}
      <img src={signalImage} alt="Signal" className="signal" />
      {
        //<img src={stationImage} alt="Station" className="station" />
      }
    </div>
  );
};

Header.propTypes = {
  alertUser: PropTypes.func,
};

export default Header;
