import React from 'react'
import Confetti from 'react-confetti'
import PropTypes from "prop-types";

 const ConfettiComponent = ({ width, height, runConfetti }) => {

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={300}
      friction={0.99}
      gravity={0.1}
      initialVelocityX={{ min: -4, max: 4 }}
      initialVelocityY={{ min: -10, max: 0 }}
      colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548']}
      opacity={1.0}
      recycle={false}
      run={runConfetti}
    />
  )
}

export default ConfettiComponent

ConfettiComponent.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    runConfetti: PropTypes.bool
  };