import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
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

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [secondPassword, setSecondPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [birthday, setBirthday] = useState<string>(null);
  const [email, setMail] = useState<string>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleBirthdayChange = (event) => {
    const { value } = event.target;
    setBirthday(value);
  };

  const validatePassword = () => {
    if (password !== secondPassword) {
      throw new Error("Passwords do not match!");
    }
  }; 

  const doRegister = async () => {
    try {
      validatePassword();

      const requestBody = JSON.stringify({
        username,
        password,
        birthday,
        email,
      });
      const response = await api.post("/users/register", requestBody);

      // Store the token into the local storage.
      localStorage.setItem("token", response.data);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/Dashboard");
    } catch (error) {
      handleError(error);
      if(error.response && error.response.data && error.response.data.message) {
        setSnackbarMessage(`There was en error. ${error.response.data.message}.`);
      } else {
        setSnackbarMessage(`There was en error. ${handleError(error)}.`);
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
          <h1>Register Form</h1>
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="E-Mail"
            value={email}
            onChange={(un: string) => setMail(un)}
          />
          <div className="register field">
            <label className="login label">Birthday</label>
            <input
              className="register input"
              type="date"
              placeholder="enter here.."
              value={birthday}
              onChange={handleBirthdayChange}
            />
          </div>
          <FormField
            label="Password"
            value={password}
            isPassword
            onChange={(n) => setPassword(n)}
          />
          <FormField
            label="Re-Enter Password"
            value={secondPassword}
            isPassword
            onChange={(n) => setSecondPassword(n)}
          />
          <div className="register button-container ">
            <Button
              disabled={
                !username || !password || !secondPassword || !email || !birthday
              }
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
          <div className="register button-container ">
            <Button
              backgroundColor={"#FFB703"}
              width="100%"
              onClick={() => navigate("/login")}
            >
              go to login
            </Button>
          </div>
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

export default Register;
