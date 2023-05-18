<template>
  <v-card variant="outlined" align="left" justify="left">
    <v-card-title>
      <v-img v-for="thumbnail of this.metadata.thumbnails" :key="thumbnail" 
        :src="thumbnail.url" 
        :alt="this.$t('postMediaThumbnail')" 
        max-height="140" max-width="140" width="140" />
    </v-card-title>
    <v-card-text v-if="this.metadata.desc">
      <pre style="white-space: pre-line;">{{ this.metadata.desc }}</pre>
    </v-card-text>
    <v-card-actions v-if="this.metadata.community">
      <PostMediaCommunity class="pa-2 w-100" :community="this.metadata.community" :theme="theme" />
    </v-card-actions>
  </v-card>
</template>

<script>
import PostMediaCommunity from './PostMediaCommunity.vue';

export default {
  name: "PostMediaMetadata",
  props: [ "theme", "metadata" ],
  components: {
    PostMediaCommunity,
  },
  methods: {
  }
}
</script>
