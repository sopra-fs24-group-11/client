import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Switch } from "../ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";

import "../../styles/views/Dashboard.scss"; // Assuming you have a CSS file for styles

// Components
const FriendList: React.FC = () => {
  return (
    <div className="friend-list component">
      <h2>Friend List</h2>
      {/* Placeholder content */}
      <ul>
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
      <h1 className="welcome-title">Welcome back, Alberto!</h1>
      <p>Your progress:</p>
      <div className="mb-8">
        {" "}
        {/* This adds a bottom margin. '8' can be adjusted to the desired space */}{" "}
        <Progress value={35} />
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
      {/* Placeholder content */}
      <div>
        <ol>
          <li>11:34 - Michael updated trip members XXXXXX XXXXXX XXX</li>
          <li>11:37 - Michael updated trip members XXXXXX XXXXXX XXX</li>
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
      {/* Placeholder content */}
      <div>Invitation to Binzmühlestrasse, Zürich</div>
    </div>
  );
};

const YourFavorites: React.FC = () => {
  return (
    <div className="your-favorites component">
      <h2>Your Favourites</h2>
      {/* Placeholder content */}
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

/* const Dashboard = () => {
  return (
    <div>
    <h1>Dashboard</h1>
    
    <div>
        <div className="my-4"></div>

        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader >
                    <CardTitle>This is an example Card</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>

        <div className="flex justify-center items-center h-20">
            <div className="flex items-center space-x-3">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
        </div>

        <div>
            <Progress value={20} />
        </div>

        
        <div className="flex flex-col space-y-3 h-36 items-center justify-center">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    </div>
    </div>
  );
} */

// export default Dashboard;
