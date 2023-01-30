<template>
  <div class="post-media-metadata">
    <img v-for="thumbnail of this.metadata.thumbnails" :key="thumbnail" 
      :src="thumbnail.url" 
      style="display: block" 
      class="post-media-metadata-thumbnail">
    <div>
      <PostMediaCommunity v-if="this.metadata.community" :community="this.metadata.community" :inTransit="inTransit" :theme="theme" />
      <pre>{{ this.metadata.desc }}</pre>
    </div>
</div>
</template>

<script>
import PostMediaCommunity from './PostMediaCommunity.vue';
// let MarkdownIt = require('markdown-it')
// const md = new MarkdownIt();

export default {
  name: "PostMediaMetadata",
  props: ["inTransit", "theme", "metadata"],
  components: {
    PostMediaCommunity,
  },
  mounted() {
    // console.log("post-media-metadata: metadata=" + JSON.stringify(this.metadata));
  },
  methods: {
    // renderMarkdown() {
    //   return md.render(this.metadata.description);
    // }
  }
}
</script>

<style scoped>
p {
  margin: 0px;
}

pre {
  font-family: system-ui, system-ui, sans-serif
}

.post-media-metadata {
  display: flex;
  flex-direction: row;
  gap: 5px;
  max-width: fit-content;
  padding-top: 10px;
  padding-bottom: 10px;
  /* cursor: pointer; */
  /* user-select: none; */
}

.post-media-metadata > label {
  font-size: small;
  padding-bottom: 3px;
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
