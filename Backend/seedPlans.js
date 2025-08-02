const mongoose = require("mongoose");
const dotenv = require("dotenv");
const xlsx = require("xlsx");
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

const seedPlans = async () => {
  try {
    const workbook = xlsx.readFile("Fibernet_plans.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const plansData = xlsx.utils.sheet_to_json(sheet);

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
