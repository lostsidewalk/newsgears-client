<template>
  <v-card
    :key="feed.value"
    :variant="variant" 
    :value="feed.value"
  >
    <!-- feed name -->
    <v-card-title>
      {{ feed.label }}
    </v-card-title>
    <v-card-subtitle v-if="feed.description">
      {{ feed.description }}
    </v-card-subtitle>
    <v-card-text>
      <v-img
        v-if="feed.imgSrc" 
        class="feed-image"
        :src="'data:image/png;base64,' + feed.imgSrc" 
        :alt="$t('queueLogoImage')" 
        max-height="32"
        max-width="32"
        width="32"
      />
      <v-chip-group>
        <v-chip
          label
          variant="text"
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
              size="small"
              :text="feed.rssAtomFeedUrls && feed.rssAtomFeedUrls.length > 0 ? $t('manageSubscriptions') : $t('addSubscriptions')"
              @click.stop="$emit('manageSubscriptions')"
            />
          </v-col>
          <v-col>
            <!-- show/hide feed details -->
            <v-btn
              block
              variant="tonal"
              size="small"
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
import FeedDetails from '@/components/post-feed/FeedDetails.vue';

export default {
  name: "FeedSelectButton",
  components: {
    FeedDetails,
  },
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
  }
}
</script>
