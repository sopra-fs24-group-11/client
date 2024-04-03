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
  // used to navigate
  const navigate = useNavigate();

  // used for displaying UI
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // used to manage trip
  const [allFriends, setAllFriends] = useState<User[]>([]);

  // used to send to backend
  const [tripName, setTripName] = useState<string>("");
  const [temporaryMeetUpPlace, setTemporaryMeetUpPlace] = useState<string>("");
  const [temporaryMeetUpCode, setTemporaryMeetUpCode] = useState<string>("");
  const [tripDescription, setTripDescription] = useState<string>("");
  const [friends, setFriends] = useState<Record<number, string>>({});
  const [meetUpTime, setMeetUpTime] = useState<string>("");

  // used for Friend Pop-Up
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);

  // used for Location Pop-Up
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tempLocation, setTempLocation] = useState<string>("");

  // used for both Pop-Ups
  const closeDialogRef = useRef(null);

  //-------- FETCH INFORMATION -------- //

  const fetchLocation = async () => {
    const options: any = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      accuracy: 50,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Erfolgreich, die Position wurde abgerufen
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy; // Genauigkeit in Metern
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Accuracy:", accuracy, "meters");

        if (accuracy < 100) {
          // Die Genauigkeit ist ausreichend, um den Standort zu verwenden
        } else {
          // Die Genauigkeit ist nicht ausreichend, um den Standort zu verwenden
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      },
      options
    );
  };

  const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/users/friends ", {
        headers: { Authorization: token },
      });
      setAllFriends(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  //-------- HANDLE CREATION OR CANCELATION -------- //

  const addParticipant = (key: number, value: string) => {
    setFriends((prevDictionary) => ({
      ...prevDictionary,
      [key]: value,
    }));
  };

  const removeParticipant = (key: number) => {
    const { [key]: deletedUser, ...rest } = friends;
    setFriends(rest);
  };

  const cancelTrip = () => {
    navigate("/Dashboard");
  };

  const createNewTrip = async () => {
    try {
      const participants: number[] = Object.keys(friends).map(Number);
      const requestBody = JSON.stringify({
        tripName,
        tripDescription,
        participants,
        temporaryMeetUpPlace,
        temporaryMeetUpCode,
        meetUpTime,
      });

      const token = localStorage.getItem("token");
      const response = await api.post("/trips/new", requestBody, {
        headers: { Authorization: token },
      });

      navigate("/chooseConnection/" + response.data);
    } catch (error) {
      handleError(error);
    }
  };

  //-------- HANDLE POP-UP LOCATIONS -------- //

  const handleLocationSearchChange = async (event) => {
    const token = localStorage.getItem("token");
    setLocationSearchTerm(event.target.value);
    if (event.target.value.trim() === "") {
      setLocationSuggestions([]);
    } else {
      try {
        const response = await api.get(
          `/trips/searchStation?start=${event.target.value}`,
          {
            headers: { Authorization: token },
          }
        );
        setLocationSuggestions(response.data);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleLocationSuggestionSelect = (station) => {
    setLocationSearchTerm(station.stationName);
    setSelectedLocation(station);
    setLocationSuggestions([]);
  };

  const handleLocationSubmit = () => {
    if (selectedLocation) {
      setTemporaryMeetUpPlace(selectedLocation.stationName);
      setTemporaryMeetUpCode(selectedLocation.stationCode);
      setTempLocation(selectedLocation.stationName);
      setLocationSearchTerm(""); // eventuell braucht es das nicht
    }
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  //-------- HANDLE POP-UP FRIENDS -------- //

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allFriends.filter((friend) =>
        friend.username.startsWith(event.target.value)
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionSelect = (friend) => {
    setSearchTerm(friend.username);
    setSelectedFriend(friend);
    setSuggestions([]);
  };

  const handleAddFriendSubmit = () => {
    if (selectedFriend) {
      addParticipant(selectedFriend.friendId, selectedFriend.username);
      setSearchTerm("");
    }
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  //-------- HELPER FUNCTIONS FOR UI DISPLAY -------- //

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  //-------- What is actually being executed -------- //

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchFriends();
    fetchLocation();
  }, []);

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

                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <label>Target Location:</label>
                      <input
                        className="flex input"
                        placeholder="enter..."
                        value={tempLocation === "" ? undefined : tempLocation}
                        onChange={(e) =>
                          setTemporaryMeetUpPlace(e.target.value)
                        }
                      ></input>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Target Location</DialogTitle>
                      <DialogDescription>
                        Enter the Location where you want to get together:
                      </DialogDescription>
                    </DialogHeader>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={locationSearchTerm}
                      onChange={handleLocationSearchChange}
                    />
                    {locationSuggestions.length > 0 && (
                      <ul className="suggestions-list bg-gray-100">
                        {locationSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.stationCode}
                            onClick={() =>
                              handleLocationSuggestionSelect(suggestion)
                            }
                            onMouseEnter={() =>
                              setIsHovered(suggestion.stationCode)
                            }
                            onMouseLeave={() => setIsHovered(null)}
                            style={{
                              cursor: "pointer",
                              textShadow:
                                isHovered === suggestion.stationCode
                                  ? "2px 2px 4px #000"
                                  : "none",
                            }}
                          >
                            {suggestion.stationName}
                          </li>
                        ))}
                      </ul>
                    )}
                    <DialogFooter>
                      <Button
                        onClick={handleLocationSubmit}
                        backgroundColor="#14AE5C"
                      >
                        Select Target Location
                      </Button>
                    </DialogFooter>
                    <DialogClose ref={closeDialogRef} className="hidden" />
                  </DialogContent>
                </Dialog>
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
                <label>Date & Time of Arrival:</label>
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
                  <label className="add-friends-label">
                    Add Friends to current Trip
                  </label>
                  <img className="flex image" src={image} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Friend to current Trip </DialogTitle>
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
                        onMouseEnter={() => setIsHovered(suggestion.username)}
                        onMouseLeave={() => setIsHovered(null)}
                        style={{
                          cursor: "pointer",
                          textShadow:
                            isHovered === suggestion.username
                              ? "2px 2px 4px #000"
                              : "none",
                        }}
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
                  <label
                    className="flex button"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => removeParticipant(parseInt(key))}
                  >
                    X
                  </label>
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
