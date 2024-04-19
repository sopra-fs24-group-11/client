

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
  const [tripId, setTripId] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const [departureTime, setDepartureTime] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [travelTime, setTravelTime] = useState<string>("");
  const [connections, setConnections] = useState([]);
  const [showConnections, setShowConnections] = useState<boolean>(false);

  // used for Location Pop-Up
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [activeConnection, setActiveConnection] = useState<number>(null); // New state

  // used for both Pop-Ups
  const closeDialogRef = useRef(null);

  // used to send to backend
  const [temporaryMeetUpCode, setTemporaryMeetUpCode] = useState<string>("");
  const [tempLocation, setTempLocation] = useState("");

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

  const renderConnectionContainers = async (locationCode) => {
    try {
      setShowConnections(false); //
      setShowSpinner(true);
      
      const possibleConnections = await api.get(
        "/trips/" + tripId + "/startPoint?start=" + locationCode + "&isLate=" + "false",
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      console.log("request: " + possibleConnections);

      let l = possibleConnections.data.map((connection, index) => {
        console.log(index);
        return (
          <ConnectionContainer
            departureTime={connection[0].departureTime}
            arrivalTime={connection[connection.length - 1].arrivalTime}
            key={index}
            wholeTrip={connection}
            isClicked={activeConnection === index} // Pass down whether this connection is active
            onClick={() => setActiveConnection(index)} // Pass down function to set active connection
          />
        );
      });
      setConnections(l);
      setShowConnections(true);
    } catch (e) {
      handleError(e);
    }
  };

  const handleLocationSubmit = () => {
    if (selectedLocation) {
      setTemporaryMeetUpCode(selectedLocation.stationCode);
      setTempLocation(selectedLocation.stationName);
      setLocationSearchTerm("");
      renderConnectionContainers(selectedLocation.stationCode);
    }
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  const moveBack = () => {
    navigate("/createTrip");
  };

  const handleConnectionSubmit = async () => {
    const response = await api.post("/trips/" + tripId + "/connection", {
      body: {},
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const id =
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ];

      setTripId(id);

      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/trips/" + id, {
          headers: { Authorization: token },
        });

        console.log(Object.keys(response.data));
        console.log(response.data.meetUpPlace);

        setDestination(response.data.meetUpPlace.stationName);
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
                  <div style={{ width: "100%" }}>
                    <h2 className="text-2xl mb-5">Starting Location:</h2>
                    <textarea
                      id="startLocation"
                      className="connection input"
                      placeholder="Select start location..."
                      value={tempLocation === "" ? undefined : tempLocation}
                      //onChange={(e) => setTemporaryMeetUpPlace(e.target.value)}
                    ></textarea>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Starting Location</DialogTitle>
                    <DialogDescription>
                      Enter the Location where you want to start your Trip:
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
                      Select Starting Location
                    </Button>
                  </DialogFooter>
                  <DialogClose ref={closeDialogRef} className="hidden" />
                </DialogContent>
              </Dialog>
              <textarea
                id="destinationBlock"
                className="connection input"
                placeholder={destination}
                readOnly
              ></textarea>
              <div className="connection connector"></div>
              <div id="first" className="black-circle"></div>
              <div id="second" className="black-circle"></div>
            </div>
            {!showConnections ? (
              showSpinner ? <div className="spinner"></div> : <div></div>
            ) : (
              <div id="results" className="connection box">
                <h2 className="text-2xl mb-2">Select Your Connection:</h2>
                <div className="connectionContainer" style={{ height: 0 }}>
                  {connections}
                </div>
              </div>
            )}
            <div className="box-row">
              <Button className="button" id="cancelButton" onClick={moveBack}>
                BACK
              </Button>
              <Button
                id="confirmButton"
                className="button"
                onClick={handleConnectionSubmit}
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
