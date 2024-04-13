import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "styles/views/ListTemplate.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt , faCheck } from "@fortawesome/free-solid-svg-icons";

const TripSharedListItem = ({item, handleDelete, handleUpdate, editMode, editable, toggleEditable, handleInputChange, updateItemName}) => {
  const handleSubmit = (event, itemId, name, defaultvalue) => {
    event.preventDefault();
    toggleEditable(itemId);
    if (!name) {
      name = defaultvalue;
    }
    handleUpdate(itemId, name);
  };
  return(
    <div className="ListItem container">
      {editable[item.id] ? (
        <form 
          className="ListItem form"
          onSubmit={(event) => handleSubmit(event, item.id, updateItemName[item.id], item.item)}>
          <input
            className="ListItem form-input"
            type="text"
            value={updateItemName[item.id] || ""}
            placeholder={item.item}
            onChange={(e) => handleInputChange(item.id, e.target.value)}
            style={{ color: "black" }}
          />
          <button type="submit" className="ListItem update-button">
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

TripSharedListItem.propTypes = {
  item: PropTypes.object,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  editMode: PropTypes.bool,
  editable: PropTypes.object, 
  toggleEditable: PropTypes.func, 
  handleInputChange: PropTypes.func, 
  updateItemName: PropTypes.object,
};

export default TripSharedListItem;