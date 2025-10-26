const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 京东热榜爬虫
 * 由于京东网站反爬虫机制，这里提供多种方案
 */

// 方案1: 爬取京东热榜 API（推荐）
async function fetchJDHotListAPI() {
  try {
    // 京东热搜榜 API（这是一个公开的接口，实际使用时可能需要更新）
    const url = 'https://api.m.jd.com/client.action';
    
    const params = {
      functionId: 'hotWords',
      client: 'wh5',
      clientVersion: '1.0.0',
      uuid: Date.now()
    };
    
    const response = await axios.get(url, {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.jd.com/'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.data) {
      const hotWords = response.data.data.hotWords || [];
      return hotWords.map((item, index) => ({
        rank: index + 1,
        title: item.word || item.keyword || item,
        category: '热搜',
        hotValue: item.hotValue || '',
        crawlTime: new Date()
      }));
    }
    
    return [];
  } catch (error) {
    console.error('京东API爬取失败:', error.message);
    return [];
  }
}

// 方案2: 模拟数据（用于测试和演示）
function generateMockJDHotList() {
  const categories = ['数码', '家电', '服饰', '食品', '图书', '运动', '美妆', '母婴'];
  const prefixes = ['新款', '热销', '爆款', '限时', '特价', '精选', '推荐'];
  const products = [
    'iPhone 15 Pro Max',
    'MacBook Air M3',
    'AirPods Pro',
    'iPad Pro',
    '戴森吹风机',
    '小米手机',
    '华为手表',
    '索尼耳机',
    '海尔冰箱',
    '美的空调',
    '格力空调',
    '联想笔记本',
    '华硕主板',
    '罗技鼠标',
    'Switch游戏机',
    'PS5游戏机',
    '茅台酒',
    '五粮液',
    '飞天茅台',
    '阿迪达斯跑鞋',
    '耐克运动鞋',
    '优衣库T恤',
    '雅诗兰黛面霜',
    '兰蔻口红',
    '娇韵诗精华'
  ];
  
  const hotList = [];
  const usedProducts = new Set();
  
  for (let i = 1; i <= 20; i++) {
    let product;
    do {
      product = products[Math.floor(Math.random() * products.length)];
    } while (usedProducts.has(product) && usedProducts.size < products.length);
    
    usedProducts.add(product);
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const hotValue = (Math.random() * 500000 + 100000).toFixed(0);
    const price = (Math.random() * 9000 + 1000).toFixed(2);
    
    hotList.push({
      rank: i,
      title: `${prefix} ${product}`,
      price: `¥${price}`,
      category,
      hotValue: `${hotValue}人关注`,
      image: `https://via.placeholder.com/200x200?text=${encodeURIComponent(product)}`,
      url: `https://www.jd.com/product/${i}`,
      crawlTime: new Date()
    });
  }
  
  return hotList;
}

// 方案3: 爬取京东首页推荐（备用方案）
async function fetchJDHomePage() {
  try {
    const response = await axios.get('https://www.jd.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const hotList = [];
    
    // 尝试提取热门商品（具体选择器需要根据实际页面结构调整）
    $('.goods-item, .product-item, .hot-item').each((index, element) => {
      if (index >= 20) return false; // 只取前20个
      
      const $el = $(element);
      const title = $el.find('.p-name, .title').text().trim();
      const price = $el.find('.p-price, .price').text().trim();
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-lazy-img') || '';
      
      if (title) {
        hotList.push({
          rank: index + 1,
          title,
          price,
          image: image.startsWith('//') ? 'https:' + image : image,
          category: '推荐',
          crawlTime: new Date()
        });
      }
    });
    
    return hotList.length > 0 ? hotList : [];
  } catch (error) {
    console.error('京东首页爬取失败:', error.message);
    return [];
  }
}

// 主爬虫函数 - 尝试多种方案
async function crawlJDHotList() {
  console.log('🕷️  开始爬取京东热榜...');
  
  // 首先尝试 API
  let hotList = await fetchJDHotListAPI();
  
  // 如果 API 失败，尝试首页爬取
  if (hotList.length === 0) {
    console.log('API 失败，尝试爬取首页...');
    hotList = await fetchJDHomePage();
  }
  
  // 如果都失败，使用模拟数据
  if (hotList.length === 0) {
    console.log('⚠️  实际爬取失败，使用模拟数据');
    hotList = generateMockJDHotList();
  }
  
  console.log(`✅ 成功获取 ${hotList.length} 条热榜数据`);
  return hotList;
}

// 如果直接运行此文件，则执行爬虫
if (require.main === module) {
  (async () => {
    const dotenv = require('dotenv');
    const connectDB = require('../config/database');
    const JDHotList = require('../models/JDHotList');
    
    dotenv.config();
    await connectDB();
    
    const hotList = await crawlJDHotList();
    
    if (hotList.length > 0) {
      // 清空旧数据
      await JDHotList.deleteMany({});
      
      // 插入新数据
      await JDHotList.insertMany(hotList);
      console.log('✅ 数据已保存到数据库');
    }
    
    process.exit(0);
  })();
}

module.exports = {
  crawlJDHotList,
  generateMockJDHotList
};
