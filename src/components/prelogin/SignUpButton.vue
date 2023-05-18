<template>
  <v-btn @click="this.$router.push('/register')"
    elevation="1"
    class="signup-button flex-grow-1"
    variant="tonal"
    prepend-icon="fa-user" 
    :text="this.$t('createAnAccount')" />
</template>

<script>
export default {
  name: "SignUpButton",
  props: [ "theme" ],
}
</script>

<style scoped>
.signup-button {
  min-height: 3rem;
  font-weight: bold;
}
</style>