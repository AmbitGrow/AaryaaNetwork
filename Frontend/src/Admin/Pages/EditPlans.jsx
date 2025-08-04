import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Api/Api";
import axios from "axios";
import '../Styles/EditPlans.css';
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";

// Constants for select fields
const PLAN_TYPE_OPTIONS = [
  { label: "Internet Only", value: "internet" },
  { label: "Internet + OTT", value: "internet+ott" },
  { label: "Internet + TV", value: "internet+tv" },
  { label: "Internet + TV + OTT", value: "internet+tv+ott" }
];
const DURATION_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const EditPlan = () => {

useAutoLogout();

  const { id } = useParams();
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
    androidBox: "No"
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch plan for editing
  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/api/plans/${id}`);

        setFormData({
          speed: res.data.speed || "",
          duration: res.data.duration || "",
          provider: res.data.provider || "",
          planType: res.data.planType || "",
          basePrice: res.data.basePrice || "",
          installationFee: res.data.installationFee || "",
          discountPercent: res.data.discountPercent || "",
          ottTier: res.data.ottTier || "",
          ottCharge: res.data.ottCharge !== undefined && res.data.ottCharge !== null ? res.data.ottCharge : "",
          ottList: Array.isArray(res.data.ottList) ? res.data.ottList.join(", ") : "",
          tvChannels: res.data.tvChannels || "",
          tvCharge: res.data.tvCharge !== undefined && res.data.tvCharge !== null ? res.data.tvCharge : "",
          advancePayment: res.data.advancePayment || "",
          router: res.data.router || "",
          androidBox: res.data.androidBox ? "Yes" : "No"
        });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // setError("Failed to load plan data");
        toast.error("Failed to load plan data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Unified change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative numbers
    if (
      ["basePrice", "installationFee", "discountPercent", "ottCharge", "tvCharge", "advancePayment"].includes(name) &&
      Number(value) < 0
    ) return;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the edited plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!formData.speed || !formData.duration || !formData.provider || !formData.basePrice || !formData.planType) {
      toast.error("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      // Sanitize/payload as in AddPlan
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice) || 0,
        installationFee: Number(formData.installationFee) || 0,
        discountPercent: Number(formData.discountPercent) || 0,
        ottCharge: formData.ottCharge !== "" ? Number(formData.ottCharge) : -1,
        tvCharge: formData.tvCharge !== "" ? Number(formData.tvCharge) : -1,
        advancePayment: Number(formData.advancePayment) || 0,
        ottList: formData.ottList
          ? formData.ottList.split(",").map((x) => x.trim()).filter(Boolean)
          : [],
        androidBox: formData.androidBox === "Yes"
      };
      await API.put(`/api/plans/${id}`, payload,{ withCredentials: true });
      toast.success("Plan updated successfully!");
      navigate("/admin/view-plans");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      toast.error("Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-plan-container">
      <h2>Edit Internet Plan</h2>

      {error && <p className="edit-plan-error">{error}</p>}
      {loading ? (
        <p>Loading plan data...</p>
      ) : (
        <form className="edit-plan-form" onSubmit={handleSubmit}>
          <label htmlFor="speed">Speed <span className="required">*</span></label>
          <input
            type="text"
            name="speed"
            id="speed"
            value={formData.speed}
            onChange={handleChange}
            required
          />

          <label htmlFor="duration">Duration <span className="required">*</span></label>
          <select
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <label htmlFor="provider">Provider <span className="required">*</span></label>
          <input
            type="text"
            name="provider"
            id="provider"
            value={formData.provider}
            onChange={handleChange}
            required
          />

          <label htmlFor="planType">Plan Type <span className="required">*</span></label>
          <select
            id="planType"
            name="planType"
            value={formData.planType}
            onChange={handleChange}
            required
          >
            <option value="">Select Plan Type</option>
            {PLAN_TYPE_OPTIONS.map(pt => (
              <option key={pt.value} value={pt.value}>{pt.label}</option>
            ))}
          </select>

          <label htmlFor="basePrice">Base Price (₹) <span className="required">*</span></label>
          <input
            type="number"
            name="basePrice"
            id="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
            min={0}
          />

          <label htmlFor="installationFee">Installation Fee (₹)</label>
          <input
            type="number"
            name="installationFee"
            id="installationFee"
            value={formData.installationFee}
            onChange={handleChange}
            min={0}
          />

          <label htmlFor="discountPercent">Discount (%)</label>
          <input
            type="number"
            name="discountPercent"
            id="discountPercent"
            max={100}
            min={0}
            value={formData.discountPercent}
            onChange={handleChange}
          />

          {/* OTT Fields */}
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

          {/* TV Fields */}
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

          <button
            type="submit"
            disabled={submitting}
            className="submit-btn"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPlan;
