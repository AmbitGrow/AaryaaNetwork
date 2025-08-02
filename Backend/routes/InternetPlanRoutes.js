const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getAllPlans,
  getPlanById,
  addPlan: createPlan,
  updatePlan,
  deletePlan,
  filterPlans,
  seedPlansFromExcel,
  getRecentPlans,
} = require("../controllers/InternetPlansController");

router.get("/", getAllPlans);
router.get("/filter", filterPlans); // Route to filter plans based on query parameters
router.get("/recent", getRecentPlans); // public route
router.get("/:id", getPlanById);

router.use(auth);

router.post("/", auth, createPlan);
router.put("/:id", auth, updatePlan);
router.delete("/:id", auth, deletePlan);
router.post("/import", upload.single("file"), seedPlansFromExcel);

module.exports = router;
