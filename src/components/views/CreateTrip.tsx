import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import image from "../../graphics/add.png";
import { Button } from "components/ui/Button";
import "styles/views/Flex.scss";
import BaseContainer from "components/ui/BaseContainer";
import DateTimePicker from "react-datetime-picker";
import LinearIndeterminate from "components/ui/loader";

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

const CreateTrip = () => {
  const navigate = useNavigate();

  // used for displaying
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // used to manage trip
  const [tripAdmin, setTripAdmin] = useState<User>(null);

  // used to send to backend
  const [tripName, setTripName] = useState<string>("");
  const [temporaryMeetUpPlace, setTemporaryMeetUpPlace] = useState<string>("");
  const [temporaryMeetUpCode, setTemporaryMeetUpCode] = useState<string>("1234");
  const [tripDescription, setTripDescription] = useState<string>("");
  const [friends, setFriends] = useState<Record<number, string>>({});
  const [meetUpTime, setMeetUpTime] = useState<string>("");

  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const closeDialogRef = useRef(null);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminData = await api.get("/users", {
        headers: { Authorization: token },
      });

      // hier checken, ob wirklich das Richte zurück kommt!!!
      const admin: User = adminData.data;
      setTripAdmin(admin);

    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const createNewTrip = async () => {
    try {
      const participants: number[] = Object.keys(friends).map(Number);
      const requestBody = JSON.stringify({
        tripName,
        tripDescription,
        participants,
        temporaryMeetUpPlace,
        temporaryMeetUpCode,
        meetUpTime
      });

      const token = localStorage.getItem("token");
      const response = await api.post("/trips/new", requestBody, {
        headers: { Authorization: token },
      });

      console.log("Response: ", response);
      console.log("RequestBody: ", requestBody);

      navigate("/chooseConnection");

    } catch (error) {
      handleError(error);
    }
  };

  const cancelTrip = () => {
    navigate("/Dashboard");
  };

  const addParticipant = (key: number, value: string) => {
    setFriends(prevDictionary => ({
      ...prevDictionary,
      [key]: value
    }));
  }

  const removeParticipant = (key: number) => {
    const { [key]: deletedUser, ...rest } = friends; 
    setFriends(rest);
  }

  const handleSearchChange = async (event) => {
    const token = localStorage.getItem("token")
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === "") {
      setSuggestions([]);
    } else {
      try {
        const response = await api.get(`/users/search?name=${event.target.value}`,
          {
            headers: { Authorization: token },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleSuggestionSelect = (friend) => {
    setSearchTerm(friend.username); 
    setSelectedFriend(friend);
    setSuggestions([]);
  };

  const handleAddFriendSubmit = () => {
    if (selectedFriend) {
      addParticipant(selectedFriend.id, selectedFriend.username);
      setSearchTerm("");
    }
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  if (isLoading) {
    return <LinearIndeterminate />;
  }

  return (
    <BaseContainer>
      <div className="flex container">
        <div className="flex outer-form">
          <h1 className="text-3xl mb-5 font-bold"> Create New Trip</h1>
          <div className="flex inner-form">
            <div className="flex row-form">
              <div className="flex box">
                <label>Trip Name:</label>
                <input
                  className="input"
                  placeholder="enter..."
                  onChange={(e) => setTripName(e.target.value)}
                ></input>
                <br></br>

                <label>Target Location:</label>
                <input
                  className="flex input"
                  placeholder="enter..."
                  onChange={(e) => setTemporaryMeetUpPlace(e.target.value)}
                ></input>
              </div>
                <div className="flex box">
                  <label>Trip Description:</label>
                  <textarea
                    className="flex input-large"
                    placeholder="enter..."
                    onChange={(e) => setTripDescription(e.target.value)}
                  ></textarea>
                </div>
            </div>
            <div className="flex row-form">
              <div className="flex box">
                <label>Select Time & Date of Arrival:</label>
                <input
                  className="flex date"
                  type="datetime-local"
                  value={meetUpTime}
                  onChange={(e) => setMeetUpTime(e.target.value)}
                ></input>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex bar">
                  <label>Add Friends to current Trip: </label>
                  <img className="flex image" src={image} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Friend to current Trip</DialogTitle>
                  <DialogDescription>
                    Enter the username of the friend you want to add
                  </DialogDescription>
                </DialogHeader>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                    Add Friend to Trip
                  </Button>
                </DialogFooter>
                <DialogClose ref={closeDialogRef} className="hidden" />
              </DialogContent>
            </Dialog>

            <div className="flex box-line">
              <label>Currently part of the Trip with you:</label>
              <hr className="horizontal-line" />
            </div>

            <div className="flex names">
              {Object.entries(friends).map(([key, value]) => (
                <div className="flex participants" key={key}>
                  {value}
                  <label className="flex button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => removeParticipant(parseInt(key))}
                  >X</label>
                </div>
              ))}
            </div>

            <div className="flex row-form-end">
              <Button
                width="200px"
                backgroundColor="#BF3132"
                color="#FFFFFF"
                onClick={cancelTrip}
              >
                CANCEL TRIP
              </Button>
              <Button
                width="200px"
                backgroundColor="#1A9554"
                color="#FFFFFF"
                onClick={createNewTrip}
              >
                CREATE TRIP
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateTrip;
