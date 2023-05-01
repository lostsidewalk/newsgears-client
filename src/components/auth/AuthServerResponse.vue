<template>
  <div v-if="this.serverMessage && !this.$auth.$isAuthenticated" class="server-message">
    {{ this.serverMessage }}
  </div>
</template>

<script>
export default {
  name: "AuthServerResponse",
  props: [ "serverMessage", "theme" ]
}
</script>

<style scoped>
.server-message {
  text-align: center;
  color: v-bind('theme.normalmessage');
  padding: 4%;
}

@media (max-width: 640px) {
  .server-message {
    padding-left: 2%;
    padding-right: 2%;
  }
}

@media (max-width: 320px) {
  .server-message {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
