const express = require("express");
const router = express.Router();
const Traffic = require("../models/Traffic");
const Product = require("../models/Product");

// 获取实时数据（模拟实时变化）
router.get("/realtime", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 获取今日流量总计
    const todayTraffic = await Traffic.find({ date: today });

    const todayVisits = todayTraffic.reduce((sum, item) => sum + item.pv, 0);
    const todayUV = todayTraffic.reduce((sum, item) => sum + item.uv, 0);

    // 模拟实时数据（带随机波动）
    const data = {
      onlineUsers: 8642 + Math.floor(Math.random() * 200 - 100),
      todayVisits: todayVisits || 45280,
      todayOrders: 3215 + Math.floor(Math.random() * 50 - 25),
      todayRevenue: 428600 + Math.floor(Math.random() * 10000 - 5000),
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取实时数据失败",
      error: error.message,
    });
  }
});

// 获取流量数据
router.get("/traffic", async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const data = await Traffic.find({ date })
      .sort({ hour: 1 })
      .select("hour pv uv -_id");

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取流量数据失败",
      error: error.message,
    });
  }
});

// 获取热门产品
router.get("/top-products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const data = await Product.find()
      .sort({ sales: -1 })
      .limit(limit)
      .select("name sales revenue -_id");

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取热门产品失败",
      error: error.message,
    });
  }
});

// 获取综合仪表板数据
router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 并行获取所有数据
    const [todayTraffic, topProducts, allTraffic] = await Promise.all([
      Traffic.find({ date: today }),
      Product.find()
        .sort({ sales: -1 })
        .limit(5)
        .select("name sales revenue -_id"),
      Traffic.find({ date: today }).sort({ hour: 1 }).select("hour pv uv -_id"),
    ]);

    const todayVisits = todayTraffic.reduce((sum, item) => sum + item.pv, 0);

    // 获取最近6小时的流量数据
    const recentTraffic = allTraffic.slice(-6);

    res.json({
      success: true,
      data: {
        realtime: {
          onlineUsers: 8642 + Math.floor(Math.random() * 200 - 100),
          todayVisits: todayVisits || 45280,
          todayOrders: 3215,
          todayRevenue: 428600,
        },
        traffic: recentTraffic,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取仪表板数据失败",
      error: error.message,
    });
  }
});

module.exports = router;
