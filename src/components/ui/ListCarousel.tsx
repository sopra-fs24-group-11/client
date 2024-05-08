import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "../../styles/ui/ListCarousel.scss";
import ToDoList from "./ToDoList";
import IndividualPackingList from "./IndividualPackingList";
import GroupPackingList from "./GroupPackingList";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"
  
export function ListCarousel({alertUser}) {
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
          userId: item.userId,
          image: `data:image/jpeg;base64,${item.profilePicture}`
      }));
      setAvatar(avatarArray);
      } catch (error) {
        alertUser("error", "", error);
      }
    };
    fetchData();
  }, [])

  return (
    <Carousel className="w-full max-w-xxl Carousel container">
      <CarouselContent>
        <CarouselItem>
          <IndividualPackingList
            alertUser={alertUser}
          >

          </IndividualPackingList>
        </CarouselItem>
        <CarouselItem>
          <GroupPackingList
            avatars={avatar}
            userId={userId}
            alertUser={alertUser}
          >
            
          </GroupPackingList>
        </CarouselItem>
        <CarouselItem>
          <ToDoList
            avatars={avatar}
            userId={userId}
            alertUser={alertUser}
          >
            
          </ToDoList>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

ListCarousel.propTypes = {
  alertUser: PropTypes.func,
}