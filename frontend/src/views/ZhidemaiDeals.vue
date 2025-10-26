<template>
  <div class="zhidemai-deals">
    <div class="page-header">
      <h1>值得买 - 好价推荐</h1>
      <p>实时更新的优惠商品信息</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总好价数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.active }}</div>
        <div class="stat-label">有效好价</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ avgDiscount }}%</div>
        <div class="stat-label">平均折扣</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">¥{{ avgPrice }}</div>
        <div class="stat-label">平均价格</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="selectedCategory" placeholder="选择分类" @change="loadDeals" clearable>
        <el-option label="全部分类" value=""></el-option>
        <el-option
          v-for="cat in categories"
          :key="cat.name"
          :label="`${cat.name} (${cat.count})`"
          :value="cat.name"
        ></el-option>
      </el-select>
      
      <el-select v-model="sortBy" placeholder="排序方式" @change="loadDeals">
        <el-option label="发布时间" value="publishTime"></el-option>
        <el-option label="热度优先" value="hotValue"></el-option>
        <el-option label="价格从低到高" value="price"></el-option>
        <el-option label="折扣力度" value="discount"></el-option>
      </el-select>
      
      <el-button type="primary" @click="loadDeals">刷新</el-button>
    </div>

    <!-- 热门好价图表 -->
    <div class="chart-container">
      <h2>热门好价 TOP 10</h2>
      <div id="hotDealsChart" style="width: 100%; height: 400px;"></div>
    </div>

    <!-- 分类分布图表 -->
    <div class="chart-container">
      <h2>分类分布</h2>
      <div id="categoryChart" style="width: 100%; height: 400px;"></div>
    </div>

    <!-- 好价列表 -->
    <div class="deals-grid">
      <div
        v-for="deal in deals"
        :key="deal._id"
        class="deal-card"
        :class="{ expired: deal.isExpired }"
      >
        <div class="deal-image">
          <img :src="deal.imageUrl" :alt="deal.title" />
          <div class="discount-badge">{{ deal.discount }}% OFF</div>
        </div>
        <div class="deal-info">
          <h3 class="deal-title">{{ deal.title }}</h3>
          <div class="deal-meta">
            <span class="category">{{ deal.category }}</span>
            <span class="mall">{{ deal.mall }}</span>
          </div>
          <p class="deal-desc">{{ deal.description }}</p>
          <div class="deal-price">
            <span class="current-price">¥{{ deal.price }}</span>
            <span class="original-price">¥{{ deal.originalPrice }}</span>
          </div>
          <div class="deal-stats">
            <span><i class="el-icon-view"></i> {{ deal.hotValue }}</span>
            <span><i class="el-icon-chat-line-round"></i> {{ deal.commentCount }}</span>
            <span><i class="el-icon-star-off"></i> {{ deal.likeCount }}</span>
          </div>
          <div class="deal-time">
            <span v-if="!deal.isExpired">
              {{ formatTime(deal.expireTime) }} 截止
            </span>
            <span v-else class="expired-text">已过期</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import api from '../api';
import { ElMessage } from 'element-plus';

export default {
  name: 'ZhidemaiDeals',
  setup() {
    const deals = ref([]);
    const categories = ref([]);
    const stats = ref({ total: 0, active: 0 });
    const currentPage = ref(1);
    const pageSize = ref(12);
    const total = ref(0);
    const selectedCategory = ref('');
    const sortBy = ref('publishTime');
    const avgDiscount = ref(0);
    const avgPrice = ref(0);

    let hotDealsChart = null;
    let categoryChart = null;

    // 加载好价列表
    const loadDeals = async () => {
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          sort: sortBy.value
        };
        
        if (selectedCategory.value) {
          params.category = selectedCategory.value;
        }

        const response = await api.getZhidemaiHaojia(params);
        deals.value = response.data.list;
        total.value = response.data.pagination.total;
      } catch (error) {
        console.error('加载好价列表失败:', error);
        ElMessage.error('加载数据失败');
      }
    };

    // 加载分类统计
    const loadCategories = async () => {
      try {
        const response = await api.getZhidemaiHaojiaCategories();
        categories.value = response.data;
        
        // 计算平均折扣和价格
        if (categories.value.length > 0) {
          const totalDiscount = categories.value.reduce((sum, cat) => sum + (cat.avgDiscount || 0), 0);
          const totalPrice = categories.value.reduce((sum, cat) => sum + (cat.avgPrice || 0), 0);
          avgDiscount.value = Math.round(totalDiscount / categories.value.length);
          avgPrice.value = Math.round(totalPrice / categories.value.length);
        }
        
        // 渲染分类图表
        renderCategoryChart();
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    };

    // 加载热门好价
    const loadHotDeals = async () => {
      try {
        const response = await api.getZhidemaiHaojiaHot({ limit: 10 });
        renderHotDealsChart(response.data);
      } catch (error) {
        console.error('加载热门好价失败:', error);
      }
    };

    // 加载统计数据
    const loadStats = async () => {
      try {
        const response = await api.getZhidemaiStats();
        stats.value = response.data.haojia;
      } catch (error) {
        console.error('加载统计失败:', error);
      }
    };

    // 渲染热门好价图表
    const renderHotDealsChart = (data) => {
      if (!hotDealsChart) {
        hotDealsChart = echarts.init(document.getElementById('hotDealsChart'));
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '热度值'
        },
        yAxis: {
          type: 'category',
          data: data.map(item => item.title.slice(0, 20) + '...').reverse()
        },
        series: [
          {
            name: '热度',
            type: 'bar',
            data: data.map(item => item.hotValue).reverse(),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#f093fb' },
                { offset: 1, color: '#4facfe' }
              ])
            },
            label: {
              show: true,
              position: 'right'
            }
          }
        ]
      };

      hotDealsChart.setOption(option);
    };

    // 渲染分类分布图表
    const renderCategoryChart = () => {
      if (!categoryChart) {
        categoryChart = echarts.init(document.getElementById('categoryChart'));
      }

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          left: 'center'
        },
        series: [
          {
            name: '分类分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: categories.value.map(cat => ({
              value: cat.count,
              name: cat.name
            }))
          }
        ]
      };

      categoryChart.setOption(option);
    };

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page;
      loadDeals();
    };

    // 格式化时间
    const formatTime = (time) => {
      const date = new Date(time);
      const now = new Date();
      const diff = date - now;
      
      if (diff < 0) return '已过期';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `${days}天后`;
      if (hours > 0) return `${hours}小时后`;
      return '即将过期';
    };

    onMounted(() => {
      loadDeals();
      loadCategories();
      loadHotDeals();
      loadStats();

      // 窗口大小改变时重绘图表
      window.addEventListener('resize', () => {
        hotDealsChart?.resize();
        categoryChart?.resize();
      });
    });

    return {
      deals,
      categories,
      stats,
      currentPage,
      pageSize,
      total,
      selectedCategory,
      sortBy,
      avgDiscount,
      avgPrice,
      loadDeals,
      handlePageChange,
      formatTime
    };
  }
};
</script>

<style scoped lang="scss">
.zhidemai-deals {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  
  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25px;
  border-radius: 12px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:nth-child(2) {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  
  &:nth-child(3) {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  
  &:nth-child(4) {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  
  .el-select {
    min-width: 200px;
  }
}

.chart-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  
  h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
}

.deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.deal-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &.expired {
    opacity: 0.6;
    
    .deal-image::after {
      content: '已过期';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 14px;
    }
  }
}

.deal-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .discount-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
  }
}

.deal-info {
  padding: 15px;
}

.deal-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.deal-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  
  span {
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 4px;
    background: #f5f7fa;
    color: #909399;
  }
  
  .category {
    background: #ecf5ff;
    color: #409eff;
  }
}

.deal-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.deal-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
  
  .current-price {
    font-size: 24px;
    font-weight: bold;
    color: #f5576c;
  }
  
  .original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }
}

.deal-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.deal-time {
  font-size: 12px;
  color: #67c23a;
  
  .expired-text {
    color: #f56c6c;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
