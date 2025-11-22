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

const importData = async () => {
  await connectDB();

  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    console.error(
      "❌ Data directory not found. Please run exportData.js first or ensure backend/data exists."
    );
    process.exit(1);
  }

  try {
    for (const [modelName, Model] of Object.entries(models)) {
      const filePath = path.join(dataDir, `${modelName}.json`);
      if (fs.existsSync(filePath)) {
        console.log(`Importing ${modelName}...`);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        // Clear existing data
        await Model.deleteMany({});

        // Insert new data
        if (data.length > 0) {
          await Model.insertMany(data);
        }
        console.log(`✅ ${modelName} imported (${data.length} records)`);
      } else {
        console.log(`⚠️  ${modelName}.json not found, skipping.`);
      }
    }
    console.log("🎉 All data imported successfully!");
  } catch (error) {
    console.error("❌ Import failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

importData();
