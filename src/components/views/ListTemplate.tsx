import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/buttonshadcn";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/ListTemplate.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt , faCheck } from "@fortawesome/free-solid-svg-icons";

const ListItem = ({item, handleDelete, handleUpdate, editMode, editable, toggleEditable, handleInputChange, newItemName}) => {
  const handleSubmit = (event, itemId, name, defaultvalue) => {
    event.preventDefault();
    if (!name) {
      name = defaultvalue;
    }
    handleUpdate(itemId, name);
    toggleEditable(itemId);
  };
  return(
    <div className="ListItem container">
      {editable[item.id] ? (
        <form onSubmit={(event) => handleSubmit(event, item.id, newItemName[item.id], item.item)}>
          <input
            type="text"
            value={newItemName[item.id]}
            placeholder={item.item}
            onChange={(e) => handleInputChange(item.id, e.target.value)}
            style={{ color: "black" }}
          />
          <button type="submit" className="update-button">
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </form>
      ) : (
        <>
          <div className="ListItem name">{item.item}</div>
          {editMode && 
            <div className="item-icons">
              <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" onClick={() => toggleEditable(item.id)} />
              <FontAwesomeIcon icon={faTrash} className="trash-icon" onClick={() => handleDelete(item.id)}/>
            </div>
          }
        </>
      )}
      
    </div>
  );
}

ListItem.propTypes = {
  item: PropTypes.object,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  editMode: PropTypes.boolean,
  editable: PropTypes.boolean, 
  toggleEditable: PropTypes.func, 
  handleInputChange: PropTypes.func, 
  newItemName: PropTypes.string,
};

const ListTemplate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(false); // edit mode for all items
  const [editable, setEditable] = useState({}); // edit one specific item
  const [newItemName, setNewItemName] = useState({});

  const toggleEditable = (itemId) => {
    setEditable(oldEditable => ({
      ...oldEditable,
      [itemId]: !oldEditable[itemId] || false,
    }));
  };
  
  const toggleEditing = () => {
    setEditing(old => (!old));
    setEditable({});
    setNewItemName({});
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
  }, []);

  const addItem = async () => {
    try {
      let item = "apple";
      const requestBody = JSON.stringify({ item });
      const response = await api.post("/users/packings", requestBody, {
        headers: { Authorization: token },
      });

      setList((oldList) => ([...oldList, {item:response.data.item, id:response.data.id}]));
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const response = await api.delete(`/users/packings/${itemId}`, {
        headers: { Authorization: token },
      });
      setList((oldList) => oldList.filter(item => item.id !== itemId));
    } catch (error) {
      alert(`Something went wrong during deleting an item: \n${handleError(error)}`);
    }
  };

  const updateItem = async (itemId, item) => {
    try {
      const requestBody = JSON.stringify({ item });
      const response = await api.put(`/users/packings/${itemId}`, requestBody, {
        headers: { Authorization: token },
      });
      
      setList(oldList => {
        const index = oldList.findIndex(item => item.id === itemId);
        const updatedList = [...oldList];
        updatedList[index] = { ...updatedList[index], item: item };
        return updatedList;
      });
      
    } catch (error) {
      alert(`Something went wrong during deleting an item: \n${handleError(error)}`);
    }
  };

  const handleNewItemName = (itemId, val) => {
    setNewItemName(old => ({
      ...old,
      [itemId]:val
    }))
  }

  let content = {};

  if (list && list.length > 0) {
    content = (
      <div className="ListTemplate template">
        <ul className="ListTemplate list">
          {list.map((x) => (
            <li key={x.id} className="ListTemplate element">
              <ListItem
                item={x}
                handleDelete={(itemId) => deleteItem(itemId)}
                handleUpdate={(itemId, newItem) => updateItem(itemId, newItem)}
                editMode = {editing}
                editable = {editable}
                toggleEditable = {(itemId) => toggleEditable(itemId)}
                handleInputChange = {(itemId, value) => handleNewItemName(itemId, value)}
                newItemName = {newItemName}
              >
              </ListItem>
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
            backgroundColor={"#FFB703"}
            onClick={() => navigate("/dashboard")}
          >
            Back To Dashboard
          </Button>
          <Button
            backgroundColor={"red"}
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
          <Button
            backgroundColor={"green"}
            onClick={() => toggleEditing()}
          >
            {editing ? "Cancel" : "Edit Mode"}
          </Button>
        </div>
        {content}
      </div>
    </BaseContainer>
  )
}

export default ListTemplate;