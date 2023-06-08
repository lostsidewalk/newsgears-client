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
    <!-- sort direction button -->
    <v-btn
      :size="buttonSize"  
      :title="$t('toggleSortOrder')" 
      :aria-label="$t('toggleSortOrder')" 
      :icon="'fa-arrow-' + (sortOrder === 'ASC' ? 'up' : 'down')"
      @click="$emit('toggleSortOrder')"
    />
    <!-- refresh queue button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-refresh"
      :title="showQueueRefreshIndicator ? $t('refreshForLatest') : $t('refreshQueues')"
      :aria-label="$t('refreshQueues')"
      :color="showQueueRefreshIndicator ? 'red' : 'primary'"
      @click="$emit('refreshQueues')"
    />
    <!-- mark as read button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-check-square-o"
      :title="$t('markQueueAsRead')"  
      :aria-label="$t('markQueueAsRead')"
      @click.stop="$emit('markAsRead')"
    />
    <!-- toggle filter pills button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-tag"
      :title="$t('toggleFilterPills')" 
      :aria-label="$t('toggleFilterPills')"
      @click.stop="$emit('toggleQueueFilterPills')"
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
    sortOrder: { type: String, required: true },
    showQueueRefreshIndicator: { type: Boolean, default: false },
  },
  emits: [
    "toggleSortOrder",
    "toggleQueueFilterPills",
    "refreshQueues", 
    "markAsRead", 
    "update:modelValue",
  ],
}
</script>
