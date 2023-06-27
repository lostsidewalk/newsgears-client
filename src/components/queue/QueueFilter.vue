<template>
  <v-toolbar-items
    class="flex-grow-1 align-content-center"
  >
    <!-- queue filter input -->
    <v-text-field
      id="queue-filter"
      :placeholder="$t('filter')"
      :value="filter" 
      class="ml-2 mr-2 rounded-0 queue-filter"
      variant="underlined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </v-toolbar-items>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueFilter",
  mixins: [buttonSizeMixin], 
  props: {
    filter: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
}
</script>
