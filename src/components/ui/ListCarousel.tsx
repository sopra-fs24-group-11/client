import React from "react";
import PropTypes from "prop-types";
import {Button} from "components/ui/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"
import "../../styles/ui/ListCarousel.scss";
import ToDoList from "./ToDoList";
import IndividualPackingList from "./IndividualPackingList";
import GroupPackingList from "./GroupPackingList";
  
export function ListCarousel() {
  return (
    <Carousel className="w-full max-w-xl Carousel container">
      <CarouselContent>
        <CarouselItem className="Carousel item">
          <IndividualPackingList>

          </IndividualPackingList>
        </CarouselItem>
        <CarouselItem>
          <GroupPackingList>

          </GroupPackingList>
        </CarouselItem>
        <CarouselItem>
          <ToDoList>
            
          </ToDoList>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}