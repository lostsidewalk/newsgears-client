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
      {{ $t('nTotalArticlesInQueue', { n: totalCount }) }}
    </v-card-subtitle>
    <v-card-text>
      <v-chip-group>
        <!-- unread count -->
        <v-chip
          :title="$t('unreadCount', { n: unreadCount })"
          @click="$emit('updateFilter', { name: 'mode', value: 'UNREAD' })"
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
          @click="$emit('updateFilter', { name: 'mode', value: 'READ' })"
        >
          <v-icon
            start
            icon="fa-check-square-o"
          /> 
          {{ readCount }}
        </v-chip>
        <!-- published count -->
        <v-chip
          :title="$t('publishedCount', { n: publishedCount })"
          @click="$emit('updateFilter', { name: 'mode', value: 'STARRED' })"
        >
          <v-icon
            start
            icon="fa-star"
          /> 
          {{ publishedCount }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider />
    <v-btn-group>
      <!-- add/manage subscriptions -->
      <v-btn
        density="compact"
        variant="text"
        :size="buttonSize" 
        :text="queue.subscriptions && queue.subscriptions.length > 0 ? $t('manageSubscriptions', { ct: queue.subscriptions.length }) : $t('addSubscriptions')"
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
    </v-btn-group>
    <v-expand-transition>
      <QueueDetails 
        v-if="showMoreInformation"
        :recent-article-list="recentArticleList"
        :subscriptions="queue.subscriptions" 
        :json-pub-url="feedUrl + '/feed/json/' + queue.transportIdent" 
        :rss-pub-url="feedUrl + '/feed/rss/' + queue.transportIdent" 
        :atom-pub-url="feedUrl + '/feed/atom/' + queue.transportIdent" 
        @updateFilter="$event => $emit('updateFilter', $event)"
        @showSubscriptionMetrics="$event => $emit('showSubscriptionMetrics', $event)"
      />
    </v-expand-transition>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

import QueueDetails from '@/components/queue/QueueDetails.vue';

export default {
  name: "QueueSelectButton",
  components: {
    QueueDetails,
  },
  mixins: [buttonSizeMixin], 
  props: {
    queue: { type: Object, required: true },
    articleList: { type: Object, default: null },
    feedUrl: { type: String, required: true },
    variant: { type: String, default: null },
    isSelected: { type: Boolean, default: false },
  },
  emits: [ 
    "selectQueue", 
    "manageSubscriptions", 
    "updateFilter", 
    "showSubscriptionMetrics" 
  ],
  data() {
    return {
      showMoreInformation: false,
    }
  },
  computed: {
    unreadCount: function () {
      return this.articleList ? this.articleList.values.filter((post) => !post.isRead).length : 0;
    },
    readCount : function() {
      return this.articleList ? this.articleList.values.filter((post) => post.isRead).length : 0;
    },
    totalCount: function () {
      return this.articleList ? this.articleList.values.length : 0;
    },
    publishedCount: function () {
      return this.articleList ? this.articleList.values.filter((post) => post.isPublished).length : 0;
    },
    mostRecentArticle: function () {
      if (this.articleList) {
        return this.articleList.values[0];
      }
      return null;
    },
    recentArticleList: function() {
      if (this.articleList) {
        return this.articleList.values.slice(0, 5);
      }
      return [];
    }
  },
}
</script>
