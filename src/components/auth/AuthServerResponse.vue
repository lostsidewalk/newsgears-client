<template>
    <div v-if="this.serverMessage && !this.$auth.$isAuthenticated" v-auto-animate class="server-message">
      <span>
        {{ this.lastAction ? this.lastAction + ':' : null }} {{ this.serverMessage }}
      </span>
    </div>
</template>

<script>
export default {
  name: "AuthServerResponse",
  props: [ "serverMessage", "lastAction", "theme" ]
}
</script>

<style scoped>
.server-message {
  text-align: center;
  color: v-bind('theme.normalmessage');
  padding: 4%;
}
</style>