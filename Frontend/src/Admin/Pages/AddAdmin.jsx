import React, { useState } from "react";
import API from "../Api/Api";
import "../Styles/AddAdmin.css";
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useAutoLogout();
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPass) {
      // setError("Passwords do not match.");
      toast.error("Passwords do not match.");

      return;
    }

    try {
      const res = await API.post("/settings/add", { email, password } ,{withCredentials: true});
      // setMessage(res.data.message);
      toast.success("Admin added successfully!");
      setEmail("");
      setPassword("");
      setConfirmPass("");
    } catch (err) {
      // setError(err.response?.data?.error || "Failed to add admin.");
      toast.error(err.response?.data?.error || "Failed to add admin.");
    }
  };

  return (
    <div className="add-admin-form">
      <h3>Add New Admin</h3>
      <form onSubmit={handleAddAdmin}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          required
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <button type="submit">Add Admin</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddAdmin;
