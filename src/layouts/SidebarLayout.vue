<template>
  <nav
    class="group sidebar bg-gray-100 w-16 hover:w-48 transition-all duration-300 ease-in-out h-screen flex flex-col p-2 shadow-md space-y-4 overflow-hidden"
  >
    <SidebarLink to="/home" :icon="Home" label="Home" />
    <SidebarLink to="/accounts" :icon="Accounts" label="Cuentas" />
    <SidebarLink to="/cards" :icon="CreditCard" label="Tarjetas" />
    <SidebarLink to="/profile" :icon="Profile" label="Perfil" />
    <SidebarLink to="/settings" :icon="Settings" label="Configuración" />
    <a
      href="#"
      @click.prevent="logout"
      class="flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors"
    >
      <span class="text-lg">
        <LogOut />
      </span>
      <span class="sidebar-label hidden group-hover:inline">Logout</span>
    </a>
  </nav>
</template>
<script setup lang="ts">
import {
  Landmark as Home,
  Wallet as Accounts,
  CreditCard,
  UserPen as Profile,
  Settings,
  LogOut,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SidebarLink from "@/components/SidebarLink.vue";

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout(); // tu acción en la store
  router.push("/auth/login"); // redirige al login o donde quieras
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar {
}
</style>
