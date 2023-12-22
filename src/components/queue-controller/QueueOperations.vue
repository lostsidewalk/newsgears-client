<template>
  <v-btn-group class="d-flex flex-wrap">
    <!-- new queue button -->
    <v-btn
      :size="buttonSize"
      :title="$t('createNewQueue')"
      icon="fa-plus"
      @click.stop="$emit('newQueue')"
    />
    <!-- upload OPML button -->
    <v-btn
      :size="buttonSize"
      :title="$t('uploadOPML')"
      icon="fa-file"
      @click.stop="$emit('uploadOpml')"
    />
    <!-- divider -->
    <v-divider
      class="px-1"
      vertical
    />
    <!-- list layout button -->
    <v-btn
      :size="buttonSize"
      icon="fa-list"
      :disabled="disableListLayout"
      :title="$t('listLayout')"
      @click="$emit('list')"
    />
    <!-- card layout -->
    <v-btn
      :size="buttonSize"
      icon="fa-bars"
      :disabled="disableCardLayout"
      :title="$t('cardLayout')"
      @click="$emit('card')"
    />
    <!-- table layout -->
    <v-btn
      :size="buttonSize"
      icon="fa-table"
      :disabled="disableTableLayout"
      :title="$t('tableLayout')"
      @click="$emit('table')"
    />
    <!-- divider -->
    <v-divider
      class="px-1"
      vertical
    />
    <!-- mark as read button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-check-square-o"
      :title="$t('markQueueAsRead')"  
      :aria-label="$t('markQueueAsRead')"
      @click.stop="$emit('markAsRead')"
    />
    <!-- divider -->
    <v-divider
      class="px-1"
      vertical
    />
    <!-- sort direction button -->
    <v-btn
      :size="buttonSize"  
      :title="$t('toggleSortOrder')" 
      :aria-label="$t('toggleSortOrder')" 
      :icon="'fa-arrow-' + (queueStore.articleListSortOrder === 'ASC' ? 'up' : 'down')"
      @click="$emit('toggleSortOrder')"
    />
    <!-- show unread -->
    <v-btn 
      :size="buttonSize" 
      icon="fa-eye"
      :title="queueStore.showUnreadPosts ? $t('hideUnread') : $t('showUnread')"
      :aria-label="queueStore.showUnreadPosts ? $t('hideUnread') : $t('showUnread')"
      :style="queueStore.showUnreadPosts ? 'mix-blend-mode: ' + ($vuetify.theme.name === 'dark' ? 'color-dodge' : 'multiply') : ''"
      @click="$emit('toggleUnreadPosts')"
    />
    <!-- show read -->
    <v-btn
      :size="buttonSize" 
      icon="fa-check-square-o"
      :title="queueStore.showReadPosts ? $t('hideRead') : $t('showRead')"
      :aria-label="queueStore.showReadPosts ? $t('hideRead') : $t('showRead')"
      :style="queueStore.showReadPosts ? 'mix-blend-mode: ' + ($vuetify.theme.name === 'dark' ? 'color-dodge' : 'multiply') : ''"
      @click="$emit('toggleReadPosts')"
    />
    <!-- show read-later -->
    <v-btn
      :size="buttonSize" 
      icon="fa-circle-o"
      :title="queueStore.showReadLaterPosts ? $t('hideReadLater') : $t('showReadLater')"
      :aria-label="queueStore.showReadLaterPosts ? $t('hideReadLater') : $t('showReadLater')"
      :style="queueStore.showReadLaterPosts ? 'mix-blend-mode: ' + ($vuetify.theme.name === 'dark' ? 'color-dodge' : 'multiply') : ''"
      @click="$emit('toggleReadLaterPosts')"
    />
    <!-- divider -->
    <v-divider
      class="px-1"
      vertical
    />
    <!-- refresh queue button -->
    <v-btn
      :size="buttonSize" 
      icon="fa-refresh"
      :title="showQueueRefreshIndicator ? $t('refreshForLatest') : $t('refreshQueues')"
      :aria-label="$t('refreshQueues')"
      :style="showQueueRefreshIndicator ? 'background-color: rgba(255,0,0,0.1)' : ''"
      @click="$emit('refreshQueues')"
    />
    <!-- manage subscriptions -->
    <v-btn
      :size="buttonSize" 
      icon="fa-gears"
      :title="$t('manageSubscriptions')"
      :aria-label="$t('manageSubscriptions')"
      @click="$emit('manageSubscriptions')"
    />
  </v-btn-group>
</template>

<script>
import { useQueues } from '@/composable/useQueues';

import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueOperations",
  mixins: [buttonSizeMixin],
  props: {
    disableListLayout: { type: Boolean, required: true },
    disableCardLayout: { type: Boolean, required: true },
    disableTableLayout: { type: Boolean, required: true },
    showQueueRefreshIndicator: { type: Boolean, default: false },
  },
  emits: [
    "newQueue",
    "uploadOpml",
    "list",
    "card",
    "table",
    "markAsRead",
    "toggleSortOrder",
    "toggleUnreadPosts",
    "toggleReadPosts",
    "toggleReadLaterPosts",
    "refreshQueues",
    "manageSubscriptions",
  ],
  setup(props) {
    const { queueStore } = useQueues(props);

    return {
      queueStore,
    }
  },
}
</script>
