import React, { useState } from "react";
import { handleError1 } from "helpers/api";
import AppRouter from "./components/routing/routers/AppRouter";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const App = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // how to call this in case of success: alertUser("success", "blabla")
  // how to call this in case of error: alertUser("error", "blabla", error)
  const alertUser = (severity, message="", error=false) => {
    const handleAlert = (msg, sev) => {
      setSnackbarMessage(msg)
      setSnackbarSeverity(sev);
      setSnackbarOpen(true);
    }
    handleError1(error, handleAlert, message, severity);

  }

  return (
    <div className="" style={{ overflowX: 'hidden' }}>
      <AppRouter alertUser={alertUser}/>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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

export default App;
