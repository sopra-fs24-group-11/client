import React, { useState } from "react";
import PropTypes from "prop-types";
import "styles/ui/Lists.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt , faCheck, faListCheck } from "@fortawesome/free-solid-svg-icons";

export const TemplateListItem = ({item, handleDelete, handleUpdate, editMode}) => {
  const [updateItemName, setUpdateItemName] = useState("");
  const [editing, setEditing] = useState(false);
  const handleSubmit = (event, item, newName) => {
    event.preventDefault();
    setEditing(false);
    if (!newName) {
      newName = item.item;
    }
    handleUpdate(item.id, newName);
    setUpdateItemName("");
  };  
  return(
    <div className="ListItem container">
      {editing ? (
        <form 
          className="ListItem form"
          onSubmit={(event) => handleSubmit(event, item, updateItemName)}>
          <input
            className="ListItem form-input"
            type="text"
            value={updateItemName}
            placeholder={item.item}
            onChange={(e) => setUpdateItemName(e.target.value)}
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
              <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" onClick={() => setEditing(true)} />
              <FontAwesomeIcon icon={faTrash} className="trash-icon" onClick={() => handleDelete(item.id)}/>
            </div>
          }
        </>
      )}
      
    </div>
  );
}

TemplateListItem.propTypes = {
  item: PropTypes.object,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  editMode: PropTypes.bool,
};


export const GroupListItem = ({item, editMode, handleComplete, handleDelete, handleUpdate, handleSelect, avatars, userId}) => {
  const [updateItemName, setUpdateItemName] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSubmit = (event, item, newName) => {
    event.preventDefault();
    setEditing(false);
    if (!newName) {
      newName = item.item;
    }
    handleUpdate(item, newName);
    setUpdateItemName("");
  };


  const avatarForItem = avatars.find(avatar => avatar.userId === item.userId);
  const avatarImage = avatarForItem ? (userId===item.userId ? 
    (<img className="List avatar" src={avatarForItem.image} alt="User Avatar" onClick={() => handleSelect(item)}/>) : (<img className="List avatar" src={avatarForItem.image} alt="User Avatar"/>)
  ) : (
    <div className="List avatar empty-circle" onClick={() => handleSelect(item)}></div>
  );

  return(
    <div className="ListItem container">
      {editing ? 
      <form 
      className="ListItem form"
      onSubmit={(event) => handleSubmit(event, item, updateItemName)}>
        <input
          className="ListItem form-input"
          type="text"
          value={updateItemName}
          placeholder={item.item}
          onChange={(e) => setUpdateItemName(e.target.value)}
          style={{ color: "black" }}
        />
        <button type="submit" className="ListItem update-button">
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
      : <>
      {editMode ?
      <>
      <div className="ListItem name">{item.item}</div>
        {(item.userId===null || userId===item.userId) && <div className="item-icons">
          <FontAwesomeIcon icon={faPencilAlt}  className="edit-icon" onClick={() => setEditing(true)}/>
          <FontAwesomeIcon icon={faTrash} className="trash-icon" onClick={() => handleDelete(item)}/>
        </div>}
        </>
      : 
        <>
          <div className="ListItem name">{item.item}</div>
          {userId===item.userId && <div className="item-icons">
            <FontAwesomeIcon icon={faListCheck} className="complete-icon" onClick={() => handleComplete(item)}/> 
          </div>}
        </>
      }
      </>
    }
    {avatarImage}
    </div>
  );
}

GroupListItem.propTypes = {
  item: PropTypes.object,
  editMode: PropTypes.bool,
  handleComplete: PropTypes.func,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  handleSelect: PropTypes.func,
  avatars: PropTypes.array,
  userId: PropTypes.number,
};


export const IndividualListItem = ({item, editMode, handleComplete, handleDelete, handleUpdate}) => {
  const [updateItemName, setUpdateItemName] = useState("");
  const [editing, setEditing] = useState(false);
  const handleSubmit = (event, item, newName) => {
    event.preventDefault();
    setEditing(false);
    if (!newName) {
      newName = item.item;
    }
    handleUpdate(item, newName);
    setUpdateItemName("");
  };
  return(
    <div className="ListItem container">
      {editing ? 
      <form 
      className="ListItem form"
      onSubmit={(event) => handleSubmit(event, item, updateItemName)}>
        <input
          className="ListItem form-input"
          type="text"
          value={updateItemName}
          placeholder={item.item}
          onChange={(e) => setUpdateItemName(e.target.value)}
          style={{ color: "black" }}
        />
        <button type="submit" className="ListItem update-button">
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
      : <>
      {editMode ?
      <>
      <div className="ListItem name">{item.item}</div>
        <div className="item-icons">
          <FontAwesomeIcon icon={faPencilAlt}  className="edit-icon" onClick={() => setEditing(true)}/>
          <FontAwesomeIcon icon={faTrash} className="trash-icon" onClick={() => handleDelete(item)}/>
        </div> 
        </>
      : 
        <>
          <div className="ListItem name">{item.item}</div>
          <div className="item-icons">
            <FontAwesomeIcon icon={faListCheck} className="complete-icon" onClick={() => handleComplete(item)}/> 
          </div>
        </>
      }
      </>
    }
    </div>
  );
}

IndividualListItem.propTypes = {
  item: PropTypes.object,
  editMode: PropTypes.bool,
  handleComplete: PropTypes.func,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
};
