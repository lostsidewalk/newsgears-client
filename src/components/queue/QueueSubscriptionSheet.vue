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
    <v-table
      class="ma-4 overflow-auto flex-grow-1"
      fixed-header
    >
      <thead style="text-align: center">
        <th
          class="pa-1 h-auto"
          style="max-height: 70px; max-width: 70px"
        />
        <th class="pa-1">
&nbsp;
        </th>
        <!-- unread count -->
        <th class="pa-1">
          <v-icon
            :title="t('unreadCount', { n: 0 })"
            size="small"
            icon="fa-eye"
          />
        </th>
        <!-- read count -->
        <th class="pa-1">
          <v-icon
            :title="t('readCount', { n: 0 })"
            size="small"
            icon="fa-check-square-o"
          />
        </th>
        <!-- total count -->
        <th class="pa-1">
          <v-icon
            :title="t('totalCount', { n: 0 })"
            size="small"
            icon="fa-newspaper-o"
          />
        </th>
      </thead>
      <tbody style="text-align: left">
        <tr
          v-for="subscription in queueStore.allSubscriptions"
          :key="subscription"
        >
          <td
            style="text-align: center"
            class="pa-1"
          >
            <v-img
              v-if="subscription.icon"
              class="rounded h-auto"
              :src="subscription.icon.url"
              :title="subscription.icon.title"
              :alt="t('feedLogoImage')"
              contain
              style="max-height: 70px; max-width: 70px"
            />
            <v-img
              v-if="subscription.image && !subscription.icon"
              class="rounded h-auto"
              :src="subscription.image.url"
              :title="subscription.image.title"
              :alt="t('feedLogoImage')"
              contain
              style="max-height: 70px; max-width: 70px"
            />
            <v-img
              v-if="!subscription.image && !subscription.icon"
              class="rounded h-auto"
              src="rss_logo.svg"
              :alt="t('rssLogo')"
              contain
              style="max-height: 70px; max-width: 70px"
            />
          </td>
          <td>{{ subscription.title }}</td>
          <!-- unread count-->
          <td
            style="text-align: center"
            class="clickable"
            @click="$emit('showUnread', { subscription })"
          >
            {{
              articleListsBySubscription[subscription.id]
                ? articleListsBySubscription[subscription.id].filter(
                  (post) => !post.isRead
                ).length
                : 0
            }}
          </td>
          <!-- read count-->
          <td
            style="text-align: center"
            class="clickable"
            @click="$emit('showRead', { subscription })"
          >
            {{
              articleListsBySubscription[subscription.id]
                ? articleListsBySubscription[subscription.id].filter(
                  (post) => post.isRead
                ).length
                : 0
            }}
          </td>
          <!-- total count-->
          <td
            style="text-align: center"
            class="clickable"
            @click="$emit('showAll', { subscription })"
          >
            {{
              articleListsBySubscription[subscription.id]
                ? articleListsBySubscription[subscription.id].length
                : 0
            }}
          </td>
        </tr>
      </tbody>
    </v-table>
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

    return {
      t,
      shouldShowAlert,
      dismissAlert,
      queueStore,
      articleListsBySubscription,
    };
  },
};
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
