import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Switch } from "../ui/switch"
import { Card,  CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label"
import { Progress } from "../ui/progress"
import { Skeleton } from "../ui/skeleton";


const Dashboard = () => {
  return (
    <div>
    <h1>Dashboard</h1>
    
    <div>
        <div className="my-4"></div>

        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader >
                    <CardTitle>This is an example Card</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>

        <div className="flex justify-center items-center h-20">
            <div className="flex items-center space-x-3">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
        </div>

        <div>
            <Progress value={20} />
        </div>

        
        <div className="flex flex-col space-y-3 h-36 items-center justify-center">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    </div>
    </div>
  );
}

export default Dashboard;