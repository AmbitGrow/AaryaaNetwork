const docClient = require("../config/dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const tableName = process.env.DDB_TABLE_CONTACTMESSAGES || "aaryaa-contactmessages";

const createContactMessage = async (messageData) => {
  const id = randomUUID();
  const message = {
    id,
    firstName: messageData.firstName,
    lastName: messageData.lastName,
    email: messageData.email,
    phone: messageData.phone,
    address: messageData.address,
    message: messageData.message,
    selectedPlan: messageData.selectedPlan || null,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: message,
    })
  );

  return message;
};

const getAllContactMessages = async () => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );

  return result.Items || [];
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
};
