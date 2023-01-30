<template>
  <div>
    <div>
      <span v-if="this.community.postMediaStarRating.average">
        <i v-for="i in starCount" :key="i" 
          class="fa fa-1x" 
          :class="i <= this.community.postMediaStarRating.average ? 'fa-star star-colored' : 'fa-star-o'"/> 
        {{ this.community.postMediaStarRating.average }}
      </span>
      <span v-if="this.community.postMediaStatistics.views">
        ({{ this.community.postMediaStatistics.views }} VIEWS)
      </span>
      <span v-if="this.community.postMediaTags">
        TAGS
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostMediaCommunity",
  props: ["community", "inTransit", "theme"],
  components: {

  },
  computed: {
    starCount: function() {
      return Math.min(this.community.postMediaStarRating.max, 10);
    }
  },
  mounted() {
    // console.log("post-media-community: community=" + JSON.stringify(this.community));
  }
}
</script>

<style scoped>

/* has references */
.star-colored {
  color: v-bind('theme.starcolor');
}

</style>
