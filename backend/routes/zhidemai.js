const express = require('express');
const router = express.Router();
const ZhidemaiHaojia = require('../models/ZhidemaiHaojia');
const ZhidemaiArticle = require('../models/ZhidemaiArticle');
const ZhidemaiCoupon = require('../models/ZhidemaiCoupon');
const ZhidemaiRank = require('../models/ZhidemaiRank');
const ZhideMaiClient = require('../utils/zhideMaiClient');

// 初始化值得买客户端
// 注意：需要在环境变量中配置 ZHIDEMAI_APP_KEY 和 ZHIDEMAI_ACCESS_TOKEN
const zhideMaiClient = new ZhideMaiClient(
  process.env.ZHIDEMAI_APP_KEY || 'demo_app_key',
  process.env.ZHIDEMAI_ACCESS_TOKEN || null
);

// ==================== 好价相关路由 ====================

/**
 * 获取好价列表
 * GET /api/zhidemai/haojia
 */
router.get('/haojia', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sort = 'publishTime' } = req.query;
    
    const query = {};
    if (category) {
      query.category = category;
    }
    
    // 过滤未过期的好价
    query.isExpired = false;
    
    const sortOption = {};
    sortOption[sort] = -1;
    
    const haojiaList = await ZhidemaiHaojia.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ZhidemaiHaojia.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        list: haojiaList,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取好价列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取好价列表失败',
      error: error.message
    });
  }
});

/**
 * 获取热门好价
 * GET /api/zhidemai/haojia/hot
 */
router.get('/haojia/hot', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const hotHaojia = await ZhidemaiHaojia.find({ isExpired: false })
      .sort({ hotValue: -1, likeCount: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: hotHaojia
    });
  } catch (error) {
    console.error('获取热门好价失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门好价失败',
      error: error.message
    });
  }
});

/**
 * 获取好价分类统计
 * GET /api/zhidemai/haojia/categories
 */
router.get('/haojia/categories', async (req, res) => {
  try {
    const categories = await ZhidemaiHaojia.aggregate([
      { $match: { isExpired: false } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgDiscount: { $avg: '$discount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count,
        avgPrice: Math.round(cat.avgPrice * 100) / 100,
        avgDiscount: Math.round(cat.avgDiscount * 100) / 100
      }))
    });
  } catch (error) {
    console.error('获取分类统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类统计失败',
      error: error.message
    });
  }
});

/**
 * 刷新好价数据（从值得买API获取）
 * POST /api/zhidemai/haojia/refresh
 */
router.post('/haojia/refresh', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.body;
    
    // 调用值得买API获取数据
    const result = await zhideMaiClient.getHaojiaList({ page, limit });
    
    if (result && result.data) {
      // 将数据保存到数据库
      const savePromises = result.data.map(item => {
        return ZhidemaiHaojia.findOneAndUpdate(
          { articleId: item.article_id },
          {
            articleId: item.article_id,
            title: item.title,
            price: item.price,
            originalPrice: item.original_price,
            discount: item.discount,
            imageUrl: item.image_url,
            productUrl: item.product_url,
            description: item.description,
            category: item.category,
            mall: item.mall,
            hotValue: item.hot_value,
            commentCount: item.comment_count || 0,
            likeCount: item.like_count || 0,
            favoriteCount: item.favorite_count || 0,
            tags: item.tags || [],
            publishTime: item.publish_time,
            expireTime: item.expire_time,
            isExpired: new Date(item.expire_time) < new Date()
          },
          { upsert: true, new: true }
        );
      });
      
      await Promise.all(savePromises);
      
      res.json({
        success: true,
        message: '刷新好价数据成功',
        count: result.data.length
      });
    } else {
      throw new Error('API返回数据格式错误');
    }
  } catch (error) {
    console.error('刷新好价数据失败:', error);
    res.status(500).json({
      success: false,
      message: '刷新好价数据失败',
      error: error.message
    });
  }
});

// ==================== 社区文章相关路由 ====================

/**
 * 获取文章列表
 * GET /api/zhidemai/articles
 */
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category } = req.query;
    
    const query = {};
    if (type) {
      query.type = type;
    }
    if (category) {
      query['category.name'] = category;
    }
    
    const articles = await ZhidemaiArticle.find(query)
      .sort({ publishTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ZhidemaiArticle.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        list: articles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文章列表失败',
      error: error.message
    });
  }
});

/**
 * 获取热门文章
 * GET /api/zhidemai/articles/popular
 */
router.get('/articles/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularArticles = await ZhidemaiArticle.find()
      .sort({ viewCount: -1, likeCount: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: popularArticles
    });
  } catch (error) {
    console.error('获取热门文章失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门文章失败',
      error: error.message
    });
  }
});

/**
 * 获取精华文章
 * GET /api/zhidemai/articles/elite
 */
router.get('/articles/elite', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const eliteArticles = await ZhidemaiArticle.find({ isElite: true })
      .sort({ publishTime: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: eliteArticles
    });
  } catch (error) {
    console.error('获取精华文章失败:', error);
    res.status(500).json({
      success: false,
      message: '获取精华文章失败',
      error: error.message
    });
  }
});

// ==================== 优惠券相关路由 ====================

/**
 * 获取优惠券列表
 * GET /api/zhidemai/coupons
 */
router.get('/coupons', async (req, res) => {
  try {
    const { page = 1, limit = 20, mall } = req.query;
    const now = new Date();
    
    const query = {
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    };
    
    if (mall) {
      query['mall.name'] = mall;
    }
    
    const coupons = await ZhidemaiCoupon.find(query)
      .sort({ amount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ZhidemaiCoupon.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        list: coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取优惠券列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取优惠券列表失败',
      error: error.message
    });
  }
});

/**
 * 获取热门优惠券
 * GET /api/zhidemai/coupons/hot
 */
router.get('/coupons/hot', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const now = new Date();
    
    const hotCoupons = await ZhidemaiCoupon.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    })
      .sort({ receivedCount: -1, amount: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: hotCoupons
    });
  } catch (error) {
    console.error('获取热门优惠券失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门优惠券失败',
      error: error.message
    });
  }
});

// ==================== 排行榜相关路由 ====================

/**
 * 获取排行榜数据
 * GET /api/zhidemai/rank
 */
router.get('/rank', async (req, res) => {
  try {
    const { type = 'hot', limit = 20, date } = req.query;
    
    const query = { rankType: type };
    
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.rankDate = {
        $gte: targetDate,
        $lt: nextDay
      };
    } else {
      // 获取最新日期的排行榜
      const latestRank = await ZhidemaiRank.findOne({ rankType: type })
        .sort({ rankDate: -1 });
      
      if (latestRank) {
        query.rankDate = latestRank.rankDate;
      }
    }
    
    const rankList = await ZhidemaiRank.find(query)
      .sort({ rank: 1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: rankList
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      success: false,
      message: '获取排行榜失败',
      error: error.message
    });
  }
});

/**
 * 获取排行榜分类统计
 * GET /api/zhidemai/rank/categories
 */
router.get('/rank/categories', async (req, res) => {
  try {
    const { type = 'hot' } = req.query;
    
    const categories = await ZhidemaiRank.aggregate([
      { $match: { rankType: type } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count,
        avgPrice: Math.round(cat.avgPrice * 100) / 100,
        avgRating: Math.round(cat.avgRating * 10) / 10
      }))
    });
  } catch (error) {
    console.error('获取排行榜分类失败:', error);
    res.status(500).json({
      success: false,
      message: '获取排行榜分类失败',
      error: error.message
    });
  }
});

// ==================== 搜索相关路由 ====================

/**
 * 搜索好价
 * GET /api/zhidemai/search/haojia
 */
router.get('/search/haojia', async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索关键词'
      });
    }
    
    const query = {
      isExpired: false,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const results = await ZhidemaiHaojia.find(query)
      .sort({ hotValue: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ZhidemaiHaojia.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        list: results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('搜索好价失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索好价失败',
      error: error.message
    });
  }
});

/**
 * 搜索文章
 * GET /api/zhidemai/search/articles
 */
router.get('/search/articles', async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索关键词'
      });
    }
    
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { summary: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const results = await ZhidemaiArticle.find(query)
      .sort({ viewCount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ZhidemaiArticle.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        list: results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('搜索文章失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索文章失败',
      error: error.message
    });
  }
});

// ==================== 统计数据路由 ====================

/**
 * 获取综合统计数据
 * GET /api/zhidemai/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    
    // 统计各类数据总数
    const stats = {
      haojia: {
        total: await ZhidemaiHaojia.countDocuments(),
        active: await ZhidemaiHaojia.countDocuments({ isExpired: false })
      },
      articles: {
        total: await ZhidemaiArticle.countDocuments(),
        elite: await ZhidemaiArticle.countDocuments({ isElite: true })
      },
      coupons: {
        total: await ZhidemaiCoupon.countDocuments(),
        active: await ZhidemaiCoupon.countDocuments({
          isActive: true,
          startTime: { $lte: now },
          endTime: { $gte: now }
        })
      },
      ranks: {
        total: await ZhidemaiRank.countDocuments()
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败',
      error: error.message
    });
  }
});

module.exports = router;
