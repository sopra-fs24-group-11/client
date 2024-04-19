import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Dashboard from "../../views/Dashboard";
import Header from "../../views/Header";
import RegisterExample from "../../views/RegisterExample";
import UserProfile from "../../views/UserProfile";
import Register from "../../views/Register";
import CreateTrip from "../../views/CreateTrip";
import FriendListPage from "../../views/FriendListPage";
import ChooseConnection from "../../views/ChooseConnection";
import TestPage from "../../views/TestPage";
import TripOverview from "../../views/TripOverview";
import CustomizeTrip from "../../views/CustomizeTrip";
import ListTemplate from "../../views/ListTemplate";
import PropTypes from "prop-types";

const AppRouter = ({alertUser}) => {
  return (
    <BrowserRouter>
      <Header alertUser={alertUser}/>
      <Routes>
        <Route path="/login" element={<LoginGuard />}>
          <Route path="" element={<Login alertUser={alertUser}/>} />
        </Route>

        <Route path="/register" element={<LoginGuard />}>
          <Route path="" element={<Register alertUser={alertUser}/>} />
        </Route>
        {/*------------------ TESTPAGES ------------------*/}
        <Route path="/registerexample" element={<LoginGuard />}>
          <Route path="" element={<RegisterExample />} />
        </Route>

        <Route path="/testpage" element={<TestPage />} />
        {/*---------------------------------------------- */}
        <Route path="/dashboard" element={<GameGuard />}>
          <Route path="" element={<Dashboard />} />
        </Route>

        <Route path="/profile" element={<GameGuard />}>
          <Route path="" element={<UserProfile alertUser={alertUser}/>} />
        </Route>

        <Route path="/template" element={<GameGuard />}>
          <Route path="" element={<ListTemplate alertUser={alertUser}/>} />
        </Route>

        <Route path="/friends" element={<GameGuard />}>
          <Route path="" element={<FriendListPage alertUser={alertUser}/>} />
        </Route>

        <Route path="/createTrip" element={<GameGuard />}>
          <Route path="" element={<CreateTrip />} />
        </Route>

        <Route path="/chooseConnection/:tripId" element={<GameGuard />}>
          <Route path="" element={<ChooseConnection />} />
        </Route>

        <Route path="/tripOverview/:tripId" element={<GameGuard />}>
          <Route path="" element={<TripOverview />} />
        </Route>

        <Route path="/customizeTrip/:tripId" element={<GameGuard />}>
          <Route path="" element={<CustomizeTrip />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

AppRouter.propTypes = {
  alertUser: PropTypes.func,
}