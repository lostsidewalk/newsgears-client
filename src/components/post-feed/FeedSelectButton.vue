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
    <v-card-actions>
      <v-container>
        <v-row dense>
          <v-col>
            <!-- add/manage subscriptions -->
            <v-btn
              block
              variant="tonal"
              :size="buttonSize" 
              :text="feed.rssAtomFeedUrls && feed.rssAtomFeedUrls.length > 0 ? $t('manageSubscriptions') : $t('addSubscriptions')"
              @click.stop="$emit('manageSubscriptions')"
            />
          </v-col>
          <v-col v-if="feed.rssAtomFeedUrls && feed.rssAtomFeedUrls.length > 0">
            <!-- show/hide feed details -->
            <v-btn
              block
              variant="tonal"
              :size="buttonSize" 
              :text="showMoreInformation ? $t('hideMoreInfo') : $t('showMoreInfo')"
              @click.stop="showMoreInformation = !showMoreInformation"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
    <v-expand-transition>
      <FeedDetails 
        v-if="showMoreInformation"
        :rss-atom-feed-urls="feed.rssAtomFeedUrls" 
        :json-pub-url="feedUrl + '/feed/json/' + feed.transportIdent" 
        :rss-pub-url="feedUrl + '/feed/rss/' + feed.transportIdent" 
        :atom-pub-url="feedUrl + '/feed/atom/' + feed.transportIdent" 
         
        @updatePostFeedFilter="$event => $emit('updatePostFeedFilter', $event)"
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
  },
  emits: [ "selectFeed", "manageSubscriptions", "updatePostFeedFilter" ],
  data() {
    return {
      showMoreInformation: false,
    }
  },
}
</script>
