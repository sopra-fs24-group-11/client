import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { api } from "helpers/api";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import PropTypes from "prop-types";

const Heart = ({tripId, isFavourite, alertUser}) => {
  const token = localStorage.getItem("token");

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  const handleClick = async () => {
    try {
      await api.put(`/trips/${tripId}/favorites `, {}, {
        headers: { Authorization: token },
      });
      alertUser("success", isFavourite ? "Removed from favourites." : "Added to favourites.");
      // TO DO: Set state! Or fetch again. But right now, the heart does not know what to do...
    } catch (error) {
      alertUser("error", "", error);
    }
  }

  return (
    <StyledRating
      defaultValue={isFavourite ? 1 : 0}
      max={1}
      precision={1}
      icon={<FavoriteIcon fontSize="inherit" />}
      emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      onMouseDown={() => handleClick()}
      onTouchStart={() => handleClick()}
    />
  );
};

Heart.propTypes = {
  tripId: PropTypes.number,
  isFavourite: PropTypes.bool,
  alertUser: PropTypes.func,
};

export default Heart;