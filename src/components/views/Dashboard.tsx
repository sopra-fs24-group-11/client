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
import { FadeLoader, HashLoader, PacmanLoader, ScaleLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

// Components
const FriendList = ({ alertUser }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchFriendData = async () => {
    try {
      const requestsResponse = await api.get("/users/friends/requests", {
        headers: { Authorization: token },
      });
      setFriendRequests(requestsResponse.data);

      const friendsResponse = await api.get("/users/friends", {
        headers: { Authorization: token },
      });
      setFriendList(friendsResponse.data);

    } catch (error) {
      alertUser("error", "", error);
    }
  }

  useEffect(() => {
    fetchFriendData(); // Fetch immediately when the component mounts
    // Set up the interval for fetching data every 7 seconds
    const intervalId = setInterval(fetchFriendData, 7000);
    // Cleanup function to clear the interval when the component unmounts
    return () => {clearInterval(intervalId);};
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
      alertUser("success", "Friend request accepted.");
      fetchFriendData();
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
      fetchFriendData();
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase() === "online"
      ? "status online"
      : "status offline";
  };

  return (
    <div className="friends component">
      <h2>Freundesliste</h2>
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
          Noch keine Freunde. Klicke auf &quot;Zeige Details&quot; um Freunde
          hinzuzufügen.
        </div>
      )}

      <div className="requests">
        <h2>Neue Freundschaftsanfragen</h2>
        {friendRequests.length > 0 ? (
          <div className="request-list">
            {friendRequests.map((request, index) => (
              <div key={index} className="request">
                <span className="name">{request.username}</span>
                <div className="acceptdeny-buttons">
                  <FontAwesomeIcon icon={faCheck} className="accept-request-icon" onClick={() => handleAcceptFriendRequest(request.friendId)} />
                  <FontAwesomeIcon icon={faXmark} className="deny-request-icon" onClick={() => handleDenyFriendRequest(request.friendId)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-requests-message">Keine neuen Anfragen.</div>
        )}

        <div className="show-details-button-container">
          <Button
            onClick={() => navigate("/friends")}
            width="150px"
            backgroundColor="#FFB703"
          >
            Zeige Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const WelcomeMessage = ({ alertUser, newChangeInCurrentTrips }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTrips, setCurrentTrips] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const userdata = await api.get("/users", {
        headers: { Authorization: token },
      });
      setCurrentUser(userdata.data);
    } catch (error) {
      alertUser("error", "", error);
    }

    try {
      const response = await api.get("/trips/current", {
        headers: { Authorization: token },
      });
      setCurrentTrips(response.data);
    } catch (error) {
      alertUser("error", "", error);
    }
  }

  useEffect(() => {
    fetchData(); // Fetch immediately when the component mounts
    const intervalId = setInterval(fetchData, 7000); // Fetch data every 7 seconds

    return () => {
      clearInterval(intervalId);
    }; 
  }, [newChangeInCurrentTrips]); // important! this makes it available so that this component updates when accepting a trip invitation!

  return (
    <div className="welcome component">
      <h1 className="welcome-title">
        Willkommen zurück, {currentUser ? currentUser.username : "loading..."}!
      </h1>
      <p className="font-bold text-lg ">Dein Levelfortschritt</p>
      <div className="mb-8">
        <Progress
          style={{ boxShadow: "0 2px 5px rgba(0, 0, 0, 0.6)" }}
          value={currentUser ? (currentUser.level % 1) * 100 : 0}
        />
        <p className="mt-2">
          Level: {currentUser ? Math.floor(currentUser.level) : "loading..."},
          sammle{" "}
          {currentUser ? Math.round((1 - (currentUser.level % 1)) * 100) : 0}{" "}
          Punkte für das nächste Level.
        </p>
      </div>

      <div className="current-trips component">
        <h2>Aktuelle Reisen</h2>
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
                  {`"${trip.tripName}" nach "${
                    trip.meetUpPlace.stationName
                  }" am ${new Date(trip.meetUpTime).toLocaleDateString(
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
              Keine aktuellen Reisen. Erstelle eine oder lass dich von deinen
              Freunden einladen!
            </div>
          )}
        </div>
      </div>

      <div className="create-button-container">
        <Button
          width="150px"
          backgroundColor="#FB8500"
          onClick={() => navigate("/createTrip")}
        >
          Reise erstellen
        </Button>
      </div>
    </div>
  );
};

const NotificationsLog = ({ alertUser }) => {
  const [notifications, setNotifications] = useState([]);

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
      setNotifications(sortedNotifications);
    } catch (error) {
      alertUser("error", "", error);
    } 
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 7000);
    return () => {clearInterval(intervalId);};
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + ", " + date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="notifications-log component">
      <h2>Mitteilungen</h2>
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

const TripInvitations = ({ alertUser, setNewChangeInCurrentTrips }) => {
  const [tripInvitations, setTripInvitations] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTripInvitations = async () => {
    try {
      const response = await api.get("/trips/invitations", {
        headers: { Authorization: token },
      });
      setTripInvitations(response.data);
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  useEffect(() => {
    fetchTripInvitations();
    const intervalId = setInterval(fetchTripInvitations, 7000);
    return () => {clearInterval(intervalId);};
  }, []);

  const handleAcceptInvitation = async (tripId) => {
    try {
      await api.put(
        `/trips/${tripId}/invitation`,
        {},
        { headers: { Authorization: token } }
      );
      fetchTripInvitations();
      setNewChangeInCurrentTrips(old => old+1);
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const handleDenyInvitation = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}/invitation`, {
        headers: { Authorization: token },
      });
      fetchTripInvitations();
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  return (
    <div className="trip-invitations component">
      <h2>Reiseeinladungen</h2>
      <div className="trip-invitation-list">
        {tripInvitations.length > 0 ? (
          tripInvitations.map((invitation) => (
            <div key={invitation.id} className="trip-invitation">
              <div className="invitation-text">
                Einladung zu &quot;{invitation.tripName}&quot; am{" "}
                {new Date(invitation.meetUpTime).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <div className="acceptdeny-buttons">
                <FontAwesomeIcon icon={faCheck} className="accept-request-icon" onClick={() => handleAcceptInvitation(invitation.id)} />
                <FontAwesomeIcon icon={faXmark} className="deny-request-icon" onClick={() => handleDenyInvitation(invitation.id)} />
              </div>
            </div>
          ))
        ) : (
          <div className="no-current-trip-invitations">
            Keine aktuellen Reiseeinladungen: Erstellen eine Reise oder lass
            dich von deinen Freunden einladen!
          </div>
        )}
      </div>
    </div>
  );
};

const FriendLeaderboard = ({ alertUser }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/users/friends", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLeaderboard(response.data);
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  useEffect(() => {
    fetchFriends();

    const intervalId = setInterval(fetchFriends, 7000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
      <h2>Deine besten Freunde</h2>
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
            {friend.points} Punkte
          </li>
        ))}
      </ol>
    </div>
  );
};

// Main Dashboard component
const Dashboard = ({ alertUser }) => {
  const [isLoadingOld, setIsLoadingOld] = useState(true);
  const [newChangeInCurrentTrips, setNewChangeInCurrentTrips] = useState(0);

  useEffect(() => {
    //OLD LOADER
    const timer = setTimeout(() => {
      setIsLoadingOld(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoadingOld) {
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
    <div className="dashboard">
      <div className="column left">
        <FriendList
          alertUser={alertUser}
        />
        <FriendLeaderboard alertUser={alertUser} />
      </div>
      <div className="column middle">
        <WelcomeMessage
          alertUser={alertUser}
          newChangeInCurrentTrips={newChangeInCurrentTrips}
        />
        <TripInvitations
          alertUser={alertUser}
          setNewChangeInCurrentTrips={setNewChangeInCurrentTrips}
        />
      </div>
      <div className="column right">
        <NotificationsLog
          alertUser={alertUser}
        />
        <Favourites alertUser={alertUser}></Favourites>
      </div>
    </div> 
  )
};

FriendList.propTypes = {
  alertUser: PropTypes.func,
};

WelcomeMessage.propTypes = {
  alertUser: PropTypes.func,
  newChangeInCurrentTrips: PropTypes.number,
};

NotificationsLog.propTypes = {
  alertUser: PropTypes.func,
};

TripInvitations.propTypes = {
  alertUser: PropTypes.func,
  setNewChangeInCurrentTrips: PropTypes.func,
};

FriendLeaderboard.propTypes = {
  alertUser: PropTypes.func,
};

export default Dashboard;

Dashboard.propTypes = {
  alertUser: PropTypes.func,
};
