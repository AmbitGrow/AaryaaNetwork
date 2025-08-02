import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/AaryaaLogo.png";
import "../../Components/Header/Header.css";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const [circlePos, setCirclePos] = useState({ x: window.innerWidth, y: 0 });
  const [radius, setRadius] = useState(0);

  const calcRadius = (x, y) => {
    const distTL = Math.hypot(x, y);
    const distTR = Math.hypot(window.innerWidth - x, y);
    const distBL = Math.hypot(x, window.innerHeight - y);
    const distBR = Math.hypot(window.innerWidth - x, window.innerHeight - y);
    return Math.max(distTL, distTR, distBL, distBR);
  };

  useEffect(() => {
    let timeout;
    const updateCircle = () => {
      if (hamburgerRef.current) {
        const rect = hamburgerRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        setCirclePos({ x, y });
        setRadius(calcRadius(x, y));
      }
    };

    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateCircle, 100);
    };

    updateCircle();

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleMenu = () => {
    if (window.innerWidth <= 1100) {
      setMenuOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const body = document.body;

    if (menuOpen) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }

    return () => body.classList.remove("no-scroll");
  }, [menuOpen]);

  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1100 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  return (
    <header className={`header ${menuOpen ? "menu-open" : ""}`}>
      <div className="header-container">
        {/* Your nav and content go here */}
        <div className="nav-main">
          <div className="nav-left">
            <div className="nav-img">
              <img src={logo} alt="Logo" onClick={() => navigate("/")} />
            </div>
            <div className="nav-left-links">
              <Link
                to="/aaryaaTV"
                style={{ textDecoration: "none" }}
                className="nav-link"
           onClick={() => {
                    if (window.innerWidth <= 1100) {
                      setMenuOpen(false);
                    }
                  }}
              >
                <p>Tv</p>
              </Link>
              <Link
                style={{ textDecoration: "none" }}
                className="nav-link"
                onClick={() =>
                  window.open(
                    "https://aaryaaphotography.smugmug.com/",
                    "_blank"
                  )
                }
              >
                <p>Studio</p>
              </Link>
              <Link
                to="/"
                style={{ textDecoration: "none" }}
                className="nav-link"
              >
                <p>Network</p>
              </Link>
            </div>
          </div>

          <div className="nav-right">
            <div className="nav-list">
              <ul className="nav-menu">
                <li>
                  <Link
                    to="/"
                    style={{ textDecoration: "none" }}
                    className="nav-list-link"
                  >
                    <p>Home</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    state={{ scrollTo: "about-section" }}
                    style={{ textDecoration: "none" }}
                    className="nav-list-link"
                  >
                    <p>About</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    style={{ textDecoration: "none" }}
                    className="nav-list-link"
                  >
                    <p>Contact</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customizedplan"
                    style={{ textDecoration: "none" }}
                    className="nav-list-link"
                  >
                    <p>All Plan</p>
                  </Link>
                </li>
                <li>
                  <div className="quickpay">
                    <div className="quickpay-header">
                      <p className="text">Quick Pay</p>
                      <p className="icon">
                        <FaArrowRightLong className="arrow-icon" />
                      </p>
                    </div>
                    <div className="quickpay-links">
                      <a
                        href="https://tn.railwire.co.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Railwire
                      </a>
                      <a
                        href="https://portal.bsnl.in/myportal/cfa.do"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        BSNL
                      </a>
                      <a
                        href="https://www.airtel.in/broadband-bill-pay"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Airtel
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="hamburger-icon"
            ref={hamburgerRef}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <RxCross2 color="white" /> : <GiHamburgerMenu />}
          </div>

          <div
            className={`circle-bg ${menuOpen ? "active" : ""}`}
            style={{
              clipPath: menuOpen
                ? `circle(${radius}px at ${circlePos.x}px ${circlePos.y}px)`
                : `circle(0px at ${circlePos.x}px ${circlePos.y}px)`,
              WebkitClipPath: menuOpen
                ? `circle(${radius}px at ${circlePos.x}px ${circlePos.y}px)`
                : `circle(0px at ${circlePos.x}px ${circlePos.y}px)`,
            }}
            onClick={toggleMenu}
          >
            <ul className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <li>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={toggleMenu}
                  state={{ scrollTo: "about-section" }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={toggleMenu}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/customizedplan" onClick={toggleMenu}>
                  All Plan
                </Link>
              </li>

              {/* Quick Pay Dropdown for Mobile */}
              <li>
                <div
                  className="quickpay-mobile-header"
                  onClick={() => setShowLinks((prev) => !prev)}
                >
                  <p className="text">Quick Pay</p>
                  <p>
                    <RiArrowDropDownLine
                      className={`down-arrow ${showLinks ? "rotate-up" : ""}`}
                    />
                  </p>
                </div>
                <div
                  className={`quickpay-links-wrapper ${
                    showLinks ? "open" : ""
                  }`}
                >
                  <div className="quickpay-links-mobile">
                    <a
                      href="https://tn.railwire.co.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>Railwire</p>
                    </a>
                    <a
                      href="https://portal.bsnl.in/myportal/cfa.do"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>BSNL</p>
                    </a>
                    <a
                      href="https://www.airtel.in/broadband-bill-pay"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>Airtel</p>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
