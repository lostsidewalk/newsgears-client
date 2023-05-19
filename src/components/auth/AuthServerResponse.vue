<template>
  <v-alert
    v-if="serverMessage && !$auth.$isAuthenticated"
    class="ma-4 text-align-cener"
    type="error"
    theme="dark"
  >
    {{ serverMessage }}
  </v-alert>
</template>

<script>
export default {
  name: "AuthServerResponse",
  props: { 
    serverMessage: { type: String, default: '' } 
  }
}
</script>
