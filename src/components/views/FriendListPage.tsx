// =================================================================

import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import LinearIndeterminate from "components/ui/loader";
import "../../styles/views/FriendListPage.scss";
import { Input } from "components/ui/input";
import {
  Dialog as DialogSCN,
  DialogContent as DialogContentSCN,
  DialogClose as DialogCloseSCN,
  DialogHeader as DialogHeaderSCN,
  DialogTitle as DialogTitleSCN,
  DialogDescription as DialogDescriptionSCN,
  DialogFooter as DialogFooterSCN,
  DialogTrigger as DialogTriggerSCN,
} from "components/ui/dialog";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { HashLoader, ScaleLoader } from "react-spinners";
import ProgressHearts from "components/ui/ProgressHearts";

const FriendListPage = ({ alertUser }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [friendList, setFriendList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const closeDialogRef = useRef(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/users/friends", {
        headers: { Authorization: token },
      });

      let x = response.data.sort((a, b) =>
        a.username.localeCompare(b.username)
      );

      setFriendList(x);
      console.log("Friend list: ", x);
    } catch (error) {
      alertUser("error", "Couldn't fetch the friend list.", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get("/users/friends/requests", {
        headers: { Authorization: token },
      });
      setFriendRequests(response.data); // Assuming this is an array of friend requests
    } catch (error) {
      alertUser("error", "Couldn't fetch the friend requests.", error);
    }
  };

  const handleAcceptFriendRequest = async (friendRequestId) => {
    try {
      await api.put(
        `/users/friends/${friendRequestId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      alertUser("success", "Friend request accepted.");
      await fetchFriends();
      await fetchFriendRequests();
      if (closeDialogRef.current) {
        closeDialogRef.current.click();
      }
    } catch (error) {
      alertUser("error", "Couldn't accept the friend request.", error);
    }
  };

  const handleDenyFriendRequest = async (friendRequestId) => {
    try {
      await api.delete(`/users/friends/${friendRequestId}`, {
        headers: { Authorization: token },
      });
      alertUser("success", "Friend request denied.");
      await fetchFriends();
      await fetchFriendRequests();
      if (closeDialogRef.current) {
        closeDialogRef.current.click();
      }
    } catch (error) {
      alertUser("error", "Couldn't deny the friend request.", error);
    }
  };

  const handleSearchChange = async (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === "") {
      setSuggestions([]);
    } else {
      try {
        const response = await api.get(
          `/users/search?name=${event.target.value}`,
          {
            headers: { Authorization: token },
          }
        );
        setSuggestions(response.data); // Assuming this is an array of user objects
      } catch (error) {
        alertUser("error", "Query error. Try again.", error);
      }
    }
  };

  const handleSuggestionSelect = (friend) => {
    setSearchTerm(friend.username); // Set the username in the input field
    setSelectedFriend(friend); // Store the selected friend's data
    setSuggestions([]); // Clear suggestions
  };

  const handleOpenDeleteDialog = (friendId) => {
    setFriendToDelete(friendId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleRemoveFriend = async () => {
    // Perform deletion only if friendToDelete is set
    if (friendToDelete) {
      try {
        await api.delete(`/users/friends/${friendToDelete}`, {
          headers: { Authorization: token },
        });
        alertUser("success", "Friend removed.");
        // Remove the friend from the friendList in the UI after successful deletion
        setFriendList(
          friendList.filter((friend) => friend.friendId !== friendToDelete)
        );
        // Reset the friendToDelete state and close dialog
        setFriendToDelete(null);
        setOpenDeleteDialog(false);
      } catch (error) {
        alertUser("error", "Couldn't remove the friend.", error);
      }
    }
  };

  const handleAddFriendSubmit = async () => {
    if (selectedFriend) {
      try {
        console.log("SELECTED FRIEND", selectedFriend);
        await api.post(
          `/users/friends/${selectedFriend.id}`,
          {},
          {
            headers: { Authorization: token },
          }
        );
        alertUser("success", "Friend request sent.");
        // Refresh the friend list to show the newly added friend
        fetchFriends();
        setSearchTerm(""); // Clear the search term
        setSelectedFriend(null); // Clear the selected friend
        if (closeDialogRef.current) {
          closeDialogRef.current.click();
        }
      } catch (error) {
        if (closeDialogRef.current) {
          closeDialogRef.current.click();
        }
        alertUser("error", "Couldn't send the friend request.", error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchFriends();
      await fetchFriendRequests();
      console.log("------ FETCHED FRIENDS AND REQUESTS ------");
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
    <>
      <div className="friend-list-page">
        <h1>Deine Freundesliste</h1>
        {friendList.length > 0 ? (
          <ul className="friend-list">
            {friendList.map((friend) => (
              <li key={friend.friendId} className="friend">
                <span className="name">{friend.username}</span>
                <ProgressHearts points={friend.points}/>
                <div className="stage">Level: {Math.floor(friend.level)}</div>
                <Button
                  className="remove-friend"
                  onClick={() => handleOpenDeleteDialog(friend.friendId)}
                >
                  X
                </Button>
                <Dialog
                  open={openDeleteDialog}
                  onClose={handleCloseDeleteDialog}
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
                      Bist du sicher, dass du diesen Freund löschen willst?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDeleteDialog}
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
                        handleRemoveFriend();
                        handleCloseDeleteDialog();
                      }}
                      style={{ backgroundColor: "#FF7070", color: "black" }}
                    >
                      Löschen
                    </Button>
                  </DialogActions>
                </Dialog>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-friends-message">
            Noch keine Freunde. Klicke auf &quot;Neuen Freund hinzufügen&quot;,
            um eine Anfrage zu senden!
          </div>
        )}

        <h1>Freundschaftsanfragen</h1>
        {friendRequests.length > 0 ? (
          <ul className="friend-requests">
            {friendRequests.map((request) => (
              <li key={request.id} className="friend-request">
                <span className="name">{request.username}</span>
                <div className="accept-deny-buttons">
                  <Button
                    className="accept-request"
                    backgroundColor="#82FF6D"
                    onClick={() => handleAcceptFriendRequest(request.friendId)}
                  >
                    Annehmen
                  </Button>
                  <Button
                    className="deny-request"
                    backgroundColor={"red"}
                    onClick={() => handleDenyFriendRequest(request.friendId)}
                  >
                    Ablehnen
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-requests-message">
            Keine Freundschaftsanfragen. Schaue später wieder vorbei oder
            schicke deine eigenen Anfragen!
          </div>
        )}

        <div className="action-buttons">
          <Button
            className="back-button"
            backgroundColor="#FFB703"
            color="black"
            onClick={() => navigate("/dashboard")}
          >
            Zurück zum Dashboard
          </Button>
          <DialogSCN>
            <DialogTriggerSCN asChild>
              <Button
                className="add-friend-button"
                backgroundColor="#FB8500"
                color="black"
              >
                Neuen Freund hinzufügen
              </Button>
            </DialogTriggerSCN>
            <DialogContentSCN>
              <DialogHeaderSCN>
                <DialogTitle>Add New Friend</DialogTitle>
                <DialogDescriptionSCN>
                  Gebe den Benutzernamen deines Freundes ein, um eine Anfrage zu
                  senden.
                </DialogDescriptionSCN>
              </DialogHeaderSCN>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="input"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list bg-gray-100">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.friendId}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.username}
                    </li>
                  ))}
                </ul>
              )}
              <DialogFooterSCN>
                <Button
                  onClick={handleAddFriendSubmit}
                  backgroundColor="#14AE5C"
                >
                  Freundschaftsanfrage senden
                </Button>
              </DialogFooterSCN>
              <DialogCloseSCN ref={closeDialogRef} className="hidden" />
            </DialogContentSCN>
          </DialogSCN>
        </div>
      </div>
    </>
  );
};

export default FriendListPage;

FriendListPage.propTypes = {
  alertUser: PropTypes.func,
};
