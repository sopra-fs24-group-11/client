import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/buttonshadcn";
import { Progress } from "../ui/progress";
import PropTypes from "prop-types";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import LinearIndeterminate from "components/ui/loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "components/ui/dialog";

const TestPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [friendList, setFriendList] = useState([]);
  // Example friends data - replace with actual data from your state

  const fetchFriends = async () => {
    try {
      const response = await api.get("/users/friends", {
        //DATA: [0: {friendId: 1, username: "Michael B.", points: 100, level: 1}, 1: {friendId: 2, username: "Ulf Z.", points: 200, level: 2]
        headers: { Authorization: token },
      });
      console.log(response.data);
      setFriendList(response.data); // Update state with fetched data
      setIsLoading(false); // Update loading state
    } catch (error) {
      handleError(error);
      setIsLoading(false); // Update loading state in case of error
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleAddFriendClick = () => {
    // Implement the logic to add a new friend
  };

  const handleRemoveFriend = (name) => {
    // Implement the logic to remove a friend
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for x seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LinearIndeterminate />;
  }

 {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
};

export default TestPage;
