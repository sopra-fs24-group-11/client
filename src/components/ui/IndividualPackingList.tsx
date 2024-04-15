import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { IndividualListItem } from "./ListItem"
import ConfirmPopup from "../ui/ConfirmPopup";
import { useParams } from "react-router-dom";

const IndividualPackingList = () => {
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
        handleError(error);
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
      setList((oldList) => ([...oldList, response.data]));
    } catch (error) {
      alert(`Something went wrong while adding an item: \n${handleError(error)}`);
    }
  };

  const transferTemplate = async () => {
    try {
      await api.post(`/trips/${tripId}/transfer/packings`, {}, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
    } catch (error) {
      alert(`Something went wrong while transfering the items: \n${handleError(error)}`);
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
      alert(`Something went wrong while completing the item: \n${handleError(error)}`);
    }
  };

  const updateItem = async (item, newName) => {
    try {
      const requestBody = {item:newName, completed:item.completed}
      await api.put(`/trips/${tripId}/individualPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
    } catch (error) {
      alert(`Something went wrong while updating the item: \n${handleError(error)}`);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.delete(`/trips/${tripId}/individualPackings/${item.id}`, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
    } catch (error) {
      alert(`Something went wrong while deleting the item: \n${handleError(error)}`);
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
    content = "No Items yet, feel free to add some!"
  }

  return (
    <div className="Carousel-List-Container">
      <h1 className="text-2xl font-semibold Carousel title">Individual Packing List</h1>
      {isPopupOpen && <div className="List popup-container11">
        <div className="List popup11">
          <input
            className="List popup-input11"
            type="text"
            value={newItemName}
            placeholder={"Next Item "}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <div>
            <Button backgroundColor={"beige"} onClick={() => {addItem(newItemName)}}>Save</Button>
            <Button backgroundColor={"beige"} onClick={() => {setPopupOpen(false)}}>Close</Button>
          </div>
        </div>
      </div>}
      {!isPopupOpen && <div className="Carousel button-holder">
        <Button backgroundColor={"white"} onClick={() => {setPopupOpen(true)}}>Add Item</Button>
        <Button backgroundColor={"white"} onClick={() => {setEditMode(old => !old)}}>{editMode ? "Normal Mode" : "Edit Mode"}</Button>
        <Button backgroundColor={"white"} onClick={() => {transferTemplate()}}>Transfer</Button>
      </div>}
      {!isPopupOpen && content}
    </div>
  )
}

export default IndividualPackingList;