import { useEffect, useState } from "react";
import API from "../Api/Api"; // axios with baseURL + withCredentials
import '../Styles/UpdateGST.css';
import { toast } from "react-toastify";
import useAutoLogout from "../Hooks/useAutoLogout";
const GstSetting = () => {
  const [gstPercent, setGstPercent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
useAutoLogout();

  useEffect(() => {
    const fetchGst = async () => {
      try {
        const res = await API.get("/api/get-gst");
        setGstPercent(res.data.gstPercent ?? "");
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Failed to load GST percentage");
      } finally {
        setLoading(false);
      }
    };

    fetchGst();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedGst = parseFloat(gstPercent);

    if (isNaN(parsedGst) || parsedGst < 0 || parsedGst > 100) {
      toast.warning("Enter a valid GST percentage between 0 and 100");
      return;
    }

    setSaving(true);
    try {
      await API.post("/api/set-gst", { gstPercent: parsedGst }, { withCredentials: true });
      toast.success(`GST updated to ${parsedGst}%`);
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      toast.error("Failed to update GST");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gst-setting-container">
      <h2>Update GST Settings</h2>

      {loading ? (
        <p>Loading current GST...</p>
      ) : (
        <form className="gst-setting-form" onSubmit={handleSubmit}>
          <label htmlFor="gstInput">
            GST % <span className="required">*</span>
          </label>
          <input
            id="gstInput"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={gstPercent}
            onChange={(e) => setGstPercent(e.target.value)}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update"}
          </button>
        </form>
      )}
    </div>
  );
};

export default GstSetting;
