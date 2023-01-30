<template>
  <span>
    <button class="mode-switch-button" @click="this.$theme.switchMode();" :disabled="inTransit" aria-label="Switch to light or dark mode">
      <span class="fa fa-lightbulb-o" /> <!-- use fa-moon-o for dark mode -->
    </button>
  </span>
</template>

<script>
export default {
  name: "DisplayModeButton",
  props: [ "inTransit", "theme" ],
}
</script>

<style scoped>
.mode-switch-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: right;
  border-radius: 3px;
  margin: 9px;
  margin-right: 2%;
  text-align: center;
}

.mode-switch-button:disabled {
  cursor: auto;
}

.mode-switch-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.mode-switch-button:hover:disabled {
  background-color: unset;
}
</style>
