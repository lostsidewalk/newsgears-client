<template>
  <v-card class="feed-filter">
    <!-- feed filter label -->
    <v-card-title class="pa-4">
      {{ this.queueName }} {{ '(' + this.queueLength + ')' }}
    </v-card-title>
    <v-card-subtitle  class="feed-filter d-flex flex-column">
      <!-- feed filter input -->
      <v-text-field @input="this.$emit('update:modelValue', $event.target.value)" 
        id="feed-filter" 
        type="text" 
        class="feed-filter-input"
        :placeholder="this.$t('filter')" 
        :value="inboundQueueFilter" />
    </v-card-subtitle>
    <v-divider />
    <v-card-actions>
      <!-- sort direction button -->
      <v-btn @click="this.$emit('toggleSortOrder')" 
        size="x-small" 
        :title="this.$t('toggleSortOrder')" 
        :aria-label="this.$t('toggleSortOrder')"
        :icon="'fa-arrow-' + (this.inboundQueueSortOrder === 'ASC' ? 'up' : 'down')" />
      <!-- refresh feed button -->
      <v-btn @click="this.$emit('refreshFeeds')"
        size="x-small"
        icon="fa-refresh"
        :title="this.$t('refreshQueues')"
        :aria-label="this.$t('refreshQueues')" />
      <!-- mark as read button -->
      <v-btn @click.stop="this.$emit('markAsRead')"
        size="x-small"
        icon="fa-eye"  
        :title="this.$t('markQueueAsRead')"
        :aria-label="this.$t('markQueueAsRead')" />
      <v-chip-group class="padding-0" v-if="this.allFilterPills">
        <v-chip v-for="filterPill in this.allFilterPills" :key="filterPill" 
          elevation="2" variant="text"
          class="ma-2"
          size="x-small"
          :title="filterPill.title"
          @click="filterPill.invoke">
          <v-img v-if="filterPill.image" 
            :src="filterPill.image" 
            max-height="24" 
            max-width="24" />
          {{ filterPill.label }}
        </v-chip>
      </v-chip-group>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FeedFilter", 
  props: [
    "queueName", // the name of the queue being filtered (the selected queue) 
    "queueLength", // the number of articles in the queue 
    "inboundQueueFilter", // the lunrjs query text 
    "inboundQueueSortOrder", // the sort order 
    "allFilterPills", // the entire set of filter pills (modes, subscriptions, categories, etc.)
    // 
    "theme"
  ],
  emits: [
    "toggleSortOrder",
    "refreshFeeds", 
    "markAsRead", 
    "update:modelValue",
  ],
}
</script>
