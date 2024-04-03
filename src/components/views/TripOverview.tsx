import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

import "../../styles/views/TripOverview.scss";
import LinearIndeterminate from "components/ui/loader";

// ============== HELPER FUNCTIONS ==============
const mockConnections = [
  {
    name: "You",
    startTime: "12:16",
    expectedArrival: "14:04",
    progress: 80, // This is a percentage of the progress bar.
    transportType: "car", // This could be 'train', 'bus', 'car', etc.
  },
  {
    name: "Ulf Z.",
    startTime: "12:01",
    expectedArrival: "14:08",
    progress: 60,
    transportType: "train",
  },
  {
    name: "Beni W.",
    startTime: "12:34",
    expectedArrival: "14:05",
    progress: 50,
    transportType: "bus",
  },
  {
    name: "Christiane B.",
    startTime: "12:11",
    expectedArrival: "14:10",
    progress: 75,
    transportType: "car",
  },
  {
    name: "Thomas F.",
    startTime: "12:11",
    expectedArrival: "14:10",
    progress: 90,
    transportType: "train",
  },
];

const ConnectionItem = ({ connection }) => {
  return (
    <div className="connection-item">
      <h3 className="connection-name">{connection.name}</h3>
      <p className="text-white">start time: {connection.startTime}</p>
      <span className={`icon ${connection.transportType}`}></span>
      <Progress className="progress-bar" value={connection.progress} />
      <p className="text-white">
        expected arrival: {connection.expectedArrival}
      </p>
    </div>
  );
};
ConnectionItem.propTypes = {
  connection: PropTypes.object.isRequired,
};

// ============== MAIN FUNCTION ==============
const TripOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { tripId } = useParams();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleMissedConnection = () => {
    navigate("/chooseConnection");
  };

  const handleToCustomizeTrip = () => {
    navigate("/customizeTrip");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/connections`);
        setConnections(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    //fetchConnections();
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="main-container">
      <h1 className="main-title">Trip Overview</h1>
      <div className="current-locations-container">
        <h1 className="current-locations-title">
          Current location of trip participants
        </h1>
        <div className="connections-list">
          {mockConnections.map((connection, index) => (
            <ConnectionItem key={index} connection={connection} />
          ))}
        </div>
        <div className="trip-buttons">
          <Button
            className="back-button"
            backgroundColor="#FFB703"
            color="black"
            onClick={handleBackClick}
          >
            Back to Dashboard
          </Button>
          <Button
            className="missed-button"
            backgroundColor="#BCFFE3"
            color="black"
            onClick={handleBackClick}
          >
            I missed a connection
          </Button>
          <Button
            className="leavetrip-button"
            backgroundColor="#FF7070"
            color="black"
            onClick={handleBackClick}
          >
            Leave this trip
          </Button>
        </div>
      </div>

      <div className="admin-container">
        <h2 className="ul_title">Admin Panel</h2>
        <div className="admin-buttons">
          <Button
            className="newadmin-button"
            backgroundColor="#FFB703"
            color="black"
            onClick={handleBackClick}
          >
            Select new Admin
          </Button>
          <Button
            className="managetrip-button"
            backgroundColor="#BCFFE3"
            color="black"
            onClick={handleToCustomizeTrip}
          >
            Manage Trip
          </Button>
          <Button
            className="deletetrip-button"
            backgroundColor="#FF7070"
            color="black"
            onClick={handleBackClick}
          >
            Delete Trip
          </Button>
        </div>
      </div>

      <div className="lists-container">
        <div className="todo-list-container">
          <h2 className="ul_title">To-Do List</h2>
        </div>

        <div className="packing-lists-container">
          <h2 className="ul_title">Group Packing List</h2>
        </div>
      </div>
    </div>
  );
};

export default TripOverview;
