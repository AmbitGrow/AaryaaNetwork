import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Styles/ViewPlans.css";
import useAutoLogout from "../Hooks/useAutoLogout";
// Number of plans per page
const PLANS_PER_PAGE = 10;

// All plan types (schema enum)
const PLAN_TYPE_OPTIONS = [
  { label: "All Plan Types", value: "" },
  { label: "Internet Only", value: "internet" },
  { label: "Internet + OTT", value: "internet+ott" },
  { label: "Internet + TV", value: "internet+tv" },
  { label: "Internet + TV + OTT", value: "internet+tv+ott" },
];

const DURATION_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

const ViewPlans = () => {
useAutoLogout();

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDuration, setFilterDuration] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [filterPlanType, setFilterPlanType] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch plans from backend
  const fetchPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/plans", {
        withCredentials: true,
      });
      setPlans(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        // setError(err.response?.data?.message || "Failed to fetch plans");
        toast.error(err.response?.data?.message || "Failed to fetch plans");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete single plan
  const deletePlan = async (id) => {
    setDeletingPlanId(id);
    try {
      await API.delete(`/plans/${id}`, {
        withCredentials: true,
      });
      fetchPlans();
      toast.success("Plan deleted successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to delete plan");
      }
    } finally {
      setDeletingPlanId(null);
    }
  };

  // Enhanced file validation for import
  const handleFileChange = (e) => {
    setImportError("");
    const file = e.target.files[0];
    if (file && !/\.(xlsx|xls)$/i.test(file.name)) {
      setImportError("Only Excel files (.xlsx, .xls) are allowed.");
      fileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Filter and pagination logic
  const filteredPlans = plans.filter((plan) => {
    return (
      (filterDuration ? plan.duration === filterDuration : true) &&
      (filterProvider ? plan.provider === filterProvider : true) &&
      (filterPlanType ? plan.planType === filterPlanType : true)
    );
  });

  const totalPages = Math.ceil(filteredPlans.length / PLANS_PER_PAGE);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * PLANS_PER_PAGE,
    currentPage * PLANS_PER_PAGE
  );

  // Selection logic
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(paginatedPlans.map((plan) => plan._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectPlan = (id) => {
    if (selectedPlans.includes(id)) {
      setSelectedPlans(selectedPlans.filter((planId) => planId !== id));
    } else {
      setSelectedPlans([...selectedPlans, id]);
    }
  };

  useEffect(() => {
    const allIds = paginatedPlans.map((plan) => plan._id);
    setSelectAll(
      allIds.length > 0 && allIds.every((id) => selectedPlans.includes(id))
    );
  }, [paginatedPlans, selectedPlans]);

  // CSV Export with all new fields
  const exportToCSV = (selectedIds) => {
    const headers = [
      "Speed",
      "Duration",
      "Provider",
      "Plan Type",
      "Base Price",
      "Discount (%)",
      "GST",
      "OTT Tier",
      "OTT Charge",
      "OTT List",
      "TV Channels",
      "TV Charge",
      "Advance Payment",
      "Router",
      "Android Box",
      "Renewal Total",
      "First Time Total",
      "Installation Fee",
    ];

    const rows = plans
      .filter(
        (plan) => selectedIds.length === 0 || selectedIds.includes(plan._id)
      )
      .map((plan) => [
        plan.speed,
        plan.duration,
        plan.provider,
        plan.planType,
        plan.basePrice,
        plan.discountPercent || 0,
        plan.gst,
        plan.ottTier,
        plan.ottCharge === 0 ? "Free" : plan.ottCharge,
        Array.isArray(plan.ottList) ? plan.ottList.join("; ") : "",
        plan.tvChannels,
        plan.tvCharge === 0 ? "Free" : plan.tvCharge,
        plan.advancePayment ? plan.advancePayment : "",
        plan.router,
        plan.androidBox ? "Yes" : "No",
        plan.renewalTotal,
        plan.firstTimeTotal || "-",
        plan.installationFee,
      ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => String(val).replace(/,/g, ";")).join(","))
      .join("\n");

    let filename = "internet_plans.csv";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-plans-container">
      <h2>All Internet Plans</h2>
      {loading ? (
        <p style={{ padding: 12, fontStyle: "italic" }} aria-live="polite">
          Loading plans...
        </p>
      ) : (
        <>
          <div className="filters" role="region" aria-label="Plan Filters">
            {/* Plan Type filter */}
            <select
              value={filterPlanType}
              onChange={(e) => {
                setFilterPlanType(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Plan Type"
              style={{ marginRight: 10 }}
            >
              {PLAN_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Duration filter */}
            <select
              value={filterDuration}
              onChange={(e) => {
                setFilterDuration(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Duration"
              style={{ marginRight: 10 }}
            >
              <option value="">All Durations</option>
              {DURATION_OPTIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            {/* Provider filter */}
            <select
              value={filterProvider}
              onChange={(e) => {
                setFilterProvider(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Provider"
            >
              <option value="">All Providers</option>
              {[...new Set(plans.map((plan) => plan.provider))].map(
                (provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                )
              )}
            </select>
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {importError && (
            <div
              className="custom-alert custom-alert-error"
              style={{ marginBottom: 10 }}
              role="alert"
            >
              {importError}
            </div>
          )}
          <div
            style={{
              margin: "18px 0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => exportToCSV(selectedPlans)}
              style={{
                padding: "10px 20px",
                background: "#651E1E",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              aria-label="Export Selected Plans"
            >
              Export
            </button>
          </div>
          <div className="view-plans-scroll">
            <table className="view-plans-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      aria-label="Select All Plans"
                    />
                  </th>
                  <th>Speed</th>
                  <th>Duration</th>
                  <th>Plan Type</th>
                  <th>Provider</th>
                  <th>Base Price</th>
                  <th>Discount (%)</th>
                  <th>GST</th>
                  <th>Installation Fee</th>
                  <th>Advance Payment</th>
                  <th>OTT Tier</th>
                  <th>OTT Charge</th>
                  <th title="List of OTT Apps">OTT List</th>
                  <th>TV Channels</th>
                  <th>TV Charge</th>
                  <th>Router</th>
                  <th>Android Box</th>
                  <th style={{ background: "#651E1E" }}>Renewal Total</th>
                  <th style={{ background: "#651E1E" }}>First Time Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlans.map((plan) => (
                  <tr
                    key={plan._id}
                    tabIndex={0}
                    aria-label={`Plan ${plan.speed} ${plan.duration}`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPlans.includes(plan._id)}
                        onChange={() => toggleSelectPlan(plan._id)}
                        aria-label={`Select plan ${plan.speed} ${plan.duration}`}
                      />
                    </td>
                    <td>{plan.speed}</td>
                    <td>{plan.duration}</td>
                    <td>{plan.planType}</td>
                    <td>{plan.provider}</td>
                    <td>₹{plan.basePrice}</td>
                    <td>{plan.discountPercent || 0}</td>
                    <td>₹{plan.gst}</td>
                    <td>₹{plan.installationFee}</td>
                    <td>
                      {plan.advancePayment ? `₹${plan.advancePayment}` : "—"}
                    </td>
                    <td>
                      {plan.ottTier === "None" || !plan.ottTier
                        ? "None"
                        : plan.ottTier}
                    </td>
                    <td>
                      {plan.ottTier === "None" || !plan.ottTier
                        ? "-"
                        : plan.ottCharge === 0
                        ? "Free"
                        : `₹${plan.ottCharge}`}
                    </td>
                    <td
                      title={
                        Array.isArray(plan.ottList)
                          ? plan.ottList.join(", ")
                          : ""
                      }
                    >
                      {Array.isArray(plan.ottList) &&
                      plan.ottList.length > 0 ? (
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline dotted",
                          }}
                        >
                          {plan.ottList.slice(0, 2).join(", ")}
                          {plan.ottList.length > 2 ? "..." : ""}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {plan.tvChannels === "None" || !plan.tvChannels
                        ? "None"
                        : plan.tvChannels}
                    </td>
                    <td>
                      {plan.tvChannels === "None" || !plan.tvChannels
                        ? "-"
                        : plan.tvCharge === 0
                        ? "Free"
                        : `₹${plan.tvCharge}`}
                    </td>

                    <td>{plan.router}</td>
                    <td>{plan.androidBox ? "Yes" : "No"}</td>
                    <td style={{ background: "#d6d67fff" }}>
                      ₹{plan.renewalTotal}
                    </td>
                    <td style={{ background: "#f7f7e7" }}>
                      {plan.installationFee > 0 || plan.advancePayment > 0
                        ? `₹${plan.firstTimeTotal}`
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        aria-label="Edit Plan"
                        title="Edit Plan"
                        onClick={() =>
                          navigate(`/admin/edit-plans/${plan._id}`)
                        }
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        aria-label="Delete Plan"
                        title="Delete Plan"
                        disabled={deletingPlanId === plan._id}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this plan?"
                            )
                          ) {
                            deletePlan(plan._id);
                          }
                        }}
                      >
                        {deletingPlanId === plan._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Plans Pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                title="Previous Page"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn${
                    currentPage === idx + 1 ? " active" : ""
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                  aria-label={`Go to page ${idx + 1}`}
                  title={`Go to page ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                title="Next Page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ViewPlans;
