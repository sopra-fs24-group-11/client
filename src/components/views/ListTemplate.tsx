import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/buttonshadcn";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/ListTemplate.scss"

const ListTemplate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/packings", {
          headers: { Authorization: token },
        });
        
        console.log("LIST FROM BACKEND:", response.data);
        
        setList(response.data)
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);

  const addItem = async () => {
    try {
      let item = "apple";
      const requestBody = JSON.stringify({ item });
      console.log(requestBody);
      const response = await api.post("/users/packings", requestBody, {
        headers: { Authorization: token },
      });

      setList((oldList) => ([...oldList, {item:item}]));
      console.log(list);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  let content = {};

  if (list) {
    content = (
      <div className="ListTemplate template">
        <ul className="ListTemplate list">
          {list.map((x) => (
            <li key={x.id} className="ListTemplate element">
              id={x.id}, 
              item={x.item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <BaseContainer>
      <div className="ListTemplate container">
        <div className="ListTemplate button-holder">
          <Button
            backgroundColor={"#FFB703"}
            onClick={() => navigate("/dashboard")}
          >
            Back To Dashboard
          </Button>
          <Button
            backgroundColor={"green"}
            onClick={() => navigate("/profile")}
          >
            Back To Profile Page
          </Button>
          <Button
            backgroundColor={"green"}
            onClick={() => addItem()}
          >
            Add item
          </Button>
        </div>
        {content}
      </div>
    </BaseContainer>
  )
}

export default ListTemplate;