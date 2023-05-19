<template>
  <v-card class="feed-filter">
    <!-- feed filter label -->
    <v-card-title class="pa-4">
      {{ queueName }} {{ '(' + queueLength + ')' }}
    </v-card-title>
    <v-card-subtitle class="feed-filter d-flex flex-column">
      <!-- feed filter input -->
      <v-text-field
        id="feed-filter" 
        type="text" 
        class="feed-filter-input" 
        :placeholder="$t('filter')"
        :value="inboundQueueFilter" 
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </v-card-subtitle>
    <v-divider />
    <v-card-actions>
      <!-- sort direction button -->
      <v-btn
        size="x-small" 
        :title="$t('toggleSortOrder')" 
        :aria-label="$t('toggleSortOrder')" 
        :icon="'fa-arrow-' + (inboundQueueSortOrder === 'ASC' ? 'up' : 'down')"
        @click="$emit('toggleSortOrder')"
      />
      <!-- refresh feed button -->
      <v-btn
        size="x-small"
        icon="fa-refresh"
        :title="$t('refreshQueues')"
        :aria-label="$t('refreshQueues')"
        @click="$emit('refreshFeeds')"
      />
      <!-- mark as read button -->
      <v-btn
        size="x-small"
        icon="fa-eye"
        :title="$t('markQueueAsRead')"  
        :aria-label="$t('markQueueAsRead')"
        @click.stop="$emit('markAsRead')"
      />
      <v-chip-group
        v-if="allFilterPills"
        class="padding-0"
      >
        <v-chip
          v-for="filterPill in allFilterPills"
          :key="filterPill" 
          elevation="2"
          variant="text"
          class="ma-2"
          size="x-small"
          :title="filterPill.title"
          @click="filterPill.invoke"
        >
          <v-img
            v-if="filterPill.image" 
            :src="filterPill.image" 
            max-height="24" 
            max-width="24"
          />
          {{ filterPill.label }}
        </v-chip>
      </v-chip-group>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FeedFilter", 
  props: {
    queueName: { type: String, required: true },
    queueLength: { type: Number, required: true },
    inboundQueueFilter: { type: String, required: true },
    inboundQueueSortOrder: { type: String, required: true },
    allFilterPills: { type: String, required: true },
  },
  emits: [
    "toggleSortOrder",
    "refreshFeeds", 
    "markAsRead", 
    "update:modelValue",
  ],
}
</script>
