import React from "react";
function SignUpForm() {
  const [state, setState] = React.useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    secondPassword: "",
  });

  const validatePassword = () => {
    if (password !== secondPassword) {
      throw new Error("Passwords do not match!");
    }
  };

  const handleBirthdayChange = (event) => {
    const { value } = event.target;
    setBirthday(value);
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
    const { username, email, birthday, password } = state;

    try {
      validatePassword();

      const requestBody = JSON.stringify({
        username,
        password,
        birthday,
        email,
      });
      const response = await api.post("/users/register", requestBody);

      localStorage.setItem("token", response.data);
      navigate("/dashboard");
    } catch (error) {
      alert("ERROR: " + error);
      //alertUser("error", "", error);
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
          name="secondPassword"
          value={state.secondPassword}
          onChange={handleChange}
          placeholder="Passwort bestätigen"
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
