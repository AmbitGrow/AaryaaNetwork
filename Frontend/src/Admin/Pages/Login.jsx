import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import API from "../Api/Api";
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useAutoLogout();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
  const maliciousPattern =
    /(--|;|'|"|\/\*|\*\/|#|\b(union|select|insert|delete|drop|update|exec|truncate|declare|handler|openrowset|cast|convert)\b|<script|<\/script|onerror|onload|javascript:)/i;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (validateInput()) {
      try {
        const res = await API.post("/api/login", { email, password });
        localStorage.setItem("token", res.data.token);
        navigate("/admin/dashboard");
      } catch (err) {
        const msg = err.response?.data?.message || "Login failed";
        setError(msg);
      }
    }
    return;
  };

  const validateInput = () => {
    let valid = true;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      valid = false;
    }

    // if (!passwordPattern.test(password)) {
    //   newErrors.password =
    //     "Password must be 8-16 characters, include uppercase, lowercase, number, and special character.";
    //   valid = false;
    // }

    // Block common SQLi/XSS patterns
    if (maliciousPattern.test(email) || maliciousPattern.test(password)) {
      toast.error("Input contains potentially malicious content.");
      valid = false;
    }

    return valid;
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && <p>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
