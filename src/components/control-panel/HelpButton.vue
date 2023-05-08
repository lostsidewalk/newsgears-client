<template>
  <v-btn class="help-button accessible-button" 
    @click="this.$emit('showHelp')" 
    accesskey="h" 
    :title="this.$t('help')"
    :aria-label="this.$t('goToHelpAriaLabel')">
    {{ this.$t('help') }} &nbsp; <span class="fa" :class="this.expanded ? 'fa-compress' : 'fa-expand'" />
</v-btn>
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
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>
