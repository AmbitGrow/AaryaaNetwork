import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import API from "../../Admin/Api/Api";
import { useNavigate } from "react-router-dom";
import "./CustomizedPage.css";
import akka from "../../assets/Contact/akka.png";
import { FaArrowRightLong } from "react-icons/fa6";
import Footer from "../../Components/Footer/Footer";
import Netflix from "../../assets/OttListLogo/Netflix.jpg";
import Sunnxt from "../../assets/OttListLogo/SunNxt.jpg";
import Hotstar from "../../assets/OttListLogo/JioHotstar.jpg";
import PrimeVideo from "../../assets/OttListLogo/PrimeVideo.jpg";
import Zee5 from "../../assets/OttListLogo/Zee5.jpg";
import SonyLIv from "../../assets/OttListLogo/sony.jpg";
import Aha from "../../assets/OttListLogo/Aha.jpg";
import AppleTv from "../../assets/OttListLogo/AppleTv.jpg";
import XstreamPlay from "../../assets/OttListLogo/XstreamPlay.jpg";
import skyplay from "../../assets/skyplay.jpg";
import aaryaanetwork from "../../assets/AaryaaLogo.png";
import railwire from "../../assets/RailWire.jpg";
import bsnl from "../../assets/BSNLlogo.jpg";
import airtelxstream from "../../assets/AirtelLogo.jpg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const DURATION_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const PLAN_TYPES = [
  { label: "Internet Only", value: "internet" },
  { label: "Internet + OTT", value: "internet+ott" },
  { label: "Internet + TV", value: "internet+tv" },
  { label: "Internet + TV + OTT", value: "internet+tv+ott" },
];
const ottLogoMap = {
  Netflix: Netflix,
  Sunnxt: Sunnxt,
  JioHotstar: Hotstar,
  "Amazon Prime": PrimeVideo,
  Zee5: Zee5,
  SonyLiv: SonyLIv,
  Aha: Aha,
  "Apple Tv": AppleTv,
  "Xstream Play": XstreamPlay,
};

const providerLogoMap = {
  "Aaryaa Network": aaryaanetwork,
  SkyPlay: skyplay,
  Railwire: railwire,
  BSNL: bsnl,
  "Airtel-Xstream": airtelxstream,
};

const CustomizedPage = () => {
  const plansRef = useRef(null);
  const [plans, setPlans] = useState([]);
  const [speedOptions, setSpeedOptions] = useState([]);
  const [durationOptions] = useState(DURATION_OPTIONS);
  const [providerOptions, setProviderOptions] = useState([]);
  const [planType, setPlanType] = useState("internet");

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Selections
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [selectedProvider, setSelectedProvider] = useState("");

  // For OTT and TV options
  const [selectedOttTier, setSelectedOttTier] = useState("");
  const [selectedTvChannel, setSelectedTvChannel] = useState("");

  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();

  // Step 1: fetch all plans for the selected planType
  useEffect(() => {
    // Always clear OTT/TV sections on planType change
    setSelectedOttTier("");
    setSelectedTvChannel("");

    const fetchPlans = async () => {
      try {
        const res = await API.get("/plans/filter", {
          params: { planType },
        });
        const data = res.data;
        setPlans(data);

        // Get unique speed options
        const uniqueSpeeds = [...new Set(data.map((p) => p.speed))];
        setSpeedOptions(uniqueSpeeds);

        // Default selections
        const defaultSpeed = uniqueSpeeds[0] || "";
        setSelectedSpeed(defaultSpeed);

        // Providers for default speed
        const providersForSpeed = data.filter((p) => p.speed === defaultSpeed);
        const uniqueProviders = [
          ...new Set(providersForSpeed.map((p) => p.provider)),
        ];
        setProviderOptions(uniqueProviders);
        setSelectedProvider(uniqueProviders[0] || "");

        setSelectedDuration(DURATION_OPTIONS[0]);

        // OTT and TV options: get all available for this plan type, speed, provider
        // (initially undefined; will set below in useEffect as speed/provider changes)
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setPlans([]);
        setSpeedOptions([]);
        setProviderOptions([]);
        setSelectedSpeed("");
        setSelectedProvider("");
        setSelectedDuration(DURATION_OPTIONS[0]);
        setCurrentPlan(null);
        setSelectedOttTier("");
        setSelectedTvChannel("");
      }
    };
    fetchPlans();
  }, [planType]);

  // Step 2: update providers when speed changes
  useEffect(() => {
    if (!selectedSpeed) return;
    const providersForSpeed = plans.filter((p) => p.speed === selectedSpeed);
    const uniqueProviders = [
      ...new Set(providersForSpeed.map((p) => p.provider)),
    ];
    setProviderOptions(uniqueProviders);

    if (!uniqueProviders.includes(selectedProvider)) {
      setSelectedProvider(uniqueProviders[0] || "");
    }
  }, [selectedSpeed, plans, selectedProvider]);

  // Compute available OTT/TV options for current context
  const availablePlans = plans.filter(
    (p) =>
      p.speed === selectedSpeed &&
      p.provider === selectedProvider &&
      p.duration === selectedDuration
  );

  const ottTierOptions = useMemo(() => {
    return planType.includes("ott")
      ? [
          ...new Set(
            availablePlans
              .map((p) => p.ottTier)
              .filter((tier) => tier && tier !== "None")
          ),
        ]
      : [];
  }, [planType, availablePlans]);

  const tvChannelOptions = useMemo(() => {
    return planType.includes("tv")
      ? [
          ...new Set(
            availablePlans
              .map((p) => p.tvChannels)
              .filter((tv) => tv && tv !== "None")
          ),
        ]
      : [];
  }, [planType, availablePlans]);

  // Auto-select first available OTT/TV option if needed
  useEffect(() => {
    // Auto-select first available Speed if current is invalid or empty
    if (speedOptions.length > 0 && !speedOptions.includes(selectedSpeed)) {
      setSelectedSpeed(speedOptions[0]);
      return; // Exit early so dependent ops wait for new selection
    }

    // Auto-select first available Provider if current is invalid or empty
    if (
      providerOptions.length > 0 &&
      !providerOptions.includes(selectedProvider)
    ) {
      setSelectedProvider(providerOptions[0]);
      return;
    }

    // Only for plan types with OTT
    if (planType.includes("ott")) {
      if (
        ottTierOptions.length > 0 &&
        (!selectedOttTier || !ottTierOptions.includes(selectedOttTier))
      ) {
        setSelectedOttTier(ottTierOptions[0]);
        return;
      }
    } else if (selectedOttTier) {
      setSelectedOttTier("");
    }

    // Only for plan types with TV
    if (planType.includes("tv")) {
      if (
        tvChannelOptions.length > 0 &&
        (!selectedTvChannel || !tvChannelOptions.includes(selectedTvChannel))
      ) {
        setSelectedTvChannel(tvChannelOptions[0]);
        return;
      }
    } else if (selectedTvChannel) {
      setSelectedTvChannel("");
    }
  }, [
    speedOptions,
    providerOptions,
    ottTierOptions,
    tvChannelOptions,
    selectedSpeed,
    selectedProvider,
    selectedOttTier,
    selectedTvChannel,
    planType,
  ]);

  // Step 4: set current plan based on ALL selections including ottTier/tvChannels
  useEffect(() => {
    // Don't match if required selectors are empty (prevents desync)
    if (!selectedSpeed || !selectedProvider || !selectedDuration) {
      setCurrentPlan(null);
      return;
    }
    if (planType.includes("ott") && !selectedOttTier) {
      setCurrentPlan(null);
      return;
    }
    if (planType.includes("tv") && !selectedTvChannel) {
      setCurrentPlan(null);
      return;
    }

    // Find matching plan
    let matched = plans.find(
      (p) =>
        p.speed === selectedSpeed &&
        p.duration === selectedDuration &&
        p.provider === selectedProvider &&
        (planType === "internet"
          ? true
          : planType === "internet+ott"
          ? p.ottTier === selectedOttTier
          : planType === "internet+tv"
          ? p.tvChannels === selectedTvChannel
          : planType === "internet+tv+ott"
          ? p.ottTier === selectedOttTier && p.tvChannels === selectedTvChannel
          : true)
    );
    setCurrentPlan(matched || null);
  }, [
    selectedSpeed,
    selectedDuration,
    selectedProvider,
    selectedOttTier,
    selectedTvChannel,
    plans,
    planType,
  ]);

  const handleDownloadPDF = () => {
    if (!currentPlan) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Aaryaa Network Plan Detail", 14, 10);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Speed", currentPlan.speed],
        ["Duration", currentPlan.duration],
        ["Provider", currentPlan.provider],
        ["OTT Tier", currentPlan.ottTier],
        ["OTT List", currentPlan.ottList.join(", ")],
        ["TV Channels", currentPlan.tvChannels],
        ["Router", currentPlan.router],
        ["Android Box", currentPlan.androidBox],
        ["Base Price", currentPlan.basePrice],
        ["OTT Charge", currentPlan.ottCharge],
        ["TV Charge", currentPlan.tvCharge],
        ["Renewal Total", currentPlan.renewalTotal],
        ["GST", currentPlan.gst],
        ["Advance Payment", currentPlan.advancePayment],
        ["Discount", currentPlan.discountAmount],
        ["First Time Total", currentPlan.firstTimeTotal],
        ["Installation Fee", currentPlan.installationFee],
        [
          "Total ",
          (
            currentPlan.renewalTotal +
            currentPlan.installationFee +
            currentPlan.advancePayment +
            currentPlan.gst +
            currentPlan.firstTimeTotal -
            currentPlan.discountAmount
          ).toFixed(2),
        ],
      ],
    });

    doc.save(`${currentPlan.speed.replace(/\s+/g, "_")}_Plan.pdf`);
  };

  function getMonthlyBasePrice(plans, currentPlan) {
    if (!currentPlan) return 0;
    // Find the matching monthly plan price for this provider/speed
    const monthlyPlan = plans.find(
      (p) =>
        p.duration === "Monthly" &&
        p.provider === currentPlan.provider &&
        p.speed === currentPlan.speed &&
        p.planType === currentPlan.planType &&
        (currentPlan.ottTier && currentPlan.ottTier !== "None"
          ? p.ottTier === currentPlan.ottTier
          : true) &&
        (currentPlan.tvChannels && currentPlan.tvChannels !== "None"
          ? p.tvChannels === currentPlan.tvChannels
          : true)
    );
    return monthlyPlan ? monthlyPlan.basePrice : currentPlan.basePrice;
  }

  function renderBasePriceRow(basePrice, duration) {
    const months =
      duration === "Monthly"
        ? 1
        : duration === "Quarterly"
        ? 3
        : duration === "Half-Yearly"
        ? 6
        : duration === "Yearly"
        ? 12
        : 1;

    const monthlyBasePrice = getMonthlyBasePrice(plans, currentPlan);

    return (
      <span>
        ₹{monthlyBasePrice} × {months}
        {months > 1 && (
          <span style={{ marginLeft: 10, color: "#aaa", fontSize: "0.95em" }}>
            (₹{monthlyBasePrice * months})
          </span>
        )}
      </span>
    );
  }

  return (
    <>
      <div className="customized-page-overall">
        <div className="cus-p-first-section">
          <div className="description-left">
            <h3>Make your perfect broadband plan in seconds</h3>
            <p className="sub-heading">
              Why settled for fixed plans when you can build your own? Whether
              you are streaming, gaming, working from home or doing it all,
              create a plan that fits you perfectly.
            </p>
            <div className="plan-button" onClick={scrollToPlans}>
              <button className="plan-buttonin">Check Our Plans</button>
            </div>
          </div>
          <div className="right-img">
            <img src={akka}></img>
          </div>
        </div>
        <div className="customized-page" ref={plansRef}>
          <div className="customized-heading">
            <h2 className="heading-h2">
              Our Budget<span> Friendly Packages</span>
            </h2>
            <p className="heading-para">
              Connect every smile at home with our joyful fibre experience —
              bringing internet, TV, and OTT together to keep your family
              entertained, united, and closer than ever
            </p>
          </div>
          <div className="total-container">
            <div className="left-part">
              <div className="left-header">
                <div className="title-tag get-plan-tag">
                  <div className="circle-dot"></div>
                  <p>Get Customized Plans</p>
                </div>
                <div className="plan-type-selection">
                  {PLAN_TYPES.map((pt) => (
                    <label key={pt.value}>
                      <input
                        type="radio"
                        className="rbutton"
                        name="planType"
                        value={pt.value}
                        checked={planType === pt.value}
                        onChange={(e) => setPlanType(e.target.value)}
                      />
                      {pt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="plan-filters-1">
                {/* Speed */}
                <div className="filter-group">
                  <label>Speed:</label>
                  <div className="option-row-group-1">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        className={`option-button ${
                          selectedSpeed === speed ? "active" : ""
                        }`}
                        onClick={() => setSelectedSpeed(speed)}
                        type="button"
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Provider */}
                <div className="filter-group">
                  <label>Provider:</label>
                  <div className="option-row-group-2">
                    {providerOptions.slice(0, 5).map((provider) => (
                      <button
                        key={provider}
                        className={`option-button ${
                          selectedProvider === provider ? "active" : ""
                        }`}
                        onClick={() => setSelectedProvider(provider)}
                        type="button"
                      >
                        <div className="circle">
                          {providerLogoMap[provider] && (
                            <img
                              src={providerLogoMap[provider]}
                              alt={provider}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </div>
                        {provider}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="plan-filters-2">
                {/* Duration */}
                <div className="filter-group">
                  <label>Duration:</label>
                  <div className="option-row-group-3">
                    {durationOptions.map((duration) => {
                      const isAvailable = plans.some(
                        (p) =>
                          p.speed === selectedSpeed &&
                          p.provider === selectedProvider &&
                          p.duration === duration
                      );
                      return (
                        <button
                          key={duration}
                          className={`option-button ${
                            selectedDuration === duration ? "active" : ""
                          }`}
                          onClick={() =>
                            isAvailable && setSelectedDuration(duration)
                          }
                          type="button"
                          disabled={!isAvailable}
                        >
                          {duration}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {planType.includes("tv") && tvChannelOptions.length > 0 && (
                <div className="plan-filters-3">
                  {/* TV Section: Only show if planType includes "tv" */}
                  <div className="filter-group">
                    <label>TV Channel:</label>
                    <div className="option-row-group-4">
                      {tvChannelOptions.map((tv) => (
                        <button
                          key={tv}
                          className={`option-button ${
                            selectedTvChannel === tv ? "active" : ""
                          }`}
                          onClick={() => setSelectedTvChannel(tv)}
                          type="button"
                        >
                          {tv}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {planType.includes("ott") && ottTierOptions.length > 0 && (
                <div className="plan-filters-4">
                  {/* OTT Section: Only show if planType includes "ott" */}
                  <div className="filter-group">
                    <label>OTT Tier:</label>
                    <div className="option-row-group-5">
                      {ottTierOptions.map((tier) => (
                        <button
                          key={tier}
                          className={`option-button ${
                            selectedOttTier === tier ? "active" : ""
                          }`}
                          onClick={() => setSelectedOttTier(tier)}
                          type="button"
                        >
                          {tier}
                        </button>
                      ))}
                    </div>

                    {currentPlan ? (
                      <div className="ott-logo-container">
                        {Array.isArray(currentPlan.ottList) &&
                        currentPlan.ottList.length > 0 ? (
                          currentPlan.ottList.map((ott, index) => (
                            <img
                              key={index}
                              src={ottLogoMap[ott]}
                              alt={ott}
                              title={ott}
                              className="ott-logo"
                            />
                          ))
                        ) : (
                          <span
                            className="badge badge-none"
                            style={{ fontWeight: 500 }}
                          >
                            —
                          </span>
                        )}
                      </div>
                    ) : null}

                    {/* ott list */}
                    {/* {currentPlan ? (
                      <>
                        {" "}
                        <div className="span">
                          <span
                            title={
                              Array.isArray(currentPlan.ottList)
                                ? currentPlan.ottList.join(", ")
                                : ""
                            }
                            style={{ fontWeight: 500 }}
                          >
                            {currentPlan.ottList &&
                            currentPlan.ottList.length > 0 ? (
                              <>{currentPlan.ottList.slice(0).join(", ")}</>
                            ) : (
                              <span
                                className="badge badge-none"
                                style={{ fontWeight: 500 }}
                              >
                                —
                              </span>
                            )}
                          </span>
                        </div>
                      </>
                    ) : (
                      <></>
                    )} */}
                  </div>
                </div>
              )}
            </div>

            {/* Plan Details */}
            <div className="right-part">
              {currentPlan ? (
                <>
                  <div className="plan-price-box">
                    <div className="plan-price-label">
                      <p>PRICE</p>
                      <span>
                        {currentPlan.firstTimeTotal
                          ? `₹${currentPlan.firstTimeTotal}`
                          : `₹${currentPlan.renewalTotal}`}
                      </span>
                    </div>
                    <button
                      className="get-plan-btn"
                      onClick={() =>
                        navigate("/contact", {
                          state: {
                            selectedPlan: currentPlan,
                            scrollTo: "contact-form-section",
                          },
                        })
                      }
                    >
                      Get Plan
                    </button>
                    <a
                      onClick={handleDownloadPDF}
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      Click to Download your plan
                    </a>
                  </div>
                  <div className="plan-details-card">
                    {/* Card Header */}
                    <div className="plan-details-header">
                      <span style={{ fontWeight: 500 }}>Plan Details</span>
                      <span className="plan-details-icon">
                        <FaArrowRightLong className="arrow-icon" />
                      </span>
                    </div>

                    <div className="plan-details-list">
                      {/* Section: Summary */}
                      {/* <div className="plan-section">Summary</div> */}
                      <div className="plan-details-row">
                        <span>Speed</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.speed}
                        </span>
                      </div>
                      <div className="plan-details-row">
                        <span>Duration</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.duration}
                        </span>
                      </div>
                      <div className="plan-details-row">
                        <span>Provider</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.provider}
                        </span>
                      </div>

                      {/* Section: Inclusions/Add-ons */}
                      {/* <div className="plan-section" style={{ marginTop: 14 }}>Add-ons</div> */}
                      <div className="plan-details-row">
                        <span>OTT Tier</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.ottTier &&
                          currentPlan.ottTier !== "None" ? (
                            <>
                              {currentPlan.ottTier}
                              {/* {currentPlan.ottCharge === 0
                                        ? <span ></span>
                                        : <span className="badge badge-paid">+₹{currentPlan.ottCharge}</span>
                                      } */}
                            </>
                          ) : (
                            <span
                              className="badge badge-none"
                              style={{ fontWeight: 500 }}
                            >
                              None
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="plan-details-row">
                        <span>OTT List</span>
                        <span
                          title={
                            Array.isArray(currentPlan.ottList)
                              ? currentPlan.ottList.join(", ")
                              : ""
                          }
                          style={{ fontWeight: 500 }}
                        >
                          {currentPlan.ottList &&
                          currentPlan.ottList.length > 0 ? (
                            <>
                              {currentPlan.ottList.slice(0, 2).join(", ")}
                              {currentPlan.ottList.length > 2 ? ", ..." : ""}
                            </>
                          ) : (
                            <span
                              className="badge badge-none"
                              style={{ fontWeight: 500 }}
                            >
                              —
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="plan-details-row">
                        <span>TV Channels</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.tvChannels &&
                          currentPlan.tvChannels !== "None" ? (
                            <>
                              {currentPlan.tvChannels}
                              {/* {currentPlan.tvCharge === 0
                                        ? <span></span>
                                        : <span className="badge badge-paid">+₹{currentPlan.tvCharge}</span>
                                      } */}
                            </>
                          ) : (
                            <span
                              className="badge badge-none"
                              style={{ fontWeight: 500 }}
                            >
                              None
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="plan-details-row">
                        <span>Router</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.router &&
                          currentPlan.router !== "None" ? (
                            <span className="badge badge-included">
                              {currentPlan.router}
                            </span>
                          ) : (
                            <span
                              className="badge badge-none"
                              style={{ fontWeight: 500 }}
                            >
                              None
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="plan-details-row">
                        <span>Android Box</span>
                        <span style={{ fontWeight: 500 }}>
                          {currentPlan.androidBox ? (
                            <span className="badge badge-included">
                              Included
                            </span>
                          ) : (
                            <span
                              className="badge badge-none"
                              style={{ fontWeight: 500 }}
                            >
                              No
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Section: Price Breakdown */}
                      {/* <div className="plan-section" style={{ marginTop: 14 }}>Price Breakdown</div> */}
                      <div className="plan-details-row">
                        <span>Base Price</span>
                        {renderBasePriceRow(
                          currentPlan.basePrice,
                          currentPlan.duration
                        )}
                      </div>
                      {currentPlan.discountAmount > 0 && (
                        <div className="plan-details-row">
                          <span>Discount</span>
                          <span
                            className="discount-value"
                            style={{ fontWeight: 500 }}
                          >
                            -₹{currentPlan.discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {currentPlan.ottCharge >= 0 &&
                        currentPlan.ottTier !== "None" && (
                          <div className="plan-details-row">
                            <span>OTT Addon</span>
                            <span style={{ fontWeight: 500 }}>
                              {currentPlan.ottCharge === 0 &&
                              currentPlan.ottTier !== "None" ? (
                                <span className="badge badge-included">
                                  Free
                                </span>
                              ) : (
                                <span
                                  className="badge badge-paid"
                                  style={{ fontWeight: 500 }}
                                >
                                  +₹{currentPlan.ottCharge}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      {currentPlan.tvCharge >= 0 &&
                        currentPlan.tvChannels !== "None" && (
                          <div className="plan-details-row">
                            <span>TV Addon</span>
                            <span style={{ fontWeight: 500 }}>
                              {currentPlan.tvCharge === 0 &&
                              currentPlan.tvChannels !== "None" ? (
                                <span className="badge badge-included">
                                  Free
                                </span>
                              ) : (
                                <span
                                  className="badge badge-paid"
                                  style={{ fontWeight: 500 }}
                                >
                                  +₹{currentPlan.tvCharge}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      {currentPlan.installationFee > 0 && (
                        <div className="plan-details-row">
                          <span>Installation Fee</span>
                          <span style={{ fontWeight: 500 }}>
                            +₹{currentPlan.installationFee}
                          </span>
                        </div>
                      )}
                      {currentPlan.advancePayment > 0 && (
                        <div className="plan-details-row">
                          <span>Advance Payment</span>
                          <span style={{ fontWeight: 500 }}>
                            +₹{currentPlan.advancePayment}
                          </span>
                        </div>
                      )}
                      <div className="plan-details-row">
                        <span>GST</span>
                        <span style={{ fontWeight: 500 }}>
                          +₹{currentPlan.gst}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-plan-message">Loading...</div>
              )}
              {/* <div className="right-part-photo">
                    
                </div> */}
            </div>
          </div>
        </div>

        <div className="cus-footer-section">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CustomizedPage;
