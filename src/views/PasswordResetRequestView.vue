<template>
  <div id="home" style="height: 100%;">
    <PasswordResetRequestPanel ref="passwordReset" 
      :disabled="inTransit" 
      :theme="theme" />
  </div>
</template>

<script>
import PasswordResetRequestPanel from "@/components/auth/PasswordResetRequestPanel.vue";

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

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>
