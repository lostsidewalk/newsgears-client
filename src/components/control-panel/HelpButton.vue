<template>
  <v-btn
    :size="buttonSize" 
    accesskey="h"
    :title="$t('help')" 
    append-icon="fa-question"
    :text="$t('help')"
    @click="$emit('showHelp')"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "HelpButton", 
  mixins: [buttonSizeMixin], 
  emits: [ "showHelp" ],
}
</script>
