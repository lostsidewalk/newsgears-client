<template>
  <v-btn
    id="logout" 
    :size="buttonSize"  
    accesskey="o"
    :title="$t('logout')" 
    append-icon="fa-sign-out"
    :text="$t('logout')"
    @click="logout"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "LogoutButton",
  mixins: [buttonSizeMixin], 
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
