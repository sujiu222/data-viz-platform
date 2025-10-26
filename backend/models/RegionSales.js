const mongoose = require("mongoose");

const RegionSalesSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      unique: true,
    },
    sales: {
      type: Number,
      required: true,
      default: 0,
    },
    growth: {
      type: Number,
      default: 0,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RegionSales", RegionSalesSchema);
