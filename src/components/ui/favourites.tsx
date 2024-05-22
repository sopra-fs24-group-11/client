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
      alertUser("success", "Removed from favourites.");
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

  const TripContainer = ({ name, id }) => {
    return (
      <div className="favourites-container">
        <label className="trip-label">{name}</label>
        <Button backgroundColor="#FFB703" className="reise-info-button" onClick={() => navigate(`/tripOverview/${id}`)}>Info</Button>
        <StyledRating
          defaultValue={1} 
          max={1}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          onMouseDown={() => handleClick(id)}
        />
      </div>
    );
  };

  TripContainer.propTypes = {
    name: PropTypes.string,
    id: PropTypes.number
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
                <TripContainer name={fav.tripName} id={fav.id}></TripContainer>
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