import React, { useState } from "react";
import "../../styles/views/RegisterExampleNew.css";
import SignInForm from "../ui/SignIn";
import SignUpForm from "../ui/SignUp";
import PropTypes from "prop-types";

RegisterExampleNew.propTypes = {
  alertUser: PropTypes.func.isRequired,
};

export default function RegisterExampleNew({ alertUser}) {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };

  const containerClass =
    "containertest " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="top-container">
      <div className={containerClass} id="containertest">
        <SignUpForm alertUser={alertUser}/>
        <SignInForm alertUser={alertUser}/>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="h1_reg">Welcome Back!</h1>
              <p className="p_reg">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost buttonreg"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="h1_reg">Hello, Friend!</h1>
              <p className="p_reg">Enter your personal details and start journey with us</p>
              <button
                className="ghost buttonreg"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
