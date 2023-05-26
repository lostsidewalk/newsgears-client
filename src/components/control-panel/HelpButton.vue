<template>
  <v-btn
    :size="buttonSize" 
    accesskey="h"
    :title="$t('help')" 
    :append-icon="expanded ? 'fa-compress' : 'fa-expand'"
    :text="$t('help')"
    @click="$emit('showHelp')"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "HelpButton", 
  mixins: [buttonSizeMixin], 
  props: { 
    expanded: { type: Boolean, default: false }
  },
  emits: [ "showHelp" ],
}
</script>
