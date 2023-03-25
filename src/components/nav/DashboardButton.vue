<template>
  <button class="dashboard-button accessible-button" 
    @click="this.$router.push('/app')" 
    accesskey="q" 
    :disabled="disabled" 
    :aria-label="this.$t('goToQueueDashboardAriaLabel')">
    <span class="fa fa-dashboard" />
  </button>
</template>

<script>
export default {
  name: "DashboardButton",
  props: [ "disabled", "theme" ],
}
</script>

<style scoped>
.dashboard-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 4px;
  margin: .56rem;
  text-align: center;
}

.dashboard-button:disabled {
  cursor: auto;
}

.dashboard-button:hover, .dashboard-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.dashboard-button:hover:disabled {
  background-color: unset;
}
</style>
