<template>
  <v-btn depressed outlined 
    class="signup-button"
    :disabled="disabled"
    @click="this.$router.push('/register')">
    {{ this.$t('createAnAccount') }}
  </v-btn>
</template>

<script>
export default {
  name: "SignUpButton",
  props: [ "disabled", "theme" ],
}
</script>

<style scoped>
.signup-button {
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>