const mongoose = require("mongoose");

const UserStatisticsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    active: {
      type: Number,
      default: 0,
    },
    new: {
      type: Number,
      default: 0,
    },
    retention: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

UserStatisticsSchema.index({ date: -1 });

module.exports = mongoose.model("UserStatistics", UserStatisticsSchema);
