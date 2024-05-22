// For List
import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/History.scss";
import Heart from "components/ui/Heart";
import PropTypes from "prop-types";
import { ScaleLoader } from "react-spinners";

// Das ist ein Test

const History = ({ alertUser }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [historyTrips, setHistoryTrips] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/trips/history", {
        headers: { Authorization: token },
      });
      setHistoryTrips(response.data);
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const showTripOverview = (id) => {
    navigate(`/tripOverview/${id}`);
  };

  useEffect(() => {
    fetchHistory();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader
          color="hsla(227, 0%, 100%, 1)"
          height={50}
          margin={4}
          radius={40}
          width={8}
        />
      </div>
    );
  }

  return (
    <div className="history-list-page">
      <h1>Vergangene Reisen</h1>
      {historyTrips.length > 0 ? (
        <ul className="history-list">
          {historyTrips.map((trip) => (
            <li key={trip.id} className="trip" >
              <span className="history-date">
                {new Date(trip.meetUpTime).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
              <span className="history-name">
                {trip.tripName}
              </span>
              <Button backgroundColor="#FFB703" className="reise-info-button" onClick={() => showTripOverview(trip.id)}>Info</Button>
              <Heart
                tripId={trip.id}
                isFavourite={trip.favourite}
                alertUser={alertUser}
              ></Heart>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-friends-message">Noch keine vergangenen Reisen!</div>
      )}
      <div className="button-container">
        <Button
          backgroundColor="#FFB703"
          color="black"
          onClick={handleBackClick}
        >
          Zurück zum Dashboard
        </Button>
      </div>
    </div>
  );
};

export default History;

History.propTypes = {
  alertUser: PropTypes.func,
};
