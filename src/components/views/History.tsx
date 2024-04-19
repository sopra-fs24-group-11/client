import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Progress } from "../ui/progress";
import LinearIndeterminate from "components/ui/loader";
import "../../styles/views/FriendListPage.scss";
import { Input } from "components/ui/input";

const History = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyTrips, setHistoryTrips] = useState([]);

  // zu fetchTrips umwandeln    
  const fetchHistory = async () => {
    try {
      const userdata = await api.get("/users", {
        headers: { Authorization: token },
      });

      console.log("Halllllo");
      console.log(userdata.data.id);

      const response = await api.get(`/trips/history`, {
        headers: { Authorization: token },
      });

      setHistoryTrips(response.data);
      console.log("History of Trips: ", response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    fetchHistory();
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loader for x seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="friend-list-page">
      <h1>Your Trip History</h1>
      {historyTrips.length > 0 ? (
          <ul className="friend-list">
          {historyTrips.map((trip) => (
              <li key={trip.id} className="friend">
                <span className="name">{trip.tripName}</span>
              </li>
          ))}
          </ul>
      ) : (
          <div className="no-friends-message">
          No trips yet!
          </div>
      )}
    </div>
  );
};

export default History;
