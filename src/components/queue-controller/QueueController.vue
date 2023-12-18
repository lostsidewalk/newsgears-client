<template>
  <v-card>
    <!-- queue title -->
    <v-card-title
      v-if="queueStore.selectedQueueId"
      class="font-weight-bold d-flex flex-row justify-space-between align-center"
    >
      <span>{{ queueStore.selectedQueueTitle }}</span>
      <v-btn 
        variant="tonal"
        :icon="collapsed ? 'fa-expand' : 'fa-compress'"
        :size="buttonSize"
        @click="$emit(collapsed ? 'expand' : 'collapse')"
      />
    </v-card-title>
    <!-- divider -->
    <v-divider
      v-if="!collapsed"
      class="my-1"
    />
    <!-- queue description -->
    <v-card-subtitle
      v-if="queueStore.selectedQueueId && !collapsed"
    >
      {{ queueStore.selectedQueueDescription }}
    </v-card-subtitle>
    <v-card-actions
      v-if="!collapsed"
      class="d-flex flex-column"
    >
      <!-- queue filter input -->
      <QueueFilter
        class="w-100"
        :base-url="baseUrl"
        :queue-length="filteredArticleList.length"
        :queue-name="queueStore.selectedQueueTitle"
        :queues="queueStore.queues"
        @updateArticleListFilter="$emit('updateArticleListFilter', $event)"
      />
      <!-- queue operations -->
      <QueueOperations
        :base-url="baseUrl"
        :disable-list-layout="showListLayout"
        :disable-card-layout="showCardLayout"
        :disable-table-layout="showTableLayout"
        :show-queue-refresh-indicator="showQueueRefreshIndicator"
        :sort-order="queueStore.articleListSortOrder"
        :show-unread="queueStore.showUnreadPosts"
        :show-read="queueStore.showReadPosts"
        :show-read-later="queueStore.showReadLaterPosts"
        @newQueue="$emit('newQueue', $event)"
        @uploadOpml="$emit('uploadOpml', $event)"
        @list="$emit('switchToListLayout')"
        @card="$emit('switchToCardLayout')"
        @table="$emit('switchToTableLayout')"
        @refreshQueues="$emit('refreshQueues')"
        @markAsRead="$emit('markAsRead', $event)"
        @toggleSortOrder="$emit('toggleArticleListSortOrder')"
        @toggleUnreadPosts="$emit('toggleUnreadPosts')"
        @toggleReadPosts="$emit('toggleReadPosts')"
        @toggleReadLaterPosts="$emit('toggleReadLaterPosts')"
        @manageSubscriptions="$emit('openQueueConfigPanel', { queueId: queueStore.selectedQueueId })"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
// queue operations 
import QueueOperations from "./QueueOperations.vue";
// queue filter
import QueueFilter from "./QueueFilter.vue";
import buttonSizeMixin from "@/mixins/buttonSizeMixin";

import { useQueues } from "@/composable/useQueues";

export default {
  name: "QueueController",
  components: {
    QueueOperations,
    QueueFilter,
  },
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
    showListLayout: { type: Boolean, required: true },
    showCardLayout: { type: Boolean, required: true },
    showTableLayout: { type: Boolean, required: true },
    showQueueRefreshIndicator: { type: Boolean, required: true },
    filteredArticleList: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
  },
  emits: [
    "updateArticleListFilter", 
    "newQueue",
    "uploadOpml",
    "switchToListLayout",
    "switchToCardLayout",
    "switchToTableLayout", 
    "refreshQueues", 
    "markAsRead",
    "toggleArticleListSortOrder", 
    "toggleUnreadPosts", 
    "toggleReadPosts", 
    "toggleReadLaterPosts", 
    "openQueueConfigPanel", 
  ],
  setup(props) {
    const {
      queueStore
    } = useQueues(props);

    return {
      queueStore,
    }
  }
};
</script>
