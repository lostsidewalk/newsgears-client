<template>
  <v-card variant="tonal">
    <v-card-title v-if="this.community.postMediaStarRating.average">
      <v-icon v-for="i in starCount" :key="i" 
        :class="{ 'star-colored': i <= this.community.postMediaStarRating.average }"
        :icon="i <= this.community.postMediaStarRating.average ? 'fa-star' : 'fa-star-o'"/> 
      {{ this.community.postMediaStarRating.average }}
    </v-card-title>
    <v-card-subtitle v-if="this.community.postMediaStatistics.views">
      ({{ this.community.postMediaStatistics.views }} {{ this.$t('nViews') }})
    </v-card-subtitle>
    <v-divider v-if="this.community.postMediaTags" />
    <v-card-text v-if="this.community.postMediaTags">
      {{ this.$t('tags') }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PostMediaCommunity",
  props: [ "community", "theme" ],
  components: {

  },
  computed: {
    starCount: function() {
      return Math.min(this.community.postMediaStarRating.max, 10);
    }
  },
}
</script>
