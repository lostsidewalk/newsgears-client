<template>
  <v-sheet>
    <v-alert
      v-if="shouldShowAlert('thisIsYourQueueDashboard')"
      closable
      variant="outlined"
      border="top"
      icon="fa-question-circle"
      :text="t('thisIsYourQueueDashboard')"
      class="ma-4"
      @click.close="dismissAlert('thisIsYourQueueDashboard')"
    />
    <v-hover
      v-for="queue in queueStore.queues"
      v-slot="{ isHovering, props }"
      :key="queue.value"
    >
      <QueueSelectButton
        variant="flat"
        :elevation="isHovering ? 12 : 0"
        :queue="queue"
        :article-list="queueStore.articleListsByQueue[queue.id]"
        :feed-url="feedUrl"
        class="ma-4"
        :class="queueStore.selectedQueueId === queue.id ? 'selected-queue' : ''"
        :is-selected="queueStore.selectedQueueId === queue.id"
        v-bind="props"
        @click.stop="$emit('selectQueue', { queueId: queue.id })"
        @manageSubscriptions="$emit('openQueueConfigPanel', { queueId: queue.id })"
        @updateFilter="$event => $emit('updateFilter', $event)"
        @showSubscriptionMetrics="$event => $emit('openSubscriptionMetrics', $event)"
      />
    </v-hover>
  </v-sheet>
</template>

<script>
import QueueSelectButton from './QueueSelectButton.vue';

import { useI18n } from 'vue-i18n';
import { useNotifications } from '@/composable/useNotifications';
import { useQueues } from '@/composable/useQueues';

export default {
    components: {
        QueueSelectButton
    },
    props: {
        baseUrl: { type: String, required: true },
        feedUrl: { type: String, required: true },
    },
    setup(props) {
        const {
            t,
        } = useI18n();
        const {
            shouldShowAlert,
            dismissAlert,
        } = useNotifications();
        const {
            queueStore,
        } = useQueues(props);

        return {
            t,
            shouldShowAlert,
            dismissAlert,
            queueStore,
        }
    }
}
</script>

