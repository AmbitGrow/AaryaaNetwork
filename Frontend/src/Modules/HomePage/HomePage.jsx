import React, { useEffect, useState } from "react";
import "../HomePage/HomePage.css";
import logo from "../../assets/AaryaaLogo.png";
import remote from "../../assets/remote.webp";
// import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import CustomizedStyleleft from "../../assets/CustomizedStyleLeft.webp";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import consultation from "../../assets/consultation.gif";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { MdCall } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { FaDotCircle } from "react-icons/fa";
import ClinetTestimonials from "../../Components/Client/ClientTestinomials";
import SliderPage from "../../Components/Plans/SliderPage";
import Footer from "../../Components/Footer/Footer";
import Pic1 from "../../assets/ClientImage/Picture1.webp";
import Pic2 from "../../assets/ClientImage/Picture2.webp";
import Pic3 from "../../assets/ClientImage/Picture3.webp";
import Pic4 from "../../assets/ClientImage/Picture4.webp";
import Pic5 from "../../assets/ClientImage/Picture5.webp";
import Pic6 from "../../assets/ClientImage/Picture6.webp";
import Pic7 from "../../assets/ClientImage/Picture7.webp";
import Pic8 from "../../assets/ClientImage/Picture8.webp";
import Pic9 from "../../assets/ClientImage/Picture9.webp";
import Pic10 from "../../assets/ClientImage/Picture10.webp";
import Pic11 from "../../assets/ClientImage/Picture11.webp";
import Pic12 from "../../assets/ClientImage/Picture12.webp";
import img1 from "../../assets/TVChannel/img1.webp";
import img2 from "../../assets/TVChannel/img2.webp";
import img3 from "../../assets/TVChannel/img3.webp";
import img4 from "../../assets/TVChannel/img4.webp";
import img5 from "../../assets/TVChannel/img5.webp";
import img6 from "../../assets/TVChannel/img6.webp";
import img7 from "../../assets/TVChannel/img7.webp";
import img8 from "../../assets/TVChannel/img8.webp";
import img9 from "../../assets/TVChannel/img9.webp";
import img10 from "../../assets/TVChannel/img10.webp";
import ottimg1 from "../../assets/OTT/ott1.webp";
import ottimg2 from "../../assets/OTT/ott2.webp";
import ottimg3 from "../../assets/OTT/ott3.webp";
import ottimg4 from "../../assets/OTT/ott4.webp";
import ottimg5 from "../../assets/OTT/ott5.webp";
import ottimg6 from "../../assets/OTT/ott6.webp";
import ottimg7 from "../../assets/OTT/ott7.webp";
import ottimg8 from "../../assets/OTT/ott8.webp";
import ottimg9 from "../../assets/OTT/ott9.webp";
import { MdCastConnected } from "react-icons/md";

import { MdInstallDesktop } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import BannerSection from "../../Components/BannerSection/BannerSection";
// import BannerSection from "./Bannersection";

const Tvimages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

const Ottimages = [
  ottimg1,
  ottimg2,
  ottimg3,
  ottimg4,
  ottimg5,
  ottimg6,
  ottimg7,
  ottimg8,
  ottimg9,
];

const ClientEsteemedlogo = [
  Pic1,
  Pic2,
  Pic3,
  Pic4,
  Pic5,
  Pic6,
  Pic7,
  Pic8,
  Pic9,
  Pic10,
  Pic11,
  Pic12,
];

const faqData = [
  {
    question:
      "Why  would you choose Aaryaa Network Fiber over Service Providers?",
    answer:
      "Aaryaa Network offers ultra-fast, 24/7 reliable internet with personalized plans and instant customer support trusted by corporates.",
  },
  {
    question: "What are the services provided by Aaryaa Network?",
    answer:
      "We provide high-speed Broadband, IPTV, WiFi 6, cloud solutions, and smart IoT connectivity with flexible plan options.",
  },
  {
    question: "What payment methods do you accept? ",
    answer:
      "We accept Cash, Net Banking, and UPI (Google Pay, PhonePe, Paytm, etc.) for quick and easy payments.",
  },
  {
    question: "Does aaryaa fibernet provide connections for corporates?",
    answer:
      "Yes, we offer dedicated, high-speed connections customized for corporate and business clients.",
  },
  {
    question: "What can you expect during the installation process?",
    answer:
      "Our expert team ensures a quick, smooth, and hassle-free installation with full setup and connection optimization.",
  },
];

function HomePage() {
  const loopTVImages = [...Tvimages, ...Tvimages];
  const loopOTT = [...Ottimages, ...Ottimages];
  const looplogo = [...ClientEsteemedlogo, ...ClientEsteemedlogo];
  const [expandedIndex, setExpandedIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/917708067932", "_blank");
  };
  const handleEmailClick = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=info@aaryaanetwork@gmail.com&su=Inquiry&body=Hello%20I%20want%20to%20know%20more%20about%20your%20services",
      "_blank"
    );
  };

  const handleCallClick = () => {
    window.location.href = "tel:+917708067932";
  };

  const toggleStep = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          // Clear the scrollTo state after scroll
          navigate(location.pathname, { replace: true, state: {} });
        }, 100); // wait for DOM to render
      }
    }
  }, [location, navigate]);
  return (
    <>
      <div className="homepage-container" data-scroll-container>
        {/* HeroSection baner start */}

        <div className="section-of-hero">
          <BannerSection />
        </div>
        {/* Entertainment banner start */}
        <div
          className="second-section entertainment"
          data-scroll
          data-scroll-speed="1"
        >
          <h2>Entertainment You Love, Included</h2>
          <p>
            Enjoy premium Access to Netflix, Hotstar, Prime and more. All
            Bundled in your Plan
          </p>

          <div className="tv-scroll scroll-animation">
            {loopTVImages.map((imgSrc, index) => (
              <div className="entertainment-tv-box" key={index}>
                <img src={imgSrc} alt={`entertainment ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="ott-scroll scroll-animation">
            {loopOTT.map((imgSrc, index) => (
              <div className="entertainment-tv-box" key={index}>
                <img src={imgSrc} alt={`entertainment ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <section id="price-section">
          <div className="third-section price-plans-section">
            <div className="third-s-heading">
              <h2>
                Our Best <span>Price Plans</span>
              </h2>
            </div>
            <div className="slider-component">
              <SliderPage />
            </div>

            <div className="customized-section">
              <h2>Not seeing what fits? Tailor your perfect plan!</h2>
              <p className="sub-c-title">
                Create your own internet plan based on your speed and usage.
              </p>
              <div
                className="customized-btn"
                onClick={() => navigate("/customizedplan")}
              >
                <p className="text">Let`s Customize Your Plans</p>
                <p className="icon">
                  <FaArrowRightLong className="arrow-icon" />
                </p>
              </div>
              <div className="c-style-img">
                <img src={CustomizedStyleleft} className="c-style-left-img" />
                <img src={CustomizedStyleleft} className="c-style-right-img" />
              </div>
            </div>
          </div>
        </section>

        {/*free consultation start */}
        <div
          className="fourth-section consultation-section"
          data-scroll
          data-scroll-speed="1"
        >
          <div className="consultation">
            <div className="con-left">
              <img src={consultation} />
            </div>
            <div className="con-line"></div>
            <div className="con-right">
              <h2>For a Free Consultation</h2>
              <div className="links-div">
                <div className="whatsapp-div" onClick={handleWhatsAppClick}>
                  <IoLogoWhatsapp className="con-icon" />
                  <p>Whatsapp</p>
                </div>
                <p>or</p>
                <div className="email-div" onClick={handleEmailClick}>
                  <MdEmail className="con-icon" />
                  <p>Email</p>
                </div>
                <p>or</p>

                <div className="call-div" onClick={handleCallClick}>
                  <MdCall className="con-icon" />
                  <p>Call</p>
                </div>
              </div>
            </div>

            <div className="remote">
              <img src={remote} />
            </div>
          </div>
        </div>

        {/* client testimonials */}

        <div className="fiveth-section client-testinomials-section">
          <div className="txt">
            <div className="title-tag about-tag">
              <div className="circle-dot"></div>
              <p>Client Testimonials</p>
            </div>
            <p className="client-desc">
              Explore the experience of our client with our work, showing our
              dedication to delivering exceptional results
            </p>
          </div>
          <div className="scroll-client-testinomials">
            <ClinetTestimonials />
          </div>
        </div>
        <div
          className="sixeth-section why-choose-us-section"
          data-scroll
          data-scroll-speed="1"
        >
          <div className="why-choose-us">
            <div className="choose-us-wrapper">
              <div className="choose-us-left-section">
                <div className="title-tag client-tag">
                  <div className="circle-dot"></div>
                  <p>Why Choose Us ?</p>
                </div>
                <div className="txt">
                  <h3>Because ordinary internet just isn’t enough anymore</h3>
                  <p className="description-why">
                    We bring you high-speed, no-hassle connectivity that fits
                    your life whether you stream, game, work, or chill. It’s
                    fast, flexible, and fully supported by people who care
                  </p>
                  <ul className="feature-list">
                    <li>
                      <FaDotCircle className="dot-icon" /> Speed That Never
                      Slows Down.
                    </li>
                    <li>
                      <FaDotCircle className="dot-icon" /> Plans That Respect
                      Your Wallet.
                    </li>
                    <li>
                      <FaDotCircle className="dot-icon" /> Support That Listens
                      , Not Waits.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="choose-us-right-section">
                <div className="img-box"></div>
                <div className="no-1-box">
                  <div className="info-box">
                    <div className="white-circle"></div>
                    <h4>SankaranKovil ’S</h4>
                    <div className="rank">No. 1</div>
                    <p>High Speed Fiber Network Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* about page section start */}
        <section id="about-section">
          <div
            className="about-page-section  seventh-section"
            data-scroll
            data-scroll-speed="1"
          >
            <div className="container">
              <div className="left-section">
                <div className="about-img"></div>
                <div className="card">
                  <h2 className="top">
                    <img src={logo} />
                    <p>Network</p>
                  </h2>
                  <p className="description">
                    Welcome to Aaryaa Network, guided by our visionary Managing
                    Director committed to seamless and smart connectivity.
                  </p>
                  <div className="contact-info">
                    <p className="c-p1">C. Anandharaj</p>
                    <p className="c-p2">Managing Director</p>
                    <p className="c-p3">+91 7708067932</p>
                  </div>
                </div>
              </div>

              <div className="right-section">
                <div className="title-tag about-tag">
                  <div className="circle-dot"></div>
                  <p> About us</p>
                </div>
                <div className="right-sec-text">
                  <h1>
                    Best Internet Provide Agency <br /> In Town.
                  </h1>
                  <p className="desc">
                    At Aaryaa Network, we transform how you experience the
                    internet. With over 10 years in the fiber broadband
                    industry, we proudly serve 2,000+ <br />
                    happy customers — from homes and businesses to hotels and
                    public <br />
                    venues.
                  </p>

                  <p className="desc">
                    We deliver ultra-fast fiber internet, top OTT entertainment,
                    and IPTV channels with plans tailored to your needs.
                  </p>
                  <p className="desc">
                    Our team ensures every connection is reliable, secure, and
                    future-ready backed by 24/7 support and seamless
                    installations.
                  </p>

                  <div className="features">
                    <div className="feature">
                      <div className="icon-box-outside">
                        <div className="icon-box-inside">
                          <MdCastConnected />
                        </div>
                      </div>
                      <div>
                        <h5>Fast Connected</h5>
                        <p>
                          Reliable high-speed fiber internet for all your <br />{" "}
                          streaming and work needs.
                        </p>
                      </div>
                    </div>
                    <div className="feature">
                      <div className="icon-box-outside">
                        <div className="icon-box-inside">
                          <MdInstallDesktop />
                        </div>
                      </div>
                      <div>
                        <h5>Free Installations</h5>
                        <p>
                          Quick setup with zero hassle — get connected with{" "}
                          <br />
                          ease.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="cta-row">
                    <button className="cta-btn">2000+ Happy Customers</button>
                  </div>
                </div>
                <div className="remote-wrapper">
                  <img src={remote} className="remote-img" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          className="eight-section client-esteemed-section"
          data-scroll
          data-scroll-speed="1"
        >
          <div className="our-esteemed-wrapper">
            <div className="text">
              <div className="title-tag out-esteemed-tag">
                <div className="circle-dot"></div>
                <p>Our Esteemed Clients</p>
              </div>
              <p className="client-subtitle">
                Aaryaa Network is honored to serve a growing list of esteemed
                clients who value our speed, reliability, and dedicated service.
              </p>
            </div>
            <div className="slider-scroll  scroll-animation">
              {looplogo.map((imgSrc, index) => (
                <div className="slides" key={index}>
                  <div className="slides-in">
                    <img src={imgSrc} alt={`entertainment ${index + 1}`} />
                  </div>
                </div>
              ))}
            </div>
           
          </div>
        </div>

        {/* lets-connect */}
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

        {/* faq section */}
        <section id="faq-section">
          <div
            className="tenth-section faq-section"
            data-scroll
            data-scroll-speed="1"
          >
            <div className="faq-left">
              <div className="title-tag out-esteemed-tag">
                <div className="circle-dot"></div>
                <p>FAQ</p>
              </div>
              <h1>
                Frequently
                <br />
                <span>Asked Questions.</span>
              </h1>
              <p className="sub-text">
                Have questions? Our FAQ section has you covered with quick
                answer to the most common inquiries.
              </p>
            </div>
            <div className="faq-right">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`faqs faq${index + 1} ${
                    expandedIndex === index ? "expanded" : ""
                  }`}
                  onClick={() => toggleStep(index)}
                >
                  <div className="faq-content">
                    <h3 className="f-heading">{item.question}</h3>
                    <p
                      className={`f-sub-heading ${
                        expandedIndex === index ? "visible" : "hidden"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>

                  <div className="down-arrow">
                    <GoPlus
                      className={`down-arrow-icon ${
                        expandedIndex === index ? "rotated" : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div
          className="last-section footer-section"
          data-scroll
          data-scroll-speed="2"
        >
          <Footer />
        </div>
      </div>
    </>
  );
}

export default HomePage;
