import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ConnectionContainer.scss";
import DataTable from "react-data-table-component";
import trainIcon from "../../graphics/connectionContainerIcons/train.png";
import shipIcon from "../../graphics/connectionContainerIcons/ship-icon.png";
import tramIcon from "../../graphics/connectionContainerIcons/tram_icon.png";
import busIcon from "../../graphics/connectionContainerIcons/bus-icon.png";
import cablewayIcon from "../../graphics/connectionContainerIcons/Cableway_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCircleXmark } from "@fortawesome/free-solid-svg-icons";


interface ConnectionContainerProps {
  children?: React.ReactNode;
  departureTime: string;
  arrivalTime: string;
  key: number;
}

const whichIcon = {
  "TRAM": tramIcon,
  "TRAIN": trainIcon,
  "SHIP": shipIcon,
  "BUS": busIcon,
  "CABLEWAY": cablewayIcon,
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

function returnTime(str) {
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
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(null);
    const [tripInformation, setTripInformation] = useState([]);
    const [connectionType, setConnectionType] = useState<string>(null);
    const [connectionName, setConnectionName] = useState<string>(null);

    function getInfoOfTrip() {

      const firstConnection = wholeTrip[0];
      const type = firstConnection.connectionType;
      let name = firstConnection.connectionName;

      // save connection type and name of first connection
      setConnectionType(type);

      // connection names sometimes have a lot of unneeded zeros, we remove them
      name = name.split("000").length > 1 ? name.split("000").join("") : name;

      setConnectionName(name);

      let x = [];
      for (const el of wholeTrip) {

        let temp = {
          to: el.arrivalPoint.stationName,
          from: el.departurePoint.stationName,
          type: el.connectionType,

          name: el.connectionName,
          departureTime: returnTime(el.departureTime),
          arrivalTime: returnTime(el.arrivalTime),
          departurePlatform: el.departurePlatform
        }
        x.push(temp);
      }
      return x;
    }

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
              style={{left: `${relativeAlignment}%`}}
            ></div>
          );
          pointList.push(changePoint);
        }

        setChangePoints(pointList);
        setTripInformation(getInfoOfTrip());
      };
      placeChangePoints();
    }, []);

    return (
      <div style={{height: "auto"}}>
        <div className="box" onClick={onClick} style={{alignItems: "center"}}>
          <div className={!isClicked ? "presentation" : "clickedPresentation"}>
            <div
              id="startCircle"
              className="connectionContainer black-circle"
            ></div>
            <div id="endCircle" className="connectionContainer black-circle"></div>
            <div className="tripLine"></div>
            <p style={{
              position: "absolute",
              top: 2,
              left: 5,
              display: "inline-block"
            }}>
              <img alt="icon of connection type" src={whichIcon[connectionType]} style={{
              height: "5%",
              width: "5%",
              display: "inline-block"
            }}/>
              <span
                style={{
                  color: "black",
                  fontSize: "10pt",

                }}
              >
                {connectionName}
              </span>

            </p>

            {changePoints}
            <p id="travelTime" className="time">
              {timeDifference(arrivalTime, departureTime)}
            </p>
            <p id="arrivalTime" className="time">
              {returnTime(arrivalTime)}
            </p>
            <p id="departureTime" className="time">
              {returnTime(departureTime)}
            </p>
            {/* < FontAwesomeIcon icon={faCircleInfo} className="info-for-connection2" 
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
            /> */}
            {showAdditionalInfo ? (<FontAwesomeIcon icon={faCircleXmark} className="info-for-connection2" onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}/>) : (
            <FontAwesomeIcon icon={faCircleInfo} className="info-for-connection2" onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}/>)}


          </div>
          {showAdditionalInfo &&
              <div className="presentation-table">

                  <DataTable columns={
                    [
                      {
                        name: "Von", selector: row => row.from, minWidth: "200px",
                      },
                      {
                        name: "Nach", selector: row => row.to, minWidth: "200px",
                      },
                      {
                        name: "Abfahrt", selector: row => row.departureTime,
                      },
                      {
                        name: "Ankunft", selector: row => row.arrivalTime,
                      },
                      {
                        name: "Name", selector: row => row.name,
                      },
                      {
                        name: "Gleis", selector: row => row.departurePlatform ? row.departurePlatform : "--",
                      }
                    ]
                  } data={tripInformation}>
                  </DataTable>
              </div>
          }
        </div>

      </div>
    )
      ;
  }
;

export default ConnectionContainer;

ConnectionContainer.propTypes = {
  departureTime: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string.isRequired,
  children: PropTypes.node,
  wholeTrip: PropTypes.Array,
  isClicked: PropTypes.bool,
  onClick: PropTypes.func,
};