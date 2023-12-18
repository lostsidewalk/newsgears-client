<template>
  <v-sheet>
    <v-alert
      v-if="shouldShowAlert('theseAreAllOfYourSubscriptions')"
      closable
      variant="outlined"
      border="top"
      icon="fa-question-circle"
      :text="t('theseAreAllOfYourSubscriptions')"
      :class="ma4r"
      @click.close="dismissAlert('theseAreAllOfYourSubscriptions')"
    />
    <v-data-table
      class="overflow-auto flex-grow-1"
      :headers="headers"
      :items="dataTableItems"
      item-value="subscriptions"
      :expanded="expanded"
      :show-expand="true"
      :expand-on-click="true"
      items-per-page="-1"
      density="compact"
      hover
    >
      <template #expanded-row="{ item }">
        <tr
          v-for="subscription in item.subscriptions"
          :key="subscription"
          class="clickable"
          @click.stop="$emit('updateFilter', {
            name: 'subscription',
            queueId: subscription.subscription.queueId,
            value: subscription.subscription.title,
          })"
        >
          <td>
            <div class="d-flex flex-row">
              <v-icon
                :size="buttonSize"
                icon="fa-rss"
                class="mx-2"
              />
              <span>{{ subscription.subscription.title }}</span>
            </div>
          </td>
          <td>
            {{ subscription.unreadCount }}
          </td>
          <td>
            {{ subscription.readCount }}
          </td>
          <td>
            {{ subscription.totalCount }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import { reactive, computed } from "vue";

import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composable/useNotifications";
import { useQueues } from "@/composable/useQueues";

import spacingMixin from "@/mixins/spacingMixin";
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueSubscriptionSheet",
  mixins: [spacingMixin, buttonSizeMixin],
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
        if (a) {
          for (let j = 0; j < a.values.length; j++) {
            const subId = a.values[j].subscriptionId;

            if (bySub[subId.toString()] === undefined) {
              bySub[subId.toString()] = [];
            }

            const l = bySub[subId.toString()];
            l.push(a.values[j]);
          }
        }
      }

      return bySub;
    });


    const expanded = reactive([]);

    const headers = computed(() => {
      return [
        { title: t('queueTitle'), value: 'queueTitle' },
        { title: t('unreadCount'), value: 'unreadCount' },
        { title: t('readCount'), value: 'readCount' },
        { title: t('totalCount'), value: 'totalCount' },
      ];
    });

    /**
     * INTERMEDIATE: 
     * 
     * {
     *   1: 
     *     [
     *       {
     *         subscription: subscription1, 
     *         unreadCount: 1, 
     *         readCount: 2, 
     *         totalCount: 3, 
     *       },
     *       {
     *         subscription: subscription2, 
     *         unreadCount: 2, 
     *         readCount: 3, 
     *         totalCount: 5, 
     *       },
     *     ],
     *   2: 
     *     [
     *       {
     *         subscription: subscription3, 
     *         unreadCount: 1, 
     *         readCount: 2, 
     *         totalCount: 3, 
     *       },
     *     ],
     *   ],
     * }
     * 
     * DATA TABLE ITEMS: 
     * 
     * [
     *   {
     *     queueId: 1,
     *     subscriptions: 
     *       [
     *         {
     *           subscription: subscription1, 
     *           unreadCount: 1, 
     *           readCount: 2, 
     *           totalCount: 3, 
     *         },
     *         {
     *           subscription: subscription2, 
     *           unreadCount: 2, 
     *           readCount: 3, 
     *           totalCount: 5, 
     *         },
     *       ],
     *   },
     *   {
     *     queueId: 2,
     *     subscriptions: 
     *       [
     *       ],
     *   },
     * ]
     */
    const dataTableItems = computed(() => {
      // 
      let dataTableItems = [];
      // 
      let intermediate = {};
      for (let i = 0; i < queueStore.allSubscriptions.length; i++) {
        // 
        let subscription = queueStore.allSubscriptions[i];
        // 
        let unreadCount = articleListsBySubscription.value[subscription.id] ?
          articleListsBySubscription.value[subscription.id].filter((post) => !post.isRead).length : 0;
        let readCount = articleListsBySubscription.value[subscription.id] ?
          articleListsBySubscription.value[subscription.id].filter((post) => post.isRead).length : 0;
        let totalCount = articleListsBySubscription.value[subscription.id] ?
          articleListsBySubscription.value[subscription.id].length : 0;
        // 
        let m = intermediate[subscription.queueId];
        if (!m) {
          m = [];
          intermediate[subscription.queueId] = m;
        }
        // 
        m.push({
          subscription,
          unreadCount,
          readCount,
          totalCount
        });
      }

      let queues = queueStore.queues;

      let keys = Object.keys(intermediate);
      for (let i = 0; i < keys.length; i++) {
        // 
        let queueId = parseInt(keys[i]);
        // 
        let queue = queues.filter(q => q.id === queueId)[0];
        // 
        let unreadCount = queueStore.articleListsByQueue[queueId] ?
          queueStore.articleListsByQueue[queueId].values.filter((post) => !post.isRead).length :
          0;
        let readCount = queueStore.articleListsByQueue[queueId] ?
          queueStore.articleListsByQueue[queueId].values.filter((post) => post.isRead).length :
          0;
        let totalCount = queueStore.articleListsByQueue[queueId] ?
          queueStore.articleListsByQueue[queueId].values.length :
          0;
        let queueObject = {
          queueId,
          queueIdent: queue.ident, 
          queueTitle: queue.title, 
          unreadCount,
          readCount,
          totalCount,
          subscriptions: [],
        };
        // 
        let j = intermediate[queueId];
        for (let k = 0; k < j.length; k++) {
          queueObject.subscriptions.push(j[k]);
        }
        dataTableItems.push(queueObject);
      }

      return dataTableItems;
    });

    return {
      t,
      shouldShowAlert,
      dismissAlert,
      expanded,
      headers,
      dataTableItems,
    };
  },
};
</script>
