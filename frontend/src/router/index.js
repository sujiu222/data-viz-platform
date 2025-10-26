import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import Dashboard from "../views/Dashboard.vue";
import Sales from "../views/Sales.vue";
import Users from "../views/Users.vue";
import Analytics from "../views/Analytics.vue";
import JDHotList from "../views/JDHotList.vue";
import ZhidemaiDeals from "../views/ZhidemaiDeals.vue";
import ZhidemaiArticles from "../views/ZhidemaiArticles.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { title: "数据仪表板" },
      },
      {
        path: "/sales",
        name: "Sales",
        component: Sales,
        meta: { title: "销售数据" },
      },
      {
        path: "/users",
        name: "Users",
        component: Users,
        meta: { title: "用户数据" },
      },
      {
        path: "/analytics",
        name: "Analytics",
        component: Analytics,
        meta: { title: "数据分析" },
      },
      {
        path: "/jd-hotlist",
        name: "JDHotList",
        component: JDHotList,
        meta: { title: "京东热榜" },
      },
      {
        path: "/zhidemai-deals",
        name: "ZhidemaiDeals",
        component: ZhidemaiDeals,
        meta: { title: "值得买 - 好价" },
      },
      {
        path: "/zhidemai-articles",
        name: "ZhidemaiArticles",
        component: ZhidemaiArticles,
        meta: { title: "值得买 - 文章" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
