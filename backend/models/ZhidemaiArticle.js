const mongoose = require('mongoose');

// 社区文章模型
const zhidemaiArticleSchema = new mongoose.Schema({
  // 文章ID
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
  // 作者信息
  author: {
    id: String,
    name: String,
    avatar: String,
    level: Number
  },
  // 文章内容
  content: String,
  // 文章摘要
  summary: String,
  // 封面图
  coverImage: String,
  // 文章图片列表
  images: [String],
  // 分类
  category: {
    id: String,
    name: String
  },
  // 标签
  tags: [String],
  // 文章类型（普通文章、视频、晒单等）
  type: {
    type: String,
    enum: ['article', 'video', 'review', 'qa'],
    default: 'article'
  },
  // 浏览数
  viewCount: {
    type: Number,
    default: 0
  },
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
  // 分享数
  shareCount: {
    type: Number,
    default: 0
  },
  // 是否精华
  isElite: {
    type: Boolean,
    default: false
  },
  // 是否置顶
  isTop: {
    type: Boolean,
    default: false
  },
  // 发布时间
  publishTime: Date,
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
zhidemaiArticleSchema.index({ publishTime: -1 });
zhidemaiArticleSchema.index({ viewCount: -1 });
zhidemaiArticleSchema.index({ likeCount: -1 });
zhidemaiArticleSchema.index({ 'category.id': 1, publishTime: -1 });

module.exports = mongoose.model('ZhidemaiArticle', zhidemaiArticleSchema);
