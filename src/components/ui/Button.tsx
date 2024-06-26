import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Button.scss";

export const Button = ({
  width,
  height,
  backgroundColor,
  color, 
  style,
  className,
  children,
  ...rest
}) => (
  <button
    {...rest}
    style={{ width, height, backgroundColor, color, ...style }} 
    className={`primary-button ${className}`}
  >
    {children}
  </button>
);

Button.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
};
