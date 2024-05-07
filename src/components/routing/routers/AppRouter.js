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
import Feedback from "../../views/Feedback";

const AppRouter = ({alertUser}) => {
  return (
    <BrowserRouter>
      <Header alertUser={alertUser}/>
      <Routes>
        {/*------------------ TESTPAGES ------------------*/}

        <Route path="/testpage" element={<TestPage />} />

        <Route path="/registernew" element={<RegisterExampleNew alertUser={alertUser} />} />

        {/*---------------------------------------------- */}
        
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

        <Route path="/dashboard" element={<GameGuard />}>
          <Route path="" element={<Dashboard alertUser={alertUser}/>} />
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

        <Route path="/history" element={<GameGuard />}>
          <Route path="" element={<History alertUser={alertUser}/>} />
        </Route>

        <Route path="/feedback" element={<GameGuard />}>
          <Route path="" element={<Feedback alertUser={alertUser}/>} />
        </Route>

        <Route path="/createTrip" element={<GameGuard />}>
          <Route path="" element={<CreateTrip alertUser={alertUser}/>} />
        </Route>

        <Route path="/chooseConnection/:tripId" element={<GameGuard />}>
          <Route path="" element={<ChooseConnection alertUser={alertUser}/>} />
        </Route>

        <Route path="/tripOverview/:tripId" element={<GameGuard />}>
          <Route path="" element={<TripOverview alertUser={alertUser}/>} />
        </Route>

        <Route path="/customizeTrip/:tripId" element={<GameGuard />}>
          <Route path="" element={<CustomizeTrip alertUser={alertUser}/>} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

AppRouter.propTypes = {
  alertUser: PropTypes.func,
};
