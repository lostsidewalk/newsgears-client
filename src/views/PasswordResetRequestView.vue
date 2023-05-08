<template>
  <v-main>
    <PasswordResetRequestPanel ref="passwordReset" 
      :disabled="inTransit" 
      :theme="theme" />
  </v-main>
</template>

<script>
import PasswordResetRequestPanel from "@/components/password-reset-panel/PasswordResetRequestPanel.vue";

export default {
  name: "PasswordResetRequestView",
  components: {
    PasswordResetRequestPanel,
  },
  props: ["baseUrl"],
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

<style>
.accessible-button {
  min-height: 3rem;
  min-width: 3rem;
}

@media (max-width: 640px) {
  .accessible-button {
    min-height: 1.5rem;
    min-width: 1.5rem;
  }
}

@media (max-width: 480px) {
  .accessible-button {
    min-height: unset;
    min-width: unset;
  }
}
</style>
