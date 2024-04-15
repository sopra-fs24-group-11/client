import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import {Button} from "components/ui/Button";
import { useParams } from "react-router-dom";
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
  const [avatar, setAvatar] = useState([]);
  const [userId, setUserId] = useState(0);
  const {tripId} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userdata = await api.get("/users", {
          headers: { Authorization: token },
        });
        setUserId(userdata.data.id);
        const response = await api.get(`/trips/${tripId}/pictures`, {
          headers: { Authorization: token }
        });
        const avatarArray = response.data.map(item => ({
          userId: item.id,
          image: `data:image/jpeg;base64,${item.profilePicture}`
      }));
      setAvatar(avatarArray);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, [])

  return (
    <Carousel className="w-full max-w-xxl Carousel container">
      <CarouselContent>
        <CarouselItem>
          <IndividualPackingList>

          </IndividualPackingList>
        </CarouselItem>
        <CarouselItem>
          <GroupPackingList
            avatars={avatar}
            userId={userId}
          >
            
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