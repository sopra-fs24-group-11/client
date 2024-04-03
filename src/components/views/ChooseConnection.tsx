import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import DateTimePicker from "react-datetime-picker";
import "styles/views/Connections.scss";
import ConnectionContainer from "../ui/ConnectionContainer";
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
import ReactDOM from "react-dom";

const ChooseConnection = () => {
  const navigate = useNavigate();
  const [tripDescription, setTripDescription] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [temporaryMeetUpPlace, setTemporaryMeetUpPlace] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [travelTime, setTravelTime] = useState<string>("");
  const [connections, setConnections] = useState([]);
  const [showConnections, setShowConnections] = useState<boolean>(false);

  // used for Location Pop-Up
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>(null);
  const [tempLocation, setTempLocation] = useState<string>("");

  // used for both Pop-Ups
  const closeDialogRef = useRef(null);

  // used to send to backend
  const [tripName, setTripName] = useState<string>("");
  const [temporaryMeetUpCode, setTemporaryMeetUpCode] = useState<string>("");
  const [friends, setFriends] = useState<Record<number, string>>({});
  const [meetUpTime, setMeetUpTime] = useState<string>("");

  // used for displaying UI
  const [isHovered, setIsHovered] = useState(false);

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
      setLocationSearchTerm("");
    }
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const tripId =
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ];

      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/trips/" + tripId, {
          headers: { Authorization: token },
        });

        console.log("data: " + response.data[0]);
        console.log(Object.keys(response.data));
        console.log(response.data.meetUpPlace);

        setDestination(response.data.meetUpPlace.stationName);

        const possibleConnections = await api.get(
          "/trips/" + tripId + "/startPoint?start=" + "8591046",
          { headers: { Authorization: token } }
        );

        console.log(Object.keys(possibleConnections.data[0][0]));
        console.log(Object.keys(possibleConnections.data[0][1]));
        console.log(possibleConnections.data[0][0]);

        let el = document.getElementById("results");
        let l = [];
        let counter = 0;

        for (const connection of possibleConnections.data) {
          let con = (
            <ConnectionContainer
              departureTime={connection[0].departureTime}
              arrivalTime={connection[connection.length - 1].arrivalTime}
              key={counter}
              wholeTrip={connection}
            />
          );
          l.push(con);
          counter += 1;
        }

        setShowConnections(true);
        setConnections(l);
      } catch (e) {
        handleError(e);
      }
    };
    fetchData();
  }, []);

  const cancelTrip = () => {
    navigate("/createTrip");
  };

  return (
    <BaseContainer>
      <div className="connection container">
        <div className="connection outer-form">
          <h1 className="text-3xl mb-5 font-bold"> Choose Connection</h1>
          <div className="connection inner-form">
            <div className="connection locations_container">
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <h2 className="text-2xl mb-5">Starting Location:</h2>
                    <textarea
                      id="startLocation"
                      className="connection input"
                      placeholder="Select start location..."
                      value={tempLocation === "" ? undefined : tempLocation}
                      onChange={(e) => setTemporaryMeetUpPlace(e.target.value)}
                    ></textarea>
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
              <textarea
                id="destinationBlock"
                className="connection input"
                placeholder={destination}
                onChange={(e) => setTripDescription(e.target.value)}
              ></textarea>
              <div className="connection connector"></div>
              <div id="first" className="black-circle"></div>
              <div id="second" className="black-circle"></div>
            </div>
            {!showConnections ? (
              <div className="spinner"></div>
            ) : (
              <div id="results" className="connection box">
                <h2 className="text-2xl mb-2">Select Your Connection:</h2>
                <div className="connectionContainer" style={{ height: 0 }}>
                  {connections}
                </div>
              </div>
            )}
            <div className="box">
              <Button
                width="100px"
                height="50px"
                backgroundColor="red"
                color="white"
                className="button"
              >
                BACK
              </Button>
              <Button
                width="100px"
                height="50px"
                backgroundColor="green"
                color="white"
                className="button"
                style={{}}
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default ChooseConnection;
