const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Config = require("../models/Config");
const speakeasy = require("speakeasy");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, password: hash });
  await admin.save();
  res.json({ message: "Admin registered" });
};
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set to true if using HTTPS
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGst = async (req, res) => {
  try {
    const configData = await Config.findOne();
    const gstPercent = configData?.gstPercent ?? 0;
    res.status(200).json({ gstPercent });
  } catch (error) {
    console.error("Error fetching GST:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.setGst = async (req, res) => {
  let { gstPercent } = req.body;
  gstPercent = Number(gstPercent);

  if (isNaN(gstPercent) || gstPercent < 0 || gstPercent > 100) {
    return res
      .status(400)
      .json({ message: "Invalid GST percentage. Must be between 0 and 100." });
  }

  try {
    let configData = await Config.findOne();
    if (!configData) {
      configData = new Config({ gstPercent });
    } else {
      configData.gstPercent = gstPercent;
    }
    await configData.save();
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