import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lists.scss"
import ConfirmPopup from "../ui/ConfirmPopup";
import {TemplateListItem} from "../ui/ListItem"

// to do: use below two things for alert / confirm messages:
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const ListTemplate = () => {
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(false); // edit mode for all items
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState("");
  const [change, setChange] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/packings", {
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
      const response = await api.post("/users/packings", requestBody, {
        headers: { Authorization: token },
      });
      setNewItemName("");
      setList((oldList) => ([...oldList, {item:response.data.item, id:response.data.id}]));
    } catch (error) {
      alert(`Something went wrong while adding an item: \n${handleError(error)}`);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/users/packings/${itemId}`, {
        headers: { Authorization: token },
      });
      setList((oldList) => oldList.filter(item => item.id !== itemId));
    } catch (error) {
      alert(`Something went wrong while deleting an item: \n${handleError(error)}`);
    }
  };

  const updateItem = async (itemId, item) => {
    try {
      const requestBody = JSON.stringify({ item });
      await api.put(`/users/packings/${itemId}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      
    } catch (error) {
      alert(`Something went wrong while updating an item: \n${handleError(error)}`);
    }
  };

  let content = {};

  if (list && list.length > 0) {
    content = (
      <div className="ListTemplate template">
        <ul className="ListTemplate list">
          {list.map((x) => (
            <li key={x.id} className="ListTemplate element">
              <TemplateListItem
                item={x}
                handleDelete={(itemId) => deleteItem(itemId)}
                handleUpdate={(itemId, newItem) => updateItem(itemId, newItem)}
                editMode={editMode}
              >
              </TemplateListItem>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    content = "No Items yet, feel free to add some!"
  }

  return (
    <BaseContainer>
      <div className="ListTemplate container">
        <div className="ListTemplate button-holder">
          <Button
            backgroundColor={"green"}
            onClick={() => setPopupOpen(true)}
          >
            Add item
          </Button>
          <Button
            backgroundColor={"#ffbe0b"}
            onClick={() => setEditMode(old => !old)}
          >
            {editMode ? "Normal Mode" : "Edit Mode"}
          </Button>
        </div>
        <ConfirmPopup
          header="Enter your next item"
          className="popup"
          isOpen={isPopupOpen}
        >
          <div className="List popup">
            <input
              className="List popup-input"
              type="text"
              value={newItemName}
              placeholder={"Next Item "}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <div>
              <Button backgroundColor={"beige"} onClick={() => addItem(newItemName)}>Save</Button>
              <Button backgroundColor={"beige"} onClick={() => {setPopupOpen(false);setNewItemName("");}}>Cancel</Button>
            </div>
          </div>
        </ConfirmPopup>
        {content}
      </div>
    </BaseContainer>
  )
}

export default ListTemplate;