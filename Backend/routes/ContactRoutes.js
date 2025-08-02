const express = require("express");
const router = express.Router();

const {handleContactForm } = require("../controllers/ContactMessageController");

// router.route("/post").post(handleContactForm);
router.post("/post", handleContactForm);

module.exports = router;