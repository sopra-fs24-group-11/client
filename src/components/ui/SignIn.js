import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import PropTypes from "prop-types";

SignInForm.propTypes = {
  alertUser: PropTypes.func.isRequired,
};

function SignInForm({ alertUser }) {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { username, password } = state;

    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/login", requestBody);

      localStorage.setItem("token", response.data);
      navigate("/dashboard");
    } catch (error) {
      //alert("ERROR: "+ error);
      alertUser("error", "username or password are wrong.", error);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="h1_reg">Mit Profil anmelden</h1>
        <input
          className="inputreg"
          type="text"
          placeholder="Benutzername"
          name="username"
          value={state.username}
          onChange={handleChange}
        />
        <input
          className="inputreg"
          type="password"
          name="password"
          placeholder="Passwort"
          value={state.password}
          onChange={handleChange}
        />
        <a className="a_reg" href="#" onClick={() => alertUser("warning", "Passwort kann zum aktuellen Zeitpunkt nicht zurückgesetzt werden. Erstellen Sie einen neuen Account.")}>Passwort vergessen?</a>
        <button className="buttonreg">Jetzt Anmelden</button>
      </form>
    </div>
  );
}

export default SignInForm;
