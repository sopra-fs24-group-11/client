import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Label } from "../ui/label";
import LinearIndeterminate from "components/ui/loader";
import "../../styles/views/UserProfile.scss";

// Main Profile component
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    birthday: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userdata = await api.get("/users", {
          headers: { token },
        });
        const user: User = userdata.data;
        setUser(user);
        setEditedUser({
          username: user.username,
          email: user.email,
          birthday: user.birthday || "",
        });

        getAvatar();
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);

  const getAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users/image", {
        headers: { token },
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setUser((prevUser) => ({
        ...prevUser,
        avatar: imageUrl,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAvatar(event.target.files[0]);
      setSelectedFileName(event.target.files[0].name);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append("image", avatar); // Match the server's expected parameter name

    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/users/image", formData, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 204) {
        setSelectedFileName("");
        // If the user previously had an avatar, revoke the object URL to free up memory
        if (user.avatar) {
          URL.revokeObjectURL(user.avatar);
        }

        const imageUrl = URL.createObjectURL(avatar);
        setUser((prevUser) => ({
          ...prevUser,
          avatar: imageUrl, // This should trigger a re-render of the component displaying the avatar
        }));
        setAvatar(null); // Clear the avatar state
        alert("Avatar uploaded successfully.");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete("/users/image", {
        headers: { token },
      });
      getAvatar();
      setSelectedFileName("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async () => {
    const updatedUser = {
      username: editedUser.username,
      email: editedUser.email,
      birthday: editedUser.birthday,
      password: "q", // Dummy password to pass validation
    };

    try {
      const token = localStorage.getItem("token");
      await api.put("/users", updatedUser, {
        headers: { token },
      });
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setEditMode(false);
      alert("Profile updated successfully.");
    } catch (error) {
      handleError(error);
      alert("There was an error: " + error);
    }
  };

  const handleCancel = () => {
    setSelectedFileName("");
    setEditMode(false);
    setEditedUser({
      username: user?.username || "",
      email: user?.email || "",
      birthday: user?.birthday || "",
    });
  };

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <div className="profile-page-container">
      <div className="avatar-and-text pt-10 pb-10">
        {user && (
          <div className="avatar-and-buttons">
            <img className="avatar" src={user.avatar} alt="User Avatar" />
            {editMode && (
              <div className="avatar-buttons">
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="file"
                    className="choose-file"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="file" className="file-upload-btn">
                    Datei auswählen
                  </label>
                  <span className="file-selected">
                    {selectedFileName || "Keine ausgewählt"}
                  </span>
                </div>
                <Button
                  backgroundColor={"#6E90AE"}
                  onClick={handleAvatarUpload}
                >
                  Upload Avatar
                </Button>
                <Button
                  backgroundColor={"#6E90AE"}
                  onClick={handleAvatarDelete}
                >
                  Delete Avatar
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="text">
          <h1 className="title font-extrabold text-3xl">Profile</h1>
          {editMode ? (
            <>
              <Label className="label">Username</Label>
              <input
                type="text"
                value={editedUser.username}
                name="username"
                onChange={handleChange}
              />
              <Label className="label">Email</Label>
              <input
                type="email"
                value={editedUser.email}
                name="email"
                onChange={handleChange}
              />
              <Label className="label">Birthday</Label>
              <input
                type="date"
                value={editedUser.birthday}
                name="birthday"
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <Label className="label">Username</Label>
              <p>{user.username}</p>
              <Label className="label">Email</Label>
              <p>{user.email}</p>
              <Label className="label">Birthday</Label>
              <p>{user.birthday}</p>
              <Label className="label">Creation Date</Label>
              <p>{user.creationDate}</p>
            </>
          )}
          <div className="buttons-container">
            {editMode ? (
              <>
                <Button backgroundColor={"#FFB703"} onClick={handleSubmit}>
                  Save Changes
                </Button>
                <Button backgroundColor={"#E63946"} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  backgroundColor={"#FFB703"}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  backgroundColor={"#FB8500"}
                  onClick={() => navigate("/Dashboard")}
                >
                  Back to Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
