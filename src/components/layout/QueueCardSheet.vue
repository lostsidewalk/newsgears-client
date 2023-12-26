<template>
  <v-sheet>
    <v-alert
      v-if="shouldShowAlert('thisIsYourQueueDashboard')"
      closable
      variant="outlined"
      border="top"
      icon="fa-question-circle"
      :text="t('thisIsYourQueueDashboard')"
      :class="ma4r"
      @click.close="dismissAlert('thisIsYourQueueDashboard')"
    />
    <v-card>
      <v-card-title class="text-center">
        {{ $t('queueDashboard') }}
      </v-card-title>
    </v-card>

    <v-hover
      v-for="queue in queueStore.queues"
      v-slot="{ isHovering, props }"
      :key="queue.value"
    >
      <QueueCard
        variant="flat"
        :elevation="isHovering ? 12 : 0"
        :queue="queue"
        :class="ma4r + (queueStore.selectedQueueId === queue.id ? ' selected-queue' : '')"
        v-bind="props"
        @selectQueue="$emit('selectQueue', { queueId: queue.id })"
        @manageSubscriptions="$emit('openQueueConfigPanel', { queueId: queue.id })"
        @updateFilter="($event) => $emit('updateFilter', $event)"
        @showSubscriptionMetrics="
          ($event) => $emit('openSubscriptionMetrics', $event)
        "
      />
    </v-hover>
  </v-sheet>
</template>

<script>
import QueueCard from "@/components/queue/QueueCard.vue";

import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composable/useNotifications";
import { useQueues } from "@/composable/useQueues";

import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "QueueCardSheet",
  components: {
    QueueCard,
  },
  mixins: [spacingMixin],
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [
    "selectQueue",
    "openQueueConfigPanel",
    "updateFilter",
    "openSubscriptionMetrics", 
  ],
  setup(props) {
    const { t } = useI18n();
    const { shouldShowAlert, dismissAlert } = useNotifications();
    const { queueStore } = useQueues(props);

    return {
      t,
      shouldShowAlert,
      dismissAlert,
      queueStore,
    };
  },
};
</script>

<style scoped>
/** has references */
.selected-queue {
  border: 1px solid !important;
  background-color: lightgreen;
}
</style>
