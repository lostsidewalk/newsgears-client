<template>
  <v-btn
    size="small" 
    accesskey="h"
    :title="$t('help')" 
    :append-icon="expanded ? 'fa-compress' : 'fa-expand'"
    :text="$t('help')"
    @click="$emit('showHelp')"
  />
</template>

<script>
export default {
  name: "HelpButton", 
  props: { 
    expanded: { type: Boolean, default: false }
  },
  emits: [ "showHelp" ],
}
</script>
