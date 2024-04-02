import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { RegisterGuard } from "../routeProtectors/RegisterGuard";
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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginGuard />}>
          <Route path="" element={<Login />} />
        </Route>

        <Route path="/register" element={<RegisterGuard />}>
          <Route path="" element={<Register />} />
        </Route>
{/*------------------ TESTPAGES ------------------*/ }
        <Route path="/registerexample" element={<LoginGuard />}>
          <Route path="" element={<RegisterExample />} />
        </Route>

        <Route path="/testpage" element={<TestPage />} />
{/*---------------------------------------------- */ }
        <Route path="/dashboard" element={<GameGuard />}>
          <Route path="" element={<Dashboard />} />
        </Route>

        <Route path="/profile" element={<GameGuard />}>
          <Route path="" element={<UserProfile />} />
        </Route>

        <Route path="/friends" element={<GameGuard />}>
          <Route path="" element={<FriendListPage />} />
        </Route>

        <Route path="/createTrip" element={<GameGuard />}>
          <Route path="" element={<CreateTrip />} />
        </Route>

        <Route path="/chooseConnection" element={<GameGuard />}>
          <Route path="" element={<ChooseConnection />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
