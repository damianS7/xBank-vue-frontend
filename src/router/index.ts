import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/Login.vue";
import DashboardView from "@/views/Dashboard.vue";

import AuthLayout from "@/layouts/Auth.vue";
import DefaultLayout from "@/layouts/Default.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardView,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "login2",
        component: LoginView,
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
