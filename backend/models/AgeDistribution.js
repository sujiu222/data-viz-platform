const mongoose = require("mongoose");

const AgeDistributionSchema = new mongoose.Schema(
  {
    range: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AgeDistribution", AgeDistributionSchema);
