<template>
  <v-btn
    id="logout" 
    :size="xs ? 'x-small' : 'small'"  
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
  computed: {
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      .catch((error) => {
        console.error("unable to logout due to: " + error);
      }).finally(() => {
        console.log("logout complete");
      });
    }
  },
}
</script>
