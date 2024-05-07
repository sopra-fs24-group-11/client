import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import "../../styles/views/Dashboard.scss";
import LinearIndeterminate from "components/ui/loader";
import Favourites from "components/ui/favourites";
import { FadeLoader, HashLoader, PacmanLoader } from "react-spinners";

// Components
const FriendList = ({ setIsLoading, alertUser }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isComponentMounted = true; // Track if the component is still mounted

    const fetchFriendData = async () => {
      try {
        const requestsResponse = await api.get("/users/friends/requests", {
          headers: { Authorization: token },
        });
        setFriendRequests(requestsResponse.data);
        console.log("FRIEND REQUESTS INFO:", requestsResponse.data);

        const friendsResponse = await api.get("/users/friends", {
          headers: { Authorization: token },
        });
        console.log("FRIENDS:", friendsResponse.data);
        setFriendList(friendsResponse.data);
      } catch (error) {
        alertUser("error", "", error);
      } finally {
        // Only set loading to false if the component is still mounted
        if (isComponentMounted) {
          console.log("---- FRIENDS LOADED ----");
          setIsLoading(false);
        }
      }
    };

    fetchFriendData(); // Fetch immediately when the component mounts

    // Set up the interval for fetching data every 7 seconds
    const intervalId = setInterval(fetchFriendData, 7000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      isComponentMounted = false; // Indicate the component has been unmounted
      clearInterval(intervalId);
    };
  }, [setIsLoading, token]);

  const handleAcceptFriendRequest = async (friendRequestId) => {
    try {
      await api.put(
        `/users/friends/${friendRequestId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      alertUser("success", "Friend request accepted.");
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
      window.location.reload();
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const handleDenyFriendRequest = async (friendRequestId) => {
    try {
      await api.delete(`/users/friends/${friendRequestId}`, {
        headers: { Authorization: token },
      });
      // Remove the denied request from the list
      alertUser("success", "Friend request denied.");
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendRequestId)
      );
      window.location.reload();
    } catch (error) {
      alertUser("error", "", error);
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
                <div className="acceptdeny-buttons">
                  <Button
                    className="accept-button"
                    width="80px"
                    height="35px"
                    backgroundColor="#82FF6D"
                    onClick={() => handleAcceptFriendRequest(request.friendId)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="deny-button"
                    backgroundColor={"red"}
                    height="35px"
                    onClick={() => handleDenyFriendRequest(request.friendId)}
                  >
                    Deny
                  </Button>
                </div>
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

const WelcomeMessage = ({ setIsLoading, alertUser }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTrips, setCurrentTrips] = useState([]);

  const handleCreateTrip = () => {
    navigate("/createTrip");
  };

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const userdata = await api.get("/users", {
          headers: { Authorization: token },
        });
        setCurrentUser(userdata.data);
        console.log("CURRENT USER DATA:", userdata.data);
      } catch (error) {
        alertUser("error", "", error);
      }

      try {
        const response = await api.get("/trips/current", {
          headers: { Authorization: token },
        });
        setCurrentTrips(response.data);
        console.log("CURRENT TRIPS:", response.data);
      } catch (error) {
        alertUser("error", "", error);
      } finally {
        if (isComponentMounted) {
          console.log("---- WELCOME MESSAGE LOADED ----");
          setIsLoading(false);
        }
      }
    };

    fetchData(); // Fetch immediately when the component mounts
    const intervalId = setInterval(fetchData, 7000); // Fetch data every 7 seconds

    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
    };
  }, [setIsLoading]);

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
                <div>
                  {`"${trip.tripName}" to "${
                    trip.meetUpPlace.stationName
                  }" on ${new Date(trip.meetUpTime).toLocaleDateString(
                    "de-DE",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}`}
                </div>
                <Button
                  backgroundColor="#FFB703"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the navigation from firing when the Info button is clicked
                    //navigate(`/trip/${trip.id}`);
                    navigate(`/tripOverview/${trip.id}`);
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

const NotificationsLog = ({ setIsLoading, alertUser }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isComponentMounted = true;
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
        alertUser("error", "", error);
      } finally {
        if (isComponentMounted) {
          console.log("---- NOTIFICATIONS LOADED ----");
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 7000);

    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
    };
  }, [setIsLoading]);

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

const TripInvitations = ({ setIsLoading, alertUser }) => {
  const [tripInvitations, setTripInvitations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isComponentMounted = true;
    const fetchTripInvitations = async () => {
      try {
        const response = await api.get("/trips/invitations", {
          headers: { Authorization: token },
        });
        setTripInvitations(response.data);
        console.log("TRIP INVITATIONS:", response.data);
      } catch (error) {
        alertUser("error", "", error);
      } finally {
        if (isComponentMounted) {
          console.log("---- TRIP INVITATIONS LOADED ----");
          setIsLoading(false);
        }
      }
    };

    const intervalId = setInterval(fetchTripInvitations, 7000);

    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
    };
  }, [setIsLoading]);

  const handleAcceptInvitation = async (tripId) => {
    try {
      await api.put(
        `/trips/${tripId}/invitation`,
        {},
        { headers: { Authorization: token } }
      );
      setTripInvitations(
        tripInvitations.filter((invitation) => invitation.id !== tripId)
      );

      window.location.reload(); // I don't like this one, why not give down a "change" state (or rather setChange method) that you can increase here and in the dashboard, whenever the change changes, the whole dashboard fetches again?
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const handleDenyInvitation = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}/invitation`, {
        headers: { Authorization: token },
      });
      setTripInvitations(
        tripInvitations.filter((invitation) => invitation.id !== tripId)
      );
      window.location.reload();
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  return (
    <div className="trip-invitations component">
      <h2>Trip Invitations</h2>
      <div className="trip-invitation-list">
        {tripInvitations.length > 0 ? (
          tripInvitations.map((invitation) => (
            <div key={invitation.id} className="trip-invitation">
              <div>
                Invitation to &quot;{invitation.tripName}&quot; on{" "}
                {new Date(invitation.meetUpTime).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <Button
                className="accept-button"
                width="80px"
                height="35px"
                backgroundColor="#82FF6D"
                onClick={() => handleAcceptInvitation(invitation.id)}
              >
                Accept
              </Button>
              <Button
                className="deny-button"
                width="80px"
                height="35px"
                backgroundColor="red"
                onClick={() => handleDenyInvitation(invitation.id)}
              >
                Deny
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

const YourFavorites = ({ setIsLoading, alertUser }) => {
  return <Favourites alertUser={alertUser}></Favourites>;
};

const FriendLeaderboard = ({ setIsLoading, alertUser }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // why??

  useEffect(() => {
    let isComponentMounted = true;
    const fetchFriends = async () => {
      try {
        const response = await api.get("/users/friends", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log("FRIENDS FOR LEADERBOARD:", response.data);
        setLeaderboard(response.data);
      } catch (error) {
        alertUser("error", "", error);
      } finally {
        if (isComponentMounted) {
          console.log("---- LEADERBOARD LOADED ----");
          //setIsLoading(false);
        }
      }
      try {
        const userdata = await api.get("/users", {
          // why this request?
          headers: { Authorization: localStorage.getItem("token") },
        });
        setCurrentUser(userdata.data);
        console.log("CURRENT USER DATA:", userdata.data);
      } catch (error) {
        alertUser("error", "", error);
      }
    };

    fetchFriends();

    const intervalId = setInterval(fetchFriends, 7000);

    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
    };
  }, [setIsLoading]);

  leaderboard.sort((a, b) => b.points - a.points || b.level - a.level); // Sort by points, then level

  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return "#FFD700"; // gold
      case 1:
        return "#C0C0C0"; // silver
      case 2:
        return "#CD7F32"; // bronze
      default:
        return "#dddddd"; // default background
    }
  };

  return (
    <div className="friend-leaderboard component">
      <h2>Your Top-Friends</h2>
      <ol className="leaderboard-list">
        {leaderboard.map((friend, index) => (
          <li
            key={friend.friendId}
            className={`leaderboard-item ${friend.username}`}
            style={{
              backgroundColor: getBackgroundColor(index),
              color: "black",
              fontWeight: "500",
              padding: "10px",
              borderRadius: "10px",
              margin: "10px 0",
              border: index < 3 ? "1px solid black" : "none", // Optional border for top 3
            }}
          >
            {index + 1}. {friend.username} (Lv. {Math.floor(friend.level)}) -{" "}
            {friend.points} points
          </li>
        ))}
      </ol>
    </div>
  );
};

// Main Dashboard component
const Dashboard = ({ alertUser }) => {
  const [isLoadingOld, setIsLoadingOld] = useState(true);
  const [isFriendListLoading, setIsFriendListLoading] = useState(true);
  const [isWelcomeMessageLoading, setIsWelcomeMessageLoading] = useState(true);
  const [isNotificationsLogLoading, setIsNotificationsLogLoading] =
    useState(true);
  const [isTripInvitationsLoading, setIsTripInvitationsLoading] =
    useState(true);

  const allLoaded =
    !isFriendListLoading &&
    !isWelcomeMessageLoading &&
    !isNotificationsLogLoading &&
    !isTripInvitationsLoading;

  useEffect(() => {
    //OLD LOADER
    const timer = setTimeout(() => {
      setIsLoadingOld(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoadingOld) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FadeLoader
          color="#001f33"
          height={40}
          margin={20}
          radius={20}
          width={10}
        />
      </div>
    );
  }

  return true ? ( // REPLACE TRUE WITH allLoaded IF REAL LOADING IS IMPLEMENTED
    <div className="dashboard">
      <div className="column left">
        <FriendList
          setIsLoading={setIsFriendListLoading}
          alertUser={alertUser}
        />
        <FriendLeaderboard alertUser={alertUser} />
      </div>
      <div className="column middle">
        <WelcomeMessage
          setIsLoading={setIsWelcomeMessageLoading}
          alertUser={alertUser}
        />
        <TripInvitations
          setIsLoading={setIsTripInvitationsLoading}
          alertUser={alertUser}
        />
      </div>
      <div className="column right">
        <NotificationsLog
          setIsLoading={setIsNotificationsLogLoading}
          alertUser={alertUser}
        />
        <YourFavorites alertUser={alertUser} />
      </div>
    </div>
  ) : (
    <LinearIndeterminate />
  );
};

FriendList.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

WelcomeMessage.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

NotificationsLog.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

TripInvitations.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

YourFavorites.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

FriendLeaderboard.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

export default Dashboard;

Dashboard.propTypes = {
  alertUser: PropTypes.func,
};
