import React from "react";
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
            <h2 className="not-found-display__content--info">Wir haben schlechte Neuigkeiten</h2>
            <p className="not-found-display__content--text">
              Die Seite die Du suchst ist vermutlich entfernt worden oder zurzeit unerreichbar.
            </p>
            <button className="not-found-btn" onClick={() => navigate("/")}>Zurück zum Dashboard</button>
          </div>
        </div>
      );
}

export default NotFound;