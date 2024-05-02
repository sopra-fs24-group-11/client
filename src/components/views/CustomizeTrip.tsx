import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import image from "../../graphics/add.png";
import { Button } from "components/ui/Button";
import "styles/views/Flex.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
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
import { HashLoader } from "react-spinners";

const CustomizeTrip = ({alertUser}) => {
  // used to navigate
  const navigate = useNavigate();

  // used for displaying UI
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // used to manage trip
  const [allFriends, setAllFriends] = useState<User[]>([]);
  const { tripId } = useParams();

  // used to send to backend
  const [tripName, setTripName] = useState<string>("");
  const [tripDescription, setTripDescription] = useState<string>("");
  const [friends, setFriends] = useState<Record<number, string>>({});
  const [meetUpTime, setMeetUpTime] = useState<string>("");
  const [meetUpPlace, setMeetUpPlace] = useState({
    stationName: "",
    stationCode: ""
  });

  // used for Friend Pop-Up
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);

  // used for Location Pop-Up
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  // used for both Pop-Ups
  const closeDialogRef = useRef(null);


  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users/friends ", {
        headers: { Authorization: token },
      });
      setAllFriends(response.data);
    } catch (error) {
      alertUser("error", "Failed to fetch the friends.", error)
    }
  };

  const fetchTrip = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/trips/${tripId}`, {
        headers: { Authorization: token },
      });
      setTripName(response.data.tripName);
      setTripDescription(response.data.tripDescription);
      setMeetUpTime(response.data.meetUpTime);
      setMeetUpPlace((prevState) => ({
        ...prevState,
        stationName: response.data.meetUpPlace.stationName,
        stationCode: response.data.meetUpPlace.stationCode
      }));

    } catch (error) {
      alertUser("error", "Failed to fetch the trip.", error)
    }
  };

  const fetchParticipants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/trips/${tripId}/participants`, {
        headers: { Authorization: token },
      });
      const tempObject = {};
      response.data.forEach((item) => {
        tempObject[item.id] = item.username;
      });
      setFriends(tempObject);
    } catch (error) {
      alertUser("error", "Failed to fetch the participants.", error)
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

  const discardChanges = () => {
    navigate(`/tripOverview/${tripId}`);
  };

  const saveChanges = async () => {
    try {
      const participants: number[] = Object.keys(friends).map(Number);
      const requestBody = JSON.stringify({
        tripName,
        tripDescription,
        meetUpPlace,
        meetUpTime,
        participants
      });

      const token = localStorage.getItem("token");
      await api.put(`/trips/${tripId}`, requestBody, {
        headers: { Authorization: token },
      });
      alertUser("success", "Trip updated.")
      navigate(`/tripOverview/${tripId}`);
    } catch (error) {
      alertUser("error", "Failed to update trip.", error)
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
        alertUser("error", "Query Error. Try again.", error)
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
      setMeetUpPlace({
        stationName: selectedLocation.stationName,
        stationCode: selectedLocation.stationCode
      });
      setLocationSearchTerm(""); 
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

  //-------- NEEDED TO OPEN DIALOG WHEN FOCUSIN INPUT FIELD -------- //

  const dialogTriggerRef = useRef(null); // Create a ref for the DialogTrigger component

  const handleInputFocus = () => {
    if (dialogTriggerRef.current) {
      dialogTriggerRef.current.click(); 
    }
  };

  //-------- What is actually being executed -------- //

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchTrip();
    fetchParticipants();
    fetchFriends();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <HashLoader color="#001f33" size={250} />
      </div>
    );
  }
  return (
    <BaseContainer>
      <div className="flex container">
        <div className="flex outer-form">
          <h1 className="text-3xl mb-5 font-bold"> Customize Trip</h1>
          <div className="flex inner-form">
            <div className="flex row-form">
              <div className="flex box">
                <label>Trip Name:</label>
                <input
                  className="input"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                ></input>
                <br></br>
                
                <Dialog>
                  <DialogTrigger asChild ref={dialogTriggerRef}>
                    <div>
                      <label>Target Location:</label>
                      <input
                        className="flex input"
                        placeholder="enter..."
                        value={meetUpPlace.stationName === "" ? undefined : meetUpPlace.stationName}
                        onFocus={handleInputFocus}
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
                  value={tripDescription}
                  onChange={(e) => setTripDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="flex row-form">
              <div className="flex box-line">
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
                onClick={discardChanges}
              >
                DISCARD CHANGES
              </Button>
              <Button
                width="200px"
                backgroundColor="#1A9554"
                color="#FFFFFF"
                onClick={saveChanges}
              >
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CustomizeTrip;

CustomizeTrip.propTypes = {
  alertUser: PropTypes.func,
}