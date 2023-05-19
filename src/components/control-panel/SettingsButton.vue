<template>
  <v-btn
    size="small"     
    accesskey="t"
    :title="$t('settings')" 
    :aria-label="$t('goToSettingsAriaLabel')"
    :append-icon="expanded ? 'fa-compress' : 'fa-expand'"
    :text="$t('settings')"
    @click="$emit('showSettings')"
  />
</template>

<script>
export default {
  name: "SettingsButton", 
  props: { 
    expanded: { type: Boolean, default: false }
  },
  emits: [ "showSettings" ],
}
</script>
