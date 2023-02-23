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
