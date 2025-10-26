const axios = require('axios');

/**
 * 值得买 OpenAPI 客户端
 * 文档：https://openapi.zhidemai.com/
 */

class ZhideMaiClient {
  constructor(appKey, accessToken = null) {
    this.appKey = appKey;
    this.accessToken = accessToken;
    this.baseURL = 'https://openapi.zhidemai.com/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 构建请求参数
   */
  buildParams(params = {}) {
    const requestParams = {
      App_Key: this.appKey,
      ...params
    };
    
    if (this.accessToken) {
      requestParams.Access_Token = this.accessToken;
    }
    
    return requestParams;
  }

  /**
   * 发送请求
   */
  async request(endpoint, params = {}, method = 'get') {
    try {
      const config = {
        method,
        url: endpoint,
        [method === 'get' ? 'params' : 'data']: this.buildParams(params)
      };
      
      const response = await this.client.request(config);
      return response.data;
    } catch (error) {
      console.error(`值得买API请求失败 [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ==================== 好价API ====================
  
  /**
   * 获取好价信息详情
   * @param {string} articleId - 好价ID
   */
  async getHaojiaDetail(articleId) {
    return this.request('/haojia/detail/show', { article_id: articleId });
  }

  /**
   * 获取好价文章列表
   * @param {object} options - 查询选项
   */
  async getHaojiaList(options = {}) {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
      sort: options.sort || 'time_sort', // time_sort, hot_sort
      ...options
    };
    return this.request('/haojia/article/list', params);
  }

  // ==================== 好文API ====================
  
  /**
   * 获取社区文章信息详情
   * @param {string} articleIds - 文章ID，多个用逗号分隔
   */
  async getArticleDetail(articleIds) {
    return this.request('/article/detail/show', { article_ids: articleIds });
  }

  /**
   * 获取社区文章列表
   * @param {object} options - 查询选项
   */
  async getArticleList(options = {}) {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
      ...options
    };
    return this.request('/article/list', params);
  }

  // ==================== 销售信息API ====================
  
  /**
   * 获取券信息
   * @param {number} websiteId - 网站ID（默认17=苏宁）
   * @param {object} options - 查询选项
   */
  async getCouponList(websiteId = 17, options = {}) {
    const params = {
      WebsiteID: websiteId,
      PageSize: options.pageSize || 20,
      PageNo: options.pageNo || 1,
      ...options
    };
    return this.request('/sale/coupon/list', params);
  }

  // ==================== 排行API ====================
  
  /**
   * 获取电商排行榜
   * @param {object} options - 查询选项
   */
  async getRankList(options = {}) {
    const params = {
      type: options.type || 'hot', // hot, new, sale
      page: options.page || 1,
      limit: options.limit || 20,
      ...options
    };
    return this.request('/rank/list', params);
  }

  // ==================== 搜索API ====================
  
  /**
   * 搜索文章列表
   * @param {string} keyword - 搜索关键词
   * @param {object} options - 查询选项
   */
  async searchArticles(keyword, options = {}) {
    const params = {
      keyword,
      page: options.page || 1,
      limit: options.limit || 20,
      ...options
    };
    return this.request('/search/article/list', params);
  }

  /**
   * 搜索商品列表
   * @param {string} keyword - 搜索关键词
   * @param {object} options - 查询选项
   */
  async searchProducts(keyword, options = {}) {
    const params = {
      keyword,
      page: options.page || 1,
      limit: options.limit || 20,
      ...options
    };
    return this.request('/search/product/list', params);
  }

  /**
   * 搜索好价列表
   * @param {string} keyword - 搜索关键词
   * @param {object} options - 查询选项
   */
  async searchHaojia(keyword, options = {}) {
    const params = {
      keyword,
      page: options.page || 1,
      limit: options.limit || 20,
      ...options
    };
    return this.request('/search/haojia/list', params);
  }
}

module.exports = ZhideMaiClient;
