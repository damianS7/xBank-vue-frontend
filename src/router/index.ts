import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BankingAccountsView from "@/views/account/BankingAccountsView.vue";
import BankingAccountView from "@/views/account/BankingAccountView.vue";
import BankingCardsView from "@/views/BankingCardsView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import AboutView from "@/views/AboutView.vue";
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
        name: "home",
        component: HomeView,
      },
      {
        path: "accounts",
        name: "accounts",
        component: BankingAccountsView,
      },
      {
        path: "account/:id",
        name: "account",
        component: BankingAccountView,
      },
      {
        path: "cards",
        name: "cards",
        component: BankingCardsView,
      },
      {
        path: "profile",
        name: "profile",
        component: ProfileView,
      },
      {
        path: "settings",
        name: "settings",
        component: SettingsView,
      },
      {
        path: "about",
        name: "about",
        component: AboutView,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPasswordView,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
    // next({ path: "/auth/login" }); // opcional: guardar destino
  } else {
    next();
  }
});

export default router;
