const mongoose = require('mongoose');

// 排行榜商品模型
const zhidemaiRankSchema = new mongoose.Schema({
  // 商品ID
  productId: {
    type: String,
    required: true,
    index: true
  },
  // 排行榜类型
  rankType: {
    type: String,
    enum: ['hot', 'new', 'sale', 'price'],
    required: true,
    index: true
  },
  // 排名
  rank: {
    type: Number,
    required: true
  },
  // 商品标题
  title: {
    type: String,
    required: true
  },
  // 价格
  price: Number,
  // 原价
  originalPrice: Number,
  // 商品图片
  imageUrl: String,
  // 商品链接
  productUrl: String,
  // 分类
  category: String,
  // 商城
  mall: String,
  // 品牌
  brand: String,
  // 热度值
  hotValue: Number,
  // 销量
  salesCount: Number,
  // 评论数
  reviewCount: Number,
  // 评分
  rating: Number,
  // 标签
  tags: [String],
  // 榜单日期
  rankDate: {
    type: Date,
    required: true,
    index: true
  },
  // 数据来源
  source: {
    type: String,
    default: 'zhidemai'
  },
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 复合索引
zhidemaiRankSchema.index({ rankType: 1, rankDate: -1, rank: 1 });
zhidemaiRankSchema.index({ category: 1, rankDate: -1 });

module.exports = mongoose.model('ZhidemaiRank', zhidemaiRankSchema);
