import React from "react";
import PropTypes from "prop-types";
import {Button} from "components/ui/Button";
import TripIndividualListItem from "./TripIndividualListItem"

const IndividualPackingList = () => {
  let content = "abc";
  return (
    <div>
      <h1 className="text-2xl font-semibold Carousel title">Individual Packing List</h1>
      <div className="Carousel button-holder">
        <Button backgroundColor={"white"}>Add Item</Button>
        <Button backgroundColor={"white"}>Edit Mode</Button>
      </div>
      <div className="IndividualPackingList item-holder"> 
        {content}
        {/* <TripIndividualListItem>

        </TripIndividualListItem> */}
      </div>
    </div>
  )
}

export default IndividualPackingList;