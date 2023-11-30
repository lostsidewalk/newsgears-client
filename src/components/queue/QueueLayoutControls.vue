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
    <!-- refresh queue button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-refresh"
      :title="showQueueRefreshIndicator ? $t('refreshForLatest') : $t('refreshQueues')"
      :aria-label="$t('refreshQueues')"
      :color="showQueueRefreshIndicator ? 'red' : ''"
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
    <!-- sort direction button -->
    <v-btn
      :size="buttonSize"  
      :title="$t('toggleSortOrder')" 
      :aria-label="$t('toggleSortOrder')" 
      :icon="'fa-arrow-' + (sortOrder === 'ASC' ? 'up' : 'down')"
      @click="$emit('toggleSortOrder')"
    />
    <!-- toggle filter pills button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-tag"
      :title="$t('toggleFilterPills')" 
      :aria-label="$t('toggleFilterPills')"
      @click.stop="$emit('toggleQueueFilterPills')"
    />
  </v-btn-group>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueLayoutControls",
  mixins: [buttonSizeMixin],
  props: {
    disableListLayout: { type: Boolean, required: true },
    disableCardLayout: { type: Boolean, required: true },
    disableTableLayout: { type: Boolean, required: true },
    showQueueRefreshIndicator: { type: Boolean, default: false },
    sortOrder: { type: String, required: true },
  },
  emits: [
    "list",
    "card",
    "table",
    "toggleQueueFilterPills",
    "refreshQueues",
    "markAsRead",
    "toggleSortOrder",
  ]
}
</script>
