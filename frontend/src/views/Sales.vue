<template>
  <div class="sales-page">
    <div class="chart-card">
      <div class="card-title">月度销售趋势</div>
      <div ref="monthlyChart" class="chart-container"></div>
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <div class="card-title">品类销售分布</div>
        <div ref="categoryChart" class="chart-container"></div>
      </div>

      <div class="chart-card">
        <div class="card-title">区域销售排行</div>
        <div ref="regionChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import api from "@/api";

const monthlyChart = ref(null);
const categoryChart = ref(null);
const regionChart = ref(null);
let monthlyChartInstance = null;
let categoryChartInstance = null;
let regionChartInstance = null;

const loadSalesData = async () => {
  try {
    const res = await api.getSalesAll();
    const { monthly, byCategory, byRegion } = res.data;

    initMonthlyChart(monthly);
    initCategoryChart(byCategory);
    initRegionChart(byRegion);
  } catch (error) {
    console.error("加载销售数据失败:", error);
  }
};

const initMonthlyChart = (data) => {
  if (!monthlyChartInstance) {
    monthlyChartInstance = echarts.init(monthlyChart.value);
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
      data: data.map((item) => item.month),
    },
    yAxis: {
      type: "value",
      name: "销售额(万元)",
    },
    series: [
      {
        name: "销售额",
        type: "line",
        data: data.map((item) => (item.value / 100).toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#1890ff",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(24, 144, 255, 0.3)" },
            { offset: 1, color: "rgba(24, 144, 255, 0.05)" },
          ]),
        },
      },
    ],
  };

  monthlyChartInstance.setOption(option);
};

const initCategoryChart = (data) => {
  if (!categoryChartInstance) {
    categoryChartInstance = echarts.init(categoryChart.value);
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
        name: "销售额",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["40%", "50%"],
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
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

  categoryChartInstance.setOption(option);
};

const initRegionChart = (data) => {
  if (!regionChartInstance) {
    regionChartInstance = echarts.init(regionChart.value);
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
      type: "category",
      data: data.map((item) => item.region),
    },
    yAxis: [
      {
        type: "value",
        name: "销售额(万元)",
      },
      {
        type: "value",
        name: "增长率(%)",
      },
    ],
    series: [
      {
        name: "销售额",
        type: "bar",
        data: data.map((item) => (item.sales / 100).toFixed(2)),
        itemStyle: {
          color: "#1890ff",
        },
      },
      {
        name: "增长率",
        type: "line",
        yAxisIndex: 1,
        data: data.map((item) => item.growth),
        itemStyle: {
          color: "#52c41a",
        },
      },
    ],
  };

  regionChartInstance.setOption(option);
};

onMounted(() => {
  loadSalesData();

  window.addEventListener("resize", () => {
    monthlyChartInstance?.resize();
    categoryChartInstance?.resize();
    regionChartInstance?.resize();
  });
});

onUnmounted(() => {
  monthlyChartInstance?.dispose();
  categoryChartInstance?.dispose();
  regionChartInstance?.dispose();
});
</script>

<style scoped lang="scss">
.sales-page {
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;
  }
}
</style>
