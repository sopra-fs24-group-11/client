import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import image from "../../graphics/add.png";
import { Button } from "components/ui/Button";
import "styles/views/Flex.scss";
import BaseContainer from "components/ui/BaseContainer";
import DateTimePicker from 'react-datetime-picker';
import LinearIndeterminate from "components/ui/loader";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [tripAdmin, setTripAdmin] = useState<User>(null);
  const [administratorId, setAdministratorId] = useState<BigInt | null>(null);
  const [tripName, setTripName] = useState<string>("");
  const [meetUpPlace, setMeetUpPlace] = useState<string>("");
  const [tripDescription, setTripDescription] = useState<string>("");
  const [friends, setFriends] = useState<(BigInt | null)[]>(null);
  const [date, setDate] = useState<string>(""); // hier fehlt noch time
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // get data of the admin
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const adminData = await api.get("/users", {
          headers: { Authorization: token },
        });
        const admin: User = adminData.data;
        setTripAdmin(admin);
        setAdministratorId(admin.token);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);

  const createNewTrip = async () => {
    try {
      const requestBody = JSON.stringify({
        tripName,
        administratorId,
        tripDescription,
        friends,
        meetUpPlace,
      });

      const token = tripAdmin.token;
      const response = await api.post("/trips/new", requestBody, {
        headers: { Authorization: token },
      });

      navigate("/chooseConnection");

      //const trip = response.data
    } catch (error) {
      handleError(error);
    }
  };

  const cancelTrip = () => {
    navigate("/Dashboard");
  };

  const names = [
    "Name1",
    "Name2",
    "Name3",
    "Name4",
    "Name5",
    "Name6",
    "Name7",
    "Name8",
    "Name9",
  ];

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
                  onChange={(e) => setMeetUpPlace(e.target.value)}
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

            <div className="flex row-form-center">
              <label>Select Time & Date of Arrival:</label>
              <input
                className="flex date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              ></input>
            </div>

            <button className="flex bar">
              <label>Add Friends to current Trip: </label>
              <img className="flex image" src={image} />
            </button>

            <div className="flex box-line">
              <label>Currently part of the Trip with you:</label>
              <hr className="horizontal-line" />
            </div>

            <div className="flex names">
              {names.map((name, index) => (
                <div className="flex participants" key={index}>
                  {name}
                  <button>X</button>
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
