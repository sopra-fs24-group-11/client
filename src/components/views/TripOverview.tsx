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

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);

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

  const handleOpenLeaveDialog = () => {
    if (isAdmin) {
      // If the user is an admin, prompt them to select a new admin before leaving
      setSnackbarMessage("Please select a new admin before leaving the trip!");
      setSnackbarSeverity("error"); // Change the Snackbar to red
      setSnackbarOpen(true);
    } else {
      // If the user is not an admin, ask for confirmation to leave the trip
      setDialogType("leave");
      setOpenDialog(true);
    }
  };

  const handleOpenDeleteDialog = () => {
    setDialogType("delete");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType(null);
  };

  const handleConfirmLeave = async () => {
    handleCloseDialog();

    try {
      await api.delete(`/trips/${tripId}/exit`, {
        headers: { Authorization: token },
      });
      setSnackbarMessage("You have left the trip.");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/dashboard"), 3000);
      console.log("TRIP LEFT!!!");
    } catch (error) {
      handleError(error);
    }
  };

  const handleConfirmDelete = async () => {
    handleCloseDialog(); // Close the dialog first
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
            Desired arrival time:{" "}
            {new Date(currentTrip.meetUpTime).toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
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
              onClick={handleBackClick}
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
      
      <div className="lists-container">
        <div className="todo-list-container">
          <h2 className="ul_title">To-Do List</h2>
        </div>

        <div className="packing-lists-container">
          <h2 className="ul_title">Group Packing List</h2>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ fontFamily: "M PLUS Rounded 1c" }}
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === "delete" ? "Confirm Deletion" : "Confirm Leave"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogType === "delete"
              ? "Are you sure you want to delete this trip?"
              : "Are you sure you want to leave this trip?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            style={{ backgroundColor: "#BCFFE3", color: "black" }}
          >
            Cancel
          </Button>
          <Button
            onClick={
              dialogType === "delete" ? handleConfirmDelete : handleConfirmLeave
            }
            style={{ backgroundColor: "#FF7070", color: "black" }}
            autoFocus
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
