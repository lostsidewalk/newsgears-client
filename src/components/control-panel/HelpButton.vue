<template>
  <v-btn @click="this.$emit('showHelp')" 
    size="small"
    accesskey="h" 
    :title="this.$t('help')"
    :append-icon="this.expanded ? 'fa-compress' : 'fa-expand'"
    :text="this.$t('help')" />
</template>

<script>
export default {
  name: "HelpButton", 
  props: [ "theme", "expanded" ],
  emits: [ "showHelp" ],
}
</script>
