<template>
  <v-card
    color="transparent"
    elevation="0"
    align="left"
    justify="left"
  >
    <v-card-title>
      <v-img
        v-for="thumbnail of metadata.thumbnails"
        :key="thumbnail" 
        :src="thumbnail.url" 
        :alt="$t('postMediaThumbnail')" 
        max-height="140"
        max-width="140"
        width="140"
      />
    </v-card-title>
    <v-card-text v-if="metadata.desc">
      <pre style="white-space: pre-line;">{{ metadata.desc }}</pre>
    </v-card-text>
    <PostMediaCommunity
      v-if="metadata.community"
      class="pa-2"
      :community="metadata.community"
    />
  </v-card>
</template>

<script>
import PostMediaCommunity from '@/components/post/PostMediaCommunity.vue';

export default {
  name: "PostMediaMetadata",
  components: {
    PostMediaCommunity,
  },
  props: {
    metadata: { type: Object, required: true },
  },
}
</script>
