import { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
import API from "../../Admin/Api/Api";
import { useNavigate } from "react-router-dom";
import "./CustomizedPage.css";
import akka from "../../assets/Contact/akka.webp";
import { FaArrowRightLong } from "react-icons/fa6";
import Footer from "../../Components/Footer/Footer";
import Netflix from "../../assets/OttListLogo/Netflix.webp";
import Sunnxt from "../../assets/OttListLogo/SunNxt.webp";
import Hotstar from "../../assets/OttListLogo/JioHotstar.webp";
import PrimeVideo from "../../assets/OttListLogo/PrimeVideo.webp";
import Zee5 from "../../assets/OttListLogo/Zee5.webp";
import SonyLIv from "../../assets/OttListLogo/sony.webp";
import Aha from "../../assets/OttListLogo/Aha.webp";
import AppleTv from "../../assets/OttListLogo/AppleTv.webp";
import XstreamPlay from "../../assets/OttListLogo/XstreamPlay.webp";

import aaryaanetwork from "../../assets/AaryaaLogo.png";
import skyplay from "../../assets/skyplay.webp";
import railwire from "../../assets/RailWire.webp";
import bsnl from "../../assets/BSNLlogo.webp";
import airtelxstream from "../../assets/AirtelLogo.webp";
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

const isValidSpeedLabel = (speed) => {
  const normalized = String(speed || "").toLowerCase();
  return normalized.includes("mbps") || normalized.includes("gbps");
};

const getUniqueValues = (values) => [
  ...new Set(values.filter((value) => value !== undefined && value !== null && value !== "")),
];

const PLAN_INTERACTION_COOLDOWN_MS = 80;

const buildPlanKey = ({
  speed,
  duration,
  provider,
  ottTier,
  tvChannels,
  planType,
}) => [
  speed || "",
  duration || "",
  provider || "",
  planType || "",
  ottTier || "",
  tvChannels || "",
].join("||");

const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      {/* Left Part */}
      <div className="skeleton-left">
        <div className="skeleton skeleton-overallbox  s-first">
          <div className="skeleton-box">
            <div className=" skeleton-title"></div>
            <div className="all-btn">
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
            </div>
          </div>
          <div className="skeleton-box">
            <div className=" skeleton-title skeleton-btn"></div>
            <div className="all-btn">
              <button className="skeleton-btn"></button>
            </div>
          </div>
        </div>
        <div className="skeleton skeleton-overallbox  s-second">
          <div className="skeleton-box">
            <div className=" skeleton-title skeleton-btn"></div>
            <div className="all-btn">
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
              <button className="skeleton-btn"></button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Part */}
      <div className="skeleton-right">
        <div className="skeleton skeleton-price-box"></div>
        <div className="skeleton skeleton-plan-details"></div>
      </div>
    </div>
  );
};

const CustomizedPage = () => {
  const plansRef = useRef(null);
  const lastInteractionRef = useRef(0);
  const [plans, setPlans] = useState([]);
  const durationOptions = DURATION_OPTIONS;
  const [planType, setPlanType] = useState("internet");
  const [loading, setLoading] = useState(true);

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

  const navigate = useNavigate();

  const canProcessInteraction = () => {
    const now = Date.now();
    if (now - lastInteractionRef.current < PLAN_INTERACTION_COOLDOWN_MS) {
      return false;
    }
    lastInteractionRef.current = now;
    return true;
  };

  const speedOptions = useMemo(
    () => getUniqueValues(plans.map((p) => p.speed)).filter(isValidSpeedLabel),
    [plans]
  );

  const providerOptions = useMemo(() => {
    if (!selectedSpeed) return [];
    const providersForSpeed = plans
      .filter((p) => p.speed === selectedSpeed)
      .map((p) => p.provider);
    return getUniqueValues(providersForSpeed);
  }, [plans, selectedSpeed]);

  const availableDurationOptions = useMemo(() => {
    if (!selectedSpeed || !selectedProvider) return [];
    const durations = plans
      .filter(
        (p) => p.speed === selectedSpeed && p.provider === selectedProvider
      )
      .map((p) => p.duration);
    return getUniqueValues(durations);
  }, [plans, selectedSpeed, selectedProvider]);

  // Step 1: fetch all plans for the selected planType
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/plans/filter", {
          params: { planType },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        const sanitizedData = data.filter((plan) => isValidSpeedLabel(plan.speed));
        setPlans(sanitizedData);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [planType]);

  // Keep speed selection valid for the selected plan type.
  useEffect(() => {
    if (!speedOptions.length) {
      if (selectedSpeed) setSelectedSpeed("");
      return;
    }

    if (!selectedSpeed || !speedOptions.includes(selectedSpeed)) {
      setSelectedSpeed(speedOptions[0]);
    }
  }, [speedOptions, selectedSpeed]);

  // Keep provider selection valid for the selected speed.
  useEffect(() => {
    if (!selectedSpeed || !providerOptions.length) {
      if (selectedProvider) setSelectedProvider("");
      return;
    }

    if (!selectedProvider || !providerOptions.includes(selectedProvider)) {
      setSelectedProvider(providerOptions[0]);
    }
  }, [selectedSpeed, providerOptions, selectedProvider]);

  // Keep duration selection valid for selected speed+provider.
  useEffect(() => {
    if (!selectedSpeed || !selectedProvider || !availableDurationOptions.length) {
      if (selectedDuration) setSelectedDuration("");
      return;
    }

    if (
      !selectedDuration ||
      !availableDurationOptions.includes(selectedDuration)
    ) {
      const monthlyFirst = availableDurationOptions.includes("Monthly")
        ? "Monthly"
        : availableDurationOptions[0];
      setSelectedDuration(monthlyFirst);
    }
  }, [
    selectedSpeed,
    selectedProvider,
    availableDurationOptions,
    selectedDuration,
  ]);

  // Compute available OTT/TV options for current context
  const availablePlans = plans.filter(
    (p) =>
      p.speed === selectedSpeed &&
      p.provider === selectedProvider &&
      p.duration === selectedDuration
  );

  const planIndex = useMemo(() => {
    const map = new Map();
    for (const plan of plans) {
      const base = {
        speed: plan.speed,
        duration: plan.duration,
        provider: plan.provider,
        ottTier: plan.ottTier,
        tvChannels: plan.tvChannels,
      };

      map.set(
        buildPlanKey({ ...base, planType: "internet" }),
        plan
      );
      map.set(
        buildPlanKey({ ...base, planType: "internet+ott" }),
        plan
      );
      map.set(
        buildPlanKey({ ...base, planType: "internet+tv" }),
        plan
      );
      map.set(
        buildPlanKey({ ...base, planType: "internet+tv+ott" }),
        plan
      );
    }
    return map;
  }, [plans]);

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

  // Keep OTT/TV child selections valid when parent context changes.
  useEffect(() => {
    if (planType.includes("ott")) {
      if (
        ottTierOptions.length > 0 &&
        (!selectedOttTier || !ottTierOptions.includes(selectedOttTier))
      ) {
        setSelectedOttTier(ottTierOptions[0]);
      } else if (ottTierOptions.length === 0 && selectedOttTier) {
        setSelectedOttTier("");
      }
    } else if (selectedOttTier) {
      setSelectedOttTier("");
    }

    if (planType.includes("tv")) {
      if (
        tvChannelOptions.length > 0 &&
        (!selectedTvChannel || !tvChannelOptions.includes(selectedTvChannel))
      ) {
        setSelectedTvChannel(tvChannelOptions[0]);
      } else if (tvChannelOptions.length === 0 && selectedTvChannel) {
        setSelectedTvChannel("");
      }
    } else if (selectedTvChannel) {
      setSelectedTvChannel("");
    }
  }, [
    ottTierOptions,
    tvChannelOptions,
    selectedOttTier,
    selectedTvChannel,
    planType,
  ]);

  const handlePlanTypeChange = (nextPlanType) => {
    if (nextPlanType === planType) return;
    if (!canProcessInteraction()) return;
    setPlanType(nextPlanType);
  };

  const handleSpeedChange = (speed) => {
    if (speed === selectedSpeed) return;
    if (!canProcessInteraction()) return;
    setSelectedSpeed(speed);
  };

  const handleProviderChange = (provider) => {
    if (provider === selectedProvider) return;
    if (!canProcessInteraction()) return;
    setSelectedProvider(provider);
  };

  const handleDurationChange = (duration) => {
    if (duration === selectedDuration) return;
    if (!canProcessInteraction()) return;
    setSelectedDuration(duration);
  };

  const currentPlan = useMemo(() => {
    if (!selectedSpeed || !selectedProvider || !selectedDuration) {
      return null;
    }
    if (planType.includes("ott") && !selectedOttTier) {
      return null;
    }
    if (planType.includes("tv") && !selectedTvChannel) {
      return null;
    }

    return (
      planIndex.get(
        buildPlanKey({
          speed: selectedSpeed,
          duration: selectedDuration,
          provider: selectedProvider,
          ottTier: planType.includes("ott") ? selectedOttTier : "",
          tvChannels: planType.includes("tv") ? selectedTvChannel : "",
          planType,
        })
      ) || null
    );
  }, [
    selectedSpeed,
    selectedDuration,
    selectedProvider,
    selectedOttTier,
    selectedTvChannel,
    planIndex,
    planType,
  ]);

  const handleDownloadPDF = () => {
    if (!currentPlan) return;

    const doc = new jsPDF();

    // --- Header ---
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text("INVOICE", 14, 20);

    // Company Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("AARYAA NETWORK", 14, 32);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your Trusted Internet Service Provider", 14, 38);
    doc.text(
      "Connect every smile at home with joyful fibre experience",
      14,
      43
    );
    doc.text(
      "Email: aaryaanetwork@gmail.com | Phone: +91-9962201081 , +91-7708067932",
      14,
      48
    );

    // --- Customer Info & Invoice Details ---
    const rightStart = 120;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    // doc.text("Customer Name: [To be filled]", rightStart, 38);
    // doc.text("Address: [To be filled]", rightStart, 43);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, rightStart, 38);
    doc.text(
      `Invoice #: INV-${Date.now().toString().slice(-6)}`,
      rightStart,
      43
    );

    // --- Plan Details Table ---
    autoTable(doc, {
      startY: 65,
      head: [["Plan Details", "Specifications"]],
      body: [
        // Plan Overview
        ["Internet Speed", currentPlan.speed],
        ["Plan Duration", currentPlan.duration],
        ["Service Provider", currentPlan.provider],

        // Services & Features
        ["OTT Tier", currentPlan.ottTier],
        ["OTT Platforms", currentPlan.ottList.join(", ")],
        ["TV Channels", currentPlan.tvChannels],
        ["Router Included", currentPlan.router],
        ["Android Box", currentPlan.androidBox ? "Included" : "Not Included"],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold", cellWidth: 60 },
        1: { halign: "left", cellWidth: 120 },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // --- Pricing Breakdown Table ---
    const finalY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: finalY,
      head: [["Description", "Amount"]],
      body: [
        ["Base Price", currentPlan.basePrice],
        ["OTT Charges", currentPlan.ottCharge],
        ["TV Charges", currentPlan.tvCharge],
        ["GST", currentPlan.gst],
        ["Renewal Total", currentPlan.renewalTotal],
        ["Installation Fee", currentPlan.installationFee],
        ["Advance Payment", currentPlan.advancePayment],
        ["First Time Total", currentPlan.firstTimeTotal],
        // ["Sub Total", `₹${(currentPlan.basePrice + currentPlan.ottCharge + currentPlan.tvCharge + currentPlan.installationFee + currentPlan.advancePayment).toFixed(2)}`],
        ["Discount Applied", currentPlan.discountAmount],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left", fontStyle: "normal", cellWidth: 120 },
        1: { halign: "right", fontStyle: "normal", cellWidth: 60 },
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
    });

    // --- Grand Total Box ---
    const grandTotalY = doc.lastAutoTable.finalY + 2;

    autoTable(doc, {
      startY: grandTotalY,
      body: [
        [
          "GRAND TOTAL",
          currentPlan.firstTimeTotal
            ? currentPlan.firstTimeTotal
            : currentPlan.renewalTotal,
        ],
      ],
      styles: {
        fontSize: 11,
        cellPadding: 5,
        lineColor: [200, 200, 200], // softer gray
        lineWidth: 0.2,
        textColor: [44, 62, 80], // dark slate text
      },

      headStyles: {
        fillColor: [41, 128, 185], // blue header
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        fontSize: 12,
      },

      bodyStyles: {
        fillColor: [245, 247, 250], // light background for rows
      },

      alternateRowStyles: {
        fillColor: [255, 255, 255], // alternate white rows
      },

      columnStyles: {
        0: { halign: "left", fontStyle: "bold", cellWidth: 120 },
        1: { halign: "right", fontStyle: "normal", cellWidth: 60 },
      },

      footStyles: {
        fillColor: [39, 174, 96], // green highlight for total
        textColor: 255,
        fontStyle: "bold",
        halign: "right",
      },
    });

    // --- Footer ---
    const footerY = doc.internal.pageSize.height - 30;
    doc.setDrawColor(220, 220, 220);
    doc.line(14, footerY - 5, 196, footerY - 5);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Terms & Conditions:", 14, footerY);
    doc.text("• This is a system generated invoice", 14, footerY + 5);
    doc.text(
      "• All prices are inclusive of applicable taxes",
      14,
      footerY + 10
    );
    doc.text(
      "• For support and queries, contact: aaryaanetwork@gmail.com",
      14,
      footerY + 15
    );

    doc.setTextColor(41, 128, 185);
    doc.text("Thank you for choosing Aaryaa Network!", 14, footerY + 20);

    // Save with descriptive filename
    const filename = `Aaryaa_${currentPlan.speed.replace(/\s+/g, "_")}_${
      currentPlan.duration
    }_Plan_Invoice.pdf`;
    doc.save(filename);
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
            <img src={akka} loading="lazy" decoding="async"></img>
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
              entertained, united, and closer than ever
            </p>
          </div>

          <div className="total-container">
            <div className="left-header">
              <div className="title-tag get-plan-tag">
                <div className="circle-dot"></div>
                <p>Get Customized Plans</p>
              </div>
              <div
                className={`plan-type-selection ${
                  loading ? "disabled" : "enabled"
                }`}
              >
                {PLAN_TYPES.map((pt) => (
                  <label key={pt.value}>
                    <input
                      type="radio"
                      className="rbutton"
                      name="planType"
                      value={pt.value}
                      checked={planType === pt.value}
                      onChange={(e) => handlePlanTypeChange(e.target.value)}
                      disabled={loading}
                    />
                    {pt.label}
                  </label>
                ))}
              </div>
            </div>
            <div
              className={`fade-section ${
                loading ? "loading" : "loaded"
              }`}
            >
              {loading ? (
                <SkeletonLoader />
              ) : (
                <div className="total-subcontainer">
                  <div className="left-part">
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
                              onClick={() => handleSpeedChange(speed)}
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
                              onClick={() => handleProviderChange(provider)}
                              type="button"
                            >
                              <div className="circle">
                                {providerLogoMap[provider] && (
                                  <img
                                    src={providerLogoMap[provider]}
                                    alt={provider}
                                    loading="lazy"
                                    decoding="async"
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
                            const isAvailable = availableDurationOptions.includes(
                              duration
                            );
                            return (
                              <button
                                key={duration}
                                className={`option-button ${
                                  selectedDuration === duration ? "active" : ""
                                }`}
                                onClick={() =>
                                  isAvailable && handleDurationChange(duration)
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
                                    loading="lazy"
                                    decoding="async"
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
                            <span style={{ fontWeight: 500 }}>
                              Plan Details
                            </span>
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
                                    {currentPlan.ottList.length > 2
                                      ? ", ..."
                                      : ""}
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
                      <div className="skeleton-right-loading">
                        <div className="skeleton skeleton-price-box"></div>
                        <div className="skeleton skeleton-plan-details"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
