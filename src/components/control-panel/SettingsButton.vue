<template>
  <v-btn @click="this.$emit('showSettings')"     
    size="small"
    accesskey="t" 
    :title="this.$t('settings')"
    :aria-label="this.$t('goToSettingsAriaLabel')"
    :append-icon="this.expanded ? 'fa-compress' : 'fa-expand'"
    :text="this.$t('settings')" />
</template>

<script>
export default {
  name: "SettingsButton", 
  props: [ "theme", "expanded" ],
  emits: [ "showSettings" ],
}
</script>
