<template>
  <div id="home">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <RegistrationRequestPanel ref="registration" 
      :disabled="this.inTransit" 
      :theme="theme" />
  </div>
</template>

<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import RegistrationRequestPanel from "@/components/auth/RegistrationRequestPanel.vue";

export default {
  name: "RegistrationRequestView",
  components: {
    NavbarFixedHeader,
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

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>

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
