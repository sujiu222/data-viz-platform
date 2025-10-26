# 数据可视化平台

一个基于 **Vue 3 + Node.js + Express + ECharts** 的大型数据可视化平台，提供完整的前后端解决方案。

## 🎯 项目简介

本项目是一个企业级数据可视化平台，包含：

- 📊 实时数据仪表板
- 📈 销售数据分析
- 👥 用户数据统计
- 📉 流量数据分析
- 🛒 京东热榜爬虫
- 🎁 值得买好价推荐（新增）
- 📰 值得买社区文章（新增）

## 🏗️ 技术栈

### 后端

- **Node.js** - 运行环境
- **Express** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - ODM
- **Axios** - HTTP 客户端（爬虫）
- **Cheerio** - HTML 解析（爬虫）
- **CORS** - 跨域处理
- **dotenv** - 环境变量管理

### 前端

- **Vue 3** - 渐进式框架
- **Vue Router** - 路由管理
- **Vite** - 构建工具
- **ECharts** - 数据可视化
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端
- **SCSS** - CSS 预处理器

## 📦 项目结构

```
data-viz-platform/
├── backend/                 # 后端项目
│   ├── routes/             # API 路由
│   │   ├── sales.js        # 销售数据接口
│   │   ├── users.js        # 用户数据接口
│   │   └── analytics.js    # 分析数据接口
│   ├── server.js           # 服务器入口
│   ├── package.json        # 后端依赖
│   └── .env                # 环境配置
│
└── frontend/               # 前端项目
    ├── src/
    │   ├── views/          # 页面组件
    │   │   ├── Dashboard.vue    # 仪表板
    │   │   ├── Sales.vue        # 销售数据
    │   │   ├── Users.vue        # 用户数据
    │   │   └── Analytics.vue    # 数据分析
    │   ├── components/     # 通用组件
    │   │   └── Layout.vue       # 布局组件
    │   ├── api/            # API 接口
    │   ├── router/         # 路由配置
    │   ├── assets/         # 静态资源
    │   ├── App.vue         # 根组件
    │   └── main.js         # 入口文件
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm 或 yarn
- MongoDB >= 4.x（本地或 MongoDB Atlas）

### 安装依赖

**后端：**

```bash
cd backend
npm install
```

**前端：**

```bash
cd frontend
npm install
```

### 配置数据库

**选项 1: 使用本地 MongoDB**

1. 安装并启动 MongoDB
2. 使用默认配置（已在 `.env` 中配置）

**选项 2: 使用 MongoDB Atlas（推荐）**

1. 访问 https://www.mongodb.com/cloud/atlas
2. 创建免费集群
3. 获取连接字符串
4. 更新 `backend/.env` 中的 `MONGODB_URI`

### 导入测试数据

```bash
cd backend
npm run seed
```

### 启动项目

**1. 启动后端服务（端口 5000）：**

```bash
cd backend
npm start
# 或开发模式
npm run dev
```

**2. 启动前端服务（端口 3000）：**

```bash
cd frontend
npm run dev
```

**3. 访问应用：**
打开浏览器访问 http://localhost:3000

## 📊 功能模块

### 1. 数据仪表板

- 实时在线用户统计
- 今日访问量、订单量、营收
- 24 小时流量趋势图
- 热门产品排行

### 2. 销售数据

- 月度销售趋势分析
- 品类销售分布（饼图）
- 区域销售排行（柱状图+折线图）

### 3. 用户数据

- 用户总数、活跃用户、新增用户统计
- 用户增长趋势
- 年龄分布分析

### 4. 数据分析

- 24 小时完整流量分析
- PV/UV 对比图表

### 5. 京东热榜（新增 🆕）

- 实时爬取京东热门商品
- TOP 10 排行榜可视化
- 分类分布统计
- 支持分类筛选
- 手动刷新数据
- 查看商品详情

## 🔌 API 接口

### 销售数据

- `GET /api/sales/monthly` - 月度销售数据
- `GET /api/sales/category` - 分类销售数据
- `GET /api/sales/region` - 区域销售数据
- `GET /api/sales/all` - 所有销售数据

### 用户数据

- `GET /api/users/statistics` - 用户统计数据
- `GET /api/users/growth` - 用户增长数据
- `GET /api/users/age-distribution` - 年龄分布

### 分析数据

- `GET /api/analytics/realtime` - 实时数据
- `GET /api/analytics/traffic` - 流量数据
- `GET /api/analytics/top-products` - 热门产品
- `GET /api/analytics/dashboard` - 仪表板数据

### 京东热榜（新增 🆕）

- `GET /api/jd-hotlist` - 获取热榜列表
- `GET /api/jd-hotlist?category=数码` - 按分类筛选
- `GET /api/jd-hotlist/top?limit=10` - 获取TOP商品
- `GET /api/jd-hotlist/categories` - 获取分类统计
- `POST /api/jd-hotlist/refresh` - 手动刷新数据
- `GET /api/jd-hotlist/last-update` - 获取最后更新时间

## 🎨 界面预览

### 主要功能

- 响应式布局，适配不同屏幕
- 侧边栏导航
- 统计卡片展示关键指标
- 多种图表类型（折线图、柱状图、饼图、面积图）
- 图表自适应窗口大小
- 实时数据自动刷新

## 📝 开发说明

### 添加新的数据接口

1. 在 `backend/routes/` 创建新的路由文件
2. 在 `backend/server.js` 注册路由
3. 在 `frontend/src/api/index.js` 添加 API 方法

### 添加新的可视化页面

1. 在 `frontend/src/views/` 创建页面组件
2. 在 `frontend/src/router/index.js` 配置路由
3. 使用 ECharts 创建图表

### ECharts 图表示例

```javascript
import * as echarts from "echarts";

const chart = echarts.init(container);
chart.setOption({
  // 图表配置
});
```

## 🔧 配置说明

### 后端配置（.env）

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/data-viz
NODE_ENV=development
```

### 前端代理配置

在 `vite.config.js` 中配置了代理，将 `/api` 请求转发到后端服务。

## 📈 数据说明

项目使用 **MongoDB** 数据库存储真实数据：

### 数据库集合

- **Sales** - 月度销售记录
- **CategorySales** - 品类销售统计
- **RegionSales** - 区域销售数据
- **UserStatistics** - 用户统计信息
- **AgeDistribution** - 用户年龄分布
- **Traffic** - 24 小时流量数据
- **Product** - 产品销售排行

### 数据管理

```bash
# 导入测试数据
npm run seed

# 清空数据库
npm run seed:destroy
```

详细数据库文档请查看：[backend/DATABASE.md](backend/DATABASE.md)

## 🛠️ 扩展建议

1. **数据库集成**：添加 MongoDB 或 MySQL 数据库
2. **用户认证**：实现登录、权限管理
3. **数据导出**：支持导出 Excel、PDF
4. **更多图表**：添加地图、雷达图、仪表盘等
5. **实时推送**：使用 WebSocket 实现数据实时更新
6. **数据筛选**：添加日期范围、条件筛选功能

## 📄 许可证

MIT License

## 👨‍💻 作者

数据可视化平台团队

---

**注意**：这是一个演示项目，使用了模拟数据。生产环境请替换为真实数据源并添加适当的安全措施。
