const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    region: String,
  },
  {
    timestamps: true,
  }
);

// 索引优化
SalesSchema.index({ year: 1, month: 1 });
SalesSchema.index({ category: 1 });
SalesSchema.index({ region: 1 });

module.exports = mongoose.model("Sales", SalesSchema);
