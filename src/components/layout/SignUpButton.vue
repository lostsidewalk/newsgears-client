<template>
  <v-btn
    elevation="1"
    class="signup-button flex-grow-1"
    variant="tonal"
    prepend-icon="fa-user"
    :text="$t('createAnAccount')" 
    @click="$router.push('/register')"
  />
</template>

<script>
export default {
  name: "SignUpButton",
}
</script>

<style scoped>
.signup-button {
  min-height: 3rem;
  font-weight: bold;
}
</style>