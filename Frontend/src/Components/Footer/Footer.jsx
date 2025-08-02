import React from "react";
import logo from "../../assets/FooterLogo.png";
// import logo from "../../assets/FooterLogo.png";
import "../Footer/Footer.css";
import { AiFillInstagram } from "react-icons/ai";
import { AiFillFacebook } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";
import { AiFillYoutube } from "react-icons/ai";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-main">
      <div className="footer-div">
        <div className="footer-one">
          {/* <div className="img"></div> */}
          <img src={logo}></img>
          <h4>Let`s Connect and Collaborate</h4>
          <div className="phn">
            <div className="phn-m">
              <p className="ph-h">Phone Number</p>
              <a
                onClick={() => {
                  window.location.href = "tel:+917708067932";
                }}
              >
                +91 7708067932
              </a>
              <a
                onClick={() => {
                  window.location.href = "tel:+919962201081";
                }}
              >
                +91 9962201081
              </a>
            </div>
            <div className="phn-m">
              <p className="ph-h">Email</p>
              <p
                onClick={() => {
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=info@aaryaanetwork@gmail.com&su=Inquiry&body=Hello%20I%20want%20to%20know%20more%20about%20your%20services",
                    "_blank"
                  );
                }}
              >
                aaryaanetwork@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="footer-q-f">
          <div className="footer-two">
            <h4>Quick Links</h4>
            <div className="div-anchor">
              <Link
                to="/"
                state={{ scrollTo: "price-section" }}
                style={{ textDecoration: "none" }}
                className="f-q-link"
              >
                <p>Pricing</p>
              </Link>
              <Link
                to="/"
                state={{ scrollTo: "about-section" }}
                style={{ textDecoration: "none" }}
                className="f-q-link"
              >
                <p>About Us</p>
              </Link>
              <Link
                to="/contact"
                // state={{ scrollTo: "about-section" }}
                style={{ textDecoration: "none" }}
                className="f-q-link"
              >
                <p>Contact Us</p>
              </Link>
              <Link
                to="/customizedplan"
                // state={{ scrollTo: "about-section" }}
                style={{ textDecoration: "none" }}
                className="f-q-link"
              >
                <p>Customized Plan</p>
              </Link>
              <Link
                to="/"
                state={{ scrollTo: "faq-section" }}
                style={{ textDecoration: "none" }}
                className="f-q-link"
              >
                <p>FAQ</p>
              </Link>
            </div>
          </div>
          <div className="footer-three">
            <h4 className="footer-heading">Follow Our Social Media</h4>
            <div className="footer-three-links">
              <div className="row top-row">
                <div
                  className="footer-icon-div"
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/share/1AZnobBpY6/?mibextid=wwXIfr",
                      "_blank"
                    )
                  }
                >
                  <AiFillFacebook className="footer-icon" />
                </div>
                <div
                  className="footer-icon-div"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/aaryaa_network?igsh=MXc0eXJ4cWVweG5xcg==",
                      "_blank"
                    )
                  }
                >
                  <AiFillInstagram className="footer-icon" />
                </div>
                <div
                  className="footer-icon-div"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/aaryaatv/profilecard/?igsh=MXdodjZra3o2MmI2Ng==",
                      "_blank"
                    )
                  }
                >
                  <AiFillInstagram className="footer-icon" />
                  <div className="circle-tv">
                    <p>Tv</p>
                  </div>
                </div>
              </div>
              <div className="row bottom-row">
                <div
                  className="footer-icon-div"
                  onClick={() =>
                    window.open("https://wa.me/917708067932", "_blank")
                  }
                >
                  <RiWhatsappFill className="footer-icon" />
                </div>
                <div
                  className="footer-icon-div"
                  onClick={() =>
                    window.open(
                      "https://youtube.com/@aaryaatv?si=N2Ofgg3v6nkQSy5g",
                      "_blank"
                    )
                  }
                >
                  <AiFillYoutube className="footer-icon" />
                </div>
              </div>
            </div>
            <div
              className="map-div"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/WN8AMJ2euCY2b4yK9",
                  "_blank"
                )
              }
            >
              <div className="map-img-div"></div>
              <div className="map-circle">
                <FaArrowRightLong className="arrow-icon" />
              </div>
              <div className="map-set">
                <p>Map</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Aaryaa Fiber Internet Service</p>
        <div
          className="ambitgrow"
          onClick={() => window.open("https://wa.me/917598238098", "_blank")}
        >
          <p>
            Made by <span>@AmbitGrow</span>
          </p>
          <p>
            (<IoLogoWhatsapp className="call-icon" />)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
