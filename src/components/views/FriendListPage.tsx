import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Progress } from "../ui/progress";
import PropTypes from "prop-types";
import "../../styles/views/FriendListPage.scss";
import LinearIndeterminate from "components/ui/loader";

const FriendListPage = () => {
  const navigate = useNavigate();

  // Example friends data - replace with actual data from your state
  const friends = [
    { name: "Alberto A.", stage: 2, progress: 66 },
    { name: "Alberto B.", stage: 1, progress: 30 },
    { name: "Alberto C.", stage: 3, progress: 86 },
    { name: "Alberto D.", stage: 1, progress: 16 },
    { name: "Verylong Name", stage: 1, progress: 16 },
    { name: "Alberto F.", stage: 1, progress: 16 },
    { name: "Alberto G.", stage: 1, progress: 16 },
    { name: "Alberto H.", stage: 1, progress: 16 },
  ];

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleAddFriendClick = () => {
    // Implement the logic to add a new friend
  };

  const handleRemoveFriend = (name) => {
    // Implement the logic to remove a friend
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <>
      <div className="friend-list-page">
        <h1>Your Friend List</h1>
        <ul className="friend-list">
          {friends.map((friend) => (
            <li key={friend.name} className="friend">
              <span className="name">{friend.name}</span>
              <Progress className="progress-bar" value={friend.progress} />
              <div className="stage">Stage: {friend.stage}</div>
              <Button
                className="remove-friend"
                onClick={() => handleRemoveFriend(friend.name)}
              >
                X
              </Button>
            </li>
          ))}
        </ul>
        <div className="action-buttons">
          <Button
            className="back-button"
            backgroundColor="#DD2E2E"
            color="white"
            onClick={handleBackClick}
          >
            Back to Dashboard
          </Button>
          <Button
            className="add-friend-button"
            backgroundColor="#14AE5C"
            color="white"
            onClick={handleAddFriendClick}
          >
            Add new Friend
          </Button>
        </div>
      </div>
    </>
  );
};

export default FriendListPage;
