<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">在线用户</div>
        <div class="stat-value">
          {{ realtimeData.onlineUsers?.toLocaleString() }}
        </div>
        <div class="stat-trend up">↑ 12.5%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日访问</div>
        <div class="stat-value">
          {{ realtimeData.todayVisits?.toLocaleString() }}
        </div>
        <div class="stat-trend up">↑ 8.3%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日订单</div>
        <div class="stat-value">
          {{ realtimeData.todayOrders?.toLocaleString() }}
        </div>
        <div class="stat-trend down">↓ 2.1%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日营收</div>
        <div class="stat-value">
          ¥{{ (realtimeData.todayRevenue / 10000)?.toFixed(1) }}w
        </div>
        <div class="stat-trend up">↑ 15.7%</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="card-title">流量趋势</div>
        <div ref="trafficChart" class="chart-container"></div>
      </div>

      <div class="chart-card">
        <div class="card-title">热门产品</div>
        <div ref="productChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import api from "@/api";

const realtimeData = ref({});
const trafficChart = ref(null);
const productChart = ref(null);
let trafficChartInstance = null;
let productChartInstance = null;
let timer = null;

const loadDashboardData = async () => {
  try {
    const [realtimeRes, trafficRes, productRes] = await Promise.all([
      api.getRealtimeData(),
      api.getTrafficData(),
      api.getTopProducts(),
    ]);

    realtimeData.value = realtimeRes.data;
    initTrafficChart(trafficRes.data);
    initProductChart(productRes.data);
  } catch (error) {
    console.error("加载数据失败:", error);
  }
};

const initTrafficChart = (data) => {
  if (!trafficChartInstance) {
    trafficChartInstance = echarts.init(trafficChart.value);
  }

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["PV", "UV"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.hour),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "PV",
        type: "line",
        data: data.map((item) => item.pv),
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
      },
      {
        name: "UV",
        type: "line",
        data: data.map((item) => item.uv),
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
      },
    ],
  };

  trafficChartInstance.setOption(option);
};

const initProductChart = (data) => {
  if (!productChartInstance) {
    productChartInstance = echarts.init(productChart.value);
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: data.map((item) => item.name),
    },
    series: [
      {
        name: "销量",
        type: "bar",
        data: data.map((item) => item.sales),
        itemStyle: {
          color: "#1890ff",
        },
      },
    ],
  };

  productChartInstance.setOption(option);
};

onMounted(() => {
  loadDashboardData();

  // 每30秒刷新实时数据
  timer = setInterval(async () => {
    const res = await api.getRealtimeData();
    realtimeData.value = res.data;
  }, 30000);

  // 响应式调整
  window.addEventListener("resize", () => {
    trafficChartInstance?.resize();
    productChartInstance?.resize();
  });
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  trafficChartInstance?.dispose();
  productChartInstance?.dispose();
});
</script>

<style scoped lang="scss">
.dashboard {
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
</style>
