import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { GroupListItem } from "./ListItem"
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";


const ToDoList = ({avatars, userId, alertUser}) => {
  const token = localStorage.getItem("token");
  const {tripId} = useParams();
  const [list, setList] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [change, setChange] = useState(1);

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
      const response = await api.get(`/trips/${tripId}/todos`, {
        headers: { Authorization: token },
      });
      setList(response.data)
    } catch (error) {
      alertUser("error", "", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/todos`, {
          headers: { Authorization: token },
        });
        setList(response.data)
      } catch (error) {
        alertUser("error", "", error);
      }
    };
    fetchData();
  }, [change]);

  const addItem = async (item) => {
    try {
      setPopupOpen(false);
      const requestBody = JSON.stringify({ item });
      const response = await api.post(`/trips/${tripId}/todos`, requestBody, {
        headers: { Authorization: token },
      });
      setNewItemName("");
      setList((oldList) => ([...oldList, response.data]));
      alertUser("success", "Item added.");
    } catch (error) {
      alertUser("error", "Item couldn't be added.", error);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.delete(`/trips/${tripId}/todos/${item.id}`, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      alertUser("success", "Item deleted.");
    } catch (error) {
      alertUser("error", "Item couldn't be deleted.", error);
    }
  };

  const completeItem = async (item) => {
    try {
      const requestBody = {item:item.item, completed:!item.completed}
      await api.put(`/trips/${tripId}/todos/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
    } catch (error) {
      alertUser("error", "Item couldn't be completed.", error);
    }
  };

  const selectItem = async (item) => {
    if (item.userId === null) {
      try {
        await api.put(`/trips/${tripId}/todos/${item.id}/responsible`, {}, {
          headers: { Authorization: token },
        });
        setChange(old => old + 1);
      } catch (error) {
        alertUser("error", "Item couldn't be selected.", error);
      }
    } else {
      try{
        await api.delete(`/trips/${tripId}/todos/${item.id}/responsible`, {
          headers: { Authorization: token },
        });
        setChange(old => old + 1);
      } catch (error) {
        alertUser("error", "Item couldn't be deselected.", error);
      }
    }
  };

  const updateItem = async (item, newName) => {
    try {
      const requestBody = {item:newName, completed:item.completed}
      await api.put(`/trips/${tripId}/todos/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      alertUser("success", "Item updated.");
    } catch (error) {
      alertUser("error", "Item couldn't be updated.", error);
    }
  };

  let content = {};

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
  } else {
    content = <h1 style={{textAlign:"center", color:"white", paddingTop:"20px"}}>No Items yet, feel free to add some!</h1>
  }

  return (
    <div className="Carousel-List-Container">
      <h1 className="text-2xl font-semibold Carousel title">To Do List</h1>
      {isPopupOpen && <div className="List popup-container11">
        <div className="List popup11">
          <input
            className="List popup-input11"
            type="text"
            value={newItemName}
            placeholder={"Next Item "}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <div className="List popup-buttons11">
            <Button backgroundColor={"beige"} onClick={() => {addItem(newItemName)}}>Save</Button>
            <Button backgroundColor={"beige"} onClick={() => {setPopupOpen(false)}}>Close</Button>
          </div>
        </div>
      </div>}
      {!isPopupOpen && <div className="Carousel button-holder">
        <Button backgroundColor={"white"} onClick={() => {setPopupOpen(true)}}>Add Item</Button>
        <Button backgroundColor={"white"} onClick={() => {setEditMode(old => !old)}}>{editMode ? "Normal" : "Edit"}</Button>
      </div>}
      {!isPopupOpen && content}
    </div>
  )
}

export default ToDoList;

ToDoList.propTypes = {
  avatars: PropTypes.array,
  userId: PropTypes.number,
  alertUser: PropTypes.func,
};