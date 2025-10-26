# 后端 API 服务

## 启动说明

1. 安装依赖：

```bash
npm install
```

2. 启动服务：

```bash
npm start
```

开发模式（使用 nodemon 自动重启）：

```bash
npm run dev
```

## 端口

默认端口：5000

可在 `.env` 文件中修改配置

## API 路由

- `/api/sales/*` - 销售数据接口
- `/api/users/*` - 用户数据接口
- `/api/analytics/*` - 分析数据接口
- `/health` - 健康检查接口
