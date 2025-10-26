# 值得买 OpenAPI 集成指南

## 简介

本项目已集成值得买（zhidemai.com）OpenAPI，实现了以下功能模块：
- 好价信息展示
- 社区文章浏览
- 优惠券查询
- 商品排行榜

## 功能模块

### 1. 好价推荐
展示来自值得买平台的优惠商品信息，包括：
- 商品标题、价格、折扣
- 商品图片和链接
- 热度、评论、点赞统计
- 过期时间提醒
- 分类筛选和排序

**访问路径**: `/zhidemai-deals`

**主要功能**:
- 查看好价列表（支持分页）
- 按分类筛选
- 多种排序方式（时间、热度、价格、折扣）
- 热门好价TOP10图表
- 分类分布饼图

### 2. 社区文章
展示值得买社区的优质内容，包括：
- 文章、视频、晒单、问答
- 作者信息和等级
- 文章封面和摘要
- 浏览量、评论、点赞统计
- 精华文章标识

**访问路径**: `/zhidemai-articles`

**主要功能**:
- 查看文章列表（支持分页）
- 按类型筛选（文章/视频/晒单/问答）
- 热门文章展示
- 精华文章筛选
- 热门文章浏览量TOP10图表

### 3. 优惠券查询
查看各大电商平台的优惠券信息：
- 优惠券金额和门槛
- 适用商城和品类
- 有效期限
- 领取和使用人数

### 4. 商品排行榜
展示各类商品排行榜：
- 热销榜
- 新品榜
- 销量榜
- 分类统计

## 数据模型

### ZhidemaiHaojia（好价）
```javascript
{
  articleId: String,        // 好价ID
  title: String,            // 标题
  price: Number,            // 价格
  originalPrice: Number,    // 原价
  discount: Number,         // 折扣率
  imageUrl: String,         // 图片URL
  productUrl: String,       // 商品链接
  category: String,         // 分类
  mall: String,             // 商城
  hotValue: Number,         // 热度值
  commentCount: Number,     // 评论数
  likeCount: Number,        // 点赞数
  favoriteCount: Number,    // 收藏数
  tags: [String],           // 标签
  isExpired: Boolean,       // 是否过期
  publishTime: Date,        // 发布时间
  expireTime: Date          // 过期时间
}
```

### ZhidemaiArticle（文章）
```javascript
{
  articleId: String,        // 文章ID
  title: String,            // 标题
  author: {                 // 作者信息
    id: String,
    name: String,
    avatar: String,
    level: Number
  },
  content: String,          // 内容
  summary: String,          // 摘要
  coverImage: String,       // 封面图
  category: {               // 分类
    id: String,
    name: String
  },
  tags: [String],           // 标签
  type: String,             // 类型(article/video/review/qa)
  viewCount: Number,        // 浏览数
  commentCount: Number,     // 评论数
  likeCount: Number,        // 点赞数
  favoriteCount: Number,    // 收藏数
  isElite: Boolean,         // 是否精华
  publishTime: Date         // 发布时间
}
```

### ZhidemaiCoupon（优惠券）
```javascript
{
  couponId: String,         // 优惠券ID
  name: String,             // 名称
  mall: {                   // 商城信息
    id: Number,
    name: String
  },
  amount: Number,           // 优惠金额
  threshold: Number,        // 使用门槛
  rebate: Number,           // 返利金额
  type: String,             // 类型
  url: String,              // 链接
  startTime: Date,          // 开始时间
  endTime: Date,            // 结束时间
  isExpired: Boolean,       // 是否过期
  isActive: Boolean         // 是否可用
}
```

### ZhidemaiRank（排行榜）
```javascript
{
  productId: String,        // 商品ID
  rankType: String,         // 排行榜类型(hot/new/sale)
  rank: Number,             // 排名
  title: String,            // 标题
  price: Number,            // 价格
  imageUrl: String,         // 图片
  category: String,         // 分类
  mall: String,             // 商城
  brand: String,            // 品牌
  hotValue: Number,         // 热度值
  salesCount: Number,       // 销量
  rating: Number,           // 评分
  rankDate: Date            // 榜单日期
}
```

## API 接口

### 好价相关
- `GET /api/zhidemai/haojia` - 获取好价列表
- `GET /api/zhidemai/haojia/hot` - 获取热门好价
- `GET /api/zhidemai/haojia/categories` - 获取分类统计
- `POST /api/zhidemai/haojia/refresh` - 刷新好价数据

### 文章相关
- `GET /api/zhidemai/articles` - 获取文章列表
- `GET /api/zhidemai/articles/popular` - 获取热门文章
- `GET /api/zhidemai/articles/elite` - 获取精华文章

### 优惠券相关
- `GET /api/zhidemai/coupons` - 获取优惠券列表
- `GET /api/zhidemai/coupons/hot` - 获取热门优惠券

### 排行榜相关
- `GET /api/zhidemai/rank` - 获取排行榜数据
- `GET /api/zhidemai/rank/categories` - 获取排行榜分类统计

### 搜索相关
- `GET /api/zhidemai/search/haojia` - 搜索好价
- `GET /api/zhidemai/search/articles` - 搜索文章

### 统计相关
- `GET /api/zhidemai/stats` - 获取综合统计数据

## 配置说明

### 环境变量配置
在 `.env` 文件中添加值得买API密钥：

```bash
# 值得买 OpenAPI 配置
ZHIDEMAI_APP_KEY=your_app_key_here
ZHIDEMAI_ACCESS_TOKEN=your_access_token_here
```

> **注意**: 
> - 需要在 [值得买开放平台](https://openapi.zhidemai.com/) 注册并获取 API Key
> - Access Token 用于访问需要授权的接口
> - 当前示例代码使用模拟数据，实际使用时需要配置真实的 API Key

### 数据初始化
运行种子脚本生成模拟数据：

```bash
cd backend
node seedZhidemai.js
```

这将生成：
- 50条好价数据
- 40篇社区文章
- 30张优惠券
- 60条排行榜数据（3个榜单 × 20条）

## 使用示例

### 1. 获取好价列表
```javascript
// 前端调用
const response = await api.get('/zhidemai/haojia', {
  params: {
    page: 1,
    limit: 20,
    category: '数码',
    sort: 'hotValue'
  }
});
```

### 2. 获取热门文章
```javascript
const response = await api.get('/zhidemai/articles/popular', {
  params: { limit: 10 }
});
```

### 3. 搜索商品
```javascript
const response = await api.get('/zhidemai/search/haojia', {
  params: {
    keyword: 'iPhone',
    page: 1,
    limit: 20
  }
});
```

## ZhideMaiClient 使用说明

后端提供了 `ZhideMaiClient` 工具类用于调用值得买API：

```javascript
const ZhideMaiClient = require('./utils/zhideMaiClient');

// 初始化客户端
const client = new ZhideMaiClient(appKey, accessToken);

// 获取好价详情
const haojia = await client.getHaojiaDetail('article_id');

// 获取好价列表
const list = await client.getHaojiaList({
  page: 1,
  limit: 20,
  sort: 'time_sort'
});

// 获取文章详情
const article = await client.getArticleDetail('article_ids');

// 搜索商品
const products = await client.searchProducts('iPhone', {
  page: 1,
  limit: 20
});
```

## 前端组件

### ZhidemaiDeals.vue
好价推荐页面，展示：
- 统计卡片（总数、有效数、平均折扣、平均价格）
- 筛选栏（分类、排序）
- 热门好价TOP10柱状图
- 分类分布饼图
- 好价卡片网格
- 分页器

### ZhidemaiArticles.vue
社区文章页面，展示：
- 类型筛选（文章/视频/晒单/问答）
- 热门/精华筛选按钮
- 热门文章浏览量TOP10柱状图
- 文章卡片列表（含作者信息）
- 分页器

## 数据缓存策略

为减少API调用次数，建议实施以下缓存策略：

1. **数据库缓存**: 将API获取的数据保存到MongoDB，定期更新
2. **定时任务**: 使用 `node-schedule` 定时刷新热门数据
3. **前端缓存**: 使用 Vuex/Pinia 缓存常用数据

## 错误处理

所有API接口都包含错误处理：

```javascript
try {
  const response = await zhideMaiClient.getHaojiaList();
  // 处理成功响应
} catch (error) {
  console.error('值得买API请求失败:', error.message);
  // 返回默认值或错误响应
  res.status(500).json({
    success: false,
    message: '获取数据失败',
    error: error.message
  });
}
```

## 扩展开发

### 添加新的数据类型
1. 在 `models/` 目录创建新的 Mongoose Schema
2. 在 `utils/zhideMaiClient.js` 添加API方法
3. 在 `routes/zhidemai.js` 添加路由
4. 创建对应的前端页面
5. 更新路由配置

### 实时数据更新
可以使用定时任务实现数据自动更新：

```javascript
const schedule = require('node-schedule');

// 每小时更新一次热门好价
schedule.scheduleJob('0 * * * *', async () => {
  console.log('开始更新热门好价...');
  // 调用刷新接口
});
```

## 注意事项

1. **API限流**: 注意值得买API的调用频率限制
2. **数据更新**: 定期清理过期的好价和优惠券数据
3. **图片加载**: 使用图片懒加载优化页面性能
4. **错误处理**: 完善异常处理，提供友好的错误提示
5. **数据验证**: 对API返回数据进行验证，确保数据完整性

## 相关文档

- [值得买 OpenAPI 官方文档](https://openapi.zhidemai.com/)
- [项目主文档](./README.md)
- [数据库文档](./DATABASE.md)
- [快速开始](./QUICKSTART.md)

## 许可证

MIT License
