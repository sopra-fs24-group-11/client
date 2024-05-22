import React from "react"
import Confetti from "react-confetti"
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