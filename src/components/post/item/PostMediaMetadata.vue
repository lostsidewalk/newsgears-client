<template>
  <div class="post-media-metadata">
    <img v-for="thumbnail of this.metadata.thumbnails" :key="thumbnail" 
      :src="thumbnail.url" 
      style="display: block" 
      class="post-media-metadata-thumbnail"
      :alt="this.$t('postMediaThumbnail')" 
      loading="lazy" 
      height="140" />
    <div>
      <PostMediaCommunity v-if="this.metadata.community" :community="this.metadata.community" :theme="theme" />
      <pre style="white-space: pre-line;">{{ this.metadata.desc }}</pre>
    </div>
</div>
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

<style scoped>
p {
  margin: 0rem;
}

pre {
  font-family: 'Merriweather', system-ui, system-ui, sans-serif
}

.post-media-metadata {
  display: flex;
  flex-direction: row;
  gap: .44rem;
  max-width: fit-content;
  padding-top: .75rem;
  padding-bottom: .75rem;
  flex-wrap: wrap;
}

.post-media-metadata > img {
  object-fit: scale-down;
  background-color: currentColor;
}

.post-media-metadata > label {
  padding-bottom: .125rem;
}

.post-media-metadata-thumbnail {
  max-width: 140px;
  max-height: 140px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
}
</style>
