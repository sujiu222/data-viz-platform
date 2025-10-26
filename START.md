# 快速启动指南

## 一键启动（Windows PowerShell）

### 方式一：分别启动前后端

**终端 1 - 启动后端：**

```powershell
cd backend
npm install
npm start
```

**终端 2 - 启动前端：**

```powershell
cd frontend
npm install
npm run dev
```

### 方式二：并行启动（需先安装依赖）

```powershell
# 安装后端依赖
cd backend; npm install; cd ..

# 安装前端依赖
cd frontend; npm install; cd ..

# 启动后端（后台运行）
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# 启动前端
cd frontend; npm run dev
```

## 访问应用

前端：http://localhost:3000
后端：http://localhost:5000

## 停止服务

按 `Ctrl + C` 停止当前服务
