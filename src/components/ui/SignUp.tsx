import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";

interface SignInFormProps {
  alertUser: (type: string, message: string, error?: any) => void;
}

interface State {
  username: string;
  password: string;
}

function SignInForm({ alertUser }: SignInFormProps) {
  const navigate = useNavigate();
  const [state, setState] = useState<State>({
    username: "",
    password: "",
  });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { username, password } = state;

    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/login", requestBody);

      localStorage.setItem("token", response.data);
      navigate("/dashboard");
    } catch (error) {
      alertUser("error", "Benutzername oder Passwort ist falsch.", error);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form className="Register-Login-form" onSubmit={handleOnSubmit}>
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
        <a
          className="a_reg"
          href="#"
          onClick={() => alertUser("warning", "Passwort kann zum aktuellen Zeitpunkt nicht zurückgesetzt werden. Erstellen Sie einen neuen Account.")}
        >
          Passwort vergessen?
        </a>
        <button className="buttonreg">Jetzt Anmelden</button>
      </form>
    </div>
  );
}

export default SignInForm;