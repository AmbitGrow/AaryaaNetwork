const { randomUUID } = require("crypto");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const docClient = require("../config/dynamodb");

const TABLE = process.env.DDB_TABLE_PLANS || "aaryaa-plans";

const listPlans = async (filters = {}) => {
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) {
    const data = await docClient.send(
      new ScanCommand({
        TableName: TABLE,
      })
    );
    return data.Items || [];
  }

  const names = {};
  const values = {};
  const conditions = [];

  Object.entries(filters).forEach(([key, value], idx) => {
    if (value === undefined || value === null || value === "") return;
    const nameKey = `#k${idx}`;
    const valueKey = `:v${idx}`;
    names[nameKey] = key;
    values[valueKey] = value;
    conditions.push(`${nameKey} = ${valueKey}`);
  });

  if (conditions.length === 0) {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE }));
    return data.Items || [];
  }

  const data = await docClient.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: conditions.join(" AND "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );

  return data.Items || [];
};

const getPlanById = async (id) => {
  const data = await docClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { id },
    })
  );

  return data.Item || null;
};

const createPlan = async (plan) => {
  const now = new Date().toISOString();
  const item = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...plan,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: item,
    })
  );

  return item;
};

const updatePlan = async (id, plan) => {
  const existing = await getPlanById(id);
  if (!existing) return null;

  const item = {
    ...existing,
    ...plan,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: item,
    })
  );

  return item;
};

const deletePlan = async (id) => {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { id },
    })
  );
};

const getRecentPlans = async (limit = 5) => {
  const all = await listPlans();
  return all
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, limit);
};

const findDuplicatePlan = async ({
  speed,
  duration,
  provider,
  planType,
  ottTier,
  tvChannels,
}) => {
  const results = await listPlans({
    speed,
    duration,
    provider,
    planType: planType || "internet",
    ottTier: ottTier || "None",
    tvChannels: tvChannels || "None",
  });

  return results[0] || null;
};

module.exports = {
  listPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getRecentPlans,
  findDuplicatePlan,
};
