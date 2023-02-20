<template>
  <div class="post-media-metadata">
    <img v-for="thumbnail of this.metadata.thumbnails" :key="thumbnail" 
      :src="thumbnail.url" 
      style="display: block" 
      class="post-media-metadata-thumbnail">
    <div>
      <PostMediaCommunity v-if="this.metadata.community" :community="this.metadata.community" :theme="theme" />
      <pre>{{ this.metadata.desc }}</pre>
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
  mounted() {
    // console.log("post-media-metadata: metadata=" + JSON.stringify(this.metadata));
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
  font-family: system-ui, system-ui, sans-serif
}

.post-media-metadata {
  display: flex;
  flex-direction: row;
  gap: .31rem;
  max-width: fit-content;
  padding-top: .75rem;
  padding-bottom: .75rem;
  /* cursor: pointer; */
  /* user-select: none; */
}

.post-media-metadata > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.post-media-metadata-thumbnail {
  max-width: 70px;
  max-height: 70px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
}
</style>
