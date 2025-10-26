const mongoose = require("mongoose");

const CategorySalesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    description: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CategorySales", CategorySalesSchema);
