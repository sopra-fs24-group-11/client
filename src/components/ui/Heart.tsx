import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { api, handleError } from "helpers/api";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import PropTypes from "prop-types";

const Heart = ({tripId, isFavourite}) => {
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
      const response = await api.put(`/trips/${tripId}/favorites `, {}, {
        headers: { Authorization: token },
      });
      
    } catch (error) {
      handleError(error);
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
  isFavourite: PropTypes.bool
};

export default Heart;