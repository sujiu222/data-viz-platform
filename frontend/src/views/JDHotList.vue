<template>
  <div class="jd-hotlist-page">
    <!-- 头部操作栏 -->
    <div class="header-actions">
      <el-space>
        <el-select v-model="selectedCategory" placeholder="选择分类" style="width: 150px" @change="loadHotList">
          <el-option label="全部" value="全部" />
          <el-option v-for="cat in categories" :key="cat.category" :label="cat.category" :value="cat.category" />
        </el-select>
        
        <el-button type="primary" @click="refreshData" :loading="refreshing">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        
        <el-text v-if="lastUpdate" type="info">
          最后更新: {{ formatTime(lastUpdate) }}
        </el-text>
      </el-space>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">热榜总数</div>
        <div class="stat-value">{{ hotList.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">分类数量</div>
        <div class="stat-value">{{ categories.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">TOP1商品</div>
        <div class="stat-value" style="font-size: 16px;">{{ topProduct }}</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="card-title">热榜TOP 10</div>
        <div ref="topChart" class="chart-container"></div>
      </div>

      <div class="chart-card">
        <div class="card-title">分类分布</div>
        <div ref="categoryChart" class="chart-container"></div>
      </div>
    </div>

    <!-- 热榜列表 -->
    <div class="chart-card">
      <div class="card-title">京东热榜详情</div>
      <el-table :data="hotList" stripe style="width: 100%" max-height="600">
        <el-table-column prop="rank" label="排名" width="80" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.rank <= 3" :type="getRankType(scope.row.rank)" effect="dark">
              {{ scope.row.rank }}
            </el-tag>
            <span v-else>{{ scope.row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" min-width="300" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120" align="center" />
        <el-table-column prop="hotValue" label="热度" width="150" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.url" link type="primary" @click="openLink(scope.row.url)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import api from '@/api'
import { ElMessage } from 'element-plus'

const hotList = ref([])
const categories = ref([])
const selectedCategory = ref('全部')
const lastUpdate = ref(null)
const refreshing = ref(false)
const topChart = ref(null)
const categoryChart = ref(null)
let topChartInstance = null
let categoryChartInstance = null

const topProduct = computed(() => {
  return hotList.value.length > 0 ? hotList.value[0].title : '-'
})

const loadHotList = async () => {
  try {
    const params = {}
    if (selectedCategory.value !== '全部') {
      params.category = selectedCategory.value
    }
    
    const res = await api.getJDHotList(params)
    hotList.value = res.data || []
    
    initTopChart()
  } catch (error) {
    console.error('加载热榜失败:', error)
    ElMessage.error('加载热榜数据失败')
  }
}

const loadCategories = async () => {
  try {
    const res = await api.getJDCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const loadLastUpdate = async () => {
  try {
    const res = await api.getJDLastUpdate()
    lastUpdate.value = res.data.lastUpdate
  } catch (error) {
    console.error('加载更新时间失败:', error)
  }
}

const refreshData = async () => {
  refreshing.value = true
  try {
    ElMessage.info('正在更新热榜数据，请稍候...')
    await api.refreshJDHotList()
    await loadHotList()
    await loadCategories()
    await loadLastUpdate()
    ElMessage.success('热榜数据更新成功')
  } catch (error) {
    console.error('刷新失败:', error)
    ElMessage.error('刷新失败，请稍后重试')
  } finally {
    refreshing.value = false
  }
}

const initTopChart = () => {
  if (!topChartInstance) {
    topChartInstance = echarts.init(topChart.value)
  }
  
  const top10 = hotList.value.slice(0, 10)
  
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
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: top10.map(item => `TOP${item.rank}`).reverse(),
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '排名',
        type: 'bar',
        data: top10.map((item, index) => ({
          value: 11 - item.rank,
          itemStyle: {
            color: index < 3 ? '#f5222d' : '#1890ff'
          }
        })).reverse(),
        label: {
          show: true,
          position: 'right',
          formatter: (params) => {
            const item = top10[9 - params.dataIndex]
            return item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title
          }
        }
      }
    ]
  }
  
  topChartInstance.setOption(option)
}

const initCategoryChart = () => {
  if (!categoryChartInstance) {
    categoryChartInstance = echarts.init(categoryChart.value)
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center'
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: categories.value.map(item => ({
          value: item.count,
          name: item.category
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%'
        }
      }
    ]
  }
  
  categoryChartInstance.setOption(option)
}

const getRankType = (rank) => {
  if (rank === 1) return 'danger'
  if (rank === 2) return 'warning'
  if (rank === 3) return 'success'
  return ''
}

const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

const openLink = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

onMounted(async () => {
  await loadHotList()
  await loadCategories()
  await loadLastUpdate()
  initCategoryChart()
  
  window.addEventListener('resize', () => {
    topChartInstance?.resize()
    categoryChartInstance?.resize()
  })
})

onUnmounted(() => {
  topChartInstance?.dispose()
  categoryChartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.jd-hotlist-page {
  .header-actions {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }
}
</style>
