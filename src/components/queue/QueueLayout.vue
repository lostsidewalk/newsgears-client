<template>
  <v-btn-group>
    <v-btn
      :size="buttonSize"
      icon="fa-list"
      :disabled="showListLayout"
      :title="$t('listLayout')"
      @click="$emit('list')"
    />
    <v-btn
      :size="buttonSize"
      icon="fa-th"
      :disabled="showCardLayout"
      :title="$t('cardLayout')"
      @click="$emit('card')"
    />
  </v-btn-group>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueLayout",
  mixins: [buttonSizeMixin],
  props: {
    showListLayout: { type: Boolean, required: true },
    showCardLayout: { type: Boolean, required: true }
  },
  emits: [
    "list",
    "card",
  ]
}
</script>
