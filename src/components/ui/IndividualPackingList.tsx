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
  const [change, setChange] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/individualPackings`, {
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
      const response = await api.post(`/trips/${tripId}/individualPackings`, requestBody, {
        headers: { Authorization: token },
      });
      setNewItemName("");
      alertUser("success", "Item added.");
      setList((oldList) => ([...oldList, response.data]));
    } catch (error) {
      alertUser("error", "Item couldn't be added.", error);
    }
  };

  const transferTemplate = async () => {
    try {
      await api.post(`/trips/${tripId}/transfer/packings`, {}, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      alertUser("success", "Template transferred.");
    } catch (error) {
      alertUser("error", "Template couldn't be transferred.", error);
    }
  };

  const completeItem = async (item) => {
    try {
      const requestBody = {item:item.item, completed:!item.completed}
      await api.put(`/trips/${tripId}/individualPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
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
      setChange(old => old + 1);
      alertUser("success", "Item updated.");
    } catch (error) {
      alertUser("error", "Item couldn't be updated.", error);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.delete(`/trips/${tripId}/individualPackings/${item.id}`, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      alertUser("success", "Item deleted.");
    } catch (error) {
      alertUser("error", "Item couldn't be deleted.", error);
    }
  };
  
  let content = {};

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
  } else {
    content = <h1 style={{textAlign:"center", paddingTop:"20px"}}>No Items yet, feel free to add some!</h1>
  }

  return (
    <div className="Carousel-List-Container">
      <h1 className=" font-semibold Carousel title">Individual Packing List</h1>
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
        <Button  onClick={() => {setPopupOpen(true)}}>Add Item</Button>
        <Button  onClick={() => {setEditMode(old => !old)}}>{editMode ? "Normal" : "Edit"}</Button>
        <Button  onClick={() => {transferTemplate()}}>Transfer</Button>
      </div>}
      {!isPopupOpen && content}
    </div>
  )
}

export default IndividualPackingList;

IndividualPackingList.propTypes = {
  alertUser: PropTypes.func,
};