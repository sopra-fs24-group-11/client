import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
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
import { ScaleLoader } from "react-spinners";

const CreateTrip = ({ alertUser }) => {
  const navigate = useNavigate();

  // used for displaying UI
  const [isHovered, setIsHovered] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // used to manage trip
  const [allFriends, setAllFriends] = useState<User[]>([]);
  const [originalFriends, setOriginalFriends] = useState<User[]>([]);

  // used to send to backend
  const [tripName, setTripName] = useState<string>("");
  const [tripDescription, setTripDescription] = useState<string>("");
  const [friends, setFriends] = useState<Record<number, string>>({});
  const [meetUpPlace, setMeetUpPlace] = useState({
    stationName: "",
    stationCode: "",
  });
  const [meetUpTime, setMeetUpTime] = useState<string>("");

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

  //-------- FETCH INFORMATION -------- //

  const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/users/friends ", {
        headers: { Authorization: token },
      });
      setAllFriends(response.data);
      setSuggestions(response.data);
      setOriginalFriends(response.data);
    } catch (error) {
      alertUser("error", "Couldn't fetch the friends.", error);
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

  const cancelTrip = () => {
    navigate("/Dashboard");
  };

  const createNewTrip = async () => {
    try {
      const participants: number[] = Object.keys(friends).map(Number);
      const requestBody = JSON.stringify({
        tripName,
        tripDescription,
        meetUpPlace,
        meetUpTime,
        participants,
      });

      const token = localStorage.getItem("token");
      const response = await api.post("/trips/new", requestBody, {
        headers: { Authorization: token },
      });
      alertUser("success", "Trip created!");
      navigate("/tripOverview/" + response.data);
    } catch (error) {
      alertUser("error", "Trip creation failed.", error);
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
      setMeetUpPlace((prevState) => ({
        ...prevState,
        stationName: selectedLocation.stationName,
        stationCode: selectedLocation.stationCode,
      }));

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
    fetchFriends();
  }, []);

  useEffect(() => {
    setSuggestions(allFriends);
  }, [allFriends]);

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
          <h1 className="trip header-create">
            {" "}
            Neue Reise erstellen
          </h1>
          <div className="trip inner-form">
            <div className="trip row-form">
              <div className="trip box">
                <label className="trip label">Name der Reise:</label>
                <input
                  className="input"
                  placeholder="eingeben..."
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
                      <ul
                        className="suggestions-list bg-gray-100"
                        style={{
                          borderRadius: "5px",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
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
                              paddingLeft: "5px",
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
                        Wähle den Zielort:
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
                  placeholder="eingeben..."
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
                    hinzufügen:
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
                    x
                  </label>
                </div>
              ))}
            </div>

            <div className="trip row-form-end">
              <Button
                width="200px"
                backgroundColor="#BF3132"
                color="#FFFFFF"
                onClick={cancelTrip}
              >
                REISE ABSAGEN
              </Button>
              <Button
                width="200px"
                backgroundColor="#1A9554"
                color="#FFFFFF"
                onClick={createNewTrip}
              >
                REISE ERSTELLEN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateTrip;

CreateTrip.propTypes = {
  alertUser: PropTypes.func,
};
