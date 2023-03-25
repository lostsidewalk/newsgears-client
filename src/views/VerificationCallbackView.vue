<template>
  <div>
    <div class="thanks-for-verifying">
      {{ this.$t('thanksForVerifying') }}
    </div>
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
  color: v-bind('theme.normalmessage');
  margin: 4rem;
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
