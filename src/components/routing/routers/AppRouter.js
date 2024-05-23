import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Dashboard from "../../views/Dashboard";
import Header from "../../views/Header";
import UserProfile from "../../views/UserProfile";
import CreateTrip from "../../views/CreateTrip";
import FriendListPage from "../../views/FriendListPage";
import ChooseConnection from "../../views/ChooseConnection";
import TripOverview from "../../views/TripOverview";
import CustomizeTrip from "../../views/CustomizeTrip";
import ListTemplate from "../../views/ListTemplate";
import History from "../../views/History";
import PropTypes from "prop-types";
import Feedback from "../../views/Feedback";
import Register from "../../views/Register";
import NotFound from "../../ui/NotFound";

const AppRouter = ({ alertUser }) => {
  return (
    <BrowserRouter>
      <Header alertUser={alertUser} />
      <Routes>
        <Route path="/auth" element={<LoginGuard />}>
          <Route path="" element={<Register alertUser={alertUser} />} />
        </Route>
        <Route path="/dashboard" element={<GameGuard />}>
          <Route path="" element={<Dashboard alertUser={alertUser} />} />
        </Route>

        <Route path="/profile" element={<GameGuard />}>
          <Route path="" element={<UserProfile alertUser={alertUser} />} />
        </Route>

        <Route path="/template" element={<GameGuard />}>
          <Route path="" element={<ListTemplate alertUser={alertUser} />} />
        </Route>

        <Route path="/friends" element={<GameGuard />}>
          <Route path="" element={<FriendListPage alertUser={alertUser} />} />
        </Route>

        <Route path="/history" element={<GameGuard />}>
          <Route path="" element={<History alertUser={alertUser} />} />
        </Route>

        <Route path="/feedback" element={<GameGuard />}>
          <Route path="" element={<Feedback alertUser={alertUser} />} />
        </Route>

        <Route path="/createTrip" element={<GameGuard />}>
          <Route path="" element={<CreateTrip alertUser={alertUser} />} />
        </Route>

        <Route path="/chooseConnection/:tripId" element={<GameGuard />}>
          <Route path="" element={<ChooseConnection alertUser={alertUser} />} />
        </Route>

        <Route path="/tripOverview/:tripId" element={<GameGuard />}>
          <Route path="" element={<TripOverview alertUser={alertUser} />} />
        </Route>

        <Route path="/customizeTrip/:tripId" element={<GameGuard />}>
          <Route path="" element={<CustomizeTrip alertUser={alertUser} />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<GameGuard />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

AppRouter.propTypes = {
  alertUser: PropTypes.func,
};
