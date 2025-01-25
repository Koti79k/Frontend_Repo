import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskManagement from "./components/Tasks/TaskManagement";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import "./App.css";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Feed from "./components/Tasks/Feed";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/home" element={<TaskManagement />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;