<template>
  <v-main>
    <PasswordUpdatePanel ref="passwordUpdate" 
      :disabled="inTransit" 
      :theme="theme" />
  </v-main>
</template>

<script>
import PasswordUpdatePanel from "@/components/password-update-panel/PasswordUpdatePanel.vue";

export default {
  name: "PasswordResetCallbackView",
  components: {
    PasswordUpdatePanel
  },
  props: [ "baseUrl" ],
  mounted() {
      this.inTransit = false;
  },
  data() {
      return {
        theme: this.$theme.currentTheme,
        inTransit: true
      };
  },
};
</script>
