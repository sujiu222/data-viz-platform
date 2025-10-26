const mongoose = require("mongoose");

const TrafficSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
    pv: {
      type: Number,
      default: 0,
    },
    uv: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

TrafficSchema.index({ date: -1, hour: 1 });

module.exports = mongoose.model("Traffic", TrafficSchema);
