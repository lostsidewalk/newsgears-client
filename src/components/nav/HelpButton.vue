<template>
  <button class="help-button accessible-button" 
    @click="this.$emit('showHelp')" 
    accesskey="h" 
    :aria-label="this.$t('goToHelpAriaLabel')">
    {{ this.$t('help') }} &nbsp; <span class="fa" :class="this.expanded ? 'fa-compress' : 'fa-expand'" />
  </button>
</template>

<script>
export default {
  name: "HelpButton", 
  props: [ "disabled", "theme", "expanded" ],
  emits: [ "showHelp" ],
}
</script>

<style scoped>
.help-button {
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

.help-button:disabled {
  cursor: auto;
}

.help-button:hover, .help-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.help-button:hover:disabled {
  background-color: unset;
}
</style>
