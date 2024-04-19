import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const FormField = (props) => {

  const inputType = props.isPassword ? "password" : "text";
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="register field">
      <label className="login label">{props.label}</label>
      <input
        className="register input"
        placeholder="enter here.."
        type={inputType}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isPassword: PropTypes.bool
};

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/login", requestBody);

      // Store the token into the local storage.
      localStorage.setItem("token", response.data);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/Dashboard");
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Username or password are wrong.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            isPassword
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container mb-5">
            <Button
              className={"drop-shadow-xl"}
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          <Button
            className={"drop-shadow-xl"}
            backgroundColor="#FFB703"
            onClick={() => navigate("/register")}
          >
            go to register
          </Button>
        </div>
      </div>
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
    </BaseContainer>
  );
};

export default Login;
