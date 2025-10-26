const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

// 连接数据库
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use("/api/sales", require("./routes/sales"));
app.use("/api/users", require("./routes/users"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/jd-hotlist", require("./routes/jdHotList"));
app.use("/api/zhidemai", require("./routes/zhidemai"));

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "服务正常运行" });
});

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
});
