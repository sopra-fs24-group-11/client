import React, { useState } from "react";
import "../../styles/views/RegisterExampleNew.scss";
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
              <h1 className="h1_reg">Willkommen zurück!</h1>
              <p className="p_reg">
                Schön, dass du wieder da bist! Melde dich an und schau dir den Fortschritt deiner Kollegen an!
              </p>
              <button
                className="ghost buttonreg"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Anmelden
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="h1_reg">Hallo, Freund!</h1>
              <p className="p_reg">Gib deine Angaben ein und beginne deine Reise mit Kollegen!</p>
              <button
                className="ghost buttonreg"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Registrieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
