import React, { useEffect, useState } from "react";
import "./IntroLoader.css"; // Create this file for animation styles
import logo from "../../assets/AaryaaLogo.png"; // replace with your actual logo path

const IntroLoader = ({ onFinish }) => {
  const [loadTime, setLoadTime] = useState(2000); // default delay

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const speed = connection?.effectiveType;

    if (speed === "4g") setLoadTime(2000);
    else if (speed === "3g") setLoadTime(3000);
    else if (speed === "2g" || speed === "slow-2g") setLoadTime(4000);
    else setLoadTime(2500);

    const timer = setTimeout(() => {
      onFinish();
    }, loadTime);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-loader">
      <div className="intro-text">
        <img src={logo} alt="Logo" className="intro-logo" />
        <p>Tv - Studio - Network</p>
      </div>
    </div>
  );
};

export default IntroLoader;
