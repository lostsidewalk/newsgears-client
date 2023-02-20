<template>
  <div>
    <div class="thanks-for-verifying">Thanks for verifying!  Your account status has been updated.</div>
    <!-- "go back" link -->
    <GoBack :disabled="false" :theme="theme" />
  </div>
</template>

<script>
import GoBack from '@/components/layout/GoBack.vue';

export default {
  name: "VerificationCallbackView",
  components: {
    GoBack,
  },
  props: [],
  data() {
      return {
        theme: this.$theme.currentTheme,
      };
  },
};
</script>

<style scoped>
.thanks-for-verifying {
  color: v-bind('theme.highlightedmessage');
  margin: 4rem;
}
</style>
