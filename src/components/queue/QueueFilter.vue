<template>
  <!-- queue filter input -->
  <v-text-field
    id="queue-filter"
    :placeholder="$t('filter')"
    :aria-label="$t('filter')"
    :value="filter" 
    variant="underlined"
    bg-color="transparent"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  name: "QueueFilter",
  props: {
    filter: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
}
</script>
