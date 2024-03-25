import React, { useState, useEffect } from "react";
import { api, api2, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

import "../../styles/views/UserProfile.scss";
import LinearIndeterminate from "components/ui/loader";

// Main Profile component
const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Loader timeout effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  // Fetching image
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const userdata = await api.get("/users", {
          headers: { token: token },
        });
        const user: User = userdata.data;
        setUser(user);

        const response = await api.get("/users/image", {
          headers: { token: token },
          responseType: "blob",
        });
        console.log("RESPONSE", response.data);
        // Create a URL for the Blob
        const imageUrl = URL.createObjectURL(response.data);
        console.log(response.data);
        setUser((prevUser) => ({
          ...prevUser,
          avatar: imageUrl,
        }));

        // Revoke the Blob URL on cleanup
        return () => {
          URL.revokeObjectURL(imageUrl);
        };
      } catch (error) {
        handleError(error);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="profile-page-container">
      <div className="avatar-and-text pt-10 pb-10">
        {user && user.avatar && (
          <img className="avatar" src={user.avatar} alt="User" />
        )}
        <div className="text">
          <h1 className="title font-extrabold">Profile</h1>
          <Label className="label">Username</Label>
          <p>{user && user.username}</p>
          <Label className="label">Email</Label>
          <p>{user && user.email}</p>
          <Label className="label">Creation Date</Label>
          <p>{user && user.creationDate}</p>
          <Label className="label">Birthday</Label>
          <p>{user && user.birthday}</p>
          <Button
            backgroundColor={"#FB8500"}
            onClick={() => navigate("/Dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
