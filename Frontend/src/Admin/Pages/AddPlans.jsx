import { useState } from "react";
import API from "../Api/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/AddPlans.css";
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";

const PLAN_TYPE_OPTIONS = [
  { label: "Internet Only", value: "internet" },
  { label: "Internet + OTT", value: "internet+ott" },
  { label: "Internet + TV", value: "internet+tv" },
  { label: "Internet + TV + OTT", value: "internet+tv+ott" },
];
const DURATION_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const AddPlan = () => {
useAutoLogout();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    speed: "",
    duration: "",
    provider: "",
    planType: "",
    basePrice: "",
    installationFee: "",
    discountPercent: "",
    ottTier: "",
    ottCharge: "",
    ottList: "",
    tvChannels: "",
    tvCharge: "",
    advancePayment: "",
    router: "",
    androidBox: "No",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative numbers
    if (
      [
        "basePrice",
        "discountPercent",
        "installationFee",
        "ottCharge",
        "tvCharge",
        "advancePayment",
      ].includes(name) &&
      Number(value) < 0
    )
      return;

    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Basic Validation
    const { speed, duration, provider, basePrice, planType } = formData;
    if (!speed || !duration || !provider || !basePrice || !planType) {
      toast.error("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      basePrice: Number(formData.basePrice) || 0,
      installationFee: Number(formData.installationFee) || 0,
      discountPercent: Number(formData.discountPercent) || 0,
      ottCharge: formData.ottCharge !== "" ? Number(formData.ottCharge) : -1,
      tvCharge: formData.tvCharge !== "" ? Number(formData.tvCharge) : -1,
      advancePayment: Number(formData.advancePayment) || 0,
      ottList: formData.ottList
        ? formData.ottList
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
      androidBox: formData.androidBox === "Yes",
    };

    try {
      await API.post("/plans", payload,{withCredentials: true});
      toast.success("Plan added successfully!");
      navigate("/admin/add-plans");
      setFormData({});
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add plan";
      toast.error(message);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-plan-container">
      <h2>Add Internet Plan</h2>
      {error && (
        <p
          className="add-plan-error"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </p>
      )}
      <form className="add-plan-form" onSubmit={handleAdd}>
        <label htmlFor="speed">
          Speed <span className="required">*</span>
        </label>
        <input
          id="speed"
          type="text"
          name="speed"
          value={formData.speed}
          onChange={handleChange}
          required
        />

        <label htmlFor="duration">
          Duration <span className="required">*</span>
        </label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        >
          <option value="">Select Duration</option>
          {DURATION_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label htmlFor="provider">
          Provider <span className="required">*</span>
        </label>
        <input
          id="provider"
          type="text"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          required
        />

        <label htmlFor="planType">
          Plan Type <span className="required">*</span>
        </label>
        <select
          id="planType"
          name="planType"
          value={formData.planType}
          onChange={handleChange}
          required
        >
          <option value="">Select Plan Type</option>
          {PLAN_TYPE_OPTIONS.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>

        <label htmlFor="basePrice">
          Base Price (₹) <span className="required">*</span>
        </label>
        <input
          id="basePrice"
          type="number"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleChange}
          required
          min={0}
        />

        <label htmlFor="installationFee">Installation Fee (₹)</label>
        <input
          id="installationFee"
          type="number"
          name="installationFee"
          value={formData.installationFee}
          onChange={handleChange}
          min={0}
        />

        <label htmlFor="discountPercent">Discount (%)</label>
        <input
          id="discountPercent"
          type="number"
          name="discountPercent"
          value={formData.discountPercent}
          onChange={handleChange}
          max={100}
          min={0}
        />

        {/* OTT Details */}
        <label htmlFor="ottTier">OTT Tier</label>
        <input
          id="ottTier"
          type="text"
          name="ottTier"
          value={formData.ottTier}
          onChange={handleChange}
          placeholder="e.g. Basic, Premium, None"
        />
        <label htmlFor="ottCharge">OTT Charge (₹)</label>
        <input
          id="ottCharge"
          type="number"
          name="ottCharge"
          value={formData.ottCharge}
          onChange={handleChange}
          min={-1}
          placeholder="0 for Free, -1 if not applicable"
        />
        <label htmlFor="ottList">OTT Apps (comma separated)</label>
        <input
          id="ottList"
          type="text"
          name="ottList"
          value={formData.ottList}
          onChange={handleChange}
          placeholder="JioCinema, Zee5, SonyLiv"
        />

        {/* TV Details */}
        <label htmlFor="tvChannels">TV Channels</label>
        <input
          id="tvChannels"
          type="text"
          name="tvChannels"
          value={formData.tvChannels}
          onChange={handleChange}
          placeholder="e.g. 350+, None"
        />
        <label htmlFor="tvCharge">TV Charge (₹)</label>
        <input
          id="tvCharge"
          type="number"
          name="tvCharge"
          value={formData.tvCharge}
          onChange={handleChange}
          min={-1}
          placeholder="0 for Free, -1 if not applicable"
        />

        {/* Hardware/Extras */}
        <label htmlFor="advancePayment">Advance Payment (₹)</label>
        <input
          id="advancePayment"
          type="number"
          name="advancePayment"
          value={formData.advancePayment}
          onChange={handleChange}
          min={0}
        />

        <label htmlFor="router">Router</label>
        <input
          id="router"
          type="text"
          name="router"
          value={formData.router}
          onChange={handleChange}
          placeholder="e.g. Single Band, Dual Band, None"
        />

        <label htmlFor="androidBox">Android Box</label>
        <select
          id="androidBox"
          name="androidBox"
          value={formData.androidBox}
          onChange={handleChange}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Adding..." : "Add Plan"}
        </button>
      </form>
    </div>
  );
};

export default AddPlan;
