<template>
  <v-toolbar-items
    class="flex-grow-1 align-content-center"
  >
    <!-- feed fil ter input -->
    <v-text-field
      id="feed-filter"
      :placeholder="$t('filter')"
      :value="inboundQueueFilter" 
      class="ml-2 mr-2 rounded-0 feed-filter"
      variant="underlined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- sort direction button -->
    <v-btn
      :size="buttonSize"  
      :title="$t('toggleSortOrder')" 
      :aria-label="$t('toggleSortOrder')" 
      :icon="'fa-arrow-' + (inboundQueueSortOrder === 'ASC' ? 'up' : 'down')"
      @click="$emit('toggleSortOrder')"
    />
    <!-- refresh queue button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-refresh"
      :title="showQueueRefreshIndicator ? $t('refreshForLatest') : $t('refreshQueues')"
      :aria-label="$t('refreshQueues')"
      :color="showQueueRefreshIndicator ? 'red' : 'primary'"
      @click="$emit('refreshFeeds')"
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
      :title="$t('toggleFeedFilterPills')"  
      :aria-label="$t('toggleFeedFilterPills')"
      @click.stop="$emit('toggleFeedFilterPills')"
    />
  </v-toolbar-items>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "FeedFilter",
  mixins: [buttonSizeMixin], 
  props: {
    inboundQueueFilter: { type: String, required: true },
    inboundQueueSortOrder: { type: String, required: true },
    showQueueRefreshIndicator: { type: Boolean, default: false },
  },
  emits: [
    "toggleSortOrder",
    "toggleFeedFilterPills",
    "refreshFeeds", 
    "markAsRead", 
    "update:modelValue",
  ],
}
</script>
