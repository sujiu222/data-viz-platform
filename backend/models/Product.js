const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    category: String,
    rank: Number,
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ sales: -1 });
ProductSchema.index({ revenue: -1 });

module.exports = mongoose.model("Product", ProductSchema);
