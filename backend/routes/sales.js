const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const CategorySales = require("../models/CategorySales");
const RegionSales = require("../models/RegionSales");

// 获取月度销售数据
router.get("/monthly", async (req, res) => {
  try {
    const year = req.query.year || 2024;
    const data = await Sales.find({ year }).sort({ month: 1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取月度销售数据失败",
      error: error.message,
    });
  }
});

// 获取分类销售数据
router.get("/category", async (req, res) => {
  try {
    const data = await CategorySales.find().sort({ value: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取分类销售数据失败",
      error: error.message,
    });
  }
});

// 获取区域销售数据
router.get("/region", async (req, res) => {
  try {
    const data = await RegionSales.find().sort({ sales: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取区域销售数据失败",
      error: error.message,
    });
  }
});

// 获取所有销售数据
router.get("/all", async (req, res) => {
  try {
    const year = req.query.year || 2024;

    const [monthly, byCategory, byRegion] = await Promise.all([
      Sales.find({ year }).sort({ month: 1 }),
      CategorySales.find().sort({ value: -1 }),
      RegionSales.find().sort({ sales: -1 }),
    ]);

    res.json({
      success: true,
      data: {
        monthly,
        byCategory,
        byRegion,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取销售数据失败",
      error: error.message,
    });
  }
});

module.exports = router;
