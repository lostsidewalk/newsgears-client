<template>
  <button class="mode-switch-button accessible-button" 
    @click="cycleGridLayout" 
    accesskey="g" 
    :disabled="disabled || inTransit" 
    :title="this.$t('cycleGridLayout')"
    :aria-label="this.$t('cycleGridLayoutAriaLabel')">
    <span class="fa fa-th" />
  </button>
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
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 4px;
  margin: .56rem;
  text-align: center;
}

.mode-switch-button:disabled {
  cursor: auto;
}

.mode-switch-button:hover, .mode-switch-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.mode-switch-button:hover:disabled {
  background-color: unset;
}
</style>