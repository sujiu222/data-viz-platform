# 🚀 快速启动指南（使用真实数据库）

## 步骤 1: 准备 MongoDB

### 方式 A: 本地 MongoDB（快速）

1. **下载并安装 MongoDB Community Server**

   - 访问：https://www.mongodb.com/try/download/community
   - 下载并安装适合你系统的版本

2. **启动 MongoDB 服务**

   ```powershell
   # Windows - 使用管理员权限
   net start MongoDB

   # 验证是否运行
   mongosh --version
   ```

### 方式 B: MongoDB Atlas（推荐，云端）

1. **注册并创建集群**

   - 访问：https://www.mongodb.com/cloud/atlas
   - 注册免费账号
   - 创建免费 M0 集群（选择离你最近的区域）

2. **配置访问**

   - 添加 IP 地址到白名单（可以先添加 `0.0.0.0/0` 允许所有 IP）
   - 创建数据库用户（记住用户名和密码）

3. **获取连接字符串**

   - 点击 "Connect" -> "Connect your application"
   - 复制连接字符串
   - 格式: `mongodb+srv://<username>:<password>@cluster.mongodb.net/data-viz`

4. **更新配置**
   编辑 `backend/.env`：
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/data-viz
   ```

## 步骤 2: 安装依赖

```powershell
# 进入后端目录
cd d:\code\data-viz-platform\backend

# 安装依赖
npm install

# 进入前端目录
cd ..\frontend

# 安装依赖
npm install
```

## 步骤 3: 导入测试数据

```powershell
cd ..\backend
npm run seed
```

你应该看到：

```
✅ MongoDB 连接成功
🗑️  清空现有数据...
📝 插入销售数据...
📝 插入分类销售数据...
📝 插入区域销售数据...
📝 插入用户统计数据...
📝 插入年龄分布数据...
📝 插入流量数据...
📝 插入产品数据...
✅ 数据导入成功！
```

## 步骤 4: 启动应用

### 终端 1 - 启动后端

```powershell
cd d:\code\data-viz-platform\backend
npm start
```

你应该看到：

```
✅ MongoDB 连接成功: localhost
🚀 服务器运行在端口 5000
```

### 终端 2 - 启动前端

```powershell
cd d:\code\data-viz-platform\frontend
npm run dev
```

你应该看到：

```
VITE v4.4.9  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## 步骤 5: 访问应用

打开浏览器访问：**http://localhost:3000**

## 📊 验证数据

### 方式 1: 通过 API

访问：http://localhost:5000/api/sales/monthly

应该看到 JSON 数据：

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "month": "1月",
      "value": 3250,
      "year": 2024
    }
    ...
  ]
}
```

### 方式 2: 通过前端界面

1. 打开 http://localhost:3000
2. 查看数据仪表板
3. 点击左侧菜单切换不同页面
4. 所有图表应显示数据

## 🔧 常见问题

### ❌ MongoDB 连接失败

**错误信息**: `MongooseServerSelectionError`

**解决方案**:

1. 检查 MongoDB 服务是否运行

   ```powershell
   # 查看服务状态
   Get-Service -Name MongoDB

   # 启动服务
   net start MongoDB
   ```

2. 验证 `.env` 配置是否正确

3. 如使用 Atlas，检查：
   - IP 白名单
   - 用户名密码
   - 网络连接

### ❌ 端口被占用

**错误信息**: `Port 5000 is already in use`

**解决方案**:
修改 `backend/.env` 中的 `PORT=5000` 为其他端口（如 5001）

### ❌ 前端无法获取数据

**解决方案**:

1. 确认后端已启动并运行在 5000 端口
2. 访问 http://localhost:5000/health 检查后端状态
3. 打开浏览器开发者工具查看网络请求

## 📝 数据管理命令

```powershell
# 导入数据（会先清空再导入）
npm run seed

# 清空所有数据
npm run seed:destroy

# 开发模式（代码修改自动重启）
npm run dev
```

## 🎯 下一步

数据库已配置完成！你可以：

1. **修改数据**: 编辑 `backend/seed.js` 修改测试数据
2. **添加接口**: 在 `backend/routes/` 添加新的 API
3. **创建模型**: 在 `backend/models/` 创建新的数据模型
4. **自定义图表**: 修改前端页面展示更多数据

## 📚 相关文档

- [完整 README](../README.md)
- [数据库详细文档](DATABASE.md)
- [MongoDB 官方文档](https://docs.mongodb.com/)
- [Mongoose 文档](https://mongoosejs.com/)

---

**祝你使用愉快！** 🎉

如有问题，请检查：

1. MongoDB 是否正常运行
2. 依赖是否完整安装
3. 端口是否被占用
4. 环境变量配置是否正确
