import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
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
const mockConnections = [
  {
    name: "You",
    startTime: "12:16",
    expectedArrival: "14:04",
    progress: 80, // This is a percentage of the progress bar.
    transportType: "car", // This could be 'train', 'bus', 'car', etc.
  },
  {
    name: "Ulf Z.",
    startTime: "12:01",
    expectedArrival: "14:08",
    progress: 60,
    transportType: "train",
  },
  {
    name: "Beni W.",
    startTime: "12:34",
    expectedArrival: "14:05",
    progress: 50,
    transportType: "bus",
  },
  {
    name: "Christiane B.",
    startTime: "12:11",
    expectedArrival: "14:10",
    progress: 75,
    transportType: "car",
  },
  {
    name: "Thomas F.",
    startTime: "12:11",
    expectedArrival: "14:10",
    progress: 90,
    transportType: "train",
  },
];

const ConnectionItem = ({ connection }) => {
  return (
    <div className="connection-item">
      <h3 className="connection-name">{connection.name}</h3>
      <p className="start-text">start time: {connection.startTime}</p>
      <span className={`icon ${connection.transportType}`}></span>
      <Progress className="progress-bar" value={connection.progress} />
      <p className="arrival-text">
        expected arrival: {connection.expectedArrival}
      </p>
    </div>
  );
};
ConnectionItem.propTypes = {
  connection: PropTypes.object.isRequired,
};

// ============== MAIN FUNCTION ==============
const TripOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
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
    }, 1200); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/connections`);
        setConnections(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    //fetchConnections();
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="main-container">
      <h1 className="main-title">Trip Overview</h1>
      <div className="current-locations-container">
        <h1 className="current-locations-title">
          Current location of trip participants
        </h1>
        <div className="connections-list">
          {mockConnections.map((connection, index) => (
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
      :
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
