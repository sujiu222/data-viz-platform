const express = require('express');
const router = express.Router();
const JDHotList = require('../models/JDHotList');
const { crawlJDHotList } = require('../crawlers/jdHotList');

// 获取京东热榜数据
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    
    let query = {};
    if (category && category !== '全部') {
      query.category = category;
    }
    
    const hotList = await JDHotList.find(query)
      .sort({ rank: 1 })
      .limit(limit)
      .select('-__v');
    
    res.json({
      success: true,
      data: hotList,
      count: hotList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取热榜数据失败',
      error: error.message
    });
  }
});

// 获取热榜分类统计
router.get('/categories', async (req, res) => {
  try {
    const categories = await JDHotList.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json({
      success: true,
      data: categories.map(item => ({
        category: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分类统计失败',
      error: error.message
    });
  }
});

// 获取TOP N商品
router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topList = await JDHotList.find()
      .sort({ rank: 1 })
      .limit(limit)
      .select('rank title price hotValue category -_id');
    
    res.json({
      success: true,
      data: topList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取TOP商品失败',
      error: error.message
    });
  }
});

// 手动触发爬虫更新
router.post('/refresh', async (req, res) => {
  try {
    console.log('🔄 手动触发热榜更新...');
    
    const hotList = await crawlJDHotList();
    
    if (hotList.length > 0) {
      // 清空旧数据
      await JDHotList.deleteMany({});
      
      // 插入新数据
      await JDHotList.insertMany(hotList);
      
      res.json({
        success: true,
        message: '热榜数据更新成功',
        count: hotList.length
      });
    } else {
      res.json({
        success: false,
        message: '未能获取到热榜数据'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新热榜失败',
      error: error.message
    });
  }
});

// 获取最后更新时间
router.get('/last-update', async (req, res) => {
  try {
    const latestItem = await JDHotList.findOne()
      .sort({ crawlTime: -1 })
      .select('crawlTime -_id');
    
    res.json({
      success: true,
      data: {
        lastUpdate: latestItem ? latestItem.crawlTime : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取更新时间失败',
      error: error.message
    });
  }
});

module.exports = router;
