// For List
import React, {useState, useEffect, useRef} from "react";
import {api} from "helpers/api";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import {Progress} from "../ui/progress";
import LinearIndeterminate from "components/ui/loader";
import {Input} from "components/ui/input";
import "../../styles/views/History.scss";
import Heart from "components/ui/Heart"
import PropTypes from "prop-types";
import {HashLoader} from "react-spinners";
import "styles/views/Trip.scss";
import {Fireworks, FireworksHandlers} from "@fireworks-js/react";

const Feedback = ({alertUser}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const fireworks = useRef<FireworksHandlers>(null);


  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const submitFeedback = async () => {
    const requestBody = {message: feedbackText};

    const response = await api.post("/users/feedback", requestBody, {
      headers: {Authorization: token},
    });
    console.log(response);

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    setHasSubmitted(true);

    //starts and stops fireworks after submitting
    fireworks.current.start();
    setTimeout(() => fireworks.current.waitStop(), 5000);

    return () => clearTimeout(timer);
  }

  const showTripOverview = (id) => {
    navigate(`/tripOverview/${id}`);
  };

  useEffect(() => {
    fireworks.current.stop();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <HashLoader color="#001f33" size={250}/>
      </div>
    );
  }

  return (
    <div className="history-list-page">
      <h1>Feedback</h1>
      {!hasSubmitted &&
          <div>
              <h3>Geben Sie gerne ein Feedback an das Get-Together-Team! &lt;3</h3><textarea
              className="trip input-large"
              placeholder="enter..."
              onChange={(e) => setFeedbackText(e.target.value)}
              style={{
                width: "100%",
                height: "200px",
                borderStyle: "solid",
                border: "0.1em",
                marginTop: "20px",
                padding: "5px",
                borderRadius: "10px"
              }}
          ></textarea>

            {
              feedbackText && !hasSubmitted &&
                <div className="button-container">
                    <Button
                        backgroundColor="#1A9554"
                        onClick={submitFeedback}>
                        Submit
                    </Button>
                </div>
            }
          </div>
      }

      {hasSubmitted &&
          <div>
              <h2>Dankeschön!</h2>
              <h3>Wir werden Ihr Feedback berücksichtigen.</h3>
          </div>
      }

      <div className="button-container">
        <Button
          backgroundColor="#FFB703"
          color="black"
          onClick={handleBackClick}
        >
          Back to Dashboard
        </Button>
      </div>
      <Fireworks
        ref={fireworks}
        options={{opacity: 0.1}}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
          background: {
            opacity: 0
          },
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Feedback;

Feedback.propTypes = {
  alertUser: PropTypes.func,
}