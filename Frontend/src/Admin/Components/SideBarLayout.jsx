import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../Styles/SideBarLayout.css";
import axios from "axios";
import API from "../Api/Api";
import logo from "../../assets/AaryaaLogo.png";
import { useNavigate } from "react-router-dom";

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      await API.post(
        "/api/logout",
        {},
        {
          withCredentials: true, // Needed to send cookies
        }
      );
      navigate("/admin/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              height: "55px",
              width: "150px",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
              padding: "10px",
            }}
            onClick={toggleSidebar}
          >
            <img
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "180px",
              }}
              src={logo}
            ></img>
          </div>
        </div>
        <nav className="sidebar-links">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/view-plans">View Plans</Link>
          <Link to="/admin/add-plans">Add Plans</Link>
          <Link to="/admin/update-gst">Update GST</Link>
          <Link to="/admin/settings">Settings</Link>
          <Link className="logout-link" onClick={handleLogout}>
            Logout
          </Link>
        </nav>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
