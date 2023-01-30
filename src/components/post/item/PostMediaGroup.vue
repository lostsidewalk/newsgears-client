<template>
  <div>
    <PostMediaMetadata v-if="isUseableMetadata(this.mediaGroup.postMediaMetadata)" 
      :inTransit="inTransit" 
      :theme="theme" 
      :metadata="this.mediaGroup.postMediaMetadata" />
    <div v-if="this.mediaGroup.postMediaContents && this.showContents" 
      class="post-media-group-contents">
      <PostMediaContent v-for="mc of this.mediaGroup.postMediaContents" :key="mc" 
        :inTransit="inTransit" 
        :theme="theme" 
        :mediaContent="mc" />
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';

export default {
  name: "PostMediaGroup",
  props: ["inTransit", "theme", "mediaGroup"],
  components: {
    PostMediaMetadata,
    PostMediaContent,
  },
  mounted() {
    // console.log("post-media-group: mediaGroup=" + JSON.stringify(this.mediaGroup));
  },
  methods: {
    isUseableMetadata(metadata) {
      return metadata.thumbnails && metadata.thumbnails.length > 0;
    },
  },
  data() {
    return {
      showContents: true,
    }
  }
}
</script>

<style scoped>
.post-media-group-contents {
  display: grid;
  grid-auto-flow: column;
  gap: 40px;
}
</style>
