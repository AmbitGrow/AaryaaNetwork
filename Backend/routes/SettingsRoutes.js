const express = require("express");
const router = express.Router();
const {
  addAdmin,
  changePassword,
  requestEmailChangeOtp,
  verifyOtpAndUpdateEmail,
} = require("../controllers/SettingsController");

const auth = require("../middleware/auth");

router.use(auth);

router.post("/add", auth, addAdmin);
router.post("/change-password", auth, changePassword);
router.post("/change-email/request-otp", auth, requestEmailChangeOtp);
router.post("/change-email/verify-and-update", auth, verifyOtpAndUpdateEmail);

module.exports = router;
