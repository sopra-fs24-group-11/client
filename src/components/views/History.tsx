// For List
import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Progress } from "../ui/progress";
import LinearIndeterminate from "components/ui/loader";
import { Input } from "components/ui/input";
import "../../styles/views/History.scss";
import Heart from "components/ui/Heart"

const History = () => {
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
      console.log(response.data);

    } catch (error) {
      handleError(error);
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
    }, 1500); // Show loader for x seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="history-list-page">
      <h1>Your Trip History</h1>
      {historyTrips.length > 0 ? (
          <ul className="history-list">
          {historyTrips.map((trip) => (
              <li key={trip.id} className="trip">
                <span className="name" onClick={() => showTripOverview(trip.id)}>{trip.tripName}</span>
                <Heart tripId={trip.id} isFavourite={trip.favourite}></Heart>
              </li>
          ))}
          </ul>
      ) : (
          <div className="no-friends-message">
          No trips completed yet!
          </div>
      )}
      <div className="button-container">
        <Button
          backgroundColor="#FFB703"
          color="black"
          onClick={handleBackClick}
          >
          Back to Dashboard
        </Button>
      </div>
      
    </div>
  );
};

export default History;