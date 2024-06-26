import React, {useState, useEffect} from "react";
import {api} from "helpers/api";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "components/ui/Button";
import PropTypes from "prop-types";
import {Progress} from "../ui/progress";
import DataTable from "react-data-table-component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import {ListCarousel} from "../ui/ListCarousel";

import "../../styles/views/TripOverview.scss";
import "../../styles/views/Dashboard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {styled} from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ScaleLoader } from "react-spinners";
import notificationLog from "../../graphics/notification_log.png";

// ============== HELPER FUNCTIONS ==============

const ConnectionItem = ({connection, alertUser}) => {
  const username = sessionStorage.getItem("username");
  const [timer, setTimer] = useState<number>(null); // controls timer
  const [showTimer, setShowTimer] = useState<boolean>(null);
  const [showConnectionPopup, setShowConnectionPopup] = useState<boolean>(false);
  let connectionForDataTable = [];
  const hasConnection = connection.allInfo.length > 0;

  function parseTime() {
    const timeStr = connection.startTime;

    const timeParts = timeStr.match(/(\d+):(\d+)/i);

    if (!timeParts) return null;

    let [_, hours, minutes] = timeParts;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // get date and time of departure
    let departureDate = sessionStorage.getItem("departureDate");
    const date = new Date(departureDate.split("T"));
    date.setHours(hours, minutes, 0); // Set the time to the parsed hours and minutes, seconds to 0

    // get present date and time
    const now = new Date();
    const timeDiffInSeconds = Math.floor((date - now) / 1000);
    return timeDiffInSeconds;
  }

  useEffect(() => {
    const initialTime = parseTime();
    setTimer(initialTime);

    const intervalId = setInterval(() => {
      setTimer((currentTimer) => {
        if (currentTimer <= 0 || currentTimer > 1000000) {
          setShowTimer(false);
          clearInterval(intervalId);
          return 0;
        } else {
          setShowTimer(true);
          return currentTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // Ensure the dependency array is empty

  const handleShowConnectionPopup = () => {
    if (hasConnection) {
      setShowConnectionPopup(old => !old);
    } else {
      alertUser("info", `${connection.username} hat noch keine Verbindung ausgewählt.`);
    }
  }
  const returnTime = (str) => {
    return str.slice(str.length - 8, str.length - 3);
  }

  const renameConnections = () => {
    let x = [];
    for (const el of connection.allInfo) {
      let temp = {
        to: el.arrivalPoint.stationName,
        from: el.departurePoint.stationName,
        type: el.connectionType,

        name: el.connectionName,
        departureTime: returnTime(el.departureTime),
        arrivalTime: returnTime(el.arrivalTime),
        departurePlatform: el.departurePlatform
        }
      x.push(temp);
    }
    return x;
  }

  connectionForDataTable = renameConnections();

  return (
    <div className="connection-item">
      {showConnectionPopup ? (<FontAwesomeIcon icon={faCircleXmark} className="info-for-connection" onClick={handleShowConnectionPopup}/>) : (
      <FontAwesomeIcon icon={faCircleInfo} className="info-for-connection" onClick={handleShowConnectionPopup}/>)}
      <h3 className="connection-name" style={{display: "flex", alignItems: "center"}}>
        {connection.username}
      </h3> 
      {showConnectionPopup ?
        (<DataTable  columns={
          [
            {
              name: "Von", selector: row => row.from, width:"200px",
            },
            {
              name: "Nach", selector: row => row.to, width: "200px",
            },
            {
              name: "Abfahrt", selector: row => row.departureTime,
            },
            {
              name: "Ankunft", selector: row => row.arrivalTime,
            },
            {
              name: "Name", selector: row => row.name,
            },
            {
              name: "Gleis", selector: row => row.departurePlatform ? row.departurePlatform : "--",
            }
          ]
        } data={connectionForDataTable}>
        </DataTable>) : (
      <>
        {showTimer &&
          connection.startTime !== "N/A" && (
            <p id="timer" className={username === connection.username && "bold-timer"}>
              Startet in:
              {`\n${Math.floor(timer / (60 * 60 * 24))}`.padStart(2, 0)}d
              {` ${Math.floor((timer % (60 * 60 * 24)) / (60 * 60))}`.padStart(
                2,
                0
              )}
              h
              {` ${Math.floor(
                ((timer % (60 * 60 * 24)) % (60 * 60)) / 60
              )}`.padStart(2, 0)}
              min
            </p>
          )}
        <p className="start-text">Startzeit: {connection.startTime} Uhr</p>
        <Progress className="progress-bar" value={connection.progress}/>
        <p className="arrival-text">
          Voraussichtliche Ankunft: {connection.endTime} Uhr
        </p>
      </>)}
    </div>
  );
};

ConnectionItem.propTypes = {
  alertUser: PropTypes.func,
  connection: PropTypes.object,
};

const calculateProgress = (departureTime, arrivalTime) => {
  if (!departureTime || !arrivalTime) return 0;
  const departure = new Date(departureTime).getTime();
  const arrival = new Date(arrivalTime).getTime();
  const now = new Date().getTime();
  if (now < departure) return 0;
  if (now > arrival) return 100;
  return ((now - departure) / (arrival - departure)) * 100;
};

const TripLog = ({setIsLoading, alertUser}) => {
  const {tripId} = useParams();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isComponentMounted = true;
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/trips/" + tripId + "/notifications", {
          headers: {Authorization: localStorage.getItem("token")},
        });
        // Sort notifications by timeStamp in ascending order
        const sortedNotifications = response.data.sort(
          (a, b) =>
            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        alertUser("error", "", error);
      } finally {
        if (isComponentMounted) {
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
    <div className="notification-log component">
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

// ============== MAIN FUNCTION ==============
const TripOverview = ({alertUser}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState({
    tripName: "",
    meetUpTime: "",
    numberOfParticipant: "",
    tripDescription: "",
    favourite: false,
    numberOfParticipants: "",
    meetUpPlace: {
      stationName: "",
      stationCode: "",
    },
  });
  const [connections, setConnections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserHasConnection, setCurrentUserHasConnection] =
    useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  //new admin
  const [tripMembers, setTripMembers] = useState([]); // Array of member objects
  const [newAdminId, setNewAdminId] = useState(null); // ID of the new selected admin

  const [openDialogNewAdmin, setOpenDialogNewAdmin] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showLog, setShowLog] = useState<boolean>(false);
  const [isTripLogLoading, setIsTripLogLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const {tripId} = useParams();
  const token = localStorage.getItem("token");

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleToCustomizeTrip = () => {
    navigate(`/customizeTrip/${tripId}`);
  };

  const handleChooseConnection = () => {
    navigate(`/chooseConnection/${tripId}`);
  };

  async function fetchAllData() {
    try {
      // Fetch current user data
      const userResponse = await api.get("/users", {
        headers: {Authorization: token},
      });
      const currentUserData = userResponse.data;
      sessionStorage.setItem("username", currentUserData.username);

      // Fetch trip information
      let tripData = null;
      try {
        const tripResponse = await api.get(`/trips/${tripId}`, {
          headers: {Authorization: token},
        });
        tripData = tripResponse.data;
        sessionStorage.setItem("departureDate", tripData.meetUpTime);
      } catch (error) {
        alertUser("error", "", error);
        navigate("/dashboard");
      }

      // Fetch admin status
      const adminStatusResponse = await api.get(`/trips/${tripId}/admin/`, {
        headers: {Authorization: token},
      });
      const isAdmin = adminStatusResponse.data;

      // Fetch connections
      const connectionsResponse = await api.get(
        `/trips/${tripId}/connections`,
        {headers: {Authorization: token}}
      );
      const connectionsData = connectionsResponse.data.map((participant) => {
        const {connectionDTO} = participant;
        const firstConnection = connectionDTO[0];
        const lastConnection = connectionDTO[connectionDTO.length - 1];
        return {
          username: participant.username,
          startTime: firstConnection?.departureTime
            ? new Date(firstConnection.departureTime).toLocaleTimeString(
              "de-DE",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )
            : "N/A",
          endTime: lastConnection?.arrivalTime
            ? new Date(lastConnection.arrivalTime).toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            : "N/A",
          progress: calculateProgress(
            firstConnection?.departureTime,
            lastConnection?.arrivalTime
          ),
          allInfo: connectionDTO,

        };
      });
      // Perform the connection check with the most up-to-date data
      checkIfUserHasConnection(connectionsData, currentUserData);

      // Update state with the fetched data
      setCurrentUser(currentUserData);
      setCurrentTrip(tripData);
      setIsAdmin(isAdmin);
      setConnections(connectionsData);
    } catch (error) {
      alertUser("error", "", error);
    }
  }

  const fetchTripMembers = async () => {
    //Only for Admin
    try {
      const response = await api.get(`/trips/${tripId}/participants`, {
        headers: {Authorization: token},
      });
      setTripMembers(response.data);
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const handleOpenSelectAdminDialog = () => {
    fetchTripMembers();
    setOpenDialogNewAdmin(true);
  };
  const handleCloseNewAdminDialog = () => {
    setOpenDialogNewAdmin(false);
    setNewAdminId(null);
  };

  const handleOpenLeaveDialog = () => {
    if (isAdmin) {
      alertUser(
        "warning",
        "Bitte wähle einen neuen Admin bevor du den Trip verlässt!"
      );
    } else {
      setOpenLeaveDialog(true);
    }
  };

  const handleCloseLeaveDialog = () => {
    setOpenLeaveDialog(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSelectNewAdmin = async () => {
    if (newAdminId) {
      try {
        await api.put(
          `/trips/${tripId}/admin/${newAdminId}`,
          {},
          {
            headers: {Authorization: token},
          }
        );
        alertUser("success", "Neuer Admin wurde erfolgreich gesetzt.");
        // Close the dialog and possibly refresh the admin status
        fetchAllData();
        handleCloseNewAdminDialog();
      } catch (error) {
        alertUser("error", "Neuer Admin konnte nicht gesetzt werden.", error);
        handleCloseNewAdminDialog();
      }
    }
  };

  const handleConfirmLeave = async () => {
    handleCloseLeaveDialog(); // Close the dialog first

    try {
      await api.delete(`/trips/${tripId}/exit`, {
        headers: {Authorization: token},
      });
      alertUser("success", "Reise verlassen.");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      alertUser("error", "Reise konnte nicht verlassen werden.", error);
    }
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog(); // Close the dialog first
    try {
      await api.delete(`/trips/${tripId}`, {
        headers: {Authorization: token},
      });
      alertUser("success", "Reise gelöscht.");
      setTimeout(() => navigate("/dashboard"), 3000); // 3 seconds too long? Or couple with await? Because when fetching the Trip not found error could come.
    } catch (error) {
      alertUser("error", "Löschen der Reise fehlgeschlagen.", error);
    }
  };

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  const handleToFavourites = async () => {
    try {
      await api.put(
        `/trips/${tripId}/favorites `,
        {},
        {
          headers: {Authorization: token},
        }
      );
      alertUser(
        "success",
        currentTrip.favourite
          ? "Von Favoriten gelöscht."
          : "Zu Favoriten hinzugefügt."
      );
      setCurrentTrip((old) => ({...old, favourite: !old.favourite}));
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const checkIfUserHasConnection = (connections, currentUser) => {
    const hasConnection = connections.some(
      (connection) =>
        connection.username === currentUser.username &&
        connection.startTime !== "N/A"
    );
    setCurrentUserHasConnection(hasConnection);
  };

  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loader for x seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPeriodically = async () => {
      try {
        await fetchAllData();
      } catch (error) {
        alertUser("error", "", error);
      }
    };

    // Fetch immediately when the component mounts
    fetchPeriodically();

    const intervalId = setInterval(fetchPeriodically, 5000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
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
    <div className="main-container">
      <div className="main-header">
        <h1 className="main-title">
          &quot;{currentTrip.tripName}&quot; nach &quot;
          {currentTrip.meetUpPlace.stationName}&quot;
        </h1>
        <StyledRating
          defaultValue={currentTrip.favourite ? 1 : 0}
          max={1}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit"/>}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit"/>}
          onMouseDown={handleToFavourites}
        />
        <div style={{position: "relative", top: "0%", marginLeft: "50px"}}>
          <Button
            onClick={() => {
              setShowLog(!showLog);
            }}
            className="log-button"
          >
            <img
              className="log-button icon"
              src={notificationLog}
              alt="trip notification log"
            />
          </Button>
          {showLog && (
            <TripLog setIsLoading={setIsTripLogLoading} alertUser={alertUser}/>
          )}
        </div>
      </div>

      <div className="trip-information-container">
        <h3 className="trip-description">
          Beschreibung der Reise: {currentTrip.tripDescription}
        </h3>
        <div className="trip-arrival-participants">
          <h3 className="trip-participants">
            Aktuelle Anzahl von Reiseteilnehmern:{" "}
            {currentTrip.numberOfParticipants}
          </h3>
          <h3 className="trip-arrival">
            Gewählte Ankunft:{" "}
            {new Date(currentTrip.meetUpTime).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }) +
              ", " +
              new Date(currentTrip.meetUpTime).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
            Uhr
          </h3>
        </div>
      </div>
      <div className="current-locations-container">
        <h1 className="current-locations-title">
          Aktueller Fortschritt der Reiseteilnehmer
        </h1>
        <div className="connections-list">
          {connections.map((connection, index) => (
            <ConnectionItem key={index} connection={connection} alertUser={alertUser}/>
          ))}
        </div>
        <div className="trip-buttons">
          <Button
            className="back-button"
            backgroundColor="#FFB703"
            onClick={handleBackClick}
          >
            Zurück zum Dashboard
          </Button>
          <Button
            className={`chooseconnection-button ${
              !currentUserHasConnection ? "blinking-glowing" : ""
            }`}
            backgroundColor="#BCFFE3"
            onClick={handleChooseConnection}
          >
            Wähle Reiseverbindung
          </Button>
          <Button
            className="leavetrip-button"
            backgroundColor="#FF7070"
            onClick={handleOpenLeaveDialog}
          >
            Reise verlassen
          </Button>
        </div>
      </div>
      {isAdmin && (
        <div className="admin-container">
          <h2 className="ul_title">Admin Optionen</h2>
          <div className="admin-buttons">
            <Button
              className="newadmin-button"
              backgroundColor="#FFB703"
              onClick={handleOpenSelectAdminDialog}
            >
              Neuen Admin wählen
            </Button>
            <Button
              className="managetrip-button"
              backgroundColor="#BCFFE3"
              onClick={handleToCustomizeTrip}
            >
              Reise bearbeiten
            </Button>
            <Button
              className="deletetrip-button"
              backgroundColor="#FF7070"
              onClick={handleOpenDeleteDialog}
            >
              Reise löschen
            </Button>
          </div>
        </div>
      )}

      <ListCarousel alertUser={alertUser}></ListCarousel>

      <Dialog
        open={openLeaveDialog}
        onClose={handleCloseLeaveDialog}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          "& .MuiPaper-root": {
            boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle id="leave-dialog-title">
          Bestätige Verlassen der Reise
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="leave-dialog-description">
            Bist du sicher, dass du die Reise verlassen willst?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaveDialog} color="primary">
            Abbrechen
          </Button>
          <Button
            onClick={handleConfirmLeave}
            backgroundColor="#FF7070"
            color="black"
          >
            Verlassen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for confirming deletion */}

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          "& .MuiPaper-root": {
            boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle id="delete-dialog-title">Bestätige Löschung</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bist du sicher, dass du die Reise löschen willst?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            style={{backgroundColor: "#BCFFE3", color: "black"}}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleConfirmDelete}
            backgroundColor="#FF7070"
            color="black"
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for selecting a new admin */}

      <Dialog
        open={openDialogNewAdmin}
        onClose={handleCloseNewAdminDialog}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          "& .MuiPaper-root": {
            boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle>Neuen Admin auswählen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {tripMembers.length > 0
              ? "Bitte ernenne einen neuen Admin für die Reise."
              : "Keine Mitglieder. Lade zuerst Freunde ein!"}
          </DialogContentText>
          {tripMembers.length > 0 && (
            <List>
              {tripMembers.map((member) => (
                <ListItem
                  key={member.id}
                  button
                  selected={newAdminId === member.id}
                  onClick={() => setNewAdminId(member.id)}
                  sx={{
                    "&.Mui-selected, &.Mui-selected:hover": {
                      backgroundColor: "#ffb80386",
                      color: "black",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <ListItemText primary={member.username}/>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAdminDialog} color="primary">
            Abbrechen
          </Button>
          <Button
            style={{backgroundColor: "#FFB703", color: "black"}}
            onClick={handleSelectNewAdmin}
            disabled={!newAdminId}
          >
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

TripLog.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
  alertUser: PropTypes.func,
};

export default TripOverview;

TripOverview.propTypes = {
  alertUser: PropTypes.func,
};
