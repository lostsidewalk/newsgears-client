<template>
  <button class="dashboard-button" @click="this.$router.push('/app')" accesskey="q" :disabled="disabled" aria-label="Go to dashboard">
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
  border-radius: 3px;
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.dashboard-button:disabled {
  cursor: auto;
}

.dashboard-button:hover, .dashboard-button:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.dashboard-button:hover:disabled {
  background-color: unset;
}
</style>
