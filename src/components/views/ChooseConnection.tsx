import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import DateTimePicker from "react-datetime-picker";

const ChooseConnection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

  const cancelTrip = () => {
    navigate("/Dashboard");
  };

  return (
  <BaseContainer headline="Choose Connection">
    <h1>Choose Connection</h1>
  </BaseContainer>

    );
};

export default ChooseConnection;
