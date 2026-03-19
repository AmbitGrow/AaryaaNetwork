const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ExcelJS = require("exceljs");
const Plan = require("./models/InternetPlans");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
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

const seedPlans = async () => {
  try {
    const plansData = await parsePlansFromExcel("Fibernet_plans.xlsx");

    console.log(`📄 Found ${plansData.length} rows in Excel`);

    await Plan.deleteMany(); // Optional: clear existing plans
    console.log("🧹 Existing plans deleted");

    let inserted = 0;
    let skipped = 0;

    for (const row of plansData) {
      if (
        row.speed &&
        row.duration &&
        row.provider &&
        typeof row.basePrice === "number"
      ) {
        const newPlan = new Plan({
          speed: row.speed,
          duration: row.duration,
          provider: row.provider,
          basePrice: Number(row.basePrice),
          installationFee: Number(row.installationFee) || 0,
          discountPercent: Number(row.discountPercent) || 0,
          planType: row.planType || "internet",
          ottTier: row.ottTier || "None",
          ottCharge: Number(row.ottCharge) || 0,
          ottList:
            typeof row.ottList === "string"
              ? row.ottList.split(",").map((ott) => ott.trim())
              : [],
          tvChannels: row.tvChannels || "None",
          tvCharge: Number(row.tvCharge) || 0,
          advancePayment: Number(row.advancePayment) || 0,
          router: row.router || "None",
          androidBox:
            row.androidBox?.toString().toLowerCase() === "yes" ? true : false,
        });

        await newPlan.save();
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ ${inserted} plans inserted`);
    if (skipped > 0) {
      console.warn(`⚠️ ${skipped} rows skipped due to invalid/missing fields`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    process.exit(1);
  }
};

connectDB()
  .then(seedPlans)
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
