<template>
  <div class="users-page">
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">总用户数</div>
        <div class="stat-value">{{ statistics.total?.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">活跃用户</div>
        <div class="stat-value">{{ statistics.active?.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">新增用户</div>
        <div class="stat-value">{{ statistics.new?.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">留存率</div>
        <div class="stat-value">{{ statistics.retention }}%</div>
      </div>
    </div>

    <!-- 图表 -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="card-title">用户增长趋势</div>
        <div ref="growthChart" class="chart-container"></div>
      </div>

      <div class="chart-card">
        <div class="card-title">年龄分布</div>
        <div ref="ageChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import api from "@/api";

const statistics = ref({});
const growthChart = ref(null);
const ageChart = ref(null);
let growthChartInstance = null;
let ageChartInstance = null;

const loadUserData = async () => {
  try {
    const [statsRes, growthRes, ageRes] = await Promise.all([
      api.getUserStatistics(),
      api.getUserGrowth(),
      api.getUserAgeDistribution(),
    ]);

    statistics.value = statsRes.data;
    initGrowthChart(growthRes.data);
    initAgeChart(ageRes.data);
  } catch (error) {
    console.error("加载用户数据失败:", error);
  }
};

const initGrowthChart = (data) => {
  if (!growthChartInstance) {
    growthChartInstance = echarts.init(growthChart.value);
  }

  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
    },
    yAxis: {
      type: "value",
      name: "用户数",
    },
    series: [
      {
        name: "用户总数",
        type: "line",
        data: data.map((item) => item.users),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#52c41a",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(82, 196, 26, 0.3)" },
            { offset: 1, color: "rgba(82, 196, 26, 0.05)" },
          ]),
        },
      },
    ],
  };

  growthChartInstance.setOption(option);
};

const initAgeChart = (data) => {
  if (!ageChartInstance) {
    ageChartInstance = echarts.init(ageChart.value);
  }

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: "10%",
      top: "center",
    },
    series: [
      {
        name: "年龄分布",
        type: "pie",
        radius: "65%",
        center: ["40%", "50%"],
        data: data.map((item) => ({
          value: item.count,
          name: item.range,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          formatter: "{b}\n{d}%",
        },
      },
    ],
  };

  ageChartInstance.setOption(option);
};

onMounted(() => {
  loadUserData();

  window.addEventListener("resize", () => {
    growthChartInstance?.resize();
    ageChartInstance?.resize();
  });
});

onUnmounted(() => {
  growthChartInstance?.dispose();
  ageChartInstance?.dispose();
});
</script>

<style scoped lang="scss">
.users-page {
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
</style>
