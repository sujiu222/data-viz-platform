# 后端数据库使用说明

## 📚 数据库架构

项目使用 **MongoDB** 作为数据库，包含以下集合（Collections）：

### 数据模型

1. **Sales** - 月度销售数据

   - month: 月份
   - value: 销售额
   - year: 年份

2. **CategorySales** - 品类销售数据

   - name: 品类名称
   - value: 销售额
   - description: 描述

3. **RegionSales** - 区域销售数据

   - region: 区域名称
   - sales: 销售额
   - growth: 增长率
   - year: 年份

4. **UserStatistics** - 用户统计数据

   - date: 日期
   - total: 总用户数
   - active: 活跃用户数
   - new: 新增用户数
   - retention: 留存率

5. **AgeDistribution** - 年龄分布

   - range: 年龄段
   - count: 人数
   - percentage: 百分比

6. **Traffic** - 流量数据

   - date: 日期
   - hour: 小时
   - pv: 页面浏览量
   - uv: 独立访客数

7. **Product** - 产品数据
   - name: 产品名称
   - sales: 销量
   - revenue: 营收
   - category: 分类
   - rank: 排名

## 🚀 快速开始

### 1. 安装 MongoDB

**选项 A: 本地安装 MongoDB**

- 下载：https://www.mongodb.com/try/download/community
- 安装后启动 MongoDB 服务

**选项 B: 使用 MongoDB Atlas（云数据库）**

- 注册：https://www.mongodb.com/cloud/atlas
- 创建免费集群
- 获取连接字符串

### 2. 配置数据库连接

编辑 `.env` 文件：

```env
PORT=5000
# 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/data-viz

# 或使用 MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/data-viz

NODE_ENV=development
```

### 3. 安装依赖

```bash
npm install
```

### 4. 导入种子数据

```bash
# 导入测试数据
npm run seed

# 或直接运行
node seed.js
```

### 5. 启动服务器

```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

## 📋 NPM 脚本命令

```bash
npm start              # 启动服务器
npm run dev            # 开发模式（nodemon）
npm run seed           # 导入种子数据
npm run seed:destroy   # 删除所有数据
```

## 🔌 API 端点

### 销售数据 API

- `GET /api/sales/monthly?year=2024` - 获取月度销售数据
- `GET /api/sales/category` - 获取分类销售数据
- `GET /api/sales/region` - 获取区域销售数据
- `GET /api/sales/all?year=2024` - 获取所有销售数据

### 用户数据 API

- `GET /api/users/statistics` - 获取用户统计数据
- `GET /api/users/growth` - 获取用户增长数据
- `GET /api/users/age-distribution` - 获取年龄分布

### 分析数据 API

- `GET /api/analytics/realtime` - 获取实时数据
- `GET /api/analytics/traffic?date=2024-10-26` - 获取流量数据
- `GET /api/analytics/top-products?limit=5` - 获取热门产品
- `GET /api/analytics/dashboard` - 获取仪表板数据

### 健康检查

- `GET /health` - 服务器健康检查

## 🗄️ 数据库操作示例

### 使用 MongoDB Shell

```bash
# 连接数据库
mongosh mongodb://localhost:27017/data-viz

# 查看所有集合
show collections

# 查询销售数据
db.sales.find()

# 查询用户统计
db.userstatistics.find().sort({date: -1}).limit(1)

# 统计文档数量
db.sales.countDocuments()
```

### 使用 Mongoose（代码中）

```javascript
const Sales = require("./models/Sales");

// 查询
const sales = await Sales.find({ year: 2024 });

// 创建
const newSale = await Sales.create({
  month: "11月",
  value: 9500,
  year: 2024,
});

// 更新
await Sales.updateOne({ month: "10月", year: 2024 }, { value: 10000 });

// 删除
await Sales.deleteOne({ month: "1月", year: 2023 });
```

## 🔧 故障排除

### MongoDB 连接失败

**问题**: `MongooseServerSelectionError: connect ECONNREFUSED`

**解决方案**:

1. 确保 MongoDB 服务正在运行

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

2. 检查 `.env` 中的连接字符串是否正确

3. 如使用 MongoDB Atlas，确保：
   - IP 地址已添加到白名单
   - 用户名和密码正确
   - 网络连接正常

### 数据未显示

**解决方案**:

1. 确认已运行种子脚本：

   ```bash
   npm run seed
   ```

2. 检查数据是否导入成功：
   ```bash
   mongosh mongodb://localhost:27017/data-viz
   db.sales.find()
   ```

### 端口被占用

**解决方案**:
修改 `.env` 文件中的 `PORT` 值

## 📊 数据结构示例

### Sales 示例

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "month": "1月",
  "value": 3250,
  "year": 2024,
  "createdAt": "2024-10-26T10:00:00.000Z",
  "updatedAt": "2024-10-26T10:00:00.000Z"
}
```

### Traffic 示例

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "date": "2024-10-26",
  "hour": "09:00",
  "pv": 5800,
  "uv": 3850,
  "createdAt": "2024-10-26T09:00:00.000Z"
}
```

## 🔐 生产环境建议

1. **环境变量**: 使用环境变量管理敏感信息
2. **连接池**: 已在 mongoose 中自动配置
3. **索引优化**: 模型中已添加常用查询索引
4. **错误处理**: API 中已包含完整错误处理
5. **数据验证**: 使用 Mongoose Schema 验证
6. **备份**: 定期备份 MongoDB 数据

## 📖 扩展阅读

- [Mongoose 官方文档](https://mongoosejs.com/)
- [MongoDB 官方文档](https://docs.mongodb.com/)
- [Express.js 指南](https://expressjs.com/)
