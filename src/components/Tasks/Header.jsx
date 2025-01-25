import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../auth/Logout";

export const Header = () => {
    const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-nav">
        <button className="header-btn" onClick={() => navigate("/home")}>
          Task
        </button>
        <button className="header-btn" onClick={() => navigate("/feed")}>
          Feed
        </button>
      </div>
      <Logout />
    </div>
  );
};
