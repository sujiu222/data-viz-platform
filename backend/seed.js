const mongoose = require("mongoose");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 引入模型
const Sales = require("./models/Sales");
const CategorySales = require("./models/CategorySales");
const RegionSales = require("./models/RegionSales");
const UserStatistics = require("./models/UserStatistics");
const AgeDistribution = require("./models/AgeDistribution");
const Traffic = require("./models/Traffic");
const Product = require("./models/Product");

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB 连接成功");
  } catch (error) {
    console.error("❌ MongoDB 连接失败:", error.message);
    process.exit(1);
  }
};

// 月度销售数据
const salesData = [
  { month: "1月", value: 3250, year: 2024 },
  { month: "2月", value: 4180, year: 2024 },
  { month: "3月", value: 5240, year: 2024 },
  { month: "4月", value: 4820, year: 2024 },
  { month: "5月", value: 6150, year: 2024 },
  { month: "6月", value: 7200, year: 2024 },
  { month: "7月", value: 6800, year: 2024 },
  { month: "8月", value: 7500, year: 2024 },
  { month: "9月", value: 8200, year: 2024 },
  { month: "10月", value: 9100, year: 2024 },
];

// 分类销售数据
const categorySalesData = [
  { name: "电子产品", value: 35400, description: "各类电子消费品" },
  { name: "服装鞋帽", value: 28600, description: "服饰类商品" },
  { name: "食品饮料", value: 22300, description: "食品及饮料" },
  { name: "家居用品", value: 18900, description: "家居生活用品" },
  { name: "图书音像", value: 12500, description: "图书及音像制品" },
];

// 区域销售数据
const regionSalesData = [
  { region: "华东", sales: 45200, growth: 15.2, year: 2024 },
  { region: "华南", sales: 38600, growth: 12.8, year: 2024 },
  { region: "华北", sales: 32400, growth: 10.5, year: 2024 },
  { region: "西南", sales: 25800, growth: 18.3, year: 2024 },
  { region: "东北", sales: 18700, growth: 8.6, year: 2024 },
];

// 用户统计数据
const userStatisticsData = [
  { date: "2024-01", total: 85200, active: 68160, new: 8520, retention: 80.0 },
  { date: "2024-02", total: 88600, active: 70880, new: 8860, retention: 80.0 },
  { date: "2024-03", total: 92100, active: 73680, new: 9210, retention: 80.0 },
  { date: "2024-04", total: 96500, active: 77200, new: 9650, retention: 80.0 },
  {
    date: "2024-05",
    total: 101200,
    active: 80960,
    new: 10120,
    retention: 80.0,
  },
  {
    date: "2024-06",
    total: 106800,
    active: 85440,
    new: 10680,
    retention: 80.0,
  },
  {
    date: "2024-07",
    total: 112400,
    active: 89920,
    new: 11240,
    retention: 80.0,
  },
  {
    date: "2024-08",
    total: 118200,
    active: 94560,
    new: 11820,
    retention: 80.0,
  },
  {
    date: "2024-09",
    total: 122100,
    active: 97680,
    new: 12210,
    retention: 80.0,
  },
  {
    date: "2024-10",
    total: 125600,
    active: 98400,
    new: 12800,
    retention: 78.3,
  },
];

// 年龄分布数据
const ageDistributionData = [
  { range: "18-25", count: 32500, percentage: 25.9 },
  { range: "26-35", count: 48600, percentage: 38.7 },
  { range: "36-45", count: 28400, percentage: 22.6 },
  { range: "46-55", count: 12100, percentage: 9.6 },
  { range: "55+", count: 4000, percentage: 3.2 },
];

// 流量数据（24小时）
const generateTrafficData = () => {
  const today = new Date().toISOString().split("T")[0];
  const hours = [
    { hour: "00:00", pv: 1200, uv: 850 },
    { hour: "01:00", pv: 980, uv: 720 },
    { hour: "02:00", pv: 650, uv: 480 },
    { hour: "03:00", pv: 420, uv: 310 },
    { hour: "04:00", pv: 580, uv: 420 },
    { hour: "05:00", pv: 920, uv: 680 },
    { hour: "06:00", pv: 1850, uv: 1320 },
    { hour: "07:00", pv: 3200, uv: 2180 },
    { hour: "08:00", pv: 4500, uv: 3100 },
    { hour: "09:00", pv: 5800, uv: 3850 },
    { hour: "10:00", pv: 6200, uv: 4200 },
    { hour: "11:00", pv: 5900, uv: 3950 },
    { hour: "12:00", pv: 5200, uv: 3600 },
    { hour: "13:00", pv: 4800, uv: 3300 },
    { hour: "14:00", pv: 5500, uv: 3700 },
    { hour: "15:00", pv: 6100, uv: 4100 },
    { hour: "16:00", pv: 6800, uv: 4500 },
    { hour: "17:00", pv: 7200, uv: 4800 },
    { hour: "18:00", pv: 6500, uv: 4300 },
    { hour: "19:00", pv: 5800, uv: 3900 },
    { hour: "20:00", pv: 5200, uv: 3500 },
    { hour: "21:00", pv: 4500, uv: 3000 },
    { hour: "22:00", pv: 3200, uv: 2200 },
    { hour: "23:00", pv: 2100, uv: 1450 },
  ];

  return hours.map((item) => ({ ...item, date: today }));
};

// 热门产品数据
const productData = [
  {
    name: "iPhone 15 Pro",
    sales: 2850,
    revenue: 28500000,
    category: "电子产品",
    rank: 1,
  },
  {
    name: "MacBook Air M3",
    sales: 1920,
    revenue: 19200000,
    category: "电子产品",
    rank: 2,
  },
  {
    name: "AirPods Pro",
    sales: 3650,
    revenue: 7300000,
    category: "电子产品",
    rank: 3,
  },
  {
    name: "iPad Pro",
    sales: 1580,
    revenue: 12640000,
    category: "电子产品",
    rank: 4,
  },
  {
    name: "Apple Watch",
    sales: 2240,
    revenue: 8960000,
    category: "电子产品",
    rank: 5,
  },
];

// 导入数据
const importData = async () => {
  try {
    // 清空现有数据
    console.log("🗑️  清空现有数据...");
    await Sales.deleteMany();
    await CategorySales.deleteMany();
    await RegionSales.deleteMany();
    await UserStatistics.deleteMany();
    await AgeDistribution.deleteMany();
    await Traffic.deleteMany();
    await Product.deleteMany();

    // 插入新数据
    console.log("📝 插入销售数据...");
    await Sales.insertMany(salesData);

    console.log("📝 插入分类销售数据...");
    await CategorySales.insertMany(categorySalesData);

    console.log("📝 插入区域销售数据...");
    await RegionSales.insertMany(regionSalesData);

    console.log("📝 插入用户统计数据...");
    await UserStatistics.insertMany(userStatisticsData);

    console.log("📝 插入年龄分布数据...");
    await AgeDistribution.insertMany(ageDistributionData);

    console.log("📝 插入流量数据...");
    await Traffic.insertMany(generateTrafficData());

    console.log("📝 插入产品数据...");
    await Product.insertMany(productData);

    console.log("✅ 数据导入成功！");
    process.exit(0);
  } catch (error) {
    console.error("❌ 数据导入失败:", error.message);
    process.exit(1);
  }
};

// 删除数据
const destroyData = async () => {
  try {
    console.log("🗑️  删除所有数据...");
    await Sales.deleteMany();
    await CategorySales.deleteMany();
    await RegionSales.deleteMany();
    await UserStatistics.deleteMany();
    await AgeDistribution.deleteMany();
    await Traffic.deleteMany();
    await Product.deleteMany();

    console.log("✅ 数据删除成功！");
    process.exit(0);
  } catch (error) {
    console.error("❌ 数据删除失败:", error.message);
    process.exit(1);
  }
};

// 执行脚本
if (process.argv[2] === "-d") {
  connectDB().then(destroyData);
} else {
  connectDB().then(importData);
}
