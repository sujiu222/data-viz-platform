const mongoose = require('mongoose');

const JDHotListSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: '综合'
  },
  hotValue: {
    type: String,
    default: ''
  },
  crawlTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 索引优化
JDHotListSchema.index({ rank: 1 });
JDHotListSchema.index({ category: 1 });
JDHotListSchema.index({ crawlTime: -1 });

module.exports = mongoose.model('JDHotList', JDHotListSchema);
