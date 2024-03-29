import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

import "../../styles/views/Dashboard.scss";
import LinearIndeterminate from "components/ui/loader";

// Components
const FriendList: React.FC = () => {
  return (
    <div className="friend-list component">
      <h2>Friend List</h2>

      <ul className="friend-list-list">
        <li>Michael B - Online</li>
        <li>Ulf Z. - Online</li>
        <li>Christiane B. - Offline</li>
      </ul>
    </div>
  );
};

const WelcomeMessage: React.FC = () => {
  return (
    <div className="welcome component">
      <h1 className="welcome-title">Welcome back, Test!</h1>
      <p className="font-bold text-lg">Your progress</p>
      <div className="mb-8">
        <Progress value={35} />
        <p>Level: X</p>
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
        <Button width="150px" backgroundColor="#FB8500">
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
          <Button width="80px" height="35px" backgroundColor="#82FF6D">
            Accept
          </Button>
        </div>
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button width="80px" height="35px" backgroundColor="#82FF6D">
            Accept
          </Button>
        </div>
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button width="80px" height="35px" backgroundColor="#82FF6D">
            Accept
          </Button>
        </div>
        <div className="trip-invitation">
          <div>Invitation to Binzmühlestrasse, Zürich</div>
          <Button width="80px" height="35px" backgroundColor="#82FF6D">
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
      <h2>Friend-Leaderboard</h2>
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
const Dashboard2: React.FC = () => {
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
      <div className="column friend-list">
        <FriendList />
        <FriendLeaderboard />
      </div>
      <div className="column middle-column">
        <WelcomeMessage />
        <TripInvitations />
      </div>
      <div className="column notifications-favorites">
        <NotificationsLog />
        <YourFavorites />
      </div>
    </div>
  );
};

export default Dashboard2;
