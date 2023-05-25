<template>
  <v-btn-group>
    <v-btn
      icon="fa-list"
      :disabled="showListLayout"
      :title="$t('listLayout')"
      @click="$emit('list')"
    />
    <v-btn
      icon="fa-th"
      :disabled="showCardLayout"
      :title="$t('cardLayout')"
      @click="$emit('card')"
    />
  </v-btn-group>
</template>

<script>
export default {
  name: "FeedLayout",
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
