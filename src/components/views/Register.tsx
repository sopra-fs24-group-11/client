import React, { useState } from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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

const Register = ({alertUser}) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [password2, setPassword2] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [birthday, setBirthday] = useState<string>(null);
  const [email, setMail] = useState<string>(null);
  

  const handleBirthdayChange = (event) => {
    const { value } = event.target;
    setBirthday(value);
  };


  const doRegister = async () => {
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
      alertUser("error", "", error)      
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
            value={password2}
            isPassword
            onChange={(n) => setPassword2(n)}
          />
          <div className="register button-container ">
            <Button
              disabled={
                !username || !password || !password2 || !email || !birthday
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
    </BaseContainer>
  );
};

export default Register;

Register.propTypes = {
  alertUser: PropTypes.func,
}