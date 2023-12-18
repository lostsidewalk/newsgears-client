<template>
  <v-btn
    :size="buttonSize"
    accesskey="t"
    :title="$t('settings')" 
    :aria-label="$t('settings')" 
    append-icon="fa-gears"
    :text="$t('settings')"
    @click="$emit('showSettings')"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "SettingsButton",
  mixins: [buttonSizeMixin], 
  emits: [ "showSettings" ],
}
</script>
