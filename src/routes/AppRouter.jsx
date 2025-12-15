import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import ManageIntern from "../pages/ManageIntern";
import Settings from "../pages/Settings";
import Attendance from "../pages/Attendance";

const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route
        path="/manageintern"
        element={
          <PrivateRoute>
            <ManageIntern />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
