<template>
  <LoginView></LoginView>
</template>

<script>
import LoginView from "@/views/Login.vue";
export default {
  name: "AuthLayout",
  components: {
    LoginView,
  },
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth-layout {
}
</style>
