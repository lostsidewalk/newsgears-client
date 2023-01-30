<template>
  <span>
    <button class="dashboard-button" @click="this.$router.push('/app')" :disabled="inTransit" aria-label="Go to dashboard">
      <span class="fa fa-dashboard" />
    </button>
  </span>
</template>

<script>
export default {
  name: "DashboardButton",
  props: [ "inTransit", "theme" ],
}
</script>

<style scoped>
.dashboard-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin: 9px;
  margin-left: 2%;
  text-align: center;
}

.dashboard-button:disabled {
  cursor: auto;
}

.dashboard-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.dashboard-button:hover:disabled {
  background-color: unset;
}
</style>