import React, { useState } from "react";
import API from "../Api/Api";
import "../Styles/ChangeAdmin.css";
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";

const ChangeEmail = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: verify current, 2: OTP & new email
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useAutoLogout();

  const handleSendOtp = async () => {
    try {
      const res = await API.post(
        "/settings/change-email/request-otp",
        {
          currentEmail,
        },
        {
          withCredentials: true,
        }
      );
      // setMessage(res.data.message);
      toast.success(res.data.message);
      setStep(2);
      setError("");
    } catch (err) {
      // setError(err.response?.data?.error || 'Failed to send OTP');
      toast.error(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtpAndUpdate = async () => {
    try {
      const res = await API.post("/settings/change-email/verify-and-update", {
        currentEmail,
        newEmail,
        otp,
      });
      // setMessage(res.data.message);
      toast.success(res.data.message);
      setError("");
      setStep(1);
      setCurrentEmail("");
      setNewEmail("");
      setOtp("");
    } catch (err) {
      // setError(err.response?.data?.error || 'Verification failed');
      toast.error(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div className="change-email-container">
      <h2>Change Email</h2>
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter current email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtpAndUpdate}>Verify and Change</button>
        </>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ChangeEmail;
