import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/ui/Lists.scss"
import PropTypes from "prop-types";
import {TemplateListItem} from "../ui/ListItem"

const ListTemplate = ({alertUser}) => {
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
        alertUser("error", "Couldn't fetch the list.", error);
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
      alertUser("success", "Item added.");
      setList((oldList) => ([...oldList, {item:response.data.item, id:response.data.id}]));
    } catch (error) {
      alertUser("error", "Couldn't add the item.", error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/users/packings/${itemId}`, {
        headers: { Authorization: token },
      });
      alertUser("success", "Item deleted.");
      setChange(old => old + 1);
    } catch (error) {
      alertUser("error", "Couldn't delete the item.", error);
    }
  };

  const updateItem = async (itemId, item) => {
    try {
      const requestBody = JSON.stringify({ item });
      await api.put(`/users/packings/${itemId}`, requestBody, {
        headers: { Authorization: token },
      });
      alertUser("success", "Item updated.");
      setChange(old => old + 1);
    } catch (error) {
      alertUser("error", "Couldn't update the item.", error);
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
        <Button backgroundColor={"white"} onClick={() => {setEditMode(old => !old)}}>{editMode ? "Normal" : "Edit"}</Button>
      </div>}
      {!isPopupOpen && content}
      </div>
    </BaseContainer>
  )
}

export default ListTemplate;

ListTemplate.propTypes = {
  alertUser: PropTypes.func,
};