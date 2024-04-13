import React from "react";
import PropTypes from "prop-types";
import {Button} from "components/ui/Button";
const ToDoList = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold Carousel title">To Do List</h1>
      <div className="Carousel button-holder">
        <Button backgroundColor={"white"}>Add Item</Button>
        <Button backgroundColor={"white"}>Edit Mode</Button>
      </div>
    </div>
  )
}

export default ToDoList;