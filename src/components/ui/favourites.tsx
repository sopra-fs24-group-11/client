import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "helpers/api";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../../styles/ui/Favourites.scss";

const Favourites = ({ alertUser }) => {

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
  }

  const TripContainer = ({ name, id }) => {
    return (
      <div className="favourites-container">
        <label className="trip-label" onClick={() => navigate(`/tripOverview/${id}`)}>{name}</label>
        <StyledRating
          defaultValue={1} 
          max={1}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          onMouseDown={() => handleClick(id)}
          //onTouchStart={() => handleClick(id)}
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
    <div className="favourites-log-list">
      <ol>
        {favTrips.map((fav) => (
          <li key={fav.id}>
            <TripContainer name={fav.tripName} id={fav.id}></TripContainer>
          </li>
        ))}
      </ol>
    </div>
    
  );
};

export default Favourites;

Favourites.propTypes = {
  alertUser: PropTypes.func,
}