<template>
  <div class="system-status-container">
    <div class="system-status-view">
      System Status: {{ this.systemStatus }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemStatusPanel",
  props: ["theme"],
  computed: {
    systemStatus: function() {
      return 'UP';
    }
  }
}
</script>

<style scoped>
.system-status-view {
  border: 1px solid orange;
}
</style>
