require("dotenv").config();

const {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");

const region = process.env.AWS_REGION || "ap-south-1";

const tableNames = {
  admins: process.env.DDB_TABLE_ADMINS || "aaryaa-admins",
  configs: process.env.DDB_TABLE_CONFIGS || "aaryaa-configs",
  plans: process.env.DDB_TABLE_PLANS || "aaryaa-plans",
  contactmessages: process.env.DDB_TABLE_CONTACTMESSAGES || "aaryaa-contactmessages",
};

const dynamo = new DynamoDBClient({ region });

const tableDefinitions = [
  {
    TableName: tableNames.admins,
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  },
  {
    TableName: tableNames.configs,
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  },
  {
    TableName: tableNames.plans,
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  },
  {
    TableName: tableNames.contactmessages,
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  },
];

const waitForActive = async (tableName) => {
  for (let i = 0; i < 30; i++) {
    const result = await dynamo.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    const status = result?.Table?.TableStatus;
    if (status === "ACTIVE") return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`Timed out waiting for table ${tableName} to become ACTIVE`);
};

const ensureTable = async (definition) => {
  try {
    await dynamo.send(
      new DescribeTableCommand({ TableName: definition.TableName })
    );
    console.log(`Table already exists: ${definition.TableName}`);
  } catch (error) {
    if (error.name !== "ResourceNotFoundException") {
      throw error;
    }

    console.log(`Creating table: ${definition.TableName}`);
    await dynamo.send(new CreateTableCommand(definition));
    await waitForActive(definition.TableName);
    console.log(`Table ACTIVE: ${definition.TableName}`);
  }
};

(async () => {
  try {
    for (const definition of tableDefinitions) {
      await ensureTable(definition);
    }

    console.log("DynamoDB tables are ready.");
    console.log(JSON.stringify(tableNames, null, 2));
  } catch (error) {
    console.error("Failed to create tables:", error);
    process.exit(1);
  }
})();
