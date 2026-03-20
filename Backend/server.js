const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
app.disable("x-powered-by");

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});


app.get("/api/ping", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/login", loginLimiter);

const contactRoutes=require("./routes/ContactRoutes");
app.use("/api/contact", contactLimiter, contactRoutes);

const InternetPlanRoutes = require("./routes/InternetPlanRoutes");
app.use("/api/plans", InternetPlanRoutes);

const AdminRoutes = require("./routes/AdminRoutes");
app.use("/api/", AdminRoutes);

const adminSettingsRoutes = require("./routes/SettingsRoutes");
app.use("/api/settings", adminSettingsRoutes);

let lambdaHandler;

const getLambdaHandler = async () => {
  if (!lambdaHandler) {
    lambdaHandler = serverless(app);
  }
  return lambdaHandler;
};

module.exports.app = app;
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const handler = await getLambdaHandler();
  return handler(event, context);
};

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
  });
}
