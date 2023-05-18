<template>
  <v-card :variant="variant"
    :value="feed.value" 
    :key="feed.value">
    <!-- feed name -->
    <v-card-title>
      {{ feed.label }}
    </v-card-title>
    <v-card-subtitle v-if="feed.description">
      {{ feed.description }}
    </v-card-subtitle>
    <v-card-text>
      <v-img v-if="feed.imgSrc" 
        class="feed-image"
        :src="'data:image/png;base64,' + feed.imgSrc" 
        :alt="this.$t('queueLogoImage')" 
        max-height="32" max-width="32" width="32" />
      <v-chip-group>
        <v-chip label variant="text">
          <v-icon start icon="fa-eye" /> 
          {{ this.inboundCount }}
        </v-chip>
        <v-chip label variant="text">
          <v-icon start icon="fa-star" /> 
          {{ this.publishedCount }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-container>
        <v-row dense>
          <v-col>
            <!-- add/manage subscriptions -->
            <v-btn @click.stop="this.$emit('manageSubscriptions')" block
              variant="tonal"
              size="small"
              :text="feed.rssAtomFeedUrls && feed.rssAtomFeedUrls.length > 0 ? this.$t('manageSubscriptions') : this.$t('addSubscriptions')" />
          </v-col>
          <v-col>
            <!-- show/hide feed details -->
            <v-btn @click.stop="this.showMoreInformation = !this.showMoreInformation" block
              variant="tonal"
              size="small"
              :text="this.showMoreInformation ? this.$t('hideMoreInfo') : this.$t('showMoreInfo')" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
    <v-expand-transition>
      <FeedDetails 
          v-if="this.showMoreInformation"
          :rssAtomFeedUrls="feed.rssAtomFeedUrls" 
          :jsonPubUrl="this.feedUrl + '/feed/json/' + feed.transportIdent" 
          :rssPubUrl="this.feedUrl + '/feed/rss/' + feed.transportIdent" 
          :atomPubUrl="this.feedUrl + '/feed/atom/' + feed.transportIdent" 
          :theme="theme" 
          @updatePostFeedFilter="$event => this.$emit('updatePostFeedFilter', $event)" />
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
  props: [ "feed", "feedUrl", "inboundCount", "publishedCount", "theme", "variant" ],
  emits: [ "selectFeed", "manageSubscriptions", "updatePostFeedFilter" ],
  data() {
    return {
      showMoreInformation: false,
    }
  }
}
</script>
