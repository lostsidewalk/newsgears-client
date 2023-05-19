<template>
  <v-btn
    size="x-small" 
    :title="show ? $t('collapseThisPanel') : $t('restoreThisPanel')"
    :icon="show ? 'fa-compress' : 'fa-expand'"
    @click="$emit('toggle')"
  />
</template>

<script>
export default {
  name: "MinMaxButton",
  props: {
    show: { type: Boolean, default: false }
  },
  emits: [ "toggle" ],
}
</script>
