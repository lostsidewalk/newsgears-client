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
      :size="xs ? 'x-small' : 'small'"  
      :title="$t('toggleSortOrder')" 
      :aria-label="$t('toggleSortOrder')" 
      :icon="'fa-arrow-' + (inboundQueueSortOrder === 'ASC' ? 'up' : 'down')"
      @click="$emit('toggleSortOrder')"
    />
    <!-- refresh feed button -->
    <v-btn
      :size="xs ? 'x-small' : 'small'" 
      icon="fa-refresh"
      :title="$t('refreshQueues')"
      :aria-label="$t('refreshQueues')"
      @click="$emit('refreshFeeds')"
    />
    <!-- mark as read button -->
    <v-btn
      :size="xs ? 'x-small' : 'small'" 
      icon="fa-eye"
      :title="$t('markQueueAsRead')"  
      :aria-label="$t('markQueueAsRead')"
      @click.stop="$emit('markAsRead')"
    />
    <!-- toggle filter pills button -->
    <v-btn
      :size="xs ? 'x-small' : 'small'" 
      icon="fa-list"
      :title="$t('toggleFeedFilterPills')"  
      :aria-label="$t('toggleFeedFilterPills')"
      @click.stop="$emit('toggleFeedFilterPills')"
    />
  </v-toolbar-items>
</template>

<script>
export default {
  name: "FeedFilter", 
  props: {
    inboundQueueFilter: { type: String, required: true },
    inboundQueueSortOrder: { type: String, required: true },
  },
  emits: [
    "toggleSortOrder",
    "toggleFeedFilterPills",
    "refreshFeeds", 
    "markAsRead", 
    "update:modelValue",
  ],
  computed: {
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
}
</script>
