import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API错误:", error);
    return Promise.reject(error);
  }
);

export default {
  // 销售数据
  getSalesMonthly: () => api.get("/sales/monthly"),
  getSalesCategory: () => api.get("/sales/category"),
  getSalesRegion: () => api.get("/sales/region"),
  getSalesAll: () => api.get("/sales/all"),

  // 用户数据
  getUserStatistics: () => api.get("/users/statistics"),
  getUserGrowth: () => api.get("/users/growth"),
  getUserAgeDistribution: () => api.get("/users/age-distribution"),

  // 分析数据
  getRealtimeData: () => api.get("/analytics/realtime"),
  getTrafficData: () => api.get("/analytics/traffic"),
  getTopProducts: () => api.get("/analytics/top-products"),
  getDashboardData: () => api.get("/analytics/dashboard"),

  // 京东热榜
  getJDHotList: (params) => api.get("/jd-hotlist", { params }),
  getJDHotListTop: (limit = 10) => api.get(`/jd-hotlist/top?limit=${limit}`),
  getJDCategories: () => api.get("/jd-hotlist/categories"),
  refreshJDHotList: () => api.post("/jd-hotlist/refresh"),
  getJDLastUpdate: () => api.get("/jd-hotlist/last-update"),

  // 值得买 - 好价
  getZhidemaiHaojia: (params) => api.get("/zhidemai/haojia", { params }),
  getZhidemaiHaojiaHot: (params) => api.get("/zhidemai/haojia/hot", { params }),
  getZhidemaiHaojiaCategories: () => api.get("/zhidemai/haojia/categories"),
  refreshZhidemaiHaojia: (data) => api.post("/zhidemai/haojia/refresh", data),

  // 值得买 - 文章
  getZhidemaiArticles: (params) => api.get("/zhidemai/articles", { params }),
  getZhidemaiArticlesPopular: (params) => api.get("/zhidemai/articles/popular", { params }),
  getZhidemaiArticlesElite: (params) => api.get("/zhidemai/articles/elite", { params }),

  // 值得买 - 优惠券
  getZhidemaiCoupons: (params) => api.get("/zhidemai/coupons", { params }),
  getZhidemaiCouponsHot: (params) => api.get("/zhidemai/coupons/hot", { params }),

  // 值得买 - 排行榜
  getZhidemaiRank: (params) => api.get("/zhidemai/rank", { params }),
  getZhidemaiRankCategories: (params) => api.get("/zhidemai/rank/categories", { params }),

  // 值得买 - 搜索
  searchZhidemaiHaojia: (params) => api.get("/zhidemai/search/haojia", { params }),
  searchZhidemaiArticles: (params) => api.get("/zhidemai/search/articles", { params }),

  // 值得买 - 统计
  getZhidemaiStats: () => api.get("/zhidemai/stats"),
};
