const configService = require("../services/configService");
const plansService = require("../services/plansService");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

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

const normalizeExcelValue = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object") return value;
  if (value instanceof Date) return value;
  if (Object.prototype.hasOwnProperty.call(value, "result")) return value.result;
  if (typeof value.text === "string") return value.text;
  if (Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text || "").join("");
  }
  return value;
};

const parsePlansFromExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values
    .slice(1)
    .map((header) => (header ? String(normalizeExcelValue(header)).trim() : ""));

  const plans = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    const plan = {};

    headers.forEach((header, index) => {
      if (!header) return;
      const cellValue = normalizeExcelValue(row.getCell(index + 1).value);
      if (cellValue !== undefined && cellValue !== null && cellValue !== "") {
        plan[header] = cellValue;
      }
    });

    if (Object.keys(plan).length > 0) {
      plans.push(plan);
    }
  }

  return plans;
};

const normalizePlanInput = (body) => {
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
  } = body;

  return {
    speed,
    duration,
    provider,
    basePrice: Number(basePrice) || 0,
    installationFee: Number(installationFee) || 0,
    discountPercent: Number(discountPercent) || 0,
    planType,
    ottTier: ottTier || "None",
    ottCharge: ottCharge !== undefined ? Number(ottCharge) : 0,
    ottList: Array.isArray(ottList)
      ? ottList
      : typeof ottList === "string"
      ? ottList
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : [],
    tvChannels: tvChannels || "None",
    tvCharge: tvCharge !== undefined ? Number(tvCharge) : 0,
    advancePayment: Number(advancePayment) || 0,
    router: router || "None",
    androidBox:
      androidBox === true ||
      androidBox === "Yes" ||
      androidBox?.toString().toLowerCase() === "yes",
  };
};

const withComputedPriceFields = (plan, gstPercent) => {
  const discount = plan.discountPercent
    ? (Number(plan.basePrice) * Number(plan.discountPercent)) / 100
    : 0;
  const discountedBase = Number(plan.basePrice) - discount;
  const addons = Number(plan.ottCharge || 0) + Number(plan.tvCharge || 0);
  const gst = parseFloat((((discountedBase + addons) * gstPercent) / 100).toFixed(2));
  const renewalTotal = parseFloat((discountedBase + addons + gst).toFixed(2));
  const firstTimeTotal = parseFloat(
    (renewalTotal + Number(plan.installationFee || 0) + Number(plan.advancePayment || 0)).toFixed(2)
  );

  return {
    ...plan,
    _id: plan.id,
    discountAmount: discount,
    gst,
    renewalTotal,
    firstTimeTotal,
  };
};

exports.seedPlansFromExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== ".xlsx") {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "Invalid file type. Only .xlsx files are allowed." });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "File too large. Max 2MB allowed." });
    }

    const plansData = await parsePlansFromExcel(req.file.path);

    let inserted = 0;
    let skipped = 0;

    for (const plan of plansData) {
      if (
        plan.speed &&
        ["Monthly", "Quarterly", "Half-Yearly", "Yearly"].includes(plan.duration) &&
        plan.provider &&
        typeof plan.basePrice === "number"
      ) {
        const exists = await plansService.findDuplicatePlan({
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

        const newPlan = {
          speed: plan.speed,
          duration: plan.duration,
          provider: plan.provider,
          basePrice: Number(plan.basePrice) || 0,
          installationFee: Number(plan.installationFee) || 0,
          discountPercent: Number(plan.discountPercent) || 0,
          planType: plan.planType || "internet",
          ottTier: plan.ottTier || "None",
          ottCharge: Number(plan.ottCharge) || 0,
          ottList:
            typeof plan.ottList === "string"
              ? plan.ottList.split(",").map((p) => p.trim())
              : Array.isArray(plan.ottList)
              ? plan.ottList
              : [],
          tvChannels: plan.tvChannels || "None",
          tvCharge: Number(plan.tvCharge) || 0,
          advancePayment: Number(plan.advancePayment) || 0,
          router: plan.router || "None",
          androidBox: plan.androidBox?.toString().toLowerCase() === "yes",
        };

        await plansService.createPlan(newPlan);
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

exports.getAllPlans = async (req, res) => {
  try {
    const { planType, speed, duration, provider } = req.query;
    const filter = {};
    if (planType) filter.planType = planType;
    if (speed) filter.speed = speed;
    if (duration) filter.duration = duration;
    if (provider) filter.provider = provider;

    const plans = await plansService.listPlans(filter);
    const configData = await configService.getConfig();
    const gstPercent = configData ? Number(configData.gstPercent) : 18;

    const updatedPlans = plans.map((plan) => withComputedPriceFields(plan, gstPercent));

    res.status(200).json(updatedPlans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await plansService.getPlanById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const configData = await configService.getConfig();
    const gstPercent = configData ? Number(configData.gstPercent) : 18;

    res.status(200).json(withComputedPriceFields(plan, gstPercent));
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addPlan = async (req, res) => {
  try {
    const normalizedPlan = normalizePlanInput(getNormalizedBody(req));

    if (
      !normalizedPlan.speed ||
      !normalizedPlan.duration ||
      !normalizedPlan.provider ||
      !normalizedPlan.basePrice ||
      !normalizedPlan.planType
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newPlan = await plansService.createPlan(normalizedPlan);
    res.status(201).json({ ...newPlan, _id: newPlan.id });
  } catch (error) {
    console.error("Error adding plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const normalizedPlan = normalizePlanInput(getNormalizedBody(req));

    const updatedPlan = await plansService.updatePlan(id, normalizedPlan);
    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ ...updatedPlan, _id: updatedPlan.id });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await plansService.getPlanById(id);
    if (!existing) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plansService.deletePlan(id);
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

    const plans = await plansService.listPlans(filter);
    if (!plans.length) {
      return res.status(404).json({ message: "No plans found" });
    }

    const configData = await configService.getConfig();
    const gstPercent = configData ? Number(configData.gstPercent) : 18;

    const updatedPlans = plans.map((plan) => withComputedPriceFields(plan, gstPercent));

    res.status(200).json(updatedPlans);
  } catch (error) {
    console.error("Error filtering plans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRecentPlans = async (req, res) => {
  try {
    const recentPlans = await plansService.getRecentPlans(5);
    res.status(200).json(recentPlans.map((plan) => ({ ...plan, _id: plan.id })));
  } catch (error) {
    console.error("Error fetching recent plans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
