const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  gstPercent: {
    type: Number,
    required: true,
    default: 18
  }
});

module.exports = mongoose.model("Config", configSchema);
