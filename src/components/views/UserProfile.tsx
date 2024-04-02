import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Label } from "../ui/label";
import LinearIndeterminate from "components/ui/loader";
import "../../styles/views/UserProfile.scss";
import ConfirmPopup from "../ui/ConfirmPopup";

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
    password: "",
  });
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [isDeleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userdata = await api.get("/users", {
          headers: { Authorization: token },
        });
        const user: User = userdata.data;
        setUser(user);
        setEditedUser({
          username: user.username,
          email: user.email,
          birthday: user.birthday || "",
          password: user.password,
        });
        console.log("USER FROM BACKEND:", user);

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
        headers: { Authorization: token },
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
      if (event.target.files[0].type.match("image.*")) {
        // checks if image is of MIME image type
        setAvatar(event.target.files[0]);
        setSelectedFileName(event.target.files[0].name);
      } else {
        alert("File is not an image");
      }
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) {
      alert("Waehle zuerst eine Datei aus");
      return;
    }

    const formData = new FormData();
    formData.append("image", avatar); // Match the server's expected parameter name

    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/users/image", formData, {
        headers: {
          Authorization: token,
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
      const response = await api.delete("/users/image", {
        headers: { Authorization: token },
      });
      if (response.status === 204) {
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
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
        headers: { Authorization: token }
      });
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setEditMode(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.log(error);
      if (error.response.data.status === 409) {
        alert(
          "Username can't be changed as selected username is already taken"
        );
      } else {
        handleError(error);
        alert("There was an error: " + error);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFileName("");
    setEditMode(false);
    setEditedUser({
      username: user?.username || "",
      email: user?.email || "",
      birthday: user?.birthday || "",
      password: user?.password || "",
    });
  };

  const handleProfileDelete = async () => {
    // logic to delete the item
    try {
      const token = localStorage.getItem("token");
      await api.delete("/users", {
        headers: { Authorization: token },
      });
      document.getElementsByClassName("popup");
    } catch (error) {
      handleError(error);
    }

    setPopupOpen(false);
    setDeleted(true);
    localStorage.removeItem("token");
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
                  backgroundColor={"#FF0006FF"}
                  onClick={() => {
                    // opens popup for confirmation of deletion
                    setPopupOpen(true);
                  }}
                >
                  Delete Profile
                </Button>

                <ConfirmPopup
                  // popup asks for confirmation of profile deletion
                  header="Are you sure you want to delete your profile?"
                  info="You won't be able to recover your account"
                  className="popup"
                  isOpen={isPopupOpen}
                >
                  <div>
                    <button
                      className="left confirm-button"
                      onClick={handleProfileDelete}
                    >
                      Yes
                    </button>
                    <button
                      className="right confirm-button"
                      onClick={() => setPopupOpen(false)}
                    >
                      No
                    </button>
                  </div>
                </ConfirmPopup>
                <ConfirmPopup
                  // popup tells the user when profile was deleted
                  header="Profile was deleted"
                  className="popup"
                  info=""
                  isOpen={isDeleted}
                >
                  <button
                    className="confirm-button"
                    onClick={() => navigate("/login")}
                  >
                    Return to Login
                  </button>
                </ConfirmPopup>
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
