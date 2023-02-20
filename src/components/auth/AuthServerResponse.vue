<template>
    <div v-if="this.serverMessage && !this.$auth.$isAuthenticated" class="server-message">
      <span>
        {{ this.serverMessage }}
      </span>
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
</style>
