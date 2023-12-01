<template>
  <div
    class="queue-container d-flex flex-grow-1 flex-column rounded justify-space-between flex-wrap"
  >
    <v-label
      v-if="queueStore.selectedQueueId"
      class="ma-2 font-weight-bold"
    >
      {{ roSelectedQueueTitle }}
    </v-label>
    <v-divider v-if="queueStore.selectedQueueId" />
    <QueueLayoutControls
      :disable-list-layout="showListLayout"
      :disable-card-layout="showCardLayout"
      :disable-table-layout="showTableLayout"
      :show-queue-refresh-indicator="showQueueRefreshIndicator"
      :sort-order="roArticleListSortOrder"
      @list="$emit('switchToListLayout')"
      @card="$emit('switchToCardLayout')"
      @table="$emit('switchToTableLayout')"
      @toggleQueueFilterPills="$emit('toggleQueueFilterPills')"
      @refreshQueues="$emit('refreshQueues')"
      @markAsRead="$emit('markAsRead', $event)"
      @toggleSortOrder="$emit('toggleArticleListSortOrder')"
    />
    <v-divider />
    <!-- queue filter  -->
    <QueueFilter
      :queue-length="filteredArticleList.length"
      :queue-name="roSelectedQueueTitle"
      :queues="queueStore.queues"
      @updateArticleListFilter="$emit('updateArticleListFilter', $event)"
    />
    <QueueFilterPills
      v-if="queueStore.selectedQueueId && roShowQueueFilterPills"
      :show-unread="roShowUnreadPosts"
      :show-read="roShowReadPosts"
      :show-read-later="roShowReadLaterPosts"
      @toggleUnread="$emit('toggleUnreadPosts')"
      @toggleRead="$emit('toggleReadPosts')"
      @toggleReadLater="$emit('toggleReadLaterPosts')"
    />
  </div>
</template>

<script>
// queue layout controls
import QueueLayoutControls from "./QueueLayoutControls.vue";
// queue filter
import QueueFilter from "./QueueFilter.vue";
import QueueFilterPills from "./QueueFilterPills.vue";

import { useQueues } from "@/composable/useQueues";

export default {
  components: {
    QueueLayoutControls,
    QueueFilter,
    QueueFilterPills,
  },
  props: {
    showListLayout: { type: Boolean, required: true },
    showCardLayout: { type: Boolean, required: true },
    showTableLayout: { type: Boolean, required: true },
    showQueueRefreshIndicator: { type: Boolean, required: true },
    filteredArticleList: { type: Array, required: true },
  },
  setup(props) {
    const {
      roSelectedQueueTitle,
      roArticleListSortOrder,
      roShowQueueFilterPills,
      roShowUnreadPosts,
      roShowReadPosts,
      roShowReadLaterPosts,
      queueStore
    } = useQueues(props);

    return {
      roSelectedQueueTitle,
      roArticleListSortOrder,
      roShowQueueFilterPills, 
      roShowUnreadPosts,
      roShowReadPosts,
      roShowReadLaterPosts,
      queueStore,
    }
  }
};
</script>

<style scoped>
.queue-container {
  background-color: transparent;
  gap: 2rem;
}
</style>
