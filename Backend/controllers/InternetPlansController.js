const config = require("../models/Config");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const Plan = require("../models/InternetPlans");

// Upload & seed from Excel
exports.seedPlansFromExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (![".xlsx", ".xls"].includes(ext)) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "Invalid file type. Only Excel files allowed." });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "File too large. Max 2MB allowed." });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const plansData = xlsx.utils.sheet_to_json(sheet);

    let inserted = 0;
    let skipped = 0;

    for (const plan of plansData) {
      if (
        plan.speed &&
        ["Monthly", "Quarterly", "Half-Yearly", "Yearly"].includes(
          plan.duration
        ) &&
        plan.provider &&
        typeof plan.basePrice === "number"
      ) {
        const exists = await Plan.findOne({
          speed: plan.speed,
          duration: plan.duration,
          provider: plan.provider,
          planType: plan.planType || "internet",
          ottTier: plan.ottTier || "None",
          tvChannels: plan.tvChannels || "None",
        });

        if (exists) {
          skipped++;
          continue;
        }

        const newPlan = new Plan({
          speed: plan.speed,
          duration: plan.duration,
          provider: plan.provider,
          basePrice: plan.basePrice,
          installationFee: plan.installationFee || 0,
          discountPercent: plan.discountPercent || 0,
          planType: plan.planType || "internet",
          ottTier: plan.ottTier || "None",
          ottCharge: Number(plan.ottCharge) || 0,
          ottList:
            typeof plan.ottList === "string"
              ? plan.ottList.split(",").map((p) => p.trim())
              : [],
          tvChannels: plan.tvChannels || "None",
          tvCharge: Number(plan.tvCharge) || 0,
          advancePayment: Number(plan.advancePayment) || 0,
          router: plan.router || "None",
          androidBox: plan.androidBox?.toString().toLowerCase() === "yes",
        });

        await newPlan.save();
        inserted++;
      } else {
        skipped++;
      }
    }

    fs.unlinkSync(req.file.path);
    res.status(200).json({
      message: `✅ ${inserted} plans inserted, ${skipped} duplicates skipped.`,
    });
  } catch (err) {
    console.error("Seeding error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ message: "Failed to process Excel file" });
  }
};

// Get all plans (with expanded price logic and new fields)
exports.getAllPlans = async (req, res) => {
  try {
    const { planType, speed, duration, provider } = req.query;
    const filter = {};
    if (planType) filter.planType = planType;
    if (speed) filter.speed = speed;
    if (duration) filter.duration = duration;
    if (provider) filter.provider = provider;

    const plans = await Plan.find(filter);
    const configData = await config.findOne();
    const gstPercent = configData ? configData.gstPercent : 18;

    const updatedPlans = plans.map((plan) => {
      // Calculate discount and price breakdowns
      const discount = plan.discountPercent
        ? (plan.basePrice * plan.discountPercent) / 100
        : 0;
      const discountedBase = plan.basePrice - discount;
      const addons = (plan.ottCharge || 0) + (plan.tvCharge || 0);
      const gst = parseFloat(
        (((discountedBase + addons) * gstPercent) / 100).toFixed(2)
      );
      const renewalTotal = parseFloat(
        (discountedBase + addons + gst).toFixed(2)
      );
      const firstTimeTotal = parseFloat(
        (
          renewalTotal +
          (plan.installationFee || 0) +
          (plan.advancePayment || 0)
        ).toFixed(2)
      );

      // Return all fields
      return {
        ...plan._doc,
        discountAmount: discount,
        gst,
        renewalTotal,
        firstTimeTotal,
      };
    });

    res.status(200).json(updatedPlans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single plan by ID (with all calculated fields and bundle info)
exports.getPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const configData = await config.findOne();
    const gstPercent = configData ? configData.gstPercent : 18;

    const discount = plan.discountPercent
      ? (plan.basePrice * plan.discountPercent) / 100
      : 0;
    const discountedBase = plan.basePrice - discount;
    const addons = (plan.ottCharge || 0) + (plan.tvCharge || 0);
    const gst = parseFloat(
      (((discountedBase + addons) * gstPercent) / 100).toFixed(2)
    );
    const renewalTotal = parseFloat((discountedBase + addons + gst).toFixed(2));
    const firstTimeTotal = parseFloat(
      (
        renewalTotal +
        (plan.installationFee || 0) +
        (plan.advancePayment || 0)
      ).toFixed(2)
    );

    res.status(200).json({
      ...plan._doc,
      discountAmount: discount,
      gst,
      renewalTotal,
      firstTimeTotal,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new plan
exports.addPlan = async (req, res) => {
  try {
    const {
      speed,
      duration,
      provider,
      basePrice,
      installationFee,
      discountPercent,
      planType,
      ottTier,
      ottCharge,
      ottList,
      tvChannels,
      tvCharge,
      advancePayment,
      router,
      androidBox,
    } = req.body;

    if (!speed || !duration || !provider || !basePrice || !planType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Parse & sanitize arrays/booleans
    const normalizedPlan = {
      speed,
      duration,
      provider,
      basePrice: Number(basePrice) || 0,
      installationFee: Number(installationFee) || 0,
      discountPercent: Number(discountPercent) || 0,
      planType,
      ottTier: ottTier || "None",
      ottCharge: ottCharge !== undefined ? Number(ottCharge) : -1,
      ottList: Array.isArray(ottList)
        ? ottList
        : typeof ottList === "string"
        ? ottList
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
      tvChannels: tvChannels || "None",
      tvCharge: tvCharge !== undefined ? Number(tvCharge) : -1,
      advancePayment: Number(advancePayment) || 0,
      router: router || "None",
      androidBox:
        androidBox === true ||
        androidBox === "Yes" ||
        androidBox?.toString().toLowerCase() === "yes",
    };

    const newPlan = new Plan(normalizedPlan);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Error adding plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update plan
exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      speed,
      duration,
      provider,
      basePrice,
      installationFee,
      discountPercent,
      planType,
      ottTier,
      ottCharge,
      ottList,
      tvChannels,
      tvCharge,
      advancePayment,
      router,
      androidBox,
    } = req.body;

    // Parse & sanitize arrays/booleans
    const normalizedPlan = {
      speed,
      duration,
      provider,
      basePrice: Number(basePrice) || 0,
      installationFee: Number(installationFee) || 0,
      discountPercent: Number(discountPercent) || 0,
      planType,
      ottTier: ottTier || "None",
      ottCharge: ottCharge !== undefined ? Number(ottCharge) : -1,
      ottList: Array.isArray(ottList)
        ? ottList
        : typeof ottList === "string"
        ? ottList
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
      tvChannels: tvChannels || "None",
      tvCharge: tvCharge !== undefined ? Number(tvCharge) : -1,
      advancePayment: Number(advancePayment) || 0,
      router: router || "None",
      androidBox:
        androidBox === true ||
        androidBox === "Yes" ||
        androidBox?.toString().toLowerCase() === "yes",
    };

    const updatedPlan = await Plan.findByIdAndUpdate(id, normalizedPlan, {
      new: true,
    });
    if (!updatedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete plan
exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.filterPlans = async (req, res) => {
  const { speed, duration, provider, planType } = req.query;
  try {
    const filter = {};
    if (speed) filter.speed = speed;
    if (duration) filter.duration = duration;
    if (provider) filter.provider = provider;
    if (planType) filter.planType = planType;

    const plans = await Plan.find(filter);
    if (!plans.length)
      return res.status(404).json({ message: "No plans found" });

    const configData = await config.findOne();
    const gstPercent = configData ? configData.gstPercent : 18;

    const updatedPlans = plans.map((plan) => {
      // Discount and totals logic with all new fields
      const discount = plan.discountPercent
        ? (plan.basePrice * plan.discountPercent) / 100
        : 0;
      const discountedBase = plan.basePrice - discount;
      const addons = (plan.ottCharge || 0) + (plan.tvCharge || 0);
      const gst = parseFloat(
        (((discountedBase + addons) * gstPercent) / 100).toFixed(2)
      );
      const renewalTotal = parseFloat(
        (discountedBase + addons + gst).toFixed(2)
      );
      const firstTimeTotal = parseFloat(
        (
          renewalTotal +
          (plan.installationFee || 0) +
          (plan.advancePayment || 0)
        ).toFixed(2)
      );

      return {
        ...plan._doc,
        discountAmount: discount,
        gst,
        renewalTotal,
        firstTimeTotal,
      };
    });

    res.status(200).json(updatedPlans);
  } catch (error) {
    console.error("Error filtering plans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// In InternetPlansController.js
exports.getRecentPlans = async (req, res) => {
  try {
    const recentPlans = await Plan.find().sort({ updatedAt: -1 }).limit(5);
    res.status(200).json(recentPlans);
  } catch (error) {
    console.error("Error fetching recent plans:", error); // This will show the real error in your server logs
    res.status(500).json({ message: "Internal server error" });
  }
};
