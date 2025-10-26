const mongoose = require('mongoose');

// 优惠券模型
const zhidemaiCouponSchema = new mongoose.Schema({
  // 优惠券ID
  couponId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // 优惠券名称
  name: {
    type: String,
    required: true
  },
  // 商城/平台
  mall: {
    id: Number,
    name: String
  },
  // 优惠券金额
  amount: {
    type: Number,
    required: true
  },
  // 使用门槛（满多少可用）
  threshold: Number,
  // 返利金额
  rebate: Number,
  // 优惠券类型
  type: {
    type: String,
    enum: ['full_reduction', 'discount', 'cashback', 'gift'],
    default: 'full_reduction'
  },
  // 优惠券链接
  url: String,
  // 优惠券码
  code: String,
  // 适用品类
  category: String,
  // 适用商品
  products: [String],
  // 使用说明
  description: String,
  // 领取人数
  receivedCount: {
    type: Number,
    default: 0
  },
  // 使用人数
  usedCount: {
    type: Number,
    default: 0
  },
  // 库存数量
  stock: Number,
  // 每人限领数量
  limitPerUser: Number,
  // 开始时间
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  // 结束时间
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  // 是否已过期
  isExpired: {
    type: Boolean,
    default: false
  },
  // 是否可用
  isActive: {
    type: Boolean,
    default: true
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

// 索引
zhidemaiCouponSchema.index({ startTime: 1, endTime: 1 });
zhidemaiCouponSchema.index({ amount: -1 });
zhidemaiCouponSchema.index({ 'mall.id': 1 });

module.exports = mongoose.model('ZhidemaiCoupon', zhidemaiCouponSchema);
