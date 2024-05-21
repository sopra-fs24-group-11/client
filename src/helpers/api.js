import axios from "axios";
import { getDomain } from "./getDomain";

export const api = axios.create({
  baseURL: getDomain(),
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
});

export const api2 = axios.create({
  baseURL: getDomain(),
  headers: { "Content-Type": "application/img", "Access-Control-Allow-Origin": "*" }
});

export const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log("The request was made and answered but was unsuccessful.", error.response);
    
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      alert("No Internet Connection! / The server cannot be reached.\nDid you start it?");
    }

    console.log("Something else happened.", error);
    
    return error.message;
  }
};

export const handleError1 = (error, handleAlert, errorMessage, severity) => {
  if (error === false) {
    handleAlert(errorMessage, severity);
    return;
  }
  if (error && error.message && error.message.match(/Network Error/)) {
    handleAlert("Kein Internet!", "error");
    return;
  }
  if (errorMessage === "") {
    errorMessage = "Es gab einen Fehler.";
  }
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
      if (response.status.toString().startsWith("4")) {
        errorMessage = response.data.message; // Use Server error message instead of client-provided one.
      }
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }
    handleAlert(errorMessage, "warning")
    console.log("The request was made and answered but was unsuccessful:", error.response);
  } else {
    handleAlert("" + error)
    console.log("The request was made and answered but was unsuccessful.", error);
  }
};
