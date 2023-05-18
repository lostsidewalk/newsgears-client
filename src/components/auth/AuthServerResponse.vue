<template>
  <v-alert v-if="this.serverMessage && !this.$auth.$isAuthenticated" class="ma-4 text-align-cener" type="error" theme="dark">
    {{ this.serverMessage }}
  </v-alert>
</template>

<script>
export default {
  name: "AuthServerResponse",
  props: [ "serverMessage", "theme" ]
}
</script>
