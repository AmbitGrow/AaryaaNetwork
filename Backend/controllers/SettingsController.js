const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const dns = require("dns").promises;
const sendOtpEmail = require("../utils/mailer.js");
const otpStore = require("../utils/otpStore.js");

exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const domain = email.split("@")[1];

    // DNS MX record check
    const mxRecords = await dns.resolveMx(domain).catch(() => null);
    if (!mxRecords || mxRecords.length === 0)
      return res.status(400).json({ message: "Invalid email domain" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: "New admin added successfully" });
  } catch (err) {
    console.error("Add Admin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestEmailChangeOtp = async (req, res) => {
  const { currentEmail } = req.body;
  try {
    const admin = await Admin.findOne({ email: currentEmail });
    if (!admin) return res.status(404).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(currentEmail, { otp, expires: Date.now() + 5 * 60 * 1000 });

    await sendOtpEmail(currentEmail, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.log(err);
  }
};

exports.verifyOtpAndUpdateEmail = async (req, res) => {
  const { currentEmail, otp, newEmail } = req.body;
  try {
    const record = otpStore.get(currentEmail);
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const existingAdmin = await Admin.findOne({ email: newEmail });
    if (existingAdmin)
      return res.status(409).json({ message: "New email already exists" });

    const updated = await Admin.findOneAndUpdate(
      { email: currentEmail },
      { email: newEmail },
      { new: true }
    );

    otpStore.delete(currentEmail);
    res.json({
      message: "Email updated successfully",
      newEmail: updated.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
