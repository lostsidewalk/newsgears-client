<template>
  <v-btn class="settings-button accessible-button" 
    @click="this.$emit('showSettings')" 
    accesskey="t" 
    :disabled="disabled" 
    :title="this.$t('settings')"
    :aria-label="this.$t('goToSettingsAriaLabel')">
    {{ this.$t('settings') }} &nbsp; <span class="fa" :class="this.expanded ? 'fa-compress' : 'fa-expand'" />
  </v-btn>
</template>

<script>
export default {
  name: "SettingsButton", 
  props: [ "disabled", "theme", "expanded" ],
  emits: [ "showSettings" ],
}
</script>

<style scoped>
.settings-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>
