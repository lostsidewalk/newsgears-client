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
      icon="fa-bars"
      :disabled="disableCardLayout"
      :title="$t('cardLayout')"
      @click="$emit('card')"
    />
    <v-btn
      :size="buttonSize"
      icon="fa-table"
      :disabled="disableTableLayout"
      :title="$t('tableLayout')"
      @click="$emit('table')"
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
    disableCardLayout: { type: Boolean, required: true },
    disableTableLayout: { type: Boolean, required: true }
  },
  emits: [
    "list",
    "card",
    "table",
  ]
}
</script>
