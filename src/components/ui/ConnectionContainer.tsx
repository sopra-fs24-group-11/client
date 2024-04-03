import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ConnectionContainer.scss";
import "../../styles/views/Connections.scss";
import "../../graphics/infoIcon.jpeg";

interface ConnectionContainerProps {
  children?: React.ReactNode;
  departureTime: string;
  arrivalTime: string;
  changes: Int16Array;
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

const ConnectionContainer: React.FC<ConnectionContainerProps> = ({
  children,
  departureTime,
  arrivalTime,
  changes
}) => {
  return (
    <div className="connectionContainer box">
      <div className="presentation">
        <div
          id="startCircle"
          className="connectionContainer black-circle"
        ></div>
        <div id="endCircle" className="connectionContainer black-circle"></div>
        <div className="tripLine"></div>
        <p id="travelTime" className="time">{timeDifference(arrivalTime, departureTime)}</p>
        <p id="arrivalTime" className="time">{arrivalTime.slice(arrivalTime.length-10)}</p>
        <p id="departureTime" className="time">{departureTime.slice(departureTime.length-10)}</p>
        <img style={{width: 100,}} src={"../../graphics/infoIcon.jpeg"} alt="Information Icon" />
      </div>
    </div>
  );
};

export default ConnectionContainer;

ConnectionContainer.propTypes = {
  departureTime: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string.isRequired,
  changes: PropTypes.Int16Array,
  children: PropTypes.node,
};
