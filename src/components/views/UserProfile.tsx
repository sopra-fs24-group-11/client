import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Label } from "../ui/label";
import PropTypes from "prop-types";
import "../../styles/views/UserProfile.scss";
import defaultImage from "../../graphics/Get-Together.png";
import { ScaleLoader } from "react-spinners";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

// Main Profile component
const ProfilePage: React.FC = ({ alertUser }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>({}); // Hier ist das Problem: ihr setzt user = null und React versucht unten user.username etc. zu rendern. ==> Error
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    birthday: "",
  });
  const [passwords, setPasswords] = useState({
    password: "",
    password2: "",
  });
  const [isDeleted, setDeleted] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

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
        });
        getAvatar();
      } catch (error) {
        alertUser("error", "Etwas ging schief.", error);
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
      alertUser("error", "Profilbild konnte nicht geladen werden.", error);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && event.target.files[0].type) {
      if (event.target.files[0].type.match("image.*")) {
        // checks if image is of MIME image type
        if (event.target.files[0].size < 3*1024*1024) {
          setAvatar(event.target.files[0]);
          setSelectedFileName(event.target.files[0].name);
        } else {
          alertUser("error", "Das File ist grösser als 3MB.");
        }
      } else {
        alertUser("error", "Das File muss ein Bild sein.");
      }
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) {
      alertUser("error", "Wähle zuerst ein File aus!");
      return;
    }

    const formData = new FormData();
    formData.append("image", avatar); 

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
        alertUser("success", "Das Bild wurde hochgeladen und gespeichert.");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      alertUser("error", "Das Bild konnte nicht gespeichert werden.", error);
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
      alertUser("success", "Profilbild gelöscht und neues Default Profilbild erstellt.");
    } catch (error) {
      alertUser("error", "Das Bild konnte nicht gelöscht werden.", error);
    }
  };

  const handleSubmit = async () => {
    const updatedUser = {
      username: editedUser.username,
      email: editedUser.email,
      birthday: editedUser.birthday,
    };

    try {
      const token = localStorage.getItem("token");
      await api.put("/users", updatedUser, {
        headers: { Authorization: token },
      });
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setEditMode(false);
      alertUser("success", "Profil erfolgreich geändert.");
    } catch (error) {
      alertUser("error", "Das Profil konnte nicht geändert werden.", error);
    }
  };

  const handleNewPasswordSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put("/password", passwords, {
        headers: { Authorization: token },
      });
      setPasswords({ password: "", password2: "" });
      setEditMode(false);
      alertUser("success", "Passwort erfolgreich geändert.");
    } catch (error) {
      alertUser("error", "Das Passwort konnte nicht geändert werden.", error);
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
    setPasswords({ password: "", password2: "" });
  };

  const handleProfileDelete = async () => {
    // logic to delete the item
    try {
      const token = localStorage.getItem("token");
      await api.delete("/users", {
        headers: { Authorization: token },
      });
      setDeleted(true);
      localStorage.removeItem("token");
    } catch (error) {
      alertUser("error", "", error);
    }

    
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader
          color="hsla(227, 0%, 100%, 1)"
          height={50}
          margin={4}
          radius={40}
          width={8}
        />
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="avatar-and-text">
        {user && (
          <div className="avatar-and-buttons">
            {user.avatar ? (
              <img className="avatar" src={user.avatar} alt="User Avatar" />
            ) : (
              <img className="avatar" src={defaultImage} />
            )}
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
                  Bild speichern
                </Button>
                <Button
                  backgroundColor={"#6E90AE"}
                  onClick={handleAvatarDelete}
                >
                  Bild löschen
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="text">
          {editMode ? (
            <>
              <Label className="label">Benutzername</Label>
              <input
                className="input-username"
                type="text"
                value={editedUser.username}
                name="username"
                onChange={handleChange}
              />
              <Label className="label">Email</Label>
              <input
                className="input-email"
                type="email"
                value={editedUser.email}
                name="email"
                onChange={handleChange}
              />
              <Label className="label">Geburtsdatum</Label>
              <input
                className="input-birthday"
                type="date"
                value={editedUser.birthday}
                name="birthday"
                onChange={handleChange}
              />
              <div className="buttons-container">
                <Button backgroundColor={"#FFB703"} onClick={handleSubmit}>
                  Speichern
                </Button>
                <Button backgroundColor={"#E63946"} onClick={handleCancel}>
                  Abbrechen
                </Button>
              </div>
              <Label className="label">Neues Passwort</Label>
              <input
                className="input-password"
                type="password"
                value={passwords.password}
                name="password"
                onChange={handlePasswordChange}
              />
              <Label className="label">Passwort bestätigen</Label>
              <input
                className="input-password"
                type="password"
                value={passwords.password2}
                name="password2"
                onChange={handlePasswordChange}
              />
              <div className="buttons-container">
                <Button
                  backgroundColor={"#FFB703"}
                  onClick={handleNewPasswordSubmit}
                >
                  Passwort speichern
                </Button>
                <Button backgroundColor={"#E63946"} onClick={handleCancel}>
                  Abbrechen
                </Button>
              </div>
            </>
          ) : (
            <>
              <Label className="label">Benutzername:</Label>
              <p>{user.username}</p>
              <Label className="label">Email:</Label>
              <p>{user.email}</p>
              <Label className="label">Geburtsdatum:</Label>
              <p>{new Date(user.birthday).toLocaleDateString(
                    "de-DE",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}</p>
              <Label className="label">Nutzer seit:</Label>
              <p>{new Date(user.creationDate).toLocaleDateString(
                    "de-DE",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}</p>
              <div className="buttons-container">
                <Button
                  backgroundColor="#a2d2ff"
                  onClick={() => navigate("/dashboard")}
                >
                  Zurück zum Dashboard
                </Button>
                <Button
                  backgroundColor={"#FFB703"}
                  onClick={() => setEditMode(true)}
                >
                  Account anpassen
                </Button>
                <Button
                  backgroundColor={"#FF0006FF"}
                  onClick={() => {
                    // opens popup for confirmation of deletion
                    setOpenDeleteDialog(true);
                  }}
                >
                  Account löschen
                </Button>
                <Dialog
                  open={openDeleteDialog}
                  onClose={() => setOpenDeleteDialog(false)}
                  sx={{
                    "& .MuiBackdrop-root": {
                      backgroundColor: "rgba(0, 0, 0, 0.8)", // Increase the opacity here
                    },
                    "& .MuiPaper-root": {
                      // Targeting the Paper component inside the Dialog
                      boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <DialogTitle id="delete-dialog-title">
                    Bestätige die Löschung
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                      Bist du sicher, dass du dein Profil löschen willst? Die Löschung ist endgültig.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenDeleteDialog(false)}
                      style={{ backgroundColor: "#BCFFE3", color: "black" }}
                      width={null}
                      height={null}
                      backgroundColor={null}
                      color={null}
                      className={null}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenDeleteDialog(false);
                        handleProfileDelete();
                      }}
                      style={{ backgroundColor: "#FF7070", color: "black" }}
                    >
                      Löschen
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={isDeleted}
                  onClose={() => navigate("/registernew")}
                  sx={{
                    "& .MuiBackdrop-root": {
                      backgroundColor: "rgba(0, 0, 0, 0.8)", // Increase the opacity here
                    },
                    "& .MuiPaper-root": {
                      // Targeting the Paper component inside the Dialog
                      boxShadow: "5px 15px 20px rgba(0, 0, 0, 1)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <DialogTitle id="delete-dialog-title">
                    Das Profil wurde gelöscht.
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      onClick={() => navigate("/registernew")}
                      style={{ backgroundColor: "#FF7070", color: "black" }}
                    >
                      Beenden
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

ProfilePage.propTypes = {
  alertUser: PropTypes.func,
};
