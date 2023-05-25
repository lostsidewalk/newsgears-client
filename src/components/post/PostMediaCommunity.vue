<template>
  <v-card
    color="transparent"
    elevation="0"
  >
    <v-card-title v-if="community.postMediaStarRating.average">
      <v-icon
        v-for="i in starCount"
        :key="i" 
        :class="{ 'star-colored': i <= community.postMediaStarRating.average }"
        :icon="i <= community.postMediaStarRating.average ? 'fa-star' : 'fa-star-o'"
      /> 
      {{ community.postMediaStarRating.average }}
    </v-card-title>
    <v-card-subtitle v-if="community.postMediaStatistics.views">
      ({{ community.postMediaStatistics.views }} {{ $t('nViews') }})
    </v-card-subtitle>
    <v-divider v-if="community.postMediaTags" />
    <v-card-text v-if="community.postMediaTags">
      {{ $t('tags') }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PostMediaCommunity",
  components: {

  },
  props: {
    community: { type: Object, required: true },
  },
  computed: {
    starCount: function() {
      return Math.min(this.community.postMediaStarRating.max, 10);
    }
  },
}
</script>
