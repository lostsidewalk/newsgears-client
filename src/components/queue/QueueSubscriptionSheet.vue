<template>
  <v-sheet>
    <v-alert
      v-if="shouldShowAlert('theseAreAllOfYourSubscriptions')"
      closable
      variant="outlined"
      border="top"
      icon="fa-question-circle"
      :text="t('theseAreAllOfYourSubscriptions')"
      class="ma-4"
      @click.close="dismissAlert('theseAreAllOfYourSubscriptions')"
    />
    <v-data-table
      class="overflow-auto flex-grow-1"
      :headers="headers"
      :items="dataTableItems"
    />
  </v-sheet>
</template>

<script>
import { computed } from "vue";

import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composable/useNotifications";
import { useQueues } from "@/composable/useQueues";

export default {
  props: {
    baseUrl: { type: String, required: true },
  },
  setup(props) {
    const { t } = useI18n();
    const { shouldShowAlert, dismissAlert } = useNotifications();
    const { queueStore } = useQueues(props);

    const articleListsBySubscription = computed(() => {
      const bySub = {};

      for (let i = 0; i < queueStore.queues.length; i++) {
        const q = queueStore.queues[i];
        const a = queueStore.articleListsByQueue[q.id];

        for (let j = 0; j < a.values.length; j++) {
          const subId = a.values[j].subscriptionId;

          if (bySub[subId.toString()] === undefined) {
            bySub[subId.toString()] = [];
          }

          const l = bySub[subId.toString()];
          l.push(a.values[j]);
        }
      }

      return bySub;
    });

    const headers = computed(() => {
      return [
        { title: t('feedTitle'), value: 'feedTitle' },
        { title: t('unreadCount'), value: 'unreadCount' },
        { title: t('readCount'), value: 'readCount' },
        { title: t('totalCount'), value: 'totalCount' },
      ];
    });

    const dataTableItems = computed(() => {
      let dataTableItems = [];
      for (let i = 0; i < queueStore.allSubscriptions.length; i++) {
        let subscription = queueStore.allSubscriptions[i];

        let unreadCount = articleListsBySubscription.value[subscription.id] ?
          articleListsBySubscription.value[subscription.id].filter((post) => !post.isRead).length : 0;
        let readCount = articleListsBySubscription.value[subscription.id] ?
          articleListsBySubscription.value[subscription.id].filter((post) => post.isRead).length : 0;
        let totalCount = articleListsBySubscription.value[subscription.id] ?
          articleListsBySubscription.value[subscription.id].length : 0;

        dataTableItems.push({
          feedTitle: subscription.title,
          unreadCount: unreadCount,
          readCount: readCount,
          totalCount: totalCount,
        });
      }
      return dataTableItems;
    });

    return {
      t,
      shouldShowAlert,
      dismissAlert,
      queueStore,
      articleListsBySubscription,
      headers,
      dataTableItems,
    };
  },
};
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
