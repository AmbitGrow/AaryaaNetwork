import React, { useEffect, useState } from "react";
import "./AaryaaTvPage.css";
import Footer from "../../Components/Footer/Footer";
import img1 from "../../assets/TvpageImg/img1.jpg";
import img2 from "../../assets/TvpageImg/img2.jpg";
import img3 from "../../assets/TvpageImg/img3.jpg";
import img4 from "../../assets/TvpageImg/img4.jpg";
import img5 from "../../assets/TvpageImg/img5.jpg";
import img6 from "../../assets/TvpageImg/img6.jpg";
import img7 from "../../assets/TvpageImg/img7.jpg";
import img8 from "../../assets/TvpageImg/img8.jpg";
import img9 from "../../assets/TvpageImg/img9.jpg";
import img10 from "../../assets/TvpageImg/img10.jpg";
import img11 from "../../assets/TvpageImg/img11.jpg";
import img12 from "../../assets/TvpageImg/img12.jpg";
import img13 from "../../assets/TvpageImg/img13.jpg";
import img14 from "../../assets/TvpageImg/img14.jpg";
import img15 from "../../assets/TvpageImg/img15.jpg";
import img16 from "../../assets/TvpageImg/img16.jpg";
import logo from "../../assets/AaryaaLogo.png";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { RiYoutubeFill } from "react-icons/ri";
import { BiLogoInstagramAlt } from "react-icons/bi";

const Tvimages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
];

function AaryaaTvPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Tvimages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="aaryaatv-page-all">
        <div className="tv-first-section">
          <div className="img-section">
            {Tvimages.map((img, index) => (
              <div
                className={`img-div fade-img ${
                  index === current ? "active" : ""
                }`}
                key={index}
              >
                <img src={img} alt={`entertainment ${index + 1}`} />
              </div>
            ))}
            <div className="linear-black"></div>
          </div>
          <div className="img-text">
            <h1>AaryaaTv - No.1 HD Channel, Entertainment,Anytime</h1>
            <p>Movies, Shows, Music & More - All in One Channel</p>
          </div>
        </div>
        <div className="second-sec-logo">
          <div className="logo-bottom">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="tv-second-section">
          <div className="tv-left">
            <h2>
              Aaryaa TV is the No.1 regional HD entertainment channel proudly
              based in Sankarankovil.
            </h2>
            <p>
              Broadcasting in crystal-clear high definition, we offer 24×7
              programming that includes popular Tamil movies, serials, music
              shows, and more — designed to captivate and connect.
            </p>
          </div>

          <div className="tv-right">
            <p>
              We are also recognized as live streaming experts, providing
              real-time coverage of major city festivals, temple events, and
              cultural celebrations. Our production team ensures a high-quality
              viewing experience across both television and digital platforms,
              including Instagram, Facebook, and YouTube.
            </p>
            <h4>C. Anandharaj</h4>
            <p className="p-title">Managing Director , Aaryaa TV</p>
            <div className="tv-sign-img">
              {/* <img src="/path-to-signature-img.png" alt="Signature" /> */}
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="tv-social-media">
            <div
              className="social-card"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/aaryaatv/profilecard/?igsh=MXdodjZra3o2MmI2Ng==",
                  "_blank"
                )
              }
            >

              <div className="dot"><BiLogoInstagramAlt /></div>
              <h2>30K +</h2>
              <span>Followers</span>
              <p>Follow us on Instagram</p>
            </div>
            <div
              className="social-card"
              onClick={() =>
                window.open(
                  "https://youtube.com/@aaryaatv?si=N2Ofgg3v6nkQSy5g",
                  "_blank"
                )
              }
            >
              <div className="dot"><RiYoutubeFill /></div>
              <h2>44.5K +</h2>
              <span>Subscribers</span>

              <p>Follow us on Youtube</p>
            </div>
            <div
              className="social-card"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/share/1AZnobBpY6/?mibextid=wwXIfr",
                  "_blank"
                )
              }
            >
              <div className="dot"><FaFacebookF /></div>
              <h2>30K +</h2>
              <span>Followers</span>

              <p>Follow us on Facebook</p>
            </div>
          </div>
        </div>

        <div
          className="nineth-section let-connect-section"
          data-scroll
          data-scroll-speed="1"
        >
          <div className="connect-section">
            <h2>Are You Curious?</h2>
            <p className="sub-title">
              We’re always ready to connect and help you to choose the best
              internet experience.{" "}
            </p>
            <div className="connect-btn" onClick={() => navigate("/contact")}>
              <p className="text">Let`s Connect</p>
              <p className="icon">
                <FaArrowRightLong className="arrow-icon" />
              </p>
            </div>
          </div>
        </div>

        <div className="last-section footer-section">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default AaryaaTvPage;
