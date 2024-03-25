import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
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
    }, 3000); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  // Fetching image data effect
  useEffect(() => {
    async function fetchDataAndCheckEditability() {
      try {
        const token = localStorage.getItem("token");
        const responseimage = await api.get("/users/image", {
          headers: { token: token },
          responseType: "blob",
        });
        // Create a URL for the Blob
        const imageUrl = URL.createObjectURL(responseimage.data);
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
    fetchDataAndCheckEditability();
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="profile-page container">
      <div className="avatar-and-text pt-10 pb-10">
        {user && user.avatar && (
          <img className="avatar" src={user.avatar} alt="User" />
        )}
        <div className="text">
          <h1 className="title">Profile</h1>
          <Label>Username</Label>
          <p>{user && user.username}</p>
          <Label>Birthday</Label>
          <p>{user && user.birthday}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
