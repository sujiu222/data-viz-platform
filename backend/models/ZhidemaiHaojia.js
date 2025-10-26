const mongoose = require('mongoose');

// 好价商品模型
const zhidemaiHaojiaSchema = new mongoose.Schema({
  // 好价ID
  articleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // 标题
  title: {
    type: String,
    required: true
  },
  // 价格
  price: {
    type: Number,
    required: true
  },
  // 原价
  originalPrice: Number,
  // 折扣率
  discount: Number,
  // 图片URL
  imageUrl: String,
  // 商品链接
  productUrl: String,
  // 商品描述
  description: String,
  // 分类
  category: String,
  // 商城/平台
  mall: String,
  // 热度值
  hotValue: Number,
  // 评论数
  commentCount: {
    type: Number,
    default: 0
  },
  // 点赞数
  likeCount: {
    type: Number,
    default: 0
  },
  // 收藏数
  favoriteCount: {
    type: Number,
    default: 0
  },
  // 标签
  tags: [String],
  // 是否已过期
  isExpired: {
    type: Boolean,
    default: false
  },
  // 发布时间
  publishTime: Date,
  // 过期时间
  expireTime: Date,
  // 数据来源
  source: {
    type: String,
    default: 'zhidemai'
  },
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 索引
zhidemaiHaojiaSchema.index({ hotValue: -1 });
zhidemaiHaojiaSchema.index({ publishTime: -1 });
zhidemaiHaojiaSchema.index({ category: 1, publishTime: -1 });

module.exports = mongoose.model('ZhidemaiHaojia', zhidemaiHaojiaSchema);
