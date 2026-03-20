const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("../config/dynamodb");

const TABLE = process.env.DDB_TABLE_CONFIGS || "aaryaa-configs";
const DEFAULT_CONFIG_ID = "default";

const getConfig = async () => {
  const data = await docClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { id: DEFAULT_CONFIG_ID },
    })
  );

  return data.Item || null;
};

const upsertConfig = async (partialConfig) => {
  const existing = await getConfig();
  const now = new Date().toISOString();

  const item = {
    id: DEFAULT_CONFIG_ID,
    gstPercent: Number(existing?.gstPercent ?? 18),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    ...partialConfig,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: item,
    })
  );

  return item;
};

module.exports = {
  getConfig,
  upsertConfig,
};
