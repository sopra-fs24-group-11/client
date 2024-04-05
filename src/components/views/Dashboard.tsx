import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

import "../../styles/views/Dashboard.scss";
import LinearIndeterminate from "components/ui/loader";

// Components
const FriendList = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await api.get("/users/friends/requests", {
          headers: { Authorization: token },
        });
        setFriendRequests(response.data); // Assuming this is an array of friend requests
        console.log("FRIEND REQUESTS INFO:", response.data);
      } catch (error) {
        handleError(error);
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await api.get("/users/friends", {
          headers: { Authorization: token },
        });
        console.log("FRIENDS: ", response.data);
        setFriendList(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchFriends();
    fetchFriendRequests();
  }, []);

  const handleAcceptFriendRequest = async (friendRequestId) => {
    try {
      await api.put(
        `/users/friends/${friendRequestId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  };

  // Function to determine the status class
  const getStatusClass = (status) => {
    return status.toLowerCase() === "online"
      ? "status online"
      : "status offline";
  };

  const handleShowDetails = () => {
    navigate("/friends");
  };

  return (
    <div className="friends component">
      <h2>Friend list</h2>
      {friendList.length > 0 ? (
        <ul className="friend-list">
          {friendList.map((friend, index) => (
            <li key={index} className="friend">
              <span className="name">{friend.username}</span>
              <span className={getStatusClass(friend.status)}>
                {friend.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-friends-message">
          No friends yet. Click on show details to invite some friends!
        </div>
      )}

      <div className="requests">
        <h2>New friend requests</h2>
        {friendRequests.length > 0 ? (
          <div className="request-list">
            {friendRequests.map((request, index) => (
              <div key={index} className="request">
                <span className="name">{request.username}</span>
                <Button
                  className="accept-button"
                  width="80px"
                  height="35px"
                  backgroundColor="#82FF6D"
                  onClick={() => handleAcceptFriendRequest(request.friendId)}
                >
                  Accept
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-requests-message">No new requests.</div>
        )}

        <div className="show-details-button-container">
          <Button
            onClick={handleShowDetails}
            width="150px"
            backgroundColor="#FFB703"
          >
            Show Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const WelcomeMessage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTrips, setCurrentTrips] = useState([]);

  const handleCreateTrip = () => {
    navigate("/createTrip");
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        const userdata = await api.get("/users", {
          headers: { Authorization: token },
        });
        const user: User = userdata.data;
        console.log("CURRENT USER DATA:", user);
        setCurrentUser(user);
      } catch (error) {
        handleError(error);
      }
    };

    const fetchCurrentTrips = async () => {
      try {
        const response = await api.get("/trips/current", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log("FETCHING CURRENT TRIPS:", response.data);
        setCurrentTrips(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchCurrentTrips();
    fetchUsername();
  }, []);

  return (
    <div className="welcome component">
      <h1 className="welcome-title">
        Welcome back, {currentUser ? currentUser.username : "loading..."}!
      </h1>
      <p className="font-bold text-lg ">Your progress</p>
      <div className="mb-8">
        <Progress
          style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.6)" }}
          value={currentUser ? (currentUser.level % 1) * 100 : 0}
        />
        <p className="mt-2">
          Level: {currentUser ? Math.floor(currentUser.level) : "loading..."},
          gain{" "}
          {currentUser ? Math.round((1 - (currentUser.level % 1)) * 100) : 0}{" "}
          points for the next level.
        </p>
      </div>

      <div className="current-trips component">
        <h2>Current Trips</h2>
        <div className="trip-container">
          {currentTrips.length > 0 ? (
            currentTrips.map((trip, index) => (
              <div
                key={index}
                className="trip-info"
                onClick={() => navigate(`/tripOverview/${trip.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div>{`"${trip.tripName}" to "${trip.meetUpPlace.stationName}"`}</div>
                <Button
                  width="80px"
                  height="35px"
                  backgroundColor="#FFB703"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the navigation from firing when the Info button is clicked
                    navigate(`/trip/${trip.id}`);
                  }}
                >
                  Info
                </Button>
              </div>
            ))
          ) : (
            <div className="no-trips-message">
              No current trips. Create one or let your friends invite you!
            </div>
          )}
        </div>
      </div>

      <div className="create-button-container">
        <Button
          width="150px"
          backgroundColor="#FB8500"
          onClick={handleCreateTrip}
        >
          CREATE TRIP
        </Button>
      </div>
    </div>
  );
};

const NotificationsLog: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/users/notifications", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        // Sort notifications by timeStamp in ascending order
        const sortedNotifications = response.data.sort(
          (a, b) =>
            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
        );
        console.log("NOTIFICATIONS:", sortedNotifications);
        setNotifications(sortedNotifications);
      } catch (error) {
        handleError(error);
      }
    };

    fetchNotifications();
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="notifications-log component">
      <h2>Notifications</h2>
      <div className="notifications-log-list">
        <ol>
          {notifications.map((notification, index) => (
            <li key={index}>
              {formatDateTime(notification.timeStamp)} - {notification.message}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const TripInvitations = () => {
  const [tripInvitations, setTripInvitations] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripInvitations = async () => {
      try {
        const response = await api.get("/trips/invitations", {
          headers: { Authorization: token },
        });
        setTripInvitations(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchTripInvitations();
  }, []);

  const handleAcceptInvitation = async (tripId) => {
    try {
      await api.put(
        `/trips/${tripId}/invitation`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      setTripInvitations(
        tripInvitations.filter((invitation) => invitation.id !== tripId)
      );
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="trip-invitations component">
      <h2>Trip Invitations</h2>
      <div className="trip-invitation-list">
        {tripInvitations.length > 0 ? (
          tripInvitations.map((invitation) => (
            <div key={invitation.id} className="trip-invitation">
              <div>Invitation to &quot;{invitation.tripName}&quot;</div>
              <Button
                className="accept-button"
                width="80px"
                height="35px"
                backgroundColor="#82FF6D"
                onClick={() => handleAcceptInvitation(invitation.id)}
              >
                Accept
              </Button>
            </div>
          ))
        ) : (
          <div className="no-current-trip-invitations">
            No current trip invitations: create one or let your friends invite
            you!
          </div>
        )}
      </div>
    </div>
  );
};

const YourFavorites: React.FC = () => {
  return (
    <div className="your-favorites component">
      <h2>Your Favourites</h2>
      <ol>
        <li>Binzmühlestrasse</li>
        <li>Universität Zürich</li>
      </ol>
    </div>
  );
};

const FriendLeaderboard: React.FC = () => {
  // This component will render the friend leaderboard
  return (
    <div className="friend-leaderboard component">
      <h2>Friend Leaderboard</h2>
      {/* Placeholder content */}
      <ol>
        <li>Michael B.</li>
        <li>Ulf Z.</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
        <li>Michael Banane</li>
      </ol>
    </div>
  );
};

// Main Dashboard component
const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="dashboard">
      <div className="column left">
        <FriendList />
        <FriendLeaderboard />
      </div>
      <div className="column middle">
        <WelcomeMessage />
        <TripInvitations />
      </div>
      <div className="column right">
        <NotificationsLog />
        <YourFavorites />
      </div>
    </div>
  );
};

export default Dashboard;
