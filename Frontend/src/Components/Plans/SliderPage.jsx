import React, { useState, useEffect } from "react";
import Decration from "../../assets/Slides/Decration.webp";
import AaryaaBoxLogo from "../../assets/Slides/AaryaaBoxLogo.webp";
import "./SliderPage.css";
import netflix from '../../assets/OttListLogo/Netflix.webp';
import SunNxt from '../../assets/OttListLogo/SunNxt.webp'
import Hotstar from '../../assets/OttListLogo/JioHotstar.webp'
import amazonprime from '../../assets/OttListLogo/PrimeVideo.webp'
import Zee5 from '../../assets/OttListLogo/Zee5.webp'
import sonyliv from '../../assets/OttListLogo/sony.webp'
import aha from '../../assets/OttListLogo/Aha.webp'




import logo from "../../assets/AaryaaLogo.png";

import { useNavigate } from "react-router-dom";

export default function SliderPage() {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const getCardName = () => {
    return activeCard ? activeCard.split("-")[0] : null;
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setActiveCard(null);
        setSelectedPlan(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleCardClick = (cardName) => {
    const current = getCardName();
    if (current === cardName) {
      setActiveCard(null);
      setSelectedPlan(null);
    } else {
      const uniqueKey = `${cardName}-${Date.now()}`;
      setActiveCard(uniqueKey);
      setSelectedPlan(cardName);
    }
  };

  return (
    <div className="page-container">
      <div className="split-container">
        {/* LEFT SLIDER */}
        <div className="slider-box">
          <div className="slider-box-banner slider-box-banner1">
            <div className="linear-black">
              <p className="s-txt-heading">
                Unlimited Internet. Unmatched Savings.
              </p>
              <h2 className="s-txt-subheading">
                Stay connected with unlimited 40 Mbps speed at the best price.
              </h2>
              <p className="s-txt-dec">
                Aaryaa Network<span> - Simple. Fast. Reliable</span>
              </p>
            </div>
          </div>

          <div className="slider-box-banner slider-box-banner2">
            <div className="linear-black">
              <p className="s-txt-heading">
                Unlimited Internet. 450+ TV Channels
              </p>
              <h2 className="s-txt-subheading">
                Watch your favorite TV channels and enjoy seamless internet
                together.
              </h2>
              <p className="s-txt-dec">
                Aaryaa Network<span> - One Connection. Endless TV</span>
              </p>
            </div>
          </div>

          <div className="slider-box-banner slider-box-banner3">
            <div className="linear-black">
              <p className="s-txt-heading">
                450+ TV Channels. 23+ OTT Apps. One Powerful Plan.
              </p>
              <h2 className="s-txt-subheading">
                Entertainment without limits with blazing-fast internet.
              </h2>
              <p className="s-txt-dec">
                Aaryaa Network<span> - Your Home, Your Theatre</span>
              </p>
            </div>
          </div>

          <div className="slider-box-banner slider-box-banner4">
            <div className="linear-black">
              <p className="s-txt-heading">
                Netflix. Prime. JioCinema. Unlimited Internet.
              </p>
              <h2 className="s-txt-subheading">
                Stay connected with unlimited 40 Mbps speed at the best price.
              </h2>
              <p className="s-txt-dec">
                Aaryaa Network<span> - Simple. Fast. Reliable</span>
              </p>
            </div>
          </div>

          <div className="slider-buttons">
            <button
              className={`slider-btn ${selectedPlan === "basic" ? "dark" : ""}`}
              onClick={() => handleCardClick("basic")}
              aria-label="Open Basic Surf Plan"
            >
              <p>Basic Surf</p>
            </button>
            <button
              className={`slider-btn ${
                selectedPlan === "stream" ? "dark" : ""
              }`}
              onClick={() => handleCardClick("stream")}
              aria-label="Open Stream Plus Plan"
            >
              <p>Stream Plus</p>
            </button>
            <button
              className={`slider-btn ${selectedPlan === "power" ? "dark" : ""}`}
              onClick={() => handleCardClick("power")}
              aria-label="Open Power Plan"
            >
              <p>Power</p>
            </button>
            <button
              className={`slider-btn ${selectedPlan === "max" ? "dark" : ""}`}
              onClick={() => handleCardClick("max")}
              aria-label="Open Power Max Plan"
            >
              <p>Power Max</p>
            </button>
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="right-box">
          <div className="right-box-first">
            <img
              src={AaryaaBoxLogo}
              alt="arayaa logo"
              className="arayaa-logo"
            />
            <h2>
              Internet. IPTV. OTT.<span> All in One.</span>
            </h2>
            <p className="sub-heading">
              Choose the perfect plan with Aaryaa Network internet, TV, and OTT
              bundles. Stream, surf, and enjoy seamlessly, all in one place.
            </p>
            <div
              className="plans-btn"
              onClick={() => navigate("/customizedplan")}
            >
              <div className="plans-btn-inside">
                <p>Get Our Plans</p>
              </div>
            </div>
            <p className="bottom-txt">
              Unlimited Internet. Endless Entertainment.
            </p>
            <img src={Decration} className="box-decration"></img>
          </div>

          {activeCard && (
            <div key={activeCard} className="overlay-card slide-up">
              {getCardName() === "basic" && (
                <div className="card-content plan-card">
                  <div className="card-title">
                    <h2 className="card-heading">Basic Surf</h2>
                    <p className="card-subheading">
                      ( <span>Internet Only </span>)
                    </p>
                  </div>
                  <p className="card-desc">Recommended for best value money</p>
                  <div className="card-mbs">
                    <h2 className="mbs-text">40 Mbs</h2>
                    <div className="card-mbs-info">
                      <p>Unlimited</p>
                      <p>Valid 30 days</p>
                    </div>
                  </div>
                  <button
                    className="main-btn"
                    onClick={() => navigate("/contact")}
                  >
                    Get @ ₹399
                  </button>

                  <div className="card-divider-div">
                    <hr className="card-divider" />
                  </div>
                  <p className="card-includes no-inclu">No Includes</p>
                  <div className="aaryaa-logo-bottom">
                    <div className="logo-bottom">
                      <img src={logo} alt="Logo" />
                      <p>Network</p>
                    </div>
                  </div>
                </div>
              )}

              {getCardName() === "stream" && (
                <div className="card-content plan-card">
                  <div className="card-title">
                    <h2 className="card-heading">Stream Plus</h2>
                    <p className="card-subheading">
                      ( <span>Internet + IPTV </span>)
                    </p>
                  </div>
                  <p className="card-desc">Reccommended for streaming</p>
                  <div className="card-mbs">
                    <h2 className="mbs-text">25 Mbs</h2>
                    <div className="card-mbs-info">
                      <p>Unlimited</p>
                      <p>Valid 30 days</p>
                    </div>
                  </div>
                  <button
                    className="main-btn"
                    onClick={() => navigate("/contact")}
                  >
                    Get @ ₹499
                  </button>

                  <div className="card-divider-div">
                    <hr className="card-divider" />
                  </div>
                  <p className="card-includes">Also Includes</p>
                  <button className="tv-channel-btn">450+ Tv Channels</button>

                  <div className="aaryaa-logo-bottom">
                    <div className="logo-bottom">
                      <img src={logo} alt="Logo" />
                      <p>Network</p>
                    </div>
                  </div>
                </div>
              )}

              {getCardName() === "power" && (
                <div className="card-content plan-card">
                  <div className="card-title">
                    <h2 className="card-heading">Power</h2>
                    <p className="card-subheading">
                      ( <span>Internet + IPTV + OTT</span>)
                    </p>
                  </div>
                  <p className="card-desc">Best for full Entertainment</p>
                  <div className="card-mbs">
                    <h2 className="mbs-text">75 Mbs</h2>
                    <div className="card-mbs-info">
                      <p>Unlimited</p>
                      <p>Valid 30 days</p>
                    </div>
                  </div>
                  <button
                    className="main-btn"
                    onClick={() => navigate("/contact")}
                  >
                    Get @ ₹599
                  </button>

                  <div className="card-divider-div">
                    <hr className="card-divider" />
                  </div>
                  <p className="card-includes">Also Includes</p>
                  <div className="ott-logos">
                    <div className="ott-icon">
                            <img src={Hotstar} alt="Hotstar" />
                          </div>
                          <div className="ott-icon">
                            <img src={Zee5} alt="Zee5" />
                          </div>
                          <div className="ott-icon">
                            <img src={SunNxt} alt="SunNxt" />
                          </div>
                          <div className="ott-icon">
                            <img src={sonyliv} alt="sonyliv" />
                          </div>
                          <div className="ott-icon">
                            <img src={aha} alt="aha" />
                          </div>
                          <div className="ott-etc-logo">
                            <div className="ott-icon-etc">
                              <img src={Hotstar} />
                            </div>
                            <div className="ott-icon-etc">
                              <img src={Zee5} />
                            </div>
                            <div className="ott-icon-etcs">
                            <p>etc</p>
                      </div>
                    </div>
                  </div>
                  <div className="tv-ott-channel">
                    {/* <button className="tv-channel-btn">450+ Tv Channels</button> */}
                    <button className="ott-channel-btn power-ott">
                      23+ OTT Apps
                    </button>
                  </div>
                  <div className="aaryaa-logo-bottom">
                    <div className="logo-bottom">
                      <img src={logo} alt="Logo" />
                      <p>Network</p>
                    </div>
                  </div>
                </div>
              )}

              {getCardName() === "max" && (
                <div className="card-content plan-card">
                  <div className="card-title">
                    <h2 className="card-heading">Power Max</h2>
                    <p className="card-subheading">
                      ( <span>Internet + Premium OTT</span>)
                    </p>
                  </div>
                  <p className="card-desc">Best for full Entertainment</p>
                  <div className="card-mbs">
                    <h2 className="mbs-text">100 Mbs</h2>
                    <div className="card-mbs-info">
                      <p>Unlimited</p>
                      <p>Valid 30 days</p>
                    </div>
                  </div>
                  <button
                    className="main-btn"
                    onClick={() => navigate("/contact")}
                  >
                    Get @ ₹999
                  </button>

                  <div className="card-divider-div">
                    <hr className="card-divider" />
                  </div>
                  <p className="card-includes">Also Includes</p>
                  <div className="ott-logos">
                    <div className="ott-icon">
                      <img src={netflix} alt="AmazonPrime" />
                    </div>
                    <div className="ott-icon">
                      <img src={amazonprime} alt="Hotstar" />
                    </div>
                    <div className="ott-icon">
                      <img src={Hotstar} alt="Aha" />
                    </div>
                    <div className="ott-icon">
                      <img src={Zee5} alt="JioCinema" />
                    </div>
                    <div className="ott-icon">
                      <img src={aha} alt="SunNxt" />
                    </div>
                    <div className="ott-etc-logo">
                      <div className="ott-icon-etc">
                        <img src={netflix} />
                      </div>
                      <div className="ott-icon-etc">
                        <img src={amazonprime} />
                      </div>
                      <div className="ott-icon-etcs">
                        <p>etc</p>
                      </div>
                    </div>
                  </div>
                  <button className="ott-channel-btn ">28+ OTT Apps</button>

                  <div className="aaryaa-logo-bottom">
                    <div className="logo-bottom">
                      <img src={logo} alt="Logo" />
                      <p>Network</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
