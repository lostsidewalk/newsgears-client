<template>
  <v-btn id="logout" 
    class="logout-button accessible-button" 
    @click="logout" 
    accesskey="o" 
    :disabled="disabled"
    :title="this.$t('logout')">
    {{ this.$t('logout') }} 
  </v-btn>
</template>

<script>
export default {
  name: "LogoutButton",
  props: [ "disabled", "theme" ],
  methods: {
    logout() {
      this.$auth.logout()
      .catch((error) => {
        console.error("unable to logout due to: " + error);
      }).finally(() => {
        console.log("logout complete");
      });
    }
  }
}
</script>

<style scoped>
.logout-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>
