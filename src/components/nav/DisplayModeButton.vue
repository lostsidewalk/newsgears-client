<template>
  <button class="mode-switch-button" @click="this.$theme.switchMode();" accesskey="l" :disabled="disabled" aria-label="Switch to light or dark mode">
    <span class="fa fa-lightbulb-o" /> <!-- use fa-moon-o for dark mode -->
  </button>
</template>

<script>
export default {
  name: "DisplayModeButton",
  props: [ "disabled", "theme" ],
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
  border-radius: 3px;
  margin: .56rem;
  text-align: center;
}

.mode-switch-button:disabled {
  cursor: auto;
}

.mode-switch-button:hover, .mode-switch-button:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.mode-switch-button:hover:disabled {
  background-color: unset;
}
</style>
