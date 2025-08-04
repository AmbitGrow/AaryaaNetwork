// src/hooks/useAutoLogout.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Make sure react-toastify is installed and set up
import API from "../Api/Api";
const AUTO_LOGOUT_MINUTES = 30;

export default function useAutoLogout() {
  const navigate = useNavigate();
  const timer = useRef();


  useEffect(() => {
    const logout = async () => {
      try {
        await API.post("/api/logout", {}, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Auto-logout failed:", error);
      } finally {
        toast.info("You've been logged out due to 15 minutes of inactivity");
        navigate("/dashboard/login");
      }
    };

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        logout();
      }, AUTO_LOGOUT_MINUTES * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);
}
