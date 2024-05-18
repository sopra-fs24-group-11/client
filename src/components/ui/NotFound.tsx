import React, { useState } from "react";
import PropTypes from "prop-types";
import ScareCrow from "../../graphics/Scarecrow.png"
import "styles/ui/NotFound.scss"
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
    return (
        <div className="not-found-display">
          <div className="not-found-display__img">
            <img src={ScareCrow} alt="404-Scarecrow" />
          </div>
          <div className="not-found-display__content">
            <h2 className="not-found-display__content--info">I have bad news for you</h2>
            <p className="not-found-display__content--text">
              The page you are looking for might be removed or is temporarily
              unavailable
            </p>
            <button className="not-found-btn" onClick={() => navigate("/")}>Back to homepage</button>
          </div>
        </div>
      );
}

export default NotFound;