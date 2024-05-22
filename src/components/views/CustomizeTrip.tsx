import React, { useState, useEffect, useRef } from "react";
import Rating from "@mui/material/Rating";
import { api } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import image from "../../graphics/add.png";
import { Button } from "components/ui/Button";
import "styles/views/Trip.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
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
import { HashLoader, ScaleLoader } from "react-spinners";

const CustomizeTrip = ({ alertUser }) => {
  // used to navigate
  const navigate = useNavigate();

  // used for displaying UI
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // used to manage trip
  const [allFriends, setAllFriends] = useState<User[]>([]);
  const [originalFriends, setOriginalFriends] = useState<User[]>([]);
  const { tripId } = useParams();

  // used to send to backend
  const [tripName, setTripName] = useState<string>("");
  const [tripDescription, setTripDescription] = useState<string>("");
  const [friends, setFriends] = useState<Record<number, string>>({});
  const [meetUpTime, setMeetUpTime] = useState<string>("");
  const [meetUpPlace, setMeetUpPlace] = useState({
    stationName: "",
    stationCode: "",
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

  // used for the Rating
  const [value, setValue] = useState<number | null>(2);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users/friends ", {
        headers: { Authorization: token },
      });
      const tempFriends = response.data;
      const toBeDeleted = Object.keys(friends).map(Number);
      const updatedFriends = tempFriends.filter(friend => !toBeDeleted.includes(friend.friendId));
      setAllFriends(updatedFriends);
      setSuggestions(updatedFriends);
      setOriginalFriends(response.data);
    } catch (error) {
      alertUser("error", "Failed to fetch the friends.", error);
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
        stationCode: response.data.meetUpPlace.stationCode,
      }));
      setValue(response.data.rating);
    } catch (error) {
      alertUser("error", "Failed to fetch the trip.", error);
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
      alertUser("error", "Failed to fetch the participants.", error);
    }
  };

  //-------- HANDLE CREATION OR CANCELATION -------- //

  const addParticipant = (key: number, value: string) => {
    setFriends((prevDictionary) => ({
      ...prevDictionary,
      [key]: value,
    }));
    const updatedFriends = allFriends.filter(friend => friend.friendId !== key);
    setAllFriends(updatedFriends);
  };

  const removeParticipant = (key: number) => {
    const { [key]: deletedUser, ...rest } = friends;
    setFriends(rest);
    const friendToAdd = originalFriends.find(friend => friend.friendId === key);
    if (friendToAdd) {
      setAllFriends([...allFriends, friendToAdd]);
    }
  };
  
  const discardChanges = () => {
    navigate(`/tripOverview/${tripId}`);
  };

  const saveChanges = async () => {
    try {
      const rating = value;
      const participants: number[] = Object.keys(friends).map(Number);
      const requestBody = JSON.stringify({
        tripName,
        tripDescription,
        meetUpPlace,
        meetUpTime,
        participants,
        rating,
      });

      const token = localStorage.getItem("token");
      await api.put(`/trips/${tripId}`, requestBody, {
        headers: { Authorization: token },
      });
      alertUser("success", "Reise erfolgreich bearbeitet.");
      navigate(`/tripOverview/${tripId}`);
    } catch (error) {
      alertUser("error", "Reise konnte nicht bearbeitet werden.", error);
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
        alertUser("error", "Query Error. Try again.", error);
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
        stationCode: selectedLocation.stationCode,
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
      setSuggestions(allFriends);
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
      setSuggestions(allFriends);
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
    setSuggestions(allFriends);
  }, [allFriends]);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchTrip(); 
      fetchParticipants(); 
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [friends]);

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
    <BaseContainer>
      <div className="trip container">
        <div className="trip outer-form">
          <h1 className="trip header">
            {" "}
            Reise anpassen
          </h1>
          <hr className="horizontal-line-decent" />
          <Rating
            className="mb-2 mt-1"
            name="simple-controlled"
            size="large"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          <div className="trip inner-form">
            <div className="trip row-form">
              <div className="trip box">
                <label className="trip label">Name der Reise:</label>
                <input
                  className="input"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                ></input>
                <br></br>

                <Dialog>
                  <DialogTrigger asChild ref={dialogTriggerRef}>
                    <div>
                      <label className="trip label">Zielort:</label>
                      <input
                        className="trip input"
                        placeholder="eingeben..."
                        value={
                          meetUpPlace.stationName === ""
                            ? undefined
                            : meetUpPlace.stationName
                        }
                        onFocus={handleInputFocus}
                      ></input>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Wähle einen Zielort:</DialogTitle>
                      <DialogDescription>
                        Suche einen Ort, an dem ihr euch treffen wollt:
                      </DialogDescription>
                    </DialogHeader>
                    <input
                      type="text"
                      placeholder="suchen..."
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
                        Speichern
                      </Button>
                    </DialogFooter>
                    <DialogClose ref={closeDialogRef} className="hidden" />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="trip box">
                <label className="trip label">Reisebeschreibung:</label>
                <textarea
                  className="trip input-large"
                  value={tripDescription}
                  onChange={(e) => setTripDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="trip row-form">
              <div className="trip box-line">
                <label className="trip label">Datum & Zeit der Ankunft:</label>
                <input
                  className="trip date"
                  type="datetime-local"
                  value={meetUpTime}
                  onChange={(e) => setMeetUpTime(e.target.value)}
                ></input>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="trip bar">
                  <label className="add-friends-label">
                    Füge Freund zur aktuellen Reise hinzu:
                  </label>
                  <img className="trip image" src={image} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Füge einen Freund zur Reise hinzu: </DialogTitle>
                  <DialogDescription>
                    Tippe den Benutzernamen des Freundes ein, den zu zur Reise
                    hinzufügen willst:
                  </DialogDescription>
                </DialogHeader>
                <input
                  type="text"
                  placeholder="suchen..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="suggestions-container" style={{ maxHeight: "7.5em", overflowY: "auto" }}> 
                  <ul className="suggestions-list bg-gray-100">
                    {suggestions.sort((a, b) => a.username.localeCompare(b.username)).map((suggestion) => (
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
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddFriendSubmit}
                    backgroundColor="#14AE5C"
                  >
                    hinzufügen
                  </Button>
                </DialogFooter>
                <DialogClose ref={closeDialogRef} className="hidden" />
              </DialogContent>
            </Dialog>

            <div className="trip box-line">
              <label className="trip label">
                Zurzeit auf der Reise mit dir:
              </label>
              <hr className="horizontal-line" />
            </div>

            <div className="trip names">
              {Object.entries(friends).map(([key, value]) => (
                <div className="trip participants" key={key}>
                  {value}
                  <label
                    className="trip button"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => removeParticipant(parseInt(key))}
                  >
                    X
                  </label>
                </div>
              ))}
            </div>

            <div className="trip row-form-end">
              <Button
                width="200px"
                backgroundColor="#BF3132"
                color="#FFFFFF"
                onClick={discardChanges}
              >
                ÄNDERUNGEN VERWERFEN
              </Button>
              <Button
                width="200px"
                backgroundColor="#1A9554"
                color="#FFFFFF"
                onClick={saveChanges}
              >
                ÄNDERUNGEN SPEICHERN
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
};
