<template>
  <v-btn id="login" depressed outlined black
    class="login-button"
    :disabled="disabled"
    @click="this.$router.push('/app')">
    {{ this.$t('login') }}
  </v-btn>
</template>

<script>
export default {
  name: "LoginButton",
  props: [ "disabled", "theme" ],
}
</script>

<style scoped>
.login-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>