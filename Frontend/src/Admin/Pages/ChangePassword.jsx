import React, { useState } from "react";
import API from "../Api/Api";
import "../Styles/ChangePassword.css";
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";
const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
useAutoLogout();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPass !== confirmPass) {
      // setError("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const res = await API.post(
        "/api/settings/change-password",
        {
          email: email,
          currentPassword: currentPass,
          newPassword: newPass,
        },
        {
          withCredentials: true,
        }
      );

      // setMessage(res.data.message);//
      toast.success(res.data.message);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      // setError(err.response?.data?.error || "Failed to change password.");
      toast.error(err.response?.data?.error || "Failed to change password.");
    }
  };

  return (
    <div className="change-password-form">
      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Current Password:</label>
        <input
          type="password"
          required
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
        />

        <label>New Password:</label>
        <input
          type="password"
          required
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <label>Confirm New Password:</label>
        <input
          type="password"
          required
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <button type="submit">Change Password</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
