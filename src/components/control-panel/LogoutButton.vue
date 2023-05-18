<template>
  <v-btn @click="logout" 
    id="logout" 
    size="small"
    accesskey="o" 
    :title="this.$t('logout')"
    append-icon="fa-sign-out"
    :text="this.$t('logout')" />
</template>

<script>
export default {
  name: "LogoutButton",
  props: [ "theme" ],
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
