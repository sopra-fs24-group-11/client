import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Progress } from "../ui/progress";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ListCarousel } from "../ui/ListCarousel";

import "../../styles/views/TripOverview.scss";
import LinearIndeterminate from "components/ui/loader";

// ============== HELPER FUNCTIONS ==============

const ConnectionItem = ({ connection }) => {
  return (
    <div className="connection-item">
      <h3 className="connection-name">{connection.username}</h3>
      <p className="start-text">Start time: {connection.startTime}</p>
      <Progress className="progress-bar" value={connection.progress} />
      <p className="arrival-text">Expected arrival: {connection.endTime}</p>
    </div>
  );
};

ConnectionItem.propTypes = {
  connection: PropTypes.shape({
    username: PropTypes.string.isRequired,
    startStation: PropTypes.string.isRequired,
    endStation: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  }),
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

// ============== MAIN FUNCTION ==============
const TripOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState({});
  const [connections, setConnections] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  //new admin
  const [tripMembers, setTripMembers] = useState([]); // Array of member objects
  const [newAdminId, setNewAdminId] = useState(null); // ID of the new selected admin

  const [openDialogNewAdmin, setOpenDialogNewAdmin] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Default to "success"

  const navigate = useNavigate();
  const { tripId } = useParams();
  const token = localStorage.getItem("token");

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleToCustomizeTrip = () => {
    navigate(`/customizeTrip/${tripId}`);
  };

  const handleMissedConnection = () => {
    navigate("/chooseConnection");
  };

  const fetchAdminStatus = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/admin/`, {
        headers: { Authorization: token },
      });
      console.log("ADMIN?:", response.data);
      setIsAdmin(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchTripInformation = async () => {
    try {
      const response = await api.get(`/trips/${tripId}`, {
        headers: { Authorization: token },
      });
      console.log("CURRENT TRIP INFORMATION:", response.data);
      setCurrentTrip(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        alert(
          "You have been kicked from the trip or the trip has been deleted."
        );
        navigate("/dashboard");
      }
      handleError(error);
    }
  };

  const fetchTripMembers = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/participants`, {
        headers: { Authorization: token },
      });
      setTripMembers(response.data);
      console.log("TRIP MEMBERS:", response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/connections`, {
        headers: { Authorization: token },
      });
      console.log("CONNECTIONS:", response.data);
      const processedConnections = response.data.map((participant) => {
        const { connectionDTO } = participant;
        const firstConnection = connectionDTO[0];
        const lastConnection = connectionDTO[connectionDTO.length - 1];

        return {
          username: participant.username,
          startTime: firstConnection?.departureTime
            ? new Date(firstConnection.departureTime).toLocaleTimeString()
            : "N/A",
          endTime: lastConnection?.arrivalTime
            ? new Date(lastConnection.arrivalTime).toLocaleTimeString()
            : "N/A",
          progress: calculateProgress(
            firstConnection?.departureTime,
            lastConnection?.arrivalTime
          ),
        };
      });
      setConnections(processedConnections);
    } catch (error) {
      handleError(error);
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
      setSnackbarMessage("Please select a new admin before leaving the trip!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
            headers: { Authorization: token },
          }
        );
        setSnackbarMessage("New admin selected successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Close the dialog and possibly refresh the admin status
        fetchAdminStatus();
        handleCloseNewAdminDialog();
      } catch (error) {
        handleError(error);
        setSnackbarMessage("Failed to set new admin.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        handleCloseNewAdminDialog();
      }
    }
  };

  const handleConfirmLeave = async () => {
    handleCloseLeaveDialog(); // Close the dialog first

    try {
      await api.delete(`/trips/${tripId}/exit`, {
        headers: { Authorization: token },
      });
      setSnackbarMessage("You have left the trip.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/dashboard"), 3000);
      console.log("TRIP LEFT!!!");
    } catch (error) {
      handleError(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog(); // Close the dialog first
    try {
      await api.delete(`/trips/${tripId}`, {
        headers: { Authorization: token },
      });

      setSnackbarMessage("Trip successfully deleted.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/dashboard"), 3000);

      console.log("TRIP DELETED!!!");
    } catch (error) {
      handleError(error);
      setSnackbarSeverity("error");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPeriodically = async () => {
      await fetchTripInformation();
      await fetchAdminStatus();
      await fetchConnections();
    };

    // Fetch immediately when the component mounts
    fetchPeriodically();

    // Set up the interval for fetching data every 10 seconds
    const intervalId = setInterval(fetchPeriodically, 10000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="main-container">
      <h1 className="main-title">
        &quot;{currentTrip.tripName}&quot; to &quot;
        {currentTrip.meetUpPlace.stationName}&quot;
      </h1>
      <div className="trip-information-container">
        <h3 className="trip-description">
          Trip Description: {currentTrip.tripDescription}
        </h3>
        <div className="trip-arrival-participants">
          <h3 className="trip-participants">
            Current amount of trip participants:{" "}
            {currentTrip.numberOfParticipants}
          </h3>
          <h3 className="trip-arrival">
            Desired arrival:{" "}
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
              })}
          </h3>
        </div>
      </div>
      <div className="current-locations-container">
        <h1 className="current-locations-title">
          Current location of trip participants
        </h1>
        <div className="connections-list">
          {connections.map((connection, index) => (
            <ConnectionItem key={index} connection={connection} />
          ))}
        </div>
        <div className="trip-buttons">
          <Button
            className="back-button"
            backgroundColor="#FFB703"
            color="black"
            onClick={handleBackClick}
          >
            Back to Dashboard
          </Button>
          <Button
            className="missed-button"
            backgroundColor="#BCFFE3"
            color="black"
            onClick={handleMissedConnection}
          >
            I missed a connection
          </Button>
          <Button
            className="leavetrip-button"
            backgroundColor="#FF7070"
            color="black"
            onClick={handleOpenLeaveDialog}
          >
            Leave this trip
          </Button>
        </div>
      </div>
      {isAdmin && (
        <div className="admin-container">
          <h2 className="ul_title">Admin Panel</h2>
          <div className="admin-buttons">
            <Button
              className="newadmin-button"
              backgroundColor="#FFB703"
              color="black"
              onClick={handleOpenSelectAdminDialog}
            >
              Select new Admin
            </Button>
            <Button
              className="managetrip-button"
              backgroundColor="#BCFFE3"
              color="black"
              onClick={handleToCustomizeTrip}
            >
              Manage Trip
            </Button>
            <Button
              className="deletetrip-button"
              backgroundColor="#FF7070"
              color="black"
              onClick={handleOpenDeleteDialog}
            >
              Delete Trip
            </Button>
          </div>
        </div>
      )}

      <ListCarousel></ListCarousel>

      <Dialog
        open={openLeaveDialog}
        onClose={handleCloseLeaveDialog}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Increase the opacity here
          },
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle id="leave-dialog-title">Confirm Leave</DialogTitle>
        <DialogContent>
          <DialogContentText id="leave-dialog-description">
            Are you sure you want to leave this trip?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaveDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLeave}
            backgroundColor="#FF7070"
            color="black"
          >
            Leave
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
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Increase the opacity here
          },
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this trip?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            style={{ backgroundColor: "#BCFFE3", color: "black" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            backgroundColor="#FF7070"
            color="black"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for selecting a new admin */}

      <Dialog
        open={openDialogNewAdmin}
        onClose={handleCloseNewAdminDialog}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Increase the opacity here
          },
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle>Select New Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a new admin for this trip:
          </DialogContentText>
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
                <ListItemText primary={member.username} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAdminDialog} color="primary">
            Cancel
          </Button>
          <Button
            backgroundColor="#FFB703"
            color="black"
            onClick={handleSelectNewAdmin}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default TripOverview;
