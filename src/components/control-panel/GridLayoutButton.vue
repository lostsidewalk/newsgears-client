<template>
  <v-btn class="mode-switch-button accessible-button" 
    @click="cycleGridLayout" 
    accesskey="g" 
    :disabled="disabled || inTransit" 
    :title="this.$t('cycleGridLayout')"
    :aria-label="this.$t('cycleGridLayoutAriaLabel')">
    <span class="fa fa-th" />
  </v-btn>
</template>

<script>
export default {
  name: "GridLayoutButton",
  props: ["disabled", "inTransit", "theme"],
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  methods: {
    cycleGridLayout() {
      if (this.windowWidth > 1023) {
        this.$theme.cycleGridLayout();
      } else {
        this.$theme.compactGridLayout();
      }
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth,
    }
  }
}
</script>

<style scoped>
.mode-switch-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}

</style>