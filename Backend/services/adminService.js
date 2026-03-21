const { randomUUID } = require("crypto");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const docClient = require("../config/dynamodb");

const TABLE = process.env.DDB_TABLE_ADMINS || "aaryaa-admins";

const getByEmail = async (email) => {
  const data = await docClient.send(
    new ScanCommand({
      TableName: TABLE,
    })
  );

  const target = String(email || "").trim().toLowerCase();
  return (
    data.Items?.find(
      (item) => String(item.email || "").trim().toLowerCase() === target
    ) || null
  );
};

const getById = async (id) => {
  const data = await docClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { id },
    })
  );

  return data.Item || null;
};

const createAdmin = async ({ email, password }) => {
  const now = new Date().toISOString();
  const item = {
    id: randomUUID(),
    email,
    password,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: item,
    })
  );

  return item;
};

const updateAdmin = async (admin) => {
  const item = {
    ...admin,
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

const removeAdmin = async (id) => {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { id },
    })
  );
};

module.exports = {
  getByEmail,
  getById,
  createAdmin,
  updateAdmin,
  removeAdmin,
};
