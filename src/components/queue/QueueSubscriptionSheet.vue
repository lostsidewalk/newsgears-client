<template>
  <v-navigation-drawer
    elevation="12"
  >
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
    <v-list
      v-for="item in dataTableItems"
      :key="item"
      nav
    >
      <v-list-item>
        <v-label class="mx-2 font-weight-bold">
          {{ item.queueTitle }}
        </v-label>
      </v-list-item>
      <v-list-item
        v-for="subscription in item.subscriptions"
        :key="subscription"
        @click.stop="$emit('updateFilter', {
          name: 'subscription',
          queueId: subscription.subscription.queueId,
          value: subscription.subscription.id,
        })"
      >
        <!-- <div> -->
        <div
          class="d-flex flex-row flex-wrap gap-1"
          :class="my4r"
        >
          <v-img
            v-if="subscription.subscription.image"
            class="rounded h-auto" 
            :src="subscription.subscription.image.url" 
            :title="subscription.subscription.image.title" 
            :alt="$t('feedLogoImage')" 
            contain
            max-height="64px"
            max-width="64px"
          />
          <v-img
            v-else-if="subscription.subscription.icon"
            class="rounded h-auto" 
            :src="subscription.subscription.icon.url" 
            :title="subscription.subscription.icon.title" 
            :alt="$t('feedLogoImage')" 
            contain
            max-height="64px"
            max-width="64px"
          />
          <v-img
            v-else
            class="rounded h-auto" 
            src="rss_logo.svg"
            :alt="$t('rssLogo')"
            contain
            max-height="64px"
            max-width="64px"
          />
          <div
            class="d-flex flex-column"
          >
            <v-label class="font-size-smaller font-weight-bold text-wrap">
              {{ subscription.subscription.title }}
            </v-label>
            <v-label class="font-size-smaller">
              {{ 'Id: ' + subscription.subscription.id }}
            </v-label>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { computed } from "vue";

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
      dataTableItems,
    };
  },
};
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}

.font-size-smaller {
  font-size: smaller;
}

.text-wrap {
  white-space: text-wrap;
}
</style>