<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="logo">📊 数据平台</div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>数据仪表板</span>
        </el-menu-item>
        <el-menu-item index="/sales">
          <el-icon><TrendCharts /></el-icon>
          <span>销售数据</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户数据</span>
        </el-menu-item>
        <el-menu-item index="/analytics">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据分析</span>
        </el-menu-item>
        <el-menu-item index="/jd-hotlist">
          <el-icon><ShoppingCart /></el-icon>
          <span>京东热榜</span>
        </el-menu-item>
        <el-sub-menu index="zhidemai">
          <template #title>
            <el-icon><Present /></el-icon>
            <span>值得买</span>
          </template>
          <el-menu-item index="/zhidemai-deals">
            <span>好价推荐</span>
          </el-menu-item>
          <el-menu-item index="/zhidemai-articles">
            <span>社区文章</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <main class="main-content">
      <header class="header">
        <h1>{{ pageTitle }}</h1>
      </header>
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const activeMenu = computed(() => route.path);
const pageTitle = computed(() => route.meta.title || "数据可视化平台");
</script>
