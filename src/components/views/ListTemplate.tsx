import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lists.scss"
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

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
      setSnackbarMessage("Item added.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setList((oldList) => ([...oldList, {item:response.data.item, id:response.data.id}]));
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Couldn't add the item.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/users/packings/${itemId}`, {
        headers: { Authorization: token },
      });
      setSnackbarMessage("Item deleted.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setList((oldList) => oldList.filter(item => item.id !== itemId));
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Couldn't delete the item.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const updateItem = async (itemId, item) => {
    try {
      const requestBody = JSON.stringify({ item });
      await api.put(`/users/packings/${itemId}`, requestBody, {
        headers: { Authorization: token },
      });
      setChange(old => old + 1);
      setSnackbarMessage("Item updated.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      handleError(error);
      setSnackbarMessage("Couldn't update the item.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
    content = <h1>No Items yet, feel free to add some!</h1>
  }

  return (
    <BaseContainer>
      <div className="ListTemplate container">
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
      {!isPopupOpen && <div className="ListTemplate button-holder">
        <Button backgroundColor={"white"} onClick={() => {setPopupOpen(true)}}>Add Item</Button>
        <Button backgroundColor={"white"} onClick={() => {setEditMode(old => !old)}}>{editMode ? "Normal Mode" : "Edit Mode"}</Button>
      </div>}
      {!isPopupOpen && content}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </BaseContainer>
  )
}

export default ListTemplate;