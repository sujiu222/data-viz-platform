<template>
  <div class="analytics-page">
    <div class="chart-card">
      <div class="card-title">24小时流量分析</div>
      <div
        ref="trafficChart"
        class="chart-container"
        style="height: 500px"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import api from "@/api";

const trafficChart = ref(null);
let trafficChartInstance = null;

const loadAnalyticsData = async () => {
  try {
    const res = await api.getTrafficData();
    initTrafficChart(res.data);
  } catch (error) {
    console.error("加载分析数据失败:", error);
  }
};

const initTrafficChart = (data) => {
  if (!trafficChartInstance) {
    trafficChartInstance = echarts.init(trafficChart.value);
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
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
        lineStyle: {
          width: 2,
          color: "#1890ff",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(24, 144, 255, 0.5)" },
            { offset: 1, color: "rgba(24, 144, 255, 0.1)" },
          ]),
        },
      },
      {
        name: "UV",
        type: "line",
        data: data.map((item) => item.uv),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#52c41a",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(82, 196, 26, 0.5)" },
            { offset: 1, color: "rgba(82, 196, 26, 0.1)" },
          ]),
        },
      },
    ],
  };

  trafficChartInstance.setOption(option);
};

onMounted(() => {
  loadAnalyticsData();

  window.addEventListener("resize", () => {
    trafficChartInstance?.resize();
  });
});

onUnmounted(() => {
  trafficChartInstance?.dispose();
});
</script>
