const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ZhidemaiHaojia = require('./models/ZhidemaiHaojia');
const ZhidemaiArticle = require('./models/ZhidemaiArticle');
const ZhidemaiCoupon = require('./models/ZhidemaiCoupon');
const ZhidemaiRank = require('./models/ZhidemaiRank');

dotenv.config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/data-viz-platform')
  .then(() => console.log('✅ MongoDB 连接成功'))
  .catch(err => {
    console.error('❌ MongoDB 连接失败:', err);
    process.exit(1);
  });

// 生成模拟数据
const generateZhideMaiData = async () => {
  try {
    console.log('开始生成值得买模拟数据...');
    
    // 清空现有数据
    await ZhidemaiHaojia.deleteMany({});
    await ZhidemaiArticle.deleteMany({});
    await ZhidemaiCoupon.deleteMany({});
    await ZhidemaiRank.deleteMany({});
    console.log('✅ 已清空现有数据');
    
    // 1. 生成好价数据
    const categories = ['数码', '家电', '食品', '服饰', '美妆', '图书', '运动', '家居'];
    const malls = ['京东', '天猫', '拼多多', '苏宁', '国美', '唯品会'];
    
    const haojiaData = [];
    for (let i = 0; i < 50; i++) {
      const originalPrice = Math.floor(Math.random() * 2000) + 100;
      const discount = Math.floor(Math.random() * 50) + 10; // 10-60% 折扣
      const price = Math.floor(originalPrice * (100 - discount) / 100);
      const publishTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // 最近7天
      const expireTime = new Date(publishTime.getTime() + (Math.random() * 3 + 1) * 24 * 60 * 60 * 1000); // 1-4天后过期
      
      haojiaData.push({
        articleId: `haojia_${i + 1}`,
        title: `【限时优惠】${categories[i % categories.length]}好物推荐 ${i + 1}`,
        price,
        originalPrice,
        discount,
        imageUrl: `https://picsum.photos/seed/haojia${i}/400/300`,
        productUrl: `https://example.com/product/${i}`,
        description: `超值好价！原价 ¥${originalPrice}，现价 ¥${price}，限时抢购！`,
        category: categories[i % categories.length],
        mall: malls[i % malls.length],
        hotValue: Math.floor(Math.random() * 10000),
        commentCount: Math.floor(Math.random() * 500),
        likeCount: Math.floor(Math.random() * 1000),
        favoriteCount: Math.floor(Math.random() * 800),
        tags: ['限时优惠', '热卖', categories[i % categories.length]],
        isExpired: expireTime < new Date(),
        publishTime,
        expireTime
      });
    }
    await ZhidemaiHaojia.insertMany(haojiaData);
    console.log(`✅ 已生成 ${haojiaData.length} 条好价数据`);
    
    // 2. 生成社区文章数据
    const articleTypes = ['article', 'video', 'review', 'qa'];
    const authors = [
      { id: 'author1', name: '科技达人小王', avatar: 'https://picsum.photos/seed/author1/100/100', level: 5 },
      { id: 'author2', name: '省钱小能手', avatar: 'https://picsum.photos/seed/author2/100/100', level: 4 },
      { id: 'author3', name: '数码评测君', avatar: 'https://picsum.photos/seed/author3/100/100', level: 6 },
      { id: 'author4', name: '生活家居达人', avatar: 'https://picsum.photos/seed/author4/100/100', level: 3 }
    ];
    
    const articleData = [];
    for (let i = 0; i < 40; i++) {
      const author = authors[i % authors.length];
      const category = categories[i % categories.length];
      const type = articleTypes[i % articleTypes.length];
      
      articleData.push({
        articleId: `article_${i + 1}`,
        title: `${category}选购指南 - ${i + 1}`,
        author,
        content: `这是一篇关于${category}的详细评测文章。包含了产品介绍、使用体验、优缺点分析等内容...`,
        summary: `${category}选购技巧和经验分享`,
        coverImage: `https://picsum.photos/seed/article${i}/800/450`,
        images: [
          `https://picsum.photos/seed/img${i}1/600/400`,
          `https://picsum.photos/seed/img${i}2/600/400`
        ],
        category: {
          id: `cat_${i % categories.length}`,
          name: category
        },
        tags: [category, '选购指南', '评测'],
        type,
        viewCount: Math.floor(Math.random() * 50000),
        commentCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 5000),
        favoriteCount: Math.floor(Math.random() * 2000),
        shareCount: Math.floor(Math.random() * 500),
        isElite: Math.random() > 0.7,
        isTop: Math.random() > 0.9,
        publishTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 最近30天
      });
    }
    await ZhidemaiArticle.insertMany(articleData);
    console.log(`✅ 已生成 ${articleData.length} 条文章数据`);
    
    // 3. 生成优惠券数据
    const couponData = [];
    for (let i = 0; i < 30; i++) {
      const amount = [5, 10, 20, 30, 50, 100][Math.floor(Math.random() * 6)];
      const threshold = amount * (Math.random() * 5 + 5); // 门槛是券额的5-10倍
      const startTime = new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + (Math.random() * 20 + 10) * 24 * 60 * 60 * 1000); // 10-30天有效期
      
      couponData.push({
        couponId: `coupon_${i + 1}`,
        name: `${malls[i % malls.length]}满${threshold}减${amount}优惠券`,
        mall: {
          id: i % malls.length,
          name: malls[i % malls.length]
        },
        amount,
        threshold,
        rebate: Math.floor(amount * 0.1), // 10%返利
        type: ['full_reduction', 'discount', 'cashback'][Math.floor(Math.random() * 3)],
        url: `https://example.com/coupon/${i}`,
        code: `CODE${String(i + 1).padStart(4, '0')}`,
        category: categories[i % categories.length],
        description: `全场通用，满${threshold}元可用`,
        receivedCount: Math.floor(Math.random() * 10000),
        usedCount: Math.floor(Math.random() * 5000),
        stock: Math.floor(Math.random() * 50000) + 10000,
        limitPerUser: [1, 2, 3, 5][Math.floor(Math.random() * 4)],
        startTime,
        endTime,
        isExpired: endTime < new Date(),
        isActive: true
      });
    }
    await ZhidemaiCoupon.insertMany(couponData);
    console.log(`✅ 已生成 ${couponData.length} 条优惠券数据`);
    
    // 4. 生成排行榜数据
    const rankTypes = ['hot', 'new', 'sale'];
    const brands = ['Apple', '华为', '小米', '索尼', '三星', '联想', '戴尔', '海尔', '美的', '格力'];
    
    const rankData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const rankType of rankTypes) {
      for (let i = 0; i < 20; i++) {
        const price = Math.floor(Math.random() * 5000) + 500;
        
        rankData.push({
          productId: `product_${rankType}_${i + 1}`,
          rankType,
          rank: i + 1,
          title: `${brands[i % brands.length]} ${categories[i % categories.length]}产品 TOP${i + 1}`,
          price,
          originalPrice: Math.floor(price * (1 + Math.random() * 0.5)),
          imageUrl: `https://picsum.photos/seed/rank${rankType}${i}/400/400`,
          productUrl: `https://example.com/rank/${rankType}/${i}`,
          category: categories[i % categories.length],
          mall: malls[i % malls.length],
          brand: brands[i % brands.length],
          hotValue: rankType === 'hot' ? 10000 - i * 100 : Math.floor(Math.random() * 10000),
          salesCount: rankType === 'sale' ? 50000 - i * 1000 : Math.floor(Math.random() * 50000),
          reviewCount: Math.floor(Math.random() * 10000),
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
          tags: [rankType === 'hot' ? '热销' : rankType === 'new' ? '新品' : '畅销', brands[i % brands.length]],
          rankDate: today
        });
      }
    }
    await ZhidemaiRank.insertMany(rankData);
    console.log(`✅ 已生成 ${rankData.length} 条排行榜数据`);
    
    console.log('\n🎉 值得买模拟数据生成完成！');
    console.log('-----------------------------------');
    console.log(`好价数据: ${haojiaData.length} 条`);
    console.log(`文章数据: ${articleData.length} 条`);
    console.log(`优惠券数据: ${couponData.length} 条`);
    console.log(`排行榜数据: ${rankData.length} 条`);
    console.log('-----------------------------------\n');
    
  } catch (error) {
    console.error('❌ 生成数据失败:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 数据库连接已关闭');
  }
};

// 执行数据生成
generateZhideMaiData();
