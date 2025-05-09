<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4"
  >
    <div class="w-full max-w-md">
      <router-view></router-view>
    </div>
    <div
      class="w-full max-w-md mt-6 text-center text-sm text-gray-600 space-y-1"
    >
      <RouterLink
        v-if="!route.path.includes('/auth/login')"
        to="/auth/login"
        class="block hover:underline text-blue-600"
      >
        Iniciar sesión
      </RouterLink>
      <RouterLink
        v-if="!route.path.includes('/auth/register')"
        to="/auth/register"
        class="block hover:underline text-blue-600"
      >
        ¿No tienes cuenta? Regístrate
      </RouterLink>
      <RouterLink
        v-if="!route.path.includes('/auth/reset-password')"
        to="/auth/reset-password"
        class="block hover:underline text-blue-600"
      >
        ¿Olvidaste tu contraseña?
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth-layout {
}
</style>
