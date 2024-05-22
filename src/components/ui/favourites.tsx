import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { styled } from "@mui/material/styles";
import { Button } from "components/ui/Button";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../../styles/ui/Favourites.scss";

const Favourites = ({ alertUser, setLoading }) => {

  const [favTrips, setFavTrips] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  const handleClick = async (tripId) => {
    try {
      await api.put(`/trips/${tripId}/favorites `, {}, {
        headers: { Authorization: token },
      });
      alertUser("success", "Aus den Favoriten entfernt.");
    } catch (error) {
      alertUser("error", "", error);
    } finally {
      fetchTrips();
    }
  }

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trips/favorites", {
        headers: { Authorization: token },
      });
      setFavTrips(response.data);

    } catch (error) {
      alertUser("error", "", error);
    }
    setLoading(false);
  }

  const TripContainer = ({ trip }) => {
    return (
      <div className="favourites-container">
        <span className="favourite-date">
          {new Date(trip.meetUpTime).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>
        <span className="favourite-name">{trip.tripName}</span>
        <Button backgroundColor="#FFB703" className="reise-info-button" onClick={() => navigate(`/tripOverview/${trip.id}`)}>Info</Button>
        <StyledRating
          defaultValue={1} 
          max={1}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          onMouseDown={() => handleClick(trip.id)}
        />
      </div>
    );
  };

  TripContainer.propTypes = {
    trip: PropTypes.object,
  };

  useEffect(() => {
    fetchTrips()
  }, []);

  return (
    <div className="component">
      <h2>Deine Lieblingsreisen</h2>
      {favTrips.length > 0 ? (
        <div className="favourites-log-list">
          <ol>
            {favTrips.map((fav) => (
              <li key={fav.id}>
                <TripContainer trip={fav}></TripContainer>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="no-friends-message">
        Noch keine Reise als Favorit ausgewählt.
        </div>
      )}
      <div className ="show-details-button-container">
        <Button onClick={() => navigate("/history")} width="150px" backgroundColor="#FFB703">Letzte Reisen</Button>
      </div>
      
    </div>
    
  );
};

export default Favourites;

Favourites.propTypes = {
  alertUser: PropTypes.func,
  setLoading: PropTypes.func,
}