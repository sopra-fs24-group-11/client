import React from "react";
import PropTypes from "prop-types";
import {Button} from "components/ui/Button";
const ToDoList = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold Carousel title">To Do List</h1>
      <Button backgroundColor={"lightblue"}>Add Item</Button>
      <Button backgroundColor={"yellow"}>Edit Mode</Button>
    </div>
  )
}

export default ToDoList;