import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { GroupListItem } from "./ListItem"
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const GroupPackingList = ({avatars, userId, alertUser}) => {
  const token = localStorage.getItem("token");
  const {tripId} = useParams();
  const [list, setList] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState("");
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchPeriodically = async () => {
      await fetchList();
    };
    fetchPeriodically();
    const intervalId = setInterval(fetchPeriodically, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchList = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/groupPackings`, {
        headers: { Authorization: token },
      });
      setList(response.data.sort((a, b) => a.id - b.id))
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const addItem = async (item) => {
    try {
      setPopupOpen(false);
      const requestBody = JSON.stringify({ item });
      const response = await api.post(`/trips/${tripId}/groupPackings`, requestBody, {
        headers: { Authorization: token },
      });
      setNewItemName("");
      alertUser("success", "Item hinzugefügt.");
      setList((oldList) => ([...oldList, response.data]));
    } catch (error) {
      alertUser("error", "Das Item konnte nicht hinzugefügt werden.", error);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.delete(`/trips/${tripId}/groupPackings/${item.id}`, {
        headers: { Authorization: token },
      });
      alertUser("success", "Item gelöscht.");
      fetchList();
    } catch (error) {
      alertUser("error", "Das Item konnte nicht gelöscht werden.", error);
    }
  };

  const completeItem = async (item) => {
    try {
      const requestBody = {item:item.item, completed:!item.completed}
      await api.put(`/trips/${tripId}/groupPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      fetchList();
    } catch (error) {
      alertUser("error", "Das Item konnte nicht abgeschlossen werden.", error);
    }
  };

  const selectItem = async (item) => {
    if (item.userId === null) {
      try {
        await api.put(`/trips/${tripId}/groupPackings/${item.id}/responsible`, {}, {
          headers: { Authorization: token },
        });
        fetchList();
      } catch (error) {
        alertUser("error", "Das Item konnte nicht ausgewählt werden.", error);
      }
    } else {
      try{
        await api.delete(`/trips/${tripId}/groupPackings/${item.id}/responsible`, {
          headers: { Authorization: token },
        });
        fetchList();
      } catch (error) {
        alertUser("error", "Das Item konnte nicht entwählt werden.", error);
      }
    }
  };

  const updateItem = async (item, newName) => {
    try {
      const requestBody = {item:newName, completed:item.completed}
      await api.put(`/trips/${tripId}/groupPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      alertUser("success", "Item geändert.");
      fetchList();
    } catch (error) {
      alertUser("error", "Das Item konnte nicht geändert werden.", error);
    }
  };

  let content = <h1 style={{textAlign:"center", paddingTop:"20px"}}>Hier gibt es noch keine Items. Fügen Sie doch welche hinzu!</h1>

  if (list && list.length > 0) {
    content = (
      <div>
        <ul className="List list">
          {list.map((x) => (
            <li key={x.id} className="List element" style={{background: x.completed ? "#588157" : "#fefae0"}}>
              <GroupListItem
                item={x}
                editMode={editMode}
                handleComplete={completeItem}
                handleDelete={deleteItem}
                handleUpdate={updateItem}
                handleSelect={selectItem}
                avatars={avatars}
                userId={userId}
              >
              </GroupListItem>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    
    <div className="Carousel-List-Container">
      <h1 className="font-semibold Carousel title">Gruppenpackliste</h1>
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
            <Button backgroundColor={"beige"} onClick={() => {addItem(newItemName)}}>Sichern</Button>
            <Button backgroundColor={"beige"} onClick={() => {setPopupOpen(false)}}>Schliessen</Button>
          </div>
        </div>
      </div>}
      {!isPopupOpen && <div className="Carousel button-holder">
        <Button onClick={() => {setPopupOpen(true)}}>Item hinzufügen</Button>
        <Button onClick={() => {setEditMode(old => !old)}}>{editMode ? "Editor schliessen" : "Editieren"}</Button>
      </div>}
      {!isPopupOpen && content}
    </div>
  )
}

export default GroupPackingList;

GroupPackingList.propTypes = {
  avatars: PropTypes.array,
  userId: PropTypes.number,
  alertUser: PropTypes.func,
};