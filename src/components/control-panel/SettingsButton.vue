<template>
  <v-btn
    :size="buttonSize"
    accesskey="t"
    :title="$t('settings')" 
    :aria-label="$t('goToSettingsAriaLabel')"
    :append-icon="expanded ? 'fa-compress' : 'fa-expand'"
    :text="$t('settings')"
    @click="$emit('showSettings')"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "SettingsButton",
  mixins: [buttonSizeMixin], 
  props: { 
    expanded: { type: Boolean, default: false }
  },
  emits: [ "showSettings" ],
}
</script>
