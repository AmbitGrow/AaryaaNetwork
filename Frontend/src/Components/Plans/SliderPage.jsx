import React, { useState, useEffect } from "react";

import Decration from "../../assets/Slides/Decration.webp";
import AaryaaBoxLogo from "../../assets/Slides/AaryaaBoxLogo.webp";
import "./SliderPage.css";

import logo from "../../assets/AaryaaLogo.png";
import powerott from "../../assets/PowerOTT.png";
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
                  <div className="ott-logos-all ott-logos-power"></div>
                  {/* <div className="ott-logos">
                    <div className="ott-icon ott-icon-hotstar"></div>
                    <div className="ott-icon ott-icon-zee5"></div>
                    <div className="ott-icon ott-icon-sunnxt"></div>
                    <div className="ott-icon ott-icon-sonyliv"></div>
                    <div className="ott-icon ott-icon-aha"></div>
                    <div className="ott-etc-logo">
                      <div className="ott-icon-etc ott-icon-etc-hotstar"></div>
                      <div className="ott-icon-etc ott-icon-etc-zee5"></div>
                      <div className="ott-icon-etcs">
                        <p>etc</p>
                      </div>
                    </div>
                  </div> */}
                  <div className="tv-ott-channel">
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
                  <div className="ott-logos-all ott-logos-power-max"></div>
                  {/* <div className="ott-logos">
                    <div className="ott-icon ott-icon-netflix"></div>
                    <div className="ott-icon ott-icon-amazonprime"></div>
                    <div className="ott-icon ott-icon-hotstar"></div>
                    <div className="ott-icon ott-icon-zee5"></div>
                    <div className="ott-icon ott-icon-aha"></div>
                    <div className="ott-etc-logo">
                      <div className="ott-icon-etc ott-icon-netflix"></div>
                      <div className="ott-icon-etc ott-icon-amazonprime"></div>
                      <div className="ott-icon-etcs">
                        <p>etc</p>
                      </div>
                    </div>
                  </div> */}
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
