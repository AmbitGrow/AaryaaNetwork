require("dotenv").config();

const mongoose = require("mongoose");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const Admin = require("../models/Admin");
const Config = require("../models/Config");
const InternetPlan = require("../models/InternetPlans");

const region = process.env.AWS_REGION || "ap-south-1";

const tableNames = {
  admins: process.env.DDB_TABLE_ADMINS || "aaryaa-admins",
  configs: process.env.DDB_TABLE_CONFIGS || "aaryaa-configs",
  plans: process.env.DDB_TABLE_PLANS || "aaryaa-plans",
};

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is required in your environment.");
  process.exit(1);
}

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const writeInBatches = async (tableName, items) => {
  const batches = chunk(items, 25);

  for (const batch of batches) {
    const requestItems = {
      [tableName]: batch.map((Item) => ({ PutRequest: { Item } })),
    };

    let unprocessed = requestItems;
    let retries = 0;

    while (Object.keys(unprocessed).length > 0) {
      const result = await dynamo.send(
        new BatchWriteCommand({ RequestItems: unprocessed })
      );

      const remaining = result.UnprocessedItems || {};
      if (!remaining[tableName] || remaining[tableName].length === 0) {
        break;
      }

      retries += 1;
      if (retries > 5) {
        throw new Error(
          `Failed to process all items for ${tableName} after retries.`
        );
      }

      unprocessed = remaining;
      await new Promise((resolve) => setTimeout(resolve, 300 * retries));
    }
  }
};

const toIsoOrUndefined = (value) => {
  if (!value) return undefined;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt.toISOString();
};

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Reading MongoDB collections...");
    const [admins, plans, config] = await Promise.all([
      Admin.find({}).lean(),
      InternetPlan.find({}).lean(),
      Config.findOne({}).lean(),
    ]);

    const adminItems = admins.map((admin) => ({
      id: String(admin._id),
      email: admin.email,
      password: admin.password,
      createdAt: toIsoOrUndefined(admin.createdAt),
      updatedAt: toIsoOrUndefined(admin.updatedAt),
    }));

    const planItems = plans.map((plan) => ({
      id: String(plan._id),
      speed: plan.speed,
      duration: plan.duration,
      provider: plan.provider,
      basePrice: Number(plan.basePrice || 0),
      installationFee: Number(plan.installationFee || 0),
      discountPercent: Number(plan.discountPercent || 0),
      planType: plan.planType || "internet",
      ottTier: plan.ottTier || "None",
      ottList: Array.isArray(plan.ottList) ? plan.ottList : [],
      ottCharge: Number(plan.ottCharge || 0),
      tvChannels: plan.tvChannels || "None",
      tvCharge: Number(plan.tvCharge || 0),
      router: plan.router || "None",
      androidBox: Boolean(plan.androidBox),
      advancePayment: Number(plan.advancePayment || 0),
      createdAt: toIsoOrUndefined(plan.createdAt),
      updatedAt: toIsoOrUndefined(plan.updatedAt),
    }));

    const configItem = {
      id: "default",
      gstPercent: Number(config?.gstPercent ?? 18),
      migratedAt: new Date().toISOString(),
    };

    console.log(`Writing ${adminItems.length} admins...`);
    await writeInBatches(tableNames.admins, adminItems);

    console.log(`Writing ${planItems.length} plans...`);
    await writeInBatches(tableNames.plans, planItems);

    console.log("Writing config...");
    await dynamo.send(
      new PutCommand({
        TableName: tableNames.configs,
        Item: configItem,
      })
    );

    console.log("Migration complete.");
    console.log(
      JSON.stringify(
        {
          adminsMigrated: adminItems.length,
          plansMigrated: planItems.length,
          configMigrated: true,
          tables: tableNames,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close().catch(() => undefined);
  }
})();
