import React, { useState, useEffect } from "react";
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

        console.log("data: " + response.data);
        console.log(Object.keys(response.data));
        console.log(response.data.meetUpPlace);

        setDestination(response.data.meetUpPlace.stationName);

        const possibleConnections = await api.get(
          "/trips/" + tripId + "/startPoint?start=" + "8591046",
          { headers: { "Authorization": token } }
        );

        console.log("data: " + possibleConnections.data);
        console.log(Object.keys(possibleConnections.data[0][0]));
        console.log(Object.keys(possibleConnections.data[0][1]));

        let el = document.getElementById("results");
        for (const connection of possibleConnections.data) {
          let con = (
            <ConnectionContainer
              departureTime={connection[0].departureTime}
              arrivalTime={connection[connection.length - 1].arrivalTime}
              changes={(connection.length - 1)}
            />
          );
        }
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
              <h2 className="text-2xl mb-5">Starting Location:</h2>
              <textarea
                id="startLocation"
                className="connection input"
                placeholder="Select start location..."
                onChange={(e) => setTemporaryMeetUpPlace(e.target.value)}
              ></textarea>
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
            <div id="results" className="connection box">
              <h2 className="text-2xl mb-5">Select Your Connection:</h2>
              <ConnectionContainer
                departureTime="14:00"
                arrivalTime="15:50"
                travelTime="1h 50min"
              ></ConnectionContainer>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default ChooseConnection;
