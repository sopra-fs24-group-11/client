import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../../styles/ui/Favourites.scss";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const TripContainer = ({ id }) => {
  return (
    <div className="test">
      <label>Trip {id}</label>
      <StyledRating
        //name="customized-color" // braucht es womöglich nicht
        defaultValue={1} // Herzen sollen ausgefüllt sein
        max={1}
        precision={1}
        // sorgt dafür dass die Form Herz ist
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
    </div>
  );
};

TripContainer.propTypes = {
  id: PropTypes.number,
};

const Favourites = () => {

  // hier alle favourites fetchen
  const trips = ["Trip 1", "Trip 2", "Trip 3"];
  return (
    <ul>
      {trips.map((trip, index) => (
        <li className="test" key={index}>
          <TripContainer id={index}></TripContainer>
        </li>
      ))}
    </ul>
  );
};

export default Favourites;
