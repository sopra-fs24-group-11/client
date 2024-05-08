import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import PropTypes from "prop-types";

SignUpForm.propTypes = {
  alertUser: PropTypes.func.isRequired,
};

function SignUpForm({ alertUser }) {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    password2: "",
  });



  const handleBirthdayChange = (event) => {
    const { value } = event.target;
    setState({
      ...state,
      birthday: value,
    });
  };

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { username, email, birthday, password, password2 } = state;

    try {
      
      const requestBody = JSON.stringify({
        username,
        password,
        password2,
        birthday,
        email,
      });
      const response = await api.post("/users/register", requestBody);

      localStorage.setItem("token", response.data);
      navigate("/dashboard");
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>

        <span>
          Bitte fülle das untenstehende Formular aus um einen Account zu
          erstellen.
        </span>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Benutzername"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email-Adresse"
        />
        <input
          type="date"
          placeholder="enter here.."
          value={state.birthday}
          onChange={handleBirthdayChange}
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Passwort"
        />
        <input
          type="password"
          name="password2"
          value={state.password2}
          onChange={handleChange}
          placeholder="Passwort bestätigen"
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
