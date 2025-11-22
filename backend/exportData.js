const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Import all models
const AgeDistribution = require("./models/AgeDistribution");
const CategorySales = require("./models/CategorySales");
const JDHotList = require("./models/JDHotList");
const Product = require("./models/Product");
const RegionSales = require("./models/RegionSales");
const Sales = require("./models/Sales");
const Traffic = require("./models/Traffic");
const UserStatistics = require("./models/UserStatistics");
const ZhidemaiArticle = require("./models/ZhidemaiArticle");
const ZhidemaiCoupon = require("./models/ZhidemaiCoupon");
const ZhidemaiHaojia = require("./models/ZhidemaiHaojia");
const ZhidemaiRank = require("./models/ZhidemaiRank");

const models = {
  AgeDistribution,
  CategorySales,
  JDHotList,
  Product,
  RegionSales,
  Sales,
  Traffic,
  UserStatistics,
  ZhidemaiArticle,
  ZhidemaiCoupon,
  ZhidemaiHaojia,
  ZhidemaiRank,
};

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/data-viz-platform",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const exportData = async () => {
  await connectDB();

  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  try {
    for (const [modelName, Model] of Object.entries(models)) {
      console.log(`Exporting ${modelName}...`);
      const data = await Model.find({});
      fs.writeFileSync(
        path.join(dataDir, `${modelName}.json`),
        JSON.stringify(data, null, 2)
      );
      console.log(`✅ ${modelName} exported (${data.length} records)`);
    }
    console.log("🎉 All data exported successfully!");
  } catch (error) {
    console.error("❌ Export failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

exportData();
