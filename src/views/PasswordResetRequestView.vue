<template>
  <div id="home">
    <PasswordResetRequestPanel ref="passwordReset" 
      :inTransit="this.inTransit" 
      :theme="theme" 
      @updateInTransit="this.inTransit = $event"/>
    <!-- "go back" link -->
    <GoBack :theme="theme" />
  </div>
</template>

<script>
import PasswordResetRequestPanel from "@/components/auth/PasswordResetRequestPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "PasswordResetRequestView",
  components: {
      PasswordResetRequestPanel,
      GoBack,
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
  margin-left: 3%;
  margin-right: 3%;
}
</style>
