<template>
  <v-card
    :variant="variant"
    :ripple="false"
  >
    <!-- queue name -->
    <v-card-title>
      {{ queue.title }}
    </v-card-title>
    <v-card-subtitle v-if="queue.description">
      {{ queue.description }}
    </v-card-subtitle>
    <v-card-subtitle>
      {{ $t("nTotalArticlesInQueue", { n: totalCount }) }}
    </v-card-subtitle>
    <v-card-text>
      <!-- TODO: extract lesser queue properties component -->
      <v-chip-group>
        <!-- unread count -->
        <v-chip
          :title="$t('unreadCount', { n: unreadCount })"
          @click="
            $emit('updateFilter', {
              name: 'mode',
              value: 'UNREAD',
              queueId: queue.id,
            })
          "
        >
          <v-icon
            start
            icon="fa-eye"
          />
          {{ unreadCount }}
        </v-chip>
        <!-- read count -->
        <v-chip
          :title="$t('readCount', { n: readCount })"
          @click="
            $emit('updateFilter', {
              name: 'mode',
              value: 'READ',
              queueId: queue.id,
            })
          "
        >
          <v-icon
            start
            icon="fa-check-square-o"
          />
          {{ readCount }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider />
    <v-btn-group class="d-flex flex-wrap">
      <!-- add/manage subscriptions -->
      <v-btn
        density="compact"
        variant="text"
        :size="buttonSize"
        :text="
          queue.subscriptions && queue.subscriptions.length > 0
            ? $t('manageSubscriptions', { ct: queue.subscriptions.length })
            : $t('addSubscriptions')
        "
        @click.stop="$emit('manageSubscriptions')"
      />
      <!-- show/hide queue details -->
      <v-btn
        v-if="queue.subscriptions && queue.subscriptions.length > 0"
        density="compact"
        variant="text"
        :size="buttonSize"
        :text="showMoreInformation ? $t('hideMoreInfo') : $t('showMoreInfo')"
        @click.stop="showMoreInformation = !showMoreInformation"
      />
      <!-- select queue -->
      <v-btn
        density="compact"
        variable="text"
        :size="buttonSize"
        :text="$t('selectQueue')"
        @click.stop="$emit('selectQueue')"
      />
    </v-btn-group>
    <v-expand-transition>
      <QueueDetails
        v-if="showMoreInformation"
        :recent-article-list="recentArticleList"
        :subscriptions="queue.subscriptions"
        @updateFilter="($event) => $emit('updateFilter', $event)"
        @showSubscriptionMetrics="
          ($event) => $emit('showSubscriptionMetrics', $event)
        "
      />
    </v-expand-transition>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import { useQueues } from "@/composable/useQueues";

import buttonSizeMixin from "@/mixins/buttonSizeMixin";

import QueueDetails from "./QueueDetails.vue";

export default {
  name: "QueueCard",
  components: {
    QueueDetails,
  },
  mixins: [buttonSizeMixin],
  props: {
    queue: { type: Object, required: true },
    variant: { type: String, default: null },
  },
  emits: [
    "updateFilter",
    "manageSubscriptions",
    "selectQueue",
    "showSubscriptionMetrics",
  ],
  setup(props) {
    const { queueStore } = useQueues(props);

    const showMoreInformation = ref(false);

    const unreadCount = computed(() => {
      let q = queueStore.articleListsByQueue[props.queue.id];
      return q ? q.values.filter((post) => !post.isRead).length : 0;
    });

    const readCount = computed(() => {
      let q = queueStore.articleListsByQueue[props.queue.id];
      return q ? queueStore.articleListsByQueue[props.queue.id].values.filter((post) => post.isRead).length : 0;
    });

    const totalCount = computed(() => {
      let q = queueStore.articleListsByQueue[props.queue.id];
      return q ? queueStore.articleListsByQueue[props.queue.id].values.length : 0;
    });

    const mostRecentArticle = computed(() => {
      let q = queueStore.articleListsByQueue[props.queue.id];
      return q ? queueStore.articleListsByQueue[props.queue.id].values[0] : null;
    });

    const recentArticleList = computed(() => {
      let recentArticles = [];
      let q = queueStore.articleListsByQueue[props.queue.id];
      // TODO: fix this, we need to copy/sort articleList by timestamp desc before we do this
      if (q) {
        for (let i = 0; i < q.values.length; i++) {
          let a = q.values[i];
          // t/f if the article has a non-empty title property
          let hasTitle =
            a.postTitle != null &&
            a.postTitle.value &&
            a.postTitle.value.length > 0;
          // t/f if the article has a non-empty HTML title
          let isHtmlTitle =
            hasTitle &&
            a.postTitle.type != null &&
            a.postTitle.type.toLowerCase().indexOf("html") >= 0;
          // t/f if the article has a non-empty description property
          let hasDesc =
            a.postDesc != null &&
            a.postDesc.value &&
            a.postDesc.value.length > 0;
          // t/f if the article has a non-empty HTML description
          let isHtmlDesc =
            hasDesc &&
            a.postDesc.type != null &&
            a.postDesc.type.toLowerCase().indexOf("html") >= 0;

          if ((hasTitle && !isHtmlTitle) || (hasDesc && !isHtmlDesc)) {
            recentArticles.push(a);
          }
          if (recentArticles.length == 5) {
            break;
          }
        }
      }
      return recentArticles;
    });

    const articleList = computed(() => {
      return queueStore.articleListsByQueue[props.queue.id];
    });

    return {
      showMoreInformation,
      // 
      unreadCount,
      readCount,
      totalCount,
      mostRecentArticle, 
      recentArticleList,
      articleList,
    };
  },
};
</script>
