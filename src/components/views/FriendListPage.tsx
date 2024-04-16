// =================================================================

import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Progress } from "../ui/progress";
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

const FriendListPage = () => {
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
      setFriendList(response.data);
      console.log("Friend list: ", response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get("/users/friends/requests", {
        headers: { Authorization: token },
      });
      setFriendRequests(response.data); // Assuming this is an array of friend requests
    } catch (error) {
      handleError(error);
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
      // Remove the accepted request from the list
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
      await fetchFriends();
      await fetchFriendRequests();
      if (closeDialogRef.current) {
        closeDialogRef.current.click();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDenyFriendRequest = async (friendRequestId) => {
    try {
      await api.delete(`/users/friends/${friendRequestId}`, {
        headers: { Authorization: token },
      });
      // Remove the denied request from the list
      setFriendRequests(
        friendRequests.filter((request) => request.id !== friendRequestId)
      );
      await fetchFriends();
      await fetchFriendRequests();
      if (closeDialogRef.current) {
        closeDialogRef.current.click();
      }
    } catch (error) {
      handleError(error);
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
        handleError(error);
      }
    }
  };

  const handleSuggestionSelect = (friend) => {
    setSearchTerm(friend.username); // Set the username in the input field
    setSelectedFriend(friend); // Store the selected friend's data
    setSuggestions([]); // Clear suggestions
  };

  const handleBackClick = () => {
    navigate("/dashboard");
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
        // Remove the friend from the friendList in the UI after successful deletion
        setFriendList(
          friendList.filter((friend) => friend.friendId !== friendToDelete)
        );
        // Reset the friendToDelete state and close dialog
        setFriendToDelete(null);
        setOpenDeleteDialog(false);
      } catch (error) {
        handleError(error);
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
        handleError(error);
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
    return <LinearIndeterminate />;
  }

  return (
    <>
      <div className="friend-list-page">
        <h1>Your Friend List</h1>
        {friendList.length > 0 ? (
          <ul className="friend-list">
            {friendList.map((friend) => (
              <li key={friend.friendId} className="friend">
                <span className="name">{friend.username}</span>
                <Progress className="progress-bar" value={friend.points} />
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
                    Confirm Deletion
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                      Are you sure you want to delete this friend?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDeleteDialog}
                      style={{ backgroundColor: "#BCFFE3", color: "black" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleRemoveFriend();
                        handleCloseDeleteDialog();
                      }}
                      style={{ backgroundColor: "#FF7070", color: "black" }}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-friends-message">
            No friends yet. Click on add new friend to send a request!
          </div>
        )}

        <h1>Friend Requests</h1>
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
                    Accept
                  </Button>
                  <Button
                    className="deny-request"
                    backgroundColor={"red"}
                    onClick={() => handleDenyFriendRequest(request.friendId)}
                  >
                    Deny
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-requests-message">
            No friend requests. Check back later or send your own requests!
          </div>
        )}

        <div className="action-buttons">
          <Button
            className="back-button"
            backgroundColor="#FFB703"
            color="black"
            onClick={handleBackClick}
          >
            Back to Dashboard
          </Button>
          <DialogSCN>
            <DialogTriggerSCN asChild>
              <Button
                className="add-friend-button"
                backgroundColor="#FB8500"
                color="black"
              >
                Add new Friend
              </Button>
            </DialogTriggerSCN>
            <DialogContentSCN>
              <DialogHeaderSCN>
                <DialogTitle>Add New Friend</DialogTitle>
                <DialogDescriptionSCN>
                  Enter the username of the friend you want to add.
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
                  Send Friend Request
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
