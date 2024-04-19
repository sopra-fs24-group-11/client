import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { GroupListItem } from "./ListItem"
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const GroupPackingList = ({avatars, userId, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen}) => {
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
      const response = await api.get(`/trips/${tripId}/groupPackings`, {
        headers: { Authorization: token },
      });
      setList(response.data)
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/groupPackings`, {
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
      const response = await api.post(`/trips/${tripId}/groupPackings`, requestBody, {
        headers: { Authorization: token },
      });
      setNewItemName("");
      setList((oldList) => ([...oldList, response.data]));
      setSnackbarMessage("Item added.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Item couldn't be added.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.delete(`/trips/${tripId}/groupPackings/${item.id}`, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      setSnackbarMessage("Item deleted.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Item couldn't be deleted.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const completeItem = async (item) => {
    try {
      const requestBody = {item:item.item, completed:!item.completed}
      await api.put(`/trips/${tripId}/groupPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Item couldn't be completed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const selectItem = async (item) => {
    if (item.userId === null) {
      try {
        await api.put(`/trips/${tripId}/groupPackings/${item.id}/responsible`, {}, {
          headers: { Authorization: token },
        });
        setChange(old => old + 1);
      } catch (error) {
        handleError(error);
        setSnackbarMessage("Item couldn't be selected.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      try{
        await api.delete(`/trips/${tripId}/groupPackings/${item.id}/responsible`, {
          headers: { Authorization: token },
        });
        setChange(old => old + 1);
      } catch (error) {
        handleError(error);
        setSnackbarMessage("Item couldn't be deselected.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const updateItem = async (item, newName) => {
    try {
      const requestBody = {item:newName, completed:item.completed}
      await api.put(`/trips/${tripId}/groupPackings/${item.id}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      setSnackbarMessage("Item updated.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Item couldn't be updated.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
      <h1 className="text-2xl font-semibold Carousel title">Group Packing List</h1>
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

export default GroupPackingList;

GroupPackingList.propTypes = {
  avatars: PropTypes.array,
  userId: PropTypes.number,
  setSnackbarMessage: PropTypes.func,
  setSnackbarSeverity: PropTypes.func,
  setSnackbarOpen: PropTypes.func,
};