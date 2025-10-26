# 京东热榜爬虫使用指南

## 🎯 功能介绍

本项目集成了京东热榜爬虫功能，可以自动抓取京东热门商品数据并进行可视化展示。

## 📦 已安装依赖

```json
{
  "axios": "^1.5.0",        // HTTP 请求库
  "cheerio": "^1.0.0-rc.12", // HTML 解析库
  "node-schedule": "^2.1.1"   // 定时任务（可选）
}
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 手动运行爬虫

```bash
# 运行爬虫并保存到数据库
npm run crawl:jd

# 或直接运行
node crawlers/jdHotList.js
```

### 3. 启动服务

```bash
# 启动后端
npm start

# 启动前端（另一个终端）
cd ../frontend
npm run dev
```

### 4. 访问京东热榜页面

打开浏览器访问：http://localhost:3000/jd-hotlist

## 📊 API 接口

### 1. 获取热榜列表
```
GET /api/jd-hotlist
GET /api/jd-hotlist?category=数码
GET /api/jd-hotlist?limit=10
```

### 2. 获取TOP商品
```
GET /api/jd-hotlist/top?limit=10
```

### 3. 获取分类统计
```
GET /api/jd-hotlist/categories
```

### 4. 手动刷新数据
```
POST /api/jd-hotlist/refresh
```

### 5. 获取最后更新时间
```
GET /api/jd-hotlist/last-update
```

## 🔧 爬虫方案说明

项目实现了多种爬虫方案，自动降级：

### 方案1: 京东 API（推荐）
- 直接调用京东公开的热搜 API
- 速度快，稳定性高
- 可能需要定期更新接口地址

### 方案2: 网页爬取
- 使用 cheerio 解析京东首页
- 提取热门推荐商品
- 可能受页面结构变化影响

### 方案3: 模拟数据
- 当前两种方案都失败时使用
- 生成随机热榜数据用于演示
- 保证系统正常运行

## 📝 数据模型

```javascript
{
  rank: Number,        // 排名
  title: String,       // 商品标题
  price: String,       // 价格
  image: String,       // 图片URL
  url: String,         // 商品链接
  category: String,    // 分类
  hotValue: String,    // 热度值
  crawlTime: Date      // 爬取时间
}
```

## 🎨 前端功能

### 页面特性
- ✅ 热榜数据表格展示
- ✅ TOP 10 排行榜图表
- ✅ 分类分布饼图
- ✅ 分类筛选功能
- ✅ 手动刷新按钮
- ✅ 最后更新时间显示
- ✅ 响应式布局

### 操作说明
1. **查看热榜**：自动加载最新数据
2. **筛选分类**：选择分类下拉框
3. **刷新数据**：点击"刷新数据"按钮重新爬取
4. **查看详情**：点击表格中的"查看"按钮

## ⚙️ 定时任务（可选）

如果想要定时自动更新热榜数据，可以在 `server.js` 中添加：

```javascript
const schedule = require('node-schedule');
const { crawlJDHotList } = require('./crawlers/jdHotList');
const JDHotList = require('./models/JDHotList');

// 每小时更新一次
schedule.scheduleJob('0 * * * *', async () => {
  console.log('🕐 定时更新京东热榜...');
  try {
    const hotList = await crawlJDHotList();
    if (hotList.length > 0) {
      await JDHotList.deleteMany({});
      await JDHotList.insertMany(hotList);
      console.log('✅ 热榜更新成功');
    }
  } catch (error) {
    console.error('❌ 定时更新失败:', error);
  }
});
```

## 🔒 注意事项

### 1. 反爬虫策略
京东有反爬虫机制，建议：
- 控制请求频率
- 设置合理的 User-Agent
- 使用代理IP（高频场景）
- 遵守 robots.txt

### 2. 数据合规
- 仅用于学习和个人项目
- 不得用于商业用途
- 尊重网站服务条款

### 3. 错误处理
爬虫已实现完整的错误处理：
- API 失败自动降级
- 超时自动重试
- 失败返回模拟数据

## 🐛 常见问题

### Q1: 爬虫一直返回模拟数据？
**A**: 可能原因：
1. 京东 API 地址变更
2. 网络连接问题
3. 被反爬虫限制

**解决方案**：
- 检查网络连接
- 更新 API 地址
- 添加代理配置

### Q2: 数据更新不及时？
**A**: 
- 手动点击"刷新数据"按钮
- 或配置定时任务自动更新

### Q3: 前端显示不正常？
**A**: 
1. 检查后端服务是否启动
2. 访问 http://localhost:5000/api/jd-hotlist 验证接口
3. 查看浏览器控制台错误信息

## 📈 扩展建议

### 1. 增加更多电商平台
- 淘宝热榜
- 拼多多榜单
- 天猫榜单

### 2. 数据分析功能
- 价格趋势分析
- 热度变化追踪
- 商品对比功能

### 3. 通知功能
- 热榜变化提醒
- 价格波动通知
- 邮件/微信推送

## 📚 相关文档

- [项目主 README](../README.md)
- [数据库文档](DATABASE.md)
- [快速开始指南](../QUICKSTART.md)

## 💡 测试命令

```bash
# 测试爬虫
npm run crawl:jd

# 测试API（需先启动服务）
curl http://localhost:5000/api/jd-hotlist

# 手动刷新
curl -X POST http://localhost:5000/api/jd-hotlist/refresh
```

---

**祝你使用愉快！** 🎉

有问题欢迎反馈！
