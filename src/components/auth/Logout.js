import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout");
      alert("Logged out successfully!");
      localStorage.removeItem("authToken");
      navigate("/signup");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <button className="logout-btn" onClick={handleLogout}>Logout</button>;
};

export default Logout;
