import { useState } from "react";
import API from "../Api/Api";
import { toast } from "react-toastify";
const SeedPlans = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/api/plans/seed", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
      // setMessage(res.data.message);
      toast.success(res.data.message);
    } catch (err) {
      // setMessage(err.response?.data?.message || "Upload failed");
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Seed Plans from Excel</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload & Seed</button>
      </form>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default SeedPlans;
