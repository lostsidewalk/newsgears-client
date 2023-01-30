<template>
  <div id="home">
    <PasswordUpdatePanel ref="passwordUpdate" 
      :inTransit="this.inTransit" 
      :theme="theme" 
      @updateInTransit="this.inTransit = $event" />
  </div>
</template>

<script>
import PasswordUpdatePanel from "@/components/auth/PasswordUpdatePanel.vue";

export default {
  name: "PasswordResetCallbackView",
  components: {
      PasswordUpdatePanel
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
