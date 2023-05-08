<template>
  <v-main>
    <RegistrationRequestPanel ref="registration" 
      :disabled="this.inTransit" 
      :theme="theme" />
  </v-main>
</template>

<script>
import RegistrationRequestPanel from "@/components/registration-panel/RegistrationRequestPanel.vue";

export default {
  name: "RegistrationRequestView",
  components: {
    RegistrationRequestPanel,
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
