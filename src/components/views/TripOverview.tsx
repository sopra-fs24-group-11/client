import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

import "../../styles/views/TripOverview.scss";
import LinearIndeterminate from "components/ui/loader";

const TripOverview = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="main-container">
        <h1 className="text-3xl mb-5 font-bold">Trip Overview</h1>
      <div className="current-locations-container">
      <h1 className="text-3xl mb-5 font-bold">XXXXXXXXXXX</h1>
      </div>
    </div>
  );
};

export default TripOverview;
