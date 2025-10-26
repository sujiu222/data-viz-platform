<template>
  <div class="zhidemai-articles">
    <div class="page-header">
      <h1>值得买 - 社区文章</h1>
      <p>精选优质内容推荐</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-radio-group v-model="articleType" @change="loadArticles">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="article">文章</el-radio-button>
        <el-radio-button label="video">视频</el-radio-button>
        <el-radio-button label="review">晒单</el-radio-button>
        <el-radio-button label="qa">问答</el-radio-button>
      </el-radio-group>
      
      <el-button type="primary" @click="loadPopularArticles">热门文章</el-button>
      <el-button type="success" @click="loadEliteArticles">精华文章</el-button>
    </div>

    <!-- 热门文章图表 -->
    <div class="chart-container">
      <h2>热门文章浏览量 TOP 10</h2>
      <div id="popularChart" style="width: 100%; height: 400px;"></div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-list">
      <div
        v-for="article in articles"
        :key="article._id"
        class="article-card"
      >
        <div class="article-cover">
          <img :src="article.coverImage" :alt="article.title" />
          <div class="article-type-badge">{{ getTypeLabel(article.type) }}</div>
          <div v-if="article.isElite" class="elite-badge">精华</div>
        </div>
        <div class="article-content">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>
          
          <div class="author-info">
            <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar" />
            <div class="author-detail">
              <span class="author-name">{{ article.author.name }}</span>
              <span class="author-level">Lv{{ article.author.level }}</span>
            </div>
          </div>
          
          <div class="article-meta">
            <span class="category">{{ article.category.name }}</span>
            <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          
          <div class="article-stats">
            <span><i class="el-icon-view"></i> {{ formatNumber(article.viewCount) }}</span>
            <span><i class="el-icon-chat-line-round"></i> {{ formatNumber(article.commentCount) }}</span>
            <span><i class="el-icon-star-off"></i> {{ formatNumber(article.likeCount) }}</span>
            <span><i class="el-icon-folder-opened"></i> {{ formatNumber(article.favoriteCount) }}</span>
          </div>
          
          <div class="article-time">
            {{ formatDate(article.publishTime) }}
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
  name: 'ZhidemaiArticles',
  setup() {
    const articles = ref([]);
    const articleType = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    let popularChart = null;

    const typeLabels = {
      article: '文章',
      video: '视频',
      review: '晒单',
      qa: '问答'
    };

    // 加载文章列表
    const loadArticles = async () => {
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value
        };
        
        if (articleType.value) {
          params.type = articleType.value;
        }

        const response = await api.getZhidemaiArticles(params);
        articles.value = response.data.list;
        total.value = response.data.pagination.total;
      } catch (error) {
        console.error('加载文章列表失败:', error);
        ElMessage.error('加载数据失败');
      }
    };

    // 加载热门文章
    const loadPopularArticles = async () => {
      try {
        const response = await api.getZhidemaiArticlesPopular({ limit: 10 });
        renderPopularChart(response.data);
        ElMessage.success('已加载热门文章数据');
      } catch (error) {
        console.error('加载热门文章失败:', error);
        ElMessage.error('加载失败');
      }
    };

    // 加载精华文章
    const loadEliteArticles = async () => {
      try {
        const response = await api.getZhidemaiArticlesElite();
        articles.value = response.data;
        ElMessage.success('已加载精华文章');
      } catch (error) {
        console.error('加载精华文章失败:', error);
        ElMessage.error('加载失败');
      }
    };

    // 渲染热门文章图表
    const renderPopularChart = (data) => {
      if (!popularChart) {
        popularChart = echarts.init(document.getElementById('popularChart'));
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const item = params[0];
            return `${item.name}<br/>浏览量: ${formatNumber(item.value)}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.title.slice(0, 15) + '...'),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '浏览量'
        },
        series: [
          {
            name: '浏览量',
            type: 'bar',
            data: data.map(item => item.viewCount),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
              ])
            },
            barWidth: '60%'
          }
        ]
      };

      popularChart.setOption(option);
    };

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page;
      loadArticles();
    };

    // 格式化数字
    const formatNumber = (num) => {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
      }
      return num;
    };

    // 格式化日期
    const formatDate = (date) => {
      const d = new Date(date);
      const now = new Date();
      const diff = now - d;
      
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      
      if (diff < hour) {
        return Math.floor(diff / minute) + ' 分钟前';
      } else if (diff < day) {
        return Math.floor(diff / hour) + ' 小时前';
      } else if (diff < 7 * day) {
        return Math.floor(diff / day) + ' 天前';
      } else {
        return d.toLocaleDateString();
      }
    };

    // 获取类型标签
    const getTypeLabel = (type) => {
      return typeLabels[type] || type;
    };

    onMounted(() => {
      loadArticles();
      loadPopularArticles();

      window.addEventListener('resize', () => {
        popularChart?.resize();
      });
    });

    return {
      articles,
      articleType,
      currentPage,
      pageSize,
      total,
      loadArticles,
      loadPopularArticles,
      loadEliteArticles,
      handlePageChange,
      formatNumber,
      formatDate,
      getTypeLabel
    };
  }
};
</script>

<style scoped lang="scss">
.zhidemai-articles {
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

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
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

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.article-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.article-cover {
  position: relative;
  width: 280px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .article-type-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .elite-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
}

.article-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.article-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  flex: 1;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  
  .author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .author-detail {
    display: flex;
    flex-direction: column;
    
    .author-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    
    .author-level {
      font-size: 12px;
      color: #f5576c;
    }
  }
}

.article-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  
  span {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 12px;
    background: #f5f7fa;
    color: #909399;
  }
  
  .category {
    background: #ecf5ff;
    color: #409eff;
  }
}

.article-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
  
  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.article-time {
  font-size: 12px;
  color: #c0c4cc;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .article-card {
    flex-direction: column;
  }
  
  .article-cover {
    width: 100%;
    height: 200px;
  }
}
</style>
