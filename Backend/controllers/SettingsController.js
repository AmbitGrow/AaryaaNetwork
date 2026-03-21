const bcrypt = require("bcrypt");
const dns = require("dns").promises;
const sendOtpEmail = require("../utils/mailer.js");
const otpStore = require("../utils/otpStore.js");
const adminService = require("../services/adminService");

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

exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = getNormalizedBody(req);

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const domain = email.split("@")[1];

    // DNS MX record check
    const mxRecords = await dns.resolveMx(domain).catch(() => null);
    if (!mxRecords || mxRecords.length === 0)
      return res.status(400).json({ message: "Invalid email domain" });

    const existingAdmin = await adminService.getByEmail(email);
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await adminService.createAdmin({ email, password: hashedPassword });
    res.status(201).json({ message: "New admin added successfully" });
  } catch (err) {
    console.error("Add Admin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = getNormalizedBody(req);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let admin = null;

    if (email) {
      admin = await adminService.getByEmail(email);
    } else if (req.user?.id) {
      admin = await adminService.getById(req.user.id);
    }

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await adminService.updateAdmin({ ...admin, password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestEmailChangeOtp = async (req, res) => {
  const { currentEmail } = getNormalizedBody(req);
  try {
    const admin = await adminService.getByEmail(currentEmail);
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
  const { currentEmail, otp, newEmail } = getNormalizedBody(req);
  try {
    const record = otpStore.get(currentEmail);
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const existingAdmin = await adminService.getByEmail(newEmail);
    if (existingAdmin)
      return res.status(409).json({ message: "New email already exists" });

    const currentAdmin = await adminService.getByEmail(currentEmail);
    const updated = await adminService.updateAdmin({
      ...currentAdmin,
      email: newEmail,
    });

    otpStore.delete(currentEmail);
    res.json({
      message: "Email updated successfully",
      newEmail: updated.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
