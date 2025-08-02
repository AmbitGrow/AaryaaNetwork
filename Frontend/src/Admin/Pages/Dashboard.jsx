import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../Api/Api";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import "../Styles/Dashboard.css";
import useAutoLogout from "../Hooks/useAutoLogout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useAutoLogout();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get("/plans", { withCredentials: true });
        setPlans(res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Failed to fetch plans");
      }
    };

    const fetchRecentChanges = async () => {
      try {
        const res = await API.get("/plans/recent", { withCredentials: true });
        setRecentPlans(res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Failed to fetch recent plans");
      }
    };

    Promise.all([fetchPlans(), fetchRecentChanges()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const totalPlans = plans.length;
  const uniqueProviders = [...new Set(plans.map((p) => p.provider))];
  const discountPlans = plans.filter(
    (p) => p.discountPercent && p.discountPercent > 0
  ).length;

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your internet plans and settings
          </p>
        </div>

        {loading ? (
          <div className="loader">Loading dashboard data...</div>
        ) : (
          <>
            <div className="dashboard-analytics-cards">
              <div className="analytics-card">
                <h4>Total Plans</h4>
                <p>{totalPlans}</p>
              </div>
              <div className="analytics-card">
                <h4>Unique Providers</h4>
                <p>{uniqueProviders.length}</p>
              </div>
              <div className="analytics-card">
                <h4>Plans with Discount</h4>
                <p>{discountPlans}</p>
              </div>
            </div>

            {/* 🔥 Recent Changes Section */}
            <div className="recent-changes-section">
              <h2>🕘 Recent Changes</h2>
              <div className="recent-cards-container">
                {recentPlans.length === 0 ? (
                  <p>No recent changes found.</p>
                ) : (
                  recentPlans.map((plan) => (
                    <div className="recent-card" key={plan._id}>
                      <h3>
                        {plan.speed} - {plan.duration}
                      </h3>
                      <p>
                        <strong>Provider:</strong> {plan.provider}
                      </p>
                      <p>
                        <strong>Base Price:</strong> ₹{plan.basePrice}
                      </p>
                      {plan.discountPercent > 0 && (
                        <p>
                          <strong>Discount:</strong> {plan.discountPercent}%
                        </p>
                      )}
                      <p className="timestamp">
                        {moment(plan.updatedAt || plan.createdAt).fromNow()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
