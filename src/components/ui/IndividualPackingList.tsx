import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { IndividualListItem } from "./ListItem"
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const IndividualPackingList = ({alertUser}) => {
  const token = localStorage.getItem("token");
  const {tripId} = useParams();
  const [list, setList] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState("");
  const [editMode, setEditMode] = useState<boolean>(false);

  const fetchData = async () => {
        try {
          const response = await api.get(`/trips/${tripId}/individualPackings`, {
            headers: { Authorization: token },
          });
          setList(response.data.sort((a, b) => a.id - b.id))
        } catch (error) {
          alertUser("error", "", error);
        }
      };

  useEffect(() => {
    fetchData();
  }, []);

  const addItem = async (item) => {
    try {
      setPopupOpen(false);
      const requestBody = JSON.stringify({ item });
      const response = await api.post(`/trips/${tripId}/individualPackings`, requestBody, {
        headers: { Authorization: token },
      });
      setNewItemName("");
      alertUser("success", "Item hinzugefügt.");
      setList((oldList) => ([...oldList, response.data]));
    } catch (error) {
      alertUser("error", "Das Item konnte nicht hinzugefügt werden.", error);
    }
  };

  const transferTemplate = async () => {
    try {
      await api.post(`/trips/${tripId}/transfer/packings`, {}, {
        headers: { Authorization: token },
      });
      alertUser("success", "Template transferiert.");
      fetchData();
    } catch (error) {
      alertUser("error", "Das Template konnte nicht transferiert werden.", error);
    }
  };

  const completeItem = async (item) => {
    try {
      const requestBody = {item:item.item, completed:!item.completed}
      await api.put(`/trips/${tripId}/individualPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      fetchData();
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  const updateItem = async (item, newName) => {
    try {
      const requestBody = {item:newName, completed:item.completed}
      await api.put(`/trips/${tripId}/individualPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      alertUser("success", "Item geändert.");
      fetchData();
    } catch (error) {
      alertUser("error", "Das Item konnte nicht geändert werden.", error);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.delete(`/trips/${tripId}/individualPackings/${item.id}`, {
        headers: { Authorization: token },
      });
      alertUser("success", "Item gelöscht.");
      fetchData();
    } catch (error) {
      alertUser("error", "Das Item konnte nicht gelöscht werden.", error);
    }
  };
  
  let content = <h1 style={{textAlign:"center", paddingTop:"20px"}}>Hier gibt es noch keine Items. Fügen Sie doch welche hinzu!<br></br><br></br>Ebenfalls können Sie hier ihr Template importieren.</h1>

  if (list && list.length > 0) {
    content = (
      <div>
        <ul className="List list">
          {list.map((x) => (
            <li key={x.id} className="List element" style={{background: x.completed ? "#588157" : "#fefae0"}}>
              <IndividualListItem
                item={x}
                editMode={editMode}
                handleComplete={completeItem}
                handleDelete={deleteItem}
                handleUpdate={updateItem}
              >
              </IndividualListItem>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="Carousel-List-Container">
      <h1 className=" font-semibold Carousel title">Individuelle Packliste</h1>
      {isPopupOpen && <div className="List popup-container11">
        <div className="List popup11">
          <input
            className="List popup-input11"
            type="text"
            value={newItemName}
            placeholder={"Nächstes Item "}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <div className="List popup-buttons11">
            <Button backgroundColor={"beige"} onClick={() => {addItem(newItemName)}}>Save</Button>
            <Button backgroundColor={"beige"} onClick={() => {setPopupOpen(false)}}>Close</Button>
          </div>
        </div>
      </div>}
      {!isPopupOpen && <div className="Carousel button-holder">
        <Button  onClick={() => {setPopupOpen(true)}}>Item hinzufügen</Button>
        <Button  onClick={() => {setEditMode(old => !old)}}>{editMode ? "Editor schliessen" : "Editieren"}</Button>
        <Button  onClick={() => {transferTemplate()}}>Template importieren</Button>
      </div>}
      {!isPopupOpen && content}
    </div>
  )
}

export default IndividualPackingList;

IndividualPackingList.propTypes = {
  alertUser: PropTypes.func,
};