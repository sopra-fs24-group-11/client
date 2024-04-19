import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const LoginGuard = () => {
  if (!localStorage.getItem("token")) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
