const express = require("express");
const router = express.Router();
const UserStatistics = require("../models/UserStatistics");
const AgeDistribution = require("../models/AgeDistribution");

// 获取用户统计数据（最新的一条记录）
router.get("/statistics", async (req, res) => {
  try {
    const latestStats = await UserStatistics.findOne().sort({ date: -1 });

    if (!latestStats) {
      return res.json({
        success: true,
        data: { total: 0, active: 0, new: 0, retention: 0 },
      });
    }

    res.json({
      success: true,
      data: {
        total: latestStats.total,
        active: latestStats.active,
        new: latestStats.new,
        retention: latestStats.retention,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取用户统计数据失败",
      error: error.message,
    });
  }
});

// 获取用户增长数据
router.get("/growth", async (req, res) => {
  try {
    const data = await UserStatistics.find()
      .sort({ date: 1 })
      .select("date total -_id");

    // 转换数据格式
    const formattedData = data.map((item) => ({
      date: item.date,
      users: item.total,
    }));

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取用户增长数据失败",
      error: error.message,
    });
  }
});

// 获取年龄分布
router.get("/age-distribution", async (req, res) => {
  try {
    const data = await AgeDistribution.find().sort({ range: 1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取年龄分布数据失败",
      error: error.message,
    });
  }
});

module.exports = router;
