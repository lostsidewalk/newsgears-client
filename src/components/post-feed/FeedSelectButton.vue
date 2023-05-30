<template>
  <v-card
    :variant="variant" 
    :ripple="false"
  >
    <!-- feed name -->
    <v-card-title>
      {{ feed.label }}
    </v-card-title>
    <v-card-subtitle v-if="feed.description">
      {{ feed.description }}
    </v-card-subtitle>
    <v-card-text>
      <v-chip-group>
        <v-chip
          label
          size="x-large"
          variant="text"
          :ripple="false"
        >
          <v-icon
            start
            icon="fa-eye"
          /> 
          {{ inboundCount }}
        </v-chip>
        <v-chip
          label
          size="x-large"
          variant="text"
          :ripple="false"
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
        :disabled="!isSelected"
        density="compact"
        variant="text"
        :size="buttonSize" 
        :text="feed.subscriptions && feed.subscriptions.length > 0 ? $t('manageSubscriptions') : $t('addSubscriptions')"
        @click.stop="$emit('manageSubscriptions')"
      />
      <!-- show/hide feed details -->
      <v-btn
        v-if="feed.subscriptions && feed.subscriptions.length > 0"
        :disabled="!isSelected"
        density="compact"
        variant="text"
        :size="buttonSize" 
        :text="showMoreInformation ? $t('hideMoreInfo') : $t('showMoreInfo')"
        @click.stop="showMoreInformation = !showMoreInformation"
      />
    </v-btn-group>
    <v-expand-transition>
      <FeedDetails 
        v-if="showMoreInformation"
        :subscriptions="feed.subscriptions" 
        :json-pub-url="feedUrl + '/feed/json/' + feed.transportIdent" 
        :rss-pub-url="feedUrl + '/feed/rss/' + feed.transportIdent" 
        :atom-pub-url="feedUrl + '/feed/atom/' + feed.transportIdent" 
        @updatePostFeedFilter="$event => $emit('updatePostFeedFilter', $event)"
        @showSubscriptionMetrics="$event => $emit('showSubscriptionMetrics', $event)"
      />
    </v-expand-transition>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

import FeedDetails from '@/components/post-feed/FeedDetails.vue';

export default {
  name: "FeedSelectButton",
  components: {
    FeedDetails,
  },
  mixins: [buttonSizeMixin], 
  props: {
    feed: { type: Object, required: true },
    feedUrl: { type: String, required: true },
    inboundCount: { type: Number, required: true },
    publishedCount: { type: Number, required: true },
    variant: { type: String, default: null },
    isSelected: { type: Boolean, default: false },
  },
  emits: [ "selectFeed", "manageSubscriptions", "updatePostFeedFilter", "showSubscriptionMetrics" ],
  data() {
    return {
      showMoreInformation: false,
    }
  },
}
</script>
