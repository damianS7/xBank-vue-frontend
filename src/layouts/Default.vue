<template>
 <DashboardView></DashboardView>
</template>

<script>
import DashboardView from '@/views/Dashboard.vue';

export default {
  name: 'Default',
  components: {
    DashboardView
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
