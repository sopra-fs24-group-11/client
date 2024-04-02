import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import DateTimePicker from "react-datetime-picker";
import "styles/views/Connections.scss";

const ChooseConnection = () => {
  const navigate = useNavigate();
  const [tripDescription, setTripDescription] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      /*const tripId =
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ];

      const token = localStorage.getItem("token");
      const response = await api.get("/trips/" + tripId, {
        headers: { Authorization: token },
      });

      */
    };
    fetchData();
  }, []);

  const cancelTrip = () => {
    navigate("/createTrip");
  };

  return (
    <BaseContainer>
      <div className="connection container">
        <div className="connection outer-form">
          <h1 className="text-3xl mb-5 font-bold"> Choose Connection</h1>
          <div className="connection inner-form">
            <h2 className="text-2xl mb-5">Starting Location:</h2>
            <textarea
              id="startLocation"
              className="connection input"
              placeholder="Select starting location..."
              onChange={(e) => setTripDescription(e.target.value)}
            ></textarea>
            <textarea
              className="connection input"
              placeholder=""
              onChange={(e) => setTripDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default ChooseConnection;
