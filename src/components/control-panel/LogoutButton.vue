<template>
  <v-btn
    id="logout" 
    size="small" 
    accesskey="o"
    :title="$t('logout')" 
    append-icon="fa-sign-out"
    :text="$t('logout')"
    @click="logout"
  />
</template>

<script>
export default {
  name: "LogoutButton",
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
