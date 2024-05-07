import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";



function SignInForm({alertUser}) {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    Username: "",
    Password: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { Username, Password } = state;
    
    try {
      const requestBody = JSON.stringify({ Username, Password });
      const response = await api.post("/users/login", requestBody);

      localStorage.setItem("token", response.data);
      navigate("/dashboard");
    } catch (error) {
      alertUser("error", "Username or password are wrong.", error)
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <input
          type="email"
          placeholder="Username"
          name="Username"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="Password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
