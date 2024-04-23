import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ConnectionContainer.scss";
import picture from "../../graphics/infoIcon.jpeg";

interface ConnectionContainerProps {
  children?: React.ReactNode;
  departureTime: string;
  arrivalTime: string;
  key: number;
}

function timeDifference(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  // Calculate the difference in milliseconds
  let difference = Math.abs(date2 - date1);

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(difference / (1000 * 60 * 60));
  difference -= hours * 1000 * 60 * 60;

  const minutes = Math.floor(difference / (1000 * 60));
  difference -= minutes * 1000 * 60;

  return `${hours}h ${minutes}min`;
}

function timeDiffInMinutes(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  // Calculate the difference in milliseconds
  let difference = Math.abs(date2 - date1);

  const minutes = Math.floor(difference / (1000 * 60));
  difference -= minutes * 1000 * 60;

  return minutes;
}

function slicer(str) {
  return str.slice(str.length - 8, str.length - 3);
}

const ConnectionContainer: React.FC<ConnectionContainerProps> = ({
  children,
  departureTime,
  arrivalTime,
  wholeTrip,
  isClicked,
  onClick, // New prop for handling click
}) => {
  const [changePoints, setChangePoints] = useState([]);

  useEffect(() => {
    const placeChangePoints = () => {
      let minuteCounter = 0;
      const minutesWholeTrip = timeDiffInMinutes(arrivalTime, departureTime);
      let pointList = [];

      for (let i = 0; i < wholeTrip.length - 1; i++) {
        let timeToStop = 0;

        if (i !== 0) {
          timeToStop = timeDiffInMinutes(
            wholeTrip[i].arrivalTime,
            wholeTrip[i - 1].arrivalTime
          );
        } else {
          timeToStop = timeDiffInMinutes(
            wholeTrip[i].arrivalTime,
            wholeTrip[i].departureTime
          );
        }
        minuteCounter += timeToStop;

        let relativeProgress = minuteCounter / minutesWholeTrip;

        // as the distance between the start- and endPoint is 59% we take this value and multiply it by our
        // relativeProgression (+18% to get at least the startPoint)
        let relativeAlignment = 59 * relativeProgress + 18;
        let changePoint = (
          <div
            className="black-circle"
            style={{ left: `${relativeAlignment}%` }}
          ></div>
        );
        pointList.push(changePoint);
      }

      setChangePoints(pointList);
    };
    placeChangePoints();
  }, []);

  return (
    <div className="box" onClick={onClick}>
      <div className={!isClicked ? "presentation" : "clickedPresentation"}>
        <div
          id="startCircle"
          className="connectionContainer black-circle"
        ></div>
        <div id="endCircle" className="connectionContainer black-circle"></div>
        <div className="tripLine"></div>
        <p
          style={{
            position: "absolute",
            top: 2,
            left: 5,
            color: "black",
            fontSize: "10pt",
          }}
        >
          {wholeTrip[0].connectionName}
        </p>
        {changePoints}
        <p id="travelTime" className="time">
          {timeDifference(arrivalTime, departureTime)}
        </p>
        <p id="arrivalTime" className="time">
          {slicer(arrivalTime)}
        </p>
        <p id="departureTime" className="time">
          {slicer(departureTime)}
        </p>
        <img
          style={{ width: "30px", position: "absolute", right: 0 }}
          src={picture}
          alt="Information Icon"
        />
      </div>
    </div>
  );
};

export default ConnectionContainer;

ConnectionContainer.propTypes = {
  departureTime: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string.isRequired,
  children: PropTypes.node,
  wholeTrip: PropTypes.Array,
  isClicked: PropTypes.bool,
  onClick: PropTypes.func,
};