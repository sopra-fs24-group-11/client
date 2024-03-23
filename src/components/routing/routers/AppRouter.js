import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Dashboard2 from "../../views/Dashboard";
import Header from "../../views/Header";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/game/*" element={<GameGuard />}>
          <Route path="" element={<GameRouter base="/game" />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<GameGuard />}>
          <Route path="" element={<Dashboard2 />} />
        </Route>

        <Route path="/" element={<Navigate to="/game" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
