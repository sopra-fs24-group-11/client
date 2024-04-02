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
        console.log("FRIENDS: ", response.data)
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
      <h2>Friend List</h2>
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
      <div className="requests">
        <h2>New requests</h2>
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
    fetchUsername();
  }, []);

  return (
    <div className="welcome component">
      <h1 className="welcome-title">
        Welcome back, {currentUser ? currentUser.username : "loading..."}!
      </h1>
      <p className="font-bold text-lg">Your progress</p>
      <div className="mb-8">
        <Progress value={currentUser ? currentUser.level * 100 : 0} />
        <p>Level: {currentUser ? currentUser.level : "loading..."}</p>
      </div>

      <div className="current-trips component">
        <h2>Current Trips</h2>
        <div className="trip-container">
          <div className="trip-info">
            <div>Trip01 to Zürich, Platte</div>
            <Button width="80px" height="35px" backgroundColor="#FFB703">
              Info
            </Button>
          </div>
          <div className="trip-info">
            <div>Trip02 to Zürich, HB</div>
            <Button width="80px" height="35px" backgroundColor="#FFB703">
              Info
            </Button>
          </div>
          <div className="trip-info">
            <div>Trip04 to Zürich, ETH Universitätsspital</div>
            <Button width="80px" height="35px" backgroundColor="#FFB703">
              Info
            </Button>
          </div>
          <div className="trip-info">
            <div>Trip05 to Zürich, ETH Universitätsspital</div>
            <Button width="80px" height="35px" backgroundColor="#FFB703">
              Info
            </Button>
          </div>
          <div className="trip-info">
            <div>Trip06 to Zürich, ETH Universitätsspital</div>
            <Button width="80px" height="35px" backgroundColor="#FFB703">
              Info
            </Button>
          </div>
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
  return (
    <div className="notifications-log component">
      <h2>Notifications Log</h2>
      <div className="notifications-log-list">
        <ol>
          <li>11:34 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:37 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:39 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:39 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:39 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:39 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:39 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:39 - Michael updated trip members XXXXXX XXXXXX XXX</li>
        </ol>
      </div>
    </div>
  );
};

const TripInvitations: React.FC = () => {
  return (
    <div className="trip-invitations component">
      <h2>Trip Invitations</h2>
      <div className="trip-invitation-list">
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button
            className="accept-button"
            width="80px"
            height="35px"
            backgroundColor="#82FF6D"
          >
            Accept
          </Button>
        </div>
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button
            className="accept-button"
            width="80px"
            height="35px"
            backgroundColor="#82FF6D"
          >
            Accept
          </Button>
        </div>
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button
            className="accept-button"
            width="80px"
            height="35px"
            backgroundColor="#82FF6D"
          >
            Accept
          </Button>
        </div>
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button
            className="accept-button"
            width="80px"
            height="35px"
            backgroundColor="#82FF6D"
          >
            Accept
          </Button>
        </div>
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
    }, 2000); // Show loader for x seconds

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
