<template>
  <v-btn-group>
    <v-btn
      :size="buttonSize"
      icon="fa-list"
      :disabled="disableListLayout"
      :title="$t('listLayout')"
      @click="$emit('list')"
    />
    <v-btn
      :size="buttonSize"
      icon="fa-th"
      :disabled="disableCardLayout"
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
    disableListLayout: { type: Boolean, required: true },
    disableCardLayout: { type: Boolean, required: true }
  },
  emits: [
    "list",
    "card",
  ]
}
</script>
