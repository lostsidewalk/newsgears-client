<template>
  <v-btn @click="this.$emit('toggle')" 
    size="x-small"
    :title="this.show ? this.$t('collapseThisPanel') : this.$t('restoreThisPanel')"
    :icon="this.show ? 'fa-compress' : 'fa-expand'" />
</template>

<script>
export default {
  name: "MinMaxButton",
  props: [ "theme", "show" ],
  emits: [ "toggle" ],
}
</script>
