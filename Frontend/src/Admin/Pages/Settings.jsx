import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import AddAdmin from "./AddAdmin";
import ChangeAdminEmail from "./ChangeAdmin";
import "../Styles/SettingsPage.css";
import useAutoLogout from "../Hooks/useAutoLogout";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("change");
useAutoLogout();

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-tabs">
        <button
          className={activeTab === "change" ? "active" : ""}
          onClick={() => setActiveTab("change")}
        >
          Change Password
        </button>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Admin
        </button>
                <button
          className={activeTab === "change-email" ? "active" : ""}
          onClick={() => setActiveTab("change-email")}
        >
          Change Admin Email
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "change" && <ChangePassword />}
        {activeTab === "add" && <AddAdmin />}
        {activeTab === "change-email" && <ChangeAdminEmail />}
      </div>
    </div>
  );
};

export default SettingsPage;
