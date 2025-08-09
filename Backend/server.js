const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
// app.set("trust proxy", 1); // Or just `true` — enables correct detection of X-Forwarded-* headers

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

connectDB();

const contactRoutes=require("./routes/ContactRoutes");
app.use("/api/contact",contactRoutes);

const InternetPlanRoutes = require("./routes/InternetPlanRoutes");
app.use("/api/plans", InternetPlanRoutes);

const AdminRoutes = require("./routes/AdminRoutes");
app.use("/api/", AdminRoutes);

const adminSettingsRoutes = require("./routes/SettingsRoutes");
app.use("/api/settings", adminSettingsRoutes);

app.get("/api/ping", (req, res) => {
  res.status(200).send("OK");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

// module.exports.handler = serverless(app);