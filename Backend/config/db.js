const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    await connectionPromise;
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  try {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    await connectionPromise;
    console.log("Database connected Successfully");
    return mongoose.connection;
  } catch (error) {
    console.log("Database connection failed", error);
    connectionPromise = undefined;
    throw error;
  }
};

module.exports = connectDB;