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
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "components/ui/dialog";

const FriendListPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [friendList, setFriendList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const closeDialogRef = useRef(null);

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

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

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

  const handleRemoveFriend = async (friendId) => {
    try {
      await api.delete(`/users/friends/${friendId}`, {
        headers: { Authorization: token },
      });
      // Remove the friend from the friendList in the UI after successful deletion
      setFriendList(
        friendList.filter((friend) => friend.friendId !== friendId)
      );
    } catch (error) {
      handleError(error);
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
              <div className="stage">Level: {friend.level}</div>
              <Button
                className="remove-friend"
                onClick={() => handleRemoveFriend(friend.friendId)}
              >
                X
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-friends-message">No friends yet. Click on add new friend to send a request!</div>
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
        <div className="no-requests-message">No friend requests. Check back later or send your own requests!</div>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="add-friend-button"
                backgroundColor="#FB8500"
                color="black"
              >
                Add new Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Friend</DialogTitle>
                <DialogDescription>
                  Enter the username of the friend you want to add.
                </DialogDescription>
              </DialogHeader>
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
              <DialogFooter>
                <Button
                  onClick={handleAddFriendSubmit}
                  backgroundColor="#14AE5C"
                >
                  Send Friend Request
                </Button>
              </DialogFooter>
              <DialogClose ref={closeDialogRef} className="hidden" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default FriendListPage;
