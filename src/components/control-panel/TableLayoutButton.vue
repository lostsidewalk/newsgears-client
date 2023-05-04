<template>
  <button class="mode-switch-button accessible-button" 
    @click="cycleTableLayout" 
    accesskey="b" 
    :disabled="disabled" 
    :title="this.$t('cycleTableLayout')"
    :aria-label="this.$t('cycleTableLayoutAriaLabel')">
    <span class="fa fa-list" />
  </button>
</template>

<script>
export default {
  name: "TableLayoutButton",
  props: ["disabled", "theme"],
  methods: {
    cycleTableLayout() {
      this.$theme.cycleTableLayout();
    }
  },
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