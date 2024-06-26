import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
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
import locationIcon from "../../graphics/location_icon.png";

const ChooseConnection = ({ alertUser }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>("");
  const token = localStorage.getItem("token");
  const { tripId } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [connections, setConnections] = useState([]);
  const [chosenConnection, setChosenConnection] = useState([]);
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
  const [isHovered, setIsHovered] = useState<string>("");

  const [connectionAlreadyExists, setConnectionAlreadyExists] =
    useState<boolean>(false);

  const handleLocationSearchChange = async (event) => {
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
        alertUser("error", "Abfragefehler. Erneut versuchen.", error);
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
        "/trips/" +
          tripId +
          "/startPoint?start=" +
          locationCode +
          "&isLate=" +
          "false",
        { headers: { Authorization: token } }
      );
      let filteredList = possibleConnections.data.filter(
        (sublist) => sublist.length > 0
      );
      setConnections(filteredList);
      setShowConnections(true);
    } catch (error) {
      alertUser("error", "Die Verbindung konnte nicht gerendert werden.", error);
    }
  };

  let content = <h1>No connections found.</h1>;
  if (connections && connections.length > 0) {
    content = (
      <div>
        {connections.map((connection, index) => (
          <ConnectionContainer
            departureTime={connection[0].departureTime}
            arrivalTime={connection[connection.length - 1].arrivalTime}
            key={index}
            wholeTrip={connection}
            isClicked={activeConnection === index} 
            onClick={() => {
              setActiveConnection(index);
              setChosenConnection(connection);
            }} 
          />
        ))}
      </div>
    );
  }

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

  const handleConnectionSubmit = async () => {
    const requestBody = JSON.stringify(chosenConnection);
    try {
      if (connectionAlreadyExists) {
        // remove old connection if one exists
        await api.delete(`/trips/${tripId}/connection`, {
          headers: { Authorization: token },
        });
      }
      await api.post(`/trips/${tripId}/connection`, requestBody, {
        headers: { Authorization: token },
      });
      navigate(`/tripOverview/${tripId}`);
    } catch (error) {
      alertUser("error", "Auswahl der Verbindung fehlgeschlagen.", error);
    }
  };

  function startGeolocation() {
    setTempLocation("Suche deinen Standort...");
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
    setShowSpinner(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await api.get(
              "/trips/" +
                tripId +
                "/geoLocation?x=" +
                position.coords.latitude +
                "&y=" +
                position.coords.longitude +
                "&isLate=false",
              { headers: { Authorization: token } }
            );

            const departurePoint = response.data[0][0].departurePoint;
            setSelectedLocation(departurePoint);

            setTemporaryMeetUpCode(departurePoint.stationCode);
            setTempLocation(departurePoint.stationName);
            setLocationSearchTerm("");

            await renderConnectionContainers(departurePoint.stationCode);
          } catch (error) {
            alertUser("error", "Geolokalisierung fehlgeschlagen.", error);
          }
        },
        function (error) {
          if (error.code === error.PERMISSION_DENIED) {
            resetLocationLoadingView();
            alertUser(
              "error",
              "Bitte erlauben Sie die Verwendung von Standortdiensten in ihrem Browser."
            );
          }
        }
      );
    } else {
      resetLocationLoadingView();
      alertUser("error", "Geolokalisierung ist derzeit nicht verfügbar.");
    }
  }

  function resetLocationLoadingView() {
    setTempLocation("");
    const inputField = document.getElementById(
      "startLocation"
    ) as HTMLInputElement;
    inputField.value = "";
    setShowSpinner(false);
  }

  async function checkConnectionAlreadyExisting() {
    const currentConnection = await api.get(
      "/trips/" + tripId + "/connection",
      {
        headers: { Authorization: token },
      }
    );

    if (!currentConnection.data) {
      // check if connection already exists
      setConnectionAlreadyExists(false);
    } else {
      setConnectionAlreadyExists(true);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`, {
          headers: { Authorization: token },
        });
        await checkConnectionAlreadyExisting();
        setDestination(response.data.meetUpPlace.stationName);
      } catch (error) {
        alertUser("error", "Das Ziel der Reise konnte nicht ermittelt werden.", error);
      }
    };
    fetchData();
  }, []);

  return (
    <BaseContainer
      id="baseContainerChooseConnection"
      style={{ height: "auto" }}
    >
      <div
        className="connection container"
        id="secondContainer"
        style={{ height: "auto" }}
      >
        <div className="connection outer-form" style={{ height: "auto" }}>
          <h1 className="text-3xl mb-5 font-bold">Reiseverbindung wählen</h1>
          <div className="connection inner-form" style={{ height: "auto" }}>
            <div
              className="connection locations_container"
              style={{ height: "auto" }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div style={{ width: "100%" }}>
                    <h2 className="text-2xl mb-5">Startort:</h2>
                    <textarea
                      id="startLocation"
                      className="connection input"
                      placeholder="Wähle Startpunkt..."
                      value={tempLocation === "" ? undefined : tempLocation}
                      //onChange={(e) => setTemporaryMeetUpPlace(e.target.value)}
                    ></textarea>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Wähle Startpunkt für die Reise</DialogTitle>
                    <DialogDescription>
                      Wähle den Ort an dem du die Reise starten willst:
                    </DialogDescription>
                  </DialogHeader>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={locationSearchTerm}
                    onChange={handleLocationSearchChange}
                  />
                  {
                    <ul
                      className="suggestions-list bg-gray-100"
                      style={{
                        borderRadius: "5px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      <li
                        key={"userLocation"}
                        onClick={() => {
                          startGeolocation();
                        }}
                        onMouseEnter={() => setIsHovered("userLocation")}
                        onMouseLeave={() => setIsHovered(null)}
                        style={{
                          cursor: "pointer",
                          textShadow:
                            isHovered === "userLocation"
                              ? "2px 2px 4px #000"
                              : "none",
                          paddingBottom: "5px",
                          paddingTop: "5px",
                        }}
                      >
                        <img
                          src={locationIcon}
                          alt="location icon"
                          style={{
                            position: "absolute",
                            width: "20px",
                            height: "20px",
                            marginRight: "10px",
                            marginTop: "2px",
                          }}
                        />
                        <div
                          style={{
                            paddingLeft: "20px",
                          }}
                        >
                          Jetziger Standort
                        </div>
                      </li>
                      {locationSuggestions.length > 0 && (
                        <>
                          <li>
                            <div
                              style={{
                                width: "100%",
                                height: "1px",
                                backgroundColor: "lightgrey",
                                marginBottom: "2px",
                              }}
                            />
                          </li>
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
                        </>
                      )}
                    </ul>
                  }
                  <DialogFooter>
                    <Button
                      onClick={handleLocationSubmit}
                      backgroundColor="#14AE5C"
                    >
                      Startpunkt auswählen
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
              showSpinner ? (
                <div className="spinner"></div>
              ) : (
                <div></div>
              )
            ) : (
              <div id="results" className="connection box">
                <h2 className="text-2xl mb-2">Wähle eine Verbindung:</h2>
                <div className="connectionContainer">
                  {/* {connections} */}
                  {content}
                </div>
              </div>
            )}
            <div
              style={{
                position: "relative",
                alignSelf: "center",
                alignContent: "center",
                justifyContent: "center",
                display: "flex",
                gap: "30px"
              }}
            >
              <Button
                id="cancelButton"
                backgroundColor={"#FFB703"}
                onClick={() => navigate(`/tripOverview/${tripId}`)}
              >
                Zurück
              </Button>
              {showConnections &&
                  <Button backgroundColor="#14AE5C"
                          id="confirmButton" onClick={handleConnectionSubmit}>
                      Bestätigen
                  </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default ChooseConnection;

ChooseConnection.propTypes = {
  alertUser: PropTypes.func,
};
