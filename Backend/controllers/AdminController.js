const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminService = require("../services/adminService");
const configService = require("../services/configService");

const getNormalizedBody = (req) => {
  let payload = req.body;

  if (Buffer.isBuffer(payload)) {
    payload = payload.toString("utf8");
  }

  if (payload && typeof payload === "object" && payload.body !== undefined) {
    payload = payload.body;
  }

  if (
    (payload === undefined || payload === null || payload === "") &&
    req.apiGateway?.event?.body
  ) {
    payload = req.apiGateway.event.body;

    if (req.apiGateway.event.isBase64Encoded && typeof payload === "string") {
      try {
        payload = Buffer.from(payload, "base64").toString("utf8");
      } catch (error) {
        payload = "";
      }
    }
  }

  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      payload = {};
    }
  }

  return payload && typeof payload === "object" ? payload : {};
};

exports.register = async (req, res) => {
  if (process.env.ALLOW_PUBLIC_ADMIN_REGISTER !== "true") {
    return res.status(403).json({ message: "Public registration is disabled" });
  }

  const { email, password } = getNormalizedBody(req);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const existingAdmin = await adminService.getByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await adminService.createAdmin({ email, password: hash });
    res.json({ message: "Admin registered" });
  } catch (error) {
    console.error("Admin registration failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.loginAdmin = async (req, res) => {
  const { email, password } = getNormalizedBody(req);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await adminService.getByEmail(email);
    if (!admin) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Admin login failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGst = async (req, res) => {
  try {
    const configData = await configService.getConfig();
    const gstPercent = configData?.gstPercent ?? 0;
    res.status(200).json({ gstPercent });
  } catch (error) {
    console.error("Error fetching GST:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.setGst = async (req, res) => {
  let { gstPercent } = getNormalizedBody(req);
  gstPercent = Number(gstPercent);

  if (isNaN(gstPercent) || gstPercent < 0 || gstPercent > 100) {
    return res
      .status(400)
      .json({ message: "Invalid GST percentage. Must be between 0 and 100." });
  }

  try {
    await configService.upsertConfig({ gstPercent });
    res.status(200).json({ message: "GST percentage updated successfully" });
  } catch (error) {
    console.error("Error updating GST percentage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ USE .env secret
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
};